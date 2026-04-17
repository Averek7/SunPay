import type { NextApiRequest, NextApiResponse } from "next";

type ChatRequestBody = {
  model?: string;
  messages: unknown[];
  tools?: unknown[];
  tool_choice?: "auto" | "none" | { type: string; function?: { name: string } };
};

type RateLimitBucket = {
  count: number;
  windowStart: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();
const WINDOW_MS = Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS || 60_000);
const MAX_REQUESTS = Number(process.env.CHAT_RATE_LIMIT_MAX || 20);

const getClientIp = (req: NextApiRequest): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0];
  return (forwardedIp || req.socket.remoteAddress || "unknown").trim();
};

const serverTelemetry = (
  event: string,
  metadata: Record<string, unknown>,
): void => {
  console.error(
    JSON.stringify({
      source: "chat-api",
      event,
      timestamp: new Date().toISOString(),
      ...metadata,
    }),
  );
};

const cleanupRateLimits = (): void => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (now - bucket.windowStart >= WINDOW_MS * 2) {
      rateLimitBuckets.delete(key);
    }
  }
};

const checkRateLimit = (
  key: string,
): { allowed: true } | { allowed: false; retryAfterMs: number } => {
  cleanupRateLimits();
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    rateLimitBuckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - bucket.windowStart) };
  }

  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
  return { allowed: true };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const requestId = crypto.randomUUID();
  const ip = getClientIp(req);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.ceil(rateLimit.retryAfterMs / 1000);
    res.setHeader("Retry-After", String(retryAfterSeconds));
    serverTelemetry("rate_limited", { requestId, ip, retryAfterSeconds });
    return res.status(429).json({
      error: "Rate limit exceeded. Please retry shortly.",
      requestId,
      retryAfterSeconds,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    serverTelemetry("missing_openai_api_key", { requestId, ip });
    return res.status(500).json({
      error:
        "Server is missing OPENAI_API_KEY. Add it to client/.env.local and restart the app.",
      requestId,
    });
  }

  const body = req.body as ChatRequestBody;
  if (!body || !Array.isArray(body.messages)) {
    return res
      .status(400)
      .json({ error: "Invalid request payload", requestId });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || "gpt-4o",
        messages: body.messages,
        tools: body.tools,
        tool_choice: body.tool_choice || "auto",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      serverTelemetry("openai_error", {
        requestId,
        ip,
        status: response.status,
        message: data?.error?.message || "OpenAI request failed",
      });
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed",
        requestId,
      });
    }

    res.setHeader("X-Request-Id", requestId);
    return res.status(200).json(data);
  } catch (error) {
    serverTelemetry("chat_proxy_failure", {
      requestId,
      ip,
      error: (error as Error).message,
    });
    return res.status(500).json({
      error: `Chat proxy request failed: ${(error as Error).message}`,
      requestId,
    });
  }
}
