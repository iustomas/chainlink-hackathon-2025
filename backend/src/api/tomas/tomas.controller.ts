// hono
import { Context } from "hono";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// types
import {
  TalkWithTomasRequest,
  TalkWithTomasResponse,
} from "./types/tomas.types.js";

// validator input
import { validateTalkWithTomasPraefatioRequest } from "./validators/tomas.validator.js";

// llm service
import { llmServiceManager } from "../../services/llm/index.js";
import { PROVIDERS, MODELS } from "../../services/llm/lllm.constants.js";

// zep service
import { ZepService } from "../../services/zep.service.js";
import type { RoleType } from "@getzep/zep-cloud/api";

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
  // talk with tomas praefatio endpoint
  talkWithTomasPraefatio: async (c: Context) => {
    try {
      const body: TalkWithTomasRequest = await c.req.json();

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

      try {
        const PROVIDER = PROVIDERS.GEMINI;
        const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

        const llmResponse = await llmServiceManager.generateText(
          {
            prompt: `User message: ${body.message}\nCase ID: ${body.caseId}`,
            systemPrompt: `
            Your personality is as follows:\n${personality}\n
            
            You are Tomas, a legal assistant specialized in web3 and blockchain law. Always respond to the user in a professional, clear, and helpful manner. If you do not have enough information to answer, state this explicitly.`,
            model: MODEL,
          },
          PROVIDER
        );

        // Extract user address from caseId (format: 0x...-01)
        const [userId] = body.caseId.split("-");
        const sessionId = body.caseId;

        // Prepare ZEP messages
        const zepMessages = [
          {
            role: userId,
            content: body.message,
            roleType: "user" as RoleType,
          },
          {
            role: "Tomas",
            content: llmResponse.content,
            roleType: "assistant" as RoleType,
          },
        ];

        // Store conversation in ZEP
        await ZepService.addMessages(userId, sessionId, zepMessages);

        const response: TalkWithTomasResponse = {
          success: true,
          response: llmResponse.content,
          caseId: body.caseId,
          timestamp: new Date().toISOString(),
        };

        return c.json(response);
      } catch (llmError) {
        console.error("LLM service error:", llmError);

        // Fallback response if LLM service fails
        const response: TalkWithTomasResponse = {
          success: true,
          response: `Tomas ha recibido tu mensaje para el caso ${body.caseId}. Este es el inicio de la fase de descubrimiento. (Respuesta de respaldo - servicio LLM no disponible)`,
          caseId: body.caseId,
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
