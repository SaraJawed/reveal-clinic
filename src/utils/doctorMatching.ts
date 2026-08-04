import { Doctor } from '../types';

// Generic dermatology-context words that appear across most specialties/
// categories and would otherwise cause false-positive matches.
const MATCH_STOPWORDS = new Set([
  'medical',
  'aesthetics',
  'treatment',
  'treatments',
  'therapy',
  'session',
  'sessions'
]);

function extractMatchKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length >= 5 && !MATCH_STOPWORDS.has(word));
}

// Narrows a doctor list down to whoever's specialty (or name, for cases
// where a package explicitly credits a doctor) matches the given treatment/
// package text. Falls back to the full list when nothing matches, so
// booking is never blocked by an imperfect keyword match.
export function getDoctorsForTreatment(doctors: Doctor[], searchTexts: string[]): Doctor[] {
  const keywords = searchTexts.flatMap(extractMatchKeywords);
  if (keywords.length === 0) return doctors;

  const matches = doctors.filter((doc) => {
    const haystack = `${doc.specialty} ${doc.name}`.toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  });

  return matches.length > 0 ? matches : doctors;
}
