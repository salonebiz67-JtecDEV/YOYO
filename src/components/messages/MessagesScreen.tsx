import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { Conversation, DirectMessage } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const MessagesScreen: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      messageService
        .getConversations()
        .then((data) => setConversations(data))
        .catch(() => setConversations([]))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const openConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    try {
      const msgs = await messageService.getMessages(conv.id);
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    try {
      const newMsg = await messageService.sendMessage(activeConv.id, inputText.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
    } catch {
      // Message send failed
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none bg-white">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-base font-extrabold text-[#0B1F3B]">Sign in to Direct Messages</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Chat with creators and friends across Sierra Leone.
        </p>
        <button
          onClick={() => openAuthModal('Log in or create an account to send direct messages')}
          className="mt-5 px-6 py-3 rounded-full bg-[#00B050] hover:bg-[#009142] text-white text-xs font-extrabold active:scale-95 transition-all shadow-md shadow-emerald-700/20"
        >
          Log In / Sign Up
        </button>
      </div>
    );
  }

  // Active chat view
  if (activeConv) {
    return (
      <div className="w-full h-full min-h-screen bg-slate-50 flex flex-col pb-20 overflow-hidden">
        {/* Chat Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveConv(null)}
              className="p-1.5 -ml-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {activeConv.participant.display_name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B1F3B]">{activeConv.participant.display_name}</p>
                <p className="text-[10px] text-slate-400">{activeConv.participant.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No messages yet. Send a greeting!
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.sender_id === user.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                      isMine
                        ? 'bg-[#00B050] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-100 rounded-full border border-transparent focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-[#00B050] text-white hover:bg-[#009142] disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Conversation list view
  return (
    <div className="w-full h-full min-h-screen bg-slate-50 pb-24 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <h1 className="font-extrabold text-base text-[#0B1F3B]">Direct Messages</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {conversations.length === 0 ? (
          <EmptyState type="messages" />
        ) : (
          <div className="space-y-2">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => openConversation(c)}
                className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                  {c.participant.display_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-[#0B1F3B] truncate">{c.participant.display_name}</p>
                    <span className="text-[10px] text-slate-400">{c.last_message_at}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{c.last_message || 'New conversation'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
