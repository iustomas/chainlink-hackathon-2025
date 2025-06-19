// LLM Providers
export const PROVIDERS = {
  GEMINI: "gemini",
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;

export type ProviderType = (typeof PROVIDERS)[keyof typeof PROVIDERS];

// LLM Models
export const MODELS = {
  // GEMINI models
  GEMINI_2_0_FLASH_EXP: "gemini-2.0-flash-exp",
  GEMINI_2_5_FLASH_PREVIEW_05_20: "gemini-2.5-flash-preview-05-20",

  // OPENAI models
  GPT_4_TURBO: "gpt-4-turbo",
  O4_MINI: "o4-mini",

  // ANTHROPIC models
  CLAUDE_3_OPUS: "claude-3-opus-20240229",
  CLAUDE_SONNET_4_20250514: "claude-sonnet-4-20250514",
} as const;

export type ModelType = (typeof MODELS)[keyof typeof MODELS];
