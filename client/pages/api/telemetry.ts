import type { NextApiRequest, NextApiResponse } from "next";

type TelemetryBody = {
  event: string;
  context?: string;
  message?: string;
  metadata?: Record<string, unknown>;
};

const getClientIp = (req: NextApiRequest): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0];
  return (forwardedIp || req.socket.remoteAddress || "unknown").trim();
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as TelemetryBody;
  if (!body || typeof body.event !== "string") {
    return res.status(400).json({ error: "Invalid telemetry payload" });
  }

  console.error(
    JSON.stringify({
      source: "client-telemetry",
      timestamp: new Date().toISOString(),
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || "unknown",
      event: body.event,
      context: body.context,
      message: body.message,
      metadata: body.metadata || {},
    }),
  );

  return res.status(200).json({ success: true });
}
