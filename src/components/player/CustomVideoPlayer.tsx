import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Sparkles, 
  PictureInPicture,
  RotateCcw,
  Gauge
} from 'lucide-react';
import { Video, QualityResolution } from '../../types/video';
import { formatDuration } from '../../utils/formatters';

interface CustomVideoPlayerProps {
  video: Video;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
  externalSeekTime?: number | null;
  onSeekHandled?: () => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  video,
  isTheaterMode,
  onToggleTheater,
  externalSeekTime,
  onSeekHandled
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(video.durationSeconds || 100);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(true);
  const [ambientGlowColor, setAmbientGlowColor] = useState<string>(video.ambientColor || '#2563eb');
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<QualityResolution>('1080p60');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle external seek requests (e.g. from comments clicking timestamps)
  useEffect(() => {
    if (externalSeekTime !== undefined && externalSeekTime !== null && videoRef.current) {
      videoRef.current.currentTime = externalSeekTime;
      setCurrentTime(externalSeekTime);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      onSeekHandled?.();
    }
  }, [externalSeekTime, isPlaying, onSeekHandled]);

  // Ambient Lighting extractor from live video frame
  useEffect(() => {
    if (!ambientEnabled) return;

    const interval = setInterval(() => {
      const vid = videoRef.current;
      const canvas = canvasRef.current;
      if (!vid || !canvas || vid.paused || vid.ended) return;

      try {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = 16;
        canvas.height = 9;
        ctx.drawImage(vid, 0, 0, 16, 9);
        const frame = ctx.getImageData(0, 0, 16, 9);
        const data = frame.data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        if (count > 0) {
          const avgR = Math.round(r / count);
          const avgG = Math.round(g / count);
          const avgB = Math.round(b / count);
          setAmbientGlowColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
        }
      } catch {
        // Fallback to video predefined ambient hue
        setAmbientGlowColor(video.ambientColor || '#2563eb');
      }
    }, 400);

    return () => clearInterval(interval);
  }, [ambientEnabled, video.ambientColor]);

  // Autoplay or reset when video changes
  useEffect(() => {
    setCurrentTime(0);
    setBufferedPercent(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [video.id]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const totalDur = videoRef.current.duration || duration;
      setBufferedPercent((bufferedEnd / totalDur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || video.durationSeconds);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // PiP not supported or rejected
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const handleQualityChange = (q: QualityResolution) => {
    setSelectedQuality(q);
    setShowSettingsMenu(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2800);
    setControlsTimeout(timeout);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (videoRef.current) videoRef.current.currentTime = Math.min(duration, currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTime, duration]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Dynamic Ambient Lighting Glow (YouTube Ambient Mode / Media3 Dynamic Ambient Lighting) */}
      {ambientEnabled && (
        <div 
          className="absolute -inset-4 sm:-inset-10 -z-10 rounded-3xl opacity-45 blur-3xl transition-colors duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${ambientGlowColor} 0%, rgba(15, 23, 42, 0) 75%)`
          }}
          aria-hidden="true"
        />
      )}

      {/* Hidden canvas for live color extraction */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Video Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className={`relative w-full overflow-hidden bg-black select-none rounded-2xl shadow-2xl transition-all duration-300 ${
          isTheaterMode ? 'aspect-[21/9] max-h-[72vh]' : 'aspect-video max-h-[68vh]'
        }`}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          playsInline
          crossOrigin="anonymous"
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Big play button overlay when paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-1 shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white" />
            </div>
          </div>
        )}

        {/* Top bar indicator (Quality & Ambient Status) */}
        <div 
          className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs text-slate-300 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">{video.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider text-slate-200">
              {selectedQuality}
            </span>
            {ambientEnabled && (
              <span className="flex items-center gap-1 text-[11px] text-amber-300">
                <Sparkles className="w-3 h-3" />
                <span>Ambient Mode</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Scrubber Progress Bar */}
          <div className="relative mb-3 flex items-center group/scrubber cursor-pointer">
            {/* Background Track */}
            <div className="w-full h-1 group-hover/scrubber:h-2 bg-white/20 rounded-full transition-all overflow-hidden relative">
              {/* Buffered Bar */}
              <div 
                className="absolute top-0 left-0 bottom-0 bg-white/35"
                style={{ width: `${bufferedPercent}%` }}
              />
              {/* Played Bar */}
              <div 
                className="absolute top-0 left-0 bottom-0 bg-red-600 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Actual Slider input */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek video"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Controls: Play, Volume, Time */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                className="p-1.5 text-white hover:text-red-400 transition-colors focus-visible:outline-none"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Skip 10s back */}
              <button
                onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
                className="p-1 text-slate-300 hover:text-white transition-colors hidden sm:block"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-200 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-20 h-1 bg-white/30 rounded-lg accent-red-500 cursor-pointer hidden group-hover/vol:block sm:block transition-all"
                  aria-label="Volume slider"
                />
              </div>

              {/* Time display */}
              <div className="text-xs font-mono text-slate-300 tabular-nums">
                <span>{formatDuration(currentTime)}</span>
                <span className="mx-1 text-slate-500">/</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Ambient Toggle, Speed, Settings, PiP, Theater, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Ambient Glow Toggle */}
              <button
                onClick={() => setAmbientEnabled(!ambientEnabled)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                  ambientEnabled ? 'text-amber-300 bg-amber-400/10' : 'text-slate-400 hover:text-white'
                }`}
                title={`Ambient Lighting: ${ambientEnabled ? 'On' : 'Off'}`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline font-medium text-[11px]">Ambient</span>
              </button>

              {/* Settings Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className={`p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors ${
                    showSettingsMenu ? 'bg-white/10 text-white' : ''
                  }`}
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Settings Popup Menu */}
                {showSettingsMenu && (
                  <div className="absolute bottom-10 right-0 w-56 bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 text-xs">
                    <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
                      <span>ExoPlayer Stream Settings</span>
                      <Gauge className="w-3.5 h-3.5 text-red-400" />
                    </div>

                    {/* Quality Submenu */}
                    <div className="mb-3">
                      <div className="text-slate-400 mb-1 font-medium">Quality (Adaptive ABR)</div>
                      <div className="space-y-1">
                        {['Auto', '4K (2160p)', '1080p60', '720p', '480p'].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualityChange(q as QualityResolution)}
                            className={`w-full text-left px-2 py-1 rounded transition-colors flex items-center justify-between ${
                              selectedQuality === q ? 'bg-red-600/20 text-red-400 font-semibold' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{q}</span>
                            {selectedQuality === q && <span className="text-[10px]">● Active</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed Submenu */}
                    <div>
                      <div className="text-slate-400 mb-1 font-medium">Playback Speed</div>
                      <div className="grid grid-cols-3 gap-1">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`px-1.5 py-1 rounded text-center transition-colors ${
                              playbackSpeed === s ? 'bg-red-600 text-white font-semibold' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Picture in Picture */}
              <button
                onClick={togglePiP}
                className="p-1.5 text-slate-300 hover:text-white transition-colors hidden sm:block"
                title="Picture-in-Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Theater Mode Toggle */}
              <button
                onClick={onToggleTheater}
                className={`p-1.5 text-slate-300 hover:text-white transition-colors hidden md:block ${
                  isTheaterMode ? 'text-red-400' : ''
                }`}
                title={isTheaterMode ? 'Default View' : 'Theater Mode'}
              >
                <div className="w-4 h-3 border-2 border-current rounded-sm" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
