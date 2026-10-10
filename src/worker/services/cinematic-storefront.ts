type RewriteElement = { setInnerContent(value: string): void; setAttribute(name: string, value: string): void; append(value: string, options: { html: boolean }): void };
declare const HTMLRewriter: { new(): { on(selector: string, handlers: { element(element: RewriteElement): void }): InstanceType<typeof HTMLRewriter>; transform(response: Response): Response } };
import { LIVE_SITE, LIVE_PAGES, escapeHtml, liveSitemap } from '../../seo';
type AssetEnv = { ASSETS: { fetch(request: Request): Promise<Response> } };
export async function storefrontMetadata(request: Request, env: AssetEnv) {
 const asset = await env.ASSETS.fetch(request);
 const response = new Response(asset.body, asset);
 response.headers.set('Cache-Control', 'no-store');
 return response;
}
export async function fetchCinematicStorefront(request: Request, env: AssetEnv) {
 const url = new URL(request.url);
 const path = url.pathname;
 if (url.hostname === 'www.playbeat.live' || ['/index.html','/store','/storefront'].includes(path) || (path.endsWith('/') && path !== '/' && LIVE_PAGES[path.slice(0,-1)])) {
   const destination = new URL(LIVE_SITE + (['/index.html','/store','/storefront'].includes(path) ? '/' : path.replace(/\/$/, '') || '/'));
   destination.search = url.search;
   return Response.redirect(destination.href, 308);
 }
 if (path === '/robots.txt') return new Response(request.method === 'HEAD' ? null : `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /callback/\nDisallow: /broadcast-player/\nSitemap: ${LIVE_SITE}/sitemap.xml\n`, {headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600'}});
 if (path === '/sitemap.xml') return new Response(request.method === 'HEAD' ? null : liveSitemap(), {headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
 const page = LIVE_PAGES[path];
 const upstream = await env.ASSETS.fetch(page ? new Request(new URL('/', request.url), request) : request);
 const response = new Response(upstream.body, upstream);
 response.headers.set('X-PlayBeat-Hosting','cloudflare-workers');
 if ((response.headers.get('content-type') || '').includes('text/html')) {
   if (!page) return new Response(request.method === 'HEAD' ? null : '<!doctype html><html lang="en"><title>Page not found | PlayBeat Live</title><meta name="robots" content="noindex"><h1>Page not found</h1><a href="/">Return to PlayBeat Live</a></html>', {status:404,headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-cache'}});
   response.headers.set('Cache-Control','no-cache');
   const canonical = LIVE_SITE + path;
   const schema = {'@context':'https://schema.org','@graph':[
     {'@type':'Organization','@id':LIVE_SITE+'/#organization',name:'PlayBeat Live',url:LIVE_SITE,logo:LIVE_SITE+'/logo.svg',parentOrganization:{'@type':'Organization',name:'PlayBeat Digital',url:'https://playbeat.digital/'}},
     {'@type':'WebSite','@id':LIVE_SITE+'/#website',name:'PlayBeat Live',url:LIVE_SITE,publisher:{'@id':LIVE_SITE+'/#organization'}},
     {'@type':'WebPage','@id':canonical+'#webpage',name:page.title,description:page.description,url:canonical,isPartOf:{'@id':LIVE_SITE+'/#website'}},
     ...(path==='/'?[]:[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PlayBeat Live',item:LIVE_SITE+'/'},{'@type':'ListItem',position:2,name:page.heading,item:canonical}]}]),
   ]};
   const tags = `<link rel="canonical" href="${canonical}"><meta name="robots" content="index, follow, max-image-preview:large"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="PlayBeat Live"><meta property="og:image" content="${LIVE_SITE}/social-cover.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="PlayBeat Live — Live TV, Movies and Web Series"><meta name="twitter:title" content="${escapeHtml(page.title)}"><meta name="twitter:description" content="${escapeHtml(page.description)}"><meta name="twitter:image" content="${LIVE_SITE}/social-cover.png"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
   const section = `<section aria-label="About this section" style="max-width:1152px;margin:24px auto;padding:24px;color:#cbd5e1;font-family:system-ui;line-height:1.7"><h2>${escapeHtml(page.heading)}</h2><p>${escapeHtml(page.text)}</p><nav aria-label="Explore PlayBeat">${Object.entries(LIVE_PAGES).map(([p,v])=>`<a style="color:#fcd34d;margin-right:20px" href="${p}">${p==='/'?'Home':escapeHtml(v.heading)}</a>`).join('')}<a style="color:#fcd34d" href="https://playbeat.digital/?utm_source=playbeat_live&amp;utm_medium=referral&amp;utm_campaign=brand_discovery">Explore PlayBeat Digital</a></nav><h3>Watching on your device</h3><p>Use an up-to-date browser and a stable internet connection. Playback may require pressing Play to enable sound. Channel availability can change; a listing does not guarantee that a feed is online.</p></section>`;
   return new HTMLRewriter()
     .on('title',{element(e){e.setInnerContent(page.title);}})
     .on('meta[name="description"], meta[property="og:description"]',{element(e){e.setAttribute('content',page.description);}})
     .on('meta[property="og:title"]',{element(e){e.setAttribute('content',page.title);}})
     .on('head',{element(e){e.append(tags,{html:true});}})
     .on('body',{element(e){e.append(section,{html:true});}}).transform(response);
 }
 return response;
}
