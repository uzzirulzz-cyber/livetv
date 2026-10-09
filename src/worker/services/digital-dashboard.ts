interface DashboardEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  BROADCAST_PLAYER: { fetch(request: Request): Promise<Response> };
  LEGACY_APP: { fetch(request: Request): Promise<Response> };
  DASHBOARD_BRIDGE_TOKEN?: string;
}
function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } }); }
async function authorized(request: Request, secret?: string) {
  if (!secret) return false;
  const input = request.headers.get('authorization') || '';
  if (input.length > 1024) return false;
  const hash = async (s: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  const [a,b] = await Promise.all([hash(input), hash('Bearer ' + secret)]);
  let mismatch = 0; for (let i=0;i<a.length;i++) mismatch |= a[i]^b[i]; return mismatch === 0;
}
async function source(dispatch: () => Promise<Response>) {
  try { const response = await dispatch(); if (!response.ok) return { connected: false, status: response.status };
    const text = await response.text(); if (text.length > 8_000_000) throw new Error('Response too large');
    return { connected: true, data: JSON.parse(text) }; } catch { return { connected: false, status: 502 }; }
}
export async function digitalDashboard(request: Request, env: DashboardEnv): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (path === '/api/digital-dashboard' && request.method === 'GET') {
    if (!env.DASHBOARD_BRIDGE_TOKEN) return json({ error: 'dashboard_not_configured' }, 503);
    if (!await authorized(request, env.DASHBOARD_BRIDGE_TOKEN)) return json({ error: 'unauthorized' }, 401);
    const [release,backend,library] = await Promise.all([
      source(() => env.ASSETS.fetch(new Request('https://playbeat.live/live-build.json'))),
      source(() => env.LEGACY_APP.fetch(new Request('https://playbeat.live/api/health'))),
      source(() => env.BROADCAST_PLAYER.fetch(new Request('https://player.playbeat.live/api/channels'))),
    ]);
    const data = library.data;
    const rows = Array.isArray(data) ? data : Array.isArray(data?.channels) ? data.channels : null;
    const categories: Record<string,number> = {};
    for (const row of rows || []) { const category = String(row.category || row.group || 'Other'); categories[category] = (categories[category] || 0)+1; }
    const health = backend.data;
    const sync = health?.lastSync;
    const lastSync = sync ? Object.fromEntries(['generation','syncedAt','live','movies','series','healthChecked','healthCheckedAt'].filter(key => Object.hasOwn(sync,key)).map(key => [key,sync[key]])) : null;
    return json({ schemaVersion: 1, fetchedAt: new Date().toISOString(), release: release.connected ? release.data : null,
      backend: { connected: backend.connected, status: backend.status, configured: Boolean(health?.configured), lastSync, health: health?.health || {} },
      library: { connected: library.connected && rows !== null, channels: rows?.length ?? null, categories } });
  }
  if (path === '/api/digital-events' && request.method === 'POST') {
    if (!env.DASHBOARD_BRIDGE_TOKEN) return json({ error: 'reporting_not_configured' }, 503);
    if (request.headers.get('origin') !== 'https://playbeat.live' && request.headers.get('origin') !== 'https://www.playbeat.live') return json({ error: 'invalid_origin' }, 403);
    if (Number(request.headers.get('content-length') || 0) > 4096) return json({ error: 'too_large' }, 413);
    const text = await request.text(); if (text.length > 4096) return json({ error: 'too_large' }, 413);
    try { const body = JSON.parse(text);
      const response = await fetch('https://playbeat.digital/api/analytics/live/event', { method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.DASHBOARD_BRIDGE_TOKEN, 'User-Agent': request.headers.get('user-agent') || '' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
      return json({ success: response.ok }, response.ok ? 200 : 502);
    } catch { return json({ error: 'reporting_unavailable' }, 502); }
  }
  return null;
}
