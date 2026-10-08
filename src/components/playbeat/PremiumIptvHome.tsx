import { useMemo, useState } from "react";
import {
  Play,
  Heart,
  Search,
  ChevronRight,
  Globe,
  Radio,
  Trophy,
  Tv,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import type { Channel } from "../../types/playbeat";
import { ChannelLogo } from "../common/ChannelLogo";
import { ChannelCard } from "./ChannelCard";
import lifestyleArtwork from "../../assets/playbeat-lifestyle-v1.webp";
interface Props {
  channels: Channel[];
  favorites: string[];
  onWatchChannel: (channel: Channel) => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (section: string) => void;
}
const categories = [
  "All",
  "Sports",
  "News",
  "Movies",
  "Kids",
  "Music",
  "Entertainment",
];
export function PremiumIptvHome({
  channels,
  favorites,
  onWatchChannel,
  onToggleFavorite,
  onNavigate,
}: Props) {
  const [category, setCategory] = useState("All"),
    [query, setQuery] = useState(""),
    [country, setCountry] = useState(""),
    [limit, setLimit] = useState(40);
  const featured =
    channels.find(
      (c) => /ptv sports hd/i.test(c.name) && Number(c.streamId) > 400,
    ) ||
    channels.find((c) => c.category === "Sports") ||
    channels[0];
  const filtered = useMemo(
    () =>
      channels.filter(
        (c) =>
          (category === "All" || c.category === category) &&
          (!country || c.country === country) &&
          `${c.name} ${c.groupTitle} ${c.country}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [channels, category, query, country],
  );
  const selection = useMemo(() => {
    const picks: Channel[] = [];
    if (category === "All" && !query && !country) {
      if (featured) picks.push(featured);
      for (const cat of [
        "News",
        "Movies",
        "Entertainment",
        "Kids",
        "Music",
        "Documentary",
        "Sports",
      ]) {
        const item = filtered.find(
          (c) => c.category === cat && !picks.some((p) => p.id === c.id),
        );
        if (item) picks.push(item);
      }
    }
    return picks.length ? picks : filtered.slice(0, 8);
  }, [filtered, category, query, country, featured]);
  const regions = useMemo(
    () =>
      [...new Set(channels.map((c) => c.country))].map((name) => ({
        name,
        count: channels.filter((c) => c.country === name).length,
      })),
    [channels],
  );
  const filterCategory = (value: string) => {
    setCategory(value);
    setLimit(40);
  };
  return (
    <div className="iptv-home">
      <div className="iptv-main-content">
        <section
          className="iptv-life-banner"
          aria-label="The PlayBeat lifestyle"
        >
          <img
            src={lifestyleArtwork}
            alt="Adult friends celebrating at a sunset beach party beside a sports car"
            fetchPriority="high"
            width={1916}
            height={821}
          />
          <div className="iptv-life-copy">
            <span className="iptv-life-eyebrow">
              <span className="iptv-life-beats" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              TURN UP THE MOMENT
            </span>
            <h2>
              Live a little.
              <br />
              <span>Watch a lot.</span>
            </h2>
            <p>Big nights. Good company. Endless entertainment.</p>
            <button onClick={() => onNavigate("live")}>
              Discover your lineup
              <ArrowUpRight size={15} />
            </button>
          </div>
          <span className="iptv-life-signature">THE PLAYBEAT LIFE</span>
        </section>
        <div className="iptv-page-heading">
          <div>
            <span className="iptv-eyebrow">PREMIUM IPTV / LIVE & 24/7</span>
            <h1>
              Your world. <span>Now playing.</span>
            </h1>
            <p>Discover your next favourite channel with PlayBeat.</p>
          </div>
          <span className="iptv-library-count">
            <Radio size={12} />
            {channels.length.toLocaleString()} channels
          </span>
        </div>
        <div className="iptv-feature-row">
          <button
            className="iptv-feature"
            onClick={() => featured && onWatchChannel(featured)}
            disabled={!featured}
            aria-label={
              featured
                ? `Play featured ${featured.name}`
                : "Loading featured channel"
            }
          >
            <div className="iptv-feature-orbit" aria-hidden="true" />
            <span className="iptv-live-badge">
              <Radio size={11} />
              LIVE
            </span>
            <span className="iptv-feature-category">
              {featured?.category || "PlayBeat selection"}
            </span>
            {featured && (
              <ChannelLogo
                src={featured.logo}
                name={featured.name}
                category={featured.category}
                size="xl"
                className="iptv-feature-logo"
              />
            )}
            <span className="iptv-feature-text">
              <small>IN THE SPOTLIGHT</small>
              <strong>{featured?.name || "Your lineup is loading"}</strong>
              <span>
                {featured?.groupTitle ||
                  "Live entertainment from around the world"}
              </span>
              <span className="iptv-gold-cta">
                <Play size={13} fill="currentColor" />
                Watch live
              </span>
            </span>
            <span className="iptv-feature-play" aria-hidden="true">
              <Play size={25} fill="currentColor" />
            </span>
          </button>
          <div className="iptv-now-panel">
            <div className="iptv-panel-tab">
              Channel spotlight
              <Sparkles size={13} />
            </div>
            {featured && (
              <ChannelLogo
                src={featured.logo}
                name={featured.name}
                category={featured.category}
                size="xl"
                className="iptv-now-logo"
              />
            )}
            <h2>{featured?.name || "PlayBeat Live"}</h2>
            <p>{featured?.category || "Entertainment"} · Live broadcast</p>
            <span className="iptv-now-description">
              Open the player to watch live and explore the full lineup.
            </span>
            <button
              onClick={() => featured && onToggleFavorite(featured.id)}
              disabled={!featured}
              aria-pressed={!!featured && favorites.includes(featured.id)}
            >
              <Heart
                size={14}
                fill={
                  featured && favorites.includes(featured.id)
                    ? "currentColor"
                    : "none"
                }
              />
              {featured && favorites.includes(featured.id)
                ? "In Favorites"
                : "Add to Favorites"}
            </button>
            <button onClick={() => onNavigate("guide")}>
              <Tv size={14} />
              Browse TV guide
            </button>
          </div>
        </div>
        <div className="iptv-section-title">
          <h2>
            <Trophy size={18} />
            Popular channels
          </h2>
          <button onClick={() => onNavigate("live")}>
            View all
            <ChevronRight size={14} />
          </button>
        </div>
        <div
          className="iptv-category-pills"
          aria-label="Popular channel categories"
        >
          {categories.map((value) => (
            <button
              key={value}
              aria-pressed={category === value}
              className={category === value ? "is-active" : ""}
              onClick={() => filterCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {country && (
          <button className="iptv-region-clear" onClick={() => setCountry("")}>
            Showing {country} · Clear region ×
          </button>
        )}
        <div className="iptv-popular-grid">
          {selection.map((c) => (
            <ChannelCard
              key={c.id}
              channel={c}
              onPlay={onWatchChannel}
              favorite={favorites.includes(c.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
        {!selection.length && channels.length > 0 && (
          <p className="iptv-empty">
            No channels match. Try another category or search.
          </p>
        )}
        <div className="iptv-section-title">
          <h2>
            <Globe size={18} />
            Regional channels
          </h2>
          <span>From home and beyond</span>
        </div>
        <div className="iptv-region-grid">
          {regions.map((region) => (
            <button
              key={region.name}
              aria-pressed={country === region.name}
              className={country === region.name ? "is-active" : ""}
              onClick={() => {
                setCountry(country === region.name ? "" : region.name);
                setCategory("All");
                setLimit(40);
              }}
            >
              <Globe size={17} />
              <strong>{region.name}</strong>
              <span>{region.count.toLocaleString()} channels</span>
              <ArrowUpRight size={13} className="iptv-region-arrow" />
            </button>
          ))}
        </div>
        <div className="iptv-cinema-strip">
          <div>
            <Sparkles size={20} />
            <span>
              <strong>Stay for the cinema.</strong>
              <small>Live movie channels, around the clock.</small>
            </span>
          </div>
          <button onClick={() => onNavigate("movies")}>
            Explore movies
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <aside className="iptv-all-channels">
        <div className="iptv-all-heading">
          <h2>All channels</h2>
          <span>{channels.length.toLocaleString()}</span>
        </div>
        <label className="iptv-lineup-search">
          <Search size={15} />
          <input
            aria-label="Search in channels"
            placeholder="Search in channels…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(40);
            }}
          />
        </label>
        <div className="iptv-lineup-pills">
          {["All", "Sports", "News"].map((value) => (
            <button
              key={value}
              onClick={() => filterCategory(value)}
              className={category === value ? "is-active" : ""}
              aria-pressed={category === value}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="iptv-result-count" role="status">
          {filtered.length.toLocaleString()} channels
          {country ? ` · ${country}` : ""}
        </p>
        <div className="iptv-lineup-list">
          {filtered.slice(0, limit).map((c) => (
            <button
              className="iptv-lineup-row"
              key={c.id}
              onClick={() => onWatchChannel(c)}
              aria-label={`Watch lineup ${c.name}`}
            >
              <span className="iptv-channel-number">{c.number}</span>
              <ChannelLogo
                src={c.logo}
                name={c.name}
                category={c.category}
                size="sm"
              />
              <span className="iptv-channel-meta">
                <strong>{c.name}</strong>
                <small>{c.groupTitle || c.category}</small>
              </span>
              <span className="iptv-row-play">
                <Play size={12} fill="currentColor" />
              </span>
            </button>
          ))}
          {!filtered.length && (
            <p className="iptv-empty">No matching channels.</p>
          )}
          {limit < filtered.length && (
            <button
              className="iptv-more-lineup"
              onClick={() => setLimit(limit + 40)}
            >
              Show more channels
              <ChevronRight size={14} />
            </button>
          )}
        </div>
        <div className="iptv-lineup-foot">
          <Radio size={13} />
          <span>Select a channel to open the player.</span>
        </div>
      </aside>
    </div>
  );
}
