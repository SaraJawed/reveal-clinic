import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile, ClinicBranch, StaffNotification } from '../../types';
import { UserCheck, Bell, RefreshCw, ChevronDown, CheckCircle, MapPin, Search, X } from 'lucide-react';
import { LanguageSwitcher } from '../Language/LanguageSwitcher';

interface CoordinatorTopBarProps {
  user: UserProfile;
  selectedBranch: ClinicBranch;
  onChangeBranch: (branch: ClinicBranch) => void;
  branches: ClinicBranch[];
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onSwitchRole: () => void;
  onQuickSearchClick?: () => void;
  onStatusChange?: (status: 'Available' | 'In Consultation' | 'In Procedure' | 'On Break' | 'Off Duty') => void;
  notifications?: StaffNotification[];
  onMarkAsRead?: (id: string) => void;
}

export const CoordinatorTopBar: React.FC<CoordinatorTopBarProps> = ({
  user,
  selectedBranch,
  onChangeBranch,
  branches,
  unreadNotificationsCount,
  onOpenNotifications,
  onSwitchRole,
  onQuickSearchClick,
  onStatusChange,
  notifications = [],
  onMarkAsRead
}) => {
  const { t } = useTranslation('navigation');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const statusColors = {
    'Available': 'bg-emerald-500 text-white',
    'In Consultation': 'bg-[#4F8EF7] text-white',
    'In Procedure': 'bg-purple-600 text-white',
    'On Break': 'bg-amber-500 text-white',
    'Off Duty': 'bg-slate-400 text-white'
  };

  const statusLabels: Record<keyof typeof statusColors, string> = {
    'Available': t('coordinatorTopBar.status.onDuty'),
    'In Consultation': t('coordinatorTopBar.status.inConsultation'),
    'In Procedure': t('coordinatorTopBar.status.inProcedure'),
    'On Break': t('coordinatorTopBar.status.onBreak'),
    'Off Duty': t('coordinatorTopBar.status.offDuty')
  };

  const currentStatus = user.availabilityStatus || 'Available';

  return (
    <header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl">{t('brand')}</span>
        </div>

        {/* Right: Quick Search, Duty Status, Notifications */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Quick Search trigger */}
          {onQuickSearchClick && (
            <button
              onClick={onQuickSearchClick}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all text-xs font-semibold flex items-center gap-1.5"
              title={t('coordinatorTopBar.searchPatientOrAppointment')}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">{t('coordinatorTopBar.quickFind')}</span>
            </button>
          )}

          {/* Status Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition-all ${
                statusColors[currentStatus] || 'bg-emerald-500 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{statusLabels[currentStatus]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
                {(['Available', 'On Break', 'Off Duty'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (onStatusChange) onStatusChange(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                      currentStatus === status ? 'text-[#4F8EF7] font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{statusLabels[status]}</span>
                    {currentStatus === status && <CheckCircle className="w-3.5 h-3.5 text-[#4F8EF7]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              id="coordinator-notifications-btn"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="relative w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition"
              title={t('coordinatorTopBar.notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotificationsDropdown && (
              <div
                id="coordinator-notifications-panel"
                className="fixed left-4 right-4 top-14 max-w-md mx-auto w-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-fade-in"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('coordinatorTopBar.recentAlerts')}
                  </span>
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
                  {(!notifications || notifications.length === 0) ? (
                    <p className="text-center text-slate-400 text-[11px] py-4">{t('coordinatorTopBar.noRecentNotifications')}</p>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2 rounded-xl border text-[11px] transition-colors cursor-pointer text-left ${
                          !notif.read ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50/50 border-transparent'
                        }`}
                        onClick={() => {
                          if (onMarkAsRead) onMarkAsRead(notif.id);
                        }}
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
                      onOpenNotifications();
                      setShowNotificationsDropdown(false);
                    }}
                    className="text-[#4F8EF7] font-bold hover:underline"
                  >
                    {t('coordinatorTopBar.openViewCenter')}
                  </button>
                  <button
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-500 hover:underline font-semibold"
                  >
                    {t('coordinatorTopBar.dismiss')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
