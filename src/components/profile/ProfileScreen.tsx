import React, { useState, useEffect } from 'react';
import { User as UserIcon, Settings, Grid, Bookmark, LogOut, Edit3, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { VideoPost } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface ProfileScreenProps {
  onOpenVideo: (video: VideoPost) => void;
  onCreateVideo: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenVideo,
  onCreateVideo,
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'videos' | 'saved'>('videos');
  const [userVideos, setUserVideos] = useState<VideoPost[]>([]);
  const [savedVideos, setSavedVideos] = useState<VideoPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      userService
        .getUserProfile(user.id)
        .then(({ videos }) => {
          setUserVideos(videos);
        })
        .catch(() => {
          setUserVideos([]);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Load saved videos from local storage
      const postsJson = localStorage.getItem('yoyo_published_videos');
      if (postsJson) {
        try {
          const all: VideoPost[] = JSON.parse(postsJson);
          setSavedVideos(all.filter((p) => p.is_saved));
        } catch {
          setSavedVideos([]);
        }
      }
    }
  }, [user]);

  // If user is not authenticated, show real unauthenticated state with prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none bg-white">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <UserIcon size={32} />
        </div>
        <h2 className="text-base font-extrabold text-[#0B1F3B]">Sign in to your YOYO profile</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Create short videos, connect with creators, and save your favorite Sierra Leone moments.
        </p>
        <button
          onClick={() => openAuthModal('Create an account or log in to view your profile')}
          className="mt-5 px-6 py-3 rounded-full bg-[#00B050] hover:bg-[#009142] text-white text-xs font-extrabold active:scale-95 transition-all shadow-md shadow-emerald-700/20"
        >
          Log In / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 pb-24 overflow-y-auto no-scrollbar">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <h1 className="font-extrabold text-sm text-[#0B1F3B]">{user.username}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => logout()}
            className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs text-center">
          {/* Avatar */}
          <div className="relative inline-block mx-auto mb-3">
            <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden ring-4 ring-emerald-50 shadow-md flex items-center justify-center text-slate-500 font-bold text-xl">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.display_name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-base font-extrabold text-[#0B1F3B]">{user.display_name}</h2>
            {user.is_verified && <VerifiedBadge size="sm" />}
          </div>
          <p className="text-xs text-slate-400 font-medium">{user.username}</p>

          {user.location && (
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin size={12} className="text-[#00B050]" />
              <span>{user.location}</span>
            </div>
          )}

          {user.bio ? (
            <p className="text-xs text-slate-600 max-w-xs mx-auto mt-2 leading-relaxed">
              {user.bio}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">No bio added yet.</p>
          )}

          {/* Real Metrics from Database */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-sm font-extrabold text-[#0B1F3B] tabular-nums">
                {user.followers_count}
              </p>
              <p className="text-[11px] text-slate-400">
                {user.followers_count === 0 ? 'No followers' : 'Followers'}
              </p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0B1F3B] tabular-nums">
                {user.following_count}
              </p>
              <p className="text-[11px] text-slate-400">Following</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0B1F3B] tabular-nums">
                {user.likes_count}
              </p>
              <p className="text-[11px] text-slate-400">Likes</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white rounded-2xl p-1 border border-slate-100 shadow-xs">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'videos'
                ? 'bg-[#00B050] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid size={14} />
            <span>My Videos ({userVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'saved'
                ? 'bg-[#00B050] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bookmark size={14} />
            <span>Saved ({savedVideos.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div>
            {userVideos.length === 0 ? (
              <EmptyState
                type="profile_videos"
                onAction={onCreateVideo}
                actionLabel="Create Your First Video"
              />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {userVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onOpenVideo(video)}
                    className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-900 cursor-pointer group shadow-xs"
                  >
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-white">
                      <span className="text-[10px] font-bold tabular-nums">
                        ❤️ {video.likes_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedVideos.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
                <Bookmark size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-[#0B1F3B]">No saved videos yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tap the bookmark icon on any video to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onOpenVideo(video)}
                    className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-900 cursor-pointer group shadow-xs"
                  >
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-white">
                      <span className="text-[10px] font-bold tabular-nums">
                        ❤️ {video.likes_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
