export interface LibraryTitle {
  id: string;
  title: string;
  poster: string;
  description: string;
  rating: string;
  genres: string[];
  streamUrl?: string;
}
export interface LibraryEpisode { id: string; title: string; episodeNumber: number; streamUrl: string }
export interface LibrarySeason { seasonNumber: number; episodes: LibraryEpisode[] }
export interface LibraryPage { titles: LibraryTitle[]; total: number; connected: boolean }
function safeResource(value: unknown): string {
  if (typeof value !== 'string') return '';
  if (/^\/api\/(?:image\?|stream\/)/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
}
export async function loadMediaPage(kind: 'movies' | 'series', page: number, signal: AbortSignal): Promise<LibraryPage> {
  const [catalog, health] = await Promise.all([
    fetch(`/api/${kind}?page=${page}&pageSize=60`, { signal }),
    fetch('/api/health', { signal }),
  ]);
  if (!catalog.ok || !health.ok) throw new Error('The media library could not be reached.');
  const data = await catalog.json();
  const status = await health.json();
  if (!Array.isArray(data[kind])) throw new Error('The media library returned an invalid catalogue.');
  return { total: Number(data.total) || 0, connected: status.configured === true, titles: data[kind].map((row: Record<string, unknown>) => ({
    id: String(row.id), title: String(row.title || row.officialTitle || ''), poster: safeResource(row.poster),
    description: String(row.description || row.synopsis || ''), rating: String(row.rating || ''),
    genres: Array.isArray(row.genre) ? row.genre.map(String) : [], streamUrl: safeResource(row.streamUrl),
  })) };
}
export async function loadSeriesSeasons(id: string, signal: AbortSignal): Promise<LibrarySeason[]> {
  const response = await fetch(`/api/series/${encodeURIComponent(id)}`, { signal });
  if (response.status === 404) throw new Error('Episode access is not connected on the media provider yet.');
  if (!response.ok) throw new Error('Episodes could not be loaded. Please try again.');
  const data = await response.json();
  if (!Array.isArray(data.seasons)) throw new Error('No episode catalogue is available for this series.');
  return data.seasons.map((season: LibrarySeason) => ({ seasonNumber: Number(season.seasonNumber), episodes: season.episodes.map(episode => ({ ...episode, streamUrl: safeResource(episode.streamUrl) })) }));
}
