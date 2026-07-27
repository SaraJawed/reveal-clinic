import React from 'react';
import { Home, Calendar, Sparkles, QrCode, FileText, Bot, User, Award, Gift, Share2, LogOut, ShieldCheck } from 'lucide-react';
import { TabType, UserProfile } from '../../types';

interface DesktopSidebarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  user: UserProfile;
  onOpenLoyalty: () => void;
  onOpenReferral: () => void;
  onOpenGiftCards: () => void;
  onLogout: () => void;
  upcomingCount: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onChangeTab,
  user,
  onOpenLoyalty,
  onOpenReferral,
  onOpenGiftCards,
  onLogout,
  upcomingCount
}) => {
  const mainNavs: Array<{ id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: upcomingCount },
    { id: 'services', label: 'Treatments', icon: Sparkles },
    { id: 'checkin', label: 'Digital Check-In', icon: QrCode },
    { id: 'reports', label: 'Medical Reports', icon: FileText },
    { id: 'profile', label: 'Profile & Settings', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] bg-white border-r border-slate-100 p-6 sticky top-0 h-screen overflow-y-auto shrink-0 justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#4F8EF7] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-100">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight text-slate-800 block">
              Reveal Clinic
            </span>
            <span className="text-[11px] font-medium tracking-wide text-slate-400">
              Aesthetic Portal
            </span>
          </div>
        </div>



        {/* Navigation Links */}
        <div className="space-y-1.5">
          <p className="px-3 text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Navigation</p>
          {mainNavs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}-btn`}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[#4F8EF7]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#4F8EF7] text-white' : 'bg-blue-100 text-[#4F8EF7]'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Extras / Loyalty */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Rewards</p>
          <button
            id="desktop-loyalty-btn"
            onClick={onOpenLoyalty}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs text-slate-500 hover:bg-amber-50 hover:text-amber-800 transition-colors font-medium"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Redeem Rewards</span>
          </button>
          <button
            id="desktop-referral-btn"
            onClick={onOpenReferral}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs text-slate-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors font-medium"
          >
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>Invite Friends (SAR 200)</span>
          </button>
          <button
            id="desktop-giftcards-btn"
            onClick={onOpenGiftCards}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-800 transition-colors font-medium"
          >
            <Gift className="w-4 h-4 text-rose-500" />
            <span>Gift Cards</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-auto pt-4">
        <button
          id="desktop-logout-btn"
          onClick={onLogout}
          className="w-full py-3 px-4 text-slate-600 font-medium flex items-center gap-3 hover:bg-slate-50 rounded-2xl transition-colors text-xs"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

