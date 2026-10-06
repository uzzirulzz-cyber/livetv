import { Channel, EpgProgram, Movie, Series, SubscriptionPlan, RegisteredDevice, SupportTicket, Song } from '../types/playbeat';

export type { Channel, EpgProgram, Movie, Series, SubscriptionPlan, RegisteredDevice, SupportTicket, Song };

export const CHANNELS: Channel[] = [
  {
    id: 'ch_sky_sports_1',
    name: 'Sky Sports Premier League 4K',
    number: 101,
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Sports',
    country: 'United Kingdom',
    language: 'English',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    epgId: 'EPG_HBO_2',
    isPremium: true,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'Cyber Vanguard: Resistance 2049',
      startTime: '20:15',
      endTime: '22:45',
      progressPercentage: 45,
      synopsis: 'Sci-fi dystopian thriller following rogue cybernetic operatives defending Earth orbit.'
    },
    nextProgram: {
      title: 'Shadow Protocol: Tokyo Drift',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    epgId: 'EPG_NAT_4',
    isPremium: false,
    isLive: true,
    resolution: '4K',
    currentProgram: {
      title: 'Wild Deep: Mariana Trench Uncharted',
      startTime: '21:00',
      endTime: '22:00',
      progressPercentage: 90,
      synopsis: 'Bioluminescent deep sea biology captured using custom 8K deep-submersible robotics.'
    },
    nextProgram: {
      title: 'Serengeti Migration: The Great River Crossing',
      startTime: '22:00',
      endTime: '23:30'
    }
  },
  {
    id: 'ch_cartoon_network',
    name: 'Cartoon Network Live',
    number: 105,
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Kids',
    country: 'Global',
    language: 'Multi-lingual',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    epgId: 'EPG_CN_5',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Galactic Paws: Mission Mars Episode 14',
      startTime: '21:15',
      endTime: '22:00',
      progressPercentage: 35,
      synopsis: 'Animated adventure series following space cadet rescue puppies on solar missions.'
    },
    nextProgram: {
      title: 'Robot Friends & Magic Workshop',
      startTime: '22:00',
      endTime: '22:45'
    }
  },
  {
    id: 'ch_mtv_live',
    name: 'MTV Live Hits HD',
    number: 106,
    logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Music',
    country: 'Europe',
    language: 'English',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    epgId: 'EPG_MTV_6',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Ibiza Sunset Sessions Live DJ Set',
      startTime: '20:00',
      endTime: '23:00',
      progressPercentage: 55,
      synopsis: 'Non-stop ultra-crisp audio mix from the world top electronic music residency stages.'
    },
    nextProgram: {
      title: 'Top 40 Global Billboard Countdown',
      startTime: '23:00',
      endTime: '01:00'
    }
  },
  {
    id: 'ch_discovery_hd',
    name: 'Discovery Channel HD',
    number: 107,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Documentary',
    country: 'International',
    language: 'English',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    epgId: 'EPG_DISC_7',
    isPremium: false,
    isLive: true,
    resolution: '1080p',
    currentProgram: {
      title: 'Culinary Masters: Tokyo to Amalfi Coast',
      startTime: '21:00',
      endTime: '22:00',
      progressPercentage: 80,
      synopsis: 'Exploration of authentic regional craft and world cultures.'
    },
    nextProgram: {
      title: 'Architectural Marvels: Sustainable Coastal Engineering',
      startTime: '22:00',
      endTime: '23:00'
    }
  },
  {
    id: 'ch_espn_live',
    name: 'ESPN Sports Live',
    number: 108,
    logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Sports',
    country: 'United States',
    language: 'English',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
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

export const MOVIES: Movie[] = [
  {
    id: 'mov_tears_of_steel',
    title: 'Tears of Steel: Renaissance',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2026,
    duration: '2h 14m',
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
    description: 'In an Amsterdam transformed by rogue biotechnology and colossal orbital sentinels, a fractured brigade of ex-scientists execute one final daring temporal upload to rescue human memory.',
    director: 'Ian Hubert',
    cast: ['Derek de Lint', 'Sergio Hasselbaink', 'Denise Rebergen'],
    language: 'English (Dolby Atmos)',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    isFeatured: true,
    isTrending: true,
    isNewRelease: true
  },
  {
    id: 'mov_big_buck_hero',
    title: 'The Forest Guardian',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2025,
    duration: '1h 48m',
    rating: 'G',
    genres: ['Animation', 'Adventure', 'Family'],
    description: 'When mischievous forest woodland creatures disrupt the ancient grove equilibrium, a gentle giant rabbit engineers ingenious contraptions to protect his wilderness sanctuary.',
    director: 'Sacha Goedegebure',
    cast: ['Animated Vocal Cast', 'Orchestral Score by Jan Morgenstern'],
    language: 'Universal / English',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isTrending: true,
    isNewRelease: false
  },
  {
    id: 'mov_sintel_chronicles',
    title: 'Sintel: The Dragon Huntress',
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2026,
    duration: '1h 56m',
    rating: 'PG-13',
    genres: ['Fantasy', 'Action', 'Drama'],
    description: 'A relentless young warrior traverses frozen glacier passes and desolate deserts searching for her captive companion baby dragon, only to encounter an agonizing revelation at the dragon peak.',
    director: 'Colin Levy',
    cast: ['Halina Reijn', 'Thom Hoffman'],
    language: 'English / 4K UHD',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    isFeatured: true,
    isTrending: true,
    isNewRelease: true
  },
  {
    id: 'mov_elephants_dream',
    title: 'Elephants Dream: Synthetic Core',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2025,
    duration: '1h 35m',
    rating: 'PG',
    genres: ['Sci-Fi', 'Mystery', 'Animation'],
    description: 'Two explorers wander an infinite mechanical cathedral woven with pulsing optical cables and sentient clockwork machines that alter reality based on human thoughts.',
    director: 'Bassam Kurdali',
    cast: ['Tygo Gernandt', 'Cas Jansen'],
    language: 'English',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isTrending: false,
    isNewRelease: false
  }
];

export const SERIES_LIST: Series[] = [
  {
    id: 'ser_orbital_chronicles',
    title: 'Orbital Frontier: Station 7',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2026,
    rating: 'TV-MA',
    genres: ['Sci-Fi', 'Mystery', 'Thriller'],
    description: 'An international crew stationed aboard humanity furthest lunar-orbit observatory detects an anomalous signal pulsing from deep within Saturn rings.',
    cast: ['Marcus Sterling', 'Dr. Helena Reyes', 'Captain Kai Chen'],
    seasonCount: 2,
    status: 'Ongoing',
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Dark Signal',
        episodes: [
          {
            id: 'ep_101',
            episodeNumber: 1,
            title: 'First Contact in Silence',
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'A deep-space radio telescope captures mathematical harmonic waves originating near Enceladus.',
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'ep_102',
            episodeNumber: 2,
            title: 'Atmospheric Depressurization',
            duration: '48m',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'An unscheduled micro-meteorite shower tests the outer hull containment barriers of module Beta.',
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'ep_103',
            episodeNumber: 3,
            title: 'Quantum Entanglement',
            duration: '55m',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Communication lag vanishes unexpectedly when an experimental ion link synchronizes with the anomaly.',
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'ser_apex_velocity',
    title: 'Apex Velocity: The Circuit',
    poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&h=900&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&h=1080&q=80',
    year: 2025,
    rating: 'TV-14',
    genres: ['Documentary', 'Sports', 'Action'],
    description: 'Behind-the-scenes docuseries tracking rival privateer motorsport constructors battling multi-billion-dollar factory teams across the European Le Mans series.',
    cast: ['Sebastien Laurent', 'Nicoletta Ferrari', 'James Sterling'],
    seasonCount: 1,
    status: 'Ongoing',
    isTrending: true,
    isPopular: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Hundredths of a Second',
        episodes: [
          {
            id: 'ep_201',
            episodeNumber: 1,
            title: 'The 24-Hour Crucible',
            duration: '46m',
            thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&h=225&q=80',
            synopsis: 'Winter aero-testing at Paul Ricard uncovers unexpected brake thermal degradation.',
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isTrending: true
  }
];

