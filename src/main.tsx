import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { reportLiveEvent } from './services/digitalReporting';

reportLiveEvent('page_view');

createRoot(document.getElementById('root')!).render(<App />);
