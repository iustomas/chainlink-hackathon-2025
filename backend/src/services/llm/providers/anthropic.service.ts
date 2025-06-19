// anthropic sdk
import Anthropic from "@anthropic-ai/sdk";

// types
import {
  LLMService,
  LLMRequest,
  LLMResponse,
  LLMConfig,
} from "../types/llm.types.js";

export class AnthropicService implements LLMService {
  private client: Anthropic;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    try {
      const messages: Anthropic.MessageParam[] = [];

      // Add system message if provided
      if (request.systemPrompt) {
        messages.push({
          role: "user",
          content: request.systemPrompt,
        });
      }

      // Add the main prompt
      messages.push({
        role: "user",
        content: request.prompt,
      });

      const response = await this.client.messages.create({
        model: request.model || this.config.model || "claude-3-sonnet-20240229",
        max_tokens: request.maxTokens || this.config.maxTokens || 1000,
        temperature: request.temperature || this.config.temperature || 0.7,
        messages,
      });

      return {
        content:
          response.content[0]?.type === "text" ? response.content[0].text : "",
        usage: response.usage
          ? {
              promptTokens: response.usage.input_tokens,
              completionTokens: response.usage.output_tokens,
              totalTokens:
                response.usage.input_tokens + response.usage.output_tokens,
            }
          : undefined,
        model: response.model,
        finishReason: response.stop_reason || "stop_sequence",
      };
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw new Error(
        `Anthropic API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }
}
