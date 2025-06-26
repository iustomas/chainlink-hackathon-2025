import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ProposalPromptBuilderArgs } from "./types/prompt-builder.types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajusta estas rutas si tu estructura de carpetas es diferente
const MEMORIES_BASE_PATH = path.join(__dirname, "../../../agent/memories");
const SYSTEM_PROMPTS_BASE_PATH = path.join(__dirname, "../../../agent/system-prompts");
const RESPONSES_BASE_PATH = path.join(__dirname, "../../../agent/responses");

export class ProposalPromptBuilderService {
  private static instance: ProposalPromptBuilderService;

  private personality: string;
  private proposalRules: string;
  private proposalSystemPrompt: string;
  private proposalResponseFormat: string;

  private constructor() {
    console.log("[ProposalPromptBuilderService] Initializing and caching memories...");
    this.personality = fs.readFileSync(
      path.join(MEMORIES_BASE_PATH, "personality-tomas-web3.md"),
      "utf-8"
    );
    this.proposalRules = fs.readFileSync(
      path.join(MEMORIES_BASE_PATH, "proposals-praefatio.md"),
      "utf-8"
    );
    this.proposalSystemPrompt = fs.readFileSync(
      path.join(SYSTEM_PROMPTS_BASE_PATH, "proposal.md"),
      "utf-8"
    );
    this.proposalResponseFormat = fs.readFileSync(
      path.join(RESPONSES_BASE_PATH, "response-proposal.md"),
      "utf-8"
    );
    console.log("[ProposalPromptBuilderService] All proposal memories cached successfully.");
  }

  public static getInstance(): ProposalPromptBuilderService {
    if (!ProposalPromptBuilderService.instance) {
      ProposalPromptBuilderService.instance = new ProposalPromptBuilderService();
    }
    return ProposalPromptBuilderService.instance;
  }

  /**
   * Ensambla el prompt final para la generación de propuestas.
   * @param args - Objeto que contiene el contexto de la conversación.
   * @returns Un string único con el system prompt completo.
   */
  public buildProposalPrompt(args: ProposalPromptBuilderArgs): string {
    const promptParts: string[] = [];

    // 1. System Prompt de Proposal
    promptParts.push(this.proposalSystemPrompt);

    // 2. Personalidad
    promptParts.push("--- PERSONALITY AND TONE GUIDELINES ---\n" + this.personality);

    // 3. Reglas de negocio y lógica de proposal
    promptParts.push("--- PROPOSAL BUSINESS LOGIC AND RULES ---\n" + this.proposalRules);

    // 4. Formato de respuesta requerido
    promptParts.push("--- REQUIRED RESPONSE FORMAT ---\n" + this.proposalResponseFormat);

    // 5. Contexto de la conversación
    promptParts.push("--- CONVERSATION CONTEXT ---\n" + args.conversationContext);

    return promptParts.join("\n\n");
  }
}

export const proposalPromptBuilderService = ProposalPromptBuilderService.getInstance();