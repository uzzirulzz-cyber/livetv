import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchCinematicStorefront, storefrontMetadata} from '../src/worker/services/cinematic-storefront';
test('public frontend routing keeps private headers out of the Vercel request', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(String(url),'https://repository-esw9mqljl-playbeatdigital-techs-projects.vercel.app/assets/site.js');
      const headers = new Headers(init?.headers);
      assert.equal(headers.get('authorization'),null); assert.equal(headers.get('cookie'),null);
      assert.equal(headers.get('range'),'bytes=0-20');
      return new Response('content',{headers:{'Content-Type':'text/html'}});
    };
    const response = await fetchCinematicStorefront(new Request('https://playbeat.live/assets/site.js',{headers:{Authorization:'Bearer private',Cookie:'session=private',Range:'bytes=0-20'}}));
    assert.equal(response.headers.get('cache-control'),'no-cache');
  } finally {globalThis.fetch=original;}
});
test('release metadata explicitly reports unconfigured Facebook and absent on-demand source', async () => {
  const data=await storefrontMetadata().json();
  assert.equal(data.settings.customerAuthentication.facebook,false);
  assert.match(data.settings.sourceType,/no on-demand/);
  assert.equal(data.settings.streamBridgeRequestLimitSeconds,300);
});
