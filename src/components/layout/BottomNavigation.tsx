import React from 'react';
import { Home, Sparkles, HardDrive, Code, User } from 'lucide-react';
import { ActiveTab } from '../../types/video';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 px-2 py-2 flex items-center justify-around backdrop-blur-md md:hidden">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'home' ? 'text-red-500' : 'text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onTabChange('shorts')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'shorts' ? 'text-red-500' : 'text-slate-400'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span>Shorts</span>
      </button>

      <button
        onClick={() => onTabChange('downloads')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'downloads' ? 'text-red-500' : 'text-slate-400'
        }`}
      >
        <HardDrive className="w-5 h-5" />
        <span>Room Cache</span>
      </button>

      <button
        onClick={() => onTabChange('code-inspector')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'code-inspector' ? 'text-red-500' : 'text-slate-400'
        }`}
      >
        <Code className="w-5 h-5" />
        <span>Kotlin API</span>
      </button>

      <button
        onClick={() => onTabChange('channel')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'channel' ? 'text-red-500' : 'text-slate-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Channel</span>
      </button>
    </nav>
  );
};
