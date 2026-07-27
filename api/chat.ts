import type { IncomingMessage, ServerResponse } from "http";
import { generateChatReply } from "../lib/chat";

// Vercel's Node.js runtime augments these with parsed `body`/`query` and
// `status()`/`json()` helpers; typed loosely here to avoid depending on
// `@vercel/node` just for types.
interface VercelRequest extends IncomingMessage {
  method?: string;
  body?: any;
}
interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message, conversationHistory } = req.body ?? {};
    const reply = await generateChatReply(message, conversationHistory);
    res.status(200).json(reply);
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error?.message || "Internal server error",
    });
  }
}
