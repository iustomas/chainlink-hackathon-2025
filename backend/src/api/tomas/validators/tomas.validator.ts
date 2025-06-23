import { TalkWithTomasRequest, ValidationError } from "../types/tomas.types.js";

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

export const validateTalkWithTomasPraefatioRequest = (
  body: any
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // First check if body exists
  const bodyErrors = validateRequestBody(body);
  if (bodyErrors.length > 0) {
    return bodyErrors;
  }

  if (!body.caseId) {
    errors.push({
      field: "caseId",
      message: "caseId is required",
    });
  }

  if (!body.message) {
    errors.push({
      field: "message",
      message: "message is required",
    });
  }

  if (body.caseId && typeof body.caseId !== "string") {
    errors.push({
      field: "caseId",
      message: "caseId must be a string",
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

  // Validate caseId format: 0x...-01
  if (body.caseId && typeof body.caseId === "string") {
    const caseIdPattern = /^0x[a-fA-F0-9]{40}-\d+$/;
    if (!caseIdPattern.test(body.caseId)) {
      errors.push({
        field: "caseId",
        message:
          "caseId must follow the format: 0x...-01 (Ethereum address followed by dash and case number)",
      });
    }
  }

  return errors;
};

export function validateEscalateToLawyerRequest(body: any): string[] {
  const errors: string[] = [];

  if (!body) {
    errors.push("Request body is required");
    return errors;
  }

  if (!body.caseId || typeof body.caseId !== "string") {
    errors.push("caseId is required and must be a string");
  }

  if (!body.contractAddress || typeof body.contractAddress !== "string") {
    errors.push("contractAddress is required and must be a string");
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(body.contractAddress)) {
    errors.push("contractAddress must be a valid EVM address");
  }

  if (!body.signature || typeof body.signature !== "string") {
    errors.push("signature is required and must be a string");
  }

  if (!body.timestamp || typeof body.timestamp !== "string") {
    errors.push("timestamp is required and must be a string");
  }

  return errors;
}

// Export types for use in other files
export type { TalkWithTomasRequest, ValidationError };
