import {createRoot} from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';
import { reportLiveEvent } from './services/digitalReporting';

reportLiveEvent('page_view');

// Reference homepage at the root; catalogue routes share the tested player.
const App = window.location.pathname === '/'
  ? lazy(() => import('./HomeApp.tsx'))
  : import.meta.env.VITE_LIVE_ONLY === 'true'
  ? lazy(() => import('./LiveApp.tsx'))
  : lazy(() => import('./App.tsx'));
createRoot(document.getElementById('root')!).render(<Suspense fallback={<p role="status">Loading PlayBeat Live…</p>}><App /></Suspense>);
