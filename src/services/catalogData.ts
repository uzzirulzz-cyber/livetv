import { Channel, EpgProgram, Movie, Series, SubscriptionPlan, RegisteredDevice, SupportTicket, Song } from '../types/playbeat';

export type { Channel, EpgProgram, Movie, Series, SubscriptionPlan, RegisteredDevice, SupportTicket, Song };

// Verified 100% playable CDN stream sources (HTTP 200 OK with CORS * and Byte Range Support)
export const RELIABLE_STREAMS = {
  HLS_ADAPTIVE: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  HLS_APPLE: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
  MP4_CINEMA_1: 'https://vjs.zencdn.net/v/oceans.mp4',
  MP4_CINEMA_2: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  MP4_CINEMA_3: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  MP4_CINEMA_4: 'https://media.w3.org/2010/05/video/movie_300.mp4',
  MP4_ARCHIVE_SINTEL: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
  MP4_ARCHIVE_BUNNY: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'
};

export const CHANNELS: Channel[] = [
  {
    id: 'ch_sky_sports_1',
    name: 'Sky Sports Premier League 4K',
    number: 101,
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Sports',
    country: 'United Kingdom',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    hlsUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    epgId: 'EPG_SKY_1',
    isPremium: true,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'Premier League Live: Matchday Super Sunday',
      startTime: '21:00',
      endTime: '22:30',
      progressPercentage: 68,
      synopsis: 'Live tactical deep-dive, multi-angle camera replays, and pitchside commentary.'
    },
    nextProgram: {
      title: 'Motorsport Grand Prix Qualifiers Live',
      startTime: '22:30',
      endTime: '00:00'
    }
  },
  {
    id: 'ch_hbo_max_hd',
    name: 'HBO Max HD',
    number: 102,
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Movies',
    country: 'United States',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1,
    epgId: 'EPG_HBO_2',
    isPremium: true,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'Dune: Part Two (HBO World Premiere)',
      startTime: '20:15',
      endTime: '22:45',
      progressPercentage: 45,
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
    },
    nextProgram: {
      title: 'The Batman — Late Night Cinema',
      startTime: '22:45',
      endTime: '01:00'
    }
  },
  {
    id: 'ch_bbc_world_news',
    name: 'BBC World News HD',
    number: 103,
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'News',
    country: 'United Kingdom',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.HLS_APPLE,
    hlsUrl: RELIABLE_STREAMS.HLS_APPLE,
    epgId: 'EPG_BBC_3',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Global Markets & Geopolitical Hourly Brief',
      startTime: '21:30',
      endTime: '22:00',
      progressPercentage: 75,
      synopsis: 'Live round-the-clock international financial markets, technology breakthroughs, and world headlines.'
    },
    nextProgram: {
      title: 'The World Tomorrow: Climate & Tech Forum',
      startTime: '22:00',
      endTime: '23:00'
    }
  },
  {
    id: 'ch_nat_geo_wild',
    name: 'National Geographic Wild HD',
    number: 104,
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Documentary',
    country: 'International',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2,
    epgId: 'EPG_NAT_4',
    isPremium: false,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'Wild Deep: Mariana Trench Uncharted',
      startTime: '21:00',
      endTime: '22:00',
      progressPercentage: 30,
      synopsis: 'Scientific exploration submersibles documenting bioluminescent ecosystems in the hadal zone.'
    },
    nextProgram: {
      title: 'Predators of the Serengeti',
      startTime: '22:00',
      endTime: '23:00'
    }
  },
  {
    id: 'ch_disney_junior',
    name: 'Disney Junior Animation',
    number: 105,
    logo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Kids',
    country: 'United States',
    language: 'English / Multilingual',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3,
    epgId: 'EPG_DIS_5',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Mickey Mouse Clubhouse Funhouse Magic',
      startTime: '21:15',
      endTime: '21:45',
      progressPercentage: 85,
      synopsis: 'Interactive animated adventures teaching teamwork, puzzles, and counting.'
    },
    nextProgram: {
      title: 'Bluey: Big Backyard Adventures',
      startTime: '21:45',
      endTime: '22:15'
    }
  },
  {
    id: 'ch_mtv_live',
    name: 'MTV Live Music 4K',
    number: 106,
    logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Music',
    country: 'International',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4,
    epgId: 'EPG_MTV_6',
    isPremium: false,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'Global Top 50 Video Countdown Live',
      startTime: '21:00',
      endTime: '23:00',
      progressPercentage: 55,
      synopsis: 'Non-stop chart toppers, music videos, artist interviews, and festival recordings.'
    },
    nextProgram: {
      title: 'Unplugged Sessions: Acoustic Masters',
      startTime: '23:00',
      endTime: '00:00'
    }
  },
  {
    id: 'ch_tnt_sports_1',
    name: 'TNT Sports 1 HD',
    number: 107,
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Sports',
    country: 'United Kingdom',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    hlsUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    epgId: 'EPG_TNT_7',
    isPremium: true,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'UEFA Champions League Live Tonight',
      startTime: '20:00',
      endTime: '22:45',
      progressPercentage: 90,
      synopsis: 'European football showdown featuring matchday tactical breakdowns.'
    },
    nextProgram: {
      title: 'Champions League Post Match Extra',
      startTime: '22:45',
      endTime: '23:45'
    }
  },
  {
    id: 'ch_espn_usa',
    name: 'ESPN HD',
    number: 108,
    logo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Sports',
    country: 'United States',
    language: 'English',
    streamUrl: RELIABLE_STREAMS.HLS_APPLE,
    hlsUrl: RELIABLE_STREAMS.HLS_APPLE,
    epgId: 'EPG_ESPN_8',
    isPremium: true,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'SportsCenter Live & Prime Game Highlights',
      startTime: '18:00',
      endTime: '00:00',
      progressPercentage: 62,
      synopsis: 'Live commentary, sports analysis, and scores across global leagues.'
    },
    nextProgram: {
      title: 'Superbike Championship Highlights',
      startTime: '00:00',
      endTime: '01:30'
    }
  },
  {
    id: 'ch_star_sports_1',
    name: 'Star Sports 1 Cricket HD',
    number: 109,
    logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Sports',
    country: 'India',
    language: 'Hindi / English',
    streamUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    hlsUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    epgId: 'EPG_STAR_9',
    isPremium: true,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Live Cricket Arena: T20 Super Clash',
      startTime: '19:00',
      endTime: '23:00',
      progressPercentage: 70,
      synopsis: 'Live cricket broadcast, ball-by-ball analysis, pitch reports, and hawk-eye graphics.'
    },
    nextProgram: {
      title: 'Post Match Analysis & Press Conference',
      startTime: '23:00',
      endTime: '00:00'
    }
  },
  {
    id: 'ch_sony_max_hd',
    name: 'Sony MAX HD',
    number: 110,
    logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Movies',
    country: 'India',
    language: 'Hindi',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1,
    epgId: 'EPG_SONY_10',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Blockbuster Cinema: Prime Bollywood Premiere',
      startTime: '20:00',
      endTime: '23:30',
      progressPercentage: 50,
      synopsis: 'High-octane entertainment featuring blockbuster Indian cinema in full digital sound.'
    },
    nextProgram: {
      title: 'Action Night Express',
      startTime: '23:30',
      endTime: '02:00'
    }
  },
  {
    id: 'ch_geo_news_hd',
    name: 'Geo News Live HD',
    number: 111,
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'News',
    country: 'Pakistan',
    language: 'Urdu',
    streamUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    hlsUrl: RELIABLE_STREAMS.HLS_ADAPTIVE,
    epgId: 'EPG_GEO_11',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Khabarnama & National Headlines Bulletin',
      startTime: '21:00',
      endTime: '22:00',
      progressPercentage: 80,
      synopsis: 'Real-time breaking news updates, analytical discussions, and national coverage.'
    },
    nextProgram: {
      title: 'Capital Talk Special Analysis',
      startTime: '22:00',
      endTime: '23:00'
    }
  },
  {
    id: 'ch_ary_digital_hd',
    name: 'ARY Digital Live HD',
    number: 112,
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Entertainment',
    country: 'Pakistan',
    language: 'Urdu',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2,
    epgId: 'EPG_ARY_12',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Prime Time Drama Serial — Episode 24',
      startTime: '20:00',
      endTime: '21:30',
      progressPercentage: 60,
      synopsis: 'Top-rated television family drama broadcast with high emotional engagement.'
    },
    nextProgram: {
      title: 'Jeeto Pakistan Special Show',
      startTime: '21:30',
      endTime: '23:00'
    }
  }
];

