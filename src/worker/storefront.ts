import {
  BROADCAST_PREFIX,
  fetchStorefrontBroadcast,
} from "./services/storefront-broadcast";
import { digitalDashboard } from './services/digital-dashboard';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const dashboard = await digitalDashboard(request, env);
    if (dashboard) return dashboard;
    const path = new URL(request.url).pathname;
    if (path.startsWith(BROADCAST_PREFIX + "/")) {
      return fetchStorefrontBroadcast(request, (upstream) =>
        env.BROADCAST_PLAYER.fetch(upstream),
      );
    }
    // Keep the existing production back-end, auth, storage, and admin APIs intact.
    if (path.startsWith("/api/") || path.startsWith("/callback/")) {
      return env.LEGACY_APP.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
