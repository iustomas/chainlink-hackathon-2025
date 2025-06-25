// types
import {
  JsonExtractorConfig,
  JsonExtractionResult,
  JsonValidationResult,
  ExtractionStrategy,
  PraefatioResponse,
  PraefatioExtractionResult,
} from "./types/json-extractor.types.js";

/**
 * Service for extracting JSON from LLM responses
 * This service provides multiple extraction strategies and validation capabilities
 */
export class JsonExtractorService {
  private static instance: JsonExtractorService;

  private constructor() {}

  /**
   * Get singleton instance of JsonExtractorService
   */
  public static getInstance(): JsonExtractorService {
    if (!JsonExtractorService.instance) {
      JsonExtractorService.instance = new JsonExtractorService();
    }

    return JsonExtractorService.instance;
  }

  /**
   * Extract JSON from text using the specified strategy
   * @param text - The text to extract JSON from
   * @param config - Configuration for extraction
   * @returns Extraction result with data and metadata
   */
  public extractJson(
    text: string,
    config: JsonExtractorConfig = {}
  ): JsonExtractionResult {
    const startTime = Date.now();
    const strategy = config.strategy || ExtractionStrategy.AUTO;

    try {
      let extractedData: any[] = [];

      if (
        strategy === ExtractionStrategy.AUTO ||
        strategy === ExtractionStrategy.MARKDOWN_CODE_BLOCK
      ) {
        const markdownResults = this.extractFromMarkdownCodeBlocks(text);
        extractedData.push(...markdownResults);
      }

      if (
        strategy === ExtractionStrategy.AUTO ||
        strategy === ExtractionStrategy.PLAIN_TEXT
      ) {
        const plainTextResults = this.extractFromPlainText(text);
        extractedData.push(...plainTextResults);
      }

      if (config.customRegex) {
        const customResults = this.extractWithCustomRegex(
          text,
          config.customRegex
        );
        extractedData.push(...customResults);
      }

      // Remove duplicates and invalid JSON
      const validData = this.filterValidJson(extractedData);

      if (validData.length === 0) {
        return {
          success: false,
          error: "No valid JSON found in the provided text",
          metadata: {
            strategyUsed: strategy,
            matchesFound: 0,
            validationPassed: false,
            extractionTime: Date.now() - startTime,
          },
        };
      }

      const result = config.returnAllMatches ? validData : validData[0];

      return {
        success: true,
        data: result,
        metadata: {
          strategyUsed: strategy,
          matchesFound: validData.length,
          validationPassed: true,
          extractionTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          strategyUsed: strategy,
          matchesFound: 0,
          validationPassed: false,
          extractionTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Extract Praefatio JSON response from LLM text
   * This is a specialized function for extracting the specific Praefatio response format
   * @param text - The LLM response text
   * @returns Praefatio extraction result with validation
   */
  public extractPraefatioJson(text: string): PraefatioExtractionResult {
    const startTime = Date.now();

    try {
      // Check if text is empty or whitespace only
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: "Empty or whitespace-only text provided",
          metadata: {
            strategyUsed: ExtractionStrategy.AUTO,
            extractionTime: Date.now() - startTime,
            responseStartsWithYellow: false,
          },
        };
      }

      // Check if text contains Praefatio patterns
      if (!this.hasPraefatioPattern(text)) {
        return {
          success: false,
          error:
            "Text does not contain expected Praefatio JSON patterns (client_response, case_facts)",
          metadata: {
            strategyUsed: ExtractionStrategy.AUTO,
            extractionTime: Date.now() - startTime,
            responseStartsWithYellow: false,
          },
        };
      }

      // First, try to extract JSON using auto strategy
      const extractionResult = this.extractJson(text, {
        strategy: ExtractionStrategy.AUTO,
        validateJson: true,
      });

      if (!extractionResult.success || !extractionResult.data) {
        return {
          success: false,
          error: extractionResult.error || "Failed to extract JSON from text",
          metadata: {
            strategyUsed: ExtractionStrategy.AUTO,
            extractionTime: Date.now() - startTime,
            responseStartsWithYellow: false,
          },
        };
      }

      // Validate the extracted data matches Praefatio structure
      const validation = this.validatePraefatioStructure(extractionResult.data);

      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid Praefatio structure: ${validation.errors?.join(", ")}`,
          validation: {
            isValid: false,
            errors: validation.errors,
          },
          metadata: {
            strategyUsed: ExtractionStrategy.AUTO,
            extractionTime: Date.now() - startTime,
            responseStartsWithYellow: false,
          },
        };
      }

      const praefatioData = validation.data as PraefatioResponse;

      // Clean and normalize the data
      const cleanedData = this.cleanPraefatioData(praefatioData);
      const warnings: string[] = [];

      // Add warnings for potential issues
      if (cleanedData.client_response.length === 0) {
        warnings.push("client_response is empty after cleaning");
      }

      if (cleanedData.case_facts.length === 0) {
        warnings.push("case_facts array is empty after cleaning");
      }

      // Check if any facts were removed during cleaning
      const originalFactsCount = praefatioData.case_facts.length;
      const cleanedFactsCount = cleanedData.case_facts.length;
      if (originalFactsCount !== cleanedFactsCount) {
        warnings.push(
          `${originalFactsCount - cleanedFactsCount} empty case_facts were removed during cleaning`
        );
      }

      return {
        success: true,
        data: cleanedData,
        validation: {
          isValid: true,
          warnings: warnings.length > 0 ? warnings : undefined,
        },
        metadata: {
          strategyUsed: ExtractionStrategy.AUTO,
          extractionTime: Date.now() - startTime,
          responseStartsWithYellow: false,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Praefatio extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          strategyUsed: ExtractionStrategy.AUTO,
          extractionTime: Date.now() - startTime,
          responseStartsWithYellow: false,
        },
      };
    }
  }

  /**
   * Extract JSON from markdown code blocks
   * @param text - Text containing markdown code blocks
   * @returns Array of extracted JSON objects
   */
  private extractFromMarkdownCodeBlocks(text: string): any[] {
    const results: any[] = [];

    // Regex to match ```json ... ``` blocks
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/gi;
    let match;

    while ((match = jsonBlockRegex.exec(text)) !== null) {
      try {
        const jsonString = match[1].trim();
        const parsed = JSON.parse(jsonString);
        results.push(parsed);
      } catch (error) {
        // Skip invalid JSON in code blocks
        console.warn(
          "[JsonExtractor] Invalid JSON in markdown code block:",
          error
        );
      }
    }

    return results;
  }

  /**
   * Extract JSON from plain text by finding JSON-like patterns
   * @param text - Plain text to search for JSON
   * @returns Array of extracted JSON objects
   */
  private extractFromPlainText(text: string): any[] {
    const results: any[] = [];

    // Try to find JSON objects in the text
    // Look for patterns that start with { and end with }
    const jsonPatternRegex = /\{[\s\S]*?\}/g;
    let match;

    while ((match = jsonPatternRegex.exec(text)) !== null) {
      try {
        const jsonString = match[0];
        const parsed = JSON.parse(jsonString);
        results.push(parsed);
      } catch (error) {
        // Skip invalid JSON patterns
      }
    }

    return results;
  }

  /**
   * Extract JSON using a custom regex pattern
   * @param text - Text to search
   * @param regexPattern - Custom regex pattern
   * @returns Array of extracted JSON objects
   */
  private extractWithCustomRegex(text: string, regexPattern: string): any[] {
    const results: any[] = [];

    try {
      const regex = new RegExp(regexPattern, "gi");
      let match;

      while ((match = regex.exec(text)) !== null) {
        try {
          const jsonString = match[0];
          const parsed = JSON.parse(jsonString);
          results.push(parsed);
        } catch (error) {
          // Skip invalid JSON
        }
      }
    } catch (error) {
      console.warn("[JsonExtractor] Invalid custom regex pattern:", error);
    }

    return results;
  }

  /**
   * Filter and validate extracted JSON data
   * @param data - Array of extracted data
   * @returns Array of valid JSON objects
   */
  private filterValidJson(data: any[]): any[] {
    return data.filter((item) => {
      try {
        // Check if it's a valid object
        return (
          typeof item === "object" && item !== null && !Array.isArray(item)
        );
      } catch (error) {
        return false;
      }
    });
  }

  /**
   * Validate that the extracted data matches Praefatio structure
   * @param data - Extracted data to validate
   * @returns Validation result
   */
  private validatePraefatioStructure(data: any): JsonValidationResult {
    const errors: string[] = [];

    // Check if data is an object
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      errors.push("Data must be a JSON object");
      return { isValid: false, errors };
    }

    // Check required top-level fields
    if (typeof data.client_response !== "string") {
      errors.push("client_response must be a string");
    }

    if (!Array.isArray(data.case_facts)) {
      errors.push("case_facts must be an array");
    } else {
      // Validate that all case_facts are strings
      for (let i = 0; i < data.case_facts.length; i++) {
        if (typeof data.case_facts[i] !== "string") {
          errors.push(`case_facts[${i}] must be a string`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      data: errors.length === 0 ? data : undefined,
    };
  }

  /**
   * Clean and normalize extracted Praefatio data
   * @param data - Raw extracted data
   * @returns Cleaned and normalized data
   */
  private cleanPraefatioData(data: any): PraefatioResponse {
    return {
      client_response:
        typeof data.client_response === "string"
          ? data.client_response.trim()
          : "",
      case_facts: Array.isArray(data.case_facts)
        ? data.case_facts
            .filter(
              (fact: any) => typeof fact === "string" && fact.trim().length > 0
            )
            .map((fact: string) => fact.trim())
        : [],
    };
  }

  /**
   * Check if text contains Praefatio-style JSON patterns
   * @param text - Text to analyze
   * @returns Whether the text likely contains Praefatio JSON
   */
  private hasPraefatioPattern(text: string): boolean {
    const praefatioPatterns = [
      /"client_response"\s*:/i,
      /"case_facts"\s*:/i,
      /\{\s*"client_response"/i,
      /"case_facts"\s*:\s*\[/i,
    ];

    return praefatioPatterns.some((pattern) => pattern.test(text));
  }
}

// Export singleton instance
export const jsonExtractorService = JsonExtractorService.getInstance();
