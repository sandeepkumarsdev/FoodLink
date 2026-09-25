import React from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed 
} from 'lucide-react';
import { NotificationItem } from '../types';
import { formatDateTime } from '../utils/helpers';

interface NotificationsDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectFoodPost?: (foodPostId: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectFoodPost,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'NEW_FOOD':
        return <UtensilsCrossed className="w-4 h-4 text-emerald-600" />;
      case 'CLAIM_SUCCESS':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'FOOD_CLAIMED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'FOOD_COLLECTED':
        return <Check className="w-4 h-4 text-blue-600" />;
      case 'CLAIM_CANCELLED':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'DEADLINE_WARNING':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/20 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-right-4 duration-200 mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications yet. You will be alerted when new surplus food is published or claimed.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) onMarkAsRead(notif.id);
                  if (notif.foodPostId && onSelectFoodPost) {
                    onSelectFoodPost(notif.foodPostId);
                    onClose();
                  }
                }}
                className={`p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                  notif.read ? 'hover:bg-slate-50 opacity-75' : 'bg-emerald-50/40 hover:bg-emerald-50/70 font-medium'
                }`}
              >
                <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
