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
