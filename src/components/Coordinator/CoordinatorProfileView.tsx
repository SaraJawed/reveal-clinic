import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile, ClinicBranch } from '../../types';
import {
  User,
  LogOut,
  Building2,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';

interface CoordinatorProfileViewProps {
  user: UserProfile;
  selectedBranch: ClinicBranch;
  onLogout: () => void;
  onTriggerToast: (msg: string) => void;
}

export const CoordinatorProfileView: React.FC<CoordinatorProfileViewProps> = ({
  user,
  selectedBranch,
  onLogout,
  onTriggerToast
}) => {
  const { t } = useTranslation('coordinator');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#4F8EF7]" />
          {t('profile.header.title')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {t('profile.header.subtitle')}
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#4F8EF7]/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{user.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F8EF7] text-xs font-extrabold border border-blue-100">
                {t('profile.badge')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#4F8EF7]" /> {selectedBranch.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">{t('profile.employeeInfo')}</p>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('profile.contact.email')}</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('profile.contact.phone')}</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full p-4 rounded-3xl bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs transition-all border border-red-100 flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('profile.logout.button')}</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-black text-slate-900 text-base">{t('profile.logoutModal.title')}</h3>
            <p className="text-xs text-slate-500 font-medium">
              {t('profile.logoutModal.confirmText')}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                {t('common:buttons.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md shadow-red-500/20"
              >
                {t('common:buttons.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
