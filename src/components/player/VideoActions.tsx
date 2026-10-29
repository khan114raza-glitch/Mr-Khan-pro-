import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  Check, 
  Bell, 
  Copy, 
  Bookmark, 
  X
} from 'lucide-react';
import { Video } from '../../types/video';
import { formatSubscribers } from '../../utils/formatters';

interface VideoActionsProps {
  video: Video;
  onLikeToggle: () => void;
  onDislikeToggle: () => void;
  onSubscribeToggle: () => void;
  onDownloadToggle: () => void;
}

export const VideoActions: React.FC<VideoActionsProps> = ({
  video,
  onLikeToggle,
  onDislikeToggle,
  onSubscribeToggle,
  onDownloadToggle
}) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [bellActive, setBellActive] = useState<boolean>(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="py-4 border-b border-slate-800/80">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Channel Details */}
        <div className="flex items-center gap-3">
          <img
            src={video.channel.avatarUrl}
            alt={video.channel.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-red-500/30"
          />
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-white text-base">
              <span>{video.channel.name}</span>
              {video.channel.isVerified && (
                <span className="text-slate-400" title="Verified Creator">
                  <Check className="w-3.5 h-3.5 bg-slate-700 text-white rounded-full p-0.5" />
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              {formatSubscribers(video.channel.subscribersCount)} subscribers
            </div>
          </div>

          <div className="ml-2 flex items-center gap-2">
            <button
              onClick={onSubscribeToggle}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                video.channel.isSubscribed
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-white text-black hover:bg-slate-200 shadow-md'
              }`}
            >
              {video.channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>

            {video.channel.isSubscribed && (
              <button
                onClick={() => setBellActive(!bellActive)}
                className={`p-2 rounded-full transition-colors ${
                  bellActive ? 'bg-slate-800 text-amber-400' : 'bg-slate-800/50 text-slate-400'
                }`}
                title={bellActive ? 'All notifications' : 'Notifications muted'}
              >
                <Bell className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons: Like/Dislike, Share, Download, Save */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Like & Dislike Combined Capsule */}
          <div className="flex items-center bg-slate-800/90 rounded-full p-0.5 border border-slate-700/60">
            <button
              onClick={onLikeToggle}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-full text-xs font-medium transition-colors ${
                video.isLiked ? 'text-red-400 bg-red-500/10' : 'text-slate-200 hover:text-white'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-current' : ''}`} />
              <span className="font-mono tabular-nums">{video.likes.toLocaleString()}</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-700" />
            <button
              onClick={onDislikeToggle}
              className={`px-3 py-1.5 rounded-r-full text-xs transition-colors ${
                video.isDisliked ? 'text-slate-100 bg-white/10' : 'text-slate-400 hover:text-white'
              }`}
              title="I dislike this"
            >
              <ThumbsDown className={`w-4 h-4 ${video.isDisliked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/60 rounded-full text-xs font-medium text-slate-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          {/* Offline Download (Room Cache) */}
          <button
            onClick={onDownloadToggle}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              video.isDownloaded
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700/60 text-slate-200'
            }`}
            title="Download for offline playback via Room Database"
          >
            {video.isDownloaded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded ({video.cachedFileSizeMb || 128} MB)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </button>

          {/* Save to Playlist */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-full border transition-colors ${
              isSaved
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700/60 text-slate-300'
            }`}
            title={isSaved ? 'Saved to Playlist' : 'Save'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-white text-base">Share Video</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs text-slate-400 mb-3">Copy link to share with friends or embed:</p>
              <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <input
                  type="text"
                  readOnly
                  value={`https://mrkhanvideo.app/watch?v=${video.id}`}
                  className="w-full bg-transparent text-xs text-slate-300 font-mono outline-none px-2"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Start at current time</span>
                <input type="checkbox" defaultChecked className="rounded accent-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
