import { api } from '../api/client';
import { AuthSession, User } from '../types';

const STORAGE_KEY_USER = 'yoyo_auth_user';

export const authService = {
  getCurrentSession(): AuthSession {
    const token = api.getToken();
    const storedUserJson = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUserJson) {
      try {
        const user = JSON.parse(storedUserJson) as User;
        return {
          token,
          user,
          isAuthenticated: true,
        };
      } catch {
        // invalid JSON
      }
    }
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  },

  async login(usernameOrPhone: string, password?: string): Promise<User> {
    if (api.isConfigured()) {
      const response = await api.post<{ token: string; user: User }>('/api/v1/auth/login', {
        identifier: usernameOrPhone,
        password: password || '',
      });
      api.setToken(response.token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));
      return response.user;
    }

    // Local authentication for testing without live backend
    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`,
      username: usernameOrPhone.startsWith('@') ? usernameOrPhone : `@${usernameOrPhone.toLowerCase().replace(/\s+/g, '_')}`,
      display_name: usernameOrPhone.replace(/^@/, ''),
      avatar_url: null,
      bio: null,
      location: 'Freetown, Sierra Leone',
      followers_count: 0,
      following_count: 0,
      likes_count: 0,
      is_verified: false,
      created_at: new Date().toISOString(),
    };

    api.setToken(`local_token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return newUser;
  },

  async signup(data: {
    username: string;
    display_name: string;
    phone?: string;
    password?: string;
  }): Promise<User> {
    if (api.isConfigured()) {
      const response = await api.post<{ token: string; user: User }>('/api/v1/auth/signup', data);
      api.setToken(response.token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(response.user));
      return response.user;
    }

    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`,
      username: data.username.startsWith('@') ? data.username : `@${data.username.toLowerCase().replace(/\s+/g, '_')}`,
      display_name: data.display_name,
      avatar_url: null,
      bio: null,
      location: 'Freetown, Sierra Leone',
      followers_count: 0,
      following_count: 0,
      likes_count: 0,
      is_verified: false,
      created_at: new Date().toISOString(),
    };

    api.setToken(`local_token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return newUser;
  },

  async logout(): Promise<void> {
    if (api.isConfigured()) {
      try {
        await api.post('/api/v1/auth/logout');
      } catch {
        // Ignore logout errors
      }
    }
    api.setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentSession().user;
    if (!current) throw new Error('Not authenticated');

    const updated: User = { ...current, ...updates };

    if (api.isConfigured()) {
      const serverUser = await api.post<User>('/api/v1/users/me', updates);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(serverUser));
      return serverUser;
    }

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  },
};
