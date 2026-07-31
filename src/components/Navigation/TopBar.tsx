import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  HeartPulse,
  CreditCard,
  Tag,
  X,
  ArrowLeft
} from 'lucide-react';
import { ClinicBranch, UserProfile, TabType } from '../../types';
import { NotificationCenter, NotificationCenterCategory } from '../Notifications/NotificationCenter';
import { LanguageSwitcher } from '../Language/LanguageSwitcher';

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
  const { t } = useTranslation('navigation');
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showNotificationsPage, setShowNotificationsPage] = useState(false);

  const categories: NotificationCenterCategory<PatientNotification>[] = [
    { id: 'all', label: t('topBar.categories.all'), match: () => true },
    { id: 'Appointment Confirmation', label: t('topBar.categories.appointmentConfirmations'), match: (n) => n.category === 'Appointment Confirmation' },
    { id: 'Appointment Reminder', label: t('topBar.categories.appointmentReminders'), match: (n) => n.category === 'Appointment Reminder' },
    { id: 'Follow-Up Reminder', label: t('topBar.categories.followUps'), match: (n) => n.category === 'Follow-Up Reminder' },
    { id: 'Payment Confirmation', label: t('topBar.categories.payments'), match: (n) => n.category === 'Payment Confirmation' },
    { id: 'Promotional Campaigns', label: t('topBar.categories.offers'), match: (n) => n.category === 'Promotional Campaigns' }
  ];

  // 5 Patient Notification Items
  const [notifications, setNotifications] = useState<PatientNotification[]>([
    {
      id: 'notif-1',
      category: 'Appointment Confirmation',
      title: t('topBar.mockNotifications.confirmation.title'),
      message: t('topBar.mockNotifications.confirmation.message'),
      timestamp: t('topBar.mockNotifications.confirmation.timestamp'),
      read: false,
      icon: Calendar,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'notif-2',
      category: 'Appointment Reminder',
      title: t('topBar.mockNotifications.reminder.title'),
      message: t('topBar.mockNotifications.reminder.message'),
      timestamp: t('topBar.mockNotifications.reminder.timestamp'),
      read: false,
      icon: Clock,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'notif-3',
      category: 'Follow-Up Reminder',
      title: t('topBar.mockNotifications.followUp.title'),
      message: t('topBar.mockNotifications.followUp.message'),
      timestamp: t('topBar.mockNotifications.followUp.timestamp'),
      read: false,
      icon: HeartPulse,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200'
    },
    {
      id: 'notif-4',
      category: 'Payment Confirmation',
      title: t('topBar.mockNotifications.payment.title'),
      message: t('topBar.mockNotifications.payment.message'),
      timestamp: t('topBar.mockNotifications.payment.timestamp'),
      read: true,
      icon: CreditCard,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'notif-5',
      category: 'Promotional Campaigns',
      title: t('topBar.mockNotifications.promo.title'),
      message: t('topBar.mockNotifications.promo.message'),
      timestamp: t('topBar.mockNotifications.promo.timestamp'),
      read: true,
      icon: Tag,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    }
  ]);

  const activeUnread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <>
      <header
        className="h-16 sm:h-20 px-3 sm:px-8 md:px-10 flex items-center justify-between border-b border-slate-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-30"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl">{t('brand')}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <LanguageSwitcher />

          {/* Branch Selector Pill */}
          <div className="relative">
            <button
              type="button"
              id="topbar-branch-selector-btn"
              onClick={() => {
                setShowBranchMenu(!showBranchMenu);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 active:scale-95 px-2.5 py-1.5 rounded-full text-xs font-medium text-slate-700 transition border border-slate-200/80 min-h-[36px] cursor-pointer"
              title={t('topBar.switchClinicLocation')}
            >
              <MapPin className="w-3.5 h-3.5 text-[#4F8EF7] shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-[160px] text-slate-800 font-semibold">
                {selectedBranch.name.replace('Reveal ', '')}
              </span>
            </button>

            {showBranchMenu && (
              <div className="absolute right-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('topBar.selectClinicLocation')}
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

          {/* Notifications Button (matches Doctor/Coordinator portal styling) */}
          <div className="relative">
            <button
              type="button"
              id="topbar-notifications-btn"
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setShowBranchMenu(false);
              }}
              className="relative w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition"
              title={t('topBar.notifications')}
            >
              <Bell className="w-4 h-4" />
              {activeUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {activeUnread}
                </span>
              )}
            </button>

            {showNotificationsDropdown && (
              <div
                id="topbar-notifications-panel"
                className="fixed left-4 right-4 top-14 max-w-md mx-auto w-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-fade-in"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('topBar.recentAlerts')}
                  </span>
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
                  {notifications.length === 0 ? (
                    <p className="text-center text-slate-400 text-[11px] py-4">{t('topBar.noRecentNotifications')}</p>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2 rounded-xl border text-[11px] transition-colors cursor-pointer text-left ${
                          !notif.read ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50/50 border-transparent'
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex justify-between font-bold text-slate-800">
                          <span className="truncate max-w-[150px]">{notif.title}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-500 line-clamp-1 mt-0.5 font-medium">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-center text-[10px]">
                  <button
                    onClick={() => {
                      setShowNotificationsPage(true);
                      setShowNotificationsDropdown(false);
                    }}
                    className="text-[#4F8EF7] font-bold hover:underline"
                  >
                    {t('topBar.openViewCenter')}
                  </button>
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-500 hover:underline font-semibold"
                  >
                    {t('topBar.dismiss')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Full-Screen Notification Center (capped to the same phone-width column as the rest of the app) */}
      {showNotificationsPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex justify-center animate-fade-in">
          <div className="w-full max-w-md h-full bg-[#F8FAFC] flex flex-col text-slate-800 overflow-y-auto">
            {/* Header */}
            <div
              className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs px-4 py-3 flex items-center gap-2 shrink-0 sticky top-0 z-10"
              style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
            >
              <button
                type="button"
                id="notifications-back-btn"
                onClick={() => setShowNotificationsPage(false)}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition"
                title={t('topBar.returnToPreviousScreen')}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-extrabold text-sm text-slate-900 flex-1">{t('topBar.notificationsHeading')}</h3>
              <button
                type="button"
                id="notifications-close-btn"
                onClick={() => setShowNotificationsPage(false)}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition"
                title={t('topBar.closeNotifications')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content container */}
            <div className="w-full p-3 sm:p-6 flex-1">
              <NotificationCenter
                title={t('topBar.notificationCenter.title')}
                subtitle={t('topBar.notificationCenter.subtitle')}
                items={notifications}
                categories={categories}
                getBadge={(n) => ({ icon: n.icon, className: n.badgeColor })}
                getDetailLabel={(n) => n.category.toUpperCase()}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllRead}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
