// google ai sdk
import { GoogleGenerativeAI } from "@google/generative-ai";

// types
import {
  LLMService,
  LLMRequest,
  LLMResponse,
  LLMConfig,
} from "../types/llm.types.js";

export class GeminiService implements LLMService {
  private client: GoogleGenerativeAI;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    try {
      const modelName =
        request.model || this.config.model || "gemini-2.0-flash-exp";
      const model = this.client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: request.temperature || this.config.temperature || 0.7,
          maxOutputTokens: 10000,
        },
      });

      // Prepare the prompt with system message if provided
      let fullPrompt = request.prompt;
      if (request.systemPrompt) {
        fullPrompt = `${request.systemPrompt}\n\n${request.prompt}`;
      }

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        usage: {
          promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
          completionTokens:
            result.response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: result.response.usageMetadata?.totalTokenCount || 0,
        },
        model: modelName,
        finishReason: result.response.candidates?.[0]?.finishReason || "STOP",
      };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error(
        `Gemini API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }
}
