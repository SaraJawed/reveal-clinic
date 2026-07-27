import React from 'react';
import { CoordinatorTabType, UserProfile } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  QrCode,
  Search,
  Bell,
  User,
  LogOut,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface CoordinatorDesktopSidebarProps {
  activeTab: CoordinatorTabType;
  onChangeTab: (tab: CoordinatorTabType) => void;
  user: UserProfile;
  unreadNotificationsCount?: number;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const CoordinatorDesktopSidebar: React.FC<CoordinatorDesktopSidebarProps> = ({
  activeTab,
  onChangeTab,
  user,
  unreadNotificationsCount = 0,
  onLogout,
  onSwitchRole
}) => {
  const mainNavs: Array<{ id: CoordinatorTabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Operational Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointment Management', icon: Calendar },
    { id: 'patients', label: 'Patient Lookup & Payments', icon: Search },
    { id: 'notifications', label: 'Reception Alerts', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Coordinator Profile', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 sticky top-0 h-screen overflow-y-auto shrink-0 shadow-2xs">
      {/* Clinic Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F8EF7] to-blue-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
          R
        </div>
        <div>
          <h2 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
            Reveal Clinic
          </h2>
          <p className="text-[11px] font-bold text-[#4F8EF7] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Reception Portal
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-1.5 flex-1">
        <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          Front Desk Workspace
        </div>

        {mainNavs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id as CoordinatorTabType)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#4F8EF7] to-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && item.badge > 0 ? (
                <span
                  className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    isActive ? 'bg-white text-[#4F8EF7]' : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
