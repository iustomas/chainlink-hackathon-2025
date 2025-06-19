// types
import {
  LLMService,
  LLMRequest,
  LLMResponse,
  LLMConfig,
  LLMProvider,
} from "./types/llm.types.js";

// providers
import { AnthropicService } from "./providers/anthropic.service.js";
import { OpenAIService } from "./providers/openai.service.js";
import { GeminiService } from "./providers/gemini.service.js";

// Simple function to create LLM services
export function createLLMService(
  provider: LLMProvider,
  config: LLMConfig
): LLMService {
  switch (provider) {
    case "anthropic":
      return new AnthropicService(config);
    case "openai":
      return new OpenAIService(config);
    case "gemini":
      return new GeminiService(config);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

// Helper function to create and validate a service
export function createAndValidateLLMService(
  provider: LLMProvider,
  config: LLMConfig
): LLMService {
  const service = createLLMService(provider, config);

  if (!service.isAvailable()) {
    throw new Error(
      `Service for provider ${provider} is not available (missing API key)`
    );
  }

  return service;
}

export class LLMServiceManager {
  private services: Map<LLMProvider, LLMService> = new Map();
  private defaultProvider: LLMProvider;

  constructor(defaultProvider: LLMProvider = "anthropic") {
    this.defaultProvider = defaultProvider;
  }

  registerService(provider: LLMProvider, service: LLMService): void {
    this.services.set(provider, service);
  }

  getService(provider?: LLMProvider): LLMService {
    const targetProvider = provider || this.defaultProvider;
    const service = this.services.get(targetProvider);

    if (!service) {
      throw new Error(`No service registered for provider: ${targetProvider}`);
    }

    if (!service.isAvailable()) {
      throw new Error(
        `Service for provider ${targetProvider} is not available (missing API key)`
      );
    }

    return service;
  }

  async generateText(
    request: LLMRequest,
    provider: LLMProvider
  ): Promise<LLMResponse> {
    const service = this.getService(provider);

    // console.debug("Generating text with provider", provider);
    // console.debug("Model", request.model);

    const response = await service.generateText(request);

    // console.debug("Response", response);

    return response;
  }

  setDefaultProvider(provider: LLMProvider): void {
    this.defaultProvider = provider;
  }

  getAvailableProviders(): LLMProvider[] {
    return Array.from(this.services.keys()).filter((provider) => {
      const service = this.services.get(provider);
      return service && service.isAvailable();
    });
  }
}

// Singleton instance
export const llmServiceManager = new LLMServiceManager();
