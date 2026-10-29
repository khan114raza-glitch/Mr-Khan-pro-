import { Channel, Video } from '../types/video';

export const MR_KHAN_CHANNEL: Channel = {
  id: 'mrkhan-official',
  name: 'Mr Khan',
  handle: '@mrkhan_official',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  subscribersCount: 2450000,
  isVerified: true,
  isSubscribed: true,
  bio: 'Official channel of Mr Khan. Building world-class mobile architectures, Jetpack Compose systems, Media3 ExoPlayer streaming platforms, and high-performance Kotlin applications. Contact: khan114raza@gmail.com'
};

export const ANDROID_DEV_CHANNEL: Channel = {
  id: 'android-devs',
  name: 'Android Developers',
  handle: '@androiddevelopers',
  avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  subscribersCount: 1280000,
  isVerified: true,
  isSubscribed: false,
  bio: 'The official channel for Android development news, tutorials, and architectural best practices.'
};

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid-compose-media3',
    title: 'Building Android Jetpack Compose Video Player with Media3 ExoPlayer & Ambient Lighting',
    description: 'Deep dive into architecting a production video player with Media3 ExoPlayer in Jetpack Compose. Learn how to implement adaptive bitrate streaming (HLS/DASH), dynamic ambient glow behind the player, Room database offline video caching, and clean MVVM architecture with Hilt DI.\n\nTimestamps:\n0:00 Introduction & Architecture Overview\n0:25 Media3 ExoPlayer Setup\n0:45 Adaptive Bitrate Streaming (HLS)\n1:10 Dynamic Ambient Lighting Extraction\n1:40 Room Database Offline Sync\n\nCode repository available in the Code Inspector tab!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 596,
    views: 482900,
    likes: 38400,
    dislikes: 120,
    uploadedAt: '2 days ago',
    category: 'Android Compose',
    channel: MR_KHAN_CHANNEL,
    isLiked: true,
    isDisliked: false,
    isDownloaded: true,
    cachedFileSizeMb: 142.8,
    ambientColor: '#3b82f6',
    qualityResolutions: ['4K (2160p)', '1080p60', '720p', '480p', 'Auto'],
    comments: [
      {
        id: 'c1',
        authorName: 'Alex Rivera',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        content: 'The ambient lighting extraction behind the video is absolutely gorgeous! Exactly how YouTube and modern TV apps do it.',
        likes: 1240,
        timestamp: '1 day ago',
        isLiked: true,
        replyCount: 14,
        videoTimestampSeek: 70
      },
      {
        id: 'c2',
        authorName: 'DevPioneer',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
        content: 'The Retrofit MrKhanApiService.kt with Room caching handles offline sync seamlessly. Check timestamp 0:45 for the HLS bitrates explanation.',
        likes: 428,
        timestamp: '18 hours ago',
        isLiked: false,
        replyCount: 5,
        videoTimestampSeek: 45
      },
      {
        id: 'c3',
        authorName: 'Elena Rostova',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
        content: 'Is this using MediaSessionService for background audio playback on Android 14+? Love the architecture!',
        likes: 189,
        timestamp: '5 hours ago',
        isLiked: false,
        replyCount: 2
      }
    ]
  },
  {
    id: 'vid-kotlin-coroutines',
    title: 'Advanced Kotlin Coroutines & Flow: Real-World Mobile Architecture',
    description: 'Master asynchronous reactive programming with Kotlin Coroutines, StateFlow, SharedFlow, and Cold Flows. Learn how to prevent memory leaks and handle network errors with Retrofit and Jetpack Compose state.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 653,
    views: 312000,
    likes: 24100,
    dislikes: 95,
    uploadedAt: '5 days ago',
    category: 'Kotlin',
    channel: MR_KHAN_CHANNEL,
    isLiked: false,
    isDisliked: false,
    ambientColor: '#8b5cf6',
    qualityResolutions: ['4K (2160p)', '1080p60', '720p', '480p', 'Auto'],
    comments: [
      {
        id: 'c4',
        authorName: 'Mark Chen',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        content: 'Clear explanation of flowOn(Dispatchers.IO) versus collect in viewModelScope. Subscribed!',
        likes: 310,
        timestamp: '3 days ago',
        isLiked: false
      }
    ]
  },
  {
    id: 'vid-4k-cinematic',
    title: 'Cosmic Horizons: 4K HDR Nature & Deep Space Cinematic',
    description: 'Ultra high-definition visual showcase testing Media3 ExoPlayer 4K 60FPS playback rendering, HDR tone mapping, and real-time color extraction.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 90,
    views: 890400,
    likes: 72300,
    dislikes: 310,
    uploadedAt: '1 week ago',
    category: '4K HDR',
    channel: MR_KHAN_CHANNEL,
    ambientColor: '#f97316',
    qualityResolutions: ['4K (2160p)', '1080p60', '720p', '480p', 'Auto'],
    comments: []
  },
  {
    id: 'vid-hilt-di-clean',
    title: 'Hilt Dependency Injection in Jetpack Compose: Clean Architecture',
    description: 'Step-by-step setup of Dagger Hilt in multi-module Android apps. Injecting Retrofit MrKhanApiService, Room VideoDatabase, and ViewModels cleanly.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 734,
    views: 198500,
    likes: 18200,
    dislikes: 45,
    uploadedAt: '2 weeks ago',
    category: 'Architecture',
    channel: ANDROID_DEV_CHANNEL,
    ambientColor: '#10b981',
    qualityResolutions: ['1080p60', '720p', '480p', 'Auto'],
    comments: []
  },
  {
    id: 'vid-room-offline',
    title: 'Offline-First Android: Room Database Caching with Coroutines Flow',
    description: 'Learn how to architect an offline-first video platform that seamlessly switches between network API and cached Room entities.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    durationSeconds: 120,
    views: 145000,
    likes: 12900,
    dislikes: 30,
    uploadedAt: '3 weeks ago',
    category: 'Android Compose',
    channel: MR_KHAN_CHANNEL,
    ambientColor: '#06b6d4',
    qualityResolutions: ['1080p60', '720p', '480p', 'Auto'],
    comments: []
  },
  {
    id: 'vid-shorts-1',
    title: 'Kotlin 2.0 K2 Compiler in 60 Seconds! ⚡',
    description: 'Instant build speed improvements in Kotlin 2.0 with the new K2 frontend compiler. #Kotlin #Android #MrKhan',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    durationSeconds: 58,
    views: 923000,
    likes: 84200,
    dislikes: 410,
    uploadedAt: '3 days ago',
    category: 'Shorts',
    channel: MR_KHAN_CHANNEL,
    isShort: true,
    ambientColor: '#a855f7',
    qualityResolutions: ['1080p60', '720p', 'Auto'],
    comments: []
  },
  {
    id: 'vid-shorts-2',
    title: 'Compose Material 3 Dynamic Color Magic 🎨',
    description: 'How dynamic color theming extracts wallpaper hues on Android 12+. #JetpackCompose #Material3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    durationSeconds: 45,
    views: 654000,
    likes: 61800,
    dislikes: 220,
    uploadedAt: '6 days ago',
    category: 'Shorts',
    channel: MR_KHAN_CHANNEL,
    isShort: true,
    ambientColor: '#ec4899',
    qualityResolutions: ['1080p60', '720p', 'Auto'],
    comments: []
  }
];

export const CATEGORIES = [
  'All',
  'Android Compose',
  'Kotlin',
  'Architecture',
  '4K HDR',
  'Media3 ExoPlayer',
  'Shorts'
];
