// hono
import { Context } from "hono";

// types
import {
  TalkWithTomasRequest,
  TalkWithTomasResponse,
} from "./types/tomas.types.js";

// validator input
import { validateTalkWithTomasPraefatioRequest } from "./validators/tomas.validator.js";

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

      // TODO: Integrate with tomas-web3 AI agent
      // For now, return a mock response
      const response: TalkWithTomasResponse = {
        success: true,
        response: `Tomas ha recibido tu mensaje para el caso ${body.caseId}. Este es el inicio de la fase de descubrimiento.`,
        caseId: body.caseId,
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
