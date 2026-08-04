export type TabType = 'home' | 'appointments' | 'services' | 'checkin' | 'reports' | 'chat' | 'profile';
export type StaffTabType = 'dashboard' | 'schedule' | 'patients' | 'sessions' | 'notifications' | 'profile';
export type CoordinatorTabType = 'dashboard' | 'appointments' | 'checkin' | 'patients' | 'notifications' | 'profile';

export interface WalkInPatient {
  id: string;
  patientName: string;
  patientFileNo?: string;
  patientPhone: string;
  assignedDoctorId: string;
  assignedDoctorName: string;
  requestedService: string;
  requestedDate?: string;
  requestedTimeSlot?: string;
  arrivalTime: string;
  estimatedWaitMinutes: number;
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled';
  queueNumber: number;
  notes?: string;
}

export type UserRole = 'patient' | 'doctor' | 'nurse' | 'coordinator';

export type Gender = 'female' | 'male' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
  id: string;
  role?: UserRole;
  patientId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  nationality: string;
  preferredClinicId: string;
  hearAboutUs?: string;
  avatarUrl: string;
  address: string;
  secondaryContact: string;
  bloodGroup: string;
  skinAllergies: string[];
  medicalNotes: string;
  loyaltyPoints: number;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  referralCode: string;
  accountCreated: string;
  favoriteDoctors?: Doctor[];
  // Staff fields
  staffId?: string;
  title?: string;
  specialty?: string;
  licenseNumber?: string;
  department?: string;
  consultationRoom?: string;
  availabilityStatus?: 'Available' | 'In Consultation' | 'In Procedure' | 'On Break' | 'Off Duty';
  rating?: number;
  reviewCount?: number;
}

export interface ClinicBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  workingHours: string;
  image: string;
  distance: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  clinicId: string;
  clinicName: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  avatarUrl: string;
  bio: string;
  languages: string[];
  availableDays: string[];
  consultationFee: number;
  availableTimeSlots: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface TreatmentService {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  benefits: string[];
  preCare: string;
  postCare: string;
  isPopular?: boolean;
}

export interface TreatmentPackage {
  id: string;
  name: string;
  tagline: string;
  totalSessions: number;
  price: number;
  originalValue: number;
  savingsPercentage: number;
  imageUrl: string;
  includedTreatments: string[];
  validityMonths: number;
  description: string;
}

export interface ActiveUserPackage {
  id: string;
  packageId: string;
  packageName: string;
  totalSessions: number;
  remainingSessions: number;
  expiryDate: string;
  purchaseDate: string;
  qrCodeValue: string;
}

export type AppointmentStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled' | 'in_progress';
export type ConsultationType = 'In-Clinic Consultation' | 'Follow-up Checkup' | 'Procedure';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  clinicId: string;
  clinicName: string;
  treatmentName: string;
  consultationType: ConsultationType;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  fee: number;
  paid: boolean;
  paymentMethod?: 'Pay at Clinic' | 'Pay Online' | 'Buy Now Pay Later';
  voucherCode?: string;
  discountAmount?: number;
  notes?: string;
  feedbackRating?: number;
  feedbackComment?: string;
  checkInStatus?: 'pending' | 'checked_in' | 'waiting' | 'in_doctor_room';
  queueNumber?: number;
}

export interface PaymentRecord {
  id: string;
  appointmentId?: string;
  packageId?: string;
  title: string;
  amount: number;
  date: string;
  paymentMethod: 'Credit / Debit Card' | 'Apple Pay' | 'Google Pay' | 'Pay at Clinic' | 'Installments (Tabby)' | 'Mada Card (مدى)' | 'Apple Pay / STC Pay';
  status: 'Paid' | 'Pending' | 'Refunded';
  invoicePdfUrl: string;
  receiptNumber: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  type: 'Medical Certificate' | 'Treatment Summary' | 'Lab & Skin Analysis' | 'Dermatology Prescription';
  doctorName: string;
  date: string;
  clinicName: string;
  summary: string;
  prescriptions?: Array<{ medication: string; dosage: string; instructions: string }>;
  downloadPdfName: string;
  fileSize: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'payment' | 'offer' | 'reminder' | 'system';
  read: boolean;
  actionUrl?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  discountValue: string;
  code: string;
  category: 'Treatment Discount' | 'Free Product' | 'VIP Perks';
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  personalMessage: string;
  theme: 'gold_luxury' | 'rose_glow' | 'serene_blue';
  purchaseDate: string;
  status: 'Active' | 'Redeemed' | 'Expired';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// ----------------------------------------------------------------------
// DOCTOR & NURSE CLINICAL INTERFACES
// ----------------------------------------------------------------------

export type ClinicalAppointmentStatus = 
  | 'scheduled' 
  | 'checked_in' 
  | 'in_consultation' 
  | 'procedure' 
  | 'completed' 
  | 'cancelled';

export interface ClinicalScheduleItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  patientAvatar: string;
  doctorId: string;
  doctorName: string;
  treatmentName: string;
  consultationType: ConsultationType;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  status: ClinicalAppointmentStatus;
  roomNumber: string;
  allergyAlerts: string[];
  visitReason: string;
  vitalSigns?: {
    bp?: string;
    pulse?: number;
    weightKg?: number;
    skinType?: string;
  };
  notes?: string;
  paymentStatus?: 'Paid' | 'Pending Deposit' | 'Covered by Package';
  queueNumber?: number;
}

