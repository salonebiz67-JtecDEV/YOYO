import { api } from '../api/client';
import { NotificationItem } from '../types';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (api.isConfigured()) {
      return await api.get<NotificationItem[]>('/api/v1/notifications');
    }

    // Default real state: no notifications initially
    return [];
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (api.isConfigured()) {
      await api.post(`/api/v1/notifications/${notificationId}/read`);
    }
  },

  async markAllAsRead(): Promise<void> {
    if (api.isConfigured()) {
      await api.post('/api/v1/notifications/read-all');
    }
  },
};
