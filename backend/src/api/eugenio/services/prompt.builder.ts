import { ECU } from "../types/ecu.types.js";
import { MemoryManager } from "./memory.manager.js";

export class PromptBuilder {
  private static instance: PromptBuilder;
  private memoryManager: MemoryManager;

  private constructor(memoryManager: MemoryManager) {
    this.memoryManager = memoryManager;
  }

  public static getInstance(memoryManager: MemoryManager): PromptBuilder {
    if (!PromptBuilder.instance) {
      PromptBuilder.instance = new PromptBuilder(memoryManager);
    }
    return PromptBuilder.instance;
  }

  /**
   * Construye el systemPrompt ensamblando instrucciones universales, instrucciones específicas y personalidad.
   * @param taskType string - Ejemplo: "praefatio-interactive-ecu"
   * @param ecu ECU - Estado Cognitivo Universal actual
   * @returns string - Prompt ensamblado
   */
  public build(taskType: string, ecu: ECU): string {
    // 1. Leer master_instructions.md
    const masterInstructions = this.memoryManager.read("system-prompts/master-instructions.md");
    if (!masterInstructions) throw new Error("No se pudo leer master_instructions.md");

    // 2. Extraer instrucciones universales (antes de GEM-SPECIFIC INSTRUCTIONS)
    const universalMatch = masterInstructions.match(/([\s\S]*?)^## GEM-SPECIFIC INSTRUCTIONS/m);
    const universalInstructions = universalMatch ? universalMatch[1].trim() : "";

    // 3. Extraer instrucciones específicas para el taskType
    // Busca el bloque que comienza con ## PROMPT: <taskType>
    const specificRegex = new RegExp(`^## PROMPT: ${taskType}[\\s\\S]*?(?=^## PROMPT:|^## |\\Z)`, "m");
    const specificMatch = masterInstructions.match(specificRegex);
    if (!specificMatch) {
      throw new Error(`No se encontró la sección de instrucciones para el taskType: ${taskType}`);
    }
    const specificInstructions = specificMatch[0].replace(/^## PROMPT: .*\n?/, "").trim();

    // 4. Leer personalidad
    const personality = this.memoryManager.read("memories/personality-tomas-web3.md") || "";

    // 5. Ensamblar el prompt final
    const prompt = [
      universalInstructions,
      specificInstructions,
      personality
    ].filter(Boolean).join("\n\n");

    return prompt;
  }
}