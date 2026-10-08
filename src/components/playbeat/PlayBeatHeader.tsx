import { useState } from "react";
import { Search, Bookmark, Menu, X, Lock } from "lucide-react";
import { PremiumIptvLogo } from "../common/PremiumIptvLogo";
interface Props {
  activeSection: string;
  onNavigate: (section: string) => void;
  myListCount: number;
  channelCount: number;
  catalogLoading: boolean;
  onOpenSearch: () => void;
  onNavigateToAdmin: () => void;
}
const navigation = [
  ["home", "Home"],
  ["live", "Live TV"],
  ["movies", "Movies"],
  ["series", "Series"],
  ["sports", "Sports"],
  ["news", "News"],
];
export function PlayBeatHeader({
  activeSection,
  onNavigate,
  myListCount,
  channelCount,
  catalogLoading,
  onOpenSearch,
  onNavigateToAdmin,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (section: string) => {
    onNavigate(section);
    setMenuOpen(false);
  };
  return (
    <header className="iptv-header">
      <div className="iptv-topbar">
        <button
          className="shrink-0"
          onClick={() => navigate("home")}
          aria-label="PlayBeat home"
        >
          <PremiumIptvLogo />
        </button>
        <button
          className="iptv-global-search"
          onClick={onOpenSearch}
          aria-label="Search entertainment library"
        >
          <Search size={16} />
          <span>Search channels, movies, series…</span>
        </button>
        <nav aria-label="Main navigation" className="iptv-topnav">
          {navigation.map(([id, label]) => (
            <button
              key={id}
              className={activeSection === id ? "is-active" : ""}
              aria-current={activeSection === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="iptv-header-actions">
          <button
            className="iptv-watchlist"
            onClick={() => navigate("list")}
            aria-label={`My List${myListCount ? ` ${myListCount}` : ""}`}
          >
            <Bookmark size={17} />
            <span>My List</span>
            {myListCount > 0 && <b>{myListCount}</b>}
          </button>
          <button
            className="iptv-admin"
            onClick={onNavigateToAdmin}
            aria-label="Admin"
          >
            <Lock size={16} />
          </button>
          <button
            className="iptv-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav aria-label="Mobile navigation" className="iptv-mobile-nav">
          {[
            ...navigation,
            ["list", "Favorites"],
            ["recent", "Recently watched"],
            ["guide", "TV Guide"],
            ["devices", "Devices"],
            ["support", "Support"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={activeSection === id ? "is-active" : ""}
            >
              {label}
            </button>
          ))}
          <span>
            {catalogLoading
              ? "Loading library…"
              : `${channelCount.toLocaleString()} live channels`}
          </span>
        </nav>
      )}
    </header>
  );
}
