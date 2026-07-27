import type { IncomingMessage, ServerResponse } from "http";

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

export default function handler(_req: IncomingMessage, res: VercelResponse) {
  res.status(200).json({ status: "ok", app: "Reveal Clinic PWA" });
}
