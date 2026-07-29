import {
  UserProfile,
  Doctor,
  Appointment,
  PaymentRecord,
  ActiveUserPackage,
  MedicalReport,
  NotificationItem,
  GiftCard,
  ChatMessage
} from '../types';
import {
  initialUserProfile,
  initialDoctors,
  initialAppointments,
  initialPayments,
  initialActivePackages,
  initialMedicalReports,
  initialNotifications,
  giftCardsList
} from '../data/mockData';

const KEYS = {
  USER: 'reveal_user_profile',
  DOCTORS: 'reveal_doctors',
  APPOINTMENTS: 'reveal_appointments',
  PAYMENTS: 'reveal_payments',
  PACKAGES: 'reveal_active_packages',
  REPORTS: 'reveal_medical_reports',
  NOTIFICATIONS: 'reveal_notifications',
  GIFT_CARDS: 'reveal_gift_cards',
  CHAT_MESSAGES: 'reveal_chat_messages',
  THEME_MODE: 'reveal_theme_mode',
  LANGUAGE: 'reveal_language',
  OFFLINE_SIMULATION: 'reveal_offline_sim'
};

export function loadState<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const getStoredUser = (): UserProfile => {
  try {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : initialUserProfile;
  } catch {
    return initialUserProfile;
  }
};

export const saveStoredUser = (user: UserProfile) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getStoredAppointments = (): Appointment[] => {
  try {
    const data = localStorage.getItem(KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : initialAppointments;
  } catch {
    return initialAppointments;
  }
};

export const saveStoredAppointments = (appts: Appointment[]) => {
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appts));
};

export const getStoredPayments = (): PaymentRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.PAYMENTS);
    return data ? JSON.parse(data) : initialPayments;
  } catch {
    return initialPayments;
  }
};

export const saveStoredPayments = (payments: PaymentRecord[]) => {
  localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
};

export const getStoredActivePackages = (): ActiveUserPackage[] => {
  try {
    const data = localStorage.getItem(KEYS.PACKAGES);
    return data ? JSON.parse(data) : initialActivePackages;
  } catch {
    return initialActivePackages;
  }
};

export const saveStoredActivePackages = (packs: ActiveUserPackage[]) => {
  localStorage.setItem(KEYS.PACKAGES, JSON.stringify(packs));
};

export const getStoredReports = (): MedicalReport[] => {
  try {
    const data = localStorage.getItem(KEYS.REPORTS);
    return data ? JSON.parse(data) : initialMedicalReports;
  } catch {
    return initialMedicalReports;
  }
};

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : initialNotifications;
  } catch {
    return initialNotifications;
  }
};

export const saveStoredNotifications = (notifs: NotificationItem[]) => {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
};

export const getStoredGiftCards = (): GiftCard[] => {
  try {
    const data = localStorage.getItem(KEYS.GIFT_CARDS);
    return data ? JSON.parse(data) : giftCardsList;
  } catch {
    return giftCardsList;
  }
};

export const saveStoredGiftCards = (cards: GiftCard[]) => {
  localStorage.setItem(KEYS.GIFT_CARDS, JSON.stringify(cards));
};

export const getStoredChat = (): ChatMessage[] => {
  try {
    const data = localStorage.getItem(KEYS.CHAT_MESSAGES);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return [
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Hello Noura! Welcome to Reveal Clinic. How may I assist your skin, aesthetic, or appointment needs today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
};

export const saveStoredChat = (messages: ChatMessage[]) => {
  localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(messages));
};

// ----------------------------------------------------------------------
// Registered Patient Accounts (mobile number + password -> profile)
//
// This app has no real backend, so "accounts" created via the signup flow
// are kept here so a patient can log back in later with the same mobile
// number and password they registered with, instead of only ever being
// reachable through the hardcoded demo credentials.
// ----------------------------------------------------------------------
const REGISTERED_PATIENTS_KEY = 'reveal_registered_patients';

interface RegisteredPatientAccount {
  phone: string; // normalized: digits only
  password: string;
  profile: UserProfile;
}

const normalizePhone = (phone: string): string => phone.replace(/\D/g, '').slice(-9);

export const registerPatientAccount = (phone: string, password: string, profile: UserProfile): void => {
  const accounts = loadState<RegisteredPatientAccount[]>(REGISTERED_PATIENTS_KEY, []);
  const normalized = normalizePhone(phone);
  const withoutExisting = accounts.filter((a) => a.phone !== normalized);
  saveState(REGISTERED_PATIENTS_KEY, [...withoutExisting, { phone: normalized, password, profile }]);
};

export const findRegisteredPatientAccount = (phone: string, password: string): UserProfile | null => {
  const accounts = loadState<RegisteredPatientAccount[]>(REGISTERED_PATIENTS_KEY, []);
  const normalized = normalizePhone(phone);
  const match = accounts.find((a) => a.phone === normalized && a.password === password);
  return match ? match.profile : null;
};
