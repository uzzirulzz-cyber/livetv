import {createRoot} from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';
import { reportLiveEvent } from './services/digitalReporting';

reportLiveEvent('page_view');

// Vercel publishes only live television. The existing Cloudflare build retains its storefront.
const App = import.meta.env.VITE_LIVE_ONLY === 'true'
  ? lazy(() => import('./LiveApp.tsx'))
  : lazy(() => import('./App.tsx'));
createRoot(document.getElementById('root')!).render(<Suspense fallback={<p role="status">Loading PlayBeat Live…</p>}><App /></Suspense>);
