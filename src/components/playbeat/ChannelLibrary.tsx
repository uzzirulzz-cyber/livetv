import React, { useMemo, useState } from "react";
import { Search, Tv, ChevronDown } from "lucide-react";
import type { Channel } from "../../types/playbeat";
import { ChannelCard } from "./ChannelCard";
interface Props {
  title: string;
  subtitle: string;
  channels: Channel[];
  onWatchChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}
export function ChannelLibrary({
  title,
  subtitle,
  channels,
  onWatchChannel,
  favorites,
  onToggleFavorite,
}: Props) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [limit, setLimit] = useState(48);
  const groups = useMemo(
    () =>
      [
        ...new Set(
          channels.map((channel) => channel.groupTitle).filter(Boolean),
        ),
      ].sort(),
    [channels],
  );
  const filtered = useMemo(
    () =>
      channels.filter(
        (channel) =>
          (!group || channel.groupTitle === group) &&
          `${channel.name} ${channel.groupTitle} ${channel.country}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [channels, group, query],
  );
  return (
    <section className="mx-auto max-w-7xl space-y-7 px-4 py-10 sm:px-6 lg:px-8">
      <div className="library-heading">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
          The PlayBeat collection
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          {subtitle}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-3.5 text-slate-500"
          />
          <input
            aria-label="Search this collection"
            placeholder="Find a channel, region, or collection…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(48);
            }}
            className="w-full rounded-xl border border-white/10 bg-[#0a1425] py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-300/60"
          />
        </label>
        <select
          aria-label="Filter by collection"
          value={group}
          onChange={(event) => {
            setGroup(event.target.value);
            setLimit(48);
          }}
          className="max-w-full rounded-xl border border-white/10 bg-[#0a1425] px-4 py-3 text-sm sm:max-w-80"
        >
          <option value="">
            All collections ({channels.length.toLocaleString()})
          </option>
          {groups.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <p role="status" className="text-xs text-slate-500">
        {filtered.length.toLocaleString()} channels in this collection
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.slice(0, limit).map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onPlay={onWatchChannel}
            favorite={favorites.includes(channel.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <Tv className="mx-auto mb-4 text-amber-300" />
          <h2 className="text-lg font-bold">
            {query || group
              ? "No matches found"
              : "Your collection starts here"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {query || group
              ? "Try another search or collection."
              : "Save channels with the heart button, or explore the live TV library."}
          </p>
        </div>
      )}
      {limit < filtered.length && (
        <button
          className="mx-auto flex items-center gap-2 rounded-xl border border-amber-200/25 bg-amber-200/[0.05] px-6 py-3 text-sm text-amber-200"
          onClick={() => setLimit((value) => value + 48)}
        >
          Show more <ChevronDown size={16} />
        </button>
      )}
    </section>
  );
}
