export type StorefrontSection =
  | "home" | "live" | "movies" | "series" | "sports" | "news" | "music"
  | "guide" | "list" | "search" | "profile" | "recent" | "devices" | "support" | "account";

const sectionByPath: Record<string, StorefrontSection> = {
  "/": "home", "/store": "home", "/live": "live", "/live-tv": "live",
  "/movies": "movies", "/series": "series", "/sports": "sports", "/news": "news",
  "/music": "music", "/tv-guide": "guide", "/guide": "guide",
  "/my-list": "list", "/favorites": "list", "/search": "search",
  "/profile": "profile", "/recent": "recent", "/devices": "devices",
  "/support": "support", "/account": "account",
};

const pathBySection: Record<StorefrontSection, string> = {
  home: "/", live: "/live", movies: "/movies", series: "/series",
  sports: "/sports", news: "/news", music: "/music", guide: "/tv-guide",
  list: "/my-list", search: "/search", profile: "/profile", recent: "/recent",
  devices: "/devices", support: "/support", account: "/account",
};

export function storefrontSectionFromPath(pathname: string): StorefrontSection {
  const path = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  return sectionByPath[path] || "home";
}

export function storefrontPathForSection(section: string): string {
  return pathBySection[section as StorefrontSection] || "/";
}
