// llm service
import { llmServiceManager } from "../llm/index.js";
import { PROVIDERS, MODELS } from "../llm/lllm.constants.js";

// prompt builder service
import { promptBuilderService } from "../prompt-builder/index.js";

// firestore conversation history service
import { conversationHistoryService } from "../firestore/conversation-history.service.js";

export class TomasService {
  /**
   * Generates a proposal based on the conversation context
   * @param userAddress - The user's wallet address
   * @param messageWithPreviousConversation - The full conversation context
   * @returns The generated proposal response
   */
  async generateProposal(
    userAddress: string,
    messageWithPreviousConversation: string
  ): Promise<{
    success: boolean;
    response: string;
    userAddress: string;
    timestamp: string;
    nextStep: string;
  }> {
    const PROVIDER = PROVIDERS.GEMINI;
    const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

    const proposalPrompt = promptBuilderService.buildProposalPrompt({
      conversationContext: messageWithPreviousConversation,
    });

    const proposalLlmResponse = await llmServiceManager.generateText(
      {
        prompt: "",
        systemPrompt: proposalPrompt,
        model: MODEL,
      },
      PROVIDER
    );

    // Guardar la propuesta generada si es necesario aquí

    // Espera la confirmación de pago ("ya pagué") en el siguiente mensaje del usuario
    // Esto se logra devolviendo una respuesta que instruya al usuario a confirmar el pago,
    // y el flujo principal (talkWithTomasPraefatio) debe estar preparado para detectar "ya pagué"
    // en el siguiente mensaje y así avanzar a Cognitio.

    return {
      success: true,
      response: proposalLlmResponse.content,
      userAddress,
      timestamp: new Date().toISOString(),
      nextStep:
        "Esperando confirmación de pago. Por favor responde con 'ya pagué' cuando hayas realizado el pago para continuar con la generación del expediente digital.",
    };
  }

  async generateCognitio(
    userAddress: string,
    messageWithPreviousConversation: string
  ) {
    // Generate the digital dossier (Cognitio)

    const conversationHistory =
      await conversationHistoryService.getConversationHistory(userAddress);

    const { systemPrompt, userMessage } =
      promptBuilderService.buildCognitioPrompt(conversationHistory);

    const PROVIDER = PROVIDERS.GEMINI;
    const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

    const cognitioLlmResponse = await llmServiceManager.generateText(
      {
        prompt: userMessage,
        systemPrompt: systemPrompt,
        model: MODEL,
      },
      PROVIDER
    );

    console.log(
      "\n========== OUTPUT COGNITIO ==========\n",
      cognitioLlmResponse.content,
      "\n=====================================\n"
    );

    return {
      success: true,
      response: cognitioLlmResponse.content,
      userAddress,
      timestamp: new Date().toISOString(),
      nextStep:
        "Expediente digital generado. Próximo paso: análisis investigativo.",
    };
  }
}

// Singleton instance
export const tomasService = new TomasService();
