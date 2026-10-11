import { api } from '../api/client';
import { PostComment } from '../types';
import { authService } from './authService';

const STORAGE_KEY_COMMENTS = 'yoyo_published_comments';

function getStoredComments(): Record<string, PostComment[]> {
  const json = localStorage.getItem(STORAGE_KEY_COMMENTS);
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function saveStoredComments(all: Record<string, PostComment[]>) {
  localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(all));
}

export const commentService = {
  async getComments(videoId: string): Promise<PostComment[]> {
    if (api.isConfigured()) {
      return await api.get<PostComment[]>(`/api/v1/videos/${videoId}/comments`);
    }

    const all = getStoredComments();
    return all[videoId] || [];
  },

  async createComment(videoId: string, text: string): Promise<PostComment> {
    const session = authService.getCurrentSession();
    if (!session.user) {
      throw new Error('You must be logged in to comment');
    }

    if (api.isConfigured()) {
      return await api.post<PostComment>(`/api/v1/videos/${videoId}/comments`, { text });
    }

    const newComment: PostComment = {
      id: crypto.randomUUID ? crypto.randomUUID() : `cmt_${Date.now()}`,
      video_id: videoId,
      user_id: session.user.id,
      user: session.user,
      text: text.trim(),
      likes_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
    };

    const all = getStoredComments();
    const existing = all[videoId] || [];
    all[videoId] = [newComment, ...existing];
    saveStoredComments(all);

    return newComment;
  },

  async deleteComment(videoId: string, commentId: string): Promise<void> {
    if (api.isConfigured()) {
      await api.delete(`/api/v1/videos/${videoId}/comments/${commentId}`);
      return;
    }

    const all = getStoredComments();
    if (all[videoId]) {
      all[videoId] = all[videoId].filter((c) => c.id !== commentId);
      saveStoredComments(all);
    }
  },
};
