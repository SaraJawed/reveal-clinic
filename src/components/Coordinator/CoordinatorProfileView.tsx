import React, { useState } from 'react';
import { UserProfile, ClinicBranch } from '../../types';
import {
  User,
  ShieldCheck,
  Lock,
  Globe,
  LogOut,
  Building2,
  Mail,
  Phone,
  Key,
  Wifi,
  CheckCircle2,
  X,
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
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Arabic'>('English');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      onTriggerToast('Passwords do not match.');
      return;
    }
    onTriggerToast('Password updated successfully!');
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLanguageSelect = (lang: 'English' | 'Arabic') => {
    setSelectedLanguage(lang);
    onTriggerToast(`App language set to ${lang}.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#4F8EF7]" />
          Coordinator Account & Preferences
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your reception profile credentials, app language, and security settings.
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
                Front Desk Coordinator
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#4F8EF7]" /> {selectedBranch.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">Employee ID: COORD-8820 • Shift: Morning (08:30 AM - 05:30 PM)</p>
          </div>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone Contact</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences & Security Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Credentials */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4F8EF7]" />
            <h3 className="font-extrabold text-slate-900 text-base">Security & Authentication</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4F8EF7] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-slate-900">Change Password</div>
                  <div className="text-[10px] text-slate-400">Update reception login password</div>
                </div>
              </div>
              <Key className="w-4 h-4 text-slate-400" />
            </button>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">PWA Offline Mode</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Enabled & Cached</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Regional & Language Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Language Preferences</h3>
          </div>

          <div className="space-y-2">
            {(['English', 'Arabic'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={`w-full p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition-all ${
                  selectedLanguage === lang
                    ? 'bg-blue-50 border-[#4F8EF7] text-[#4F8EF7]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{lang}</span>
                {selectedLanguage === lang && <CheckCircle2 className="w-4 h-4 text-[#4F8EF7]" />}
              </button>
            ))}
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
          <span>End Reception Session (Logout)</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#4F8EF7]" />
                <h3 className="font-black text-slate-900 text-base">Change Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#4F8EF7] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-500/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-black text-slate-900 text-base">Confirm Logout</h3>
            <p className="text-xs text-slate-500 font-medium">
              Are you sure you want to end your current receptionist session?
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md shadow-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
