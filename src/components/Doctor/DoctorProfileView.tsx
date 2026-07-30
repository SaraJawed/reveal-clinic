import React, { useState } from 'react';
import { UserProfile, ClinicBranch } from '../../types';
import {
  User,
  ShieldCheck,
  Lock,
  Globe,
  Smartphone,
  LogOut,
  X,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Trash2,
  Building2,
  Stethoscope,
  Star
} from 'lucide-react';

interface DoctorProfileViewProps {
  user: UserProfile;
  branches: ClinicBranch[];
  selectedBranch: ClinicBranch;
  onChangeBranch: (branch: ClinicBranch) => void;
  onLogout: () => void;
}

export const DoctorProfileView: React.FC<DoctorProfileViewProps> = ({
  user,
  branches,
  selectedBranch,
  onChangeBranch,
  onLogout
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Arabic' | 'Spanish'>('English');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  // Mock Active Sessions
  const [activeSessionsList, setActiveSessionsList] = useState([
    { id: 'sess-1', device: 'Clinic iPad Pro (Suite 3)', ip: '192.168.1.104', lastActive: 'Current Active Device', isCurrent: true },
    { id: 'sess-2', device: 'iPhone 15 Pro Max', ip: '10.0.0.42', lastActive: '2 hours ago', isCurrent: false },
    { id: 'sess-3', device: 'MacBook Pro 16" (Dermatology Desk)', ip: '192.168.1.50', lastActive: 'Yesterday', isCurrent: false }
  ]);

  const handleTerminateSession = (id: string) => {
    setActiveSessionsList((prev) => prev.filter((s) => s.id !== id));
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setPasswordSuccessMsg('Password updated successfully!');
    setTimeout(() => {
      setPasswordSuccessMsg('');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header Profile Hero Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-50 shadow-sm shrink-0"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-black text-slate-900 text-xl">{user.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F8EF7] text-xs font-extrabold uppercase border border-blue-100">
                {user.role?.toUpperCase() || 'PHYSICIAN'}
              </span>
              {typeof user.rating === 'number' && (
                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {user.rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> ({user.reviewCount ?? 0} Reviews)
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {user.specialty || 'Aesthetic Dermatologist'} • License #{user.licenseNumber || 'MED-DERM-99420'}
            </p>
            <p className="text-xs text-slate-400">
              Staff ID: <strong className="text-slate-700">{user.staffId || 'REV-STAFF-101'}</strong> • Registered: {selectedBranch.name}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch & Practice Settings */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#4F8EF7]" />
            <span>Clinic Branch Assignment</span>
          </h3>

          <p className="text-xs text-slate-500">
            Select your active consulting clinic branch for room & appointment dispatching:
          </p>

          <div className="space-y-2 pt-1">
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onChangeBranch(b)}
                className={`w-full p-3 rounded-2xl border text-xs font-bold text-left flex items-center justify-between transition ${
                  selectedBranch.id === b.id
                    ? 'bg-blue-50/80 border-[#4F8EF7] text-[#4F8EF7]'
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{b.name}</span>
                {selectedBranch.id === b.id && <CheckCircle2 className="w-4 h-4 text-[#4F8EF7]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#4F8EF7]" />
            <span>Clinical Interface Language</span>
          </h3>

          <p className="text-xs text-slate-500">
            Select preferred language for medical terminology & clinical interface:
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {(['English', 'Arabic', 'Spanish'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`py-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedLanguage === lang
                    ? 'bg-[#4F8EF7] text-white border-[#4F8EF7] shadow-xs'
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{lang}</span>
                {selectedLanguage === lang && <span className="text-[9px] opacity-80 uppercase font-extrabold">Active</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Security & Password */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#4F8EF7]" />
            <span>Account Security</span>
          </h3>

          <p className="text-xs text-slate-500">
            Manage password, two-factor authentication, and HIPAA/GDPR clinical compliance credentials.
          </p>

          <button
            type="button"
            id="profile-change-pass-btn"
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <KeyRound className="w-4 h-4 text-sky-300" />
            <span>Change Security Password</span>
          </button>
        </div>

        {/* Active Logged-in Sessions */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#4F8EF7]" />
            <span>Active Logged-in Sessions</span>
          </h3>

          <div className="space-y-2">
            {activeSessionsList.map((sess) => (
              <div key={sess.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{sess.device}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{sess.ip} • {sess.lastActive}</span>
                </div>
                {!sess.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleTerminateSession(sess.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Revoke session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {sess.isCurrent && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Action Card */}
      <div className="pt-4">
        <button
          type="button"
          id="profile-logout-btn"
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-3xl text-xs transition border border-rose-200 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Sign Out of Staff Portal</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Change Staff Account Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {passwordSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold rounded-2xl text-center">
                {passwordSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Current Password:</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">New Password:</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Confirm New Password:</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4F8EF7] text-white rounded-xl font-bold text-xs"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-base text-slate-900">Sign Out Confirmation</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to log out of the Reveal Clinic staff portal?
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs transition"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
