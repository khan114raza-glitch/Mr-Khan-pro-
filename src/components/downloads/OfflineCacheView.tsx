import React, { useState } from 'react';
import { 
  HardDrive, 
  Trash2, 
  Play, 
  WifiOff, 
  Database, 
  CheckCircle2
} from 'lucide-react';
import { Video } from '../../types/video';
import { formatDuration } from '../../utils/formatters';

interface OfflineCacheViewProps {
  videos: Video[];
  onPlayVideo: (video: Video) => void;
  onRemoveFromCache: (videoId: string) => void;
  isOfflineSimulated: boolean;
  onToggleOfflineSimulation: () => void;
}

export const OfflineCacheView: React.FC<OfflineCacheViewProps> = ({
  videos,
  onPlayVideo,
  onRemoveFromCache,
  isOfflineSimulated,
  onToggleOfflineSimulation
}) => {
  const downloadedVideos = videos.filter(v => v.isDownloaded);
  const totalCachedMb = downloadedVideos.reduce((acc, v) => acc + (v.cachedFileSizeMb || 120), 0);
  const maxStorageMb = 2048; // 2 GB Room DB video cache quota
  const storagePercent = Math.min(100, (totalCachedMb / maxStorageMb) * 100);

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* Header & Storage Status */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Room Database Offline Storage</span>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Room v2.6.1 + ExoPlayer Cache
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Videos saved locally in device cache for seamless offline playback
              </p>
            </div>
          </div>

          {/* Test Offline Mode Switch */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <WifiOff className={`w-4 h-4 ${isOfflineSimulated ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-xs font-medium text-slate-200">Simulate Offline Mode</span>
            </div>
            <button
              onClick={onToggleOfflineSimulation}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                isOfflineSimulated ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isOfflineSimulated ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Storage Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 tabular-nums">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>{totalCachedMb.toFixed(1)} MB Used ({downloadedVideos.length} videos)</span>
            </span>
            <span>{maxStorageMb} MB Available</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Offline Status Alert if Simulated */}
      {isOfflineSimulated && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs">
          <WifiOff className="w-5 h-5 shrink-0" />
          <span>
            Offline Simulation is ACTIVE: You are browsing without internet. Non-cached videos are unavailable, while your {downloadedVideos.length} cached Room database videos play without network!
          </span>
        </div>
      )}

      {/* Downloaded List */}
      {downloadedVideos.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <Database className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300 mb-1">No Offline Videos Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Click the "Download" button on any video to cache it locally into the Room database for offline viewing.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {downloadedVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors group"
            >
              <div 
                onClick={() => onPlayVideo(video)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[10px] text-white px-1.5 py-0.5 rounded tabular-nums">
                    {formatDuration(video.durationSeconds)}
                  </span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors truncate">
                    {video.title}
                  </h4>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>{video.channel.name}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {video.cachedFileSizeMb || 128} MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPlayVideo(video)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => onRemoveFromCache(video.id)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Remove from offline cache"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
