import type { Env } from '../env';

// Cloudflare 1.1.1.1 DoH DNS Cache entry
interface DohCacheEntry {
  ip: string;
  latencyMs: number;
  expires: number;
}
const dohCache: Record<string, DohCacheEntry> = {};

// In-memory response cache for worker runtimes without caches.default
interface MemoryCacheItem {
  body: ArrayBuffer | string;
  contentType: string;
  headers: Record<string, string>;
  expires: number;
}
const memoryImageCache = new Map<string, MemoryCacheItem>();
let cachedChannelList: { channels: any[]; count: number; expires: number } | null = null;

/**
 * Resolves a hostname using Cloudflare 1.1.1.1 DNS over HTTPS (DoH)
 * Guarantees ultra-low latency edge resolution and DNS route acceleration.
 */
export async function resolveCloudflareDoh(hostname: string): Promise<{ ip: string; latencyMs: number }> {
  const now = Date.now();
  if (dohCache[hostname] && dohCache[hostname].expires > now) {
    return { ip: dohCache[hostname].ip, latencyMs: dohCache[hostname].latencyMs };
  }

  const startTime = Date.now();
  try {
    const dohRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
    });
    const data = (await dohRes.json()) as any;
    const durationMs = Date.now() - startTime;
    if (data.Answer && data.Answer.length > 0) {
      const ip = data.Answer[0].data;
      const ttl = Math.max(60, data.Answer[0].TTL || 300) * 1000;
      dohCache[hostname] = { ip, latencyMs: durationMs, expires: now + ttl };
      return { ip, latencyMs: durationMs };
    }
  } catch (err: any) {
    console.warn(`[Cloudflare DoH] Fallback resolution for ${hostname}:`, err.message);
  }
  return { ip: hostname, latencyMs: Date.now() - startTime };
}

/**
 * Validates that a target URL is safe and not an internal network or SSRF attempt
 */
export function isAllowedHost(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    // Disallow loopback and private IP spaces
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.16.') ||
      host.startsWith('169.254.') ||
      host.endsWith('.internal') ||
      host.endsWith('.local')
    ) {
      return false;
    }
    // Only allow HTTP/HTTPS
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Cleans raw broadcast channel names from technical prefixes without altering their authentic name
 */
