export const reportClientError = (
  context: string,
  error: unknown,
  metadata: Record<string, unknown> = {},
): void => {
  const message = error instanceof Error ? error.message : String(error);

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${context}]`, error);
  }

  void fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "client_error",
      context,
      message,
      metadata,
    }),
    keepalive: true,
  }).catch(() => {
    // Ignore telemetry transport failures.
  });
};
