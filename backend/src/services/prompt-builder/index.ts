// fs
import { readFileSync } from "fs";

// path
import { join, dirname } from "path";

// url
import { fileURLToPath } from "url";

// types
import {
  PromptBuilderConfig,
  PromptType,
} from "./types/prompt-builder.types.js";

// Export types for external use
export { PromptType } from "./types/prompt-builder.types.js";

// Get the base directory for agent files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const agentBasePath = join(__dirname, "../../../agent");

/**
 * Service for building prompts based on different markdown files
 * This service is specifically designed for Tomas but can be extended for other agents
 */
export class PromptBuilderService {
  private static instance: PromptBuilderService;

  private constructor() {}

  /**
   * Get singleton instance of PromptBuilderService
   */
  public static getInstance(): PromptBuilderService {
    if (!PromptBuilderService.instance) {
      PromptBuilderService.instance = new PromptBuilderService();
    }

    return PromptBuilderService.instance;
  }

  /**
   * Build a prompt for the Praefatio discovery phase.
   * @param config - Configuration object specifying which files to include and how to build the prompt
   * @returns The constructed prompt string
   */
  public buildPraefatioPrompt(config: PromptBuilderConfig): string {
    let prompt = "";

    // Add system prompt first (tarea a cumplir)
    if (config.includeSystemPrompt) {
      const systemPromptPath = join(
        agentBasePath,
        "system-prompts/praefatio.md"
      );
      const systemPrompt = this.readFileSafely(systemPromptPath);
      if (systemPrompt) {
        prompt += `System instructions:\n${systemPrompt}\n\n`;
      }
    }

    // Add response format (formato de salida)
    const responseFormatPath = join(
      agentBasePath,
      "responses/response-praefatio.md"
    );
    const responseFormat = this.readFileSafely(responseFormatPath);
    if (responseFormat) {
      prompt += `Response format instructions:\n${responseFormat}\n\n`;
    }

    // Add personality if specified (extra)
    if (config.includePersonality) {
      const personalityPath = join(
        agentBasePath,
        "memories/personality-tomas-web3.md"
      );
      const personality = this.readFileSafely(personalityPath);
      if (personality) {
        prompt += `Your personality is as follows:\n${personality}\n\n`;
      }
    }

    // --- NUEVO: Agrega memorias dinámicamente según requestedMemories ---
    if (Array.isArray(config.requestedMemories)) {
      for (const memory of config.requestedMemories) {
        let memoryPath = "";
        let memoryLabel = "";

        switch (memory) {
          case "artifacts":
            memoryPath = join(agentBasePath, "memories/artifacts-praefatio.md");
            memoryLabel = "Available artifacts and templates";
            break;
          case "proposals":
            memoryPath = join(agentBasePath, "memories/proposals-praefatio.md");
            memoryLabel = "Proposal templates and structures";
            break;
          case "questions":
          case "relevant-questions":
            memoryPath = join(agentBasePath, "memories/relevant-questions.md");
            memoryLabel = "Relevant questions for Praefatio";
            break;
          case "use_cases":
            memoryPath = join(agentBasePath, "memories/use-cases-praefatio.md"); 
            memoryLabel = "Artifact use cases and limitations";
            break;
          case "semantic":
            memoryPath = join(agentBasePath, "memories/semantinc-tomas-web3.md");
            memoryLabel = "Your semantic memory contains the following knowledge";
            break;
          // Puedes agregar más casos según tus necesidades
          default:
            console.warn(`[PromptBuilder] Memoria desconocida: ${memory}`);
            continue;
        }

        const memoryContent = this.readFileSafely(memoryPath);
        if (memoryContent) {
          prompt += `${memoryLabel}:\n${memoryContent}\n\n`;
        }
      }
    } else {
      // Lógica legacy: flags booleanos
      if (config.includeSemanticMemory) {
        const semanticPath = join(agentBasePath, "memories/semantinc-tomas-web3.md");
        const semantic = this.readFileSafely(semanticPath);
        if (semantic) {
          prompt += `Your semantic memory contains the following knowledge:\n${semantic}\n\n`;
        }
      }
      if (config.includeArtifacts) {
        const artifactsPath = join(agentBasePath, "memories/artifacts-praefatio.md");
        const artifacts = this.readFileSafely(artifactsPath);
        if (artifacts) {
          prompt += `Available artifacts and templates:\n${artifacts}\n\n`;
        }
      }
      if (config.includeProposals) {
        const proposalsPath = join(agentBasePath, "memories/proposals-praefatio.md");
        const proposals = this.readFileSafely(proposalsPath);
        if (proposals) {
          prompt += `Proposal templates and structures:\n${proposals}\n\n`;
        }
      }
      if (config.includeRelevantQuestions) {
        const relevantQuestionsPath = join(agentBasePath, "memories/relevant-questions.md");
        const relevantQuestions = this.readFileSafely(relevantQuestionsPath);
        if (relevantQuestions) {
          prompt += `Relevant questions for Praefatio:\n${relevantQuestions}\n\n`;
        }
      }
    }

    // Add custom context if provided (extra)
    if (config.customContext) {
      prompt += `Additional context:\n${config.customContext}\n\n`;
    }

    console.log("Prompt generado:", prompt); // Para depuración
    return prompt.trim();
  }

  /**
   * Read a file safely, returning null if the file doesn't exist or can't be read
   * @param filePath - Path to the file to read
   * @returns File contents or null if error
   */
  private readFileSafely(filePath: string): string | null {
    try {
      return readFileSync(filePath, "utf-8");
    } catch (error) {
      console.warn(`[PromptBuilder] Could not read file ${filePath}:`, error);
      return null;
    }
  }
}

// This service is a singleton, so we use a static method to get the instance
// Export singleton instance
export const promptBuilderService = PromptBuilderService.getInstance();
