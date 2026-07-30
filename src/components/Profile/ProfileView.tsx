import React, { useState } from 'react';
import { UserProfile, ClinicBranch, PaymentRecord } from '../../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Share2,
  Gift,
  Lock,
  Globe,
  Settings,
  Camera,
  Save,
  Check,
  AlertTriangle,
  FileText,
  HeartPulse,
  CreditCard,
  ChevronRight
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  branches: ClinicBranch[];
  payments: PaymentRecord[];
  onSaveProfile: (updated: UserProfile) => void;
  onOpenLoyalty: () => void;
  onOpenReferral: () => void;
  onOpenGiftCards: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  branches,
  payments,
  onSaveProfile,
  onOpenLoyalty,
  onOpenReferral,
  onOpenGiftCards,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [language, setLanguage] = useState<'English' | 'Arabic'>('English');
  const [newAllergy, setNewAllergy] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [subView, setSubView] = useState<'main' | 'payment-history'>('main');

  if (subView === 'payment-history') {
    return (
      <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <button
            type="button"
            id="payment-history-back-btn"
            onClick={() => setSubView('main')}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition font-bold text-xs flex items-center gap-1"
          >
            ← Back to Profile
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Payment History</h1>
            <p className="text-xs text-slate-500">All past clinic invoices and payment records</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-xs">Transaction Records</span>
            <span className="text-xs font-semibold text-slate-500">{payments.length} Transactions</span>
          </div>

          {payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs hover:border-blue-300 transition">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.date} • <span className="font-medium text-slate-700">{p.paymentMethod}</span></div>
                    <div className="text-[10px] text-slate-400 font-mono">Receipt No: {p.receiptNumber}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-extrabold text-blue-600 text-sm">SAR {p.amount}</div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
              No past payment records found.
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setFormData(prev => ({
      ...prev,
      skinAllergies: [...prev.skinAllergies, newAllergy.trim()]
    }));
    setNewAllergy('');
  };

  const handleRemoveAllergy = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      skinAllergies: prev.skinAllergies.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
      {/* Profile Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <img
              src={formData.avatarUrl}
              alt={formData.fullName}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-500/30 shadow-lg"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  const newPic = prompt("Enter Image URL for Patient Photo:", formData.avatarUrl);
                  if (newPic) setFormData({ ...formData, avatarUrl: newPic });
                }}
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-md"
                title="Change Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">{formData.fullName}</h1>
              <span className="bg-sky-400/20 text-sky-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-sky-400/30">
                Verified Patient
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Patient File ID: <strong>{formData.patientId}</strong>
            </p>
            <p className="text-[11px] text-slate-400">Account Active since {formData.accountCreated}</p>
          </div>

          <button
            id="profile-toggle-edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-2xl text-xs backdrop-blur-md transition border border-white/20"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Patient profile details saved successfully!</span>
        </div>
      )}

      {/* QUICK TILES: REWARDS & REFERRALS */}
      <div className="grid grid-cols-3 gap-3">
        <button
          id="profile-loyalty-tile-btn"
          onClick={onOpenLoyalty}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md text-left transition"
        >
          <Award className="w-5 h-5 text-amber-500 mb-1" />
          <div className="font-extrabold text-slate-900 text-xs">Rewards Catalog</div>
          <div className="text-[10px] text-slate-500">View Special Offers</div>
        </button>

        <button
          id="profile-referral-tile-btn"
          onClick={onOpenReferral}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md text-left transition"
        >
          <Share2 className="w-5 h-5 text-emerald-500 mb-1" />
          <div className="font-extrabold text-slate-900 text-xs">Invite Friends</div>
          <div className="text-[10px] text-slate-500">Code: {formData.referralCode}</div>
        </button>

        <button
          id="profile-giftcards-tile-btn"
          onClick={onOpenGiftCards}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md text-left transition"
        >
          <Gift className="w-5 h-5 text-rose-500 mb-1" />
          <div className="font-extrabold text-slate-900 text-xs">Gift Cards</div>
          <div className="text-[10px] text-slate-500">Send & Redeem</div>
        </button>
      </div>

      {/* EDIT / VIEW FORM */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Personal Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              disabled={!isEditing}
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Blood Group</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Secondary Contact</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.secondaryContact}
              onChange={(e) => setFormData({ ...formData, secondaryContact: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Residential Address</label>
          <input
            type="text"
            disabled={!isEditing}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
          />
        </div>

        {/* Skin Allergies & Sensitivity Notes */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Known Skin Allergies & Sensitivities
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.skinAllergies.map((allergy, idx) => (
              <span
                key={idx}
                className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
              >
                {allergy}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(idx)}
                    className="text-amber-700 hover:text-rose-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add skin allergy..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Medical Notes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Patient Medical Notes</label>
          <textarea
            disabled={!isEditing}
            value={formData.medicalNotes}
            onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
            rows={2}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
          />
        </div>

        {/* Account Information */}
        <div className="pt-3 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-xs mb-2">Account Information</h3>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Patient ID Number (Read Only)</label>
            <input
              type="text"
              disabled
              readOnly
              value={formData.patientId || 'RC-99841'}
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700 cursor-not-allowed select-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">Automatically assigned once the user is created in the system.</p>
          </div>
        </div>

        {isEditing && (
          <button
            type="submit"
            id="profile-save-btn"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Patient Profile Changes
          </button>
        )}
      </form>

      {/* SETTINGS SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Application Preferences</h2>

        <div className="space-y-3 text-xs">
          {/* Language Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 p-1.5 rounded-xl font-bold text-slate-700 outline-hidden"
            >
              <option value="English">English</option>
              <option value="Arabic">العربية (Arabic)</option>
            </select>
          </div>

          {/* Password Change */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Security & Password</span>
            </div>
            <button
              type="button"
              onClick={() => alert("Password reset link sent to registered email!")}
              className="text-blue-600 hover:underline font-bold"
            >
              Change Password
            </button>
          </div>

          {/* Privacy & Terms */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Privacy & Terms Policy</span>
            </div>
            <button
              type="button"
              onClick={() => alert("Reveal Clinic adheres strictly to HIPAA & GDPR medical privacy regulations.")}
              className="text-blue-600 hover:underline font-bold"
            >
              View Document
            </button>
          </div>

          {/* Payment History Menu Item */}
          <button
            type="button"
            id="profile-payment-history-btn"
            onClick={() => setSubView('payment-history')}
            className="w-full flex items-center justify-between pt-3 border-t border-slate-100 text-left hover:bg-slate-50 p-2 rounded-xl transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Payment History</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <span>{payments.length} Records</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <button
          type="button"
          id="profile-logout-btn"
          onClick={onLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-2xl text-xs transition border border-rose-200 mt-2"
        >
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};
