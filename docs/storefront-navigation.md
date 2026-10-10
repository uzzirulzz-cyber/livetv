# Storefront route and music audit

## Reused
- The existing broadcast catalog, category classification, local favorites and recent-channel storage.
- The existing channel library/cards, search modal, and shared HLS/MPEG-TS player.
- The authenticated Digital dashboard release-metadata contract.

## Added
- Direct URLs for existing sections, including browser Back/Forward synchronization.
- A Music destination filtering real broadcast channels tagged as Music and playing them in the existing player.
- A profile URL with an explicit disconnected state instead of sample account/device data.
- Safe fallback from a failed raw MPEG-TS channel to that same channel's HLS route through the existing bridge.
- Route and stream-fallback tests plus generated release metadata for the changes.

## Missing integrations and fallback
- There is no on-demand audio/track API or authorized music source. Music contains live music channels only; albums, track queues, and playlists are not invented.
- The existing VOD provider and episode route are disconnected. Movie and series availability remains provider-backed.
- Customer sign-in/profile APIs are not connected. The profile route says so; favorites and recent channels remain in this browser.
- The broadcast feed does not provide EPG schedules, so the existing unavailable-program state remains.
- A source can still be offline or rejected upstream; transport fallback cannot repair unavailable provider content.

## Backend and deployment
- No API endpoint, database model, environment variable, or Worker binding was added.
- No player or backend Worker was changed. Storefront deployment remains limited to `wrangler.storefront.toml`.
