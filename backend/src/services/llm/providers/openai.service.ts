// openai sdk
import OpenAI from "openai";

// types
import {
  LLMService,
  LLMRequest,
  LLMResponse,
  LLMConfig,
} from "../types/llm.types.js";

export class OpenAIService implements LLMService {
  private client: OpenAI;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

      // Add system message if provided
      if (request.systemPrompt) {
        messages.push({
          role: "system",
          content: request.systemPrompt,
        });
      }

      // Add the main prompt
      messages.push({
        role: "user",
        content: request.prompt,
      });

      const response = await this.client.chat.completions.create({
        model: request.model || this.config.model || "gpt-4",
        max_tokens: request.maxTokens || this.config.maxTokens || 1000,
        temperature: request.temperature || this.config.temperature || 0.7,
        messages,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error("No response from OpenAI API");
      }

      return {
        content: choice.message.content || "",
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens,
            }
          : undefined,
        model: response.model,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw new Error(
        `OpenAI API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }
}