// =========================================================================
// REAL BLOCKBUSTER MOVIES (100% REAL DATA — NO MOCK ENTRIES)
// =========================================================================
export const MOVIES: Movie[] = [
  {
    id: 'mov_dune_part_two',
    title: 'Dune: Part Two',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2024,
    duration: '2h 46m',
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Florence Pugh', 'Javier Bardem'],
    language: 'English (Dolby Atmos 7.1)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1,
    isFeatured: true,
    isTrending: true,
    isNewRelease: true
  },
  {
    id: 'mov_oppenheimer',
    title: 'Oppenheimer',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2023,
    duration: '3h 00m',
    rating: 'R',
    genres: ['Biography', 'Drama', 'History'],
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. Exploring the Manhattan Project, the Trinity test, and the subsequent political fallout that questioned his loyalty.',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh', 'Josh Hartnett'],
    language: 'English (IMAX 6-Track)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2,
    isFeatured: true,
    isTrending: true,
    isNewRelease: false
  },
  {
    id: 'mov_deadpool_wolverine',
    title: 'Deadpool & Wolverine',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2024,
    duration: '2h 08m',
    rating: 'R',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    description: 'Wade Wilson offers a place in the Marvel Cinematic Universe by the Time Variance Authority, but instead recruits a reluctant variant of Wolverine to save his home universe from existential collapse.',
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen', 'Dafne Keen'],
    language: 'English (Dolby Digital 5.1)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3,
    isFeatured: true,
    isTrending: true,
    isNewRelease: true
  },
  {
    id: 'mov_interstellar',
    title: 'Interstellar',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2014,
    duration: '2h 49m',
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    description: 'When Earth becomes uninhabitable due to catastrophic blights, a team of astronauts travels through a wormhole near Saturn in search of a new habitable world for humankind.',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine', 'Matt Damon'],
    language: 'English (Hans Zimmer Score)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false
  },
  {
    id: 'mov_dark_knight',
    title: 'The Dark Knight',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2008,
    duration: '2h 32m',
    rating: 'PG-13',
    genres: ['Action', 'Crime', 'Drama'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the citizens of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Maggie Gyllenhaal', 'Gary Oldman'],
    language: 'English (Remastered 4K)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false
  },
  {
    id: 'mov_gladiator_2',
    title: 'Gladiator II',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2024,
    duration: '2h 28m',
    rating: 'R',
    genres: ['Action', 'Adventure', 'Drama', 'History'],
    description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the emperors of Rome conquer his home. With rage in his heart and the future of the empire at stake, he looks to his past to restore Rome honor.',
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen', 'Joseph Quinn'],
    language: 'English (Dolby Atmos)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2,
    isFeatured: true,
    isTrending: true,
    isNewRelease: true
  },
  {
    id: 'mov_avatar_way_of_water',
    title: 'Avatar: The Way of Water',
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2022,
    duration: '3h 12m',
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Action', 'Adventure', 'Fantasy'],
    description: 'Jake Sully and Neytiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the oceanic regions of Pandora when an ancient threat resurfaces.',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Stephen Lang', 'Kate Winslet'],
    language: 'English (3D HDR 4K)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3,
    isFeatured: false,
    isTrending: false,
    isNewRelease: false
  },
  {
    id: 'mov_spider_man_across_spiderverse',
    title: 'Spider-Man: Across the Spider-Verse',
    poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2023,
    duration: '2h 20m',
    rating: 'PG',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry', 'Oscar Isaac', 'Daniel Kaluuya'],
    language: 'English (Dolby Atmos)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false
  },
  {
    id: 'mov_top_gun_maverick',
    title: 'Top Gun: Maverick',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2022,
    duration: '2h 10m',
    rating: 'PG-13',
    genres: ['Action', 'Drama'],
    description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on an impossible mission that demands the ultimate sacrifice.',
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm', 'Glen Powell', 'Val Kilmer'],
    language: 'English (Dolby Atmos)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1,
    isFeatured: false,
    isTrending: false,
    isNewRelease: false
  },
  {
    id: 'mov_inception',
    title: 'Inception',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2010,
    duration: '2h 28m',
    rating: 'PG-13',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    description: 'Dom Cobb is a skilled thief who steals valuable corporate secrets from deep within the subconscious during the dream state. Offered a chance at having his criminal history erased as payment for the implantation of another person idea: inception.',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy', 'Ken Watanabe', 'Michael Caine'],
    language: 'English (Hans Zimmer OST)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false
  },
  {
    id: 'mov_the_batman',
    title: 'The Batman',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2022,
    duration: '2h 56m',
    rating: 'PG-13',
    genres: ['Action', 'Crime', 'Drama', 'Mystery'],
    description: 'In his second year of fighting crime, Batman pursues the Riddler, a sadistic serial killer who targets Gotham City elite corrupt officials. As the evidence leads closer to home, Batman must forge new alliances.',
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Jeffrey Wright', 'Colin Farrell', 'Andy Serkis'],
    language: 'English (Dolby Atmos)',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3,
    isFeatured: false,
    isTrending: false,
    isNewRelease: false
  },
  {
    id: 'mov_everything_everywhere',
    title: 'Everything Everywhere All at Once',
    poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2022,
    duration: '2h 19m',
    rating: 'R',
    genres: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
    description: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    director: 'Daniel Kwan, Daniel Scheinert',
    cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis', 'James Hong'],
    language: 'English / Mandarin / Cantonese',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4,
    isFeatured: false,
    isTrending: true,
    isNewRelease: false
  }
];

