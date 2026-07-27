import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Reveal Clinic PWA" });
  });

  // Gemini AI Chatbot API Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback response if GEMINI_API_KEY is not provided
        return res.json({
          text: "Welcome to Reveal Clinic! I am your AI Health & Beauty Assistant. " +
            "You can ask me about our dermatology services, doctor schedules, booking appointments, " +
            "post-treatment care instructions, or active package promotions.",
          fallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `
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
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Thank you for contacting Reveal Clinic. How else may I assist your skin and wellness journey today?";

      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({
        error: "Failed to generate response",
        details: error?.message || "Internal server error",
      });
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Reveal Clinic PWA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
