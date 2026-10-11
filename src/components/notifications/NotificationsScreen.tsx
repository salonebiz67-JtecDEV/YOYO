import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      notificationService
        .getNotifications()
        .then((items) => setNotifications(items))
        .catch(() => setNotifications([]))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none bg-white">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <Bell size={32} />
        </div>
        <h2 className="text-base font-extrabold text-[#0B1F3B]">Sign in for Notifications</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          Stay updated when creators like or comment on your videos.
        </p>
        <button
          onClick={() => openAuthModal('Log in or create an account to view notifications')}
          className="mt-5 px-6 py-3 rounded-full bg-[#00B050] hover:bg-[#009142] text-white text-xs font-extrabold active:scale-95 transition-all shadow-md shadow-emerald-700/20"
        >
          Log In / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 pb-24 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="font-extrabold text-base text-[#0B1F3B]">Notifications</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {notifications.length === 0 ? (
          <EmptyState type="notifications" />
        ) : (
          <div className="space-y-2">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                  {item.actor.display_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0B1F3B]">{item.message}</p>
                  <span className="text-[10px] text-slate-400">{item.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
