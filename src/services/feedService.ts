import { api } from '../api/client';
import { FeedResponse, VideoPost } from '../types';

const STORAGE_KEY_POSTS = 'yoyo_published_videos';

function getStoredPosts(): VideoPost[] {
  const json = localStorage.getItem(STORAGE_KEY_POSTS);
  if (!json) return [];
  try {
    return JSON.parse(json) as VideoPost[];
  } catch {
    return [];
  }
}

export const feedService = {
  async getFeed(cursor?: string | null, limit: number = 10): Promise<FeedResponse> {
    if (api.isConfigured()) {
      const query = new URLSearchParams({
        limit: String(limit),
        ...(cursor ? { cursor } : {}),
      });
      return await api.get<FeedResponse>(`/api/v1/feed?${query.toString()}`);
    }

    // Real production empty-first state: returns user-uploaded videos or empty
    const posts = getStoredPosts();
    return {
      items: posts,
      next_cursor: null,
      has_more: false,
    };
  },

  async getFollowingFeed(cursor?: string | null, limit: number = 10): Promise<FeedResponse> {
    if (api.isConfigured()) {
      const query = new URLSearchParams({
        limit: String(limit),
        ...(cursor ? { cursor } : {}),
      });
      return await api.get<FeedResponse>(`/api/v1/feed/following?${query.toString()}`);
    }

    // When no users are followed or no videos exist:
    const posts = getStoredPosts().filter((p) => p.is_following_author);
    return {
      items: posts,
      next_cursor: null,
      has_more: false,
    };
  },
};
