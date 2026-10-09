export const FRONTEND_RELEASE = '8d37467ba4109a13e097dce031ab5b478444f374';
export function storefrontMetadata() {
  return Response.json({schemaVersion:1, domain:'playbeat.live', dashboard:'playbeat.digital/admin#playbeat-live', release:FRONTEND_RELEASE,
    settings:{storefrontWorker:'playbeat-storefront', playerWorker:'playbeat-player', backendWorker:'new-ne222', catalogueSource:'fsdf-2026-10-09', importedChannels:10000,
      sourceType:'Live and 24/7 feeds; no on-demand catalogue', customerAuthentication:{projectId:'gen-lang-client-0800809003', google:true, email:true, facebook:false, status:'production'},
      frontendIntegration:{repository:'uzzirulzz-cyber/repository', release:FRONTEND_RELEASE, status:'production', backgrounds:10, playback:'HLS and MPEG-TS'},
      streamBridgeRequestLimitSeconds:300}}, {headers:{'Cache-Control':'no-store'}});
}
export async function fetchCinematicStorefront(request: Request) {
  const target = new URL(request.url);
  target.hostname = 'repository-virid-kappa.vercel.app'; target.port = ''; target.protocol = 'https:';
  const headers = new Headers();
  for (const key of ['accept','range','if-none-match','if-modified-since']) {
    const value = request.headers.get(key); if (value) headers.set(key,value);
  }
  const upstream = await fetch(target.toString(), {method:request.method, headers, redirect:'manual'});
  const response = new Response(upstream.body, upstream);
  if ((response.headers.get('content-type') || '').includes('text/html')) response.headers.set('Cache-Control','no-cache');
  response.headers.set('X-PlayBeat-Release',FRONTEND_RELEASE);
  return response;
}
