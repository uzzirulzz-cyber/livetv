export const PROVIDER_BROADCAST_PREFIX = "/broadcast-player";

type Dispatch = (request: Request) => Promise<Response>;

function providerPath(path: string, search: string): string {
  if (path === "/api/channels") return "/api/iptv/channels";

  const stream = path.match(/^\/stream\/(\d+)$/);
  if (stream && new URLSearchParams(search).get("hls") === "1") {
    return `/api/iptv/hls/stream.m3u8?channelId=${stream[1]}`;
  }

  if (path === "/broadcast/api/iptv/segment") {
    const url = new URLSearchParams(search).get("url");
    if (!url || url.length > 4096) throw new Error("Unsupported segment");
    const segment = new URL(url);
    if (
      segment.hostname !== "stream.playbeat.live" ||
      !["http:", "https:"].includes(segment.protocol) ||
      segment.username ||
      segment.password
    ) {
      throw new Error("Unsupported segment");
    }
    return `/api/iptv/segment?url=${encodeURIComponent(segment.href)}`;
  }

  throw new Error("Unsupported broadcast resource");
}

async function limitedText(response: Response, maxBytes: number): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = "";
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new Error("Broadcast metadata too large");
      }
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

/** Routes the public storefront contract to the private, credentialed IPTV Worker. */
export async function fetchStorefrontProviderBroadcast(
  request: Request,
  dispatch: Dispatch,
): Promise<Response> {
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Use GET or HEAD", { status: 405 });
  }

  const url = new URL(request.url);
  const path = url.pathname.slice(PROVIDER_BROADCAST_PREFIX.length);
  try {
    const upstreamPath = providerPath(path, url.search);
    const headers = new Headers({ Accept: "*/*" });
    for (const name of ["Range", "If-None-Match", "If-Modified-Since"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const upstream = await dispatch(
      new Request(`https://live-provider.internal${upstreamPath}`, {
        method: request.method,
        headers,
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(300000)]),
      }),
    );
    if (!upstream.ok && upstream.status !== 304) {
      await upstream.body?.cancel();
      return Response.json(
        { error: "This broadcast is temporarily unavailable." },
        { status: upstream.status === 404 ? 404 : 502 },
      );
    }

    const responseHeaders = new Headers(upstream.headers);
    for (const name of [
      "set-cookie",
      "content-length",
      "content-encoding",
      "access-control-allow-origin",
    ]) responseHeaders.delete(name);
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "no-referrer");

    if (request.method === "HEAD" || upstream.status === 304) {
      return new Response(null, { status: upstream.status, headers: responseHeaders });
    }

    if (path === "/api/channels") {
      const data = await limitedText(upstream, 4 * 1024 * 1024);
      const parsed = JSON.parse(data) as {
        success?: boolean;
        channels?: Array<{
          name?: string;
          group?: string;
          epgId?: string;
          streamId?: string;
        }>;
      };
      if (!parsed.success || !Array.isArray(parsed.channels)) {
        throw new Error("Invalid provider catalogue");
      }
      const channels = parsed.channels.flatMap((channel) => {
        const id = String(channel.streamId || "");
        if (!/^\d{1,18}$/.test(id)) return [];
        return [{
          id,
          name: channel.name || "Live channel",
          group: channel.group || "General",
          epgId: channel.epgId || "",
          logo: "",
          url: `${PROVIDER_BROADCAST_PREFIX}/stream/${id}?hls=1`,
        }];
      });
      return Response.json(
        { source: "configured-provider", total: channels.length, channels },
        { headers: { "Cache-Control": "public, max-age=60" } },
      );
    }

    // HLS manifests already contain same-origin segment bridge URLs; stream bodies
    // stay streamed so large media is never buffered in Worker memory.
    if (path.startsWith("/stream/") && url.searchParams.get("hls") === "1") {
      responseHeaders.set("Content-Type", "application/vnd.apple.mpegurl");
      responseHeaders.set("Cache-Control", "no-store");
      return new Response(await limitedText(upstream, 1024 * 1024), {
        status: upstream.status,
        headers: responseHeaders,
      });
    }

    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    const failure = error instanceof Error ? error.message : "Unknown failure";
    console.error(JSON.stringify({ event: "provider_broadcast_failed", failure }));
    return Response.json(
      { error: "Broadcast service unavailable. Please try again." },
      { status: 502 },
    );
  }
}

export function dispatchProviderBroadcast(env: { LIVE_PROVIDER?: { fetch(request: Request): Promise<Response> } }): Dispatch {
  const provider = env.LIVE_PROVIDER;
  if (!provider) throw new Error("Live provider binding is unavailable");
  return (request) => provider.fetch(request);
}

