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
            memoryPath = join(
              agentBasePath,
              "memories/semantinc-tomas-web3.md"
            );
            memoryLabel =
              "Your semantic memory contains the following knowledge";
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
        const semanticPath = join(
          agentBasePath,
          "memories/semantinc-tomas-web3.md"
        );
        const semantic = this.readFileSafely(semanticPath);
        if (semantic) {
          prompt += `Your semantic memory contains the following knowledge:\n${semantic}\n\n`;
        }
      }
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

    // Add custom context if provided (extra)
    if (config.customContext) {
      prompt += `Additional context:\n${config.customContext}\n\n`;
    }

    return prompt.trim();
  }

  /**
   * Build a prompt for the Proposal phase.
   * @param args - Object containing the conversation context.
   * @returns The constructed proposal prompt string
   */
  public buildProposalPrompt(args: { conversationContext: string }): string {
    let prompt = "";

    // 1. System Prompt de Proposal
    const systemPromptPath = join(agentBasePath, "system-prompts/proposal.md");
    const systemPrompt = this.readFileSafely(systemPromptPath);
    if (systemPrompt) {
      prompt += systemPrompt + "\n\n";
    }

    // 2. Personalidad
    const personalityPath = join(
      agentBasePath,
      "memories/personality-tomas-web3.md"
    );
    const personality = this.readFileSafely(personalityPath);
    if (personality) {
      prompt +=
        "--- PERSONALITY AND TONE GUIDELINES ---\n" + personality + "\n\n";
    }

    // 3. Reglas de negocio y lógica de proposal
    const proposalRulesPath = join(
      agentBasePath,
      "memories/proposals-praefatio.md"
    );
    const proposalRules = this.readFileSafely(proposalRulesPath);
    if (proposalRules) {
      prompt +=
        "--- PROPOSAL BUSINESS LOGIC AND RULES ---\n" + proposalRules + "\n\n";
    }

    // 4. Formato de respuesta requerido
    const responseFormatPath = join(
      agentBasePath,
      "responses/response-praefatio-proposal.md"
    );
    const responseFormat = this.readFileSafely(responseFormatPath);
    if (responseFormat) {
      prompt += "--- REQUIRED RESPONSE FORMAT ---\n" + responseFormat + "\n\n";
    }

    // 5. Contexto de la conversación
    if (args.conversationContext) {
      prompt +=
        "--- CONVERSATION CONTEXT ---\n" + args.conversationContext + "\n\n";
    }

    return prompt.trim();
  }

  /**
   * Build a prompt for the Cognitio phase.
   * @param conversationHistory - Array with all Praefatio conversation turns.
   * @returns An object containing the systemPrompt and userMessage (transcript).
   */
  public buildCognitioPrompt(conversationHistory: any[]): {
    systemPrompt: string;
    userMessage: string;
  } {
    // Ruta al system prompt de Cognitio
    const cognitioSystemPromptPath = join(
      agentBasePath,
      "system-prompts/cognitio.md"
    );
    const cognitioSystemPrompt =
      this.readFileSafely(cognitioSystemPromptPath) || "";

    // Ruta al response format de Cognitio
    const responseCognitioPath = join(agentBasePath, "responses/response-cognitio.md");
    const responseCognitio = this.readFileSafely(responseCognitioPath) || "";

    // Combina ambos archivos en el systemPrompt
    const systemPrompt = `${cognitioSystemPrompt}\n\n${responseCognitio}`.trim();

    // Formatear el historial como transcripción
    const formattedTranscript = conversationHistory
      .map((turn) => {
        try {
          const agentResponseJson = JSON.parse(turn.agentResponse);
          return `Usuario: ${turn.userMessage}\nAgente: ${agentResponseJson.client_response}`;
        } catch (error) {
          return `Usuario: ${turn.userMessage}\nAgente: ${turn.agentResponse}`;
        }
      })
      .join("\n\n---\n\n");

    return {
      systemPrompt,
      userMessage: formattedTranscript,
    };
  }

  /**
   * Build a prompt for the Respondeo phase.
   * @param args - Object containing the final report and respondeo directive.
   * @returns The constructed respondeo prompt string
   */
  public buildRespondeoPrompt(args: { finalReport: string; respondeoDirective: string }): string {
    // Lee el system prompt y el formato de respuesta de Respondeo
    const respondeoSystemPromptPath = join(agentBasePath, "system-prompts/respondeo.md");
    const respondeoSystemPrompt = this.readFileSafely(respondeoSystemPromptPath) || "";

    const respondeoResponseFormatPath = join(agentBasePath, "responses/response-respondeo.md");
    const respondeoResponseFormat = this.readFileSafely(respondeoResponseFormatPath) || "";

    // Construye el prompt completo
    return `
${respondeoSystemPrompt ? `### System Instructions\n${respondeoSystemPrompt}\n` : ""}
${respondeoResponseFormat ? `### Response Format\n${respondeoResponseFormat}\n` : ""}
### Legal Analysis Report
${args.finalReport}

### Response Instructions
${args.respondeoDirective}
    `.trim();
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
