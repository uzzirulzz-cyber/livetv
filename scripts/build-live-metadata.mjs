import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
// Generated for every build so Digital always reports the deployed release.
const release = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
writeFileSync('public/live-build.json', JSON.stringify({
  schemaVersion: 1, release, builtAt: new Date().toISOString(),
  domain: 'playbeat.live', dashboard: 'playbeat.digital/admin#playbeat-live',
  rule: 'PlayBeat Digital is the main admin; refresh live sources automatically and show disconnected reports explicitly.',
  settings: { storefrontWorker: 'playbeat-storefront', playerWorker: 'playbeat-player', backendWorker: 'new-ne222',
    playback: 'HLS, loaded after Play', playerBridge: '/broadcast-player', watchlist: 'local browser storage',
    movieSections: 'Live / 24-hour channels', programmeGuide: 'Separate feed required', lifestyleSlides: 10,
    reporting: 'First-party page views and play requests; not proof of successful playback' },
  updates: ['Premium three-column storefront', 'Real channel library and on-demand HLS player', 'Stable segment paths on playlist refresh', 'Ten animated lifestyle scenes'],
}, null, 2));
