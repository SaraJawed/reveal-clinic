import React from 'react';
import { StaffTabType, UserProfile } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Activity,
  Bell,
  User,
  Sparkles,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Building2,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface DoctorDesktopSidebarProps {
  activeTab: StaffTabType;
  onChangeTab: (tab: StaffTabType) => void;
  user: UserProfile;
  unreadNotificationsCount?: number;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const DoctorDesktopSidebar: React.FC<DoctorDesktopSidebarProps> = ({
  activeTab,
  onChangeTab,
  user,
  unreadNotificationsCount = 0,
  onLogout,
  onSwitchRole
}) => {
  const navItems: Array<{ id: StaffTabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule & Calendar', icon: Calendar },
    { id: 'patients', label: 'Patient Medical Records', icon: Users },
    { id: 'sessions', label: 'Treatment Sessions', icon: Activity },
    { id: 'notifications', label: 'Clinical Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Profile & Settings', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 min-h-screen sticky top-0 h-screen p-4 justify-between shrink-0 shadow-2xs">
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-[#4F8EF7] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-wide text-slate-900 leading-tight">
              REVEAL CLINIC
            </h2>
            <p className="text-[10px] font-bold text-[#4F8EF7] uppercase tracking-wider">
              {user.role === 'nurse' ? 'Nurse Practitioner' : user.role === 'coordinator' ? 'Coordinator Suite' : 'Clinical Physician'}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`doctor-sidebar-${item.id}-btn`}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#4F8EF7] text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#4F8EF7]' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <button
          type="button"
          id="doctor-sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