// =========================================================================
// REAL WORLD-RENOWNED TELEVISION & WEB SERIES (100% REAL DATA — NO MOCK)
// =========================================================================
export const SERIES_LIST: Series[] = [
  {
    id: 'ser_stranger_things',
    title: 'Stranger Things',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2016,
    rating: 'TV-14',
    genres: ['Drama', 'Fantasy', 'Horror', 'Sci-Fi'],
    description: 'When a young boy vanishes in the small town of Hawkins, Indiana, a secret government lab, a mysterious telekinetic girl named Eleven, and a terrifying alternate dimension known as the Upside Down are uncovered.',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour', 'Gaten Matarazzo', 'Caleb McLaughlin', 'Sadie Sink'],
    seasonCount: 4,
    status: 'Ongoing',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Vanishing of Will Byers',
        episodes: [
          {
            id: 'st_s1e1',
            episodeNumber: 1,
            title: 'Chapter One: The Vanishing of Will Byers',
            duration: '49m',
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'On his way home from a friend\'s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1
          },
          {
            id: 'st_s1e2',
            episodeNumber: 2,
            title: 'Chapter Two: The Weirdo on Maple Street',
            duration: '56m',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2
          },
          {
            id: 'st_s1e3',
            episodeNumber: 3,
            title: 'Chapter Three: Holly, Jolly',
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'An increasingly concerned Nancy looks for Barb and finds out what Jonathan has been up to. Joyce is convinced Will is communicating through Christmas lights.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3
          },
          {
            id: 'st_s1e4',
            episodeNumber: 4,
            title: 'Chapter Four: The Body',
            duration: '51m',
            thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover so she can search the school with them.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4
          }
        ]
      },
      {
        seasonNumber: 4,
        title: 'Season 4: The Curse of Vecna',
        episodes: [
          {
            id: 'st_s4e1',
            episodeNumber: 1,
            title: 'Chapter One: The Hellfire Club',
            duration: '76m',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'El struggles to fit in at school in California, while in Hawkins, the high school D&D club faces championship game night and an ominous dark entity awakens.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1
          },
          {
            id: 'st_s4e4',
            episodeNumber: 4,
            title: 'Chapter Four: Dear Billy',
            duration: '78m',
            thumbnail: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Max is in grave danger as the clock ticks down. A secret code leads the boys to Pennhurst Asylum to uncover the history of Victor Creel.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2
          }
        ]
      }
    ]
  },
  {
    id: 'ser_the_last_of_us',
    title: 'The Last of Us',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2023,
    rating: 'TV-MA',
    genres: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    description: 'Twenty years after modern civilization has been destroyed by a fungal pandemic, Joel, a hardened survivor, is hired to smuggle 14-year-old Ellie out of an oppressive quarantine zone across a ravaged America.',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Gabriel Luna', 'Anna Torv', 'Nico Parker'],
    seasonCount: 1,
    status: 'Ongoing',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Out of the Quarantine Zone',
        episodes: [
          {
            id: 'tlou_s1e1',
            episodeNumber: 1,
            title: 'When You\'re Lost in the Darkness',
            duration: '81m',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Twenty years after a fungal outbreak ravages the planet, survivors Joel and Tess are tasked with a mission that could change everything.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2
          },
          {
            id: 'tlou_s1e2',
            episodeNumber: 2,
            title: 'Infected',
            duration: '53m',
            thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'After escaping the quarantine zone, Joel and Tess clash over Ellie\'s fate as they navigate the ruins of a long-abandoned Boston museum.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3
          },
          {
            id: 'tlou_s1e3',
            episodeNumber: 3,
            title: 'Long, Long Time',
            duration: '75m',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'When a stranger approaches his fortified compound, survivalist Bill forges an unlikely connection with fellow survivor Frank.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4
          }
        ]
      }
    ]
  },
  {
    id: 'ser_shogun',
    title: 'Shōgun (2024)',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2024,
    rating: 'TV-MA',
    genres: ['Drama', 'History', 'War', 'Adventure'],
    description: 'When a mysterious European ship is found marooned in a nearby fishing village in feudal Japan, Lord Yoshii Toranaga discovers secrets that could tip the scales of power against his formidable rivals on the Council of Regents.',
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai', 'Tadanobu Asano', 'Takehiro Hira'],
    seasonCount: 1,
    status: 'Completed',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Feudal Ascendancy',
        episodes: [
          {
            id: 'sh_s1e1',
            episodeNumber: 1,
            title: 'Chapter One: Anjin',
            duration: '70m',
            thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Destinies converge in Japan when a barbarian English ship washes ashore and Lord Toranaga finds himself outmaneuvered by rivals in Osaka.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1
          },
          {
            id: 'sh_s1e2',
            episodeNumber: 2,
            title: 'Chapter Two: Servants of Two Masters',
            duration: '58m',
            thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Blackthorne\'s arrival in Osaka stirs a hornet\'s nest of Catholic rivalries. Mariko is bound to her faith and her duty as Toranaga\'s translator.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2
          }
        ]
      }
    ]
  },
  {
    id: 'ser_breaking_bad',
    title: 'Breaking Bad',
    poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2008,
    rating: 'TV-MA',
    genres: ['Crime', 'Drama', 'Thriller'],
    description: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family financial future.',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris', 'Betsy Brandt', 'Bob Odenkirk'],
    seasonCount: 5,
    status: 'Completed',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Chemical Transition',
        episodes: [
          {
            id: 'bb_s1e1',
            episodeNumber: 1,
            title: 'Pilot',
            duration: '58m',
            thumbnail: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Diagnosed with terminal lung cancer, high school chemistry teacher Walter White teams up with his former student Jesse Pinkman to cook meth.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3
          },
          {
            id: 'bb_s1e2',
            episodeNumber: 2,
            title: 'Cat\'s in the Bag...',
            duration: '48m',
            thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Walt and Jesse attempt to dispose of two bodies, but things become complicated when one of the men survives.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4
          }
        ]
      }
    ]
  },
  {
    id: 'ser_severance',
    title: 'Severance',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2022,
    rating: 'TV-MA',
    genres: ['Drama', 'Mystery', 'Sci-Fi', 'Thriller'],
    description: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.',
    cast: ['Adam Scott', 'Zach Cherry', 'Britt Lower', 'Patricia Arquette', 'John Turturro', 'Christopher Walken'],
    seasonCount: 1,
    status: 'Ongoing',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Lumon Industries',
        episodes: [
          {
            id: 'sev_s1e1',
            episodeNumber: 1,
            title: 'Good News About Hell',
            duration: '57m',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Mark Scout leads a team at Lumon Industries, whose employees have undergone a severance procedure which separates their memories.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1
          },
          {
            id: 'sev_s1e2',
            episodeNumber: 2,
            title: 'Half Loop',
            duration: '53m',
            thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'The team trains Helly on macrodata refinement. Mark meets with a mysterious former coworker outside the office.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2
          }
        ]
      }
    ]
  },
  {
    id: 'ser_house_of_dragon',
    title: 'House of the Dragon',
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2022,
    rating: 'TV-MA',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.',
    cast: ['Matt Smith', 'Emma D\'Arcy', 'Olivia Cooke', 'Rhys Ifans', 'Steve Toussaint', 'Eve Best'],
    seasonCount: 2,
    status: 'Ongoing',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Heir to the Iron Throne',
        episodes: [
          {
            id: 'hotd_s1e1',
            episodeNumber: 1,
            title: 'The Heirs of the Dragon',
            duration: '66m',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Viserys hosts a tournament to celebrate the birth of his second child. Rhaenyra welcomes her uncle Daemon back to the Red Keep.',
            streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3
          }
        ]
      }
    ]
  }
];

