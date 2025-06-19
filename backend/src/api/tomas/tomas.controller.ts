// hono
import { Context } from "hono";

// types
import {
  TalkWithTomasRequest,
  TalkWithTomasResponse,
} from "./types/tomas.types.js";

// validator input
import { validateTalkWithTomasPraefatioRequest } from "./validators/tomas.validator.js";

// llm service
import { llmServiceManager } from "../../services/llm/index.js";

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
        const PROVIDER = "gemini";
        const MODEL = "gemini-2.0-flash-exp";

        const llmResponse = await llmServiceManager.generateText(
          {
            prompt: `Usuario: ${body.message}\nCaso ID: ${body.caseId}`,
            systemPrompt: `Eres Tomas, un asistente legal especializado en derecho web3 y blockchain. 
          Responde de manera profesional y útil al usuario. 
          Si no tienes información suficiente, indícalo claramente.`,
            model: MODEL,
          },
          PROVIDER
        );

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
