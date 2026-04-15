import type { NextApiRequest, NextApiResponse } from "next";

type ChatRequestBody = {
  model?: string;
  messages: unknown[];
  tools?: unknown[];
  tool_choice?: "auto" | "none" | { type: string; function?: { name: string } };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        "Server is missing OPENAI_API_KEY. Add it to client/.env.local and restart the app.",
    });
  }

  const body = req.body as ChatRequestBody;
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: "Invalid request payload" });
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
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: `Chat proxy request failed: ${(error as Error).message}`,
    });
  }
}
