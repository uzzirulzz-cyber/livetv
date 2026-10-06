import React, { useState } from 'react';
import { Movie } from '../../types/playbeat';
import { Play, Plus, Check, Star, Info, Film, Sparkles, Filter } from 'lucide-react';

interface MoviesViewProps {
  movies: Movie[];
  onWatchMovie: (movie: Movie) => void;
  onToggleMyList: (title: string) => void;
  isItemInMyList: (title: string) => boolean;
}

export const MoviesView: React.FC<MoviesViewProps> = ({
  movies,
  onWatchMovie,
  onToggleMyList,
  isItemInMyList
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);

  const genres = ['All', 'Sci-Fi', 'Action', 'Animation', 'Fantasy', 'Adventure', 'Family'];

  const filteredMovies = movies.filter((m) => {
    if (selectedGenre === 'All') return true;
    return m.genres.includes(selectedGenre);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <Film className="w-6 h-6 text-cyan-400" />
            <span>PlayBeat Movies Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authorized cinematic features in 4K Ultra HD and Dolby Atmos surround
          </p>
        </div>

        {/* Genre Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedGenre === g
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-[#0c1326] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
        {filteredMovies.map((movie) => {
          const inList = isItemInMyList(movie.title);
          return (
            <div
              key={movie.id}
              onClick={() => onWatchMovie(movie)}
              className="group bg-[#0c1326]/70 hover:bg-[#111b33] border border-white/[0.08] hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl shadow-black/50 flex flex-col justify-between"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-black relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1326] via-transparent to-transparent opacity-90" />

                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/15">
                  {movie.rating}
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMovieForDetails(movie);
                    }}
                    className="p-1.5 rounded-md bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                    title="Movie synopsis & details"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMyList(movie.title);
                    }}
                    className="p-1.5 rounded-md bg-black/60 hover:bg-cyan-500 text-white backdrop-blur-md transition-colors"
                    title="Add to My List"
                  >
                    {inList ? <Check className="w-3.5 h-3.5 text-cyan-300" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <div className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {movie.title}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{movie.year}</span>
                  <span>·</span>
                  <span>{movie.duration}</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-sans">{movie.genres[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movie Details Modal */}
      {selectedMovieForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0c1326] border border-white/15 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Backdrop header */}
            <div className="relative h-60 w-full overflow-hidden bg-black">
              <img
                src={selectedMovieForDetails.backdrop}
                alt={selectedMovieForDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1326] to-transparent" />
              <button
                onClick={() => setSelectedMovieForDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content info */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                  {selectedMovieForDetails.rating}
                </span>
                <span>{selectedMovieForDetails.year}</span>
                <span>·</span>
                <span>{selectedMovieForDetails.duration}</span>
                <span>·</span>
                <span>{selectedMovieForDetails.genres.join(', ')}</span>
              </div>

              <h2 className="text-2xl font-black text-white font-display">
                {selectedMovieForDetails.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedMovieForDetails.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-white/10">
                <div>
                  <strong className="text-white">Director:</strong> {selectedMovieForDetails.director}
                </div>
                <div>
                  <strong className="text-white">Language:</strong> {selectedMovieForDetails.language}
                </div>
                <div className="col-span-2">
                  <strong className="text-white">Starring:</strong> {selectedMovieForDetails.cast.join(', ')}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  onClick={() => {
                    onToggleMyList(selectedMovieForDetails.title);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold"
                >
                  {isItemInMyList(selectedMovieForDetails.title) ? 'In My List' : '+ Add to My List'}
                </button>

                <button
                  onClick={() => {
                    onWatchMovie(selectedMovieForDetails);
                    setSelectedMovieForDetails(null);
                  }}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Watch Movie Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
