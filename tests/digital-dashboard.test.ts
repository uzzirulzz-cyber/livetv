import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { digitalDashboard } from '../src/worker/services/digital-dashboard';
const secret = 'local-test-bridge-key-not-a-production-secret';
const originalFetch = globalThis.fetch;
before(() => { globalThis.fetch = async () => Response.json({success:true,config:{ga4:'G-5TYLQD0J2N',gtm:'',adsense:'',adsEnabled:false}}); });
after(() => { globalThis.fetch = originalFetch; });
const env = {
  DASHBOARD_BRIDGE_TOKEN: secret,
  ASSETS: { fetch: async () => Response.json({ schemaVersion: 1, release: 'abc', settings: { playback: 'HLS' } }) },
  LEGACY_APP: { fetch: async () => Response.json({ configured: true, lastSync: { syncedAt: '2026-10-09T00:00:00Z', live: 2, password: 'must-not-leak' }, health: { healthy: 1 } }) },
  BROADCAST_PLAYER: { fetch: async () => Response.json([{ id: '1', group: 'Sports', url: 'https://private.example/secret-stream' }, { id: '2', group: 'Sports' }]) },
};
test('summary requires bridge authentication and never exposes library URLs or provider secrets', async () => {
  const url = 'https://playbeat.live/api/digital-dashboard';
  assert.equal((await digitalDashboard(new Request(url), env))?.status, 401);
  const result = await digitalDashboard(new Request(url, { headers: { authorization: 'Bearer '+secret } }), env);
  const text = await result!.text(); const data = JSON.parse(text);
  assert.equal(data.library.channels, 2); assert.equal(data.library.categories.Sports, 2);
  assert.equal(data.backend.lastSync.live, 2);
  assert.ok(!text.includes('must-not-leak') && !text.includes('secret-stream') && !text.includes(secret));
});
test('unavailable sources stay unavailable, not zero-filled', async () => {
  const bad = { ...env, BROADCAST_PLAYER: { fetch: async () => new Response('Unavailable', { status: 503 }) } };
  const response = await digitalDashboard(new Request('https://playbeat.live/api/digital-dashboard', { headers: { authorization: 'Bearer '+secret } }), bad);
  const data = await response!.json() as any;
  assert.equal(data.library.connected, false); assert.equal(data.library.channels, null);
});
test('private summary and events fail closed without a secret; invalid public origins cannot relay events', async () => {
  assert.equal((await digitalDashboard(new Request('https://playbeat.live/api/digital-dashboard'), { ...env, DASHBOARD_BRIDGE_TOKEN: undefined }))?.status, 503);
  assert.equal((await digitalDashboard(new Request('https://playbeat.live/api/digital-events', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{}' }), env))?.status, 403);
});
