export function reportLiveEvent(type: 'page_view' | 'play_request', channelId?: string) {
  try {
    if (window.location.pathname.startsWith('/admin')) return;
    let sessionId = sessionStorage.getItem('pb_live_reporting_session');
    if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem('pb_live_reporting_session', sessionId); }
    void fetch('/api/digital-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ type, sessionId, path: window.location.pathname, referrer: document.referrer, channelId }) }).catch(() => {});
  } catch { /* Reporting never blocks playback. */ }
}
