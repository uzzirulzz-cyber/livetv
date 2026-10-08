import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchGeoTvHlsStream, fetchGeoTvSegment } from '../src/worker/services/geotv-proxy';
import worker from '../src/worker/playbeat-proxy';
import type { Env } from '../src/worker/env';

const env = {
  GEOTV_HOST: 'https://provider.example', GEOTV_USER: 'alice', GEOTV_PASS: 'secret',
  PLAYBACK_BASE_URL: 'https://broadcast.example',
} as Env;

test('HLS preserves playlist directory and hides credentials in media and key URLs', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes('dns-query')
    ? Response.json({ Answer: [] })
    : new Response('#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI="key.bin"\nsegment.ts\n../next.m3u8\n', { headers: { 'Content-Type': 'application/vnd.apple.mpegurl' } });
  try {
    const response = await fetchGeoTvHlsStream(env, '', 'https://provider.example/live/alice/secret/master.m3u8');
    const body = await response.text();
    assert.equal(response.status, 200);
    assert.ok(body.includes(encodeURIComponent('https://provider.example/live/__PB_PROVIDER_USERNAME__/__PB_PROVIDER_PASSWORD__/segment.ts')));
    assert.ok(body.includes(encodeURIComponent('https://provider.example/live/__PB_PROVIDER_USERNAME__/__PB_PROVIDER_PASSWORD__/key.bin')));
    assert.ok(!body.includes('secret'));
  } finally { globalThis.fetch = original; }
});

test('upstream errors are not turned into successful playlists', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes('dns-query') ? Response.json({ Answer: [] }) : new Response('unavailable', { status: 403 });
  try { assert.equal((await fetchGeoTvHlsStream(env, '123')).status, 502); }
  finally { globalThis.fetch = original; }
});

test('key resources retain their content type and are not publicly cached', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes('dns-query') ? Response.json({ Answer: [] }) : new Response(new Uint8Array(16), { headers: { 'Content-Type': 'application/octet-stream' } });
  try {
    const response = await fetchGeoTvSegment(env, 'https://provider.example/key.bin');
    assert.equal(response.headers.get('Content-Type'), 'application/octet-stream');
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  } finally { globalThis.fetch = original; }
});

test('nested playlists are rewritten rather than served as TS', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes('dns-query') ? Response.json({ Answer: [] }) : new Response('#EXTM3U\nsegment.ts', { headers: { 'Content-Type': 'application/vnd.apple.mpegurl' } });
  try {
    const response = await fetchGeoTvSegment(env, 'https://provider.example/live/child.m3u8');
    assert.ok((await response.text()).includes('https://broadcast.example/broadcast/api/iptv/segment?url='));
  } finally { globalThis.fetch = original; }
});

test('public callers cannot force provider synchronization', async () => {
  const response = await worker.fetch(new Request('https://app.example/api/iptv/channels?refresh=1'), { CATALOG_DB: {} });
  assert.equal(response.status, 401);
});
