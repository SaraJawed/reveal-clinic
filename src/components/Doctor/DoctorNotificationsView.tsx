import React, { useState } from 'react';
import { StaffNotification } from '../../types';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Package,
  Calendar,
  X,
  Filter,
  Check
} from 'lucide-react';

interface DoctorNotificationsViewProps {
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const DoctorNotificationsView: React.FC<DoctorNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedNotif, setSelectedNotif] = useState<StaffNotification | null>(null);

  const filteredNotifications = notifications.filter((notif) => {
    if (categoryFilter !== 'all' && notif.type !== categoryFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeBadge = (type: StaffNotification['type']) => {
    switch (type) {
      case 'check_in':
        return { icon: UserCheck, class: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'emergency':
        return { icon: AlertCircle, class: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'consumable_request':
        return { icon: Package, class: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { icon: Bell, class: 'bg-blue-100 text-[#4F8EF7] border-blue-200' };
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Clinical Notification Center
            </h1>
            <p className="text-xs text-slate-500">
              Real-time patient check-ins, room readiness, urgent requests, and schedule changes
            </p>
          </div>
        </div>

        {/* Mark All Read */}
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-100 space-x-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'check_in', label: 'Patient Check-Ins' },
          { id: 'consumable_request', label: 'Consumables & Stock' },
          { id: 'emergency', label: 'Urgent Directives' },
          { id: 'cancellation', label: 'Schedule Changes' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              categoryFilter === cat.id
                ? 'bg-[#4F8EF7] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-xs">No Notifications Found</h3>
            <p className="text-[11px] text-slate-400">All alerts in this category have been addressed.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const badge = getTypeBadge(notif.type);
            const Icon = badge.icon;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  setSelectedNotif(notif);
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  !notif.read
                    ? 'bg-amber-50/40 border-amber-200/80 shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-2xl border ${badge.class} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-slate-900 truncate">{notif.title}</h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">{notif.timestamp}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notif.id);
                  }}
                  className="text-xs font-bold text-[#4F8EF7] hover:underline shrink-0"
                >
                  {!notif.read ? 'Read' : 'View'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Detail Sheet / Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">{selectedNotif.title}</h3>
              <button onClick={() => setSelectedNotif(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {selectedNotif.message}
            </p>

            <div className="text-[11px] text-slate-400 flex justify-between font-semibold">
              <span>Category: {selectedNotif.type.replace('_', ' ').toUpperCase()}</span>
              <span>{selectedNotif.timestamp}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Close Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
