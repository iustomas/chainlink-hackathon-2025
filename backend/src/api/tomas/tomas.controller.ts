// hono
import { Context } from "hono";

// types
import {
  TalkWithTomasRequest,
  TalkWithTomasResponse,
  ScriptumRequest,
} from "./types/tomas.types.js";

// validator input
import {
  validateTalkWithTomasPraefatioRequest,
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
  PromptType,
  promptBuilderService,
} from "../../services/prompt-builder/index.js";

// json extractor service
import { jsonExtractorService } from "../../services/json-extractor/index.js";

// tomas service
import { tomasService } from "../../services/tomas/index.js";

// controller
export const tomasController = {
  // talk with tomas praefatio
  talkWithTomasPraefatio: async (c: Context) => {
    const SUFFICIENCY_SCORE_THRESHOLD = 0.75;

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

      // Get conversation history
      const conversationHistory =
        await conversationHistoryService.getConversationHistory(userAddress);

      // TODO:Eliminar esta logica de ultimo turno
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

      // Extract Praefatio JSON from LLM response
      const jsonExtractionResult = jsonExtractorService.extractPraefatioJson(
        llmResponse.content
      );

      let clientResponse = jsonExtractionResult.data?.client_response || "";
      const sufficiencyScore = jsonExtractionResult.data?.sufficiency_score;

      // Generate proposal if sufficiency score is high enough
      if (
        // typeof sufficiencyScore === "number" &&
        // sufficiencyScore >= SUFFICIENCY_SCORE_THRESHOLD
        true
      ) {
        console.log("Generating proposal");

        const proposalResponse = await tomasService.generateProposal(
          userAddress,
          messageWithPreviousConversation
        );

        const jsonExtractionResultProposal =
          jsonExtractorService.extractPraefatioProposalJson(
            proposalResponse.response
          );

        // Crear documento de proposal como PDF y agregarlo a la vault

        // Save conversation to Firestore history with the proposal price
        await conversationHistoryService.addConversationAndExtractedFacts(
          userAddress,
          validatedBody.message,
          jsonExtractionResultProposal.data?.client_response || "",
          jsonExtractionResult.data?.case_facts || [],
          jsonExtractionResult.data?.actions || [],
          jsonExtractionResult.data?.sufficiency_score,
          jsonExtractionResultProposal.data?.price || 0
        );

        return c.json({
          success: true,
          response: jsonExtractionResultProposal.data?.client_response || "",
          price: jsonExtractionResultProposal.data?.price || 0,
          caseFacts: jsonExtractionResult.data?.case_facts || [],
        });
      }

      // Save conversation to Firestore history
      await conversationHistoryService.addConversationAndExtractedFacts(
        userAddress,
        validatedBody.message,
        jsonExtractionResult.data?.client_response || "",
        jsonExtractionResult.data?.case_facts || [],
        jsonExtractionResult.data?.actions || [],
        jsonExtractionResult.data?.sufficiency_score
      );

      const response: TalkWithTomasResponse = {
        success: true,
        response: clientResponse,
        userAddress: validatedBody.userAddress,
        timestamp: new Date().toISOString(),
        caseFacts: jsonExtractionResult.data?.case_facts || [],
      };

      return c.json(response);
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

  // (Cognitio + Investigato + Respondeo)
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

      // --- Step 1: Ejecutar Cognitio ---
      const conversationHistory =
        await conversationHistoryService.getConversationHistory(
          validatedBody.userAddress
        );
      const { systemPrompt, userMessage } =
        promptBuilderService.buildCognitioPrompt(conversationHistory);
      const PROVIDER = PROVIDERS.GEMINI;
      const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

      const cognitioResponse = await llmServiceManager.generateText(
        {
          prompt: userMessage,
          systemPrompt: systemPrompt,
          model: MODEL,
        },
        PROVIDER
      );
      console.log("Cognitio Output:", cognitioResponse.content);

      // --- Step 2: Parsear output de Cognitio para extraer input de Investigato y Respondeo ---
      let investigatoInput = "";
      let respondeoInput = "";
      try {
        let cognitioContent = cognitioResponse.content.trim();
        if (
          cognitioContent.startsWith("```json") ||
          cognitioContent.startsWith("```")
        ) {
          cognitioContent = cognitioContent
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();
        }
        // Intenta parsear como JSON
        try {
          const cognitioJson = JSON.parse(cognitioContent);
          investigatoInput = cognitioJson.directive_for_investigato || "";
          respondeoInput = cognitioJson.directive_for_respondeo || "";
        } catch (jsonErr) {
          // Si falla, extrae las directivas como texto plano usando regex
          const matchInvestigato = cognitioContent.match(
            /"directive_for_investigato"\s*:\s*"([\s\S]*?)"\s*,?\s*"/
          );
          const matchRespondeo = cognitioContent.match(
            /"directive_for_respondeo"\s*:\s*"([\s\S]*?)"\s*,?\s*"/
          );
          investigatoInput = matchInvestigato
            ? matchInvestigato[1].replace(/\\"/g, '"')
            : "";
          respondeoInput = matchRespondeo
            ? matchRespondeo[1].replace(/\\"/g, '"')
            : "";
        }
      } catch (err) {
        console.error("Error extracting Cognitio output:", err);
        investigatoInput = "";
        respondeoInput = "";
      }
      console.log("Investigato Input:", investigatoInput);
      console.log("Respondeo Input:", respondeoInput);

      // --- Step 3: Ejecutar Investigato ---
      let investigatoResponse;
      try {
        investigatoResponse = investigatoInput
          ? await tomasService.generateInvestigatoAnalysis(investigatoInput)
          : null;
      } catch (err) {
        console.error("Error calling Investigato module:", err);
        investigatoResponse = null;
      }
      console.log("Investigato Output:", investigatoResponse);

      // --- Step 3b: Parsear el final_report del output de Investigato ---
      let investigatoFinalReport = "";
      try {
        // Si investigatoResponse tiene la estructura esperada
        if (
          investigatoResponse &&
          investigatoResponse.success &&
          investigatoResponse.response &&
          typeof investigatoResponse.response === "object" &&
          "final_report" in investigatoResponse.response
        ) {
          investigatoFinalReport = investigatoResponse.response.final_report;
        }
      } catch (err) {
        console.error(
          "Error extracting final_report from Investigato output:",
          err
        );
        investigatoFinalReport = "";
      }
      console.log("Investigato Final Report:", investigatoFinalReport);

      // --- Step 4: Ejecutar Respondeo ---
      // Respondeo recibe como input el final_report de investigato y el respondeoInput de cognitio
      let respondeoResponse;
      try {
        console.log("Respondeo Input (finalReport):", investigatoFinalReport);
        console.log("Respondeo Input (directive):", respondeoInput);
        respondeoResponse =
          investigatoFinalReport && respondeoInput
            ? await tomasService.generateRespondeoReply({
                finalReport: investigatoFinalReport,
                respondeoDirective: respondeoInput,
              })
            : null;
        console.log("Respondeo Output:", respondeoResponse);
      } catch (err) {
        console.error("Error calling Respondeo module:", err);
        respondeoResponse = null;
      }
      console.log("Respondeo Output:", respondeoResponse);

      // --- Step 5: Escalate to Human Lawyer if requested ---
      if (validatedBody.escalateToHumanLawyer) {
        const emailResult = await getEmailServiceManager().sendEscalationEmail({
          userAddress: validatedBody.userAddress,
        });

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

      // --- Step 6: Return success response, including cognitio, investigato y respondeo output ---
      return c.json({
        success: true,
        message:
          "Scriptum process completed. Cognitio, Investigato, Respondeo phases executed.",
        userAddress: validatedBody.userAddress,
        cognitioOutput: cognitioResponse.content,
        investigatoInput: investigatoInput,
        investigatoOutput: investigatoResponse,
        investigatoFinalReport: investigatoFinalReport,
        respondeoInput: respondeoInput,
        respondeoOutput: respondeoResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in scriptum:", error);

      return c.json(
        {
          success: false,
          error: "Internal server error",
        },
        500
      );
    }
  },
};
