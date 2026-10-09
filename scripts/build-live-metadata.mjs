import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
// Generated for every build so Digital always reports the deployed release.
const release = process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const liveOnly = process.env.VITE_LIVE_ONLY === 'true';
writeFileSync('public/live-build.json', JSON.stringify({
  schemaVersion: 1, release, builtAt: new Date().toISOString(),
  domain: 'playbeat.live', dashboard: 'playbeat.digital/admin#playbeat-live',
  rule: 'PlayBeat Digital is the main admin; refresh live sources automatically and show disconnected reports explicitly.',
  settings: { storefrontWorker: 'playbeat-storefront', playerWorker: 'playbeat-player', backendWorker: 'new-ne222',
    playback: 'HLS, loaded after Play', playerBridge: '/broadcast-player', watchlist: 'local browser storage',
    frontend: liveOnly ? 'Vercel live television' : 'Cloudflare entertainment storefront',
    liveOnly, channelImages: 'Original provider logos with a named fallback',
    movieSections: liveOnly ? 'Live cinema channels only' : 'Live / 24-hour channels', programmeGuide: 'Separate feed required', lifestyleSlides: liveOnly ? 0 : 10,
    reporting: 'First-party page views and play requests; not proof of successful playback' },
  updates: liveOnly
    ? ['Live channels and media player only', 'Same-origin Cloudflare broadcast bridge', 'Provider channel logos on premium cards', 'Search, category filters and local favourites']
    : ['Premium three-column storefront', 'Real channel library and on-demand HLS player', 'Stable segment paths on playlist refresh', 'Ten animated lifestyle scenes', 'Vercel live-only deployment available'],
}, null, 2));
