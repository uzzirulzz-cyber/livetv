import { useEffect, useRef, useState } from 'react';
import { Film, Play, Search, X } from 'lucide-react';
import { loadMediaPage, loadSeriesSeasons, type LibraryTitle, type LibrarySeason } from '../../services/mediaLibrary';
interface Props { kind: 'movies' | 'series'; onWatch: (title: string, source: string) => void }
export function MediaLibraryView({ kind, onWatch }: Props) {
  const episodeDialog = useRef<HTMLDialogElement>(null);
  const [titles, setTitles] = useState<LibraryTitle[]>([]);
  const [total, setTotal] = useState(0);
  const [connected, setConnected] = useState(true);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LibraryTitle | null>(null);
  const [seasons, setSeasons] = useState<LibrarySeason[]>([]);
  const [episodeError, setEpisodeError] = useState('');
  const [episodesLoading, setEpisodesLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    loadMediaPage(kind, page, controller.signal).then(data => {
      setTitles(previous => page === 1 ? data.titles : [...previous, ...data.titles]);
      setTotal(data.total); setConnected(data.connected);
    }).catch(() => { if (!controller.signal.aborted) setError('The media library could not be reached.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [kind, page, revision]);
  useEffect(() => {
    if (!selected) return;
    const modal = episodeDialog.current;
    modal?.showModal();
    const controller = new AbortController(); setSeasons([]); setEpisodeError(''); setEpisodesLoading(true);
    loadSeriesSeasons(selected.id, controller.signal).then(setSeasons)
      .catch(error => { if (!controller.signal.aborted) setEpisodeError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setEpisodesLoading(false); });
    return () => { controller.abort(); modal?.close(); };
  }, [selected]);
  const label = kind === 'movies' ? 'Movies' : 'Web Series';
  const filtered = titles.filter(title => `${title.title} ${title.genres.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
    <p className="text-xs uppercase tracking-[.25em] text-amber-300">PlayBeat media library</p>
    <h1 className="mt-2 text-3xl font-bold">{label}</h1>
    <p className="mt-2 text-sm text-slate-400">{kind === 'movies' ? 'Discover movies and watch on demand.' : 'Browse series, choose a season and play an episode.'}</p>
    <label className="mt-6 flex max-w-lg items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search loaded ${label.toLowerCase()}…`} aria-label={`Search ${label}`} className="w-full bg-transparent py-3 outline-none" /></label>
    {!connected && <p role="status" className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-200">The on-demand provider is disconnected. {label} will appear when its catalogue is connected in PlayBeat Digital.</p>}
    {error && <p role="alert" className="mt-6 text-amber-200">{error} <button className="underline" onClick={() => setRevision(value => value + 1)}>Try again</button></p>}
    {loading && <p role="status" className="py-8 text-slate-400">Loading {label.toLowerCase()}…</p>}
    {!loading && !error && !titles.length && connected && <p className="py-12 text-slate-400">No {label.toLowerCase()} have been supplied by the connected provider.</p>}
    {!!titles.length && <p className="my-5 text-xs text-slate-400">{titles.length} of {total} titles loaded</p>}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{filtered.map(title => <article key={title.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#101a2d]">
      <div className="relative flex aspect-[2/3] items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">{title.poster ? <img src={title.poster} alt={title.title} loading="lazy" referrerPolicy="no-referrer" className="absolute h-full w-full object-cover" onError={event => { event.currentTarget.style.display = 'none'; }} /> : null}<Film className="text-slate-500" size={40} /></div>
      <div className="p-3"><h2 className="line-clamp-2 min-h-10 text-sm font-semibold">{title.title}</h2><p className="mt-2 truncate text-xs text-slate-400">{title.genres.join(' · ') || 'On demand'}{title.rating ? ` · ${title.rating}` : ''}</p>
      <button disabled={kind === 'movies' && !title.streamUrl} onClick={() => kind === 'series' ? setSelected(title) : onWatch(title.title, title.streamUrl!)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-300 py-2 text-xs font-semibold text-slate-950 disabled:opacity-40"><Play size={14} />{kind === 'series' ? 'Episodes' : 'Watch movie'}</button></div>
    </article>)}</div>
    {titles.length < total && <button disabled={loading} onClick={() => setPage(value => value + 1)} className="my-8 rounded-xl border border-white/20 px-6 py-3 disabled:opacity-50">Load more {label.toLowerCase()}</button>}
    {selected && <dialog ref={episodeDialog} onCancel={event => { event.preventDefault(); setSelected(null); }} className="fixed inset-0 m-auto max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto rounded-xl bg-slate-950 p-5 text-white backdrop:bg-black/90" aria-labelledby="series-title"><div className="mx-auto max-w-3xl"><button autoFocus aria-label="Close episodes" onClick={() => setSelected(null)} className="float-right rounded-lg p-3"><X /></button><h2 id="series-title" className="py-4 text-2xl font-bold">{selected.title}</h2><p className="mb-6 text-slate-400">{selected.description}</p>{episodesLoading && <p role="status">Loading episodes…</p>}{episodeError && <p role="alert" className="text-amber-200">{episodeError}</p>}{!episodesLoading && !episodeError && !seasons.length && <p>No episodes are available.</p>}{seasons.map(season => <section key={season.seasonNumber} className="mb-8"><h3 className="mb-3 text-lg font-bold">Season {season.seasonNumber}</h3>{season.episodes.map(episode => <button key={episode.id} disabled={!episode.streamUrl} onClick={() => onWatch(`${selected.title} · ${episode.title}`, episode.streamUrl)} className="mb-2 flex w-full items-center gap-3 rounded-xl bg-white/5 p-4 text-left disabled:opacity-40"><Play size={16} />{episode.episodeNumber}. {episode.title}</button>)}</section>)}</div></dialog>}
  </main>;
}
