/**
 * Types for the JSON extractor service
 */

/**
 * Enum defining the different extraction strategies
 */
export enum ExtractionStrategy {
  /**
   * Extract JSON from markdown code blocks (```json ... ```)
   */
  MARKDOWN_CODE_BLOCK = "MARKDOWN_CODE_BLOCK",

  /**
   * Extract JSON from plain text by finding JSON-like patterns
   */
  PLAIN_TEXT = "PLAIN_TEXT",

  /**
   * Extract JSON from any text format (tries multiple strategies)
   */
  AUTO = "AUTO",
}

/**
 * Configuration object for JSON extraction
 */
export interface JsonExtractorConfig {
  /**
   * The extraction strategy to use
   */
  strategy?: ExtractionStrategy;

  /**
   * Whether to validate the extracted JSON
   */
  validateJson?: boolean;

  /**
   * Expected JSON schema for validation (optional)
   */
  expectedSchema?: Record<string, any>;

  /**
   * Whether to return the first valid JSON found or all matches
   */
  returnAllMatches?: boolean;

  /**
   * Custom regex pattern for extraction (overrides strategy)
   */
  customRegex?: string;
}

/**
 * Result of a JSON extraction operation
 */
export interface JsonExtractionResult {
  /**
   * Whether the extraction was successful
   */
  success: boolean;

  /**
   * The extracted JSON object(s)
   */
  data?: any | any[];

  /**
   * Error message if extraction failed
   */
  error?: string;

  /**
   * Metadata about the extraction process
   */
  metadata?: {
    strategyUsed: ExtractionStrategy;
    matchesFound: number;
    validationPassed: boolean;
    extractionTime: number;
  };
}

/**
 * Validation result for JSON data
 */
export interface JsonValidationResult {
  /**
   * Whether the JSON is valid
   */
  isValid: boolean;

  /**
   * Validation errors if any
   */
  errors?: string[];

  /**
   * The validated JSON object
   */
  data?: any;
}

/**
 * Praefatio ECU structure types  ¿Creo que esto no se está usando?
 */
export interface PraefatioEcu {
  case_facts: {
    facts: string[];
    summary: string;
  };
  client_profile: {
    name: string;
    email: string;
    preferences: Record<string, any>;
  };
  current_hypothesis: {
    hypothesis: string;
    confidence: number;
  };
  session_status: {
    status: string;
    lastAction: string;
  };
}

/**
 * Praefatio JSON response structure (simplified version)
 */
export interface PraefatioResponse {
  client_response: string;
  case_facts: string[];
  actions: PraefatioAction[]; 
  sufficiency_score?: number; 
}

/**
 * Result of Praefatio JSON extraction
 */
export interface PraefatioExtractionResult {
  /**
   * Whether the extraction was successful
   */
  success: boolean;

  /**
   * The extracted Praefatio response
   */
  data?: PraefatioResponse;

  /**
   * Error message if extraction failed
   */
  error?: string;

  /**
   * Validation details
   */
  validation?: {
    isValid: boolean;
    errors?: string[];
    warnings?: string[];
  };

  /**
   * Metadata about the extraction process
   */
  metadata?: {
    strategyUsed: ExtractionStrategy;
    extractionTime: number;
    responseStartsWithYellow: boolean;
  };
}

// Define los comandos válidos como un enum
export enum MemoryRequestAction {
  REQUEST_MEMORY_ARTIFACTS = "REQUEST_MEMORY_ARTIFACTS",
  REQUEST_MEMORY_USE_CASES = "REQUEST_MEMORY_USE_CASES",
  REQUEST_MEMORY_QUESTIONS = "REQUEST_MEMORY_QUESTIONS",
  REQUEST_MEMORY_PROPOSALS = "REQUEST_MEMORY_PROPOSALS",
}

// Type para el score
export type SufficiencyScoreAction = `SET_SUFFICIENCY_SCORE:${number}`;

// Type union para actions
export type PraefatioAction = MemoryRequestAction | SufficiencyScoreAction;
