import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { NavTab } from './components/navigation/BottomNavigation';
import { TopBar, FeedFilter } from './components/navigation/TopBar';
import { VideoFeed } from './components/feed/VideoFeed';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { UploadVideoModal } from './components/upload/UploadVideoModal';
import { MessagesScreen } from './components/messages/MessagesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { NotificationsScreen } from './components/notifications/NotificationsScreen';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { AuthModal } from './components/auth/AuthModal';
import { CommentSheet } from './components/common/CommentSheet';
import { ShareSheet } from './components/common/ShareSheet';

import { feedService } from './services/feedService';
import { postService } from './services/postService';
import { userService } from './services/userService';
import { VideoPost } from './types';

function YoyoAppContent() {
  const { user, openAuthModal } = useAuth();

  // Navigation states
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(() => {
    return localStorage.getItem('yoyo_welcome_seen') === 'true';
  });
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('for-you');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Modals & Sheets
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [commentPost, setCommentPost] = useState<VideoPost | null>(null);
  const [sharePost, setSharePost] = useState<VideoPost | null>(null);

  // Feed states
  const [posts, setPosts] = useState<VideoPost[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  // Fetch feed
  const loadFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    setFeedError(null);
    try {
      if (feedFilter === 'following') {
        const res = await feedService.getFollowingFeed();
        setPosts(res.items);
      } else {
        const res = await feedService.getFeed();
        setPosts(res.items);
      }
    } catch (err: any) {
      setFeedError(err.message || "YOYO couldn't connect right now.");
    } finally {
      setIsLoadingFeed(false);
    }
  }, [feedFilter]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Social interactions
  const handleLikeToggle = async (postId: string) => {
    if (!user) {
      openAuthModal('Log in or create an account to like videos');
      return;
    }

    try {
      const res = await postService.likePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, is_liked: res.is_liked, likes_count: res.likes_count } : p))
      );
    } catch {
      // Like failed
    }
  };

  const handleSaveToggle = async (postId: string) => {
    if (!user) {
      openAuthModal('Log in or create an account to save videos');
      return;
    }

    try {
      const res = await postService.savePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, is_saved: res.is_saved, saves_count: res.saves_count } : p))
      );
    } catch {
      // Save failed
    }
  };

  const handleFollowToggle = async (authorId: string) => {
    if (!user) {
      openAuthModal('Log in or create an account to follow creators');
      return;
    }

    const currentPost = posts.find((p) => p.user_id === authorId);
    const willFollow = !currentPost?.is_following_author;

    try {
      if (willFollow) {
        await userService.followUser(authorId);
      } else {
        await userService.unfollowUser(authorId);
      }

      setPosts((prev) =>
        prev.map((p) => (p.user_id === authorId ? { ...p, is_following_author: willFollow } : p))
      );
    } catch {
      // Follow failed
    }
  };

  const handleVideoPublished = (newPost: VideoPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab('home');
    setFeedFilter('for-you');
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'create') {
      if (!user) {
        openAuthModal('Log in or create a YOYO account to publish short-form videos');
      } else {
        setIsUploadOpen(true);
      }
      return;
    }
    setShowNotifications(false);
    setActiveTab(tab);
  };

  const dismissWelcome = () => {
    localStorage.setItem('yoyo_welcome_seen', 'true');
    setHasSeenWelcome(true);
  };

  return (
    <>
      {/* 1. Welcome Screen on first entrance */}
      {!hasSeenWelcome && (
        <WelcomeScreen
          onGetStarted={() => {
            dismissWelcome();
            openAuthModal('Join YOYO Sierra Leone to get started');
          }}
          onLogIn={() => {
            dismissWelcome();
            openAuthModal('Log in to your YOYO account');
          }}
          onSkipToFeed={() => {
            dismissWelcome();
          }}
        />
      )}

      <AppShell
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadMessagesCount={0}
        hideBottomNav={showNotifications}
      >
        {/* VIEW 1: Notifications Overlay */}
        {showNotifications ? (
          <NotificationsScreen onBack={() => setShowNotifications(false)} />
        ) : (
          <>
            {/* TAB 1: Home TikTok-Style Feed */}
            {activeTab === 'home' && (
              <div className="w-full h-full relative">
                {/* Floating Top Bar */}
                <TopBar
                  currentFilter={feedFilter}
                  onFilterChange={setFeedFilter}
                  onOpenSearch={() => setActiveTab('discover')}
                  onOpenNotifications={() => setShowNotifications(true)}
                  unreadNotificationsCount={0}
                  transparent={true}
                />

                {/* Vertical Fullscreen Video Feed */}
                <VideoFeed
                  posts={posts}
                  feedType={feedFilter}
                  isLoading={isLoadingFeed}
                  error={feedError}
                  onRetry={loadFeed}
                  onCreateVideo={() => {
                    if (!user) {
                      openAuthModal('Log in or create an account to create your first video');
                    } else {
                      setIsUploadOpen(true);
                    }
                  }}
                  onExploreCreators={() => setActiveTab('discover')}
                  onLikeToggle={handleLikeToggle}
                  onSaveToggle={handleSaveToggle}
                  onFollowToggle={handleFollowToggle}
                  onOpenComments={(post) => setCommentPost(post)}
                  onOpenShare={(post) => setSharePost(post)}
                  onOpenAuthorProfile={() => setActiveTab('profile')}
                />
              </div>
            )}

            {/* TAB 2: Discover / Search */}
            {activeTab === 'discover' && (
              <DiscoverScreen
                onOpenVideo={(v) => {
                  setPosts([v, ...posts.filter((p) => p.id !== v.id)]);
                  setActiveTab('home');
                }}
                onOpenUser={() => setActiveTab('profile')}
              />
            )}

            {/* TAB 3: Messages */}
            {activeTab === 'messages' && <MessagesScreen />}

            {/* TAB 4: User Profile */}
            {activeTab === 'profile' && (
              <ProfileScreen
                onOpenVideo={(v) => {
                  setPosts([v, ...posts.filter((p) => p.id !== v.id)]);
                  setActiveTab('home');
                }}
                onCreateVideo={() => setIsUploadOpen(true)}
              />
            )}
          </>
        )}

        {/* Global Modals & Drawers */}
        <UploadVideoModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onVideoPublished={handleVideoPublished}
        />

        {commentPost && (
          <CommentSheet
            post={commentPost}
            isOpen={!!commentPost}
            onClose={() => setCommentPost(null)}
            onCommentCountChange={(count) => {
              setPosts((prev) =>
                prev.map((p) => (p.id === commentPost.id ? { ...p, comments_count: count } : p))
              );
            }}
          />
        )}

        {sharePost && (
          <ShareSheet
            post={sharePost}
            isOpen={!!sharePost}
            onClose={() => setSharePost(null)}
          />
        )}

        {/* Global Auth Modal for real authentication */}
        <AuthModal />
      </AppShell>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <YoyoAppContent />
    </AuthProvider>
  );
}
