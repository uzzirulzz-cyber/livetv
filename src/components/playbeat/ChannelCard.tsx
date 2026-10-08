import React from "react";
import { Heart, Play, Radio } from "lucide-react";
import type { Channel } from "../../types/playbeat";
import { ChannelLogo } from "../common/ChannelLogo";
interface Props {
  channel: Channel;
  onPlay: (channel: Channel) => void;
  favorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}
export function ChannelCard({
  channel,
  onPlay,
  favorite,
  onToggleFavorite,
}: Props) {
  return (
    <article className="channel-card group" data-category={channel.category}>
      <button
        className="channel-art"
        onClick={() => onPlay(channel)}
        aria-label={`Play ${channel.name}`}
      >
        <span className="channel-art-orbit" aria-hidden="true" />
        <ChannelLogo
          src={channel.logo}
          name={channel.name}
          category={channel.category}
          size="xl"
          className="channel-logo-tile !rounded-2xl !bg-white/90 !border-white/20 shadow-2xl"
        />
        <span className="channel-live">
          <Radio size={10} />
          LIVE
        </span>
        {channel.resolution !== "Unknown" && (
          <span className="channel-quality">{channel.resolution}</span>
        )}
        <span className="channel-play">
          <Play size={20} fill="currentColor" />
        </span>
      </button>
      <div className="flex items-start gap-2 px-3 pb-4 pt-3 sm:px-4">
        <button
          onClick={() => onPlay(channel)}
          className="min-w-0 flex-1 text-left"
          aria-label={`Watch ${channel.name}`}
        >
          <h3 className="truncate text-sm font-bold text-slate-100 transition group-hover:text-amber-200">
            {channel.name}
          </h3>
          <p className="mt-1 truncate text-[11px] text-slate-400">
            {channel.groupTitle || channel.category}
          </p>
        </button>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(channel.id)}
            aria-label={`${favorite ? "Remove" : "Save"} ${channel.name} ${favorite ? "from" : "to"} watchlist`}
            aria-pressed={!!favorite}
            className={`mt-0.5 shrink-0 rounded-full p-1.5 transition hover:bg-white/10 ${favorite ? "text-amber-300" : "text-slate-500"}`}
          >
            <Heart size={16} fill={favorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
    </article>
  );
}