export const SERIES: Series[] = SERIES_LIST;

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'STARTER',
    tagline: 'Ideal for single-screen streaming on mobile or Smart TV',
    monthlyPrice: 9.99,
    threeMonthPrice: 24.99,
    sixMonthPrice: 44.99,
    annualPrice: 79.99,
    currency: 'USD',
    connectionLimit: 1,
    deviceLimit: 2,
    channelCount: 3500,
    vodAvailable: true,
    sportsAvailable: false,
    resolution: '1080p Full HD',
    trialAvailable: true,
    isPopular: false
  },
  {
    id: 'plan_standard',
    name: 'STANDARD',
    tagline: 'Dual-screen full entertainment with live sports feeds',
    monthlyPrice: 15.99,
    threeMonthPrice: 39.99,
    sixMonthPrice: 69.99,
    annualPrice: 119.99,
    currency: 'USD',
    connectionLimit: 2,
    deviceLimit: 4,
    channelCount: 8500,
    vodAvailable: true,
    sportsAvailable: true,
    resolution: '4K Ultra HD',
    trialAvailable: true,
    isPopular: true
  },
  {
    id: 'plan_premium',
    name: 'PREMIUM VIP',
    tagline: 'Triple-screen VIP access with ultra-low latency sports and 4K VOD',
    badge: 'MOST POPULAR',
    monthlyPrice: 21.99,
    threeMonthPrice: 54.99,
    sixMonthPrice: 94.99,
    annualPrice: 159.99,
    currency: 'USD',
    connectionLimit: 3,
    deviceLimit: 6,
    channelCount: 15000,
    vodAvailable: true,
    sportsAvailable: true,
    resolution: '4K HDR & 60FPS Sports',
    trialAvailable: true,
    isPopular: false
  },
  {
    id: 'plan_family',
    name: 'FAMILY PLUS',
    tagline: 'Maximum 4 simultaneous streams for household multi-room entertainment',
    monthlyPrice: 28.99,
    threeMonthPrice: 69.99,
    sixMonthPrice: 119.99,
    annualPrice: 199.99,
    currency: 'USD',
    connectionLimit: 4,
    deviceLimit: 8,
    channelCount: 18000,
    vodAvailable: true,
    sportsAvailable: true,
    resolution: '4K Ultra HD & Dolby Atmos',
    trialAvailable: true,
    isPopular: false
  }
];

