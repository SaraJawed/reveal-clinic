import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { UserProfile, UserRole } from '../../types';
import { mockStaffProfiles, HARDCODED_AVATARS, clinicBranches, initialUserProfile } from '../../data/mockData';
import { registerPatientAccount, findRegisteredPatientAccount } from '../../utils/storage';
import { X, Lock, Phone, ShieldCheck, Sparkles, RefreshCw, HeartPulse, UserCheck, Key, CheckCircle2, Camera, AlertTriangle, MapPin, User, Mail, Plus, Trash2, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onLoginSuccess?: (user: UserProfile) => void;
  onSuccess?: (user: UserProfile) => void;
  isScreen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onSuccess,
  isScreen = false
}) => {
  const { t } = useTranslation('auth');
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot' | 'reset_success'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [loginMethod, setLoginMethod] = useState<'id' | 'phone'>('id');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [idNumber, setIdNumber] = useState('RC-99841');
  const [password, setPassword] = useState('RC-99841');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Expanded Patient Signup fields
  const [fullName, setFullName] = useState('Noura Al-Qahtani');
  const [email, setEmail] = useState('noura.alqahtani@example.com');
  const [gender, setGender] = useState<UserProfile['gender']>('female');
  const [dob, setDob] = useState('1992-06-14');
  const [nationality, setNationality] = useState('Saudi Arabian');
  const [address, setAddress] = useState('King Fahd Road, Olaya District, Riyadh 12211, Saudi Arabia');
  const [secondaryContact, setSecondaryContact] = useState('+966 55 987 6543 (Husband - Faisal)');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [preferredClinicId, setPreferredClinicId] = useState('clinic_downtown');
  const [hearAboutUs, setHearAboutUs] = useState('social_media');
  const [avatarUrl, setAvatarUrl] = useState(HARDCODED_AVATARS[0].url);
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [skinAllergies, setSkinAllergies] = useState<string[]>(['Latex (Mild)', 'Fragrance']);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('Sensitive skin barrier. Prefers morning appointments.');
  const [assignedPatientId] = useState(`RC-PT-${Math.floor(10000 + Math.random() * 90000)}`);

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [marketingPref, setMarketingPref] = useState(true);

  // OTP state
  const [otp, setOtp] = useState(['4', '8', '2', '1', '9', '0']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleAddAllergy = () => {
    if (!newAllergyInput.trim()) return;
    setSkinAllergies([...skinAllergies, newAllergyInput.trim()]);
    setNewAllergyInput('');
  };

  const handleRemoveAllergy = (index: number) => {
    setSkinAllergies(skinAllergies.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const handleSuccessCallback = (loggedInUser: UserProfile) => {
    if (onLoginSuccess) {
      onLoginSuccess(loggedInUser);
    }
    if (onSuccess) {
      onSuccess(loggedInUser);
    }
  };

  // Role switch handler
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'doctor') {
      setPhone('+966 50 890 1234');
      setIdNumber('DOC-8820');
      setFullName('Dr. Fatima Al-Zahrani');
      setEmail('dr.fatima.alzahrani@revealclinic.com');
    } else if (role === 'nurse') {
      setPhone('+966 50 776 5432');
      setIdNumber('NUR-4109');
      setFullName('Amal Al-Harbi, BSN, RN');
      setEmail('amal.alharbi@revealclinic.com');
    } else if (role === 'coordinator') {
      setPhone('+966 50 443 2100');
      setIdNumber('COORD-102');
      setFullName('Yousef Al-Mutairi');
      setEmail('yousef.almutairi@revealclinic.com');
    } else {
      setPhone('+966 50 234 5678');
      setIdNumber('RC-99841');
      setFullName('Noura Al-Qahtani');
      setEmail('noura.alqahtani@example.com');
    }
  };

  const handleProceedWithRole = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let targetUser: UserProfile;

      if (role === 'patient') {
        const isExistingPatient = user && user.role === 'patient';
        targetUser = {
          ...initialUserProfile,
          ...(isExistingPatient ? user : {} as UserProfile),
          role: 'patient',
          fullName: isExistingPatient ? (user.fullName || fullName) : (fullName || 'Noura Al-Qahtani'),
          email: isExistingPatient ? (user.email || email) : (email || 'noura.alqahtani@example.com'),
          phone: phone || (isExistingPatient ? user.phone : '') || '+966 50 123 4567',
          patientId: 'RC-99841',
          avatarUrl: (isExistingPatient && user.avatarUrl) ? user.avatarUrl : (avatarUrl || HARDCODED_AVATARS[0].url),
          gender: (isExistingPatient && user.gender) ? user.gender : gender,
          dateOfBirth: (isExistingPatient && user.dateOfBirth) ? user.dateOfBirth : dob,
          nationality: (isExistingPatient && user.nationality) ? user.nationality : nationality,
          address: (isExistingPatient && user.address) ? user.address : address,
          secondaryContact: (isExistingPatient && user.secondaryContact) ? user.secondaryContact : secondaryContact,
          bloodGroup: (isExistingPatient && user.bloodGroup) ? user.bloodGroup : bloodGroup,
          preferredClinicId: (isExistingPatient && user.preferredClinicId) ? user.preferredClinicId : preferredClinicId,
          skinAllergies: (isExistingPatient && user.skinAllergies) ? user.skinAllergies : skinAllergies,
          medicalNotes: (isExistingPatient && user.medicalNotes) ? user.medicalNotes : medicalNotes
        };
      } else {
        // doctor
        targetUser = { ...mockStaffProfiles.doctor };
      }

      setSuccessToast(t('toasts.welcomeBack', { name: targetUser.fullName, portal: t(`portalNames.${role}`) }));
      setTimeout(() => {
        handleSuccessCallback(targetUser);
        onClose();
      }, 600);
    }, 500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const enteredPwd = password.trim();

    if (!enteredPwd) {
      setErrorMsg(t('errors.enterPassword'));
      return;
    }

    if (loginMethod === 'phone') {
      const digits = phone.replace(/\D/g, ''); // Extract all digits (e.g., 966501234567)
      if (digits.length < 7) {
        setErrorMsg(t('errors.invalidPhone'));
        return;
      }

      // A patient who registered with this mobile number + password takes
      // priority over the hardcoded demo patterns below.
      const registeredProfile = findRegisteredPatientAccount(phone, enteredPwd);
      if (registeredProfile) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setSuccessToast(t('toasts.welcomeBack', { name: registeredProfile.fullName, portal: t('portalNames.patient') }));
          setTimeout(() => {
            handleSuccessCallback(registeredProfile);
            onClose();
          }, 600);
        }, 700);
        return;
      }

      // Check for Doctor profile match
      if (digits.includes('1234567') || digits.includes('501234567')) {
        if (enteredPwd === 'RC-99841' || enteredPwd === '••••••••') {
          handleProceedWithRole('doctor');
        } else {
          setErrorMsg(t('errors.invalidPasswordForMobile'));
        }
      } else if (digits.includes('3253') || digits.includes('4803253')) {
        // Coordinator
        if (enteredPwd === 'COORD-102' || enteredPwd === '••••••••') {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            const targetUser = { ...mockStaffProfiles.coordinator };
            setSuccessToast(t('toasts.welcomeBack', { name: targetUser.fullName, portal: t('portalNames.coordinator') }));
            setTimeout(() => {
              handleSuccessCallback(targetUser);
              onClose();
            }, 600);
          }, 700);
        } else {
          setErrorMsg(t('errors.invalidPasswordForMobile'));
        }
      } else {
        // Fallback or automatic registration mockup for user convenience so testing doesn't block:
        // Assume any other valid mobile number with password RC-99841 is the doctor
        if (enteredPwd === 'RC-99841' || enteredPwd === '••••••••') {
          handleProceedWithRole('doctor');
        } else if (enteredPwd === 'COORD-102') {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            const targetUser = { ...mockStaffProfiles.coordinator };
            setSuccessToast(t('toasts.welcomeBack', { name: targetUser.fullName, portal: t('portalNames.coordinator') }));
            setTimeout(() => {
              handleSuccessCallback(targetUser);
              onClose();
            }, 600);
          }, 700);
        } else {
          setErrorMsg(t('errors.mobileNotFound'));
        }
      }
    } else {
      // Login via ID Number
      const enteredId = idNumber.trim();
      if (!enteredId) {
        setErrorMsg(t('errors.enterPortalId'));
        return;
      }

      if (enteredId === 'COORD-102' && (enteredPwd === 'COORD-102' || enteredPwd === '••••••••')) {
        // Coordinator Login
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          const targetUser = { ...mockStaffProfiles.coordinator };
          setSuccessToast(t('toasts.welcomeBack', { name: targetUser.fullName, portal: t('portalNames.coordinator') }));
          setTimeout(() => {
            handleSuccessCallback(targetUser);
            onClose();
          }, 600);
        }, 700);
      } else if (enteredId === 'RC-99841' && (enteredPwd === 'RC-99841' || enteredPwd === '••••••••')) {
        // Direct Doctor Login
        handleProceedWithRole('doctor');
      } else if (enteredId === 'PA-94100' && (enteredPwd === 'PA-94100' || enteredPwd === '••••••••')) {
        // Direct Patient Login
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          const targetUser: UserProfile = { ...initialUserProfile, role: 'patient' };
          setSuccessToast(t('toasts.welcomeBack', { name: targetUser.fullName, portal: t('portalNames.patient') }));
          setTimeout(() => {
            handleSuccessCallback(targetUser);
            onClose();
          }, 600);
        }, 700);
      } else {
        setErrorMsg(t('errors.invalidIdOrPassword'));
      }
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMsg(t('errors.acceptTerms'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode('otp');
    }, 600);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: UserProfile = selectedRole !== 'patient' && mockStaffProfiles[selectedRole]
        ? { ...mockStaffProfiles[selectedRole] }
        : {
            id: `usr_${Date.now()}`,
            patientId: assignedPatientId,
            role: 'patient',
            fullName,
            email,
            phone,
            gender,
            dateOfBirth: dob,
            nationality,
            preferredClinicId,
            hearAboutUs,
            avatarUrl,
            address,
            secondaryContact,
            bloodGroup,
            skinAllergies,
            medicalNotes,
            loyaltyPoints: 250,
            loyaltyTier: 'Silver',
            referralCode: `${fullName.split(' ')[0].toUpperCase()}-GLOW-25`,
            accountCreated: new Date().toISOString().split('T')[0]
          };

      if (newUser.role === 'patient') {
        registerPatientAccount(phone, password, newUser);
      }

      handleSuccessCallback(newUser);
      onClose();
    }, 800);
  };

  const isLoginHero = mode === 'login' || mode === 'signup';

  const cardContent = (
    <div className={`bg-white w-full overflow-hidden relative flex flex-col text-slate-800 animate-fade-in ${
      isScreen
        ? 'h-full border-0 shadow-none'
        : 'h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-none sm:shadow-2xl sm:max-w-md border-0 sm:border border-slate-100 my-auto'
    }`}>
      {isLoginHero ? (
        /* Wave Hero (Sign In screen) */
        <div
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white px-5 shrink-0 h-48 sm:h-52"
          style={{ paddingTop: isScreen ? 'max(1.25rem, env(safe-area-inset-top))' : '1.25rem' }}
        >
          {/* Ambient decorative glow, echoing the splash screen's brand treatment */}
          <div className="absolute -top-12 -right-8 w-36 h-36 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-4 -left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Topographic swirl texture */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none" fill="none">
            <path d="M-20,40 C60,10 140,90 220,50 C300,10 380,80 440,40" stroke="white" strokeWidth="2" />
            <path d="M-20,85 C60,55 140,135 220,95 C300,55 380,125 440,85" stroke="white" strokeWidth="2" />
            <path d="M-20,130 C60,100 140,180 220,140 C300,100 380,170 440,130" stroke="white" strokeWidth="2" />
            <path d="M-20,175 C60,145 140,225 220,185 C300,145 380,215 440,175" stroke="white" strokeWidth="2" />
            <path d="M-20,220 C60,190 140,270 220,230 C300,190 380,260 440,220" stroke="white" strokeWidth="2" />
          </svg>

          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400/25 to-blue-600/25 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg shadow-blue-950/40">
              <Sparkles className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide text-white leading-tight">{t('brand.name')}</h3>
              <p className="text-[11px] text-sky-200/90 font-medium">
                {mode === 'signup' ? t('brand.subtitle.signup') : t('brand.subtitle.login')}
              </p>
            </div>
          </div>

          {!isScreen && (
            <button
              id="auth-modal-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Wave divider into the white body below */}
          <svg
            className="absolute bottom-0 left-0 w-full h-10 sm:h-12"
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
          >
            <path d="M0,38 C90,8 180,58 260,26 C320,4 360,20 400,14 L400,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      ) : (
        /* Header (all other auth flows) */
        <div
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white px-5 pb-6 flex items-center justify-between shrink-0"
          style={{ paddingTop: isScreen ? 'max(1.5rem, env(safe-area-inset-top))' : '1.25rem' }}
        >
          {/* Ambient decorative glow, echoing the splash screen's brand treatment */}
          <div className="absolute -top-12 -right-8 w-36 h-36 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400/25 to-blue-600/25 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg shadow-blue-950/40">
              <Sparkles className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide text-white leading-tight">{t('brand.name')}</h3>
              <p className="text-[11px] text-sky-200/90 font-medium">
                {mode === 'otp' && t('brand.subtitle.otp')}
                {mode === 'forgot' && t('brand.subtitle.forgot')}
                {mode === 'reset_success' && t('brand.subtitle.resetSuccess')}
              </p>
            </div>
          </div>
          {!isScreen && (
            <button
              id="auth-modal-close-btn"
              onClick={onClose}
              className="relative w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {successToast && (
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-semibold border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight -mt-1">{t('login.title')}</h1>

                {/* Unified Portal Access Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-black text-slate-600">
                  <button
                    type="button"
                    id="auth-method-phone-btn"
                    onClick={() => {
                      setLoginMethod('phone');
                      setErrorMsg('');
                    }}
                    className={`flex-1 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      loginMethod === 'phone' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('login.tabs.mobile')}</span>
                  </button>
                  <button
                    type="button"
                    id="auth-method-id-btn"
                    onClick={() => {
                      setLoginMethod('id');
                      setErrorMsg('');
                    }}
                    className={`flex-1 py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      loginMethod === 'id' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('login.tabs.id')}</span>
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      {t('login.mobileLabel')}
                    </label>
                    <div className="flex items-end gap-2 border-b-2 border-slate-200 focus-within:border-blue-500 transition-colors">
                      <div className="flex items-center gap-1 pb-2 text-sm font-black text-slate-700 select-none shrink-0">
                        <span>🇸🇦</span>
                        <span>+966</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 pb-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="tel"
                          value={phone.startsWith('+966') ? phone.replace('+966', '').trim() : phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // keep only digits
                            setPhone(`+966 ${val}`);
                          }}
                          placeholder={t('login.mobilePlaceholder')}
                          className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      {t('login.idLabel')}
                    </label>
                    <div className="flex items-center gap-2 border-b-2 border-slate-200 focus-within:border-blue-500 transition-colors pb-2">
                      <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder={t('login.idPlaceholder')}
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('login.passwordLabel')}</label>
                  <div className="flex items-center gap-2 border-b-2 border-slate-200 focus-within:border-blue-500 transition-colors pb-2">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-medium outline-hidden"
                    />
                    <button
                      type="button"
                      id="auth-toggle-password-visibility-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 hover:text-slate-600 shrink-0"
                      aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me / Forgot Password */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{t('login.rememberMe')}</span>
                  </label>
                  <button
                    type="button"
                    id="auth-forgot-password-btn"
                    onClick={() => {
                      setErrorMsg('');
                      setMode('forgot');
                    }}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  id="auth-login-submit-btn"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold py-3.5 rounded-full text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition disabled:opacity-70"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>{t('login.submit')}</span>}
                </button>

                <div className="text-center text-xs text-slate-500">
                  {t('login.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setMode('signup');
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {t('login.signUpLink')}
                  </button>
                </div>

                {/* Trust signal */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('login.trustBadge')}</span>
                </div>
              </form>
          )}

          {/* EXPANDED PATIENT REGISTRATION SIGNUP MODE */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="-mt-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('signup.title')}</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t('signup.subtitle')}
                </p>
              </div>

              {/* 1. PROFILE PICTURE / AVATAR SELECTION */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{t('signup.profilePicture.title')}</h4>
                </div>

                <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80">
                  <img
                    src={avatarUrl}
                    alt={t('signup.profilePicture.avatarAlt')}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-xs shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">{t('signup.profilePicture.choosePreset')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {HARDCODED_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(av.url);
                            setShowCustomAvatarInput(false);
                          }}
                          className={`w-7 h-7 rounded-full overflow-hidden transition ring-2 ${
                            avatarUrl === av.url ? 'ring-blue-600 ring-offset-1 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    {showCustomAvatarInput ? t('signup.profilePicture.hideCustomUrl') : t('signup.profilePicture.showCustomUrl')}
                  </button>
                </div>

                {showCustomAvatarInput && (
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder={t('signup.profilePicture.urlPlaceholder')}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                )}
              </div>

              {/* 2. CONTACT INFORMATION */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{t('signup.contact.title')}</h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.contact.fullName')}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.contact.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.contact.phone')}</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.contact.address')}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('signup.contact.addressPlaceholder')}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t('signup.contact.secondaryContact')}
                  </label>
                  <input
                    type="text"
                    value={secondaryContact}
                    onChange={(e) => setSecondaryContact(e.target.value)}
                    placeholder={t('signup.contact.secondaryContactPlaceholder')}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* 3. DEMOGRAPHICS & CLINIC */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{t('signup.demographics.title')}</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.demographics.gender')}</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value="female">{t('signup.demographics.genderOptions.female')}</option>
                      <option value="male">{t('signup.demographics.genderOptions.male')}</option>
                      <option value="other">{t('signup.demographics.genderOptions.other')}</option>
                      <option value="prefer_not_to_say">{t('signup.demographics.genderOptions.preferNotToSay')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.demographics.dob')}</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-1.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.demographics.bloodGroup')}</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.demographics.nationality')}</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder={t('signup.demographics.nationalityPlaceholder')}
                      className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.demographics.preferredClinic')}</label>
                    <select
                      value={preferredClinicId}
                      onChange={(e) => setPreferredClinicId(e.target.value)}
                      className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    >
                      {clinicBranches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('signup.demographics.hearAboutUs')}</label>
                    <select
                      value={hearAboutUs}
                      onChange={(e) => setHearAboutUs(e.target.value)}
                      className="w-full px-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value="social_media">{t('signup.demographics.hearAboutUsOptions.socialMedia')}</option>
                      <option value="google_search">{t('signup.demographics.hearAboutUsOptions.googleSearch')}</option>
                      <option value="friend_family_referral">{t('signup.demographics.hearAboutUsOptions.friendFamilyReferral')}</option>
                      <option value="existing_patient_referral">{t('signup.demographics.hearAboutUsOptions.existingPatientReferral')}</option>
                      <option value="doctor_referral">{t('signup.demographics.hearAboutUsOptions.doctorReferral')}</option>
                      <option value="walked_past_clinic">{t('signup.demographics.hearAboutUsOptions.walkedPastClinic')}</option>
                      <option value="advertisement">{t('signup.demographics.hearAboutUsOptions.advertisement')}</option>
                      <option value="other">{t('signup.demographics.hearAboutUsOptions.other')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. MEDICAL INFORMATION */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{t('signup.medical.title')}</h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skinAllergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(idx)}
                        className="text-amber-700 hover:text-rose-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newAllergyInput}
                    onChange={(e) => setNewAllergyInput(e.target.value)}
                    placeholder={t('signup.medical.addAllergyPlaceholder')}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-slate-900 transition shrink-0"
                  >
                    {t('signup.medical.add')}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t('signup.medical.notesLabel')}
                  </label>
                  <textarea
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    rows={2}
                    placeholder={t('signup.medical.notesPlaceholder')}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* 5. PASSWORD & TERMS */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{t('signup.password.title')}</h4>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('signup.password.placeholder')}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    id="auth-signup-terms-checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    {t('signup.password.acceptPrefix')}{' '}
                    <button
                      type="button"
                      id="auth-open-terms-modal-btn"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 font-bold underline hover:text-blue-800 transition"
                    >
                      {t('signup.password.termsLink')}
                    </button>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                id="auth-signup-submit-btn"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold py-3.5 rounded-full text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition disabled:opacity-70"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t('signup.submit')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-xs text-slate-500">
                {t('signup.alreadyRegistered')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('login');
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  {t('signup.loginLink')}
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFICATION MODE */}
          {mode === 'otp' && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{t('otp.heading')}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  <Trans t={t} i18nKey="otp.sentTo" values={{ phone }} components={{ strong: <strong /> }} />
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-10 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-hidden"
                  />
                ))}
              </div>

              <button
                type="button"
                id="auth-otp-verify-btn"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[#4F8EF7] hover:bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : t('otp.verify')}
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                {t('forgot.instructions')}
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('forgot.label')}</label>
                <input
                  type="text"
                  defaultValue={phone}
                  placeholder={t('forgot.placeholder')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccessToast(t('toasts.resetCodeSent'));
                  setMode('reset_success');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-blue-500/30 transition"
              >
                {t('forgot.submit')}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  {t('forgot.backToLogin')}
                </button>
              </div>
            </div>
          )}

          {/* RESET SUCCESS MODE */}
          {mode === 'reset_success' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t('resetSuccess.title')}</h4>
                <p className="text-xs text-slate-500 mt-1">{t('resetSuccess.message')}</p>
              </div>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-2xl text-xs"
              >
                {t('resetSuccess.returnToLogin')}
              </button>
            </div>
          )}
        </div>
      </div>
  );

  return (
    <>
      {isScreen ? (
        cardContent
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          {cardContent}
        </div>
      )}

      {/* HIPAA & Clinical Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-left">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t('terms.modalTitle')}</h3>
                  <p className="text-[10px] text-slate-500 font-medium">{t('terms.modalSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                id="close-terms-modal-btn"
                onClick={() => setShowTermsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Terms Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed max-h-[58vh]">
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>{t('terms.notice.label')}</strong> {t('terms.notice.text')}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {t('terms.sections.hipaa.heading')}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {t('terms.sections.hipaa.body')}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {t('terms.sections.safety.heading')}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {t('terms.sections.safety.body')}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {t('terms.sections.consent.heading')}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {t('terms.sections.consent.body')}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  {t('terms.sections.cancellation.heading')}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {t('terms.sections.cancellation.body')}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                {t('terms.decline')}
              </button>
              <button
                type="button"
                id="accept-terms-modal-btn"
                onClick={() => {
                  setAcceptTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t('terms.accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
