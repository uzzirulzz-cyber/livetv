export type MediaType = 'movie' | 'series' | 'channel' | 'sports' | 'music';

export interface MediaItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  category: string;
  genre: string[];
  year: number;
  rating: number; // e.g. 8.8
  duration?: string; // e.g. "2h 24m" or "Season 3"
  quality: '4K HDR' | '4K UHD' | 'FHD 1080p' | 'HD 720p' | 'Source';
  posterUrl: string;
  backdropUrl?: string;
  description: string;
  cast?: string[];
  director?: string;
  videoUrl?: string;
  trailerUrl?: string;
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isHit?: boolean;
  live?: boolean;
  progressPercent?: number; // for Continue Watching
  remainingTime?: string;
}


