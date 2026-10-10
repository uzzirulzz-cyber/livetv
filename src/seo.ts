export const LIVE_SITE = 'https://playbeat.live';
export const LIVE_PAGES: Record<string, { title: string; description: string; heading: string; text: string }> = {
  '/': {
    title: 'PlayBeat Live | Live TV, Movies & Web Series',
    description: 'Explore live TV channels on PlayBeat Live. Browse news, sports and entertainment, search the available channel library and save favourites.',
    heading: 'Discover PlayBeat Live',
    text: 'Browse the live channel library, explore categories and keep favourite channels together. Channel listings and stream availability depend on the connected provider and can change.'
  },
  '/live-tv': {
    title: 'Live TV Channels Online | PlayBeat Live',
    description: 'Browse available live TV channels on PlayBeat Live. Search news, sports and entertainment feeds, filter by category and open a channel in the player.',
    heading: 'Explore live television',
    text: 'Find a channel by name or browse available categories. Select Play to open the player. A listing does not guarantee a feed is currently available.'
  },
  '/movies': {
    title: 'Movies | PlayBeat Live',
    description: 'See what is available in the PlayBeat Live movie section. Titles and playback depend on the connected provider catalogue.',
    heading: 'Explore movies',
    text: 'Movie titles are supplied by the connected catalogue. Availability can vary; if the catalogue is not connected, this section shows its current status.'
  },
  '/series': {
    title: 'Web Series | PlayBeat Live',
    description: 'Explore web series available through the connected PlayBeat Live catalogue, including supported seasons and episodes.',
    heading: 'Explore web series',
    text: 'Show, season and episode availability depends on the connected catalogue. If the catalogue is unavailable, the page displays its connection status.'
  }
};
export function liveTab(path: string): 'live' | 'movies' | 'series' { return path === '/movies' ? 'movies' : path === '/series' ? 'series' : 'live'; }
export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)); }
export function liveSitemap() { return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(LIVE_PAGES).map(path => `<url><loc>${LIVE_SITE}${path}</loc></url>`).join('')}</urlset>`; }
