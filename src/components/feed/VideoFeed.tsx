import React, { useRef, useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { VideoPost } from '../../types';
import { FeedPost } from './FeedPost';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';

interface VideoFeedProps {
  posts: VideoPost[];
  feedType: 'for-you' | 'following' | 'freetown';
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onCreateVideo: () => void;
  onExploreCreators?: () => void;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onOpenComments: (post: VideoPost) => void;
  onOpenShare: (post: VideoPost) => void;
  onOpenAuthorProfile: (userId: string) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  posts,
  feedType,
  isLoading,
  error,
  onRetry,
  onCreateVideo,
  onExploreCreators,
  onLikeToggle,
  onSaveToggle,
  onFollowToggle,
  onOpenComments,
  onOpenShare,
  onOpenAuthorProfile,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Keyboard navigation up / down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (posts.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(Math.min(posts.length - 1, activeIndex + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(Math.max(0, activeIndex - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, posts.length]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeIndex && index >= 0 && index < posts.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const clientHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * clientHeight,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  // 1. Connection / Backend Error State
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} isRetrying={isLoading} />;
  }

  // 2. Loading indicator
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white select-none">
        <div className="w-10 h-10 border-4 border-[#00B050] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-medium">Loading YOYO feed...</p>
      </div>
    );
  }

  // 3. Strict Real Production Empty State
  if (posts.length === 0) {
    if (feedType === 'following') {
      return (
        <EmptyState
          type="following"
          onAction={onExploreCreators}
          actionLabel="Discover Creators"
        />
      );
    }

    return (
      <EmptyState
        type="feed"
        onAction={onCreateVideo}
        actionLabel="Create Your First Video"
      />
    );
  }

  // 4. Populated Vertical Snap Feed
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {posts.map((post, idx) => (
          <div key={post.id} className="w-full h-full snap-start shrink-0 relative">
            <FeedPost
              post={post}
              isActive={idx === activeIndex}
              onLikeToggle={onLikeToggle}
              onSaveToggle={onSaveToggle}
              onFollowToggle={onFollowToggle}
              onOpenComments={onOpenComments}
              onOpenShare={onOpenShare}
              onOpenAuthorProfile={onOpenAuthorProfile}
            />
          </div>
        ))}
      </div>

      {/* Desktop quick scroll chevrons */}
      {posts.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 absolute right-4 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              activeIndex === 0
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/40 shadow-lg'
            }`}
            title="Previous video"
          >
            <ChevronUp size={20} />
          </button>

          <span className="text-[10px] font-bold text-white/70 text-center tabular-nums">
            {activeIndex + 1}/{posts.length}
          </span>

          <button
            onClick={() => scrollToIndex(Math.min(posts.length - 1, activeIndex + 1))}
            disabled={activeIndex === posts.length - 1}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              activeIndex === posts.length - 1
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/40 shadow-lg'
            }`}
            title="Next video"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
