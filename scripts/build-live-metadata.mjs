import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
// Generated for every build so Digital always reports the deployed release.
const release = process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const liveOnly = process.env.VITE_LIVE_ONLY === 'true';
const storefrontRoutes = liveOnly
  ? ['/', '/live-tv', '/movies', '/series']
  : ['/', '/live', '/movies', '/series', '/sports', '/news', '/music', '/tv-guide', '/my-list', '/search', '/profile'];
writeFileSync('public/live-build.json', JSON.stringify({
  schemaVersion: 1, release, builtAt: new Date().toISOString(),
  domain: 'playbeat.live', dashboard: 'playbeat.digital/admin#playbeat-live',
  rule: 'PlayBeat Digital is the main admin; refresh live sources automatically and show disconnected reports explicitly.',
  settings: { seo: { canonicalHost: 'https://playbeat.live', sitemap: '/sitemap.xml', publicPages: storefrontRoutes, serverRenderedMetadata: true, structuredData: ['Organization','WebSite','WebPage','BreadcrumbList'], socialImage: '/social-cover.png', unknownPages: 404 }, storefrontWorker: 'playbeat-storefront', playerWorker: 'playbeat-player', backendWorker: 'new-ne222',
    catalogueSource: 'fsdf-2026-10-09', importedChannels: 10000, sourceType: 'Live and 24/7 feeds; no on-demand catalogue',
    playback: 'HLS and MPEG-TS, loaded after Play; transport detected from source; MPEG-TS worker receives absolute URLs', staleChunkRecovery: 'Reload once when a previous release references a replaced Vite chunk', playerBridge: '/broadcast-player', watchlist: 'local browser storage',
    frontendIntegration: { repository:'uzzirulzz-cyber/repository', release:'2d45564baaa2f4814f508d572a59b38b20cd0f9c', status:'adapted homepage deployed with local player and catalogue', backgrounds:10 },
    customerAuthentication: { projectId:'gen-lang-client-0800809003', google:true, email:true, facebook:false },
    streamBridgeRequestLimitSeconds:300,
    deploymentPipeline: 'Cloudflare Workers Builds from main; lint and tests required before deploy; GitHub Actions verifies only',
    homepage: 'Reference repository cinematic hero and premium channel cards; current live catalogue and tested player',
    frontend: liveOnly ? 'Cloudflare cinematic homepage, live television and media library' : 'Cloudflare entertainment storefront',
    liveOnly, storefrontRoutes, musicSource: liveOnly ? 'live channel feeds only' : 'Live music channels only; on-demand audio provider disconnected', profile: liveOnly ? 'not included in live-only build' : 'Authentication and account APIs disconnected; explicit unavailable state', channelImages: 'Provider logos; CM cinema feeds use individual catalogue-name artwork; named fallback for missing logos',
    movieSections: liveOnly ? 'Movies and Web Series from backend provider; disconnected state explicit; episode API required' : 'Live / 24-hour channels', programmeGuide: 'Separate feed required', lifestyleSlides: 10,
    googleTracking: {source:'PlayBeat Digital /api/analytics/public-config', configuration:'/api/google-tracking',ga4:'Consent-aware direct GA4; GTM not duplicated',adsense:'Central publisher code after visitor consent', adsTxt:'/ads.txt',reportAccess:'Disconnected',adsenseApproval:'Not verified'},
    promotionStatus:'/promotion-status.json',
    reporting: 'First-party page views, play requests and tag-loader observations; not proof of successful playback or Google reporting' },
  updates: liveOnly
    ? ['Central Google Analytics and AdSense integration with visitor privacy choices', 'Free promotion status and campaign attribution', 'Reference cinematic homepage connected to live channels and player', 'Live TV, Movies and Web Series tabs with on-demand player', 'Same-origin Cloudflare broadcast bridge', 'Absolute stream URLs for MPEG-TS worker playback', 'Cloudflare native deployment with checks', 'Provider channel logos on premium cards', 'Search, category filters and local favourites']
    : ['Premium three-column storefront', 'Real channel library and on-demand HLS player', 'Stable segment paths on playlist refresh', 'Ten animated lifestyle scenes', 'Direct section routes with back and forward navigation', 'Live music channel browsing through the existing broadcast player', 'Explicit disconnected profile state', 'Cloudflare live-only deployment available'],
}, null, 2));
