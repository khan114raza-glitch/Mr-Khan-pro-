import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  ChevronUp, 
  ChevronDown,
  Volume2,
  VolumeX,
  Music,
  X
} from 'lucide-react';
import { Video } from '../../types/video';

interface ShortsViewerProps {
  shorts: Video[];
  onBackToFeed: () => void;
}

export const ShortsViewer: React.FC<ShortsViewerProps> = ({ shorts, onBackToFeed }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentShort = shorts[currentIndex] || shorts[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLike = (id: string) => {
    setLikedShorts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  if (!currentShort) return null;

  const isLiked = likedShorts[currentShort.id] || false;

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-8rem)] flex items-center justify-center select-none py-2">
      {/* Background ambient lighting for shorts */}
      <div 
        className="absolute -inset-10 -z-10 rounded-full opacity-35 blur-3xl pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${currentShort.ambientColor || '#ec4899'} 0%, rgba(15,23,42,0) 70%)`
        }}
      />

      {/* Main Reel Card */}
      <div className="relative w-full h-full max-h-[720px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
        <video
          ref={videoRef}
          src={currentShort.videoUrl}
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Play indicator overlay */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center pl-1">
              <Play className="w-8 h-8 fill-white" />
            </div>
          </div>
        )}

        {/* Top Controls: Sound Mute & Close */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onBackToFeed}
            className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
            title="Close Shorts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Overlay: Creator Info, Title, Music */}
        <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={currentShort.channel.avatarUrl}
              alt={currentShort.channel.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500"
            />
            <span className="font-semibold text-white text-sm">{currentShort.channel.name}</span>
            <button className="ml-2 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-slate-100 font-medium line-clamp-2 mb-2">
            {currentShort.title}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <Music className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">Original Sound · Mr Khan Studio</span>
          </div>
        </div>

        {/* Right Action Rail */}
        <div className="absolute bottom-12 right-3 flex flex-col items-center gap-5 z-20">
          {/* Like */}
          <button
            onClick={() => toggleLike(currentShort.id)}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-colors ${
              isLiked ? 'bg-red-600 text-white' : 'bg-black/50 hover:bg-black/70 text-white'
            }`}>
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-mono tabular-nums">
              {(currentShort.likes + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          {/* Dislike */}
          <button className="flex flex-col items-center gap-1 text-white group">
            <div className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Dislike</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 text-white group"
          >
            <div className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono tabular-nums">
              {currentShort.comments.length || 42}
            </span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1 text-white group">
            <div className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Share</span>
          </button>
        </div>
      </div>

      {/* Up & Down Desktop Navigation arrows */}
      <div className="hidden lg:flex flex-col gap-3 ml-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-slate-900 border border-slate-800 text-white rounded-full hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Short (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === shorts.length - 1}
          className="p-3 bg-slate-900 border border-slate-800 text-white rounded-full hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Short (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
