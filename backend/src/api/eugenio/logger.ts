export function logLLMInteraction({
  provider,
  model,
  systemPrompt,
  userPrompt,
  llmResponse,
  tokenCount,
}: {
  provider: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  llmResponse: string;
  tokenCount: number;
}) {
  console.log("--------------------------------");
  console.log("Provider: ", provider);
  console.log("Model: ", model);
  console.log("");
  console.log("System prompt: ", systemPrompt);
  console.log("prompt: ", userPrompt);
  console.log("response: ", llmResponse);
  console.log("response length: ", llmResponse.length);
  console.log("response (start): ", llmResponse.slice(0, 1000));
  console.log("Token count: ", tokenCount);
}

export function handleControllerError(error: unknown, c: any) {
  console.error("Error in controller:", error);

  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return c.json(
      {
        success: false,
        error: "Invalid JSON: The request body must be valid JSON.",
      },
      400
    );
  }

  if (
    error instanceof Error &&
    (error.message?.includes("LLM") ||
      error.message?.includes("generateText"))
  ) {
    return c.json({
      success: true,
      response:
        "LLM has received your message. This is the start of the discovery phase. (Fallback response - LLM service not available)",
      timestamp: new Date().toISOString(),
    });
  }

  return c.json(
    {
      success: false,
      error: "Internal server error",
    },
    500
  );
}