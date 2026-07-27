import { GoogleGenAI } from "@google/genai";

export interface ChatHistoryItem {
  sender: string;
  text: string;
}

export interface ChatReply {
  text: string;
  fallback?: boolean;
}

const SYSTEM_INSTRUCTION = `
You are 'Reveal Assistant', the intelligent, polite, and knowledgeable virtual consultant for Reveal Clinic — a premier luxury aesthetic, medical dermatology, and wellness clinic.

Key Info about Reveal Clinic:
- Locations: Downtown Medical Center (Building 4, Level 2), Marina Aesthetic Hub (Tower A), and Palm Health Suite (East Wing).
- Working Hours: Monday to Saturday 9:00 AM – 9:00 PM. Closed on Sundays. Emergency helpline: +1 (800) 738-325.
- Specialties: Advanced Dermatology, Laser Hair Removal & Skin Resurfacing, Botox & Dermal Fillers, HydraFacial MD, Anti-Aging Collagen Boost, Body Contouring & CoolSculpting.
- Top Doctors:
  * Dr. Elena Rostova, MD (Lead Dermatologist & Anti-Aging Specialist - 14 yrs experience)
  * Dr. Marcus Vance, MD (Laser & Aesthetic Surgery - 11 yrs experience)
  * Dr. Sophia Chen, MD (Cosmetic Dermatology & Facial Sculpting - 9 yrs experience)
  * Dr. Tariq Al-Mansoor, MD (Clinical Dermatology & Skin Oncology - 16 yrs experience)
- Features: Patient PWA with Digital Check-In, Instant Appointment Scheduling, Online Payment with Apple Pay & Installments, Treatment Session Progress Tracking, PDF Medical Reports, Loyalty Points Rewards (1 point per $1 spent), Friend Referrals ($50 credit), and Digital Gift Cards.
- Guidelines:
  * Keep responses elegant, reassuring, clear, and concise.
  * For medical diagnosis requests, gently remind the patient that AI offers general guidance and encourage booking an in-clinic consultation with a doctor.
  * Always provide practical steps (e.g., "You can tap 'Book Appointment' below to choose a time with Dr. Elena Rostova").
  * Format response with clean bullet points or short paragraphs.
`;

const FALLBACK_TEXT =
  "Welcome to Reveal Clinic! I am your AI Health & Beauty Assistant. " +
  "You can ask me about our dermatology services, doctor schedules, booking appointments, " +
  "post-treatment care instructions, or active package promotions.";

export async function generateChatReply(
  message: string,
  conversationHistory?: ChatHistoryItem[]
): Promise<ChatReply> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { text: FALLBACK_TEXT, fallback: true };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const contents = [];
  if (Array.isArray(conversationHistory)) {
    for (const item of conversationHistory) {
      contents.push({
        role: item.sender === "user" ? "user" : "model",
        parts: [{ text: item.text }],
      });
    }
  }
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  const replyText =
    response.text ||
    "Thank you for contacting Reveal Clinic. How else may I assist your skin and wellness journey today?";

  return { text: replyText };
}
