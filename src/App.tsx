import React, { useState, useEffect } from 'react';
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

export function App() {
  // Application Lifecycle States
  const [showSplash, setShowSplash] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => loadState('reveal_onboarded', false));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadState('reveal_authenticated', true));
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Active Tab for Patient Navigation
  const [patientActiveTab, setPatientActiveTab] = useState<TabType>('home');

  // Active Tab for Doctor / Nurse / Staff Navigation
  const [staffActiveTab, setStaffActiveTab] = useState<StaffTabType>('dashboard');

  // Active Tab for Coordinator Navigation
  const [coordinatorActiveTab, setCoordinatorActiveTab] = useState<CoordinatorTabType>('dashboard');

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
      text: 'Hello Sophia! 👋 Welcome to Reveal Medical & Aesthetic Center. I am your AI Clinic Assistant. How can I assist with your skincare routine, doctor consultations, or treatment bookings today?',
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
      text: 'Certainly, Sophia! Here are your personalized post-treatment care guidelines:\n\n✨ 1. Moisture Lock: Use a gentle, hyaluronic acid serum morning and night.\n☀️ 2. Sun Defense: Apply SPF 50+ broad-spectrum sunscreen before stepping outdoors.\n🧴 3. Avoid Exfoliants: Hold off on Retinol or AHA/BHA chemical peels for 5 days.\n💧 4. Stay Hydrated: Drink plenty of water to enhance skin radiance and healing.\n\nWould you like me to book your 2-week skin evaluation appointment with Dr. Elena Rostova?',
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
      text: 'Dr. Elena Rostova has 3 open consultation slots tomorrow at Reveal Olaya Medical Center (Riyadh):\n\n• 🗓️ 10:00 AM (Morning)\n• 🗓️ 02:30 PM (Afternoon)\n• 🗓️ 04:15 PM (Late Afternoon)\n\nTap "Book Doctor" at the top of this chat or reply with your preferred time to confirm!',
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
  const [pendingPackageForPay, setPendingPackageForPay] = useState<TreatmentPackage | null>(null);

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

  const handleAddScheduleItem = (item: ClinicalScheduleItem) => {
    setClinicalSchedule(prev => [item, ...prev]);
  };

  // Patient Handlers
  const handleBookAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
    triggerToast(`Appointment with ${newAppt.doctorName} booked!`);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    triggerToast("Appointment cancelled.");
  };

  const handleRescheduleAppointment = (id: string, newDate: string, newSlot: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, timeSlot: newSlot } : a));
    triggerToast(`Rescheduled to ${newDate} at ${newSlot}`);
  };

  const handleSubmitFeedback = (id: string, rating: number, comment: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, feedbackRating: rating, feedbackComment: comment } : a));
    triggerToast("Thank you for rating your doctor!");
  };

  const handlePurchasePackage = (pack: TreatmentPackage, doctor: Doctor, date: string, timeSlot: string) => {
    setPendingPackageForPay(pack);
    setIsPaymentOpen(true);
    triggerToast(`Package selected with Dr. ${doctor.name} for ${date} at ${timeSlot}. Complete payment.`);
  };

  const handlePaymentSuccess = (newPayment: PaymentRecord) => {
    setPayments(prev => [newPayment, ...prev]);
    setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + Math.floor(newPayment.amount / 10) }));
    triggerToast(`Payment of $${newPayment.amount} confirmed! Earned loyalty points.`);
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

  const handleRedeemReward = (pointsCost: number, rewardTitle: string) => {
    setUser(prev => ({ ...prev, loyaltyPoints: Math.max(0, prev.loyaltyPoints - pointsCost) }));
    triggerToast(`Redeemed ${rewardTitle}! Code generated.`);
  };

  const handlePurchaseGiftCard = (card: GiftCard) => {
    setGiftCards(prev => [card, ...prev]);
    triggerToast(`Gift card sent to ${card.recipientEmail}`);
  };

  const handleRedeemGiftCardCode = (code: string) => {
    setUser(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + 150 }));
    triggerToast(`Gift voucher ${code} applied to patient account!`);
  };

  // Staff Handlers
  const handleUpdateScheduleStatus = (id: string, status: ClinicalAppointmentStatus) => {
    setClinicalSchedule(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    triggerToast(`Schedule status updated to ${status.replace('_', ' ')}`);
  };

  const handleUpdateSessionStatus = (sessionId: string, newStatus: TreatmentSession['status']) => {
    setTreatmentSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s,
      status: newStatus,
      progressPercent: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0
    } : s));
    triggerToast(`Session #${sessionId} status updated to ${newStatus}`);
  };

  const handleMarkNotifAsRead = (id: string) => {
    setStaffNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotifsAsRead = () => {
    setStaffNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerToast("All staff alerts marked as read.");
  };

  const handleStaffStatusChange = (newStatus: 'Available' | 'In Consultation' | 'In Procedure' | 'On Break' | 'Off Duty') => {
    setUser(prev => ({ ...prev, availabilityStatus: newStatus }));
    triggerToast(`Status set to ${newStatus}`);
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
              triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'} (${loggedInUser?.role || 'patient'})`);
            }}
            onSuccess={(loggedInUser) => {
              if (loggedInUser) setUser(loggedInUser);
              setIsAuthenticated(true);
              setShowAuthModal(false);
              triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'} (${loggedInUser?.role || 'patient'})`);
            }}
          />
        </div>

        {snackbarMessage && (
          <Snackbar
            message={snackbarMessage}
            onDismiss={() => setSnackbarMessage(null)}
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
              triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'} (${loggedInUser?.role || 'patient'})`);
            }}
            onSuccess={(loggedInUser) => {
              if (loggedInUser) setUser(loggedInUser);
              setIsAuthenticated(true);
              triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'} (${loggedInUser?.role || 'patient'})`);
            }}
          />

          {/* Toast Notification Snackbar */}
          {snackbarMessage && (
            <Snackbar
              message={snackbarMessage}
              onDismiss={() => setSnackbarMessage(null)}
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
                  triggerToast("Clinical note added to Medical Notes.");
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
                    itemsRequested: [...s.itemsRequested, { name: itemName, status: 'Requested', urgency }]
                  } : s));
                  triggerToast(`Requested ${itemName} (${urgency} priority)`);
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
            triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'} (${loggedInUser?.role || 'patient'})`);
          }}
          onSuccess={(loggedInUser) => {
            if (loggedInUser) setUser(loggedInUser);
            setIsAuthenticated(true);
            triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'} (${loggedInUser?.role || 'patient'})`);
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
          onChangeTab={setPatientActiveTab}
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
              onChangeTab={setPatientActiveTab}
              onOpenCheckIn={() => setPatientActiveTab('checkin')}
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
              onOpenCheckIn={() => setPatientActiveTab('checkin')}
            />
          )}

          {patientActiveTab === 'services' && (
            <ServicesView
              treatments={treatmentServices}
              packages={treatmentPackages}
              doctors={user.favoriteDoctors && user.favoriteDoctors.length > 0 ? user.favoriteDoctors : initialDoctors}
              onSelectTreatmentForBooking={() => {
                setPatientActiveTab('appointments');
              }}
              onPurchasePackage={handlePurchasePackage}
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

          {(patientActiveTab === 'chat' || patientActiveTab === 'chatbot') && (
            <AIChatBot
              messages={chatMessages}
              onSendMessage={handleSendMessageToAI}
              onChangeTab={setPatientActiveTab}
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
      <BottomNav activeTab={patientActiveTab} onChangeTab={setPatientActiveTab} />

      {/* MODALS */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        user={user}
        onLoginSuccess={(loggedInUser) => {
          if (loggedInUser) setUser(loggedInUser);
          setIsAuthenticated(true);
          triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'}`);
        }}
        onSuccess={(loggedInUser) => {
          if (loggedInUser) setUser(loggedInUser);
          setIsAuthenticated(true);
          triggerToast(`Logged in as ${loggedInUser?.fullName || 'User'}`);
        }}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setPendingAppointmentForPay(null);
          setPendingPackageForPay(null);
        }}
        pendingAppointment={pendingAppointmentForPay}
        pendingPackage={pendingPackageForPay}
        paymentHistory={payments}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <LoyaltyRewardsModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        user={user}
        onRedeemReward={handleRedeemReward}
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
        onChangeTab={setPatientActiveTab}
        isOpen={isFloatingChatOpen}
        onToggleOpen={() => setIsFloatingChatOpen(prev => !prev)}
      />

      {/* Toast Notification Snackbar */}
      <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage(null)} />
    </div>
  );
}

export default App;
