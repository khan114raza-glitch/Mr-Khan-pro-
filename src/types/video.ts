export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscribersCount: number;
  isVerified: boolean;
  isSubscribed: boolean;
  bio?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  content: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
  replyCount?: number;
  videoTimestampSeek?: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  views: number;
  likes: number;
  dislikes: number;
  uploadedAt: string;
  category: string;
  channel: Channel;
  isShort?: boolean;
  isLive?: boolean;
  qualityResolutions: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
  isDownloaded?: boolean;
  cachedFileSizeMb?: number;
  comments: Comment[];
  ambientColor?: string;
}

export type ActiveTab = 'home' | 'shorts' | 'subscriptions' | 'downloads' | 'channel' | 'code-inspector';
export type DeviceMode = 'desktop' | 'mobile';
export type QualityResolution = 'Auto' | '4K (2160p)' | '1080p60' | '720p' | '480p';
