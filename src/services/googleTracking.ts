import { reportLiveEvent } from './digitalReporting';
export type GoogleConsent = { analytics: boolean; ads: boolean };
type Config = { ga4: string; adsense: string; adsEnabled: boolean };
const consentKey = 'pb_live_google_consent_v1';
let config: Config | null = null;
let init: Promise<Config | null> | undefined;
let pageSent = false;
const loaded = { ga4: false, adsense: false };
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }
export function storedGoogleConsent(): GoogleConsent | null {
  try { const v = JSON.parse(localStorage.getItem(consentKey) || 'null'); return typeof v?.analytics === 'boolean' && typeof v?.ads === 'boolean' ? v : null; } catch { return null; }
}
function observe() { reportLiveEvent('tracking_status', undefined, loaded); }
function inject(id: string, src: string, key: 'ga4' | 'adsense') {
  if (document.getElementById(id)) return;
  const script = document.createElement('script'); script.id = id; script.async = true; script.src = src; script.crossOrigin = 'anonymous';
  script.onload = () => { loaded[key] = true; observe(); }; script.onerror = observe;
  document.head.appendChild(script);
}
export function safePageLocation() {
  const url = new URL(window.location.origin + window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) { const value = params.get(key); if (value) url.searchParams.set(key, value.slice(0,160)); }
  return url.href;
}
function activate(choice: GoogleConsent) {
  if (!config) return;
  window.dataLayer ||= [];
  window.gtag ||= (...args: unknown[]) => { window.dataLayer!.push(args); };
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:choice.analytics?'granted':'denied',ad_storage:choice.ads?'granted':'denied',ad_user_data:choice.ads?'granted':'denied',ad_personalization:choice.ads?'granted':'denied'});
  if (choice.analytics && config.ga4 && !pageSent) {
    window.gtag('js',new Date()); window.gtag('config',config.ga4,{send_page_view:false,page_location:safePageLocation(),page_referrer:document.referrer ? new URL(document.referrer).origin : ''});
    window.gtag('event','page_view',{page_location:safePageLocation(),page_title:document.title,site_name:'PlayBeat Live'}); pageSent = true;
    inject('pb-live-ga4',`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4)}`,'ga4');
  }
  if (choice.ads && config.adsEnabled && config.adsense) inject('pb-live-adsense',`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsense)}`,'adsense');
}
export function initGoogleTracking() {
  init ||= (async () => {
    try { const res = await fetch('/api/google-tracking'); const body = await res.json(); if (!res.ok || !body.success) return null;
      config = body.config;
      if (config?.adsense && !document.querySelector('meta[name="google-adsense-account"]')) { const meta = document.createElement('meta'); meta.name='google-adsense-account'; meta.content=config.adsense; document.head.appendChild(meta); }
      const stored = storedGoogleConsent(); if (stored) activate(stored); return config;
    } catch { return null; }
  })();
  return init;
}
export async function setGoogleConsent(choice: GoogleConsent) {
  try { localStorage.setItem(consentKey, JSON.stringify(choice)); } catch { /* Session choice still applies. */ }
  await initGoogleTracking(); activate(choice);
}
export function trackGooglePlay(channelId?: string) {
  if (config?.ga4 && pageSent && storedGoogleConsent()?.analytics) window.gtag?.('event','play_request',{channel_id:channelId,site_name:'PlayBeat Live'});
}
