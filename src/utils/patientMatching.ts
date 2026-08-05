import { ClinicalScheduleItem, ClinicalPatientRecord } from '../types';

// Falls back to matching a returning patient by exact name against clinical
// schedule history when staff leave the Patient File # blank, so the same
// person doesn't end up with a second, duplicate patient record.
export function findPatientIdByName(schedule: ClinicalScheduleItem[], fullName: string): string | undefined {
  const normalized = fullName.trim().toLowerCase();
  if (!normalized) return undefined;
  return schedule.find((item) => item.patientName.trim().toLowerCase() === normalized)?.patientId;
}

// Every booking/walk-in path upserts a ClinicalPatientRecord as it happens,
// but that's a best-effort write, not a guarantee -- older or edge-case
// schedule entries can still reference a patientId with no record. This is
// the safety net: it guarantees the Patients list always includes everyone
// who appears anywhere in the schedule, synthesizing a minimal placeholder
// record from the schedule item's own denormalized patient fields for
// anyone still missing one, so "Today's Total" and the Patients list can
// never silently drift apart.
export function mergeScheduleOnlyPatients(
  patients: ClinicalPatientRecord[],
  schedule: ClinicalScheduleItem[]
): ClinicalPatientRecord[] {
  const known = new Set(patients.map((p) => p.patientId));
  const synthesized: ClinicalPatientRecord[] = [];
  const seen = new Set<string>();

  schedule.forEach((item) => {
    if (known.has(item.patientId) || seen.has(item.patientId)) return;
    seen.add(item.patientId);
    synthesized.push({
      id: `cp_${item.patientId}`,
      patientId: item.patientId,
      fullName: item.patientName,
      age: item.patientAge,
      gender: item.patientGender,
      avatarUrl: item.patientAvatar,
      bloodGroup: 'Unknown',
      allergies: item.allergyAlerts,
      skinType: 'Not yet assessed',
      medicalHistoryNotes: item.notes || '',
      importantNotes: [],
      previousVisits: [],
      treatmentHistory: [],
      reports: [],
      activePackagesCount: 0,
      registeredBranch: ''
    });
  });

  return [...patients, ...synthesized];
}
