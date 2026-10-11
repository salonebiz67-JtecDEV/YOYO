import React from 'react';
import { Video, UserPlus, MessageSquare, Bell, Search, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'feed' | 'following' | 'messages' | 'notifications' | 'search' | 'profile_videos';
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, actionLabel }) => {
  switch (type) {
    case 'feed':
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00B050] mb-4 shadow-lg shadow-emerald-500/10">
            <Video size={28} />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Welcome to YOYO 🇸🇱
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            Your For You feed is waiting for its first videos. Be the first to share something with Sierra Leone.
          </p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-6 px-6 py-3 rounded-full bg-[#00B050] hover:bg-[#009142] text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <Sparkles size={15} />
              <span>{actionLabel || 'Create Your First Video'}</span>
            </button>
          )}
        </div>
      );

    case 'following':
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#0066FF] mb-4">
            <UserPlus size={28} />
          </div>
          <h2 className="text-lg font-black text-white">
            You're not following anyone yet.
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
            Discover creators and follow people you enjoy across Sierra Leone.
          </p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold active:scale-95 transition-all"
            >
              <span>{actionLabel || 'Discover Creators'}</span>
            </button>
          )}
        </div>
      );

    case 'messages':
      return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center select-none bg-white">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-sm font-extrabold text-[#0B1F3B]">No conversations yet.</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Start a direct message with friends and creators on YOYO.
          </p>
        </div>
      );

    case 'notifications':
      return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center select-none bg-white">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Bell size={24} />
          </div>
          <h3 className="text-sm font-extrabold text-[#0B1F3B]">You're all caught up.</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            When people like your videos, comment, or follow you, updates will appear here.
          </p>
        </div>
      );

    case 'search':
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Search size={22} />
          </div>
          <h3 className="text-xs font-bold text-[#0B1F3B]">No results found.</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different keyword or username.</p>
        </div>
      );

    case 'profile_videos':
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none bg-white rounded-3xl border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B050] flex items-center justify-center mb-3">
            <Video size={22} />
          </div>
          <h3 className="text-xs font-extrabold text-[#0B1F3B]">No videos yet.</h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
            Be the first to share something with Sierra Leone.
          </p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-4 px-4 py-2 rounded-xl bg-[#00B050] text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
            >
              {actionLabel || 'Create Video'}
            </button>
          )}
        </div>
      );
  }
};
