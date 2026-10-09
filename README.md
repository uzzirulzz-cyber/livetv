# PlayBeat Live

PlayBeat is a navy-and-gold entertainment storefront with live television, cinema channels, shows, search, a local watchlist, and recent channels. The HLS player is loaded and opened only after a user chooses Play; closing it stops playback and releases its resources.

The final presentation follows the supplied `PLAYBEAT Premium IPTV.html`: its original logo and wordmark, left navigation, channel spotlight, compact popular grid, regional filters, and a searchable right-hand lineup. All controls use the real library; catalogue counts are computed from the available channels.

The current library comes from the existing `playbeat-player` service at `player.playbeat.live`. Movie and show sections contain live/24-hour channels. On-demand films, episode catalogues, and programme schedules require separate source feeds; the storefront does not invent them.

## Architecture

- `playbeat-storefront` serves the React app and a same-origin `/broadcast-player/*` bridge.
- The `BROADCAST_PLAYER` service binding calls the existing `playbeat-player` Worker. Catalogue, logos, HLS playlists, segments, and encryption-key paths are adapted to the storefront origin.
- The `LEGACY_APP` binding sends `/api/*` and `/callback/*` to `new-ne222`, preserving its backend and admin services.
- Existing Workers, playlists, databases, secrets, and original Worker source/configuration are retained. The storefront deployment workflow does not deploy them or run their migrations.

`playbeat.live/*` and `www.playbeat.live/*` use Cloudflare dashboard routes. Keep those existing route records when deploying updates. Pointing them back to `new-ne222` restores the previous frontend.

## Vercel live television project

The existing Vercel `livetv` project builds with `VITE_LIVE_ONLY=true` through `vercel.json`. This publishes the live channel library and lazy-loaded media player, including search, category filters, provider logos and local favourites. The Cloudflare storefront build remains unchanged.

Same-origin `/broadcast-player/*` requests are rewritten to the existing `playbeat-storefront.crdbixx.workers.dev` bridge, which already adapts catalogue, logos, HLS manifests and segments. This fixed upstream avoids a routing loop if `playbeat.live` later moves to Vercel. `/api/*` continues through the existing backend and reporting contract. No provider credentials are required in Vercel or the browser.

Verify the Vercel deployment and real playback before assigning the production domain. Logo availability depends on the provider; missing or failed images display the channel's name initials.

## Development

```sh
npm ci
npm run dev
```

The Express development server uses the same bridge via the deployed player origin. Production uses the private service binding.

## Verify and deploy

```sh
npm run lint
npm test
npm run build
npm run deploy
```

`npm run deploy` uses **`wrangler.storefront.toml`** and deploys only `playbeat-storefront`. Do not use the legacy `wrangler.toml` or `wrangler.broadcast.toml` to publish this frontend.

The GitHub Actions workflow follows the same checks. It requires a `CLOUDFLARE_API_TOKEN` repository secret authorized for the account in `wrangler.storefront.toml`, containing `playbeat-player` and `new-ne222`. The workflow uses that explicit account rather than the legacy account secret. Provider credentials are never needed in the frontend.

For authenticated Cloudflare API environments without a local Wrangler token, `scripts/build-embedded-worker.mjs` creates an equivalent upload module from the built text assets. Normal Wrangler deployments use the native `ASSETS` binding.

The Vercel template now includes Live TV, Movies and Web Series tabs. On-demand
catalogues use the existing `/api/movies`, `/api/series` and `/api/health` backend
through Vercel's same-origin rewrite, with 60 titles per page and native video
controls for seeking. Only provider-supplied titles are shown. A disconnected
provider is reported explicitly. Series details require `/api/series/:id` returning
`{ seasons: [{ seasonNumber, episodes: [{ id, title, episodeNumber, streamUrl }] }] }`;
the current legacy backend has no episode route, so episode playback remains
blocked until that integration exists. No provider credentials belong in frontend
code. Current backend health reports zero movies/series and no configured VOD
provider; UI availability does not mean the media catalogue has been imported.
