import type { Env } from '../env';

export function withGeoTvProvider(env: Env): Env {
  if (env.GEOTV_HOST && env.GEOTV_USER && env.GEOTV_PASS) {
    const host = new URL(env.GEOTV_HOST);
    const allowedOrigin = env.GEOTV_ALLOWED_ORIGIN
      ? new URL(env.GEOTV_ALLOWED_ORIGIN).origin
      : host.protocol === 'https:' ? host.origin : '';
    const insecureAllowed = env.ALLOW_INSECURE_GEOTV === 'true'
      && host.protocol === 'http:'
      && host.origin === allowedOrigin;
    if (host.protocol !== 'https:' && !insecureAllowed) {
      throw new Error('GeoTV provider must be configured with HTTPS.');
    }
    if (host.origin !== allowedOrigin) {
      throw new Error('GeoTV provider origin does not match the configured origin.');
    }
    return env;
  }
  if (!env.M3U_PLAYLIST_URL) throw new Error('GeoTV provider is not configured');

  const playlistUrl = new URL(env.M3U_PLAYLIST_URL);
  const allowedOrigin = env.GEOTV_ALLOWED_ORIGIN
    ? new URL(env.GEOTV_ALLOWED_ORIGIN).origin
    : playlistUrl.protocol === 'https:' ? playlistUrl.origin : '';
  const insecureAllowed = env.ALLOW_INSECURE_GEOTV === 'true'
    && playlistUrl.protocol === 'http:'
    && playlistUrl.origin === allowedOrigin;
  if (playlistUrl.protocol !== 'https:' && !insecureAllowed) {
    throw new Error('GeoTV provider must be configured with HTTPS.');
  }
  if (playlistUrl.origin !== allowedOrigin) {
    throw new Error('GeoTV provider origin does not match the configured origin.');
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
