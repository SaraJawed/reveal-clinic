import React from 'react';
import { UserProfile, ClinicBranch, StaffNotification } from '../../types';
import { Stethoscope, Bell, Sparkles, LogOut, RefreshCw, ChevronDown, CheckCircle, X } from 'lucide-react';

interface DoctorTopBarProps {
  user: UserProfile;
  selectedBranch: ClinicBranch;
  onChangeBranch: (branch: ClinicBranch) => void;
  branches: ClinicBranch[];
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onSwitchRole: () => void;
  onStatusChange?: (status: 'Available' | 'In Consultation' | 'In Procedure' | 'On Break' | 'Off Duty') => void;
  notifications?: StaffNotification[];
  onMarkAsRead?: (id: string) => void;
}

export const DoctorTopBar: React.FC<DoctorTopBarProps> = ({
  user,
  selectedBranch,
  onChangeBranch,
  branches,
  unreadNotificationsCount,
  onOpenNotifications,
  onSwitchRole,
  onStatusChange,
  notifications = [],
  onMarkAsRead
}) => {
  const [showBranchDropdown, setShowBranchDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);

  const statusColors = {
    'Available': 'bg-emerald-500 text-white',
    'In Consultation': 'bg-[#4F8EF7] text-white',
    'In Procedure': 'bg-purple-600 text-white',
    'On Break': 'bg-amber-500 text-white',
    'Off Duty': 'bg-slate-400 text-white'
  };

  const roleTitle = user.role === 'nurse' 
    ? 'Aesthetic Nurse Specialist' 
    : user.role === 'coordinator' 
    ? 'Clinic Coordinator' 
    : 'Attending Dermatologist';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Branding & Staff Persona */}
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl">Reveal Clinic</span>
        </div>

        {/* Center: Branch Picker */}
        <div className="relative hidden md:block">
          <button
            type="button"
            id="doctor-branch-selector-btn"
            onClick={() => setShowBranchDropdown(!showBranchDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[160px]">{selectedBranch.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showBranchDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active Branch
              </div>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => {
                    onChangeBranch(branch);
                    setShowBranchDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    selectedBranch.id === branch.id
                      ? 'bg-blue-50 text-[#4F8EF7] font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{branch.name}</span>
                  {selectedBranch.id === branch.id && <CheckCircle className="w-4 h-4 text-[#4F8EF7]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions (Status Toggle, Notifications, Switch Role) */}
        <div className="flex items-center gap-2">
          {/* Status Quick Toggle */}
          <div className="relative">
            <button
              type="button"
              id="doctor-status-toggle-btn"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`px-2.5 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                statusColors[user.availabilityStatus || 'Available']
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="hidden sm:inline">{user.availabilityStatus || 'Available'}</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Set Clinical Status
                </div>
                {(['Available', 'On Break', 'Off Duty'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (onStatusChange) onStatusChange(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                      user.availabilityStatus === status
                        ? 'bg-blue-50 text-[#4F8EF7]'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{status}</span>
                    {user.availabilityStatus === status && <CheckCircle className="w-3.5 h-3.5 text-[#4F8EF7]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              id="doctor-notifications-btn"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="relative w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition"
              title="Notifications"
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
                id="doctor-notifications-panel"
                className="fixed left-4 right-4 top-14 max-w-md mx-auto w-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-fade-in"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Recent Alerts
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
                    <p className="text-center text-slate-400 text-[11px] py-4">No recent notifications</p>
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
                    Open View Center
                  </button>
                  <button 
                    onClick={() => setShowNotificationsDropdown(false)}
                    className="text-slate-500 hover:underline font-semibold"
                  >
                    Dismiss
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
