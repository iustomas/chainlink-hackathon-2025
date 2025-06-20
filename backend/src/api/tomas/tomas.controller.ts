// hono
import { Context } from "hono";

// fs
import { readFileSync } from "fs";

// path
import { join, dirname } from "path";

// url
import { fileURLToPath } from "url";

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

// read personality file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const personalityPath = join(
  __dirname,
  "../../../agent/memories/personality-tomas-web3.md"
);
const personality = readFileSync(personalityPath, "utf-8");

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

      // Extract user address from caseId (format: 0x...-01)
      const [userId] = validatedBody.caseId.split("-");
      const sessionId = validatedBody.caseId;

      // Get business context and build system prompt
      let systemPrompt = `
        Your personality is as follows:\n${personality}\n
        
        You are Tomas, a legal assistant specialized in web3 and blockchain law. Always respond to the user in a professional, clear, and helpful manner. If you do not have enough information to answer, state this explicitly.`;

      // Generate LLM response
      const PROVIDER = PROVIDERS.GEMINI;
      const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

      const llmResponse = await llmServiceManager.generateText(
        {
          prompt: `
            User message: ${validatedBody.message}          
          `,
          systemPrompt,
          model: MODEL,
        },
        PROVIDER
      );

      const response: TalkWithTomasResponse = {
        success: true,
        response: llmResponse.content,
        caseId: validatedBody.caseId,
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
            body?.caseId || "unknown"
          }. This is the start of the discovery phase. (Fallback response - LLM service not available)`,
          caseId: body?.caseId || "unknown",
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
  escalateToLawyer: async (c: Context) => {
    let body: EscalateToLawyerRequest | undefined;

    try {
      body = await c.req.json();

      // Validate request
      const validationErrors = validateEscalateToLawyerRequest(body);

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
      const validatedBody = body as EscalateToLawyerRequest;

      // Verify that the request comes from an authorized contract
      if (!contractVerificationService.verifyContractCall(validatedBody)) {
        return c.json(
          {
            success: false,
            error: "Contract verification failed",
            message: "Unauthorized contract call",
          },
          403
        );
      }

      // Generate unique escalation ID
      const escalationId = `ESC-${validatedBody.caseId}-${Date.now()}`;

      const response: EscalateToLawyerResponse = {
        success: true,
        message: "TOMAS_REQUIRE_HELP",
        escalationId,
        timestamp: new Date().toISOString(),
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
