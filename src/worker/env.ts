export interface Env {
  STAR_IPTV_API_KEY: string;
  STAR_IPTV_API_URL: string;
  APP_URL: string;
  ENVIRONMENT?: string;
  TURNSTILE_SECRET?: string;
  JWT_SECRET?: string;
  ENCRYPTION_KEY?: string;
  ADMIN_TOKEN?: string;
  ALLOWED_ORIGIN?: string;
  GEOTV_HOST?: string;
  GEOTV_USER?: string;
  GEOTV_PASS?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  DB?: any;
  CACHE?: any;
  ACTIVATIONS?: any;
}
