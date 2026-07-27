import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { generateChatReply } from "./lib/chat";

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
      const reply = await generateChatReply(message, conversationHistory);
      res.json(reply);
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
