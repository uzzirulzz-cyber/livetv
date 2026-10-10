export const FRONTEND_RELEASE = '10d3c92b449e26e461c696e6972b110a3f67fa5f';
export function storefrontMetadata() {
  return Response.json({schemaVersion:1, domain:'playbeat.live', dashboard:'playbeat.digital/admin#playbeat-live', release:FRONTEND_RELEASE,
    settings:{storefrontWorker:'playbeat-storefront', playerWorker:'playbeat-player', backendWorker:'new-ne222', catalogueSource:'fsdf-2026-10-09', importedChannels:10000,
      sourceType:'Live and 24/7 feeds; no on-demand catalogue', customerAuthentication:{projectId:'gen-lang-client-0800809003', google:true, email:true, facebook:false, status:'production'},
      frontendIntegration:{repository:'uzzirulzz-cyber/repository', release:FRONTEND_RELEASE, status:'production', backgrounds:10, playback:'HLS and MPEG-TS'},
      streamBridgeRequestLimitSeconds:300}}, {headers:{'Cache-Control':'no-store'}});
}
export async function fetchCinematicStorefront(request: Request, env: Pick<Env, 'ASSETS'>) {
 const upstream = await env.ASSETS.fetch(request);
 const response = new Response(upstream.body, upstream);
 if ((response.headers.get('content-type') || '').includes('text/html')) response.headers.set('Cache-Control','no-cache');
 response.headers.set('X-PlayBeat-Hosting','cloudflare-workers');
 return response;
}
