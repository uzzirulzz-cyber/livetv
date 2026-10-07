import React from 'react';
import { Tv, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onWatchLive: () => void;
  onOpenPlans?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onWatchLive, onOpenPlans }) => (
  <section className="relative overflow-hidden bg-[#050811] min-h-[420px] flex items-end">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(8,145,178,0.22),transparent_55%)]" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/50 to-transparent" />
    <div className="relative z-10 max-w-7xl w-full mx-auto px-4 lg:px-8 py-16 space-y-5">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-3 py-1 text-xs font-semibold text-cyan-200">
        <ShieldCheck className="h-4 w-4" />
        Authorized catalog content only
      </div>
      <h1 className="max-w-3xl text-4xl sm:text-6xl font-black tracking-tight text-white">
        Your entertainment, <span className="text-cyan-300">when it is ready.</span>
      </h1>
      <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
        Live channels are listed from the provider catalog. Movies and series will appear when an authorized media catalog is connected.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={onWatchLive}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300"
        >
          <Tv className="h-4 w-4" />
          Browse live channels
        </button>
        {onOpenPlans && (
          <button
            onClick={onOpenPlans}
            className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15"
          >
            View plans
          </button>
        )}
      </div>
    </div>
  </section>
);
