import React, { useState } from 'react';
import { Series, Episode } from '../../types/playbeat';
import { Play, Layers, Star, Info, Film, ChevronRight } from 'lucide-react';

interface SeriesViewProps {
  seriesList: Series[];
  onPlayEpisode: (episode: Episode, seriesTitle: string) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({ seriesList, onPlayEpisode }) => {
  const [selectedSeries, setSelectedSeries] = useState<Series>(seriesList[0] || null);
  const [activeSeasonNumber, setActiveSeasonNumber] = useState<number>(1);

  if (!selectedSeries) return null;

  const currentSeason =
    selectedSeries.seasons.find((s) => s.seasonNumber === activeSeasonNumber) ||
    selectedSeries.seasons[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <h1 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          <span>PlayBeat Television Series &amp; Shows</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Authorized multi-season original productions and licensed episodic sagas
        </p>
      </div>

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
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                {selectedSeries.rating}
              </span>
              <span className="text-slate-300 font-mono">{selectedSeries.year}</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400 font-medium">
                {selectedSeries.seasonCount} Season(s)
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-display">
              {selectedSeries.title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
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
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Season 1 Episode 1</span>
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

      {/* Other Series Carousel */}
      <div className="space-y-4 pt-6 border-t border-white/[0.08]">
        <h3 className="text-base font-bold text-white font-display">
          More Series on PlayBeat
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {seriesList.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSeries(s);
                setActiveSeasonNumber(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedSeries.id === s.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
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
