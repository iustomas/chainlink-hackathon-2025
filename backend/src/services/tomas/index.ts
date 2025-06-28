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

  async generateInvestigatoAnalysis(query: string) {
    // Generate the investigative analysis using Investigato API
    try {
      // Step 1: Create assistant
      const createAssistantResponse = await fetch(
        `${process.env.INVESTIGATO_URL}/assistants`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            graph_id: "open_deep_research_multi_agent",
            if_exists: "raise",
            name: "invetigato_research_multi_agent",
            description:
              "Investigato** is the intelligence-gathering heart of Tomas",
          }),
        }
      );

      if (!createAssistantResponse.ok) {
        throw new Error(
          `Failed to create assistant: ${createAssistantResponse.statusText}`
        );
      }

      const assistantData = await createAssistantResponse.json();
      const assistantId = assistantData.assistant_id;

      if (!assistantId) {
        throw new Error("No assistant_id received from Investigato API");
      }

      // Step 2: Run analysis with the query
      const runAnalysisResponse = await fetch(
        `${process.env.INVESTIGATO_URL}/runs/wait`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            assistant_id: assistantId,
            input: {
              messages: [query],
            },
          }),
        }
      );

      if (!runAnalysisResponse.ok) {
        throw new Error(
          `Failed to run analysis: ${runAnalysisResponse.statusText}`
        );
      }

      const analysisData = await runAnalysisResponse.json();

      console.log(
        "\n========== OUTPUT INVESTIGATO ==========\n",
        analysisData,
        "\n========================================\n"
      );

      return {
        success: true,
        response: analysisData.output || analysisData,
        assistantId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in generateInvestigatoAnalysis:", error);

      return {
        success: false,
        response: `Error in investigato analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
        assistantId: null,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async generateRespondeoReply({
    finalReport,
    respondeoDirective,
  }: {
    finalReport: string;
    respondeoDirective: string;
  }) {
    // Aquí va la lógica para llamar al modelo o API de Respondeo
    // Puedes ajustar el modelo y proveedor según tu stack
    const PROVIDER = PROVIDERS.GEMINI;
    const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

    // Construye el prompt para Respondeo usando el final_report y la directiva
    const respondeoPrompt = promptBuilderService.buildRespondeoPrompt({
      finalReport,
      respondeoDirective,
    });

    // Llama al LLM o API correspondiente
    const respondeoLlmResponse = await llmServiceManager.generateText(
      {
        prompt: "",
        systemPrompt: respondeoPrompt,
        model: MODEL,
      },
      PROVIDER
    );

    return {
      success: true,
      response: respondeoLlmResponse.content, // o el string generado
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
export const tomasService = new TomasService();
