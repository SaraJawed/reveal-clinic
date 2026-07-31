import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Locale, DEFAULT_LOCALE, isSupportedLocale, getLocaleDirection, persistLocale } from './i18n/locales';
import {
  UserProfile,
  ClinicBranch,
  Appointment,
  ActiveUserPackage,
  MedicalReport,
  TreatmentPackage,
  PaymentRecord,
  ChatMessage,
  GiftCard,
  TabType,
  StaffTabType,
  CoordinatorTabType,
  ClinicalScheduleItem,
  ClinicalPatientRecord,
  TreatmentSession,
  StaffNotification,
  ClinicalAppointmentStatus,
  AppointmentStatus,
  WalkInPatient,
  Doctor
} from './types';
import {
  initialUserProfile,
  clinicBranches,
  initialDoctors,
  initialAppointments,
  initialActivePackages,
  initialMedicalReports,
  treatmentServices,
  treatmentPackages,
  initialPayments,
  giftCardsList,
  initialClinicalSchedule,
  initialClinicalPatients,
  initialTreatmentSessions,
  initialStaffNotifications,
  initialWalkInQueue
} from './data/mockData';
import { loadState, saveState } from './utils/storage';

// Navigation Components (Patient)
import { TopBar } from './components/Navigation/TopBar';
import { BottomNav } from './components/Navigation/BottomNav';

// Navigation & Views (Doctor / Nurse / Staff)
import { DoctorTopBar } from './components/Doctor/DoctorTopBar';
import { DoctorBottomNav } from './components/Doctor/DoctorBottomNav';
import { DoctorDashboardView } from './components/Doctor/DoctorDashboardView';
import { DoctorScheduleView } from './components/Doctor/DoctorScheduleView';
import { DoctorPatientsView } from './components/Doctor/DoctorPatientsView';
import { DoctorTreatmentSessionsView } from './components/Doctor/DoctorTreatmentSessionsView';
import { DoctorNotificationsView } from './components/Doctor/DoctorNotificationsView';
import { DoctorProfileView } from './components/Doctor/DoctorProfileView';

// Coordinator Components & Views
import { CoordinatorTopBar } from './components/Coordinator/CoordinatorTopBar';
import { CoordinatorBottomNav } from './components/Coordinator/CoordinatorBottomNav';
import { CoordinatorDashboardView } from './components/Coordinator/CoordinatorDashboardView';
import { CoordinatorAppointmentsView } from './components/Coordinator/CoordinatorAppointmentsView';
import { CoordinatorCheckInView } from './components/Coordinator/CoordinatorCheckInView';
import { CoordinatorPatientLookupView } from './components/Coordinator/CoordinatorPatientLookupView';
import { CoordinatorNotificationsView } from './components/Coordinator/CoordinatorNotificationsView';
import { CoordinatorProfileView } from './components/Coordinator/CoordinatorProfileView';

// PWA & Flow Screens
import { PWAInstallBanner } from './components/PWA/PWAInstallBanner';
import { Snackbar } from './components/PWA/Snackbar';
import { SplashScreen } from './components/Splash/SplashScreen';
import { OnboardingScreen } from './components/Onboarding/OnboardingScreen';
import { AuthModal } from './components/Auth/AuthModal';

// Primary Views (Patient)
import { HomeView } from './components/Home/HomeView';
import { AppointmentsView } from './components/Appointments/AppointmentsView';
import { ServicesView } from './components/Services/ServicesView';
import { DigitalCheckInView } from './components/CheckIn/DigitalCheckInView';
import { MedicalReportsView } from './components/Reports/MedicalReportsView';
import { ProfileView } from './components/Profile/ProfileView';
import { AIChatBot } from './components/Chat/AIChatBot';
import { FloatingChatWidget } from './components/Chat/FloatingChatWidget';

// Modals
import { PaymentModal } from './components/Payments/PaymentModal';
import { LoyaltyRewardsModal } from './components/Loyalty/LoyaltyRewardsModal';
import { ReferralModal } from './components/Referral/ReferralModal';
import { GiftCardModal } from './components/GiftCards/GiftCardModal';

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

// Maps a staff-side clinical status back to the patient-facing status, so a
// Coordinator/Doctor updating their side of a booked appointment (the two are
// linked by sharing the same id) is reflected in the Patient Portal.
function clinicalStatusToAppointmentStatus(status: ClinicalAppointmentStatus): AppointmentStatus {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'in_consultation':
    case 'procedure':
      return 'in_progress';
    case 'scheduled':
    case 'checked_in':
    default:
      return 'upcoming';
  }
}

