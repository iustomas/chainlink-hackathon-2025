import { llmServiceManager, createLLMService } from "./index.js";

export const initializeLLMServices = () => {
  try {
    // Initialize Anthropic service
    if (process.env.ANTHROPIC_API_KEY) {
      const anthropicService = createLLMService("anthropic", {
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: "claude-3-sonnet-20240229",
        temperature: 0.7,
        maxTokens: 1000,
      });
      llmServiceManager.registerService("anthropic", anthropicService);
      console.log("✅ Anthropic LLM service initialized");
    }

    // Initialize OpenAI service (optional)
    if (process.env.OPENAI_API_KEY) {
      const openaiService = createLLMService("openai", {
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 1000,
      });
      llmServiceManager.registerService("openai", openaiService);
      console.log("✅ OpenAI LLM service initialized");
    }

    // Initialize Gemini service (optional)
    if (process.env.GEMINI_API_KEY) {
      const geminiService = createLLMService("gemini", {
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.0-flash-exp",
        temperature: 0.7,
        maxTokens: 1000,
      });
      llmServiceManager.registerService("gemini", geminiService);
      console.log("✅ Gemini LLM service initialized");
    }

    if (llmServiceManager.getAvailableProviders().length === 0) {
      console.warn("⚠️  No LLM services available - check API keys");
    }
  } catch (error) {
    console.error("❌ Failed to initialize LLM services:", error);
  }
};
