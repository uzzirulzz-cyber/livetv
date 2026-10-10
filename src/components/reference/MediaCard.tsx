import React, { useState } from 'react';
import { Play, Heart, Star, Film, Radio } from 'lucide-react';
import { MediaItem } from './types';

interface MediaCardProps {
  item: MediaItem;
  onWatch: (item: MediaItem) => void;
  onToggleFavorite: (item: MediaItem) => void;
  isFavorite: boolean;
  onSelect: (item: MediaItem) => void;
  aspectRatio?: 'poster' | 'landscape';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onWatch,
  onToggleFavorite,
  isFavorite,
  onSelect,
  aspectRatio = 'poster',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayImage = aspectRatio === 'landscape' && item.backdropUrl ? item.backdropUrl : item.posterUrl;

  return (
    <div
      onClick={() => onSelect(item)}
      role="group" aria-label={item.title}
      className="group relative flex-shrink-0 cursor-pointer select-none rounded-2xl bg-[#090e1d] border border-white/[0.08] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)] transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden"
      style={{
        width: aspectRatio === 'landscape' ? '300px' : '210px',
      }}
    >
      {/* Poster Image Container */}
      <div
        className={`relative w-full overflow-hidden bg-slate-900 ${
          aspectRatio === 'landscape' ? 'aspect-video' : 'aspect-[2/3]'
        }`}
      >
        {displayImage && !imageError ? (
          <img
            src={displayImage} loading="lazy"
            alt={item.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full ${item.live ? 'object-contain p-7' : 'object-cover'} object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          /* Zero-broken-image fallback styled container */
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <Film className="w-10 h-10 text-cyan-400/40 mb-2" />
            <span className="text-xs font-semibold text-slate-300">{item.title}</span>
          </div>
        )}

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1d] via-transparent to-black/30 group-hover:opacity-90 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Quality Badge */}
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-black/70 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
            {item.quality}
          </span>

          {/* Live indicator if live */}
          {item.live && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-600/90 text-white shadow-md animate-pulse">
              <Radio className="w-3 h-3" />
              LIVE
            </span>
          )}
        </div>

        {/* Quick Play & Bookmark button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatch(item);
            }}
            className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/40 active:scale-90 transition-transform cursor-pointer"
            aria-label={`Play ${item.title}`} title="Play stream"
          >
            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
          </button>
        </div>

        {/* Favorite toggle button top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isFavorite
              ? 'bg-amber-400 text-slate-950'
              : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
          }`}
          aria-label={isFavorite ? `Remove ${item.title} from My List` : `Save ${item.title} to My List`}
          title={isFavorite ? 'Remove from My List' : 'Add to My List'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-slate-950' : ''}`} />
        </button>

        {/* Continue Watching Progress bar */}
        {item.progressPercent !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-400"
              style={{ width: `${item.progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3.5 space-y-1.5">
        <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
          {item.title}
        </h3>

        {/* Metadata: Zero-pill discipline (unboxed text with separators) */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-0.5 text-amber-400">
            {item.rating > 0 ? <Star className="w-3 h-3 fill-amber-400" /> : item.live ? <Radio className="w-3 h-3 text-cyan-400" /> : null}
            <span className="font-mono tabular-nums text-slate-200">{item.rating > 0 ? item.rating.toFixed(1) : (item.live ? 'Live TV' : 'On demand')}</span>
          </div>
          <span className="text-white/20" aria-hidden="true">·</span>
          <span className="font-mono">{item.year || item.category}</span>
          {item.duration && (
            <>
              <span className="text-white/20" aria-hidden="true">·</span>
              <span className="truncate">{item.duration}</span>
            </>
          )}
        </div>

        {/* Genre Tags (plain subtle text) */}
        <p className="text-[11px] text-slate-500 truncate">
          {item.genre.slice(0, 2).join(' · ')}
        </p>

        {/* Progress label if present */}
        {item.remainingTime && (
          <p className="text-[10px] text-cyan-400 font-mono">
            {item.remainingTime}
          </p>
        )}
      </div>
    </div>
  );
};


