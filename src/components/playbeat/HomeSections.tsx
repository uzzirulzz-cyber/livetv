import React from "react";
import {
  ArrowUpRight,
  Radio,
  Trophy,
  Film,
  Music,
  Smile,
  Globe,
  Sparkles,
  Clock,
} from "lucide-react";
import type { Channel, Movie, Series } from "../../types/playbeat";
import { ChannelCard } from "./ChannelCard";
interface HomeSectionsProps {
  channels: Channel[];
  recentChannelIds?: string[];
  movies: Movie[];
  series: Series[];
  onWatchChannel: (channel: Channel) => void;
  onWatchMovie: (movie: Movie) => void;
  onSelectSeries: (series: Series) => void;
  onToggleMyList: (title: string) => void;
  isItemInMyList: (title: string) => boolean;
  onNavigateSection: (section: string) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}
export function HomeSections({
  channels,
  recentChannelIds = [],
  onWatchChannel,
  onNavigateSection,
  favorites = [],
  onToggleFavorite,
}: HomeSectionsProps) {
  const recent = recentChannelIds
    .map((id) => channels.find((channel) => channel.id === id))
    .filter((channel): channel is Channel => !!channel);
  const sections = [
    {
      title: "Recently watched",
      caption: "Pick up your favourite live feeds.",
      icon: Clock,
      list: recent,
      destination: "live",
    },
    {
      title: "Made for your watchlist",
      caption: "Your saved channels in one place.",
      icon: Sparkles,
      list: channels.filter((channel) => favorites.includes(channel.id)),
      destination: "list",
    },
    {
      title: "Pakistan, live",
      caption: "News, dramas, and home favourites.",
      icon: Radio,
      list: channels.filter(
        (channel) =>
          channel.country === "Pakistan" &&
          ["News", "Sports", "Entertainment"].includes(channel.category),
      ),
      destination: "live",
    },
    {
      title: "The world of sport",
      caption: "Cricket, football, and sporting events.",
      icon: Trophy,
      list: channels.filter(
        (channel) =>
          channel.category === "Sports" &&
          !/events/i.test(channel.groupTitle || ""),
      ),
      destination: "live",
    },
    {
      title: "Cinema never sleeps",
      caption: "Live movie channels and 24/7 cinema collections.",
      icon: Film,
      list: channels.filter((channel) => channel.category === "Movies"),
      destination: "movies",
    },
    {
      title: "Stay in the know",
      caption: "A window into the latest headlines.",
      icon: Globe,
      list: channels.filter((channel) => channel.category === "News"),
      destination: "live",
    },
    {
      title: "Something for everyone",
      caption: "Entertainment, shows, and familiar faces.",
      icon: Sparkles,
      list: channels.filter((channel) => channel.category === "Entertainment"),
      destination: "series",
    },
    {
      title: "Little screens, big adventures",
      caption: "Kids channels and animation.",
      icon: Smile,
      list: channels.filter((channel) => channel.category === "Kids"),
      destination: "live",
    },
    {
      title: "Turn up the music",
      caption: "Music television from around the world.",
      icon: Music,
      list: channels.filter((channel) => channel.category === "Music"),
      destination: "live",
    },
  ].filter((section) => section.list.length > 0);
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            title: "Live television",
            description: "A world of channels",
            icon: Radio,
            section: "live",
          },
          {
            title: "Cinema",
            description: "Movies around the clock",
            icon: Film,
            section: "movies",
          },
          {
            title: "Shows & entertainment",
            description: "Find a new favourite",
            icon: Sparkles,
            section: "series",
          },
          {
            title: "Your watchlist",
            description: "Saved for later",
            icon: Clock,
            section: "list",
          },
        ].map(({ title, description, icon: Icon, section }) => (
          <button
            key={section}
            onClick={() => onNavigateSection(section)}
            className="collection-link group"
          >
            <Icon size={23} className="mb-4 text-amber-300" />
            <span className="block text-sm font-bold">{title}</span>
            <span className="mt-1 block text-xs text-slate-500">
              {description}
            </span>
            <ArrowUpRight
              size={16}
              className="absolute right-4 top-4 text-slate-600 transition group-hover:text-amber-200"
            />
          </button>
        ))}
      </div>
      {sections.map(({ title, caption, icon: Icon, list, destination }) => (
        <section key={title}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Icon size={17} className="text-amber-300" />
                <h2 className="font-display text-xl font-semibold sm:text-2xl">
                  {title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 sm:text-sm">{caption}</p>
            </div>
            <button
              onClick={() => onNavigateSection(destination)}
              className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-amber-200"
            >
              Explore <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2 sm:gap-4">
            {list.slice(0, 12).map((channel) => (
              <div
                key={channel.id}
                className="w-[164px] shrink-0 snap-start sm:w-[210px] lg:w-[224px]"
              >
                <ChannelCard
                  channel={channel}
                  onPlay={onWatchChannel}
                  favorite={favorites.includes(channel.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
