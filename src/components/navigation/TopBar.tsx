import React from 'react';
import { Search, Bell } from 'lucide-react';
import { YoyoLogo } from '../common/YoyoLogo';

export type FeedFilter = 'for-you' | 'following' | 'freetown';

interface TopBarProps {
  currentFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  transparent?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentFilter,
  onFilterChange,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  transparent = true,
}) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-colors ${
        transparent
          ? 'bg-gradient-to-b from-black/80 via-black/30 to-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
        {/* Left: YOYO Logo */}
        <div className="shrink-0">
          <YoyoLogo size="sm" variant={transparent ? 'light' : 'brand'} />
        </div>

        {/* Center: Feed Tabs (Following / For You) */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => onFilterChange('following')}
            className={`transition-all pb-1 relative focus:outline-none ${
              currentFilter === 'following'
                ? transparent
                  ? 'text-white font-bold'
                  : 'text-[#0B1F3B] font-bold'
                : transparent
                ? 'text-white/60 hover:text-white/80'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Following
            {currentFilter === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00B050] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onFilterChange('for-you')}
            className={`transition-all pb-1 relative focus:outline-none ${
              currentFilter === 'for-you'
                ? transparent
                  ? 'text-white font-bold'
                  : 'text-[#0B1F3B] font-bold'
                : transparent
                ? 'text-white/60 hover:text-white/80'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            For You
            {currentFilter === 'for-you' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00B050] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onFilterChange('freetown')}
            className={`hidden sm:flex items-center gap-1 transition-all pb-1 relative focus:outline-none ${
              currentFilter === 'freetown'
                ? transparent
                  ? 'text-white font-bold'
                  : 'text-[#0B1F3B] font-bold'
                : transparent
                ? 'text-white/60 hover:text-white/80'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>🇸🇱 Freetown</span>
            {currentFilter === 'freetown' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#0066FF] rounded-full" />
            )}
          </button>
        </div>

        {/* Right: Search & Notifications */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-full transition-colors focus:outline-none ${
              transparent
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Search products and businesses"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          <button
            onClick={onOpenNotifications}
            className={`p-2 rounded-full relative transition-colors focus:outline-none ${
              transparent
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0066FF] ring-2 ring-white/50" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
