import test from 'node:test';
import assert from 'node:assert/strict';
import { loadMediaPage, loadSeriesSeasons } from '../src/services/mediaLibrary';
test('media library preserves disconnected provider state and does not invent titles', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => Response.json(String(input).includes('health') ? { configured: false } : { movies: [], total: 0 });
  try { assert.deepEqual(await loadMediaPage('movies', 1, new AbortController().signal), { titles: [], total: 0, connected: false }); }
  finally { globalThis.fetch = original; }
});
test('movie mapping keeps server playback URLs and rejects insecure external resources', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => Response.json(String(input).includes('health') ? { configured: true } : { total: 1, movies: [{ id: 42, officialTitle: 'Provider movie', poster: 'http://insecure.example/poster.jpg', streamUrl: '/api/stream/movie/42.mp4', genre: ['Drama'] }] });
  try { const page = await loadMediaPage('movies', 1, new AbortController().signal); assert.equal(page.titles[0].streamUrl, '/api/stream/movie/42.mp4'); assert.equal(page.titles[0].poster, ''); assert.equal(page.titles[0].title, 'Provider movie'); }
  finally { globalThis.fetch = original; }
});
test('missing episode API produces an explicit connection error', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('', { status: 404 });
  try { await assert.rejects(loadSeriesSeasons('42', new AbortController().signal), /Episode access is not connected/); }
  finally { globalThis.fetch = original; }
});
