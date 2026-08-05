import { ClinicalScheduleItem } from '../types';

// Falls back to matching a returning patient by exact name against clinical
// schedule history when staff leave the Patient File # blank, so the same
// person doesn't end up with a second, duplicate patient record.
export function findPatientIdByName(schedule: ClinicalScheduleItem[], fullName: string): string | undefined {
  const normalized = fullName.trim().toLowerCase();
  if (!normalized) return undefined;
  return schedule.find((item) => item.patientName.trim().toLowerCase() === normalized)?.patientId;
}
