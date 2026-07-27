import React, { useState } from 'react';
import { StaffNotification } from '../../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Filter,
  Check
} from 'lucide-react';

interface CoordinatorNotificationsViewProps {
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTriggerToast: (msg: string) => void;
}

export const CoordinatorNotificationsView: React.FC<CoordinatorNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onTriggerToast
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'arrivals' | 'cancellations'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'arrivals') return notif.type === 'patient_checked_in' || notif.type === 'check_in';
    if (filter === 'cancellations') return notif.type === 'rescheduled';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16 px-1 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#4F8EF7]" />
            Reception Alerts
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Live updates on patient arrivals, walk-ins, schedule changes, and requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => {
              onMarkAllAsRead();
              onTriggerToast('All notifications marked as read.');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'arrivals', label: 'Patient Arrivals' },
          { id: 'cancellations', label: 'Cancellations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition-all ${
              filter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6 space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-sm">No notifications found</h3>
            <p className="text-xs text-slate-400">You are all caught up on front desk alerts!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-3xl border transition-all space-y-2 ${
                !notif.read
                  ? 'bg-blue-50/40 border-blue-100 shadow-3xs'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      notif.urgency === 'high'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-[#4F8EF7]'
                    }`}
                  >
                    {notif.type === 'patient_checked_in' || notif.type === 'check_in' ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate max-w-[200px] sm:max-w-md">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#4F8EF7] shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => {
                      onMarkAsRead(notif.id);
                      onTriggerToast('Alert marked as read.');
                    }}
                    className="p-2 rounded-xl hover:bg-slate-200/60 active:bg-slate-300/60 text-slate-500 hover:text-slate-700 font-bold shrink-0 self-start sm:self-center transition-colors"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