export function App() {
  // Application Lifecycle States
  const [showSplash, setShowSplash] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => loadState('reveal_onboarded', false));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadState('reveal_authenticated', false));
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ---- Locale, derived from the /:locale route segment (see main.tsx) ----
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const localeBase = `/${locale}`;

  useEffect(() => {
    if (rawLocale !== locale) {
      // Unknown/missing locale segment (e.g. "/", "/fr/services") -- redirect
      // to the same path under a supported locale instead of 404-ing.
      const rest = rawLocale ? location.pathname.replace(new RegExp(`^/${rawLocale}`), '') : location.pathname;
      navigate(`${localeBase}${rest}${location.search}`, { replace: true });
      return;
    }
    i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
    persistLocale(locale);
  }, [locale, rawLocale]);

  // Active Tab for Patient Navigation -- derived from the URL so tabs are
  // real, deep-linkable/bookmarkable routes under /:locale/*.
  const [searchParams, setSearchParams] = useSearchParams();
  const routeTabSegment = location.pathname.slice(localeBase.length).replace(/^\//, '').split('/')[0];
  const PATIENT_TABS: TabType[] = ['appointments', 'services', 'checkin', 'reports', 'chat', 'profile'];
  const patientActiveTab: TabType = (PATIENT_TABS as string[]).includes(routeTabSegment) ? (routeTabSegment as TabType) : 'home';
  const appointmentsSubTab: 'book' | 'history' = searchParams.get('tab') === 'history' ? 'history' : 'book';

  // Switching to the Appointments tab through the normal nav path always
  // lands on "Book New"; only the dedicated "My Visits" links jump straight
  // to the history sub-tab (see handleViewMyVisits below).
  const handleChangeTab = (tab: TabType) => {
    navigate(tab === 'home' ? localeBase : `${localeBase}/${tab}`);
  };

  const handleViewMyVisits = () => {
    navigate(`${localeBase}/appointments?tab=history`);
  };

  const handleChangeAppointmentsSubTab = (tab: 'book' | 'history') => {
    setSearchParams(tab === 'history' ? { tab: 'history' } : {});
  };

  // Active Tab for Doctor / Nurse / Staff Navigation -- derived from the URL
  const STAFF_TABS: StaffTabType[] = ['schedule', 'patients', 'sessions', 'notifications', 'profile'];
  const staffActiveTab: StaffTabType = (STAFF_TABS as string[]).includes(routeTabSegment) ? (routeTabSegment as StaffTabType) : 'dashboard';
  const setStaffActiveTab = (tab: StaffTabType) => navigate(tab === 'dashboard' ? localeBase : `${localeBase}/${tab}`);

  // Active Tab for Coordinator Navigation -- derived from the URL
  const COORDINATOR_TABS: CoordinatorTabType[] = ['appointments', 'checkin', 'patients', 'notifications', 'profile'];
  const coordinatorActiveTab: CoordinatorTabType = (COORDINATOR_TABS as string[]).includes(routeTabSegment) ? (routeTabSegment as CoordinatorTabType) : 'dashboard';
  const setCoordinatorActiveTab = (tab: CoordinatorTabType) => navigate(tab === 'dashboard' ? localeBase : `${localeBase}/${tab}`);

  // Core Data Persistent States
  const [user, setUser] = useState<UserProfile>(() => loadState('reveal_user', { ...initialUserProfile, favoriteDoctors: initialDoctors }));
  const [selectedBranch, setSelectedBranch] = useState<ClinicBranch>(() => loadState('reveal_branch', clinicBranches[0]));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadState('reveal_appointments', initialAppointments));
  const [packages, setPackages] = useState<ActiveUserPackage[]>(() => loadState('reveal_active_packages', initialActivePackages));
  const [reports] = useState<MedicalReport[]>(initialMedicalReports);
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadState('reveal_payments', initialPayments));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadState('reveal_chat', [
    {
      id: 'msg_1',
      sender: 'assistant',
      text: 'Hello Noura! 👋 Welcome to Reveal Medical & Aesthetic Center. I am your AI Clinic Assistant. How can I assist with your skincare routine, doctor consultations, or treatment bookings today?',
      timestamp: '10:00 AM'
    },
    {
      id: 'msg_2',
      sender: 'user',
      text: 'Hi! Can you give me post-care advice for my recent HydraFacial & Glow Peel treatment?',
      timestamp: '10:01 AM'
    },
    {
      id: 'msg_3',
      sender: 'assistant',
      text: 'Certainly, Noura! Here are your personalized post-treatment care guidelines:\n\n✨ 1. Moisture Lock: Use a gentle, hyaluronic acid serum morning and night.\n☀️ 2. Sun Defense: Apply SPF 50+ broad-spectrum sunscreen before stepping outdoors.\n🧴 3. Avoid Exfoliants: Hold off on Retinol or AHA/BHA chemical peels for 5 days.\n💧 4. Stay Hydrated: Drink plenty of water to enhance skin radiance and healing.\n\nWould you like me to book your 2-week skin evaluation appointment with Dr. Fatima Al-Zahrani?',
      timestamp: '10:01 AM'
    },
    {
      id: 'msg_4',
      sender: 'user',
      text: 'Yes please! What times are available tomorrow at the Olaya Clinic in Riyadh?',
      timestamp: '10:02 AM'
    },
    {
      id: 'msg_5',
      sender: 'assistant',
      text: 'Dr. Fatima Al-Zahrani has 3 open consultation slots tomorrow at Reveal Olaya Medical Center (Riyadh):\n\n• 🗓️ 10:00 AM (Morning)\n• 🗓️ 02:30 PM (Afternoon)\n• 🗓️ 04:15 PM (Late Afternoon)\n\nTap "Book Doctor" at the top of this chat or reply with your preferred time to confirm!',
      timestamp: '10:02 AM'
    }
  ]));
  const [giftCards, setGiftCards] = useState<GiftCard[]>(() => loadState('reveal_giftcards', giftCardsList));

  // Staff & Coordinator Clinical Data States
  const [clinicalSchedule, setClinicalSchedule] = useState<ClinicalScheduleItem[]>(() => loadState('reveal_clinical_schedule', initialClinicalSchedule));
  const [clinicalPatients, setClinicalPatients] = useState<ClinicalPatientRecord[]>(() => loadState('reveal_clinical_patients', initialClinicalPatients));
  const [treatmentSessions, setTreatmentSessions] = useState<TreatmentSession[]>(() => loadState('reveal_treatment_sessions', initialTreatmentSessions));
  const [staffNotifications, setStaffNotifications] = useState<StaffNotification[]>(() => loadState('reveal_staff_notifications', initialStaffNotifications));
  const [walkInQueue, setWalkInQueue] = useState<WalkInPatient[]>(() => loadState('reveal_walkin_queue', initialWalkInQueue));

  // Modal & Widget Visibility States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingAppointmentForPay, setPendingAppointmentForPay] = useState<Appointment | null>(null);

  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isGiftCardsOpen, setIsGiftCardsOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Toast / Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Unread Counts
  const upcomingCount = appointments.filter(a => a.status === 'upcoming').length;
  const staffUnreadCount = staffNotifications.filter(n => !n.read).length;

  // Is current user a staff member?
  const isStaffRole = user.role === 'doctor' || user.role === 'nurse' || user.role === 'coordinator';

  // Persist State Changes
  useEffect(() => { saveState('reveal_user', user); }, [user]);
  useEffect(() => { saveState('reveal_branch', selectedBranch); }, [selectedBranch]);
  useEffect(() => { saveState('reveal_appointments', appointments); }, [appointments]);
  useEffect(() => { saveState('reveal_active_packages', packages); }, [packages]);
  useEffect(() => { saveState('reveal_payments', payments); }, [payments]);
  useEffect(() => { saveState('reveal_chat', chatMessages); }, [chatMessages]);
  useEffect(() => { saveState('reveal_giftcards', giftCards); }, [giftCards]);
  useEffect(() => { saveState('reveal_onboarded', hasOnboarded); }, [hasOnboarded]);
  useEffect(() => { saveState('reveal_authenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveState('reveal_clinical_schedule', clinicalSchedule); }, [clinicalSchedule]);
  useEffect(() => { saveState('reveal_clinical_patients', clinicalPatients); }, [clinicalPatients]);
  useEffect(() => { saveState('reveal_treatment_sessions', treatmentSessions); }, [treatmentSessions]);
  useEffect(() => { saveState('reveal_staff_notifications', staffNotifications); }, [staffNotifications]);
  useEffect(() => { saveState('reveal_walkin_queue', walkInQueue); }, [walkInQueue]);

  const triggerToast = (msg: string) => {
    setSnackbarMessage(msg);
  };

  // Coordinator Handlers
  const handleAddWalkIn = (newPatient: Omit<WalkInPatient, 'id' | 'queueNumber'>) => {
    const queueNum = walkInQueue.length + 101;
    const walkIn: WalkInPatient = {
      ...newPatient,
      id: `walkin_${Date.now()}`,
      queueNumber: queueNum
    };
    setWalkInQueue(prev => [walkIn, ...prev]);

    const newNotif: StaffNotification = {
      id: `notif_${Date.now()}`,
      type: 'check_in',
      title: 'Walk-In Patient Registered',
      message: `${walkIn.patientName} registered in queue for ${walkIn.requestedService}.`,
      timestamp: 'Just now',
      read: false,
      urgency: 'high',
      patientName: walkIn.patientName
    };
    setStaffNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddScheduleItem = (item: ClinicalScheduleItem, appointment?: Appointment) => {
    setClinicalSchedule(prev => [item, ...prev]);

    // A Coordinator-created booking is the same single-source-of-truth record
    // as a patient-initiated one -- mirror it into the patient-facing
    // appointments list (same id) so it shows up under "My Visits" too.
    if (appointment) {
      setAppointments(prev => [appointment, ...prev]);
    }
  };

  const handleRescheduleScheduleItem = (
    id: string,
    newDate: string,
    newTimeSlot: string,
    newDoctorId: string,
    newDoctorName: string
  ) => {
    setClinicalSchedule(prev => prev.map(item => item.id === id ? {
      ...item,
      date: newDate,
      timeSlot: newTimeSlot,
      doctorId: newDoctorId,
      doctorName: newDoctorName,
      status: 'scheduled'
    } : item));
    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      date: newDate,
      timeSlot: newTimeSlot,
      doctorId: newDoctorId,
      doctorName: newDoctorName,
      status: 'upcoming'
    } : a));
    triggerToast(t('toasts.scheduleRescheduled', { date: newDate, timeSlot: newTimeSlot, doctorName: newDoctorName }));
  };

  // Patient Handlers
  const handleBookAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);

    // Mirror the booking into the staff-facing schedule under the same id, so
    // Coordinator/Doctor can see and manage it, and a later status change on
    // their side can sync back to this same appointment (see
    // handleUpdateScheduleStatus below).
    const scheduleItem: ClinicalScheduleItem = {
      id: newAppt.id,
      patientId: user.patientId,
      patientName: user.fullName,
      patientAge: calculateAge(user.dateOfBirth),
      patientGender: user.gender,
      patientAvatar: user.avatarUrl,
      doctorId: newAppt.doctorId,
      doctorName: newAppt.doctorName,
      treatmentName: newAppt.treatmentName,
      consultationType: newAppt.consultationType,
      date: newAppt.date,
      timeSlot: newAppt.timeSlot,
      durationMinutes: 30,
      status: 'scheduled',
      roomNumber: 'Unassigned',
      allergyAlerts: user.skinAllergies,
      visitReason: newAppt.treatmentName,
      notes: newAppt.notes,
      paymentStatus: newAppt.paid ? 'Paid' : 'Pending Deposit',
    };
    setClinicalSchedule(prev => [scheduleItem, ...prev]);

    const newNotif: StaffNotification = {
      id: `notif_${Date.now()}`,
      type: 'new_appointment',
      title: 'New Appointment Booked',
      message: `${user.fullName} booked ${newAppt.treatmentName} with ${newAppt.doctorName} on ${newAppt.date} at ${newAppt.timeSlot}.`,
      timestamp: 'Just now',
      read: false,
      patientName: user.fullName,
      patientAvatar: user.avatarUrl,
      appointmentId: newAppt.id
    };
    setStaffNotifications(prev => [newNotif, ...prev]);

    triggerToast(t('toasts.appointmentBooked', { doctorName: newAppt.doctorName }));
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    setClinicalSchedule(prev => prev.map(item => item.id === id ? { ...item, status: 'cancelled' } : item));
    triggerToast(t('toasts.appointmentCancelled'));
  };

  const handleRescheduleAppointment = (id: string, newDate: string, newSlot: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, timeSlot: newSlot } : a));
    setClinicalSchedule(prev => prev.map(item => item.id === id ? { ...item, date: newDate, timeSlot: newSlot } : item));
    triggerToast(t('toasts.appointmentRescheduled', { date: newDate, timeSlot: newSlot }));
  };

  const handleSubmitFeedback = (id: string, rating: number, comment: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, feedbackRating: rating, feedbackComment: comment } : a));
    triggerToast(t('toasts.feedbackThanks'));
  };

  const mapToPaymentRecordMethod = (
    method: NonNullable<Appointment['paymentMethod']>
  ): PaymentRecord['paymentMethod'] => {
    if (method === 'Pay Online') return 'Credit / Debit Card';
    if (method === 'Buy Now Pay Later') return 'Installments (Tabby)';
    return 'Pay at Clinic';
  };

  const handleCompletePackagePurchase = (
    pack: TreatmentPackage,
    doctor: Doctor,
    date: string,
    timeSlot: string,
    paymentMethod: NonNullable<Appointment['paymentMethod']>,
    voucher: { code: string; discount: number } | null
  ) => {
    const finalPrice = Math.max(0, pack.price - (voucher?.discount || 0));
    const purchaseDate = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + pack.validityMonths);

    const newActivePackage: ActiveUserPackage = {
      id: `pkg_${Date.now()}`,
      packageId: pack.id,
      packageName: pack.name,
      totalSessions: pack.totalSessions,
      remainingSessions: pack.totalSessions,
      expiryDate: expiry.toISOString().split('T')[0],
      purchaseDate,
      qrCodeValue: `REVEAL-PKG-${Date.now()}`
    };
    setPackages(prev => [newActivePackage, ...prev]);

    const paid = paymentMethod !== 'Pay at Clinic';
    const firstSessionAppt: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatarUrl,
      clinicId: doctor.clinicId,
      clinicName: doctor.clinicName,
      treatmentName: pack.name,
      consultationType: 'Procedure',
      date,
      timeSlot,
      status: paymentMethod === 'Pay at Clinic' ? 'pending' : 'upcoming',
      fee: finalPrice,
      paid,
      paymentMethod,
      voucherCode: voucher?.code,
      discountAmount: voucher?.discount,
      checkInStatus: 'pending'
    };
    handleBookAppointment(firstSessionAppt);

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      packageId: pack.id,
      title: `Package: ${pack.name}`,
      amount: finalPrice,
      date: purchaseDate,
      paymentMethod: mapToPaymentRecordMethod(paymentMethod),
      status: paymentMethod === 'Pay at Clinic' ? 'Pending' : 'Paid',
      invoicePdfUrl: '#',
      receiptNumber: `RC-PKG-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setPayments(prev => [newPayment, ...prev]);
    if (paid) {
      setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + Math.floor(finalPrice / 10) }));
    }

    triggerToast(t('toasts.packagePurchased', { packageName: pack.name, doctorName: doctor.name, date, timeSlot }));
  };

  const handlePaymentSuccess = (newPayment: PaymentRecord) => {
    setPayments(prev => [newPayment, ...prev]);
    setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + Math.floor(newPayment.amount / 10) }));
    triggerToast(t('toasts.paymentConfirmed', { amount: newPayment.amount }));
  };

  const handleSendMessageToAI = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I am available to assist you with any questions about Reveal Clinic treatments or doctors.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: "Reveal Assistant is ready! For appointments, feel free to visit the 'Book Doctor' section.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handlePurchaseGiftCard = (card: GiftCard) => {
    setGiftCards(prev => [card, ...prev]);
    triggerToast(t('toasts.giftCardSent', { email: card.recipientEmail }));
  };

  const handleRedeemGiftCardCode = (code: string) => {
    setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + 150 }));
    triggerToast(t('toasts.giftVoucherApplied', { code }));
  };

  // Staff Handlers
  const handleUpdateScheduleStatus = (id: string, status: ClinicalAppointmentStatus) => {
    setClinicalSchedule(prev => prev.map(item => item.id === id ? { ...item, status } : item));

    // If this schedule item came from a patient booking (same id), sync the
    // status back so the Patient Portal reflects Coordinator/Doctor updates -
    // e.g. marking a visit Completed unlocks "Rate Your Visit" for the patient.
    const patientStatus = clinicalStatusToAppointmentStatus(status);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: patientStatus } : a));

    triggerToast(t('toasts.scheduleStatusUpdated', { status: status.replace('_', ' ') }));
  };

  const handleUpdateSessionStatus = (sessionId: string, newStatus: TreatmentSession['status']) => {
    setTreatmentSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s,
      status: newStatus,
      progressPercent: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0
    } : s));
    triggerToast(t('toasts.sessionStatusUpdated', { sessionId, status: newStatus }));
  };

  const handleMarkNotifAsRead = (id: string) => {
    setStaffNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotifsAsRead = () => {
    setStaffNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerToast(t('toasts.allAlertsRead'));
  };

  const handleStaffStatusChange = (newStatus: 'Available' | 'In Consultation' | 'In Procedure' | 'On Break' | 'Off Duty') => {
    setUser(prev => ({ ...prev, availabilityStatus: newStatus }));
    triggerToast(t('toasts.statusSet', { status: newStatus }));
  };

  // 1. Splash Screen Lifecycle
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Onboarding Screen Lifecycle
  if (!hasOnboarded) {
    return <OnboardingScreen onComplete={() => setHasOnboarded(true)} />;
  }

  // 2.5 Standalone Full-Screen Auth & Role Switcher
  if (!isAuthenticated || showAuthModal) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-0 relative overflow-hidden font-sans antialiased selection:bg-[#4F8EF7] selection:text-white max-w-md mx-auto">
        <div className="w-full h-screen relative z-10 flex flex-col items-center justify-center">
          <AuthModal
            isOpen={true}
            isScreen={true}
            onClose={() => {
              setShowAuthModal(false);
              if (!isAuthenticated) {
                setIsAuthenticated(true);
              }
            }}
            user={user}
            onLoginSuccess={(loggedInUser) => {
              if (loggedInUser) setUser(loggedInUser);
              setIsAuthenticated(true);
              setShowAuthModal(false);
              triggerToast(t('toasts.loggedInWithRole', { name: loggedInUser?.fullName || 'User', role: loggedInUser?.role || 'patient' }));
            }}
            onSuccess={(loggedInUser) => {
              if (loggedInUser) setUser(loggedInUser);
              setIsAuthenticated(true);
              setShowAuthModal(false);
              triggerToast(t('toasts.loggedInWithRole', { name: loggedInUser?.fullName || 'User', role: loggedInUser?.role || 'patient' }));
            }}
          />
        </div>

        {snackbarMessage && (
          <Snackbar
            message={snackbarMessage}
            onClose={() => setSnackbarMessage(null)}
          />
        )}
      </div>
    );
  }

  // 3. DOCTOR / NURSE / COORDINATOR STAFF INTERFACE
  if (isStaffRole) {
    if (user.role === 'coordinator') {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col max-w-md mx-auto antialiased selection:bg-[#4F8EF7] selection:text-white">
          {/* Coordinator Main Section */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Coordinator Top Header */}
            <CoordinatorTopBar
              user={user}
              selectedBranch={selectedBranch}
              onChangeBranch={setSelectedBranch}
              branches={clinicBranches}
              unreadNotificationsCount={staffUnreadCount}
              onOpenNotifications={() => setCoordinatorActiveTab('notifications')}
              onSwitchRole={() => setShowAuthModal(true)}
              onQuickSearchClick={() => setCoordinatorActiveTab('patients')}
              onStatusChange={handleStaffStatusChange}
              notifications={staffNotifications}
              onMarkAsRead={handleMarkNotifAsRead}
            />

            <main className="flex-1 p-3 sm:p-6 pb-28 w-full">
              {/* PWA Installation Banner */}
              <PWAInstallBanner />

              {/* COORDINATOR VIEW SWITCHER */}
              {coordinatorActiveTab === 'dashboard' && (
                <CoordinatorDashboardView
                  user={user}
                  schedule={clinicalSchedule}
                  walkInQueue={walkInQueue}
                  notifications={staffNotifications}
                  onNavigateTab={setCoordinatorActiveTab}
                  onConfirmCheckIn={(id) => handleUpdateScheduleStatus(id, 'checked_in')}
                  onAddWalkIn={handleAddWalkIn}
                  onTriggerToast={triggerToast}
                />
              )}

              {coordinatorActiveTab === 'appointments' && (
                <CoordinatorAppointmentsView
                  schedule={clinicalSchedule}
                  onUpdateStatus={handleUpdateScheduleStatus}
                  onAddScheduleItem={handleAddScheduleItem}
                  onRescheduleScheduleItem={handleRescheduleScheduleItem}
                  onTriggerToast={triggerToast}
                />
              )}

              {coordinatorActiveTab === 'checkin' && (
                <CoordinatorCheckInView
                  schedule={clinicalSchedule}
                  onConfirmCheckIn={(id) => handleUpdateScheduleStatus(id, 'checked_in')}
                  onTriggerToast={triggerToast}
                />
              )}

              {coordinatorActiveTab === 'patients' && (
                <CoordinatorPatientLookupView
                  schedule={clinicalSchedule}
                  onTriggerToast={triggerToast}
                />
              )}

              {coordinatorActiveTab === 'notifications' && (
                <CoordinatorNotificationsView
                  notifications={staffNotifications}
                  onMarkAsRead={handleMarkNotifAsRead}
                  onMarkAllAsRead={handleMarkAllNotifsAsRead}
                  onTriggerToast={triggerToast}
                />
              )}

              {coordinatorActiveTab === 'profile' && (
                <CoordinatorProfileView
                  user={user}
                  selectedBranch={selectedBranch}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    setShowAuthModal(true);
                  }}
                  onTriggerToast={triggerToast}
                />
              )}
            </main>
          </div>

          {/* Coordinator Mobile Bottom Navigation */}
          <CoordinatorBottomNav
            activeTab={coordinatorActiveTab}
            onChangeTab={setCoordinatorActiveTab}
            unreadNotificationsCount={staffUnreadCount}
          />

          {/* Role Selector Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            user={user}
            onLoginSuccess={(loggedInUser) => {
              if (loggedInUser) setUser(loggedInUser);
              setIsAuthenticated(true);
              triggerToast(t('toasts.loggedInWithRole', { name: loggedInUser?.fullName || 'User', role: loggedInUser?.role || 'patient' }));
            }}
            onSuccess={(loggedInUser) => {
              if (loggedInUser) setUser(loggedInUser);
              setIsAuthenticated(true);
              triggerToast(t('toasts.loggedInWithRole', { name: loggedInUser?.fullName || 'User', role: loggedInUser?.role || 'patient' }));
            }}
          />

          {/* Toast Notification Snackbar */}
          {snackbarMessage && (
            <Snackbar
              message={snackbarMessage}
              onClose={() => setSnackbarMessage(null)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col max-w-md mx-auto antialiased selection:bg-[#4F8EF7] selection:text-white">
        {/* Staff Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Doctor Top Header */}
          <DoctorTopBar
            user={user}
            selectedBranch={selectedBranch}
            onChangeBranch={setSelectedBranch}
            branches={clinicBranches}
            unreadNotificationsCount={staffUnreadCount}
            onOpenNotifications={() => setStaffActiveTab('notifications')}
            onSwitchRole={() => setShowAuthModal(true)}
            onStatusChange={handleStaffStatusChange}
            notifications={staffNotifications}
            onMarkAsRead={handleMarkNotifAsRead}
          />

          <main className="flex-1 p-3 sm:p-6 pb-28 w-full">
            {/* PWA Installation Banner */}
            <PWAInstallBanner />

            {/* STAFF VIEW SWITCHER */}
            {staffActiveTab === 'dashboard' && (
              <DoctorDashboardView
                user={user}
                schedule={clinicalSchedule}
                sessions={treatmentSessions}
                notifications={staffNotifications}
                onNavigateTab={setStaffActiveTab}
                onSelectScheduleItem={() => setStaffActiveTab('schedule')}
                onSelectSession={() => setStaffActiveTab('sessions')}
                onUpdateScheduleStatus={handleUpdateScheduleStatus}
              />
            )}

            {staffActiveTab === 'schedule' && (
              <DoctorScheduleView
                schedule={clinicalSchedule}
                user={user}
                doctors={initialDoctors}
                onUpdateStatus={handleUpdateScheduleStatus}
                onSelectPatientFile={() => setStaffActiveTab('patients')}
              />
            )}

            {staffActiveTab === 'patients' && (
              <DoctorPatientsView
                patients={clinicalPatients}
                onAddClinicalNote={(patientId, note) => {
                  setClinicalPatients(prev => prev.map(p => p.id === patientId ? {
                    ...p,
                    medicalHistoryNotes: p.medicalHistoryNotes
                      ? `${p.medicalHistoryNotes}\n\n[${new Date().toLocaleDateString()}] ${note}`
                      : `[${new Date().toLocaleDateString()}] ${note}`
                  } : p));
                  triggerToast(t('toasts.clinicalNoteAdded'));
                }}
              />
            )}

            {staffActiveTab === 'sessions' && (
              <DoctorTreatmentSessionsView
                sessions={treatmentSessions}
                user={user}
                onUpdateSessionStatus={handleUpdateSessionStatus}
                onRequestItem={(sessionId, itemName, urgency) => {
                  setTreatmentSessions(prev => prev.map(s => s.id === sessionId ? {
                    ...s,
                    itemsRequested: [...s.itemsRequested, {
                      id: `req_${Date.now()}`,
                      name: itemName,
                      quantity: 1,
                      urgency,
                      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'Pending'
                    }]
                  } : s));
                  triggerToast(t('toasts.itemRequested', { itemName, urgency }));
                }}
              />
            )}

            {staffActiveTab === 'notifications' && (
              <DoctorNotificationsView
                notifications={staffNotifications}
                onMarkAsRead={handleMarkNotifAsRead}
                onMarkAllAsRead={handleMarkAllNotifsAsRead}
              />
            )}

            {staffActiveTab === 'profile' && (
              <DoctorProfileView
                user={user}
                branches={clinicBranches}
                selectedBranch={selectedBranch}
                onChangeBranch={setSelectedBranch}
                onLogout={() => {
                  setIsAuthenticated(false);
                  setShowAuthModal(true);
                }}
              />
            )}
          </main>
        </div>

        {/* Staff Mobile Bottom Navigation */}
        <DoctorBottomNav
          activeTab={staffActiveTab}
          onChangeTab={setStaffActiveTab}
          unreadNotificationsCount={staffUnreadCount}
        />

        {/* Role Selector Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          user={user}
          onLoginSuccess={(loggedInUser) => {
            if (loggedInUser) setUser(loggedInUser);
            setIsAuthenticated(true);
            triggerToast(t('toasts.loggedInWithRole', { name: loggedInUser?.fullName || 'User', role: loggedInUser?.role || 'patient' }));
          }}
          onSuccess={(loggedInUser) => {
            if (loggedInUser) setUser(loggedInUser);
            setIsAuthenticated(true);
            triggerToast(t('toasts.loggedInWithRole', { name: loggedInUser?.fullName || 'User', role: loggedInUser?.role || 'patient' }));
          }}
        />

        {/* Toast Notification Snackbar */}
        <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />
      </div>
    );
  }

  // 4. PATIENT EXPERIENCE INTERFACE
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col max-w-md mx-auto antialiased selection:bg-[#4F8EF7] selection:text-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopBar
          user={user}
          branches={clinicBranches}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          activeTab={patientActiveTab}
          onChangeTab={handleChangeTab}
          onOpenAuth={() => setShowAuthModal(true)}
          isAuthenticated={isAuthenticated}
          unreadCount={upcomingCount}
        />

        <main className="flex-1 p-3 sm:p-6 pb-28 w-full">
          {/* PWA Installation Banner */}
          <PWAInstallBanner />

          {/* VIEW SWITCHER */}
          {patientActiveTab === 'home' && (
            <HomeView
              user={user}
              selectedBranch={selectedBranch}
              upcomingAppointments={appointments.filter(a => a.status === 'upcoming')}
              activePackages={packages}
              recentReports={reports}
              popularTreatments={treatmentServices.slice(0, 4)}
              featuredPackages={treatmentPackages}
              onChangeTab={handleChangeTab}
              onViewMyVisits={handleViewMyVisits}
              onOpenGiftCards={() => setIsGiftCardsOpen(true)}
            />
          )}

          {patientActiveTab === 'appointments' && (
            <AppointmentsView
              doctors={user.favoriteDoctors && user.favoriteDoctors.length > 0 ? user.favoriteDoctors : initialDoctors}
              branches={clinicBranches}
              treatments={treatmentServices}
              appointments={appointments}
              selectedBranch={selectedBranch}
              onBookAppointment={handleBookAppointment}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              onSubmitFeedback={handleSubmitFeedback}
              activeSubTab={appointmentsSubTab}
              onChangeSubTab={handleChangeAppointmentsSubTab}
            />
          )}

          {patientActiveTab === 'services' && (
            <ServicesView
              treatments={treatmentServices}
              packages={treatmentPackages}
              doctors={user.favoriteDoctors && user.favoriteDoctors.length > 0 ? user.favoriteDoctors : initialDoctors}
              onBookAppointment={handleBookAppointment}
              onPurchasePackage={handleCompletePackagePurchase}
            />
          )}

          {patientActiveTab === 'checkin' && (
            <DigitalCheckInView
              user={user}
              selectedBranch={selectedBranch}
              upcomingAppointments={appointments.filter(a => a.status === 'upcoming')}
              onOpenPayment={() => {
                setPendingAppointmentForPay(appointments[0] || null);
                setIsPaymentOpen(true);
              }}
            />
          )}

          {patientActiveTab === 'reports' && (
            <MedicalReportsView reports={reports} />
          )}

          {patientActiveTab === 'chat' && (
            <AIChatBot
              messages={chatMessages}
              onSendMessage={handleSendMessageToAI}
              onChangeTab={handleChangeTab}
              doctors={user.favoriteDoctors && user.favoriteDoctors.length > 0 ? user.favoriteDoctors : initialDoctors}
              selectedBranch={selectedBranch}
              onBookAppointment={handleBookAppointment}
            />
          )}

          {patientActiveTab === 'profile' && (
            <ProfileView
              user={user}
              branches={clinicBranches}
              payments={payments}
              onSaveProfile={setUser}
              onOpenLoyalty={() => setIsLoyaltyOpen(true)}
              onOpenReferral={() => setIsReferralOpen(true)}
              onOpenGiftCards={() => setIsGiftCardsOpen(true)}
              onLogout={() => {
                setIsAuthenticated(false);
                setShowAuthModal(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <BottomNav activeTab={patientActiveTab} onChangeTab={handleChangeTab} />

      {/* MODALS */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        user={user}
        onLoginSuccess={(loggedInUser) => {
          if (loggedInUser) setUser(loggedInUser);
          setIsAuthenticated(true);
          triggerToast(t('toasts.loggedIn', { name: loggedInUser?.fullName || 'User' }));
        }}
        onSuccess={(loggedInUser) => {
          if (loggedInUser) setUser(loggedInUser);
          setIsAuthenticated(true);
          triggerToast(t('toasts.loggedIn', { name: loggedInUser?.fullName || 'User' }));
        }}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setPendingAppointmentForPay(null);
        }}
        pendingAppointment={pendingAppointmentForPay}
        paymentHistory={payments}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <LoyaltyRewardsModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
      />

      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        user={user}
      />

      <GiftCardModal
        isOpen={isGiftCardsOpen}
        onClose={() => setIsGiftCardsOpen(false)}
        user={user}
        giftCards={giftCards}
        onPurchaseGiftCard={handlePurchaseGiftCard}
        onRedeemGiftCardCode={handleRedeemGiftCardCode}
      />

      {/* Floating Modern AI Chatbot Launcher & Popover */}
      <FloatingChatWidget
        messages={chatMessages}
        onSendMessage={handleSendMessageToAI}
        onChangeTab={handleChangeTab}
        isOpen={isFloatingChatOpen}
        onToggleOpen={() => setIsFloatingChatOpen(prev => !prev)}
        doctors={user.favoriteDoctors && user.favoriteDoctors.length > 0 ? user.favoriteDoctors : initialDoctors}
        selectedBranch={selectedBranch}
        onBookAppointment={handleBookAppointment}
      />

      {/* Toast Notification Snackbar */}
      <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />
    </div>
  );
}

export default App;