export interface PatientVisitHistory {
  id: string;
  date: string;
  doctorName: string;
  clinicBranch: string;
  treatmentName: string;
  clinicalNotes: string;
  prescriptions?: Array<{ medication: string; dosage: string; frequency: string }>;
  reportPdfUrl?: string;
}

export interface PatientTreatmentHistoryItem {
  id: string;
  treatmentName: string;
  packageName?: string;
  startDate: string;
  completedSessions: number;
  totalSessions: number;
  status: 'Active' | 'Completed' | 'Paused';
  lastSessionDate: string;
}

export interface ClinicalPatientRecord {
  id: string;
  patientId: string;
  fullName: string;
  phone?: string;
  email?: string;
  preferredBranch?: string;
  age: number;
  gender: Gender;
  avatarUrl: string;
  bloodGroup: string;
  allergies: string[];
  skinType: string;
  medicalHistoryNotes: string;
  importantNotes: string[];
  previousVisits: PatientVisitHistory[];
  treatmentHistory: PatientTreatmentHistoryItem[];
  reports: MedicalReport[];
  activePackagesCount: number;
  registeredBranch: string;
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: 'Filler' | 'Toxin' | 'Laser Tip' | 'Skincare Gel' | 'Disposables';
  quantity: number;
  unit: string;
  batchNumber: string;
  costPerUnit?: number;
}

export interface IssuedItem {
  id: string;
  name: string;
  quantity: number;
  instructions: string;
  issuedAt: string;
  status: 'Issued' | 'Dispensed' | 'Pending Pharmacy';
}

export interface RequestedItem {
  id: string;
  name: string;
  quantity: number;
  urgency: 'Normal' | 'High' | 'Immediate' | 'Urgent';
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Delivered';
}

export interface MachineDetails {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  lastSanitized: string;
  laserSettings?: {
    energyJoules?: number;
    pulseDurationMs?: number;
    spotSizeMm?: number;
    totalPasses?: number;
  };
}

export interface TreatmentSession {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  patientAvatar: string;
  treatmentName: string;
  doctorName: string;
  nurseName?: string;
  roomNumber: string;
  startTime: string;
  endTime?: string;
  status: 'Scheduled' | 'Checked In' | 'In Progress' | 'Completed' | 'Pending Review' | 'Ready for Procedure';
  progressPercent?: number;
  machinesUsed: MachineDetails[];
  consumablesUsed: ConsumableItem[];
  itemsIssued: IssuedItem[];
  itemsRequested: RequestedItem[];
  clinicalNotes: string;
  procedureSummary: string;
  followUpDays?: number;
  paymentIntegrationStatus?: {
    gateway: 'Stripe' | 'Tabby Installments' | 'Clinic Terminal';
    amount: number;
    status: 'Paid' | 'Pending Payment Link' | 'Approved';
    transactionRef: string;
  };
}

export type StaffNotificationType =
  | 'new_appointment'
  | 'cancellation'
  | 'rescheduled'
  | 'followup_reminder'
  | 'patient_checked_in'
  | 'patient_in_consultation'
  | 'patient_ready_for_procedure'
  | 'patient_completed'
  | 'check_in'
  | 'emergency'
  | 'consumable_request';

export interface StaffNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: StaffNotificationType;
  read: boolean;
  patientName?: string;
  patientAvatar?: string;
  appointmentId?: string;
  urgency?: 'normal' | 'high';
}
