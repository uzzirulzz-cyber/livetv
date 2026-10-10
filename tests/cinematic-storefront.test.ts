import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchCinematicStorefront, storefrontMetadata} from '../src/worker/services/cinematic-storefront';
test('public frontend uses Cloudflare assets without contacting a Vercel origin', async () => {
 const request = new Request('https://playbeat.live/assets/site.js');
 let seen: Request | undefined;
 const env = {ASSETS: {fetch: async (input: Request) => {
   seen=input;
   return new Response('content',{headers:{'Content-Type':'text/html'}});
 }}} as unknown as { ASSETS: { fetch(request: Request): Promise<Response> } };
 const original = globalThis.fetch;
 try {
   globalThis.fetch = async () => {throw new Error('External origin must not be contacted');};
   const response=await fetchCinematicStorefront(request,env);
   assert.equal(seen,request);
   assert.equal(await response.text(),'content');
   assert.equal(response.headers.get('cache-control'),'no-cache');
   assert.equal(response.headers.get('X-PlayBeat-Hosting'),'cloudflare-workers');
 } finally {globalThis.fetch=original;}
});
test('release metadata explicitly reports unconfigured Facebook and absent on-demand source', async () => {
 const data=await storefrontMetadata().json();
 assert.equal(data.settings.customerAuthentication.facebook,false);
 assert.match(data.settings.sourceType,/no on-demand/);
 assert.equal(data.settings.streamBridgeRequestLimitSeconds,300);
});
