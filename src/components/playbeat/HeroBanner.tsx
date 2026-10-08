import React from "react";
import { ArrowRight, Play, Radio, Globe, MonitorPlay } from "lucide-react";
import type { Channel } from "../../types/playbeat";
import { ChannelLogo } from "../common/ChannelLogo";
interface HeroBannerProps {
  channelCount: number;
  channels: Channel[];
  onWatchChannel: (channel: Channel) => void;
  onWatchLive: () => void;
  onNavigate: (section: string) => void;
}
export function HeroBanner({
  channelCount,
  channels,
  onWatchChannel,
  onWatchLive,
  onNavigate,
}: HeroBannerProps) {
  const featured = [
    "Sports",
    "News",
    "Movies",
    "Entertainment",
    "Kids",
    "Music",
  ]
    .map((category) =>
      channels.find(
        (channel) =>
          channel.category === category &&
          !/events/i.test(channel.groupTitle || ""),
      ),
    )
    .filter((channel): channel is Channel => !!channel);
  const spotlight =
    channels.find(
      (channel) => /PTV Sports HD/i.test(channel.name) && channel.number > 400,
    ) || featured[0];
  return (
    <section className="storefront-hero">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            Welcome to your front-row seat
          </div>
          <h1 className="font-display text-[44px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[70px]">
            Every mood.
            <br />
            Every moment.
            <br />
            <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              One PlayBeat.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            From the match you can't miss to cinema that never sleeps. Discover
            live entertainment from home and around the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onWatchLive}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3.5 text-sm font-bold text-[#171006] shadow-[0_8px_30px_#f5b81a25] transition hover:bg-amber-200"
            >
              <Radio size={17} />
              Explore Live TV
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("movies")}
              className="rounded-xl border border-white/15 bg-white/[0.025] px-5 py-3.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Discover cinema
            </button>
          </div>
          <div className="mt-9 flex flex-wrap gap-5 text-[11px] text-slate-500">
            <span className="flex items-center gap-2">
              <Radio size={14} className="text-amber-200/70" />
              {channelCount
                ? `${channelCount.toLocaleString()} channels`
                : "Live television"}
            </span>
            <span className="flex items-center gap-2">
              <Globe size={14} className="text-amber-200/70" />
              Global collections
            </span>
            <span className="flex items-center gap-2">
              <MonitorPlay size={14} className="text-amber-200/70" />
              Watch anywhere
            </span>
          </div>
        </div>
        <div className="hero-display">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              The PlayBeat selection
            </span>
            <span className="rounded-full border border-amber-300/20 px-2.5 py-1 text-[9px] tracking-wider text-amber-200">
              LIVE & 24/7
            </span>
          </div>
          {spotlight ? (
            <button
              onClick={() => onWatchChannel(spotlight)}
              aria-label={`Play featured ${spotlight.name}`}
              className="hero-spotlight group"
            >
              <div className="flex items-center gap-4">
                <ChannelLogo
                  src={spotlight.logo}
                  name={spotlight.name}
                  category={spotlight.category}
                  size="xl"
                  className="!h-24 !w-24 !rounded-2xl !bg-white"
                />
                <div className="text-left">
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber-200">
                    In the spotlight
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-semibold">
                    {spotlight.name}
                  </h2>
                  <p className="mt-2 text-xs text-slate-400">
                    {spotlight.category} · Live channel
                  </p>
                </div>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-200/[0.07] px-4 py-2 text-xs font-bold text-amber-200">
                <Play size={12} fill="currentColor" />
                Watch now
              </span>
            </button>
          ) : (
            <div className="hero-spotlight min-h-52 text-slate-400">
              Your next favourite is on its way.
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {featured.slice(0, 6).map((channel) => (
              <button
                key={channel.id}
                onClick={() => onWatchChannel(channel)}
                aria-label={`Play featured ${channel.name}`}
                className="hero-mini group"
              >
                <ChannelLogo
                  src={channel.logo}
                  name={channel.name}
                  category={channel.category}
                  size="md"
                  className="mx-auto !bg-white"
                />
                <span className="mt-3 block truncate text-[10px] font-semibold text-slate-400 transition group-hover:text-amber-200">
                  {channel.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
