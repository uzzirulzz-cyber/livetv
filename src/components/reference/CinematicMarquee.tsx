import React from 'react';
import { Film, Tv, Layers, Sparkles, MonitorSmartphone } from 'lucide-react';

interface CinematicMarqueeProps {
  onSelectCategory: (category: string) => void;
}

export const CinematicMarquee: React.FC<CinematicMarqueeProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="relative my-8 sm:my-14 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto overflow-hidden">
      {/* Cinematic Marquee Frame with neon glow */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#080d1e] via-[#050813] to-[#04060d] border border-cyan-500/20 p-8 sm:p-12 shadow-[0_0_80px_rgba(6,182,212,0.12)] text-center overflow-hidden">
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-cyan-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Center Content */}
        <div className="relative z-10 space-y-4 max-w-4xl mx-auto">
          {/* Subtitle kicker */}
          <div className="text-xs sm:text-sm font-display font-extrabold tracking-[0.3em] uppercase text-slate-300">
            PREMIUM STREAMING SHOWCASE
          </div>

          {/* Main 3D Metallic Golden Typography matching Reference Image */}
          <div className="space-y-0 select-none">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              MOVIES &amp;
            </h2>
            <div className="text-4xl sm:text-7xl md:text-8xl font-display font-black tracking-wider uppercase bg-gradient-to-b from-[#FFF2A3] via-[#F5B800] to-[#A36A00] bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(245,184,0,0.45)] leading-tight">
              WEB SERIES
            </div>
          </div>

          {/* Blue Neon Bar & Sub-headline from Reference Image */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono font-bold tracking-widest text-slate-300 uppercase">
              <span className="text-amber-400">TRENDING</span>
              <span className="text-cyan-400">·</span>
              <span className="text-white">NEW RELEASES</span>
              <span className="text-cyan-400">·</span>
              <span className="text-cyan-300">ON DEMAND</span>
            </div>

            {/* Glowing neon light beam */}
            <div className="relative w-64 sm:w-96 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_15px_#22d3ee]">
              <div className="absolute inset-0 bg-white blur-[1px] opacity-75" />
            </div>
          </div>
        </div>

        {/* Bottom Feature Pill Badges from Reference Image */}
        <div className="relative z-10 mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 text-center">
          {/* 1. Blockbuster Movies */}
          <button
            onClick={() => onSelectCategory('movies')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-amber-500/20 hover:border-amber-400/50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                BLOCKBUSTER
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                MOVIES
              </div>
            </div>
          </button>

          {/* 2. Trending Series */}
          <button
            onClick={() => onSelectCategory('series')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                TRENDING
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                SERIES
              </div>
            </div>
          </button>

          {/* 3. All Genres */}
          <button
            onClick={() => onSelectCategory('genres')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-amber-500/20 hover:border-amber-400/50 transition-all flex flex-col items-center gap-2 group cursor-pointer col-span-2 md:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                ALL GENRES
              </div>
              <div className="text-[10px] font-medium text-slate-400 truncate max-w-[140px]">
                ACTION · DRAMA · SCI-FI
              </div>
            </div>
          </button>

          {/* 4. High Quality Streaming */}
          <button
            onClick={() => onSelectCategory('quality')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform font-mono font-bold text-xs">
              HD
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                HIGH QUALITY
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                PROVIDER QUALITY
              </div>
            </div>
          </button>

          {/* 5. Watch Anywhere Any Device */}
          <button
            onClick={() => onSelectCategory('devices')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-amber-500/20 hover:border-amber-400/50 transition-all flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <MonitorSmartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                WATCH ANYWHERE
              </div>
              <div className="text-[11px] font-medium text-slate-400">
                ANY DEVICE
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

