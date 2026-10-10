export async function storefrontMetadata(request: Request, env: { ASSETS: { fetch(request: Request): Promise<Response> } }) {
 const asset = await env.ASSETS.fetch(request);
 const response = new Response(asset.body, asset);
 response.headers.set('Cache-Control', 'no-store');
 return response;
}
export async function fetchCinematicStorefront(request: Request, env: { ASSETS: { fetch(request: Request): Promise<Response> } }) {
 const upstream = await env.ASSETS.fetch(request);
 const response = new Response(upstream.body, upstream);
 if ((response.headers.get('content-type') || '').includes('text/html')) response.headers.set('Cache-Control','no-cache');
 response.headers.set('X-PlayBeat-Hosting','cloudflare-workers');
 return response;
}
