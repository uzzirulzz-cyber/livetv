import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanGoogleConfig, googleTrackingRoute } from '../src/worker/services/google-tracking';
test('only public, valid Google IDs can leave the central-config proxy', () => {
  assert.deepEqual(cleanGoogleConfig({ ga4:'G-5TYLQD0J2N',gtm:'GTM-K96GPX6B',adsense:'ca-pub-9777611286139666',adsEnabled:true,password:'private',arbitraryUrl:'https://private.example' }),{ga4:'G-5TYLQD0J2N',gtm:'GTM-K96GPX6B',adsense:'ca-pub-9777611286139666',adsEnabled:true});
  assert.deepEqual(cleanGoogleConfig({ga4:'<script>',gtm:'bad',adsense:'ca-pub-1\nother',adsEnabled:true}),{ga4:'',gtm:'',adsense:'',adsEnabled:false});
});
test('tracking GET proxy and ads.txt use the same publisher, never expose other fields', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({success:true,config:{ga4:'G-5TYLQD0J2N',gtm:'GTM-K96GPX6B',adsense:'ca-pub-9777611286139666',adsEnabled:true,privateKey:'never-copy'}});
  try {
    const config = await googleTrackingRoute(new Request('https://playbeat.live/api/google-tracking'));
    assert.equal(config!.status,200); assert.ok(!(await config!.text()).includes('never-copy'));
    const txt = await googleTrackingRoute(new Request('https://playbeat.live/ads.txt'));
    assert.equal(await txt!.text(),'google.com, pub-9777611286139666, DIRECT, f08c47fec0942fa0\n');
    assert.equal(await googleTrackingRoute(new Request('https://playbeat.live/api/google-tracking',{method:'POST'})),null);
  } finally { globalThis.fetch = original; }
});
