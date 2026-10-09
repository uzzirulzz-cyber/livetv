import { lazy, Suspense, useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { LiveTvView } from './components/playbeat/LiveTvView';
import { loadBroadcastCatalog } from './services/broadcastCatalog';
import { reportLiveEvent } from './services/digitalReporting';
import type { Channel } from './types/playbeat';

const Player = lazy(() => import('./components/playbeat/VideoPlayerModal').then(m => ({ default: m.VideoPlayerModal })));

export default function LiveApp() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selected, setSelected] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem('pb_favorites') || '[]');
      return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
    } catch { return []; }
  });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    loadBroadcastCatalog(controller.signal)
      .then(setChannels)
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  useEffect(() => {
    try { localStorage.setItem('pb_favorites', JSON.stringify(favorites)); } catch { /* Storage is optional. */ }
  }, [favorites]);

  const toggleFavorite = (id: string) => setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const watch = (channel: Channel) => {
    reportLiveEvent('play_request', channel.id);
    setSelected(channel);
  };

  return <div className="min-h-screen bg-[#060b17] text-slate-100">
    <header className="border-b border-white/10 bg-[#091122]/95 px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a href="/" aria-label="PlayBeat Live home" className="flex items-center gap-3">
          <img src="/logo.svg" alt="PlayBeat Live" className="h-10 w-auto max-w-48" />
        </a>
        <span className="flex items-center gap-2 text-xs font-semibold text-amber-200"><Radio size={15} /> LIVE TV</span>
      </div>
    </header>
    {loading && <p role="status" className="mx-auto max-w-7xl px-6 py-8 text-slate-400">Loading live channels…</p>}
    {error && <div role="alert" className="mx-auto max-w-7xl px-6 py-8 text-amber-200">The channel library could not be reached. <button className="underline" onClick={() => setRevision(value => value + 1)}>Try again</button></div>}
    {!loading && !error && <LiveTvView channels={channels} onWatchChannel={watch} favorites={favorites} onToggleFavorite={toggleFavorite} />}
    {selected && <Suspense fallback={<p role="status" className="fixed bottom-6 left-6 rounded-xl bg-slate-900 p-4">Opening player…</p>}>
      <Player channel={selected} allChannels={channels} isOpen onClose={() => setSelected(null)} onSelectChannel={watch} isFavorite={favorites.includes(selected.id)} onToggleFavorite={toggleFavorite} />
    </Suspense>}
    <footer className="mx-auto max-w-7xl border-t border-white/10 px-6 py-6 text-xs text-slate-500">PlayBeat.live · Live channels & media player</footer>
  </div>;
}
