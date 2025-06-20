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
  JustTalkWithLLMRequest,
  JustTalkWithLLMResponse,
} from "./types/eugenio.types.js";

// validator input
import { validateJustTalkWithLLMRequest } from "./validators/eugenio.validator.js";

// llm service
import { llmServiceManager } from "../../services/llm/index.js";
import { PROVIDERS, MODELS } from "../../services/llm/lllm.constants.js";

// read personality file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const personalityPath = join(
  __dirname,
  "../../../agent/memories/personality-tomas-web3.md"
);
const systemPromptPath = join(
  __dirname,
  "../../../agent/system-prompts/praefatio.md"
);

const personality = readFileSync(personalityPath, "utf-8");
const systemPromptPraefatio = readFileSync(systemPromptPath, "utf-8");

// controller
export const eugenioController = {
  // just talk with llm
  justTalkWithLLM: async (c: Context) => {
    let body: JustTalkWithLLMRequest | undefined;

    try {
      body = await c.req.json();

      // Validate request
      const validationErrors = validateJustTalkWithLLMRequest(
        body as JustTalkWithLLMRequest
      );

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
      const validatedBody = body as JustTalkWithLLMRequest;

      // Get business context and build system prompt
      let systemPrompt = `
        Your instructions are as follows:\n${systemPromptPraefatio}\n
        Your personality is as follows:\n${personality}\n        
        `;

      // Generate LLM response
      const PROVIDER = PROVIDERS.GEMINI;
      const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

      const llmResponse = await llmServiceManager.generateText(
        {
          prompt: `
            ${validatedBody.message}          
          `,
          systemPrompt,
          model: MODEL,
        },
        PROVIDER
      );

      const response: JustTalkWithLLMResponse = {
        success: true,
        response: llmResponse.content,
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
        const response: JustTalkWithLLMResponse = {
          success: true,
          response: `LLM has received your message. This is the start of the discovery phase. (Fallback response - LLM service not available)`,
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
};
