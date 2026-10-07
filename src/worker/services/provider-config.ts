import type { Env } from '../env';

export function withGeoTvProvider(env: Env): Env {
  if (env.GEOTV_HOST && env.GEOTV_USER && env.GEOTV_PASS) return env;
  if (!env.M3U_PLAYLIST_URL) throw new Error('GeoTV provider is not configured');

  const playlistUrl = new URL(env.M3U_PLAYLIST_URL);
  if (playlistUrl.protocol !== 'https:') {
    throw new Error('GeoTV provider must be configured with HTTPS.');
  }

  const user = playlistUrl.searchParams.get('username');
  const pass = playlistUrl.searchParams.get('password');
  if (!user || !pass) throw new Error('GeoTV provider is not configured');

  return {
    ...env,
    GEOTV_HOST: playlistUrl.origin,
    GEOTV_USER: user,
    GEOTV_PASS: pass,
  };
}
