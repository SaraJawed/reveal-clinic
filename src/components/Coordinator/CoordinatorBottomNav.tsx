import React from 'react';
import { CoordinatorTabType } from '../../types';
import { LayoutDashboard, Calendar, QrCode, Search, Bell, User } from 'lucide-react';

interface CoordinatorBottomNavProps {
  activeTab: CoordinatorTabType;
  onChangeTab: (tab: CoordinatorTabType) => void;
  unreadNotificationsCount?: number;
}

export const CoordinatorBottomNav: React.FC<CoordinatorBottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadNotificationsCount = 0
}) => {
  const navItems: Array<{ id: CoordinatorTabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appts', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Search },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-40 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id as CoordinatorTabType)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-[#4F8EF7]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 bg-[#4F8EF7] rounded-full shadow-xs" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-0.5 font-bold ${isActive ? 'text-[#4F8EF7]' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