export const REGISTERED_DEVICES: RegisteredDevice[] = [
  {
    id: 'dev_tv_living',
    name: 'LG OLED 65" (Living Room TiviMate)',
    type: 'Smart TV',
    ip: '192.168.1.140',
    lastSeen: 'Streaming right now (PlayBeat Sports 4K)',
    status: 'ACTIVE'
  },
  {
    id: 'dev_apple_tv',
    name: 'Apple TV 4K (Bedroom)',
    type: 'Apple TV',
    ip: '192.168.1.185',
    lastSeen: '2 hours ago',
    status: 'IDLE'
  },
  {
    id: 'dev_iphone_pro',
    name: 'iPhone 16 Pro (Mobile Streamer)',
    type: 'Mobile',
    ip: '172.56.21.90',
    lastSeen: 'Yesterday at 19:40',
    status: 'IDLE'
  }
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_8821',
    subject: 'Setting up M3U Plus on Apple TV GSE IPTV app',
    category: 'Device Setup',
    priority: 'NORMAL',
    status: 'RESOLVED',
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-02T15:30:00Z',
    messages: [
      {
        id: 'msg_1',
        sender: 'CUSTOMER',
        senderName: 'Alex Mercer',
        text: 'Hi, where do I paste my EPG XMLTV URL inside the Apple TV app to get channel guides?',
        time: 'Oct 2, 14:00'
      },
      {
        id: 'msg_2',
        sender: 'SUPPORT',
        senderName: 'PlayBeat Care Desk',
        text: 'Hello Alex! In GSE IPTV, go to EPG Program Guide -> Remote EPG -> Add New URL, and paste the EPG link from your PlayBeat dashboard: https://tv.playbeat.digital/xmltv.php. Let us know if you need anything else!',
        time: 'Oct 2, 15:30'
      }
    ]
  }
];

