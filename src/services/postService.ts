import { api } from '../api/client';
import { User, VideoPost } from '../types';
import { authService } from './authService';

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

function saveStoredPosts(posts: VideoPost[]) {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
}

export const postService = {
  async uploadVideo(params: {
    videoFile?: File;
    videoUrl?: string;
    caption: string;
    hashtags?: string[];
    location?: string;
  }): Promise<VideoPost> {
    const session = authService.getCurrentSession();
    if (!session.user) {
      throw new Error('You must be logged in to upload a video on YOYO');
    }

    if (api.isConfigured() && params.videoFile) {
      const formData = new FormData();
      formData.append('video', params.videoFile);
      formData.append('caption', params.caption);
      if (params.hashtags) formData.append('hashtags', JSON.stringify(params.hashtags));
      if (params.location) formData.append('location', params.location);

      return await api.post<VideoPost>('/api/v1/videos/upload', formData);
    }

    // Client/local production pipeline: construct video object
    let videoUrl = params.videoUrl || '';
    if (params.videoFile) {
      videoUrl = URL.createObjectURL(params.videoFile);
    }

    const newPost: VideoPost = {
      id: crypto.randomUUID ? crypto.randomUUID() : `vid_${Date.now()}`,
      user_id: session.user.id,
      user: session.user,
      video_url: videoUrl,
      thumbnail_url: null,
      caption: params.caption.trim(),
      hashtags: params.hashtags || [],
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      saves_count: 0,
      is_liked: false,
      is_saved: false,
      is_following_author: false,
      location: params.location || 'Freetown, Sierra Leone',
      music_title: 'Original Audio · YOYO Salone',
      status: 'published',
      visibility: 'public',
      created_at: new Date().toISOString(),
    };

    const existing = getStoredPosts();
    saveStoredPosts([newPost, ...existing]);

    return newPost;
  },

  async likePost(postId: string): Promise<{ likes_count: number; is_liked: boolean }> {
    if (api.isConfigured()) {
      return await api.post<{ likes_count: number; is_liked: boolean }>(`/api/v1/videos/${postId}/like`);
    }

    const posts = getStoredPosts();
    let updatedLikes = 0;
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isLiked = !p.is_liked;
        const count = isLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1);
        updatedLikes = count;
        return { ...p, is_liked: isLiked, likes_count: count };
      }
      return p;
    });
    saveStoredPosts(updated);
    return { likes_count: updatedLikes, is_liked: true };
  },

  async savePost(postId: string): Promise<{ saves_count: number; is_saved: boolean }> {
    if (api.isConfigured()) {
      return await api.post<{ saves_count: number; is_saved: boolean }>(`/api/v1/videos/${postId}/save`);
    }

    const posts = getStoredPosts();
    let updatedSaves = 0;
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isSaved = !p.is_saved;
        const count = isSaved ? p.saves_count + 1 : Math.max(0, p.saves_count - 1);
        updatedSaves = count;
        return { ...p, is_saved: isSaved, saves_count: count };
      }
      return p;
    });
    saveStoredPosts(updated);
    return { saves_count: updatedSaves, is_saved: true };
  },

  async deletePost(postId: string): Promise<void> {
    if (api.isConfigured()) {
      await api.delete(`/api/v1/videos/${postId}`);
      return;
    }

    const posts = getStoredPosts().filter((p) => p.id !== postId);
    saveStoredPosts(posts);
  },
};
