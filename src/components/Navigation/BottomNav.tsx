import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Sparkles, QrCode, FileText, Bot, User } from 'lucide-react';
import { TabType } from '../../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  upcomingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  upcomingCount = 0
}) => {
  const { t } = useTranslation('navigation');
  const navItems: Array<{ id: TabType; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'home', label: t('bottomNav.home'), icon: Home },
    { id: 'appointments', label: t('bottomNav.book'), icon: Calendar },
    { id: 'services', label: t('bottomNav.services'), icon: Sparkles },
    { id: 'reports', label: t('bottomNav.reports'), icon: FileText },
    { id: 'profile', label: t('bottomNav.profile'), icon: User }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-slate-100 px-2 pt-2 shadow-lg" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}-btn`}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 min-w-[44px] rounded-2xl transition-all ${
                isActive
                  ? 'text-[#4F8EF7] font-bold scale-105'
                  : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
                {item.id === 'appointments' && upcomingCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] bg-[#4F8EF7] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                    {upcomingCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-[#4F8EF7]' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#4F8EF7]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

