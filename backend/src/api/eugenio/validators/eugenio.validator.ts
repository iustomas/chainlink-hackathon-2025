import {
  JustTalkWithLLMRequest,
  ValidationError,
} from "../types/eugenio.types.js";

// validation function to check if body exists
export const validateRequestBody = (body: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!body) {
    errors.push({
      field: "body",
      message: "Request body is required",
    });
  }

  return errors;
};

// validation function
export const validateJustTalkWithLLMRequest = (
  body: JustTalkWithLLMRequest
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // First check if body exists
  const bodyErrors = validateRequestBody(body);
  if (bodyErrors.length > 0) {
    return bodyErrors;
  }

  if (!body.message) {
    errors.push({
      field: "message",
      message: "message is required",
    });
  }

  if (body.message && typeof body.message !== "string") {
    errors.push({
      field: "message",
      message: "message must be a string",
    });
  }

  if (body.message && body.message.trim().length === 0) {
    errors.push({
      field: "message",
      message: "message cannot be empty",
    });
  }

  return errors;
};
