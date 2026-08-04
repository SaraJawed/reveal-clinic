import {
  UserProfile,
  ClinicBranch,
  Doctor,
  TreatmentService,
  TreatmentPackage,
  ActiveUserPackage,
  Appointment,
  PaymentRecord,
  MedicalReport,
  NotificationItem,
  LoyaltyReward,
  GiftCard,
  ClinicalScheduleItem,
  ClinicalPatientRecord,
  TreatmentSession,
  StaffNotification,
  WalkInPatient
} from '../types';

export const HARDCODED_AVATARS = [
  { id: 'av1', label: 'Avatar 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  { id: 'av2', label: 'Avatar 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  { id: 'av3', label: 'Avatar 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
  { id: 'av4', label: 'Avatar 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
  { id: 'av5', label: 'Avatar 5', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
  { id: 'av6', label: 'Avatar 6', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300' }
];

export const initialUserProfile: UserProfile = {
  id: 'usr_772183',
  patientId: 'RC-99841',
  fullName: 'Noura Al-Qahtani',
  email: 'noura.alqahtani@example.com',
  phone: '+966 50 123 4567',
  gender: 'female',
  dateOfBirth: '1992-06-14',
  nationality: 'Saudi Arabian',
  preferredClinicId: 'clinic_downtown',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  address: 'King Fahd Road, Olaya District, Riyadh 12211, Saudi Arabia',
  secondaryContact: '+966 55 987 6543 (Husband - Faisal)',
  bloodGroup: 'O+',
  skinAllergies: ['Benzoyl Peroxide', 'Fragrance (Severe)', 'Latex (Mild)'],
  medicalNotes: 'Saudi MOH Registered Patient (File #RC-99841). Sensitive skin barrier prone to rosacea flare-ups. Uses gentle non-comedogenic cleansers.',
  loyaltyPoints: 1450,
  loyaltyTier: 'Gold',
  referralCode: 'NOURA-GLOW-50',
  accountCreated: '2024-01-15',
  favoriteDoctors: []
};

export const clinicBranches: ClinicBranch[] = [
  {
    id: 'clinic_downtown',
    name: 'Reveal Olaya Medical Center (Riyadh)',
    address: 'King Fahd Road, Olaya District',
    city: 'Riyadh',
    phone: '+966 11 480 3251',
    workingHours: 'Sat - Thu: 9:00 AM - 10:00 PM | Fri: 2:00 PM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    distance: '1.2 km away'
  },
  {
    id: 'clinic_marina',
    name: 'Reveal Al Nakheel Aesthetic Hub (Riyadh)',
    address: 'Northern Ring Road, Al Nakheel District',
    city: 'Riyadh',
    phone: '+966 11 480 3252',
    workingHours: 'Sat - Thu: 9:00 AM - 10:00 PM | Fri: 2:00 PM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
    distance: '4.8 km away'
  },
  {
    id: 'clinic_palm',
    name: 'Reveal Sulaimaniyah Health Suite (Riyadh)',
    address: 'Tahlia Street, Al Sulaimaniyah',
    city: 'Riyadh',
    phone: '+966 11 480 3253',
    workingHours: 'Sat - Thu: 10:00 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600',
    distance: '8.5 km away'
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Fatima Al-Zahrani',
    title: 'MD, Board Certified Dermatologist',
    specialty: 'Anti-Aging & Facial Contouring Specialist',
    clinicId: 'clinic_downtown',
    clinicName: 'Reveal Olaya Medical Center (Riyadh)',
    rating: 4.9,
    reviewCount: 312,
    experienceYears: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Specializing in subtle facial rejuvenation, non-surgical liquid rhinoplasty, and laser collagen stimulation with a natural aesthetic philosophy.',
    languages: ['Arabic', 'English', 'French'],
    availableDays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    consultationFee: 350,
    availableTimeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM']
  },
  {
    id: 'doc_2',
    name: 'Dr. Faisal Al-Dosari',
    title: 'MD, Laser & Cosmetic Surgeon',
    specialty: 'Laser Hair Removal & Skin Resurfacing',
    clinicId: 'clinic_marina',
    clinicName: 'Reveal Al Nakheel Aesthetic Hub (Riyadh)',
    rating: 4.8,
    reviewCount: 245,
    experienceYears: 11,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Pioneer in dual-wavelength laser dermatological technologies, scar revision, hyperpigmentation correction, and tattoo removal.',
    languages: ['Arabic', 'English'],
    availableDays: ['Sat', 'Mon', 'Wed', 'Thu'],
    consultationFee: 300,
    availableTimeSlots: ['10:00 AM', '01:30 PM', '03:00 PM', '05:30 PM']
  },
  {
    id: 'doc_3',
    name: 'Dr. Maha Al-Otaibi',
    title: 'MD, Cosmetic Dermatology Specialist',
    specialty: 'HydraFacial MD & Biostimulator Fillers',
    clinicId: 'clinic_downtown',
    clinicName: 'Reveal Olaya Medical Center (Riyadh)',
    rating: 4.95,
    reviewCount: 189,
    experienceYears: 9,
    avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    bio: 'Focuses on medical skin health, acne scarring treatments, regenerative micro-needling with exosomes, and glow booster infusions.',
    languages: ['Arabic', 'English'],
    availableDays: ['Sun', 'Tue', 'Wed', 'Thu'],
    consultationFee: 280,
    availableTimeSlots: ['11:30 AM', '02:30 PM', '04:00 PM', '07:00 PM']
  },
  {
    id: 'doc_4',
    name: 'Dr. Tariq Al-Mansoor',
    title: 'MD, Chief Clinical Dermatologist',
    specialty: 'Skin Oncology & Medical Dermatology',
    clinicId: 'clinic_palm',
    clinicName: 'Reveal Sulaimaniyah Health Suite (Riyadh)',
    rating: 5.0,
    reviewCount: 420,
    experienceYears: 18,
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    bio: 'Expert in clinical skin diagnostics, eczema & psoriasis management, mole mapping digital screening, and dermatological surgery.',
    languages: ['Arabic', 'English'],
    availableDays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    consultationFee: 450,
    availableTimeSlots: ['09:00 AM', '10:30 AM', '03:00 PM', '05:00 PM']
  }
];

export const treatmentServices: TreatmentService[] = [
  {
    id: 'treat_hydrafacial',
    categoryId: 'cat_dermatology',
    categoryName: 'Medical Aesthetics',
    name: 'HydraFacial Platinum Glow',
    shortDescription: '6-in-1 medical grade facial with vortex extraction & LED light therapy',
    fullDescription: 'The ultimate non-invasive skin treatment combining deep cleansing, painless vortex extractions, intense hyaluronic hydration, targeted antioxidant peptide serum infusion, and red light collagen synthesis.',
    price: 850,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
    benefits: ['Deep Pore Cleansing', 'Instant Hydration & Radiance', 'No Downtime', 'Smooths Fine Lines'],
    preCare: 'Avoid using retinoids or AHA/BHA exfoliants 3 days prior.',
    postCare: 'Apply SPF 50+ daily. Avoid intense sauna or direct sun exposure for 24 hours.',
    isPopular: true
  },
  {
    id: 'treat_laser_hair',
    categoryId: 'cat_laser',
    categoryName: 'Laser Treatments',
    name: 'GentleMax Pro Dual-Wave Laser',
    shortDescription: 'FDA-approved pain-free laser hair removal for all skin tones',
    fullDescription: 'Utilizing Alexandrite & Nd:YAG dual wavelengths with integrated dynamic cooling to comfortably target hair follicles at the root for long-lasting silky smooth skin.',
    price: 650,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&q=80&w=600',
    benefits: ['Permanent Hair Reduction', 'Dynamic Air Cooling Technology', 'Safe for Sensitive Skin'],
    preCare: 'Shave the treatment area 24 hours before your appointment. Do not wax or bleach.',
    postCare: 'Apply soothing aloe vera gel. Avoid hot baths or friction for 24 hours.',
    isPopular: true
  },
  {
    id: 'treat_botox',
    categoryId: 'cat_injectables',
    categoryName: 'Injectables',
    name: 'Botox Anti-Wrinkle Rejuvenation',
    shortDescription: 'Precision wrinkle smoothing for forehead, frown lines & crow’s feet',
    fullDescription: 'Custom micro-injections using premium FDA-cleared Botulinum Toxin to gently relax expression muscles, softening existing wrinkles while preventing deep dynamic lines.',
    price: 1200,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    benefits: ['Softens Expression Lines', 'Natural Rejuvenated Appearance', 'Results in 3-7 days'],
    preCare: 'Avoid blood-thinning supplements (Vitamin E, Fish Oil) 5 days before.',
    postCare: 'Remain upright for 4 hours. Avoid rubbing the area or vigorous physical exercise for 24 hours.'
  },
  {
    id: 'treat_collagen_lift',
    categoryId: 'cat_antiaging',
    categoryName: 'Anti-Aging',
    name: 'Sculptra Biostimulator Collagen Lift',
    shortDescription: 'Poly-L-Lactic Acid micro-stimulator for gradual facial volume restoration',
    fullDescription: 'A biocompatible injectable treatment that stimulates your skin’s natural collagen production over time, restoring structural volume and youthful firmness lasting up to 2 years.',
    price: 2500,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    benefits: ['Long-lasting Results (2+ years)', 'Stimulates Natural Collagen', 'Gradual & Natural Lift'],
    preCare: 'Arrive 15 minutes early for topical numbing cream application.',
    postCare: 'Perform 5-minute gentle face massage 5 times a day for 5 days as guided by doctor.'
  },
  {
    id: 'treat_coolsculpting',
    categoryId: 'cat_body',
    categoryName: 'Body Contouring',
    name: 'CoolSculpting Elite Cryolipolysis',
    shortDescription: 'Non-invasive fat freezing & targeted body sculpting technology',
    fullDescription: 'Controlled cooling technology that targets and eliminates stubborn fat cells without damaging surrounding tissue, ideal for abdomen, flanks, and thighs.',
    price: 1800,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600',
    benefits: ['Permanent Fat Cell Reduction', 'Non-Surgical', 'Return to Normal Activities Immediately'],
    preCare: 'Wear loose comfortable clothing.',
    postCare: 'Drink plenty of water to help flush eliminated fat cells.'
  }
];

export const treatmentPackages: TreatmentPackage[] = [
  {
    id: 'pack_radiance',
    name: 'HydraGlow 4-Session Radiance Pack',
    tagline: 'Quarterly skin renewal & deep barrier hydration',
    totalSessions: 4,
    price: 2800,
    originalValue: 3400,
    savingsPercentage: 18,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600',
    includedTreatments: ['4x HydraFacial Platinum', '4x LED Light Therapy', 'Complimentary Skin Diagnostic'],
    validityMonths: 6,
    description: 'Maintain luminous, glass-like skin all year long with scheduled monthly HydraFacial treatments and LED phototherapy.'
  },
  {
    id: 'pack_laser_full',
    name: 'Silky Smooth Laser Hair Removal (6 Sessions)',
    tagline: 'Complete freedom with dual-wavelength precision',
    totalSessions: 6,
    price: 3200,
    originalValue: 3900,
    savingsPercentage: 20,
    imageUrl: 'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&q=80&w=600',
    includedTreatments: ['6x Laser Sessions (Full Area)', 'Cooling Gel Aftercare', 'Touch-up Assessment'],
    validityMonths: 12,
    description: 'Comprehensive 6-session laser package designed for maximum permanent reduction across body or facial areas.'
  },
  {
    id: 'pack_vip_skin',
    name: 'Ageless Skin Rejuvenation Trio',
    tagline: 'Combinatorial Botox, Microneedling & Exosome Infusion',
    totalSessions: 3,
    price: 4500,
    originalValue: 5500,
    savingsPercentage: 22,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    includedTreatments: ['1x Botox Anti-Wrinkle Rejuvenation', '2x Exosome Micro-needling Sessions', 'Medical Skincare Kit'],
    validityMonths: 6,
    description: 'Designed by Dr. Fatima Al-Zahrani for targeted pore tightening, wrinkle reduction, and cellular collagen renewal.'
  }
];

export const initialActivePackages: ActiveUserPackage[] = [
  {
    id: 'user_pack_1',
    packageId: 'pack_radiance',
    packageName: 'HydraGlow 4-Session Radiance Pack',
    totalSessions: 4,
    remainingSessions: 3,
    expiryDate: '2026-11-30',
    purchaseDate: '2026-05-15',
    qrCodeValue: 'REVEAL-RIYADH-HYDRA-8821'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt_1001',
    doctorId: 'doc_1',
    doctorName: 'Dr. Fatima Al-Zahrani',
    doctorSpecialty: 'Anti-Aging & Facial Contouring Specialist',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    clinicId: 'clinic_downtown',
    clinicName: 'Reveal Olaya Medical Center (Riyadh)',
    treatmentName: 'HydraFacial Platinum Glow',
    consultationType: 'Procedure',
    date: '2026-07-28',
    timeSlot: '11:00 AM',
    status: 'upcoming',
    fee: 850,
    paid: true,
    notes: 'Patient requested extra hydration focus for cheek area.',
    checkInStatus: 'pending'
  },
  {
    id: 'apt_1000',
    doctorId: 'doc_3',
    doctorName: 'Dr. Maha Al-Otaibi',
    doctorSpecialty: 'HydraFacial MD & Biostimulator Fillers',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    clinicId: 'clinic_downtown',
    clinicName: 'Reveal Olaya Medical Center (Riyadh)',
    treatmentName: 'Initial Skin Diagnostics & Consultation',
    consultationType: 'In-Clinic Consultation',
    date: '2026-06-12',
    timeSlot: '02:30 PM',
    status: 'completed',
    fee: 280,
    paid: true,
    notes: 'Skin diagnostics revealed early signs of barrier dryness. Recommended HydraGlow pack.',
    feedbackRating: 5,
    feedbackComment: 'Dr. Maha was wonderfully attentive and listened carefully to my concerns!'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay_9921',
    appointmentId: 'apt_1001',
    title: 'HydraFacial Platinum Glow Session',
    amount: 850,
    date: '2026-07-22',
    paymentMethod: 'Mada Card (مدى)',
    status: 'Paid',
    invoicePdfUrl: '#',
    receiptNumber: 'RC-INV-2026-9921'
  },
  {
    id: 'pay_9880',
    packageId: 'pack_radiance',
    title: 'HydraGlow 4-Session Radiance Pack',
    amount: 2800,
    date: '2026-05-15',
    paymentMethod: 'Apple Pay / STC Pay',
    status: 'Paid',
    invoicePdfUrl: '#',
    receiptNumber: 'RC-INV-2026-9880'
  }
];

export const initialMedicalReports: MedicalReport[] = [
  {
    id: 'rep_301',
    title: 'Comprehensive Skin Analysis & Diagnostic Report (MOH Certified)',
    type: 'Lab & Skin Analysis',
    doctorName: 'Dr. Maha Al-Otaibi',
    date: '2026-06-12',
    clinicName: 'Reveal Olaya Medical Center (Riyadh)',
    summary: 'VISIA 3D Skin Mapping performed under Saudi MOH guidelines. Epidermal moisture index at 68%. Minor UV hyperpigmentation on forehead. Rosacea vascularity mild on cheeks.',
    prescriptions: [
      { medication: 'Reveal Barrier Repair Ceramide Cream', dosage: 'Apply twice daily', instructions: 'Use gently after cleansing morning and night.' },
      { medication: 'Mineral Zinc Sunscreen SPF 50+', dosage: 'Every morning', instructions: 'Reapply if exposed to direct light for >2 hours.' }
    ],
    downloadPdfName: 'Reveal_Skin_Report_NouraAlQahtani.pdf',
    fileSize: '1.4 MB'
  },
  {
    id: 'rep_300',
    title: 'Dermatological Medical Certificate & Treatment Summary',
    type: 'Medical Certificate',
    doctorName: 'Dr. Fatima Al-Zahrani',
    date: '2026-04-18',
    clinicName: 'Reveal Olaya Medical Center (Riyadh)',
    summary: 'Ministry of Health certified completion of dermatological procedure. Patient underwent non-ablative laser skin toning with zero post-procedure complications.',
    downloadPdfName: 'Reveal_Medical_Certificate_2026.pdf',
    fileSize: '890 KB'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Upcoming Appointment Reminder',
    message: 'Your appointment with Dr. Fatima Al-Zahrani is scheduled for July 28 at 11:00 AM at Reveal Olaya Center (Riyadh). Remember to bring your digital check-in pass.',
    timestamp: '2 hours ago',
    type: 'reminder',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Payment Receipt Issued',
    message: 'Your payment of SAR 850.00 for HydraFacial Platinum Glow was successful. Invoice #RC-INV-2026-9921 is available.',
    timestamp: '1 day ago',
    type: 'payment',
    read: true
  },
  {
    id: 'notif_3',
    title: 'Summer Glow Double Points Special!',
    message: 'Earn 2x Loyalty Points on all Laser and HydraFacial bookings completed this week at Riyadh branches.',
    timestamp: '3 days ago',
    type: 'offer',
    read: true
  }
];

export const loyaltyRewards: LoyaltyReward[] = [
  {
    id: 'rew_1',
    title: 'SAR 200 Off Any Medical Facial',
    description: 'Use this voucher code during appointment booking or payment for an instant SAR 200 discount.',
    discountValue: 'SAR 200',
    code: 'REVEAL200OFF',
    category: 'Treatment Discount'
  },
  {
    id: 'rew_2',
    title: 'Free LED Phototherapy Session',
    description: 'Use this voucher code during appointment booking to add a complimentary 20-minute collagen-boosting LED light therapy session.',
    discountValue: 'Free SAR 350 Value',
    code: 'REVEAL-LED-FREE',
    category: 'VIP Perks'
  },
  {
    id: 'rew_3',
    title: 'SAR 500 Off Sculptra or Fillers',
    description: 'Use this voucher code during appointment booking or payment for SAR 500 off biostimulator or filler rejuvenation.',
    discountValue: 'SAR 500',
    code: 'REVEAL-RIYADH-500',
    category: 'Treatment Discount'
  }
];

export const giftCardsList: GiftCard[] = [
  {
    id: 'gc_101',
    code: 'REVEAL-GIFT-9921',
    amount: 1000,
    balance: 1000,
    recipientName: 'Hessa Al-Qahtani',
    recipientEmail: 'hessa.alqahtani@example.com',
    senderName: 'Noura Al-Qahtani',
    personalMessage: 'Happy Birthday Sis! Treat yourself to a glowing HydraFacial at Reveal Olaya Center Riyadh!',
    theme: 'rose_glow',
    purchaseDate: '2026-07-01',
    status: 'Active'
  }
];

// ----------------------------------------------------------------------
// CLINICAL STAFF & DOCTOR / NURSE MOCK DATA
// ----------------------------------------------------------------------

export const mockStaffProfiles: Record<string, UserProfile> = {
  doctor: {
    id: 'user_doc_fatima',
    role: 'doctor',
    staffId: 'DOC-8820',
    patientId: 'DOC-8820',
    fullName: 'Dr. Fatima Al-Zahrani',
    title: 'MD, Board-Certified Dermatologist',
    specialty: 'Aesthetic Dermatology & Laser Surgery',
    licenseNumber: 'MOH-KSA-994102',
    department: 'Dermatology & Facial Aesthetics',
    consultationRoom: 'Consultation Room 3 (Main Floor)',
    availabilityStatus: 'In Consultation',
    rating: 4.9,
    reviewCount: 312,
    email: 'dr.fatima.alzahrani@revealclinic.com',
    phone: '+966 11 480 3251',
    gender: 'female',
    dateOfBirth: '1984-03-22',
    nationality: 'Saudi Arabian',
    preferredClinicId: 'clinic_downtown',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    address: 'King Fahd Road, Olaya District, Riyadh, KSA',
    secondaryContact: '+966 50 998 1122',
    bloodGroup: 'O+',
    skinAllergies: [],
    medicalNotes: 'Attending physician for injectable aesthetics and high-intensity energy devices. Certified by Saudi MOH.',
    loyaltyPoints: 0,
    loyaltyTier: 'Diamond',
    referralCode: 'DR-FATIMA-REVEAL',
    accountCreated: '2022-01-10'
  },
  nurse: {
    id: 'user_nurse_amal',
    role: 'nurse',
    staffId: 'NUR-4109',
    patientId: 'NUR-4109',
    fullName: 'Amal Al-Harbi, BSN, RN',
    title: 'Lead Aesthetic Nurse Specialist',
    specialty: 'Medical Facials, Microneedling & Post-Care',
    licenseNumber: 'MOH-KSA-882109',
    department: 'Aesthetic Nursing & Recovery',
    consultationRoom: 'Treatment Suite B',
    availabilityStatus: 'Available',
    email: 'amal.alharbi@revealclinic.com',
    phone: '+966 11 480 3252',
    gender: 'female',
    dateOfBirth: '1990-11-05',
    nationality: 'Saudi Arabian',
    preferredClinicId: 'clinic_downtown',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300',
    address: 'King Fahd Road, Olaya District, Riyadh, KSA',
    secondaryContact: '+966 50 334 9988',
    bloodGroup: 'A+',
    skinAllergies: [],
    medicalNotes: 'Specialized in RF Microneedling, Chemical Peels, and pre/post treatment patient care.',
    loyaltyPoints: 0,
    loyaltyTier: 'Diamond',
    referralCode: 'NURSE-AMAL-REVEAL',
    accountCreated: '2023-04-15'
  },
  coordinator: {
    id: 'user_coord_yousef',
    role: 'coordinator',
    staffId: 'COORD-102',
    patientId: 'COORD-102',
    fullName: 'Yousef Al-Mutairi',
    title: 'Senior Clinical Coordinator',
    specialty: 'Patient Flow & Treatment Packages',
    licenseNumber: 'MOH-KSA-0012',
    department: 'Clinic Reception & Front Desk',
    consultationRoom: 'Front Desk / Concierge Pod 1',
    availabilityStatus: 'Available',
    email: 'yousef.almutairi@revealclinic.com',
    phone: '+966 11 480 3253',
    gender: 'other',
    dateOfBirth: '1988-08-19',
    nationality: 'Saudi Arabian',
    preferredClinicId: 'clinic_downtown',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    address: 'King Fahd Road, Olaya District, Riyadh, KSA',
    secondaryContact: '+966 50 221 8899',
    bloodGroup: 'B+',
    skinAllergies: [],
    medicalNotes: 'Oversees digital check-ins, package redemption, and daily doctor schedules.',
    loyaltyPoints: 0,
    loyaltyTier: 'Platinum',
    referralCode: 'COORD-YOUSEF',
    accountCreated: '2023-09-01'
  }
};

export const initialClinicalSchedule: ClinicalScheduleItem[] = [
  {
    id: 'cs_101',
    patientId: 'RC-99841',
    patientName: 'Noura Al-Qahtani',
    patientAge: 32,
    patientGender: 'female',
    patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    doctorId: 'doc_1',
    doctorName: 'Dr. Fatima Al-Zahrani',
    treatmentName: 'HydraFacial Elite + LED Therapy',
    consultationType: 'Procedure',
    date: 'Today',
    timeSlot: '09:30 AM',
    durationMinutes: 45,
    status: 'in_consultation',
    roomNumber: 'Treatment Suite A',
    allergyAlerts: ['Slight sensitivity to Salicylic Acid'],
    visitReason: 'Quarterly skin maintenance & hydration glow booster.',
    vitalSigns: { bp: '118/76', pulse: 72, skinType: 'Fitzpatrick Type II' },
    notes: 'Patient completed digital check-in. Pre-treatment photos captured in app.',
    paymentStatus: 'Paid',
    queueNumber: 1
  },
  {
    id: 'cs_102',
    patientId: 'RC-20410',
    patientName: 'Reem Al-Anazi',
    patientAge: 29,
    patientGender: 'female',
    patientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    doctorId: 'doc_1',
    doctorName: 'Dr. Fatima Al-Zahrani',
    treatmentName: 'Botox Cosmetic (Glabellar & Crow\'s Feet)',
    consultationType: 'In-Clinic Consultation',
    date: 'Today',
    timeSlot: '10:30 AM',
    durationMinutes: 30,
    status: 'checked_in',
    roomNumber: 'Waiting Room / Pod 2',
    allergyAlerts: ['Lidocaine hypersensitivity (Use ice cooling)'],
    visitReason: 'Dynamic forehead lines touch-up before upcoming photo shoot.',
    vitalSigns: { bp: '122/80', pulse: 68, skinType: 'Fitzpatrick Type I' },
    notes: 'Numbing ointment skipped per patient request. Ice pack requested.',
    paymentStatus: 'Covered by Package',
    queueNumber: 2
  },
  {
    id: 'cs_103',
    patientId: 'RC-50219',
    patientName: 'Abdulrahman Al-Suwaidi',
    patientAge: 41,
    patientGender: 'male',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    doctorId: 'doc_1',
    doctorName: 'Dr. Fatima Al-Zahrani',
    treatmentName: 'Lutronic Clarity II Laser Hair Removal',
    consultationType: 'Procedure',
    date: 'Today',
    timeSlot: '11:15 AM',
    durationMinutes: 45,
    status: 'scheduled',
    roomNumber: 'Laser Room 4',
    allergyAlerts: [],
    visitReason: 'Session 3 of 5 Full Beard & Neck outline laser treatment.',
    vitalSigns: { skinType: 'Fitzpatrick Type III' },
    notes: 'Requires 1064nm YAG laser setting due to dense coarse hair follicle density.',
    paymentStatus: 'Covered by Package',
    queueNumber: 3
  },
  {
    id: 'cs_104',
    patientId: 'RV-2094',
    patientName: 'Omar Al-Harthi',
    patientAge: 38,
    patientGender: 'male',
    patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    doctorId: 'doc_2',
    doctorName: 'Dr. Faisal Al-Dosari',
    treatmentName: 'PRP Hair Restoration & Scalp Microneedling',
    consultationType: 'In-Clinic Consultation',
    date: 'Today',
    timeSlot: '01:30 PM',
    durationMinutes: 60,
    status: 'scheduled',
    roomNumber: 'Procedure Room 2',
    allergyAlerts: ['Latex Allergy (Use Nitrile Gloves)'],
    visitReason: 'Scalp PRP maintenance session 2/4.',
    vitalSigns: { bp: '124/82', pulse: 75 },
    notes: 'Centrifuge tube kit prepped by Nurse Amal. Top-up numb cream applied at 1:00 PM.',
    paymentStatus: 'Paid',
    queueNumber: 4
  },
  {
    id: 'cs_105',
    patientId: 'RC-88120',
    patientName: 'Lama Al-Rashidi',
    patientAge: 35,
    patientGender: 'female',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    doctorId: 'doc_1',
    doctorName: 'Dr. Fatima Al-Zahrani',
    treatmentName: 'Juvederm Voluma Cheek Augmentation',
    consultationType: 'Procedure',
    date: 'Today',
    timeSlot: '02:30 PM',
    durationMinutes: 45,
    status: 'scheduled',
    roomNumber: 'Consultation Room 3',
    allergyAlerts: [],
    visitReason: 'Mid-face volume loss rejuvenation (1.0mL per cheek).',
    vitalSigns: { bp: '116/74', pulse: 70, skinType: 'Fitzpatrick Type II' },
    notes: '27G Cannula requested. Micro-droplet bolus technique.',
    paymentStatus: 'Pending Deposit',
    queueNumber: 5
  },
  {
    id: 'cs_106',
    patientId: 'RC-11092',
    patientName: 'Jana Al-Amri',
    patientAge: 27,
    patientGender: 'female',
    patientAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    doctorId: 'doc_1',
    doctorName: 'Dr. Fatima Al-Zahrani',
    treatmentName: 'Post-Laser Follow-Up Check',
    consultationType: 'Follow-up Checkup',
    date: 'Today',
    timeSlot: '03:45 PM',
    durationMinutes: 20,
    status: 'completed',
    roomNumber: 'Consultation Room 1',
    allergyAlerts: [],
    visitReason: '7-day post Sciton BBL redness check.',
    notes: 'Erythema completely resolved. Patient instructed on daily SPF 50 sunscreen.',
    paymentStatus: 'Paid',
    queueNumber: 6
  }
];

export const initialClinicalPatients: ClinicalPatientRecord[] = [
  {
    id: 'patient_rec_1',
    patientId: 'RC-99841',
    fullName: 'Noura Al-Qahtani',
    age: 32,
    gender: 'female',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'O+',
    allergies: ['Salicylic Acid (Mild erythema)', 'Aspirin caution'],
    skinType: 'Fitzpatrick Type II (Combination / Sensitive)',
    medicalHistoryNotes: 'History of mild rosacea on bilateral cheeks. Previously tolerated HA dermal fillers well without granulomas.',
    importantNotes: [
      'Prefers topical numbing for at least 20 minutes prior to injectables.',
      'Always prefers evening follow-up calls or SMS reminders.',
      'Active user of Reveal Clinic Vitamin C & Niacinamide Serum.'
    ],
    registeredBranch: 'Reveal Olaya Medical Center (Riyadh)',
    activePackagesCount: 2,
    previousVisits: [
      {
        id: 'vis_881',
        date: '2026-05-12',
        doctorName: 'Dr. Fatima Al-Zahrani',
        clinicBranch: 'Olaya Medical Center',
        treatmentName: 'HydraFacial Elite Session',
        clinicalNotes: 'Deep pore extraction and vortex infusion of hyaluronic acid. Zero downtime reported.',
        prescriptions: [],
        reportPdfUrl: 'Reveal_Skin_Analysis_Noura_May2026.pdf'
      },
      {
        id: 'vis_712',
        date: '2026-01-18',
        doctorName: 'Dr. Fatima Al-Zahrani',
        clinicBranch: 'Olaya Medical Center',
        treatmentName: 'Juvederm Ultra Smile (0.55mL Lips)',
        clinicalNotes: 'Subtle vermillion border enhancement. Symmetry achieved using 30G needle.',
        prescriptions: []
      }
    ],
    treatmentHistory: [
      {
        id: 'th_1',
        treatmentName: 'HydraFacial Elite 5-Session Package',
        packageName: 'HydraFacial Glow Package',
        startDate: '2026-01-15',
        completedSessions: 3,
        totalSessions: 5,
        status: 'Active',
        lastSessionDate: '2026-05-12'
      },
      {
        id: 'th_2',
        treatmentName: 'Lutronic Clarity Laser Hair Removal (Face)',
        packageName: 'Laser Smooth Package',
        startDate: '2025-09-10',
        completedSessions: 5,
        totalSessions: 5,
        status: 'Completed',
        lastSessionDate: '2026-02-20'
      }
    ],
    reports: [
      {
        id: 'rep_101',
        title: '3D VISIA Skin Analysis Report',
        type: 'Lab & Skin Analysis',
        doctorName: 'Dr. Fatima Al-Zahrani',
        date: '2026-05-12',
        clinicName: 'Reveal Olaya Medical Center (Riyadh)',
        summary: 'Pore score: 88th percentile. UV spot damage score improved by 14% compared to Jan 2026 baseline.',
        downloadPdfName: 'VISIA_Analysis_Noura.pdf',
        fileSize: '2.4 MB'
      }
    ]
  },
  {
    id: 'patient_rec_2',
    patientId: 'RC-20410',
    fullName: 'Reem Al-Anazi',
    age: 29,
    gender: 'female',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'A+',
    allergies: ['Lidocaine (Topical & Local Injection)', 'Latex'],
    skinType: 'Fitzpatrick Type I (Dry / Fair)',
    medicalHistoryNotes: 'Lidocaine hypersensitivity causes vasovagal lightheadedness. Substitute with ice cooling or prilocaine.',
    importantNotes: [
      'STRICT WARNING: Do NOT apply topical Lidocaine numbing cream.',
      'Always utilize ice packs for pre-injection desensitization.',
      'Prefers Dr. Fatima Al-Zahrani for all injectable procedures.'
    ],
    registeredBranch: 'Reveal Olaya Medical Center (Riyadh)',
    activePackagesCount: 1,
    previousVisits: [
      {
        id: 'vis_502',
        date: '2026-03-01',
        doctorName: 'Dr. Fatima Al-Zahrani',
        clinicBranch: 'Olaya Medical Center',
        treatmentName: 'Botox Glabellar (20 Units)',
        clinicalNotes: 'Desensitized with ice pack only. 20 Units Botulinum Toxin Type A injected across 5 points.',
        prescriptions: []
      }
    ],
    treatmentHistory: [
      {
        id: 'th_3',
        treatmentName: 'Botox Maintenance Subscription',
        startDate: '2025-11-01',
        completedSessions: 2,
        totalSessions: 4,
        status: 'Active',
        lastSessionDate: '2026-03-01'
      }
    ],
    reports: []
  },
  {
    id: 'patient_rec_3',
    patientId: 'RV-2094',
    fullName: 'Omar Al-Harthi',
    age: 38,
    gender: 'male',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'B+',
    allergies: ['Latex gloves'],
    skinType: 'Fitzpatrick Type II (Oily / Thick)',
    medicalHistoryNotes: 'Androgenetic alopecia Norwood Scale III. Undergoing combination Scalp PRP & Microneedling therapy.',
    importantNotes: [
      'Requires Nitrile gloves during procedures.',
      'Responded very well to PRP treatment cycle 1.'
    ],
    registeredBranch: 'Reveal Al Nakheel Aesthetic Hub (Riyadh)',
    activePackagesCount: 1,
    previousVisits: [
      {
        id: 'vis_301',
        date: '2026-04-10',
        doctorName: 'Dr. Faisal Al-Dosari',
        clinicBranch: 'Al Nakheel Aesthetic Hub',
        treatmentName: 'PRP Scalp Injection Session 1',
        clinicalNotes: '10mL autologous blood drawn. 4mL PRP harvested and injected into frontal hairline at 1.5mm depth.',
        prescriptions: [{ medication: 'Ketoconazole 2% Shampoo', dosage: 'Use 3x weekly', frequency: 'Ongoing' }]
      }
    ],
    treatmentHistory: [
      {
        id: 'th_4',
        treatmentName: 'PRP Hair Restoration 4-Session Pack',
        startDate: '2026-04-10',
        completedSessions: 1,
        totalSessions: 4,
        status: 'Active',
        lastSessionDate: '2026-04-10'
      }
    ],
    reports: []
  },
  {
    id: 'patient_rec_4',
    patientId: 'RC-50219',
    fullName: 'Abdulrahman Al-Suwaidi',
    age: 41,
    gender: 'male',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'A+',
    allergies: [],
    skinType: 'Fitzpatrick Type III',
    medicalHistoryNotes: 'Dense, coarse facial and neck hair follicle density. Requires 1064nm YAG laser setting for effective full beard & neck outline treatment.',
    importantNotes: [
      'Requires 1064nm YAG laser setting due to dense coarse hair follicle density.'
    ],
    registeredBranch: 'Reveal Olaya Medical Center (Riyadh)',
    activePackagesCount: 1,
    previousVisits: [
      {
        id: 'vis_601',
        date: '2026-06-15',
        doctorName: 'Dr. Fatima Al-Zahrani',
        clinicBranch: 'Olaya Medical Center',
        treatmentName: 'Lutronic Clarity II Laser Hair Removal (Session 2)',
        clinicalNotes: 'Full Beard & Neck outline, session 2 of 5. Good tolerance, mild post-treatment erythema resolved within hours.',
        prescriptions: []
      }
    ],
    treatmentHistory: [
      {
        id: 'th_5',
        treatmentName: 'Full Beard & Neck Laser Hair Removal (5-Session Package)',
        startDate: '2026-04-20',
        completedSessions: 2,
        totalSessions: 5,
        status: 'Active',
        lastSessionDate: '2026-06-15'
      }
    ],
    reports: []
  },
  {
    id: 'patient_rec_5',
    patientId: 'RC-88120',
    fullName: 'Lama Al-Rashidi',
    age: 35,
    gender: 'female',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'AB+',
    allergies: [],
    skinType: 'Fitzpatrick Type II',
    medicalHistoryNotes: 'Mid-face volume loss consult. No prior dermal filler history at this clinic.',
    importantNotes: [
      'Prefers 27G cannula and micro-droplet bolus injection technique.'
    ],
    registeredBranch: 'Reveal Olaya Medical Center (Riyadh)',
    activePackagesCount: 0,
    previousVisits: [],
    treatmentHistory: [],
    reports: []
  },
  {
    id: 'patient_rec_6',
    patientId: 'RC-11092',
    fullName: 'Jana Al-Amri',
    age: 27,
    gender: 'female',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'B+',
    allergies: [],
    skinType: 'Fitzpatrick Type III',
    medicalHistoryNotes: 'Completed Sciton BBL photorejuvenation course. 7-day post-treatment check showed erythema fully resolved.',
    importantNotes: [
      'Instructed on daily SPF 50 broad-spectrum sunscreen post-laser.'
    ],
    registeredBranch: 'Reveal Olaya Medical Center (Riyadh)',
    activePackagesCount: 0,
    previousVisits: [
      {
        id: 'vis_602',
        date: '2026-07-28',
        doctorName: 'Dr. Fatima Al-Zahrani',
        clinicBranch: 'Olaya Medical Center',
        treatmentName: 'Sciton BBL Photorejuvenation',
        clinicalNotes: 'Broad-band light photorejuvenation for sun damage and redness. Well tolerated, mild expected post-treatment erythema.',
        prescriptions: []
      }
    ],
    treatmentHistory: [
      {
        id: 'th_6',
        treatmentName: 'Sciton BBL Photorejuvenation',
        startDate: '2026-07-28',
        completedSessions: 1,
        totalSessions: 1,
        status: 'Completed',
        lastSessionDate: '2026-07-28'
      }
    ],
    reports: []
  }
];

export const initialTreatmentSessions: TreatmentSession[] = [
  {
    id: 'ts_2026_01',
    appointmentId: 'cs_101',
    patientId: 'RC-99841',
    patientName: 'Noura Al-Qahtani',
    patientAge: 32,
    patientGender: 'female',
    patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    treatmentName: 'HydraFacial Elite + LED Therapy',
    doctorName: 'Dr. Fatima Al-Zahrani',
    nurseName: 'Amal Al-Harbi, BSN, RN',
    roomNumber: 'Treatment Suite A',
    startTime: '09:30 AM',
    status: 'In Progress',
    progressPercent: 55,
    machinesUsed: [
      {
        id: 'mach_hf_01',
        name: 'HydraFacial Syndeo Elite System',
        model: 'Syndeo Gen-3',
        serialNumber: 'HF-9982-CA',
        lastSanitized: 'Today, 08:45 AM'
      },
      {
        id: 'mach_led_02',
        name: 'LightStim Pro LED Panel (Red 630nm)',
        model: 'LightStim Medical',
        serialNumber: 'LS-4019-B',
        lastSanitized: 'Today, 09:00 AM'
      }
    ],
    consumablesUsed: [
      {
        id: 'cons_1',
        name: 'HydraFacial Activ-4 Cleansing Serum 30mL',
        category: 'Skincare Gel',
        quantity: 1,
        unit: 'Vial',
        batchNumber: 'LOT-HF2026-9021'
      },
      {
        id: 'cons_2',
        name: 'GlySal Peel 15% Tip & Solution',
        category: 'Laser Tip',
        quantity: 1,
        unit: 'Tip Pack',
        batchNumber: 'LOT-GLY-8841'
      },
      {
        id: 'cons_3',
        name: 'Antioxidant + Hyaluronic Acid Infusion Vials',
        category: 'Skincare Gel',
        quantity: 1,
        unit: 'Ampoule',
        batchNumber: 'LOT-HA-3310'
      }
    ],
    itemsIssued: [
      {
        id: 'iss_1',
        name: 'Reveal Post-Procedure Soothing Calming Cream (50g)',
        quantity: 1,
        instructions: 'Apply thin layer morning and night for 3 days post-facial.',
        issuedAt: 'Today, 09:40 AM',
        status: 'Issued'
      },
      {
        id: 'iss_2',
        name: 'Mineral Tinted Sunscreen SPF 50 Broad Spectrum',
        quantity: 1,
        instructions: 'Apply daily 15 minutes before sun exposure.',
        issuedAt: 'Today, 09:40 AM',
        status: 'Issued'
      }
    ],
    itemsRequested: [
      {
        id: 'req_1',
        name: 'Sterile Hydrogel Cooling Mask Packets',
        quantity: 2,
        urgency: 'Normal',
        requestedAt: 'Today, 09:35 AM',
        status: 'Approved'
      }
    ],
    clinicalNotes: 'Vortex exfoliation completed smoothly with GlySal 15%. Extracted blackheads around nasal bridge. Patient skin glowing with zero petechiae.',
    procedureSummary: 'Performed 4-step HydraFacial protocol followed by 15-minute red light LED phototherapy for collagen stimulation.',
    followUpDays: 14,
    paymentIntegrationStatus: {
      gateway: 'Stripe',
      amount: 280,
      status: 'Paid',
      transactionRef: 'ch_3N82x9Lkd0912'
    }
  },
  {
    id: 'ts_2026_02',
    appointmentId: 'cs_102',
    patientId: 'RC-20410',
    patientName: 'Reem Al-Anazi',
    patientAge: 29,
    patientGender: 'female',
    patientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    treatmentName: 'Botox Cosmetic (Glabellar & Crow\'s Feet)',
    doctorName: 'Dr. Fatima Al-Zahrani',
    nurseName: 'Amal Al-Harbi, BSN, RN',
    roomNumber: 'Waiting Room / Pod 2',
    startTime: '10:30 AM',
    status: 'Ready for Procedure',
    progressPercent: 0,
    machinesUsed: [],
    consumablesUsed: [
      {
        id: 'cons_botox_1',
        name: 'Botox Cosmetic (OnabotulinumtoxinA) 100 Unit Vial',
        category: 'Toxin',
        quantity: 1,
        unit: 'Vial (Reconstituted 2.5mL)',
        batchNumber: 'LOT-ALLERGAN-99210'
      },
      {
        id: 'cons_botox_2',
        name: 'BD Ultra-Fine Insulin Syringes 31G 0.3mL',
        category: 'Disposables',
        quantity: 3,
        unit: 'Syringes',
        batchNumber: 'LOT-BD-10293'
      }
    ],
    itemsIssued: [],
    itemsRequested: [
      {
        id: 'req_botox_1',
        name: 'Cryo-Cooling Gel Ice Packs',
        quantity: 2,
        urgency: 'Urgent',
        requestedAt: 'Today, 10:15 AM',
        status: 'Delivered'
      }
    ],
    clinicalNotes: 'Patient has Lidocaine allergy flag. Prepped with ice pack application for 5 minutes prior to marking injection sites.',
    procedureSummary: 'Pending doctor injection. Reconstituted 24 units Botox ready in tray.',
    followUpDays: 14,
    paymentIntegrationStatus: {
      gateway: 'Tabby Installments',
      amount: 350,
      status: 'Approved',
      transactionRef: 'tabby_inst_88201'
    }
  }
];

export const initialStaffNotifications: StaffNotification[] = [
  {
    id: 'staff_notif_1',
    title: 'Patient Checked In',
    message: 'Reem Al-Anazi (RC-20410) has completed digital check-in for 10:30 AM Botox procedure. Allergy alert: Lidocaine.',
    timestamp: '5 mins ago',
    type: 'patient_checked_in',
    read: false,
    patientName: 'Reem Al-Anazi',
    patientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    appointmentId: 'cs_102',
    urgency: 'high'
  },
  {
    id: 'staff_notif_2',
    title: 'Ready for Procedure',
    message: 'Treatment Suite A is sanitized and ready for Noura Al-Qahtani (HydraFacial + LED Therapy).',
    timestamp: '25 mins ago',
    type: 'patient_ready_for_procedure',
    read: false,
    patientName: 'Noura Al-Qahtani',
    patientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    appointmentId: 'cs_101',
    urgency: 'normal'
  },
  {
    id: 'staff_notif_3',
    title: 'New Appointment Booked',
    message: 'Abdulrahman Al-Suwaidi booked Lutronic Clarity II Laser session for Today at 11:15 AM.',
    timestamp: '1 hour ago',
    type: 'new_appointment',
    read: true,
    patientName: 'Abdulrahman Al-Suwaidi',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    appointmentId: 'cs_103'
  },
  {
    id: 'staff_notif_4',
    title: 'Follow-Up Reminder',
    message: 'Jana Al-Amri 7-day post Sciton BBL follow-up scheduled at 03:45 PM.',
    timestamp: '2 hours ago',
    type: 'followup_reminder',
    read: true,
    patientName: 'Jana Al-Amri',
    patientAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'staff_notif_5',
    title: 'Walk-In Patient Registered',
    message: 'Nadia Mansoor registered as walk-in for Consultation with Dr. Fatima Al-Zahrani.',
    timestamp: '15 mins ago',
    type: 'check_in',
    read: false,
    patientName: 'Nadia Mansoor',
    urgency: 'high'
  },
  {
    id: 'staff_notif_6',
    title: 'Appointment Cancelled',
    message: 'Bandar Al-Subaie cancelled appointment CS-104 due to personal emergency.',
    timestamp: '30 mins ago',
    type: 'rescheduled',
    read: false,
    patientName: 'Bandar Al-Subaie',
    urgency: 'normal'
  }
];

export const initialWalkInQueue: WalkInPatient[] = [
  {
    id: 'wk_1',
    patientName: 'Nadia Mansoor',
    patientPhone: '+966 55 210 4477',
    assignedDoctorId: 'doc_1',
    assignedDoctorName: 'Dr. Fatima Al-Zahrani',
    requestedService: 'Skin Consultation & Analysis',
    arrivalTime: '09:45 AM',
    estimatedWaitMinutes: 15,
    status: 'Waiting',
    queueNumber: 101,
    notes: 'Requested immediate consultation for mild eczema flare-up.'
  },
  {
    id: 'wk_2',
    patientName: 'Tariq Al-Mansouri',
    patientPhone: '+966 54 887 2201',
    assignedDoctorId: 'doc_2',
    assignedDoctorName: 'Dr. Faisal Al-Dosari',
    requestedService: 'Laser Hair Removal Touch-Up',
    arrivalTime: '10:15 AM',
    estimatedWaitMinutes: 25,
    status: 'Waiting',
    queueNumber: 102,
    notes: 'Existing client, package session 3 of 6.'
  }
];

