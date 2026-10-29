import React, { useState } from 'react';
import { Check, Video as VideoIcon, Sparkles, ListVideo, Users, Info } from 'lucide-react';
import { Channel, Video } from '../../types/video';
import { VideoCard } from '../feed/VideoCard';
import { formatSubscribers } from '../../utils/formatters';

interface ChannelViewProps {
  channel: Channel;
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onToggleSubscribe: () => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({
  channel,
  videos,
  onSelectVideo,
  onToggleSubscribe
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'playlists' | 'about'>('videos');

  const channelVideos = videos.filter(v => v.channel.id === channel.id && !v.isShort);
  const channelShorts = videos.filter(v => v.channel.id === channel.id && v.isShort);

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Channel Banner */}
      <div className="relative w-full h-44 sm:h-64 rounded-3xl overflow-hidden bg-slate-900 mb-6 shadow-md">
        {channel.bannerUrl ? (
          <img
            src={channel.bannerUrl}
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-900/60 via-slate-900 to-blue-900/50" />
        )}
      </div>

      {/* Channel Header Information */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2 mb-8">
        <div className="flex items-center gap-5">
          <img
            src={channel.avatarUrl}
            alt={channel.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-slate-800 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {channel.name}
              </h1>
              {channel.isVerified && (
                <Check className="w-4 h-4 bg-slate-700 text-white rounded-full p-0.5" />
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="font-medium text-slate-300">{channel.handle}</span>
              <span>·</span>
              <span>{formatSubscribers(channel.subscribersCount)} subscribers</span>
              <span>·</span>
              <span>{channelVideos.length + channelShorts.length} videos</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-xl line-clamp-2">
              {channel.bio}
            </p>
          </div>
        </div>

        {/* Subscribe Action */}
        <div>
          <button
            onClick={onToggleSubscribe}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md ${
              channel.isSubscribed
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
            }`}
          >
            {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
      </div>

      {/* Channel Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'videos' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <VideoIcon className="w-4 h-4" />
          <span>Videos ({channelVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shorts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'shorts' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Shorts ({channelShorts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'playlists' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListVideo className="w-4 h-4" />
          <span>Playlists</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'about' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>

      {/* Content View */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {channelVideos.map((vid) => (
            <VideoCard key={vid.id} video={vid} onSelect={onSelectVideo} />
          ))}
        </div>
      )}

      {activeTab === 'shorts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {channelShorts.map((short) => (
            <div
              key={short.id}
              onClick={() => onSelectVideo(short)}
              className="group cursor-pointer aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 relative shadow-md"
            >
              <img
                src={short.thumbnailUrl}
                alt={short.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                <p className="text-xs font-semibold text-white line-clamp-2">{short.title}</p>
                <span className="text-[10px] text-slate-300 mt-1 font-mono">{short.views.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-semibold text-white text-sm">Jetpack Compose Masterclass 2026</h4>
            <p className="text-xs text-slate-400 mt-1">12 videos · Updated yesterday</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-semibold text-white text-sm">Media3 ExoPlayer & HLS Architecture</h4>
            <p className="text-xs text-slate-400 mt-1">8 videos · Comprehensive Guide</p>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 leading-relaxed">
          <h3 className="font-bold text-white text-base mb-3">About Mr Khan</h3>
          <p className="mb-4">
            Mr Khan Video Sharing Platform is architected for high-performance video distribution, adaptive bitrate streaming, and modern Android mobile engineering.
          </p>
          <div className="space-y-2 border-t border-slate-800 pt-4 text-slate-400">
            <div>Developer & Creator: <strong className="text-white">Khan Raza</strong></div>
            <div>Official Contact: <strong className="text-white">khan114raza@gmail.com</strong></div>
            <div>Joined: March 2024</div>
            <div>Target Platform: Google Play Store (Android Jetpack Compose)</div>
          </div>
        </div>
      )}
    </div>
  );
};
