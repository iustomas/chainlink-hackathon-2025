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
   * Build a prompt based on the specified configuration
   * @param config - Configuration object specifying which files to include and how to build the prompt
   * @returns The constructed prompt string
   */
  public buildPrompt(config: PromptBuilderConfig, sufficiencyScore?: number): string {
    let prompt = "";

    // Condicional: si sufficiencyScore > 0.75, usar el system prompt de propuesta
    if (sufficiencyScore !== undefined && sufficiencyScore > 0.75) {
      // System prompt de propuesta
      const proposalPromptPath = join(agentBasePath, "system-prompts/proposal.md");
      const proposalPrompt = this.readFileSafely(proposalPromptPath);
      if (proposalPrompt) {
        prompt += `SYSTEM PRIORITY: Generate a formal work proposal for the user based on the following instructions.\n\n${proposalPrompt}\n\n`;
      }

      // Formato de respuesta para propuesta
      const responseProposalPath = join(agentBasePath, "responses/response-proposal.md");
      const responseProposal = this.readFileSafely(responseProposalPath);
      if (responseProposal) {
        prompt += `Response format instructions:\n${responseProposal}\n\n`;
      }

      // System prompt base
      const systemPromptPath = join(agentBasePath, "system-prompts/praefatio.md");
      const systemPrompt = this.readFileSafely(systemPromptPath);
      if (systemPrompt) {
        prompt += `System instructions:\n${systemPrompt}\n\n`;
      }

      // Personalidad
      const personalityPath = join(agentBasePath, "memories/personality-tomas-web3.md");
      const personality = this.readFileSafely(personalityPath);
      if (personality) {
        prompt += `Your personality is as follows:\n${personality}\n\n`;
      }

      // Memoria de la conversación (si la tienes en config.customContext)
      if (config.customContext) {
        prompt += `Conversation history:\n${config.customContext}\n\n`;
      }

      // Puedes agregar aquí otras memorias relevantes si lo deseas
    } else {
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

      // Add semantic memory if specified (extra)
      if (config.includeSemanticMemory) {
        const semanticPath = join(
          agentBasePath,
          "memories/semantinc-tomas-web3.md"
        );
        const semantic = this.readFileSafely(semanticPath);
        if (semantic) {
          prompt += `Your semantic memory contains the following knowledge:\n${semantic}\n\n`;
        }
      }

      // Add artifacts if specified (extra)
      if (config.includeArtifacts) {
        const artifactsPath = join(
          agentBasePath,
          "memories/artifacts-praefatio.md"
        );
        const artifacts = this.readFileSafely(artifactsPath);
        if (artifacts) {
          prompt += `Available artifacts and templates:\n${artifacts}\n\n`;
        }
      }

      // Add proposals if specified (extra)
      if (config.includeProposals) {
        const proposalsPath = join(
          agentBasePath,
          "memories/proposals-praefatio.md"
        );
        const proposals = this.readFileSafely(proposalsPath);
        if (proposals) {
          prompt += `Proposal templates and structures:\n${proposals}\n\n`;
        }
      }

      // Add custom context if provided (extra)
      if (config.customContext) {
        prompt += `Additional context:\n${config.customContext}\n\n`;
      }

      // Add relevant questions for Praefatio if specified
      if (config.includeRelevantQuestions) {  
        const relevantQuestionsPath = join(
          agentBasePath,
          "memories/relevant-questions.md"
        );
        const relevantQuestions = this.readFileSafely(relevantQuestionsPath);
        if (relevantQuestions) {
          prompt += `Relevant questions for Praefatio:\n${relevantQuestions}\n\n`;
        }
      }
    }

    console.log("Prompt generado:", prompt); // Agregado para pruebas
    return prompt.trim();
  }

  /**
   * Build a prompt for talking with Tomas Praefatio
   * @returns The constructed prompt string
   */
  public buildTomasPraefatioPrompt(): string {
    return this.buildPrompt({
      promptType: PromptType.TOMAS_PRAEFATIO,
      includePersonality: true,
      // includeSemanticMemory: true,
      // includeArtifacts: true,
      // includeProposals: true,
      includeSystemPrompt: true,
      includeRelevantQuestions: true,
    });
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

// Export singleton instance
export const promptBuilderService = PromptBuilderService.getInstance();
