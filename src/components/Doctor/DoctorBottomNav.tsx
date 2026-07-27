import React from 'react';
import { StaffTabType } from '../../types';
import { LayoutDashboard, Calendar, Users, Activity, Bell, User } from 'lucide-react';

interface DoctorBottomNavProps {
  activeTab: StaffTabType;
  onChangeTab: (tab: StaffTabType) => void;
  unreadNotificationsCount?: number;
}

export const DoctorBottomNav: React.FC<DoctorBottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadNotificationsCount = 0
}) => {
  const navItems: Array<{ id: StaffTabType; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-1.5 py-1.5 shadow-lg md:hidden">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`doctor-bottom-nav-${item.id}-btn`}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 min-w-[42px] rounded-2xl transition-all ${
                isActive
                  ? 'text-[#4F8EF7] font-bold scale-105'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
                {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-[#4F8EF7]' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#4F8EF7]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
