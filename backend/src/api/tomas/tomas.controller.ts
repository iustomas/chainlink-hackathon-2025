// hono
import { Context } from "hono";

// types
import {
  TalkWithTomasRequest,
  TalkWithTomasResponse,
  EscalateToLawyerRequest,
  EscalateToLawyerResponse,
  ScriptumRequest,
} from "./types/tomas.types.js";

// validator input
import {
  validateTalkWithTomasPraefatioRequest,
  validateEscalateToLawyerRequest,
  validateScriptumRequest,
} from "./validators/tomas.validator.js";

// llm service
import { llmServiceManager } from "../../services/llm/index.js";
import { PROVIDERS, MODELS } from "../../services/llm/lllm.constants.js";

// contract verification service
import { contractVerificationService } from "../../services/contract-verification/index.js";

// email service
import { getEmailServiceManager } from "../../services/email/index.js";

// firestore conversation history service
import { conversationHistoryService } from "../../services/firestore/conversation-history.service.js";

// prompt builder service
import {
  promptBuilderService,
  PromptType,
} from "../../services/prompt-builder/index.js";

// json extractor service
import { jsonExtractorService } from "../../services/json-extractor/index.js";

// Simple in-memory cache for escalation deduplication
const escalationCache = new Map<
  string,
  { escalationId: string; timestamp: number }
>();
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