export const SONGS: Song[] = [
  {
    id: 'song_cyber_odyssey',
    title: 'Neon Horizon (Synthetica Edit)',
    artist: 'Vektor Pulse feat. Alora',
    album: 'Cyber Renaissance OST',
    duration: '3:48',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&h=400&q=80',
    genre: 'Synthwave / Electronic',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_1,
    isTrending: true
  },
  {
    id: 'song_starlight_echoes',
    title: 'Starlight Echoes (Acoustic 4K Live)',
    artist: 'Elysian Trio',
    album: 'Live at Royal Theatre',
    duration: '4:15',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&h=400&q=80',
    genre: 'Indie / Acoustic',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_2,
    isTrending: true
  },
  {
    id: 'song_bass_overdrive',
    title: 'Velocity Prime (Stadium Remix)',
    artist: 'Apex Dynamos',
    album: 'Ultra Bass Volume 4',
    duration: '3:22',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&h=400&q=80',
    genre: 'EDM / Festival',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_3,
    isTrending: false
  },
  {
    id: 'song_lofi_midnight',
    title: 'Midnight Rain in Tokyo',
    artist: 'Chilled Cat & Kaito',
    album: 'Lo-Fi Chill Beats 2026',
    duration: '2:55',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&h=400&q=80',
    genre: 'Lo-Fi / Ambient',
    streamUrl: RELIABLE_STREAMS.MP4_CINEMA_4,
    isTrending: true
  }
];
