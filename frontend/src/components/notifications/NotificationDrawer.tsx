import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, BellOff, ArrowRight, Loader2 } from 'lucide-react';
import { getUnreadNotifications, markNotificationAsRead, acknowledgeNotification } from '../../services/api.js';
import { NotificationCard, NotificationItem } from './NotificationCard.js';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnread = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnreadNotifications();
      setNotifications(data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUnread();
    }
  }, [isOpen]);

  const handleRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Dispatch custom event to notify parent headers to refresh count
      window.dispatchEvent(new Event('unread-notifications-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeNotification(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, acknowledgedStatus: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      />
      
      {/* Sliding Drawer Container */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-white/10 h-full p-6 shadow-2xl z-10 flex flex-col justify-between">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wide">Alert Center</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                  {notifications.length} Unread Notifications
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/5 cursor-pointer transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Compiling alert feeds...</span>
              </div>
            ) : error ? (
              <div className="py-10 text-center text-xs text-rose-400 font-semibold">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                <BellOff className="h-10 w-10 text-slate-600" />
                <span className="text-xs font-semibold">All caught up! No unread tasks.</span>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onRead={handleRead}
                  onAcknowledge={handleAcknowledge}
                />
              ))
            )}
          </div>
        </div>

        {/* View Center Action */}
        <button
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
          className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/10"
        >
          <span>Open Communication Center</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
