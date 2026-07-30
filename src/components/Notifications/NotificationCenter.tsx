import React, { useState } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';

export interface NotificationCenterBaseItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationCenterCategory<T> {
  id: string;
  label: string;
  match: (item: T) => boolean;
}

export interface NotificationCenterBadge {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

interface NotificationCenterProps<T extends NotificationCenterBaseItem> {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  items: T[];
  categories: NotificationCenterCategory<T>[];
  getBadge: (item: T) => NotificationCenterBadge;
  getDetailLabel: (item: T) => string;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationCenter<T extends NotificationCenterBaseItem>({
  icon: HeaderIcon = Bell,
  title,
  subtitle,
  items,
  categories,
  getBadge,
  getDetailLabel,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationCenterProps<T>) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const activeCategory = categories.find((cat) => cat.id === categoryFilter);
  const filteredItems =
    categoryFilter === 'all' || !activeCategory ? items : items.filter((item) => activeCategory.match(item));

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 relative">
            <HeaderIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">{title}</h1>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

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
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              categoryFilter === cat.id ? 'bg-[#4F8EF7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-2">
            <HeaderIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-xs">No Notifications Found</h3>
            <p className="text-[11px] text-slate-400">All alerts in this category have been addressed.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const badge = getBadge(item);
            const Icon = badge.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  setSelectedItem(item);
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  !item.read
                    ? 'bg-amber-50/40 border-amber-200/80 shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-2xl border ${badge.className} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-slate-900 truncate">{item.title}</h3>
                      {!item.read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-2">{item.message}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{item.timestamp}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(item.id);
                  }}
                  className="text-xs font-bold text-[#4F8EF7] hover:underline shrink-0"
                >
                  {!item.read ? 'Read' : 'View'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Detail Sheet / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">{selectedItem.title}</h3>
              <button onClick={() => setSelectedItem(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {selectedItem.message}
            </p>

            <div className="text-[11px] text-slate-400 flex justify-between font-semibold">
              <span>Category: {getDetailLabel(selectedItem)}</span>
              <span>{selectedItem.timestamp}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
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
}
