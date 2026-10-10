import {createRoot} from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';
import { reportLiveEvent } from './services/digitalReporting';
import GoogleConsent from './components/GoogleConsent';

// Cloudflare replaces hashed Vite chunks on each release. If a browser still
// has the previous HTML entrypoint, recover once instead of leaving Play stuck.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const key = 'playbeat_preload_reload_at';
  try {
    const lastReload = Number(window.sessionStorage.getItem(key) || 0);
    if (Date.now() - lastReload < 60_000) return;
    window.sessionStorage.setItem(key, String(Date.now()));
  } catch {
    // Storage can be disabled; reloading is still the safest recovery.
  }
  window.location.reload();
});

reportLiveEvent('page_view');

// Reference homepage at the root; catalogue routes share the tested player.
const App = window.location.pathname === '/'
  ? lazy(() => import('./HomeApp.tsx'))
  : import.meta.env.VITE_LIVE_ONLY === 'true'
  ? lazy(() => import('./LiveApp.tsx'))
  : lazy(() => import('./App.tsx'));
createRoot(document.getElementById('root')!).render(<><Suspense fallback={<p role="status">Loading PlayBeat Live…</p>}><App /></Suspense>{!window.location.pathname.startsWith('/admin') && <GoogleConsent />}</>);
