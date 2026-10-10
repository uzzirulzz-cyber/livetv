import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from './types';
import { MediaCard } from './MediaCard';

interface MediaSectionProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  items: MediaItem[];
  onWatch: (item: MediaItem) => void;
  onToggleFavorite: (item: MediaItem) => void;
  favoritesList: MediaItem[];
  onSelect: (item: MediaItem) => void;
  aspectRatio?: 'poster' | 'landscape';
  badgeText?: string;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  subtitle,
  emoji,
  items,
  onWatch,
  onToggleFavorite,
  favoritesList,
  onSelect,
  aspectRatio = 'poster',
  badgeText,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -650 : 650;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {emoji && <span className="text-xl sm:text-2xl">{emoji}</span>}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                {title}
              </h2>
              {badgeText && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Media Cards Horizontal Tray */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
      >
        {items.map((item) => {
          const isFavorite = favoritesList.some((fav) => fav.id === item.id);
          return (
            <MediaCard
              key={item.id}
              item={item}
              onWatch={onWatch}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite}
              onSelect={onSelect}
              aspectRatio={aspectRatio}
            />
          );
        })}
      </div>
    </section>
  );
};

