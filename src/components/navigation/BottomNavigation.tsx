import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';

export type NavTab = 'home' | 'discover' | 'create' | 'messages' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadMessagesCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount = 0,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] group focus:outline-none"
        >
          <div
            className={`transition-all duration-150 ${
              activeTab === 'home'
                ? 'text-[#00B050] scale-110'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
              activeTab === 'home' ? 'text-[#00B050] font-bold' : 'text-slate-500'
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. Discover */}
        <button
          onClick={() => onTabChange('discover')}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] group focus:outline-none"
        >
          <div
            className={`transition-all duration-150 ${
              activeTab === 'discover'
                ? 'text-[#00B050] scale-110'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <Compass size={22} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
              activeTab === 'discover' ? 'text-[#00B050] font-bold' : 'text-slate-500'
            }`}
          >
            Discover
          </span>
        </button>

        {/* 3. Create (Center Prominent Button) */}
        <button
          onClick={() => onTabChange('create')}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] group focus:outline-none"
          title="Create post or product"
        >
          <div
            className="w-11 h-8 rounded-xl bg-gradient-to-r from-[#00B050] via-emerald-500 to-[#0066FF] p-0.5 shadow-md group-hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#00B050] rounded-[10px] flex items-center justify-center text-white">
              <Plus size={20} strokeWidth={3} />
            </div>
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
              activeTab === 'create' ? 'text-[#00B050] font-bold' : 'text-slate-500'
            }`}
          >
            Create
          </span>
        </button>

        {/* 4. Messages */}
        <button
          onClick={() => onTabChange('messages')}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] group focus:outline-none"
        >
          <div
            className={`relative transition-all duration-150 ${
              activeTab === 'messages'
                ? 'text-[#00B050] scale-110'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <MessageSquare size={22} strokeWidth={activeTab === 'messages' ? 2.5 : 2} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#0066FF] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
              activeTab === 'messages' ? 'text-[#00B050] font-bold' : 'text-slate-500'
            }`}
          >
            Messages
          </span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] group focus:outline-none"
        >
          <div
            className={`transition-all duration-150 ${
              activeTab === 'profile'
                ? 'text-[#00B050] scale-110'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
              activeTab === 'profile' ? 'text-[#00B050] font-bold' : 'text-slate-500'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
