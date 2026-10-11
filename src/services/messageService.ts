import { api } from '../api/client';
import { Conversation, DirectMessage } from '../types';
import { authService } from './authService';

const STORAGE_KEY_CONVS = 'yoyo_direct_conversations';

function getStoredConversations(): Conversation[] {
  const json = localStorage.getItem(STORAGE_KEY_CONVS);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

function saveStoredConversations(convs: Conversation[]) {
  localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(convs));
}

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    if (api.isConfigured()) {
      return await api.get<Conversation[]>('/api/v1/messages/conversations');
    }

    return getStoredConversations();
  },

  async getMessages(conversationId: string): Promise<DirectMessage[]> {
    if (api.isConfigured()) {
      return await api.get<DirectMessage[]>(`/api/v1/messages/conversations/${conversationId}`);
    }

    const conv = getStoredConversations().find((c) => c.id === conversationId);
    return conv?.messages || [];
  },

  async sendMessage(conversationId: string, text: string): Promise<DirectMessage> {
    const session = authService.getCurrentSession();
    if (!session.user) {
      throw new Error('You must be logged in to send messages');
    }

    if (api.isConfigured()) {
      return await api.post<DirectMessage>(`/api/v1/messages/conversations/${conversationId}`, { text });
    }

    const newMsg: DirectMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: session.user.id,
      text: text.trim(),
      created_at: new Date().toISOString(),
      is_read: true,
    };

    const convs = getStoredConversations();
    const updated = convs.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          last_message: text.trim(),
          last_message_at: new Date().toISOString(),
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });
    saveStoredConversations(updated);

    return newMsg;
  },
};
