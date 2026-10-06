import React from 'react';
import { Channel, Movie, Series } from '../../types/playbeat';
import { Play, Plus, Check, ChevronRight, Tv, Radio, Sparkles, Star } from 'lucide-react';

interface HomeSectionsProps {
  channels: Channel[];
  movies: Movie[];
  series: Series[];
  onWatchChannel: (channel: Channel) => void;
  onWatchMovie: (movie: Movie) => void;
  onSelectSeries: (series: Series) => void;
  onToggleMyList: (title: string) => void;
  isItemInMyList: (title: string) => boolean;
  onNavigateSection: (section: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  channels,
  movies,
  series,
  onWatchChannel,
  onWatchMovie,
  onSelectSeries,
  onToggleMyList,
  isItemInMyList,
  onNavigateSection
}) => {
  const sportsChannels = channels.filter((c) => c.category === 'Sports');
  const trendingMovies = movies.filter((m) => m.isTrending);
  const popularSeries = series;

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 lg:px-8">
      {/* ROW 1: LIVE NOW (Channels carousel) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display flex items-center gap-2">
              <span>Live Now on PlayBeat</span>
              <span className="text-[11px] font-sans font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                Live Broadcasts
              </span>
            </h2>
          </div>
          <button
            onClick={() => onNavigateSection('live')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
          >
            <span>All Channels</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {channels.slice(0, 6).map((channel) => (
            <div
              key={channel.id}
              onClick={() => onWatchChannel(channel)}
              className="group relative shrink-0 w-[240px] sm:w-[280px] bg-[#0c1326]/80 hover:bg-[#111b33] border border-white/[0.08] hover:border-cyan-500/50 rounded-xl p-3.5 cursor-pointer transition-all hover:scale-[1.02] shadow-lg shadow-black/40"
            >
              {/* Channel Top row */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {channel.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      CH {channel.number} · {channel.resolution}
                    </div>
                  </div>
                </div>

                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Current Program */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-200 line-clamp-1">
                  {channel.currentProgram.title}
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${channel.currentProgram.progressPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{channel.currentProgram.startTime}</span>
                  <span>Ends {channel.currentProgram.endTime}</span>
                </div>
              </div>

              {/* Hover overlay play button */}
              <div className="absolute inset-0 bg-cyan-950/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-950 rounded-lg text-xs font-extrabold shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  Watch Stream
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROW 2: TRENDING MOVIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
            Trending Movies on PlayBeat
          </h2>
          <button
            onClick={() => onNavigateSection('movies')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
          >
            <span>Explore Movies</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {movies.map((movie) => {
            const inList = isItemInMyList(movie.title);
            return (
              <div
                key={movie.id}
                onClick={() => onWatchMovie(movie)}
                className="group relative bg-[#0c1326]/60 border border-white/[0.08] hover:border-cyan-500/40 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg shadow-black/40"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-slate-950 relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-80" />

                  {/* Rating Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">
                    {movie.rating}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMyList(movie.title);
                      }}
                      className="p-1.5 rounded-md bg-black/60 hover:bg-cyan-500 text-white backdrop-blur-md transition-colors"
                      title="Add to My List"
                    >
                      {inList ? <Check className="w-3 h-3 text-cyan-300" /> : <Plus className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {movie.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>{movie.year}</span>
                    <span>·</span>
                    <span>{movie.duration}</span>
                    <span>·</span>
                    <span className="text-cyan-400">{movie.genres[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROW 3: POPULAR SERIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
            Popular Series &amp; Shows
          </h2>
          <button
            onClick={() => onNavigateSection('series')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
          >
            <span>View Series Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {series.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSeries(item)}
              className="group relative bg-[#0c1326]/70 hover:bg-[#111b33] border border-white/[0.08] hover:border-cyan-500/40 rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col sm:flex-row shadow-lg shadow-black/40"
            >
              <div className="sm:w-48 aspect-[16/9] sm:aspect-auto shrink-0 overflow-hidden relative">
                <img
                  src={item.backdrop}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c1326] hidden sm:block" />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold mb-1">
                    <span>{item.rating}</span>
                    <span>·</span>
                    <span>{item.seasonCount} Season(s)</span>
                    <span>·</span>
                    <span>{item.genres.join(', ')}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.seasons[0]?.episodes.length || 0} Episodes available
                  </span>
                  <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Episodes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROW 4: SPORTS LIVE SPOTLIGHT */}
      <section className="p-5 bg-gradient-to-r from-blue-950/40 via-[#0c1326] to-[#050811] border border-blue-500/20 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase font-mono">
              Live Sports Stadium Package
            </span>
            <h3 className="text-xl font-bold text-white font-display">
              Ultra-Low Latency 4K 60FPS Sports Streaming
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experience UEFA Champions League, Formula 1 Grand Prix, Apex Endurance Racing, and international sporting events with multi-screen simultaneous streaming.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateSection('live')}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
            >
              Watch Sports Live
            </button>
            <button
              onClick={() => onNavigateSection('plans')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/15 transition-colors"
            >
              Explore VIP Sports Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
