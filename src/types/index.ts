/**
 * Real Production Data Types for YOYO Sierra Leone
 * Matches the FastAPI / Supabase PostgreSQL backend schema.
 * Note: No fake demo entities or mock datasets.
 */

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  followers_count: number;
  following_count: number;
  likes_count: number;
  is_verified?: boolean;
  created_at: string;
}

export interface VideoPost {
  id: string;
  user_id: string;
  user: User;
  video_url: string;
  thumbnail_url: string | null;
  caption: string;
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  is_liked: boolean;
  is_saved: boolean;
  is_following_author: boolean;
  location: string | null;
  music_title: string | null;
  status: 'published' | 'processing' | 'draft';
  visibility: 'public' | 'followers' | 'private';
  created_at: string;
}

export interface PostComment {
  id: string;
  video_id: string;
  user_id: string;
  user: User;
  text: string;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  messages: DirectMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  actor: User;
  video_id?: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface FeedResponse {
  items: VideoPost[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface AuthSession {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
