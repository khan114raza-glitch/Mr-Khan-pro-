import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Video } from '../../types/video';
import { formatDuration, formatViews } from '../../utils/formatters';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  compact?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect, compact = false }) => {
  if (compact) {
    return (
      <div 
        onClick={() => onSelect(video)}
        className="flex gap-3 group cursor-pointer p-1.5 rounded-xl hover:bg-slate-900/60 transition-colors"
      >
        {/* Compact Thumbnail */}
        <div className="relative w-40 sm:w-44 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1 right-1 bg-black/85 text-white font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums">
            {formatDuration(video.durationSeconds)}
          </span>
          {video.isDownloaded && (
            <span className="absolute top-1 left-1 bg-emerald-500/90 text-white p-0.5 rounded" title="Downloaded offline">
              <CheckCircle2 className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h4 className="text-xs font-semibold text-slate-100 group-hover:text-red-400 line-clamp-2 leading-snug transition-colors">
              {video.title}
            </h4>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>{video.channel.name}</span>
              {video.channel.isVerified && (
                <Check className="w-3 h-3 text-slate-400" />
              )}
            </div>
          </div>
          {/* Unboxed metadata with typographic separators */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>{formatViews(video.views)}</span>
            <span aria-hidden="true">·</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(video)}
      className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden hover:bg-slate-900/40 p-2 transition-all duration-200"
    >
      {/* Main Thumbnail */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-sm">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/85 text-white font-mono text-xs px-2 py-0.5 rounded font-medium tabular-nums">
          {formatDuration(video.durationSeconds)}
        </span>
        {/* Offline indicator if downloaded */}
        {video.isDownloaded && (
          <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>Downloaded</span>
          </span>
        )}
      </div>

      {/* Video Details */}
      <div className="flex gap-3 mt-3 px-1">
        <img
          src={video.channel.avatarUrl}
          alt={video.channel.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-red-400 line-clamp-2 leading-snug transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            <span>{video.channel.name}</span>
            {video.channel.isVerified && (
              <Check className="w-3 h-3 text-slate-400" />
            )}
          </div>
          {/* Zero-Pill unboxed metadata */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <span>{formatViews(video.views)}</span>
            <span aria-hidden="true">·</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
