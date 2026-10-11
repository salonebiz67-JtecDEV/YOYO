import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Check, Music, MapPin, Volume2, VolumeX, Play } from 'lucide-react';
import { VideoPost } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface FeedPostProps {
  post: VideoPost;
  isActive: boolean;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onOpenComments: (post: VideoPost) => void;
  onOpenShare: (post: VideoPost) => void;
  onOpenAuthorProfile: (userId: string) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  isActive,
  onLikeToggle,
  onSaveToggle,
  onFollowToggle,
  onOpenComments,
  onOpenShare,
  onOpenAuthorProfile,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 50, y: 50 });
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);

  const isRealVideo = post.video_url && (
    post.video_url.endsWith('.mp4') ||
    post.video_url.endsWith('.webm') ||
    post.video_url.startsWith('blob:') ||
    post.video_url.includes('video')
  );

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const handleDoubleTapOrClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap -> Like
      if (!post.is_liked) {
        onLikeToggle(post.id);
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setHeartPos({ x, y });
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single tap -> Play/Pause
      setIsPlaying((prev) => !prev);
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
    }
  };

  return (
    <div
      className="relative w-full h-full max-h-screen bg-black overflow-hidden select-none snap-start flex items-center justify-center"
      onClick={handleDoubleTapOrClick}
    >
      {/* 1. Media View: Real Video or Poster Image */}
      <div className="absolute inset-0 w-full h-full">
        {isRealVideo ? (
          <video
            ref={videoRef}
            src={post.video_url}
            loop
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.video_url || post.thumbnail_url || ''}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}

        {/* Contrast Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Floating Animated Heart on Double Tap */}
      {showHeartAnim && (
        <div
          className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: `${heartPos.x}%`, top: `${heartPos.y}%` }}
        >
          <Heart size={80} className="fill-rose-500 text-white drop-shadow-2xl" />
        </div>
      )}

      {/* Play/Pause Overlay Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/25">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90">
            <Play size={28} className="ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Top Sound Control */}
      <div className="absolute top-16 right-4 z-30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((m) => !m);
            if (videoRef.current) {
              videoRef.current.muted = !isMuted;
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs hover:bg-black/60 transition-colors"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#00B050]" />}
          <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>

      {/* Right Side Social Actions Column */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 select-none">
        {/* Author Avatar & Follow Button */}
        <div className="relative mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAuthorProfile(post.user_id);
            }}
            className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#00B050] to-[#0066FF] shadow-lg active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-white font-bold text-xs">
              {post.user.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={post.user.display_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{post.user.display_name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </button>

          {!post.is_following_author ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(post.user_id);
              }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#00B050] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
              title="Follow creator"
            >
              <Plus size={13} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(post.user_id);
              }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-md"
              title="Following"
            >
              <Check size={11} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(post.id);
          }}
          className="flex flex-col items-center active:scale-90 transition-transform"
          aria-label="Like video"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              post.is_liked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/40 text-white'
            }`}
          >
            <Heart
              size={24}
              className={`transition-all duration-200 ${
                post.is_liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md mt-1 tabular-nums">
            {post.likes_count}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments(post);
          }}
          className="flex flex-col items-center active:scale-90 transition-transform"
          aria-label="Comments"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center">
            <MessageCircle size={23} />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md mt-1 tabular-nums">
            {post.comments_count}
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(post.id);
          }}
          className="flex flex-col items-center active:scale-90 transition-transform"
          aria-label="Save"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              post.is_saved ? 'bg-amber-500/20 text-amber-400' : 'bg-black/40 text-white'
            }`}
          >
            <Bookmark
              size={23}
              className={post.is_saved ? 'fill-amber-400 text-amber-400' : 'text-white'}
            />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md mt-1 tabular-nums">
            {post.saves_count}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(post);
          }}
          className="flex flex-col items-center active:scale-90 transition-transform"
          aria-label="Share"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center">
            <Share2 size={22} />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow-md mt-1 tabular-nums">
            {post.shares_count}
          </span>
        </button>

        {/* Rotating Music Disc */}
        <div className="mt-1 w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 p-1 flex items-center justify-center animate-[spin_6s_linear_infinite]">
          <Music size={14} className="text-[#00B050]" />
        </div>
      </div>

      {/* Bottom Content Area: Author, Caption, Hashtags, Audio */}
      <div className="absolute bottom-16 left-0 right-16 p-4 z-30 flex flex-col justify-end text-white text-left pointer-events-none">
        <div className="pointer-events-auto max-w-[90%]">
          {/* Author Row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAuthorProfile(post.user_id);
              }}
              className="flex items-center gap-1.5 group text-left"
            >
              <span className="font-bold text-sm text-white drop-shadow-md group-hover:underline">
                {post.user.display_name}
              </span>
              {post.user.is_verified && <VerifiedBadge size="sm" />}
            </button>

            <span className="text-white/60 text-xs">·</span>
            <span className="text-xs text-white/80">{post.user.username}</span>

            {!post.is_following_author && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle(post.user_id);
                }}
                className="ml-1 px-2.5 py-0.5 text-[11px] font-bold bg-[#00B050] text-white rounded-full hover:bg-[#009142] active:scale-95 transition-all shadow-xs"
              >
                Follow
              </button>
            )}
          </div>

          {/* Location */}
          {post.location && (
            <div className="flex items-center gap-1 text-[11px] text-white/80 mb-2">
              <MapPin size={12} className="text-[#00B050]" />
              <span>{post.location}</span>
            </div>
          )}

          {/* Caption */}
          <div className="mb-2">
            <p className="text-xs text-white/95 leading-relaxed drop-shadow-sm">
              {isCaptionExpanded || post.caption.length <= 80 ? (
                post.caption
              ) : (
                <>
                  {post.caption.slice(0, 80)}...{' '}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCaptionExpanded(true);
                    }}
                    className="text-white font-bold hover:underline"
                  >
                    more
                  </button>
                </>
              )}
            </p>

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {post.hashtags.map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold text-emerald-300">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Audio */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/80 overflow-hidden">
            <Music size={12} className="text-[#00B050] shrink-0" />
            <div className="truncate font-medium">{post.music_title || 'Original Audio · YOYO Sierra Leone'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
