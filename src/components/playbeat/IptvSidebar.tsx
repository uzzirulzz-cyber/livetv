import {
  Compass,
  Tv,
  Film,
  Clapperboard,
  Trophy,
  Newspaper,
  Heart,
  Bookmark,
  History,
  Smartphone,
  HelpCircle,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
interface Props {
  activeSection: string;
  onNavigate: (section: string) => void;
  channelCount: number;
  movieCount: number;
  showCount: number;
}
export function IptvSidebar({
  activeSection,
  onNavigate,
  channelCount,
  movieCount,
  showCount,
}: Props) {
  const links = [
    { id: "home", label: "Browse", icon: Compass },
    { id: "live", label: "Live TV", icon: Tv },
    { id: "movies", label: "Movies", icon: Film },
    { id: "series", label: "Series", icon: Clapperboard },
    { id: "sports", label: "Sports", icon: Trophy },
    { id: "news", label: "News", icon: Newspaper },
    { id: "list", label: "Favorites", icon: Heart },
  ];
  const personal = [
    { id: "list", label: "My List", icon: Bookmark },
    { id: "recent", label: "Recently watched", icon: History },
    { id: "guide", label: "TV guide", icon: Calendar },
    { id: "devices", label: "Devices", icon: Smartphone },
    { id: "support", label: "Support", icon: HelpCircle },
  ];
  return (
    <aside className="iptv-sidebar">
      <nav aria-label="Browse library">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={activeSection === id ? "is-active" : ""}
            aria-current={activeSection === id ? "page" : undefined}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
        <hr />
        {personal.map(({ id, label, icon: Icon }) => (
          <button key={label} onClick={() => onNavigate(id)}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
      <div className="iptv-promo">
        <span className="iptv-promo-eyebrow">YOUR FRONT-ROW SEAT</span>
        <h2>PLAYBEAT</h2>
        <p>Premium experience</p>
        <ul>
          <li>
            <ArrowUpRight size={14} />
            <strong>{channelCount.toLocaleString()}</strong> Live channels
          </li>
          <li>
            <ArrowUpRight size={14} />
            <strong>{movieCount.toLocaleString()}</strong> Cinema channels
          </li>
          <li>
            <ArrowUpRight size={14} />
            <strong>{showCount.toLocaleString()}</strong> Show channels
          </li>
          <li>
            <ArrowUpRight size={14} />
            Global entertainment
          </li>
        </ul>
        <button onClick={() => onNavigate("live")}>
          Explore the lineup
          <ArrowUpRight size={15} />
        </button>
      </div>
      <p className="iptv-sidebar-note">
        Your favourites. One place.
        <br />
        Ready when you are.
      </p>
    </aside>
  );
}
