import React, { useState } from 'react';
import {
  Bell,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  HeartPulse,
  CreditCard,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { ClinicBranch, UserProfile, TabType } from '../../types';

interface TopBarProps {
  user: UserProfile;
  branches: ClinicBranch[];
  selectedBranch: ClinicBranch;
  onSelectBranch: (branch: ClinicBranch) => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  unreadCount: number;
}

interface PatientNotification {
  id: string;
  category: 'Appointment Confirmation' | 'Appointment Reminder' | 'Follow-Up Reminder' | 'Payment Confirmation' | 'Promotional Campaigns';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.FC<{ className?: string }>;
  badgeColor: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  branches,
  selectedBranch,
  onSelectBranch,
}) => {
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotificationsPage, setShowNotificationsPage] = useState(false);

  // 5 Patient Notification Items
  const [notifications, setNotifications] = useState<PatientNotification[]>([
    {
      id: 'notif-1',
      category: 'Appointment Confirmation',
      title: 'Appointment Confirmation',
      message: 'Your appointment for Laser Skin Resurfacing with Dr. Elena Rostova on Oct 24 at 10:00 AM has been confirmed.',
      timestamp: 'Just now',
      read: false,
      icon: Calendar,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'notif-2',
      category: 'Appointment Reminder',
      title: 'Appointment Reminder',
      message: 'Reminder: You have an upcoming consultation tomorrow at 10:00 AM at Reveal Olaya Center (Riyadh). Please arrive 10 mins early.',
      timestamp: '2 hours ago',
      read: false,
      icon: Clock,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'notif-3',
      category: 'Follow-Up Reminder',
      title: 'Follow-Up Reminder',
      message: 'Post-procedure care: How is your skin recovery following your HydraFacial session? Tap to record post-care notes.',
      timestamp: '1 day ago',
      read: false,
      icon: HeartPulse,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200'
    },
    {
      id: 'notif-4',
      category: 'Payment Confirmation',
      title: 'Payment Confirmation',
      message: 'Payment of SAR 850.00 received for Consultation & Laser Session. Receipt #RC-INV-2026-8842.',
      timestamp: '2 days ago',
      read: true,
      icon: CreditCard,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'notif-5',
      category: 'Promotional Campaigns',
      title: 'Promotional Campaigns',
      message: 'Exclusive Campaign: Enjoy 20% off all Glow & Radiance Peel packages this month at Reveal Clinic Riyadh!',
      timestamp: '3 days ago',
      read: true,
      icon: Tag,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    }
  ]);

  const activeUnread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <>
      <header className="h-16 sm:h-20 px-3 sm:px-8 md:px-10 flex items-center justify-between border-b border-slate-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl">Reveal Clinic</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Branch Selector Pill */}
          <div className="relative">
            <button
              type="button"
              id="topbar-branch-selector-btn"
              onClick={() => {
                setShowBranchMenu(!showBranchMenu);
                setShowNotificationsPage(false);
              }}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 active:scale-95 px-2.5 py-1.5 rounded-full text-xs font-medium text-slate-700 transition border border-slate-200/80 min-h-[36px] cursor-pointer"
              title="Switch Clinic Location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#4F8EF7] shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-[160px] text-slate-800 font-semibold">
                {selectedBranch.name.replace('Reveal ', '')}
              </span>
            </button>

            {showBranchMenu && (
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Clinic Location
                </div>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    id={`topbar-branch-item-${b.id}`}
                    onClick={() => {
                      onSelectBranch(b);
                      setShowBranchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-blue-50 transition active:bg-blue-100 cursor-pointer ${
                      b.id === selectedBranch.id ? 'font-bold text-[#4F8EF7] bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate">{b.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{b.city} • {b.distance}</div>
                    </div>
                    {b.id === selectedBranch.id && (
                      <ShieldCheck className="w-4 h-4 text-[#4F8EF7] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              id="topbar-notifications-btn"
              onClick={() => {
                setShowNotificationsPage(true);
                setShowBranchMenu(false);
              }}
              className="relative p-2 text-slate-500 hover:text-[#4F8EF7] hover:bg-slate-100/80 active:scale-95 transition-colors rounded-full cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {activeUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>


        </div>
      </header>

      {/* Full-Screen Notifications Page */}
      {showNotificationsPage && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-fade-in text-slate-800 overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 shrink-0 shadow-md sticky top-0 z-10">
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="notifications-back-btn"
                  onClick={() => setShowNotificationsPage(false)}
                  className="p-1.5 sm:p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl sm:rounded-2xl transition font-bold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer shrink-0"
                  title="Return to Previous Screen"
                >
                  <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                </button>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0 hidden xs:block" />
                  <h3 className="font-extrabold text-sm sm:text-lg truncate">Notifications</h3>
                  {activeUnread > 0 && (
                    <span className="bg-sky-500/30 text-sky-200 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full border border-sky-400/30 shrink-0">
                      {activeUnread} new
                    </span>
                  )}
                </div>
              </div>

              {/* Mark all read / close for mobile inline */}
              <div className="flex items-center gap-2 sm:hidden">
                {activeUnread > 0 && (
                  <button
                    type="button"
                    id="notifications-mark-all-read-mobile-btn"
                    onClick={markAllRead}
                    className="text-xs text-sky-300 hover:text-white underline font-semibold transition cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  id="notifications-close-mobile-btn"
                  onClick={() => setShowNotificationsPage(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  title="Close Notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop only right controls */}
            <div className="hidden sm:flex items-center gap-3">
              {activeUnread > 0 && (
                <button
                  type="button"
                  id="notifications-mark-all-read-btn"
                  onClick={markAllRead}
                  className="text-xs text-sky-300 hover:text-white underline font-semibold transition cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                id="notifications-close-btn"
                onClick={() => setShowNotificationsPage(false)}
                className="p-2 text-slate-300 hover:text-white rounded-2xl hover:bg-slate-800 transition cursor-pointer"
                title="Close Notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content container */}
          <div className="max-w-4xl mx-auto w-full p-3 sm:p-8 space-y-4 flex-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Clinic Alerts & Updates</span>
              <span className="text-xs text-slate-400">{notifications.length} total</span>
            </div>

            <div className="space-y-2.5">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => toggleRead(n.id)}
                    className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl transition cursor-pointer flex items-start gap-3 sm:gap-4 shadow-xs border ${
                      !n.read ? 'bg-blue-50/70 hover:bg-blue-50 border-blue-200' : 'bg-white hover:bg-slate-50 border-slate-200/80 opacity-90'
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${n.badgeColor}`}>
                          {n.category}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium shrink-0">{n.timestamp}</span>
                      </div>

                      <p className="text-xs sm:text-base font-bold text-slate-900 leading-snug">{n.title}</p>
                      <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed">{n.message}</p>
                    </div>

                    {!n.read && (
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600 shrink-0 self-center" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 text-center shadow-xs mt-6">
              <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Reveal Patient Portal Alerts Active • Securely encrypted
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

