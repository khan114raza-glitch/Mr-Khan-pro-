import React from 'react';
import { Play, Search, Upload, Smartphone, Monitor, Download } from 'lucide-react';
import { ActiveTab, DeviceMode } from '../../types/video';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface TopNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUpload: () => void;
  onOpenApkGuide: () => void;
  deviceMode: DeviceMode;
  onToggleDeviceMode: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenApkGuide,
  deviceMode,
  onToggleDeviceMode
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      onOpenApkGuide();
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
          <span className="font-outfit text-xl">Mr Khan</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onTabChange('home')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'home' ? 'text-red-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => onTabChange('shorts')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'shorts' ? 'text-red-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shorts
          </button>
          <button
            onClick={() => onTabChange('downloads')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'downloads' ? 'text-red-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Offline Cache
          </button>
          <button
            onClick={() => onTabChange('code-inspector')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'code-inspector' ? 'text-red-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Android Code Studio
          </button>
          <button
            onClick={() => onTabChange('channel')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'channel' ? 'text-red-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Creator Channel
          </button>
        </nav>

        {/* Search Input on Desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search videos, Kotlin, Compose..."
              className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/80 transition-colors"
            />
          </div>
        </div>

        {/* Zone 3: 1 Primary Action + Device Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95"
            title="Install app directly on Android phone"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{isInstalled ? 'App Installed' : 'Install on Phone'}</span>
          </button>

          <button
            onClick={onToggleDeviceMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors"
            title={deviceMode === 'desktop' ? 'Switch to Pixel 9 Pro Frame' : 'Switch to Desktop Layout'}
          >
            {deviceMode === 'desktop' ? <Smartphone className="w-3.5 h-3.5 text-red-400" /> : <Monitor className="w-3.5 h-3.5 text-blue-400" />}
            <span className="whitespace-nowrap">{deviceMode === 'desktop' ? 'Pixel' : 'Desktop'}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
};
