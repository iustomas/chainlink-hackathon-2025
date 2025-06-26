// hono
import { Context } from "hono";

// types
import {
  TalkWithTomasRequest,
  TalkWithTomasResponse,
  EscalateToLawyerRequest,
  EscalateToLawyerResponse,
} from "./types/tomas.types.js";

// validator input
import {
  validateTalkWithTomasPraefatioRequest,
  validateEscalateToLawyerRequest,
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
import { promptBuilderService, PromptType } from "../../services/prompt-builder/index.js";

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

      // Get conversation history
      const conversationHistory =
        await conversationHistoryService.getConversationHistory(userAddress);

      const messageWithPreviousConversation = `
        User message: ${validatedBody.message}
        \n\nPrevious conversation:\n${conversationHistory
          .map((entry) => {
            const facts =
              entry.caseFacts && entry.caseFacts.length > 0
                ? `Case facts:\n- ${entry.caseFacts.join("\n- ")}`
                : "";
            return `User message: ${entry.userMessage}\nTomas response: ${entry.agentResponse}${facts ? `\n${facts}` : ""}`;
          })
          .join("\n\n")}`;

      // Build system prompt using the prompt builder service
      const systemPrompt = promptBuilderService.buildTomasPraefatioPrompt();

      console.log(
        "messageWithPreviousConversation",
        messageWithPreviousConversation
      );
      
      // Generate LLM response
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

      console.log("LLM RAW RESPONSE:", llmResponse.content); // Agregado para pruebas

      // Extract Praefatio JSON from LLM response
      const jsonExtractionResult = jsonExtractorService.extractPraefatioJson(
        llmResponse.content
      );

      // Save conversation to Firestore history
      await conversationHistoryService.addConversationAndExtractedFacts(
        userAddress,
        validatedBody.message,
        jsonExtractionResult.data?.client_response || "",
        jsonExtractionResult.data?.case_facts || [],
        jsonExtractionResult.data?.actions || [],
        jsonExtractionResult.data?.sufficiency_score 
      );

      const prompt = promptBuilderService.buildPrompt({
        promptType: PromptType.TOMAS_PRAEFATIO,
        includePersonality: true,
        includeSystemPrompt: true,
        includeRelevantQuestions: true,
        // ...otros flags...
      }, jsonExtractionResult.data?.sufficiency_score);

      const response: TalkWithTomasResponse = {
        success: true,
        response: jsonExtractionResult.data?.client_response || "",
        userAddress: validatedBody.userAddress,
        timestamp: new Date().toISOString(),
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

  // Tomas require help from Eugenio (Our human lawyer)
  escalateToHumanLawyer: async (c: Context) => {
    let body: EscalateToLawyerRequest | undefined;

    try {
      body = await c.req.json();
      const headers = c.req.header();

      // Validate request
      const validationErrors = validateEscalateToLawyerRequest(body);

      if (validationErrors.length > 0) {
        console.warn(
          "[escalateToHumanLawyer] Validation failed:",
          validationErrors
        );
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
      const validatedBody = body as EscalateToLawyerRequest;

      // Verify that the request comes from an authorized contract
      if (
        !contractVerificationService.verifyContractCall(validatedBody, headers)
      ) {
        return c.json(
          {
            success: false,
            error: "Contract verification failed",
            message:
              "Only the authorized smart contract may access this endpoint",
          },
          403
        );
      }

      // Check for duplicate escalation requests using simple cache
      const now = Date.now();
      const cacheKey = `${validatedBody.userAddress}-${Math.floor(now / (60 * 1000))}`; // 1-minute window

      // Clean expired entries
      for (const [key, value] of escalationCache.entries()) {
        if (now - value.timestamp > CACHE_EXPIRATION_MS) {
          escalationCache.delete(key);
        }
      }

      const existingEscalation = escalationCache.get(cacheKey);

      if (existingEscalation) {
        console.log(
          `[escalateToHumanLawyer] Duplicate escalation detected for case ${validatedBody.userAddress}, returning existing escalation ID: ${existingEscalation.escalationId}`
        );

        const response: EscalateToLawyerResponse = {
          success: true,
          message: "TOMAS_REQUIRE_HELP",
          escalationId: existingEscalation.escalationId,
          timestamp: new Date().toISOString(),
          emailSent: true, // Email was already sent for this escalation
          emailMessageId: "duplicate-prevented",
        };

        return c.json(response);
      }

      // Generate unique escalation ID
      const escalationId = `ESC-${validatedBody.userAddress}-${Date.now()}`;
      const timestamp = new Date().toISOString();

      // Register this escalation to prevent duplicates
      escalationCache.set(cacheKey, {
        escalationId,
        timestamp: now,
      });

      console.log(
        `[escalateToHumanLawyer] Registered escalation for case ${validatedBody.userAddress} with ID ${escalationId}`
      );

      // Send email to Eugenio (Our human lawyer)
      const emailResult = await getEmailServiceManager().sendEscalationEmail({
        userAddress: validatedBody.userAddress,
        escalationId,
        timestamp,
      });

      // Log email result
      if (emailResult.success) {
        console.log(
          `Escalation email sent successfully. Message ID: ${emailResult.messageId}`
        );
      } else {
        console.error(`Failed to send escalation email: ${emailResult.error}`);
      }

      const response: EscalateToLawyerResponse = {
        success: true,
        message: "TOMAS_REQUIRE_HELP",
        escalationId,
        timestamp,
        emailSent: emailResult.success,
        emailMessageId: emailResult.messageId,
      };

      return c.json(response);
    } catch (error) {
      console.error("Error in escalateToLawyer:", error);

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
