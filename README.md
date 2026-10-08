# PlayBeat Live

PlayBeat is a navy-and-gold entertainment storefront with live television, cinema channels, shows, search, a local watchlist, and recent channels. The HLS player is loaded and opened only after a user chooses Play; closing it stops playback and releases its resources.

The current library comes from the existing `playbeat-player` service at `player.playbeat.live`. Movie and show sections contain live/24-hour channels. On-demand films, episode catalogues, and programme schedules require separate source feeds; the storefront does not invent them.

## Architecture

- `playbeat-storefront` serves the React app and a same-origin `/broadcast-player/*` bridge.
- The `BROADCAST_PLAYER` service binding calls the existing `playbeat-player` Worker. Catalogue, logos, HLS playlists, segments, and encryption-key paths are adapted to the storefront origin.
- The `LEGACY_APP` binding sends `/api/*` and `/callback/*` to `new-ne222`, preserving its backend and admin services.
- Existing Workers, playlists, databases, secrets, and original Worker source/configuration are retained. The storefront deployment workflow does not deploy them or run their migrations.

`playbeat.live/*` and `www.playbeat.live/*` use Cloudflare dashboard routes. Keep those existing route records when deploying updates. Pointing them back to `new-ne222` restores the previous frontend.

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

The GitHub Actions workflow follows the same checks. It requires existing `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets for the account containing `playbeat-player` and `new-ne222`. Provider credentials are never needed in the frontend.

For authenticated Cloudflare API environments without a local Wrangler token, `scripts/build-embedded-worker.mjs` creates an equivalent upload module from the built text assets. Normal Wrangler deployments use the native `ASSETS` binding.
