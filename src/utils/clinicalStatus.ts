import { ClinicalAppointmentStatus } from '../types';

// Single source of truth for status colors so the Coordinator (reception)
// and Doctor/Nurse portals always render the same status the same color,
// since both consume the same shared clinicalSchedule state.
export const CLINICAL_STATUS_BADGE_CLASS: Record<ClinicalAppointmentStatus, string> = {
  scheduled: 'bg-slate-100 text-slate-700 border-slate-200',
  checked_in: 'bg-amber-100 text-amber-800 border-amber-200',
  in_consultation: 'bg-blue-100 text-[#4F8EF7] border-blue-200',
  procedure: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
};

export const CLINICAL_STATUS_DOT_CLASS: Record<ClinicalAppointmentStatus, string> = {
  scheduled: 'bg-slate-400',
  checked_in: 'bg-amber-400',
  in_consultation: 'bg-blue-500',
  procedure: 'bg-purple-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-rose-500'
};

// Light background + border tint for a whole patient card, so status is
// visible at a glance without the card feeling as loud as the badge color.
export const CLINICAL_STATUS_CARD_CLASS: Record<ClinicalAppointmentStatus, string> = {
  scheduled: 'bg-white border-slate-100',
  checked_in: 'bg-amber-50/50 border-amber-100',
  in_consultation: 'bg-blue-50/50 border-blue-100',
  procedure: 'bg-purple-50/50 border-purple-100',
  completed: 'bg-emerald-50/40 border-emerald-100',
  cancelled: 'bg-rose-50/40 border-rose-100'
};
