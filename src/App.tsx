import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Sparkles, 
  WifiOff, 
  CheckCircle2, 
  Layers, 
  Smartphone, 
  Monitor,
  Code
} from 'lucide-react';
import { Video, ActiveTab, DeviceMode } from './types/video';
import { INITIAL_VIDEOS, CATEGORIES, MR_KHAN_CHANNEL } from './data/mockData';
import { TopNavigation } from './components/layout/TopNavigation';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { CustomVideoPlayer } from './components/player/CustomVideoPlayer';
import { VideoActions } from './components/player/VideoActions';
import { CommentsSection } from './components/player/CommentsSection';
import { VideoCard } from './components/feed/VideoCard';
import { ShortsViewer } from './components/shorts/ShortsViewer';
import { OfflineCacheView } from './components/downloads/OfflineCacheView';
import { AndroidCodeExplorer } from './components/code/AndroidCodeExplorer';
import { ChannelView } from './components/channel/ChannelView';
import { UploadModal } from './components/studio/UploadModal';
import { ApkInstallGuideModal } from './components/apk/ApkInstallGuideModal';
import { formatViews } from './utils/formatters';

export default function App() {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<Video>(INITIAL_VIDEOS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isApkGuideOpen, setIsApkGuideOpen] = useState<boolean>(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  // Filtered videos based on category, search, and offline mode
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      // In offline mode, only downloaded videos are accessible
      if (isOfflineSimulated && !v.isDownloaded) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(query);
        const matchesChannel = v.channel.name.toLowerCase().includes(query);
        const matchesCategory = v.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesChannel && !matchesCategory) return false;
      }
      // Category filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Shorts') return v.isShort;
        return v.category === selectedCategory;
      }
      return !v.isShort;
    });
  }, [videos, searchQuery, selectedCategory, isOfflineSimulated]);

  const shortsList = useMemo(() => {
    return videos.filter(v => v.isShort);
  }, [videos]);

  // Handle Like Toggle
  const handleLikeToggle = () => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === activeVideo.id) {
          const isLiked = !v.isLiked;
          const updated = {
            ...v,
            isLiked,
            isDisliked: false,
            likes: isLiked ? v.likes + 1 : Math.max(0, v.likes - 1)
          };
          setActiveVideo(updated);
          return updated;
        }
        return v;
      })
    );
  };

  // Handle Dislike Toggle
  const handleDislikeToggle = () => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === activeVideo.id) {
          const isDisliked = !v.isDisliked;
          const updated = {
            ...v,
            isDisliked,
            isLiked: false,
            likes: v.isLiked ? Math.max(0, v.likes - 1) : v.likes
          };
          setActiveVideo(updated);
          return updated;
        }
        return v;
      })
    );
  };

  // Handle Channel Subscribe Toggle
  const handleSubscribeToggle = () => {
    const isNowSubscribed = !activeVideo.channel.isSubscribed;
    setVideos(prev =>
      prev.map(v => {
        if (v.channel.id === activeVideo.channel.id) {
          const updatedChannel = {
            ...v.channel,
            isSubscribed: isNowSubscribed,
            subscribersCount: isNowSubscribed 
              ? v.channel.subscribersCount + 1 
              : Math.max(0, v.channel.subscribersCount - 1)
          };
          const updated = { ...v, channel: updatedChannel };
          if (v.id === activeVideo.id) {
            setActiveVideo(updated);
          }
          return updated;
        }
        return v;
      })
    );
  };

  // Handle Offline Download (Room Cache Sync)
  const handleDownloadToggle = () => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === activeVideo.id) {
          const isDownloaded = !v.isDownloaded;
          const updated = {
            ...v,
            isDownloaded,
            cachedFileSizeMb: isDownloaded ? 142.8 : undefined
          };
          setActiveVideo(updated);
          return updated;
        }
        return v;
      })
    );
  };

  const handleRemoveFromCache = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return { ...v, isDownloaded: false, cachedFileSizeMb: undefined };
        }
        return v;
      })
    );
  };

  const handleAddComment = (text: string) => {
    // Already updated in CommentsSection local state; persist to video state
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: 'Khan Raza',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      content: text,
      likes: 0,
      timestamp: 'Just now'
    };
    setActiveVideo(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
  };

  const handleSelectVideo = (video: Video) => {
    setActiveVideo(video);
    if (video.isShort) {
      setActiveTab('shorts');
    } else {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSeekTo = (seconds: number) => {
    setSeekTime(seconds);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'shorts':
        return (
          <ShortsViewer
            shorts={shortsList}
            onBackToFeed={() => setActiveTab('home')}
          />
        );

      case 'downloads':
        return (
          <OfflineCacheView
            videos={videos}
            onPlayVideo={handleSelectVideo}
            onRemoveFromCache={handleRemoveFromCache}
            isOfflineSimulated={isOfflineSimulated}
            onToggleOfflineSimulation={() => setIsOfflineSimulated(!isOfflineSimulated)}
          />
        );

      case 'code-inspector':
        return <AndroidCodeExplorer />;

      case 'channel':
        return (
          <ChannelView
            channel={MR_KHAN_CHANNEL}
            videos={videos}
            onSelectVideo={handleSelectVideo}
            onToggleSubscribe={handleSubscribeToggle}
          />
        );

      case 'home':
      default:
        return (
          <div className="space-y-6">
            {/* Offline notification banner if active */}
            {isOfflineSimulated && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-300 text-xs">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 shrink-0" />
                  <span>Offline Mode Active: Showing cached Room database videos only.</span>
                </div>
                <button
                  onClick={() => setIsOfflineSimulated(false)}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded text-[11px] font-semibold"
                >
                  Go Online
                </button>
              </div>
            )}

            {/* Video Watch Area: Split Screen or Theater Mode */}
            <div className={`grid gap-6 ${isTheaterMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
              {/* Primary Video Player & Metadata Column */}
              <div className={isTheaterMode ? 'w-full' : 'lg:col-span-8'}>
                {/* Custom Video Player with Dynamic Ambient Glow */}
                <CustomVideoPlayer
                  video={activeVideo}
                  isTheaterMode={isTheaterMode}
                  onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                  externalSeekTime={seekTime}
                  onSeekHandled={() => setSeekTime(null)}
                />

                {/* Video Title */}
                <h1 className="text-lg sm:text-xl font-bold text-white mt-4 tracking-tight leading-snug">
                  {activeVideo.title}
                </h1>

                {/* Actions Bar (Channel, Subscribe, Like, Share, Download) */}
                <VideoActions
                  video={activeVideo}
                  onLikeToggle={handleLikeToggle}
                  onDislikeToggle={handleDislikeToggle}
                  onSubscribeToggle={handleSubscribeToggle}
                  onDownloadToggle={handleDownloadToggle}
                />

                {/* Video Description Box */}
                <div 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-4 p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1.5">
                    <span>{formatViews(activeVideo.views)}</span>
                    <span>·</span>
                    <span>{activeVideo.uploadedAt}</span>
                    <span>·</span>
                    <span className="text-red-400 font-mono">{activeVideo.category}</span>
                  </div>
                  <p className={`text-xs text-slate-300 whitespace-pre-line leading-relaxed ${
                    isDescriptionExpanded ? '' : 'line-clamp-2'
                  }`}>
                    {activeVideo.description}
                  </p>
                  <button className="text-[11px] text-slate-400 font-semibold mt-1 hover:text-white">
                    {isDescriptionExpanded ? 'Show less' : '...more'}
                  </button>
                </div>

                {/* Comments Section */}
                <CommentsSection
                  comments={activeVideo.comments}
                  onAddComment={handleAddComment}
                  onSeekTo={handleSeekTo}
                />
              </div>

              {/* Sidebar: Up Next Recommendations & Category Filters */}
              <div className={isTheaterMode ? 'w-full max-w-4xl mx-auto' : 'lg:col-span-4 space-y-4'}>
                {/* Category Filter Tabs (Zero-Pill Discipline: Clean Segmented Controls) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-slate-100 text-slate-950 font-semibold'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Quick Switch to Android Code Inspector */}
                <div 
                  onClick={() => setActiveTab('code-inspector')}
                  className="p-3 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/20 cursor-pointer group hover:border-red-500/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        Inspect MrKhanApiService.kt
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Android Studio</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    View Retrofit 2 interface, Room entities, and export project ZIP.
                  </p>
                </div>

                {/* Related Videos List */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 px-1">Up Next</div>
                  {filteredVideos
                    .filter(v => v.id !== activeVideo.id)
                    .map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={handleSelectVideo}
                        compact={true}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar (Follows Top Bar Contract) */}
      <TopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenApkGuide={() => setIsApkGuideOpen(true)}
        deviceMode={deviceMode}
        onToggleDeviceMode={() => setDeviceMode(deviceMode === 'desktop' ? 'mobile' : 'desktop')}
      />

      {/* Main Container: Desktop standard layout vs. Pixel 9 Pro device frame preview */}
      <main className="flex-1 pb-16 md:pb-8">
        {deviceMode === 'mobile' ? (
          /* Pixel 9 Pro Material You Device Mockup Frame */
          <div className="max-w-md mx-auto my-6 px-3">
            <div className="text-center mb-3">
              <span className="text-xs font-mono text-slate-400 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-red-400" />
                <span>Pixel 9 Pro · Jetpack Compose Material 3 Preview</span>
              </span>
            </div>

            {/* Phone Bezel */}
            <div className="relative rounded-[48px] bg-slate-950 border-[10px] border-slate-800 shadow-2xl overflow-hidden aspect-[9/19.5] flex flex-col">
              {/* Dynamic Island / Camera Punch Hole */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Status Bar */}
              <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-300 z-40 bg-slate-950/80">
                <span>10:42</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile Viewport Content */}
              <div className="flex-1 overflow-y-auto px-2 py-2">
                {renderContent()}
              </div>

              {/* Bottom Gesture Pill */}
              <div className="py-2 flex justify-center bg-slate-950">
                <div className="w-32 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Responsive Layout (1440px baseline) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {renderContent()}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Creator Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onVideoCreated={(newVideo) => {
          setVideos([newVideo, ...videos]);
          setActiveVideo(newVideo);
          setActiveTab('home');
        }}
      />

      {/* APK Installation & Google Play Guide Modal */}
      <ApkInstallGuideModal
        isOpen={isApkGuideOpen}
        onClose={() => setIsApkGuideOpen(false)}
      />
    </div>
  );
}
