import { api } from '../api/client';
import { User, VideoPost } from '../types';
import { authService } from './authService';

export const userService = {
  async getUserProfile(usernameOrId: string): Promise<{ user: User; videos: VideoPost[] }> {
    if (api.isConfigured()) {
      return await api.get<{ user: User; videos: VideoPost[] }>(`/api/v1/users/${usernameOrId}`);
    }

    const session = authService.getCurrentSession();
    if (session.user && (session.user.id === usernameOrId || session.user.username === usernameOrId)) {
      const postsJson = localStorage.getItem('yoyo_published_videos');
      const allPosts: VideoPost[] = postsJson ? JSON.parse(postsJson) : [];
      const userPosts = allPosts.filter((p) => p.user_id === session.user?.id);
      return {
        user: session.user,
        videos: userPosts,
      };
    }

    throw new Error('User not found');
  },

  async followUser(userId: string): Promise<{ is_following: boolean; followers_count: number }> {
    if (api.isConfigured()) {
      return await api.post<{ is_following: boolean; followers_count: number }>(`/api/v1/users/${userId}/follow`);
    }

    return { is_following: true, followers_count: 1 };
  },

  async unfollowUser(userId: string): Promise<{ is_following: boolean; followers_count: number }> {
    if (api.isConfigured()) {
      return await api.delete<{ is_following: boolean; followers_count: number }>(`/api/v1/users/${userId}/follow`);
    }

    return { is_following: false, followers_count: 0 };
  },

  async search(query: string): Promise<{ users: User[]; videos: VideoPost[]; hashtags: string[] }> {
    if (api.isConfigured()) {
      return await api.get(`/api/v1/search?q=${encodeURIComponent(query)}`);
    }

    if (!query.trim()) {
      return { users: [], videos: [], hashtags: [] };
    }

    const postsJson = localStorage.getItem('yoyo_published_videos');
    const allPosts: VideoPost[] = postsJson ? JSON.parse(postsJson) : [];
    const q = query.toLowerCase();

    const matchedVideos = allPosts.filter(
      (v) => v.caption.toLowerCase().includes(q) || v.hashtags.some((h) => h.toLowerCase().includes(q))
    );

    return {
      users: [],
      videos: matchedVideos,
      hashtags: [],
    };
  },
};
