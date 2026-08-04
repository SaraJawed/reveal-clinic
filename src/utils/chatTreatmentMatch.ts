import { ChatMessage, Doctor, TreatmentService, TreatmentPackage } from '../types';
import { getDoctorsForTreatment } from './doctorMatching';

export interface MatchedTreatment {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  durationMinutes?: number;
  totalSessions?: number;
  isPackage: boolean;
}

export interface ChatTreatmentSuggestion {
  treatment: MatchedTreatment;
  doctors: Doctor[];
}

// Generic conversational words that would otherwise cause false-positive
// matches against short treatment/category names.
const TREATMENT_STOPWORDS = new Set([
  'doctor', 'doctors', 'dermatologist', 'appointment', 'appointments', 'booking', 'book',
  'clinic', 'please', 'would', 'could', 'schedule', 'consultation', 'treatment', 'treatments',
  'session', 'sessions', 'available', 'today', 'tomorrow', 'want', 'like'
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length >= 4 && !TREATMENT_STOPWORDS.has(word));
}

function suggestionFromTreatment(treatment: TreatmentService, doctors: Doctor[]): ChatTreatmentSuggestion {
  return {
    treatment: {
      id: treatment.id,
      name: treatment.name,
      categoryName: treatment.categoryName,
      price: treatment.price,
      durationMinutes: treatment.durationMinutes,
      isPackage: false
    },
    doctors: getDoctorsForTreatment(doctors, [treatment.name, treatment.categoryName])
  };
}

function suggestionFromPackage(pack: TreatmentPackage, doctors: Doctor[]): ChatTreatmentSuggestion {
  return {
    treatment: {
      id: pack.id,
      name: pack.name,
      categoryName: 'Package',
      price: pack.price,
      totalSessions: pack.totalSessions,
      isPackage: true
    },
    doctors: getDoctorsForTreatment(doctors, [pack.name, pack.description, ...pack.includedTreatments])
  };
}

// Scans free-form chat text for a mention of a specific treatment or package
// from the clinic's catalog, so the AI assistant can suggest matching
// doctors and a treatment-specific fee instead of a generic consultation.
export function findTreatmentSuggestion(
  text: string,
  treatments: TreatmentService[],
  packages: TreatmentPackage[],
  doctors: Doctor[]
): ChatTreatmentSuggestion | undefined {
  const lower = text.toLowerCase();

  const exactTreatment = treatments.find((t) => lower.includes(t.name.toLowerCase()));
  if (exactTreatment) return suggestionFromTreatment(exactTreatment, doctors);

  const exactPackage = packages.find((p) => lower.includes(p.name.toLowerCase()));
  if (exactPackage) return suggestionFromPackage(exactPackage, doctors);

  const keywords = extractKeywords(text);
  if (keywords.length === 0) return undefined;

  const treatmentMatch = treatments.find((t) => {
    const haystack = `${t.name} ${t.categoryName}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  });
  if (treatmentMatch) return suggestionFromTreatment(treatmentMatch, doctors);

  const packageMatch = packages.find((p) => {
    const haystack = `${p.name} ${p.description} ${p.includedTreatments.join(' ')}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  });
  if (packageMatch) return suggestionFromPackage(packageMatch, doctors);

  return undefined;
}

// Scans only the most recent user message for a treatment mention. Assistant
// replies are deliberately excluded — their generic marketing/fallback copy
// (e.g. "...or active package promotions") can accidentally collide with
// keyword matching against treatment/package descriptions.
export function findTreatmentSuggestionInLatestUserMessage(
  messages: ChatMessage[],
  treatments: TreatmentService[],
  packages: TreatmentPackage[],
  doctors: Doctor[]
): ChatTreatmentSuggestion | undefined {
  const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
  if (!lastUser) return undefined;
  return findTreatmentSuggestion(lastUser.text, treatments, packages, doctors);
}
