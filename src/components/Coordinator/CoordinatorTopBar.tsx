import React, { useState } from 'react';
import { UserProfile, ClinicBranch } from '../../types';
import { UserCheck, Bell, RefreshCw, ChevronDown, CheckCircle, MapPin, Search } from 'lucide-react';

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
  onStatusChange
}) => {
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusColors = {
    'Available': 'bg-emerald-500 text-white',
    'In Consultation': 'bg-[#4F8EF7] text-white',
    'In Procedure': 'bg-purple-600 text-white',
    'On Break': 'bg-amber-500 text-white',
    'Off Duty': 'bg-slate-400 text-white'
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
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl">Reveal Clinic</span>
        </div>

        {/* Right: Quick Search, Duty Status, Notifications */}
        <div className="flex items-center gap-2">
          {/* Quick Search trigger */}
          {onQuickSearchClick && (
            <button
              onClick={onQuickSearchClick}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Search Patient or Appointment"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Quick Find</span>
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
              <span>{currentStatus === 'Available' ? 'On Duty' : currentStatus}</span>
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
                    <span>{status === 'Available' ? 'On Duty' : status}</span>
                    {currentStatus === status && <CheckCircle className="w-3.5 h-3.5 text-[#4F8EF7]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-2xl hover:bg-slate-100 text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
