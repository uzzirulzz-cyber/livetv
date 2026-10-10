export function reportLiveEvent(type: 'page_view' | 'play_request' | 'tracking_status', channelId?: string, tracking?: { ga4: boolean; adsense: boolean }) {
  try {
    if (window.location.pathname.startsWith('/admin')) return;
    if (type === 'play_request') void import('./googleTracking').then(({ trackGooglePlay }) => trackGooglePlay(channelId)).catch(() => {});
    let sessionId = sessionStorage.getItem('pb_live_reporting_session');
    if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem('pb_live_reporting_session', sessionId); }
    void fetch('/api/digital-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ type, sessionId, path: window.location.pathname, referrer: document.referrer, channelId, tracking, campaign: Object.fromEntries(['utm_source','utm_medium','utm_campaign'].map(key => [key,new URLSearchParams(window.location.search).get(key)?.slice(0,160) || ''])) }) }).catch(() => {});
  } catch { /* Reporting never blocks playback. */ }
}
