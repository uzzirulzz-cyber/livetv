import assert from "node:assert/strict";
import test from "node:test";
import { fetchStorefrontProviderBroadcast } from "../src/worker/services/storefront-provider-broadcast";

test("provider catalogue exposes local HLS routes and no provider URLs", async () => {
  let dispatched = "";
  const response = await fetchStorefrontProviderBroadcast(
    new Request("https://playbeat.live/broadcast-player/api/channels"),
    async (request) => {
      dispatched = new URL(request.url).pathname;
      return Response.json({ success: true, channels: [
        { name: "News", group: "UK - News", epgId: "news", streamId: "123" },
        { name: "Malformed", streamId: "unsafe/id" },
      ] });
    },
  );
  const body = await response.json() as { channels: Array<Record<string, string>> };
  assert.equal(dispatched, "/api/iptv/channels");
  assert.equal(body.channels.length, 1);
  assert.equal(body.channels[0].id, "123");
  assert.equal(body.channels[0].url, "/broadcast-player/stream/123?hls=1");
  assert.equal("streamId" in body.channels[0], false);
});

test("HLS requests map to the credentialed provider worker", async () => {
  let dispatched = "";
  const response = await fetchStorefrontProviderBroadcast(
    new Request("https://playbeat.live/broadcast-player/stream/456?hls=1"),
    async (request) => {
      dispatched = new URL(request.url).pathname + new URL(request.url).search;
      return new Response("#EXTM3U\n#EXTINF:5,\nhttps://playbeat.live/broadcast-player/broadcast/api/iptv/segment?url=x", {
        headers: { "Content-Type": "application/vnd.apple.mpegurl" },
      });
    },
  );
  assert.equal(dispatched, "/api/iptv/hls/stream.m3u8?channelId=456");
  assert.match(await response.text(), /broadcast\/api\/iptv\/segment/);
});

test("segment bridge rejects unconfigured hosts before dispatch", async () => {
  let dispatched = false;
  const response = await fetchStorefrontProviderBroadcast(
    new Request("https://playbeat.live/broadcast-player/broadcast/api/iptv/segment?url=" + encodeURIComponent("https://example.com/stream.ts")),
    async () => { dispatched = true; return new Response("unexpected"); },
  );
  assert.equal(response.status, 502);
  assert.equal(dispatched, false);
});

