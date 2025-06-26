/**
 * Types for the prompt builder service
 */

/**
 * Enum defining the different types of prompts that can be built
 */
export enum PromptType {
  TOMAS_PRAEFATIO = "TOMAS_PRAEFATIO",
  CUSTOM = "CUSTOM",
}

/**
 * Configuration object for building prompts
 */
export interface PromptBuilderConfig {
  /**
   * The type of prompt to build
   */
  promptType: PromptType;

  /**
   * Whether to include personality from personality-tomas-web3.md
   */
  includePersonality?: boolean;

  /**
   * Whether to include semantic memory from semantinc-tomas-web3.md
   */
  includeSemanticMemory?: boolean;

  /**
   * Whether to include artifacts from artifacts-praefatio.md
   */
  includeArtifacts?: boolean;

  /**
   * Whether to include proposals from proposals-praefatio.md
   */
  includeProposals?: boolean;

  /**
   * Whether to include system prompt from praefatio.md
   */
  includeSystemPrompt?: boolean;

  /**
   * Additional custom context to include in the prompt
   */
  customContext?: string;

  /**
   * Whether to include the relevant questions for Praefatio
   */
  includeRelevantQuestions?: boolean;

  /**
   * (Nuevo) Lista de memorias dinámicas a incluir según lo que pida Tomas.
   * Ejemplo: ["artifacts", "proposals", "semantic", "relevant-questions"]
   */
  requestedMemories?: string[];
}

/**
 * Response object for prompt building operations
 */
export interface PromptBuilderResponse {
  /**
   * Whether the prompt was built successfully
   */
  success: boolean;

  /**
   * The constructed prompt string
   */
  prompt?: string;

  /**
   * Error message if the prompt building failed
   */
  error?: string;

  /**
   * Metadata about which files were included
   */
  metadata?: {
    personalityIncluded: boolean;
    semanticMemoryIncluded: boolean;
    artifactsIncluded: boolean;
    proposalsIncluded: boolean;
    systemPromptIncluded: boolean;
  };
}

/**
 * Argumentos para construir el prompt de proposal
 */
export interface ProposalPromptBuilderArgs {
  conversationContext: string;
}

/**
 * Configuration object for building Cognitio prompts
 */
export interface CognitioPromptBuilderConfig {
  /**
   * The full conversation history to be included in the prompt
   */
  conversationHistory: any[]; // Cambiado de ConversationEntry[] a any[]
}

/**
 * Response object for Cognitio prompt building operations
 */
export interface CognitioPromptBuilderResponse {
  /**
   * Whether the prompt was built successfully
   */
  success: boolean;

  /**
   * The constructed system prompt string
   */
  systemPrompt?: string;

  /**
   * The constructed user message (transcript)
   */
  userMessage?: string;

  /**
   * Error message if the prompt building failed
   */
  error?: string;
}