// controller
export const tomasController = {
  // talk with tomas praefatio
  talkWithTomasPraefatio: async (c: Context) => {
    let body: TalkWithTomasRequest | undefined;

    try {
      body = await c.req.json();

      // Validate request
      const validationErrors = validateTalkWithTomasPraefatioRequest(body);

      if (validationErrors.length > 0) {
        return c.json(
          {
            success: false,
            error: "Validation failed",
            details: validationErrors,
          },
          400
        );
      }

      // At this point, body is guaranteed to be defined and valid
      const validatedBody = body as TalkWithTomasRequest;
      const userAddress = validatedBody.userAddress;
      const message = validatedBody.message;

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("ya pagué")
      ) {
        // Ahora sí, gatilla el método de Cognitio
        return await tomasController.generateCognitio(c, userAddress);
      } else {
        // Get conversation history
        const conversationHistory =
          await conversationHistoryService.getConversationHistory(userAddress);

        // --- NUEVA LÓGICA: solo el último turno ---
        const lastTurn =
          conversationHistory.length > 0
            ? conversationHistory[conversationHistory.length - 1]
            : null;

        let caseFactsSummary = "";
        if (
          lastTurn &&
          Array.isArray(lastTurn.caseFacts) &&
          lastTurn.caseFacts.length > 0
        ) {
          caseFactsSummary =
            "--- SUMMARY OF THE CASE FROM PREVIOUS TURN ---\n" +
            lastTurn.caseFacts.map((fact) => `- ${fact}`).join("\n");
        }

        // 1. Construye el prompt condicional ANTES de llamar al LLM
        let requestedMemories: string[] = [];
        if (
          lastTurn &&
          Array.isArray(lastTurn.actions) &&
          lastTurn.actions.length > 0
        ) {
          requestedMemories = lastTurn.actions
            .filter((action: string) => action.startsWith("REQUEST_MEMORY_"))
            .map((action: string) =>
              action.replace("REQUEST_MEMORY_", "").toLowerCase()
            );
        }

        const systemPrompt = promptBuilderService.buildPraefatioPrompt({
          promptType: PromptType.TOMAS_PRAEFATIO,
          includePersonality: true,
          includeSystemPrompt: true,
          includeRelevantQuestions: true,
          customContext: caseFactsSummary,
          requestedMemories,
        });

        // Build message with previous conversation and current user message
        const messageWithPreviousConversation =
          conversationHistory
            .map(
              (turn) =>
                `User: ${turn.userMessage}\nTomas: ${turn.tomasReply || ""}`
            )
            .join("\n") + `\nUser: ${validatedBody.message}`;

        // 2. Llama al LLM usando ese prompt
        const PROVIDER = PROVIDERS.GEMINI;
        const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

        const llmResponse = await llmServiceManager.generateText(
          {
            prompt: messageWithPreviousConversation,
            systemPrompt: systemPrompt,
            model: MODEL,
          },
          PROVIDER
        );

        console.log("LLM RAW RESPONSE:", llmResponse.content);

        // Extract Praefatio JSON from LLM response
        const jsonExtractionResult = jsonExtractorService.extractPraefatioJson(
          llmResponse.content
        );

        let clientResponse = jsonExtractionResult.data?.client_response || "";
        const sufficiencyScore = jsonExtractionResult.data?.sufficiency_score;

        // --- NUEVA LÓGICA: Si el score es alto, delega a generateProposal ---
        if (typeof sufficiencyScore === "number" && sufficiencyScore > 0.75) {
          return await tomasController.generateProposal(
            c,
            userAddress,
            messageWithPreviousConversation
          );
        }

        // Save conversation to Firestore history (solo praefatio)
        await conversationHistoryService.addConversationAndExtractedFacts(
          userAddress,
          validatedBody.message,
          jsonExtractionResult.data?.client_response || "",
          jsonExtractionResult.data?.case_facts || [],
          jsonExtractionResult.data?.actions || [],
          jsonExtractionResult.data?.sufficiency_score
        );

        const prompt = promptBuilderService.buildPraefatioPrompt({
          promptType: PromptType.TOMAS_PRAEFATIO,
          includePersonality: true,
          includeSystemPrompt: true,
          includeRelevantQuestions: true,
          customContext: caseFactsSummary,
          requestedMemories,
        });

        const response: TalkWithTomasResponse = {
          success: true,
          response: clientResponse,
          userAddress: validatedBody.userAddress,
          timestamp: new Date().toISOString(),
        };

        return c.json(response);
      }
    } catch (error) {
      console.error("Error in talkWithTomasPraefatio:", error);

      // Check if it's a JSON parse error
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return c.json(
          {
            success: false,
            error: "Invalid JSON: The request body must be valid JSON.",
          },
          400
        );
      }

      // Check if it's an LLM service error
      if (
        error instanceof Error &&
        (error.message?.includes("LLM") ||
          error.message?.includes("generateText"))
      ) {
        const response: TalkWithTomasResponse = {
          success: true,
          response: `Tomas has received your message for case ${
            body?.userAddress || "unknown"
          }. This is the start of the discovery phase. (Fallback response - LLM service not available)`,
          userAddress: body?.userAddress || "unknown",
          timestamp: new Date().toISOString(),
        };

        return c.json(response);
      }

      return c.json(
        {
          success: false,
          error: "Internal server error",
        },
        500
      );
    }
  },

  // Nuevo método para generar la propuesta
  generateProposal: async (
    c: Context,
    userAddress: string,
    messageWithPreviousConversation: string
  ) => {
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

    return c.json({
      success: true,
      response: proposalLlmResponse.content,
      userAddress,
      timestamp: new Date().toISOString(),
      nextStep:
        "Esperando confirmación de pago. Por favor responde con 'ya pagué' cuando hayas realizado el pago para continuar con la generación del expediente digital.",
    });
  },

  // Nuevo método para generar el expediente digital (Cognitio)
  generateCognitio: async (c: Context, userAddress: string) => {
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

    return c.json({
      success: true,
      response: cognitioLlmResponse.content,
      userAddress,
      timestamp: new Date().toISOString(),
      nextStep:
        "Expediente digital generado. Próximo paso: análisis investigativo.",
    });
  },

  scriptum: async (c: Context) => {
    let body: ScriptumRequest | undefined;

    try {
      body = await c.req.json();
      const headers = c.req.header();

      // Validate request
      const validationErrors = validateScriptumRequest(body);

      if (validationErrors.length > 0) {
        return c.json(
          {
            success: false,
            error: "Validation failed",
            details: validationErrors,
          },
          400
        );
      }

      const validatedBody = body as ScriptumRequest;

      // Verify that the request comes from an authorized contract
      // if (
      //   !contractVerificationService.verifyContractCall(validatedBody, headers)
      // ) {
      //   return c.json(
      //     {
      //       success: false,
      //       error: "Contract verification failed",
      //       message:
      //         "Only the authorized smart contract may access this endpoint",
      //     },
      //     403
      //   );
      // }

      if (validatedBody.escalateToHumanLawyer) {
        // Send email to Eugenio (Our human lawyer)
        const emailResult = await getEmailServiceManager().sendEscalationEmail({
          userAddress: validatedBody.userAddress,
        });

        // Log email result
        if (emailResult.success) {
          console.log(
            `Escalation email sent successfully. Message ID: ${emailResult.messageId}`
          );
        } else {
          console.error(
            `Failed to send escalation email: ${emailResult.error}`
          );
        }
      }
    } catch (error) {
      console.error("Error in scriptum:", error);
    }
  },
};
