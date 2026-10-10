import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchCinematicStorefront, storefrontMetadata} from '../src/worker/services/cinematic-storefront';
test('public frontend uses Cloudflare assets without contacting a Vercel origin', async () => {
 const request = new Request('https://playbeat.live/assets/site.js');
 let seen: Request | undefined;
 const env = {ASSETS: {fetch: async (input: Request) => {
   seen=input;
   return new Response('content',{headers:{'Content-Type':'application/javascript'}});
 }}} as unknown as { ASSETS: { fetch(request: Request): Promise<Response> } };
 const original = globalThis.fetch;
 try {
   globalThis.fetch = async () => {throw new Error('External origin must not be contacted');};
   const response=await fetchCinematicStorefront(request,env);
   assert.equal(seen,request);
   assert.equal(await response.text(),'content');
   assert.equal(response.headers.get('content-type'),'application/javascript');
   assert.equal(response.headers.get('X-PlayBeat-Hosting'),'cloudflare-workers');
 } finally {globalThis.fetch=original;}
});
test('public release metadata comes from the current build assets', async () => {
 const request = new Request('https://playbeat.live/live-build.json');
 const current = {release:'current-build',settings:{deploymentPipeline:'Cloudflare Workers Builds'}};
 const env = {ASSETS:{fetch:async (input:Request) => {
   assert.equal(new URL(input.url).pathname,'/live-build.json');
   return Response.json(current);
 }}};
 const response = await storefrontMetadata(request,env);
 assert.deepEqual(await response.json(),current);
 assert.equal(response.headers.get('cache-control'),'no-store');
});
test('discovery routes expose only public URLs and preserve private stream boundaries', async () => {
 const env = {ASSETS:{fetch:async () => {throw new Error('Static assets should not be needed');}}};
 const sitemap = await fetchCinematicStorefront(new Request('https://playbeat.live/sitemap.xml'),env);
 const xml = await sitemap.text();
 assert.equal(sitemap.headers.get('content-type'),'application/xml; charset=utf-8');
 assert.equal((xml.match(/<loc>/g)||[]).length,4);
 assert.match(xml,/<loc>https:\/\/playbeat.live\/movies<\/loc>/);
 assert.doesNotMatch(xml,/admin|broadcast-player|api\/|username|password/);
 const robots = await fetchCinematicStorefront(new Request('https://playbeat.live/robots.txt'),env);
 assert.match(await robots.text(),/Disallow: \/broadcast-player\//);
 const head = await fetchCinematicStorefront(new Request('https://playbeat.live/sitemap.xml',{method:'HEAD'}),env);
 assert.equal(await head.text(),'');
});
test('canonical redirects retain campaign attribution and unknown HTML returns 404', async () => {
 const env = {ASSETS:{fetch:async () => new Response('<html>Fallback</html>',{headers:{'Content-Type':'text/html'}})}};
 const alias = await fetchCinematicStorefront(new Request('https://www.playbeat.live/movies?utm_source=test'),env);
 assert.equal(alias.status,308);
 assert.equal(alias.headers.get('location'),'https://playbeat.live/movies?utm_source=test');
 const missing = await fetchCinematicStorefront(new Request('https://playbeat.live/not-a-real-page'),env);
 assert.equal(missing.status,404);
 assert.equal(missing.headers.get('x-robots-tag'),'noindex');
});
test('public routes request the root asset instead of the redirecting index.html alias', async () => {
 for (const path of ['/', '/live-tv', '/movies', '/series']) {
   const env = {ASSETS:{fetch:async (input:Request) => {
     assert.equal(new URL(input.url).pathname,'/');
     return new Response('root asset',{headers:{'Content-Type':'text/plain'}});
   }}};
   const response = await fetchCinematicStorefront(new Request('https://playbeat.live'+path),env);
   assert.equal(response.status,200);
   assert.equal(await response.text(),'root asset');
 }
});
