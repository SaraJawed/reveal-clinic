import { ChatMessage, Doctor } from '../types';

const normalizeDoctorName = (name: string): string => name.toLowerCase().replace(/^dr\.?\s*/, '').trim();

// Finds a doctor mentioned by name (or surname) in free-form chat text, so the
// AI assistant can surface an actionable booking card when the conversation
// references one of the clinic's real doctors.
export function findMentionedDoctor(text: string, doctors: Doctor[]): Doctor | undefined {
  const lower = text.toLowerCase();
  return doctors.find((doctor) => {
    const fullName = normalizeDoctorName(doctor.name);
    if (lower.includes(fullName)) return true;
    const surname = fullName.split(' ').slice(1).join(' ');
    return surname.length > 3 && lower.includes(surname);
  });
}

// Scans the most recent user + assistant exchange for a doctor mention.
export function findDoctorInLatestExchange(messages: ChatMessage[], doctors: Doctor[]): Doctor | undefined {
  if (messages.length === 0) return undefined;
  const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
  const lastAssistant = [...messages].reverse().find((m) => m.sender === 'assistant');
  const combined = `${lastUser?.text || ''} ${lastAssistant?.text || ''}`;
  return findMentionedDoctor(combined, doctors);
}
