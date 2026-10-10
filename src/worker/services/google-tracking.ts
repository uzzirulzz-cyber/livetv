export interface PublicGoogleConfig { ga4: string; gtm: string; adsense: string; adsEnabled: boolean }
export function cleanGoogleConfig(input: unknown): PublicGoogleConfig {
  const v = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const valid = (key: string, pattern: RegExp) => typeof v[key] === 'string' && pattern.test(v[key] as string) ? v[key] as string : '';
  const adsense = valid('adsense', /^ca-pub-\d{16}$/);
  return { ga4: valid('ga4', /^G-[A-Z0-9]{6,12}$/), gtm: valid('gtm', /^GTM-[A-Z0-9]{4,12}$/), adsense, adsEnabled: v.adsEnabled === true && Boolean(adsense) };
}
// Public IDs verified against Digital's public-config endpoint on 2026-10-10.
// They contain no credentials. Keep tags available if the central API times out,
// and expose that degraded source explicitly rather than claiming connectivity.
const lastVerified = cleanGoogleConfig({ga4:'G-5TYLQD0J2N',gtm:'GTM-K96GPX6B',adsense:'ca-pub-9777611286139666',adsEnabled:true});
let cached: { config: PublicGoogleConfig; at: number; connected:boolean } | undefined;
export async function centralGoogleConfig() {
  if (cached && Date.now() - cached.at < 300_000) return { connected: cached.connected, config: cached.config };
  try {
    const res = await fetch('https://playbeat.digital/api/analytics/public-config', { redirect: 'error', signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error('Unavailable');
    const text = await res.text(); if (text.length > 8192) throw new Error('Too large');
    const data = JSON.parse(text); if (data.success !== true) throw new Error('Unavailable');
    const config = cleanGoogleConfig(data.config); cached = { config, at: Date.now(), connected:true };
    return { connected: true, config };
  } catch { cached={connected:false,config:lastVerified,at:Date.now()}; return { connected: false, config: lastVerified }; }
}
export async function googleTrackingRoute(request: Request): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!['/api/google-tracking', '/ads.txt'].includes(path) || !['GET','HEAD'].includes(request.method)) return null;
  const result = await centralGoogleConfig();
  if (path === '/api/google-tracking') return Response.json({ success: true, centralConnected:result.connected, config: result.config, source: result.connected ? 'PlayBeat Digital central settings' : 'Last verified central public IDs (2026-10-10); central API unavailable', reportsConnected: false, adsenseApproval: 'not verified' }, { headers: { 'Cache-Control': 'public, max-age=300' } });
  if (!result.config?.adsense) return new Response('AdSense configuration unavailable.\n', { status:503, headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'} });
  return new Response(request.method === 'HEAD' ? null : `google.com, ${result.config.adsense.replace('ca-','')}, DIRECT, f08c47fec0942fa0\n`, {headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=300'}});
}
