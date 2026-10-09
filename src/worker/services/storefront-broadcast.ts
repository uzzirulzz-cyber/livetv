// Adapt the already deployed player without touching its Worker, playlist, or secrets.
export const BROADCAST_ORIGIN = "https://player.playbeat.live";
export const BROADCAST_PREFIX = "/broadcast-player";

export function broadcastPath(
  reference: string,
  base = BROADCAST_ORIGIN,
): string {
  const target = new URL(reference, base);
  if (
    target.origin !== BROADCAST_ORIGIN ||
    !/^\/(?:api\/channels|logo\/\d+|stream\/\d+|media\/[^/]+|epg\.xml)$/.test(
      target.pathname,
    )
  ) {
    throw new Error("Unsupported broadcast resource");
  }
  return BROADCAST_PREFIX + target.pathname + target.search;
}

export function rewriteBroadcastManifest(
  manifest: string,
  upstreamUrl: string,
): string {
  if (!manifest.trimStart().startsWith("#EXTM3U"))
    throw new Error("Invalid HLS playlist");
  const channelId = new URL(upstreamUrl).pathname.match(
    /^\/stream\/(\d+)$/,
  )?.[1];
  const sequenceMatch = manifest.match(/^#EXT-X-MEDIA-SEQUENCE:(\d+)\s*$/m);
  let sequence = sequenceMatch ? Number(sequenceMatch[1]) : 0;
  let segment = false;
  return manifest
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line;
      if (line.startsWith("#")) {
        if (line.startsWith("#EXTINF:")) segment = true;
        return line.replace(
          /URI="([^"]+)"/g,
          (_, uri: string) => `URI="${broadcastPath(uri, upstreamUrl)}"`,
        );
      }
      const resource = broadcastPath(line.trim(), upstreamUrl);
      if (
        segment &&
        channelId &&
        resource.startsWith(BROADCAST_PREFIX + "/media/")
      ) {
        segment = false;
        // The broadcaster rotates its encrypted token on every refresh. Keep the
        // sequence's pathname stable: HLS compares URIs after stripping queries.
        return `${BROADCAST_PREFIX}/media/stream-${channelId}-segment-${sequence++}?resource=${encodeURIComponent(resource.slice(BROADCAST_PREFIX.length))}`;
      }
      segment = false;
      return resource;
    })
    .join("\n");
}

async function limitedText(
  response: Response,
  maxBytes: number,
): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = "",
    bytes = 0;
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

export async function fetchStorefrontBroadcast(
  request: Request,
  dispatch: (request: Request) => Promise<Response> = (request) =>
    fetch(request),
): Promise<Response> {
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Use GET or HEAD", { status: 405 });
  const url = new URL(request.url);
  const path = url.pathname.slice(BROADCAST_PREFIX.length);
  try {
    // No arbitrary origin, provider URL, cookies, or authorization headers are forwarded.
    broadcastPath(path + url.search);
    const headers = new Headers({ Accept: "*/*" });
    for (const key of ["Range", "If-None-Match", "If-Modified-Since"]) {
      const value = request.headers.get(key);
      if (value) headers.set(key, value);
    }
    let upstreamPath = path + url.search;
    if (/^\/media\/stream-\d+-segment-\d+$/.test(path)) {
      const resource = url.searchParams.get("resource") || "";
      const validated = broadcastPath(resource);
      if (!validated.startsWith(BROADCAST_PREFIX + "/media/"))
        throw new Error("Unsupported broadcast resource");
      upstreamPath = validated.slice(BROADCAST_PREFIX.length);
    }
    const upstreamUrl = BROADCAST_ORIGIN + upstreamPath;
    const upstream = await dispatch(
      new Request(upstreamUrl, {
        method: request.method,
        headers,
        redirect: "manual",
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
    for (const key of [
      "set-cookie",
      "content-length",
      "content-encoding",
      "access-control-allow-origin",
    ])
      responseHeaders.delete(key);
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "no-referrer");
    if (request.method === "HEAD" || upstream.status === 304)
      return new Response(null, {
        status: upstream.status,
        headers: responseHeaders,
      });
    if (path === "/api/channels") {
      const data = JSON.parse(await limitedText(upstream, 4 * 1024 * 1024));
      if (!Array.isArray(data.channels)) throw new Error("Invalid catalogue");
      const channels = data.channels.map(
        (channel: {
          id: string;
          name: string;
          group: string;
          logo?: string;
          epgId?: string;
          url: string;
        }) => ({
          id: String(channel.id),
          name: channel.name,
          group: channel.group,
          logo: channel.logo ? broadcastPath(channel.logo) : "",
          epgId: channel.epgId || "",
          url: broadcastPath(channel.url),
        }),
      );
      return Response.json(
        { source: data.source, total: channels.length, channels },
        {
          headers: {
            "Cache-Control": "public, max-age=60",
            "X-Content-Type-Options": "nosniff",
          },
        },
      );
    }
    if (
      responseHeaders.get("Content-Type")?.includes("mpegurl") ||
      (path.startsWith("/stream/") && url.searchParams.get("hls") === "1")
    ) {
      const body = rewriteBroadcastManifest(
        await limitedText(upstream, 1024 * 1024),
        upstreamUrl,
      );
      responseHeaders.set("Content-Type", "application/vnd.apple.mpegurl");
      responseHeaders.set("Cache-Control", "no-store");
      return new Response(body, { headers: responseHeaders });
    }
    // Logos, segments, and XMLTV stay streamed. Do not buffer video in Worker memory.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const known = [
      "Unsupported broadcast resource",
      "Broadcast metadata too large",
      "Invalid HLS playlist",
      "Invalid catalogue",
    ];
    const failure =
      error instanceof Error && known.includes(error.message)
        ? error.message
        : "Upstream request failed";
    console.error(
      JSON.stringify({ event: "storefront_broadcast_failed", failure }),
    );
    return Response.json(
      { error: "Broadcast service unavailable. Please try again." },
      { status: 502 },
    );
  }
}
