import type { Channel, MediaCategory } from "../types/playbeat";

export function categoryForGroup(group: string): MediaCategory {
  if (/sports|cricket|football|espn|dazn|ufc|rugby|fiba|f1\b/i.test(group))
    return "Sports";
  if (/news/i.test(group)) return "News";
  if (/kids|cartoon|animation|bambini/i.test(group)) return "Kids";
  if (/movie|movis|hollywood|bollywood|film|cinema/i.test(group))
    return "Movies";
  if (/music|singer/i.test(group)) return "Music";
  if (/document/i.test(group)) return "Documentary";
  if (/religion|islamic/i.test(group)) return "International";
  return "Entertainment";
}

export function normalizeBroadcastChannel(
  channel: Record<string, unknown>,
  index: number,
): Channel {
  const group = String(channel.group || channel.groupTitle || "Entertainment");
  const name = String(channel.name || "Live channel");
  const streamId = String(channel.id ?? index);
  return {
    id: `vb_${streamId}`,
    streamId,
    name,
    number: index + 1,
    logo: String(channel.logo || ""),
    category: categoryForGroup(group),
    groupTitle: group,
    country: /^PK\b/i.test(group)
      ? "Pakistan"
      : /^IN\b/i.test(group)
        ? "India"
        : /^UK\b/i.test(group)
          ? "United Kingdom"
          : /^USA\b/i.test(group)
            ? "United States"
            : "Global",
    language: /^PK\b/i.test(group)
      ? "Urdu"
      : /^IN\b/i.test(group)
        ? "Hindi"
        : "English",
    streamUrl: String(channel.url || ""),
    hlsUrl: /\.m3u8(?:[?#]|$)|[?&]hls=1(?:&|$)/i.test(String(channel.url || ""))
      ? String(channel.url || "")
      : undefined,
    epgId: String(channel.epgId || ""),
    isPremium: false,
    isLive: true,
    resolution: /4K/i.test(name)
      ? "4K"
      : /FHD|1080/i.test(name)
        ? "1080p"
        : "Unknown",
    currentProgram: {
      title: "Live broadcast",
      startTime: "--:--",
      endTime: "--:--",
      progressPercentage: 0,
    },
    nextProgram: {
      title: "Programme guide unavailable",
      startTime: "--:--",
      endTime: "--:--",
    },
  };
}

/**
 * A raw broadcast stream can be served as an HLS playlist by the existing
 * player Worker. Keep this fallback limited to same-origin bridged channel IDs.
 */
export function hlsFallbackForLiveStream(
  source: string,
  origin: string,
): string | null {
  try {
    const url = new URL(source, origin);
    if (
      url.origin !== new URL(origin).origin ||
      !/^\/broadcast-player\/stream\/\d+$/.test(url.pathname)
    ) return null;
    url.searchParams.set("hls", "1");
    return url.pathname + url.search;
  } catch {
    return null;
  }
}

export async function loadBroadcastCatalog(
  signal: AbortSignal,
): Promise<Channel[]> {
  const response = await fetch("/broadcast-player/api/channels", { signal });
  if (!response.ok) throw new Error("Catalogue unavailable");
  const data = await response.json();
  if (!Array.isArray(data.channels)) throw new Error("Invalid catalogue");
  return data.channels.map(normalizeBroadcastChannel);
}
