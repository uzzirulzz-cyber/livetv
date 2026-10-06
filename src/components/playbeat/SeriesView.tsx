import React, { useState } from 'react';
import { Series, Episode } from '../../types/playbeat';
import { Play, Layers, Star, Info, Film, ChevronRight, Search, Tv, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { RELIABLE_STREAMS } from '../../services/catalogData';

interface SeriesViewProps {
  seriesList: Series[];
  onPlayEpisode: (episode: Episode, seriesTitle: string) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({ seriesList, onPlayEpisode }) => {
  const [selectedSeries, setSelectedSeries] = useState<Series>(seriesList[0] || null);
  const [activeSeasonNumber, setActiveSeasonNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchingTvMaze, setIsSearchingTvMaze] = useState<boolean>(false);
  const [tvMazeResults, setTvMazeResults] = useState<any[]>([]);

  // Live TVMaze search handler
  const handleSearchTvMaze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingTvMaze(true);
    try {
      const res = await fetch(`/api/media/tvmaze/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setTvMazeResults(data.results);
      }
    } catch (err) {
      console.warn('TVMaze search error:', err);
    } finally {
      setIsSearchingTvMaze(false);
    }
  };

  // Convert TVMaze show into a full Series with real episodes
  const handleSelectTvMazeShow = async (showItem: any) => {
    const show = showItem.show;
    setIsSearchingTvMaze(true);
    try {
      const epRes = await fetch(`/api/media/tvmaze/episodes?showId=${show.id}`);
      const epData = await epRes.json();
      const episodesList: any[] = epData.success && Array.isArray(epData.episodes) ? epData.episodes : [];

      // Group episodes by season
      const seasonMap: Record<number, Episode[]> = {};
      episodesList.forEach((ep) => {
        const sNum = ep.season || 1;
        if (!seasonMap[sNum]) seasonMap[sNum] = [];
        seasonMap[sNum].push({
          id: `tvm_ep_${ep.id}`,
          episodeNumber: ep.number || seasonMap[sNum].length + 1,
          title: ep.name || `Episode ${ep.number}`,
          duration: ep.runtime ? `${ep.runtime}m` : '50m',
          thumbnail: ep.image?.original || ep.image?.medium || show.image?.original || selectedSeries.backdrop,
          synopsis: ep.summary ? ep.summary.replace(/<[^>]+>/g, '') : 'No synopsis available.',
          streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1
        });
      });

      const formattedSeasons = Object.keys(seasonMap).map((k) => ({
        seasonNumber: parseInt(k, 10),
        title: `Season ${k}`,
        episodes: seasonMap[parseInt(k, 10)]
      }));

      const newSeries: Series = {
        id: `tvm_${show.id}`,
        title: show.name,
        poster: show.image?.original || show.image?.medium || selectedSeries.poster,
        backdrop: show.image?.original || selectedSeries.backdrop,
        year: show.premiered ? parseInt(show.premiered.slice(0, 4), 10) : 2024,
        rating: show.rating?.average ? `★ ${show.rating.average}` : 'TV-14',
        genres: show.genres?.length ? show.genres : ['Drama'],
        description: show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'Global television drama series.',
        cast: [show.network?.name || show.webChannel?.name || 'Worldwide Cast'],
        seasonCount: formattedSeasons.length || 1,
        status: show.status || 'Ongoing',
        isFeatured: false,
        isTrending: true,
        isPopular: true,
        seasons: formattedSeasons.length ? formattedSeasons : selectedSeries.seasons
      };

      setSelectedSeries(newSeries);
      setActiveSeasonNumber(1);
      setTvMazeResults([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Error loading TVMaze show episodes:', err);
    } finally {
      setIsSearchingTvMaze(false);
    }
  };

  if (!selectedSeries) return null;

  const currentSeason =
    selectedSeries.seasons.find((s) => s.seasonNumber === activeSeasonNumber) ||
    selectedSeries.seasons[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Header with TVMaze Global Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>PlayBeat Television &amp; Web Series</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authentic multi-season world-renowned productions, live episode guides, and 4K streaming
          </p>
        </div>

        {/* Real Series Search */}
        <form onSubmit={handleSearchTvMaze} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search ANY real TV show (e.g. Stranger Things)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-2 bg-[#0c1326] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={isSearchingTvMaze}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1"
          >
            {isSearchingTvMaze ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Xtream-Masters WebPlayer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-[#0c1326] border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Xtream-Masters WebPlayer Support</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                CONNECTED
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Access entire series libraries with your Xtream account at <code className="text-cyan-300">http://xtream-masters.com/webplayer/</code> (Host: <strong className="text-white">geotv.space:8880</strong>).
            </p>
          </div>
        </div>
        <a
          href="http://xtream-masters.com/webplayer/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
        >
          <span>Open WebPlayer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Live TVMaze Search Results Grid (if any) */}
      {tvMazeResults.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0c1326] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Global Series Search Results ({tvMazeResults.length})</span>
            </h3>
            <button
              onClick={() => setTvMazeResults([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear Results
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {tvMazeResults.slice(0, 6).map((item) => (
              <div
                key={item.show.id}
                onClick={() => handleSelectTvMazeShow(item)}
                className="bg-black/50 hover:bg-slate-900 border border-white/10 hover:border-cyan-400 p-2 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
              >
                <img
                  src={item.show.image?.medium || selectedSeries.poster}
                  alt={item.show.name}
                  className="w-full aspect-[2/3] object-cover rounded-lg mb-1.5"
                />
                <h4 className="text-xs font-bold text-white truncate">{item.show.name}</h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  {item.show.premiered?.slice(0, 4) || 'Series'} · {item.show.rating?.average ? `★ ${item.show.rating.average}` : '4K'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Series Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0c1326] border border-white/10 shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-2/3 aspect-video lg:aspect-auto overflow-hidden relative">
          <img
            src={selectedSeries.backdrop}
            alt={selectedSeries.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#0c1326]/60 to-[#0c1326]" />
        </div>

        <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                {selectedSeries.rating}
              </span>
              <span className="text-slate-300 font-mono">{selectedSeries.year}</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400 font-medium">
                {selectedSeries.seasonCount} Season(s)
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{selectedSeries.genres.join(', ')}</span>
            </div>

            <h2 className="text-2xl font-black text-white font-display">
              {selectedSeries.title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
              {selectedSeries.description}
            </p>

            <div className="text-[11px] text-slate-400">
              <strong className="text-white">Starring:</strong> {selectedSeries.cast.join(', ')}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                if (currentSeason?.episodes[0]) {
                  onPlayEpisode(currentSeason.episodes[0], selectedSeries.title);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Season {activeSeasonNumber} Episode 1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Season Selector & Episode List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
          <h3 className="text-lg font-bold text-white font-display">
            Episodes ({currentSeason?.episodes.length || 0})
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Season:</span>
            <select
              value={activeSeasonNumber}
              onChange={(e) => setActiveSeasonNumber(Number(e.target.value))}
              className="bg-[#0c1326] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {selectedSeries.seasons.map((s) => (
                <option key={s.seasonNumber} value={s.seasonNumber}>
                  Season {s.seasonNumber}: {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Episode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSeason?.episodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => onPlayEpisode(ep, selectedSeries.title)}
              className="group bg-[#0c1326]/70 hover:bg-[#111b33] border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] shadow-lg shadow-black/40 flex flex-col justify-between"
            >
              <div className="aspect-video w-full overflow-hidden relative bg-black">
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  {ep.duration}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono font-semibold">
                  <span>Episode {ep.episodeNumber}</span>
                  <span>{ep.duration}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {ep.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {ep.synopsis}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Series Lineup Carousel */}
      <div className="space-y-4 pt-6 border-t border-white/[0.08]">
        <h3 className="text-base font-bold text-white font-display">
          Popular Series on PlayBeat
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {seriesList.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSeries(s);
                setActiveSeasonNumber(s.seasons[0]?.seasonNumber || 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedSeries.id === s.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-[#0c1326]/60 border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <img
                src={s.poster}
                alt={s.title}
                className="w-full aspect-[2/3] object-cover rounded-xl mb-2"
              />
              <div className="text-xs font-bold truncate text-white">{s.title}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {s.seasonCount} Season(s) · {s.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
