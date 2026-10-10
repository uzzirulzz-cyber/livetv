import { test } from "node:test";
import assert from "node:assert/strict";
import {
  broadcastPath,
  fetchStorefrontBroadcast,
  rewriteBroadcastManifest,
} from "../src/worker/services/storefront-broadcast";
import { hlsFallbackForLiveStream, normalizeBroadcastChannel } from "../src/services/broadcastCatalog";

test("HLS segments, nested playlists, and key URIs stay on the storefront bridge", () => {
  const result = rewriteBroadcastManifest(
    '#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI="/media/key"\n/media/segment?token=abc\nhttps://player.playbeat.live/stream/4?hls=1\n',
    "https://player.playbeat.live/stream/3?hls=1",
  );
  assert.match(result, /URI="\/broadcast-player\/media\/key"/);
  assert.match(result, /\/broadcast-player\/media\/segment\?token=abc/);
  assert.match(result, /\/broadcast-player\/stream\/4\?hls=1/);
  assert.throws(() => broadcastPath("https://attacker.example/media/file"));
  assert.throws(() => broadcastPath("/admin"));
  assert.throws(() =>
    rewriteBroadcastManifest(
      "<html>error</html>",
      "https://player.playbeat.live/stream/3",
    ),
  );
});

test("raw bridged MPEG-TS channels can safely fall back to the same channel's HLS endpoint", () => {
  assert.equal(
    hlsFallbackForLiveStream("/broadcast-player/stream/732?token=abc", "https://playbeat.live"),
    "/broadcast-player/stream/732?token=abc&hls=1",
  );
  assert.equal(
    hlsFallbackForLiveStream("https://provider.example/private.ts", "https://playbeat.live"),
    null,
  );
  assert.equal(
    hlsFallbackForLiveStream("/api/proxy/other", "https://playbeat.live"),
    null,
  );
});

test("real live cinema stays live, gets the right category, and has no fabricated EPG", () => {
  const channel = normalizeBroadcastChannel(
    {
      id: "0",
      name: "Cinema FHD",
      group: "EN - 24x7 Hollywood - Exclusive",
      logo: "/broadcast-player/logo/0",
      url: "/broadcast-player/stream/0?hls=1",
    },
    0,
  );
  assert.equal(channel.isLive, true);
  assert.equal(channel.id, "vb_0");
  assert.equal(channel.category, "Movies");
  assert.equal(channel.currentProgram.progressPercentage, 0);
  assert.equal(channel.hlsUrl, "/broadcast-player/stream/0?hls=1");
});

test("rotating encrypted tokens retain stable HLS sequence pathnames", async () => {
  const rewrite = (token: string) =>
    rewriteBroadcastManifest(
      `#EXTM3U\n#EXT-X-MEDIA-SEQUENCE:32\n#EXTINF:10,\n/media/${token}\n#EXTINF:10,\n/media/next-${token}\n`,
      "https://player.playbeat.live/stream/474?hls=1",
    )
      .split("\n")
      .filter((line) => line && !line.startsWith("#"));
  const first = rewrite("original"),
    second = rewrite("refreshed");
  assert.equal(first[0].split("?")[0], second[0].split("?")[0]);
  assert.match(first[1], /segment-33\?/);
  let actual: Request | undefined;
  const response = await fetchStorefrontBroadcast(
    new Request("https://storefront.example" + second[0]),
    async (request) => {
      actual = request;
      return new Response(new Uint8Array([1, 2, 3]));
    },
  );
  assert.equal(response.status, 200);
  assert.equal(actual?.url, "https://player.playbeat.live/media/refreshed");
  assert.equal(actual?.redirect, "manual");
  const blocked = await fetchStorefrontBroadcast(
    new Request(
      "https://storefront.example/broadcast-player/media/stream-474-segment-32?resource=https%3A%2F%2Fattacker.example%2Fmedia%2Ffile",
    ),
    async () => {
      assert.fail("Must not dispatch a foreign resource");
    },
  );
  assert.equal(blocked.status, 502);
});

test("catalogue links are rewritten without exposing arbitrary metadata", async (context) => {
  context.mock.method(globalThis, "fetch", async () =>
    Response.json({
      source: "vb",
      channels: [
        {
          id: "0",
          name: "Cinema",
          group: "Movies",
          url: "/stream/0?hls=1",
          logo: "/logo/0",
          privateField: "hidden",
        },
      ],
    }),
  );
  const response = await fetchStorefrontBroadcast(
    new Request("https://storefront.example/broadcast-player/api/channels"),
  );
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.channels[0].url, "/broadcast-player/stream/0?hls=1");
  assert.equal(data.channels[0].logo, "/broadcast-player/logo/0");
  assert.equal(data.channels[0].privateField, undefined);
});

test("video payload is streamed with Range support and without client credentials", async (context) => {
  let upstreamRequest: Request | undefined;
  context.mock.method(globalThis, "fetch", async (request: Request) => {
    upstreamRequest = request;
    return new Response(new Uint8Array([1, 2, 3]), {
      status: 206,
      headers: { "Content-Type": "video/mp2t", "Content-Range": "bytes 0-2/3" },
    });
  });
  const response = await fetchStorefrontBroadcast(
    new Request("https://storefront.example/broadcast-player/media/segment", {
      headers: {
        Range: "bytes=0-2",
        Cookie: "private=session",
        Authorization: "Bearer secret",
      },
    }),
  );
  assert.equal(response.status, 206);
  assert.equal(new Headers(upstreamRequest?.headers).get("Range"), "bytes=0-2");
  assert.equal(new Headers(upstreamRequest?.headers).get("Cookie"), null);
  assert.equal(
    new Headers(upstreamRequest?.headers).get("Authorization"),
    null,
  );
  assert.equal(response.headers.get("Content-Range"), "bytes 0-2/3");
  assert.deepEqual(
    [...new Uint8Array(await response.arrayBuffer())],
    [1, 2, 3],
  );
});

test("invalid paths and unsupported methods never reach the broadcaster", async (context) => {
  let calls = 0;
  context.mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response("should not fetch");
  });
  assert.equal(
    (
      await fetchStorefrontBroadcast(
        new Request("https://storefront.example/broadcast-player/admin"),
      )
    ).status,
    502,
  );
  assert.equal(
    (
      await fetchStorefrontBroadcast(
        new Request(
          "https://storefront.example/broadcast-player/api/channels",
          { method: "POST" },
        ),
      )
    ).status,
    405,
  );
  assert.equal(calls, 0);
});

test("upstream errors return a safe error and cancel the response body", async (context) => {
  context.mock.method(
    globalThis,
    "fetch",
    async () => new Response("private origin failure", { status: 403 }),
  );
  const response = await fetchStorefrontBroadcast(
    new Request("https://storefront.example/broadcast-player/stream/1?hls=1"),
  );
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /private origin/);
});
