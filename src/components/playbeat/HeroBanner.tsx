import React, { useState, useEffect } from 'react';
import { Movie, Series, Channel } from '../../types/playbeat';
import { Play, Plus, Check, Info, Tv, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { RELIABLE_STREAMS } from '../../services/catalogData';

interface HeroBannerProps {
  onWatchLive: () => void;
  onOpenPlans?: () => void;
  onWatchItem: (streamUrl: string, title: string, logo?: string) => void;
  onToggleMyList: (title: string) => void;
  isItemInMyList: (title: string) => boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onWatchLive,
  onOpenPlans,
  onWatchItem,
  onToggleMyList,
  isItemInMyList
}) => {
  const featuredSlides = [
    {
      id: 'f_dune',
      title: 'Dune: Part Two',
      subtitle: 'Warner Bros. Theatrical Blockbuster',
      category: 'Sci-Fi / Adventure / Drama',
      rating: 'PG-13',
      quality: '4K Ultra HD',
      audio: 'Dolby Atmos 7.1',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.',
      backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&h=1080&q=80',
      streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1
    },
    {
      id: 'f_stranger_things',
      title: 'Stranger Things',
      subtitle: 'The Duffer Brothers Phenomenon',
      category: 'Sci-Fi / Horror / Mystery',
      rating: 'TV-14',
      quality: '4K HDR',
      audio: 'Dolby 5.1 Surround',
      description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=80',
      streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2
    },
    {
      id: 'f_deadpool',
      title: 'Deadpool & Wolverine',
      subtitle: 'Marvel Studios Blockbuster',
      category: 'Action / Comedy / Sci-Fi',
      rating: 'R',
      quality: '4K IMAX Enhanced',
      audio: 'Dolby Atmos',
      description: 'Wade Wilson recruits a reluctant variant of Wolverine to save his home universe from existential collapse in this high-octane cinematic ride.',
      backdrop: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1920&h=1080&q=80',
      streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slide = featuredSlides[currentSlideIndex];
  const inMyList = isItemInMyList(slide.title);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featuredSlides.length]);

  return (
    <div className="relative w-full h-[78vh] min-h-[580px] max-h-[850px] overflow-hidden select-none bg-[#050811]">
      {/* Background Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url('${slide.backdrop}')` }}
      >
        {/* Cinematic Multi-layered Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/75 to-transparent w-full md:w-4/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
        <div className="absolute inset-0 bg-[#050811]/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-4 lg:px-8 flex flex-col justify-end pb-16 lg:pb-24 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Brand Tagline Header */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-display tracking-widest uppercase text-cyan-400 font-extrabold text-[11px] bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded">
              PLAYBEAT ENTERTAINMENT
            </span>
            <span className="text-slate-300 font-medium tracking-wide">
              Entertainment Without Limits
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px] bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Availability depends on your authorized provider</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-display text-balance drop-shadow-md">
            {slide.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 pt-1">
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold text-white border border-white/15">
              {slide.rating}
            </span>
            <span>{slide.category}</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-cyan-300 font-medium">{slide.quality}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{slide.audio}</span>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 max-w-xl text-pretty drop-shadow-xs">
            {slide.description}
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onWatchItem(slide.streamUrl, slide.title)}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-lg text-xs sm:text-sm font-extrabold shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
              <span>WATCH LIVE</span>
            </button>

            <button
              onClick={onWatchLive}
              className="flex items-center gap-2 px-5 py-3 bg-white/[0.12] hover:bg-white/[0.2] text-white border border-white/20 rounded-lg text-xs sm:text-sm font-bold backdrop-blur-md transition-all active:scale-[0.98]"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE LIVE CHANNELS</span>
            </button>

            <button
              onClick={() => onToggleMyList(slide.title)}
              className={`p-3 rounded-lg border text-xs font-semibold backdrop-blur-md transition-all ${
                inMyList
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-white/[0.08] hover:bg-white/[0.15] border-white/15 text-slate-200'
              }`}
              title={inMyList ? 'Remove from My List' : 'Add to My List'}
            >
              {inMyList ? <Check className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute right-4 lg:right-8 bottom-12 flex items-center gap-2">
          {featuredSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlideIndex === idx
                  ? 'w-7 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