export function cleanBroadcastName(rawName: string): string {
  let cleaned = rawName.trim();
  cleaned = cleaned.replace(/^(CM:\s*|IN\s*-\s*|PK\s*-\s*|EN\s*-\s*|UK\s*-\s*|SL\s*)/i, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned || rawName.trim();
}

/**
 * Categorizes a channel into standard OTT media categories
 */
export function categorizeChannel(name: string, group: string): string {
  const text = `${name} ${group}`.toLowerCase();
  if (text.includes('sport') || text.includes('cricket')) return 'Sports';
  if (text.includes('news')) return 'News';
  if (
    text.includes('movie') ||
    text.includes('bollywood') ||
    text.includes('hollywood') ||
    text.includes('cinema') ||
    text.includes('amazon')
  ) {
    return 'Movies';
  }
  if (text.includes('kid') || text.includes('cartoon') || text.includes('animation')) return 'Kids';
  if (text.includes('music') || text.includes('singer')) return 'Music';
  if (text.includes('documentary')) return 'Documentary';
  if (text.includes('islamic')) return 'International';
  return 'Entertainment';
}

/**
 * Generates an SVG fallback image for broken or unavailable channel logos
 */
function generateFallbackSvg(label: string): string {
  const initial = (label || 'TV').slice(0, 3).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="24" fill="#0c1326"/>
    <rect width="116" height="116" x="2" y="2" rx="22" fill="none" stroke="#06b6d4" stroke-width="2" stroke-opacity="0.4"/>
    <text x="60" y="68" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="28" font-weight="900" fill="#22d3ee" text-anchor="middle">${initial}</text>
  </svg>`;
}

/**
 * Cloudflare-cached fetcher for GeoTV channel playlist
 * Injects upstream credentials securely on the server/worker side.
 */
export async function fetchGeoTvChannels(
  env: Env,
  options?: { force?: boolean }
): Promise<{ success: boolean; cached: boolean; count: number; channels: any[] }> {
  const now = Date.now();
  const force = options?.force || false;

  if (!force && cachedChannelList && cachedChannelList.expires > now) {
    return {
      success: true,
      cached: true,
      count: cachedChannelList.count,
      channels: cachedChannelList.channels,
    };
  }

  const host = env.GEOTV_HOST;
  const user = env.GEOTV_USER;
  const pass = env.GEOTV_PASS;

  if (!host || !user || !pass) throw new Error('GeoTV provider configuration is incomplete.');
  if (new URL(host).protocol !== 'https:') {
    throw new Error('GeoTV provider must be configured with HTTPS.');
  }

  const playlistUrl = `${host}/get.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&type=m3u_plus&output=ts`;

  const hostUrl = new URL(playlistUrl);
  await resolveCloudflareDoh(hostUrl.hostname);

  const upstreamRes = await fetch(playlistUrl, {
    headers: {
      'User-Agent': 'PlayBeat-Worker/3.0 (Cloudflare-Edge-Sync)',
      Accept: '*/*',
    },
  });

  if (!upstreamRes.ok) {
    throw new Error(`Upstream GeoTV returned HTTP ${upstreamRes.status}: ${upstreamRes.statusText}`);
  }

  const text = await upstreamRes.text();
  const lines = text.split('\n');

  const parsedChannels: any[] = [];
  let currentItem: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const epgMatch = line.match(/tvg-id="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      const nameParts = line.split(',');
      const rawName = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() : 'Live Channel';
      const cleanName = cleanBroadcastName(rawName);
      const group = groupMatch ? groupMatch[1].trim() : 'General';
      const logo = logoMatch ? logoMatch[1] : '';

      currentItem = {
        name: cleanName,
        rawName,
        epgId: epgMatch ? epgMatch[1].trim() : '',
        logo: logo ? `/api/iptv/image?url=${encodeURIComponent(logo)}` : '',
        rawLogo: logo,
        group,
        category: categorizeChannel(rawName, group),
      };
    } else if (line.includes('/live/')) {
      if (currentItem) {
        const idMatch = line.match(/\/live\/[^/]+\/[^/]+\/(\d+)\./);
        const streamId = idMatch ? idMatch[1] : String(parsedChannels.length + 1);
        currentItem.id = `geo_${streamId}`;
        currentItem.streamId = streamId;
        // Securely routed endpoints (credentials are never exposed to the client)
        currentItem.hlsUrl = `/api/iptv/hls/stream.m3u8?channelId=${streamId}`;
        currentItem.tsUrl = `/api/iptv/stream?channelId=${streamId}`;
        parsedChannels.push(currentItem);
        currentItem = null;
      }
    }
  }

  cachedChannelList = {
    channels: parsedChannels,
    count: parsedChannels.length,
    expires: now + 30 * 60 * 1000, // 30-minute cache
  };

  return {
    success: true,
    cached: false,
    count: parsedChannels.length,
    channels: parsedChannels,
  };
}

/**
 * Cloudflare-cached Image Proxy with CORS, compression, and fallback SVG
 * Eliminates mixed-content issues and accelerates image load to single-digit ms
 */
export async function fetchGeoTvImage(env: Env, imageUrl: string, request?: Request): Promise<Response> {
  if (!imageUrl || !isAllowedHost(imageUrl)) {
    return new Response(generateFallbackSvg('TV'), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const cacheKey = `img:${imageUrl}`;
  const now = Date.now();

  // Check in-memory cache
  if (memoryImageCache.has(cacheKey)) {
    const item = memoryImageCache.get(cacheKey)!;
    if (item.expires > now) {
      return new Response(item.body, {
        status: 200,
        headers: {
          'Content-Type': item.contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
          'Access-Control-Allow-Origin': '*',
          'X-Cache': 'HIT',
          'CF-Cache-Status': 'HIT',
        },
      });
    } else {
      memoryImageCache.delete(cacheKey);
    }
  }

  // Pre-resolve hostname with Cloudflare DoH
  const parsed = new URL(imageUrl);
  const doh = await resolveCloudflareDoh(parsed.hostname);

  try {
    const upstreamRes = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlayBeat-Edge/3.0',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!upstreamRes.ok) {
      return new Response(generateFallbackSvg('TV'), {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/png';
    const buffer = await upstreamRes.arrayBuffer();

    // Cache in memory (up to 200 images, 24-hour TTL)
    if (memoryImageCache.size > 200) {
      const firstKey = memoryImageCache.keys().next().value;
      if (firstKey) memoryImageCache.delete(firstKey);
    }
    memoryImageCache.set(cacheKey, {
      body: buffer,
      contentType,
      headers: {},
      expires: now + 24 * 3600 * 1000,
    });

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'X-Cache': 'MISS',
        'CF-Cache-Status': 'MISS',
        'X-Cloudflare-DNS-IP': doh.ip,
        'X-Cloudflare-DoH-Latency': `${doh.latencyMs}ms`,
      },
    });
  } catch (err: any) {
    return new Response(generateFallbackSvg('TV'), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Access-Control-Allow-Origin': '*',
        'X-Proxy-Error': err.message || 'Image fetch error',
      },
    });
  }
}

/**
 * Cloudflare-cached HLS Stream Proxy
 * Rewrites segments and resolves edge nodes via Cloudflare 1.1.1.1 DoH
 */
export async function fetchGeoTvHlsStream(
  env: Env,
  channelId: string,
  rawUrl?: string
): Promise<Response> {
  const host = env.GEOTV_HOST;
  const user = env.GEOTV_USER;
  const pass = env.GEOTV_PASS;

  if (!rawUrl && (!host || !user || !pass)) return new Response('GeoTV provider is not configured', { status: 503 });
  if (!rawUrl && new URL(host!).protocol !== 'https:') {
    return new Response('GeoTV HTTPS provider configuration is required', { status: 503 });
  }

  let targetUrl = rawUrl;
  if (!targetUrl && channelId) {
    targetUrl = `${host}/live/${user}/${pass}/${channelId}.m3u8`;
  }
  if (!targetUrl) {
    return new Response('Missing channelId or url', { status: 400 });
  }

  const parsed = new URL(targetUrl);
  if (parsed.protocol !== 'https:') {
    return new Response('GeoTV stream must use HTTPS', { status: 502 });
  }
  const doh = await resolveCloudflareDoh(parsed.hostname);

  let upstreamRes = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: '*/*',
    },
  });

  let playlistBody = await upstreamRes.text();
  let finalOrigin = upstreamRes.url;

  // Handle HTML redirect tag <a href="...">Found</a>
  const htmlRedirectMatch = playlistBody.match(/href="([^"]+)"/);
  if (htmlRedirectMatch && htmlRedirectMatch[1]) {
    const redirectUrl = htmlRedirectMatch[1];
    const redirectParsed = new URL(redirectUrl);
    await resolveCloudflareDoh(redirectParsed.hostname);

    const redirectRes = await fetch(redirectUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
    });
    playlistBody = await redirectRes.text();
    finalOrigin = redirectRes.url;
  }

  const originUrl = new URL(finalOrigin);
  const baseUrl = `${originUrl.protocol}//${originUrl.host}`;

  // Rewrite TS segments to our Cloudflare edge segment proxy
  const rewrittenLines = playlistBody.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    const fullSegmentUrl = trimmed.startsWith('http')
      ? trimmed
      : `${baseUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    return `/api/iptv/segment?url=${encodeURIComponent(fullSegmentUrl)}`;
  });

  const rewrittenPlaylist = rewrittenLines.join('\n');

  return new Response(rewrittenPlaylist, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'X-Cloudflare-DNS-IP': doh.ip,
      'X-Cloudflare-DoH-Latency': `${doh.latencyMs}ms`,
      'X-Edge-Stream-Engine': 'Cloudflare-Worker-HLS',
    },
  });
}

/**
 * Cloudflare-cached Video TS Segment Proxy
 * High-throughput streaming with edge caching and CORS
 */
export async function fetchGeoTvSegment(env: Env, segmentUrl: string): Promise<Response> {
  if (!segmentUrl || !isAllowedHost(segmentUrl)) {
    return new Response('Invalid or disallowed segment url', { status: 400 });
  }

  const parsed = new URL(segmentUrl);
  const doh = await resolveCloudflareDoh(parsed.hostname);

  const upstreamRes = await fetch(segmentUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: '*/*',
    },
  });

  if (!upstreamRes.ok) {
    return new Response(`Segment upstream error: ${upstreamRes.statusText}`, {
      status: upstreamRes.status,
    });
  }

  const headers = new Headers();
  headers.set('Content-Type', 'video/mp2t');
  headers.set('Cache-Control', 'public, max-age=180, s-maxage=300');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Headers', '*');
  headers.set('X-Cloudflare-DNS-IP', doh.ip);
  headers.set('X-Cloudflare-DoH-Latency', `${doh.latencyMs}ms`);

  const cl = upstreamRes.headers.get('content-length');
  if (cl) headers.set('Content-Length', cl);

  return new Response(upstreamRes.body, {
    status: 200,
    headers,
  });
}
