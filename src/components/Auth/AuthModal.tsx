import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { mockStaffProfiles, HARDCODED_AVATARS, clinicBranches } from '../../data/mockData';
import { X, Lock, Phone, ShieldCheck, Sparkles, RefreshCw, Stethoscope, HeartPulse, UserCheck, Key, CheckCircle2, Camera, AlertTriangle, MapPin, User, Mail, Plus, Trash2 } from 'lucide-react';

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
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot' | 'reset_success'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [loginMethod, setLoginMethod] = useState<'id' | 'phone'>('id');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [idNumber, setIdNumber] = useState('RC-99841');
  const [password, setPassword] = useState('RC-99841');
  const [rememberMe, setRememberMe] = useState(true);
  const [showDestinationChoice, setShowDestinationChoice] = useState(false);

  // Expanded Patient Signup fields
  const [fullName, setFullName] = useState('Sophia Martinez');
  const [email, setEmail] = useState('sophia.martinez@example.com');
  const [gender, setGender] = useState<UserProfile['gender']>('female');
  const [dob, setDob] = useState('1992-06-14');
  const [nationality, setNationality] = useState('Saudi Arabian');
  const [address, setAddress] = useState('King Fahd Road, Olaya District, Riyadh 12211, Saudi Arabia');
  const [secondaryContact, setSecondaryContact] = useState('+966 55 987 6543 (Husband - David)');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [preferredClinicId, setPreferredClinicId] = useState('clinic_downtown');
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
      setPhone('+1 (555) 890-1234');
      setIdNumber('DOC-8820');
      setFullName('Dr. Sarah Chen');
      setEmail('dr.sarah.chen@revealclinic.com');
    } else if (role === 'nurse') {
      setPhone('+1 (555) 776-5432');
      setIdNumber('NUR-4109');
      setFullName('Emma Vance, BSN, RN');
      setEmail('emma.vance@revealclinic.com');
    } else if (role === 'coordinator') {
      setPhone('+1 (555) 443-2100');
      setIdNumber('COORD-102');
      setFullName('Alex Rivera');
      setEmail('alex.rivera@revealclinic.com');
    } else {
      setPhone('+1 (555) 234-5678');
      setIdNumber('RC-99841');
      setFullName('Sophia Martinez');
      setEmail('sophia.martinez@example.com');
    }
  };

  const handleProceedWithRole = (role: UserRole) => {
    setLoading(true);
    setShowDestinationChoice(false);
    setTimeout(() => {
      setLoading(false);
      let targetUser: UserProfile;

      if (role === 'patient') {
        const isExistingPatient = user && user.role === 'patient';
        targetUser = {
          ...(isExistingPatient ? user : {} as UserProfile),
          role: 'patient',
          fullName: isExistingPatient ? (user.fullName || fullName) : (fullName || 'Sophia Martinez'),
          email: isExistingPatient ? (user.email || email) : (email || 'sophia.martinez@example.com'),
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

      setSuccessToast(`Welcome back, ${targetUser.fullName}! Logging into ${role.toUpperCase()} Portal...`);
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
      setErrorMsg('Please enter your secure password.');
      return;
    }

    if (loginMethod === 'phone') {
      const digits = phone.replace(/\D/g, ''); // Extract all digits (e.g., 966501234567)
      if (digits.length < 7) {
        setErrorMsg('Please enter a valid Saudi mobile phone number.');
        return;
      }

      // Check for Doctor/Patient profile match
      if (digits.includes('1234567') || digits.includes('501234567')) {
        if (enteredPwd === 'RC-99841' || enteredPwd === '••••••••') {
          setShowDestinationChoice(true);
        } else {
          setErrorMsg('Invalid password for this mobile number.');
        }
      } else if (digits.includes('3253') || digits.includes('4803253')) {
        // Coordinator
        if (enteredPwd === 'COORD-102' || enteredPwd === '••••••••') {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            const targetUser = { ...mockStaffProfiles.coordinator };
            setSuccessToast(`Welcome back, ${targetUser.fullName}! Logging into COORDINATOR Portal...`);
            setTimeout(() => {
              handleSuccessCallback(targetUser);
              onClose();
            }, 600);
          }, 700);
        } else {
          setErrorMsg('Invalid password for this mobile number.');
        }
      } else {
        // Fallback or automatic registration mockup for user convenience so testing doesn't block:
        // Assume any other valid mobile number with password RC-99841 is the doctor/patient
        if (enteredPwd === 'RC-99841' || enteredPwd === '••••••••') {
          setShowDestinationChoice(true);
        } else if (enteredPwd === 'COORD-102') {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            const targetUser = { ...mockStaffProfiles.coordinator };
            setSuccessToast(`Welcome back, ${targetUser.fullName}! Logging into COORDINATOR Portal...`);
            setTimeout(() => {
              handleSuccessCallback(targetUser);
              onClose();
            }, 600);
          }, 700);
        } else {
          setErrorMsg('Mobile number not found. Register a new account below or try matching a clinic number.');
        }
      }
    } else {
      // Login via ID Number
      const enteredId = idNumber.trim();
      if (!enteredId) {
        setErrorMsg('Please enter your Portal Access ID.');
        return;
      }

      if (enteredId === 'COORD-102' && (enteredPwd === 'COORD-102' || enteredPwd === '••••••••')) {
        // Coordinator Login
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          const targetUser = { ...mockStaffProfiles.coordinator };
          setSuccessToast(`Welcome back, ${targetUser.fullName}! Logging into COORDINATOR Portal...`);
          setTimeout(() => {
            handleSuccessCallback(targetUser);
            onClose();
          }, 600);
        }, 700);
      } else if (enteredId === 'RC-99841' && (enteredPwd === 'RC-99841' || enteredPwd === '••••••••')) {
        // Both Doctor and Patient! Show portal selection overlay inside login screen.
        setShowDestinationChoice(true);
      } else {
        setErrorMsg('Invalid ID or Password. Check your clinical portal details or register.');
      }
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMsg('You must accept the HIPAA & Safety Terms of Service.');
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

      handleSuccessCallback(newUser);
      onClose();
    }, 800);
  };

  const cardContent = (
    <div className={`bg-white w-full overflow-hidden relative flex flex-col text-slate-800 animate-fade-in ${
      isScreen
        ? 'h-full border-0 shadow-none'
        : 'h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-none sm:shadow-2xl sm:max-w-md border-0 sm:border border-slate-100 my-auto'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-5 flex items-center justify-between relative shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <Sparkles className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h3 className="font-black text-base tracking-wider text-white">REVEAL CLINIC</h3>
            <p className="text-[11px] text-sky-200 font-medium">
              {mode === 'login' && 'Healthcare Portal Authentication'}
              {mode === 'signup' && 'Staff & Patient Registration'}
              {mode === 'otp' && 'Verify Mobile OTP Code'}
              {mode === 'forgot' && 'Reset Secure Password'}
              {mode === 'reset_success' && 'Password Changed Successfully'}
            </p>
          </div>
        </div>
        {!isScreen && (
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

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
            showDestinationChoice ? (
              <div className="space-y-4 py-2 animate-fade-in">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-1">
                    Multi-Role Verification Required
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    This account is associated with both clinical and patient portal accounts. Please select your destination:
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Doctor Card Option */}
                  <button
                    type="button"
                    onClick={() => handleProceedWithRole('doctor')}
                    className="w-full p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100/80 text-left transition-all hover:scale-[1.01] hover:shadow-xs group flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[10px] text-blue-900 uppercase tracking-wide">Doctor Portal</span>
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">Authorized</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs mt-0.5">Dr. Sarah Chen</h5>
                      <p className="text-[10px] text-slate-500 mt-1">Access clinical charts, schedule slots, and patient histories.</p>
                    </div>
                  </button>

                  {/* Patient Card Option */}
                  <button
                    type="button"
                    onClick={() => handleProceedWithRole('patient')}
                    className="w-full p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/80 text-left transition-all hover:scale-[1.01] hover:shadow-xs group flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[10px] text-emerald-900 uppercase tracking-wide">Patient Portal</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">Authorized</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs mt-0.5">Sophia Martinez</h5>
                      <p className="text-[10px] text-slate-500 mt-1">View personal medical reports, loyalty balance, and books.</p>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDestinationChoice(false)}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-2"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                {/* Unified Portal Access Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-black text-slate-600 mb-2">
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
                    <span>Mobile Number</span>
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
                    <span>ID Number</span>
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Saudi Mobile Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 select-none shrink-0">
                        <span>🇸🇦</span>
                        <span>+966</span>
                      </div>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="tel"
                          value={phone.startsWith('+966') ? phone.replace('+966', '').trim() : phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // keep only digits
                            setPhone(`+966 ${val}`);
                          }}
                          placeholder="50 123 4567"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Portal Access ID Number
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g. RC-99841 or COORD-102"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secure Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Keep session active */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Keep session active</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="auth-login-submit-btn"
                  disabled={loading}
                  className="w-full bg-[#4F8EF7] hover:bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Secure Log In'}
                </button>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Need a new account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setMode('signup');
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </div>
              </form>
            )
          )}

          {/* EXPANDED PATIENT REGISTRATION SIGNUP MODE */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* 1. PROFILE PICTURE / AVATAR SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-blue-600" /> Select Profile Picture / Avatar
                </label>
                
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                  <img
                    src={avatarUrl}
                    alt="Selected avatar"
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-xs shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">Choose Preset Avatar:</p>
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
                    {showCustomAvatarInput ? 'Hide Image URL' : 'Upload or Custom Image URL'}
                  </button>
                </div>

                {showCustomAvatarInput && (
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                )}
              </div>

              {/* 2. CONTACT INFORMATION */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact & Personal Details</h4>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, Villa / Apt No, City"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Secondary Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={secondaryContact}
                    onChange={(e) => setSecondaryContact(e.target.value)}
                    placeholder="e.g. +1 (555) 987-6543 (Spouse - David)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                </div>
              </div>

              {/* 3. DEMOGRAPHICS & CLINIC */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-1.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
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

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. American, Emirati"
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Preferred Clinic Location</label>
                  <select
                    value={preferredClinicId}
                    onChange={(e) => setPreferredClinicId(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  >
                    {clinicBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. MEDICAL INFORMATION */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Skin Allergies & Sensitivity
                </label>
                
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
                    placeholder="Add allergy e.g. Benzoyl Peroxide..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-slate-900 transition"
                  >
                    Add
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Medical Notes (Optional)
                  </label>
                  <textarea
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    rows={2}
                    placeholder="Record skin sensitivity, past treatments, or medical remarks..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  />
                </div>
              </div>

              {/* 5. PASSWORD & TERMS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Set Account Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    id="auth-signup-terms-checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    I accept{' '}
                    <button
                      type="button"
                      id="auth-open-terms-modal-btn"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 font-bold underline hover:text-blue-800 transition"
                    >
                      HIPAA & Clinical Safety guidelines and Terms of Service
                    </button>
                    .
                  </span>
                </div>
              </div>

              <button
                type="submit"
                id="auth-signup-submit-btn"
                disabled={loading}
                className="w-full bg-[#4F8EF7] hover:bg-blue-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Register Patient Profile & Send OTP Code'}
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Log In
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
                <h4 className="font-bold text-slate-900 text-sm">Enter Verification Code</h4>
                <p className="text-xs text-slate-500 mt-1">
                  A 6-digit OTP code has been sent to <strong>{phone}</strong>
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
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Code & Access Portal'}
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your mobile number or registered email to receive a secure password reset code.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile or Email</label>
                <input
                  type="text"
                  defaultValue={phone}
                  placeholder="+1 (555) 000-0000 or email@domain.com"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccessToast("Reset password code dispatched via SMS!");
                  setMode('reset_success');
                }}
                className="w-full bg-[#4F8EF7] hover:bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md transition"
              >
                Send Password Reset Code
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Back to Login
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
                <h4 className="text-sm font-bold text-slate-900">Reset Code Dispatched</h4>
                <p className="text-xs text-slate-500 mt-1">Check your mobile device for password reset instructions.</p>
              </div>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-2xl text-xs"
              >
                Return to Login
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
                  <h3 className="text-sm font-bold text-slate-900">HIPAA & Clinical Terms of Service</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Reveal Medical & Aesthetic Center Guidelines</p>
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
                  <strong>Notice to New Patients:</strong> By creating a Reveal Clinic patient profile, you agree to comply with HIPAA privacy standards, clinical procedure disclosures, and cancellation policies.
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  1. HIPAA Compliance & Protected Health Information (PHI)
                </h4>
                <p className="text-[11px] text-slate-600">
                  Reveal Clinic strictly safeguards your Protected Health Information under HIPAA. All medical records, diagnostic photos, skin allergy logs, and treatment histories are stored with end-to-end encryption.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  2. Clinical Safety & Medical Disclosure
                </h4>
                <p className="text-[11px] text-slate-600">
                  Patients must disclose complete information regarding skin allergies, active medications, and prior cosmetic procedures prior to any aesthetic treatment or laser therapy.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  3. Treatment Consent & Patch Testing
                </h4>
                <p className="text-[11px] text-slate-600">
                  Aesthetic procedures carry temporary side effects like mild redness or swelling. You consent to necessary patch testing and agree to follow post-care guidance from attending dermatologists.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  4. Appointment Cancellation Policy
                </h4>
                <p className="text-[11px] text-slate-600">
                  Cancellations or rescheduling must be submitted at least 24 hours prior to your time slot via the portal or reception desk.
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
                Decline
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
                I Accept Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
