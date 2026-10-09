import {
  BROADCAST_PREFIX,
  fetchStorefrontBroadcast,
} from "./services/storefront-broadcast";
import { digitalDashboard } from './services/digital-dashboard';
import { fetchCinematicStorefront, storefrontMetadata } from './services/cinematic-storefront';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === '/live-build.json') return storefrontMetadata();
    const dashboard = await digitalDashboard(request, {...env, ASSETS:{fetch:async () => storefrontMetadata()}});
    if (dashboard) return dashboard;
    if (path.startsWith(BROADCAST_PREFIX + "/")) {
      return fetchStorefrontBroadcast(request, (upstream) =>
        env.BROADCAST_PLAYER.fetch(upstream),
      );
    }
    // Keep the existing production back-end, auth, storage, and admin APIs intact.
    if (path.startsWith("/api/") || path.startsWith("/callback/")) {
      return env.LEGACY_APP.fetch(request);
    }
    if ((request.method === 'GET' || request.method === 'HEAD') && !path.startsWith('/admin')) return fetchCinematicStorefront(request);
    return env.ASSETS.fetch(request);
  },
};
