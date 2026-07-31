import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserProfile, ClinicBranch, PaymentRecord } from '../../types';
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from '../../i18n/locales';
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
  const { t } = useTranslation('profile');
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
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
            {t('paymentHistory.backButton')}
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">{t('paymentHistory.title')}</h1>
            <p className="text-xs text-slate-500">{t('paymentHistory.subtitle')}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-xs">{t('paymentHistory.transactionRecords')}</span>
            <span className="text-xs font-semibold text-slate-500">{t('paymentHistory.transactionsCount', { count: payments.length })}</span>
          </div>

          {payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs hover:border-blue-300 transition">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.date} • <span className="font-medium text-slate-700">{p.paymentMethod}</span></div>
                    <div className="text-[10px] text-slate-400 font-mono">{t('paymentHistory.receiptNumber', { receiptNumber: p.receiptNumber })}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-extrabold text-blue-600 text-sm">{t('paymentHistory.amount', { amount: p.amount })}</div>
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
              {t('paymentHistory.emptyState')}
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
                  const newPic = prompt(t('banner.changePhotoPrompt'), formData.avatarUrl);
                  if (newPic) setFormData({ ...formData, avatarUrl: newPic });
                }}
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-md"
                title={t('banner.changePhotoTitle')}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">{formData.fullName}</h1>
              <span className="bg-sky-400/20 text-sky-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-sky-400/30">
                {t('banner.verifiedPatient')}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> {t('banner.patientFileId')} <strong>{formData.patientId}</strong>
            </p>
            <p className="text-[11px] text-slate-400">{t('banner.accountActiveSince', { date: formData.accountCreated })}</p>
          </div>

          <button
            id="profile-toggle-edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-2xl text-xs backdrop-blur-md transition border border-white/20"
          >
            {isEditing ? t('banner.cancelEditButton') : t('banner.editButton')}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('savedSuccess')}</span>
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
          <div className="font-extrabold text-slate-900 text-xs">{t('tiles.loyalty.title')}</div>
          <div className="text-[10px] text-slate-500">{t('tiles.loyalty.subtitle')}</div>
        </button>

        <button
          id="profile-referral-tile-btn"
          onClick={onOpenReferral}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md text-left transition"
        >
          <Share2 className="w-5 h-5 text-emerald-500 mb-1" />
          <div className="font-extrabold text-slate-900 text-xs">{t('tiles.referral.title')}</div>
          <div className="text-[10px] text-slate-500">{t('tiles.referral.subtitle', { code: formData.referralCode })}</div>
        </button>

        <button
          id="profile-giftcards-tile-btn"
          onClick={onOpenGiftCards}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md text-left transition"
        >
          <Gift className="w-5 h-5 text-rose-500 mb-1" />
          <div className="font-extrabold text-slate-900 text-xs">{t('tiles.giftCards.title')}</div>
          <div className="text-[10px] text-slate-500">{t('tiles.giftCards.subtitle')}</div>
        </button>
      </div>

      {/* EDIT / VIEW FORM */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">{t('form.personalInformation')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.fullName')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.phoneNumber')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.emailAddress')}</label>
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.dateOfBirth')}</label>
            <input
              type="date"
              disabled={!isEditing}
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.bloodGroup')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.emergencyContact')}</label>
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
          <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.residentialAddress')}</label>
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
            <AlertTriangle className="w-4 h-4 text-amber-500" /> {t('form.allergiesLabel')}
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
                placeholder={t('form.addAllergyPlaceholder')}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs"
              >
                {t('form.addButton')}
              </button>
            </div>
          )}
        </div>

        {/* Medical Notes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.medicalNotes')}</label>
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
          <h3 className="font-bold text-slate-900 text-xs mb-2">{t('form.accountInformation')}</h3>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('form.patientIdLabel')}</label>
            <input
              type="text"
              disabled
              readOnly
              value={formData.patientId || 'RC-99841'}
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700 cursor-not-allowed select-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">{t('form.patientIdNote')}</p>
          </div>
        </div>

        {isEditing && (
          <button
            type="submit"
            id="profile-save-btn"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {t('form.saveButton')}
          </button>
        )}
      </form>

      {/* SETTINGS SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">{t('preferences.title')}</h2>

        <div className="space-y-3 text-xs">
          {/* Language Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">{t('preferences.language')}</span>
            </div>
            <select
              value={locale}
              onChange={(e) => {
                const next = e.target.value as Locale;
                const rest = location.pathname.replace(new RegExp(`^/${locale}`), '');
                navigate(`/${next}${rest}${location.search}`);
              }}
              className="bg-slate-50 border border-slate-200 p-1.5 rounded-xl font-bold text-slate-700 outline-hidden"
            >
              <option value="en">{t('preferences.languageEnglish')}</option>
              <option value="ar">{t('preferences.languageArabic')}</option>
            </select>
          </div>

          {/* Password Change */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">{t('preferences.security')}</span>
            </div>
            <button
              type="button"
              onClick={() => alert(t('preferences.changePasswordAlert'))}
              className="text-blue-600 hover:underline font-bold"
            >
              {t('preferences.changePasswordButton')}
            </button>
          </div>

          {/* Privacy & Terms */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">{t('preferences.privacyTerms')}</span>
            </div>
            <button
              type="button"
              onClick={() => alert(t('preferences.privacyTermsAlert'))}
              className="text-blue-600 hover:underline font-bold"
            >
              {t('preferences.viewDocumentButton')}
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
              <span className="font-semibold text-slate-800">{t('preferences.paymentHistory')}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <span>{t('preferences.recordsCount', { count: payments.length })}</span>
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
          {t('preferences.signOutButton')}
        </button>
      </div>
    </div>
  );
};
