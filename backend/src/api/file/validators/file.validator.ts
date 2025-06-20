export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate PDF file upload request using FormData
 * @param data - Object containing file and caseId from FormData
 * @returns ValidationError[] - Array of validation errors
 */
export const validatePdfFileUpload = (data: {
  file: File | null;
  caseId: string | null;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  const { file, caseId } = data;

  // Check if file exists
  if (!file) {
    errors.push({
      field: "file",
      message: "PDF file is required",
    });
    return errors;
  }

  // Check if caseId exists
  if (!caseId) {
    errors.push({
      field: "caseId",
      message: "caseId is required",
    });
  }

  // Validate caseId format if provided
  if (caseId && typeof caseId === "string") {
    const caseIdPattern = /^0x[a-fA-F0-9]{40}-\d+$/;
    if (!caseIdPattern.test(caseId)) {
      errors.push({
        field: "caseId",
        message:
          "caseId must follow the format: 0x...-01 (Ethereum address followed by dash and case number)",
      });
    }
  }

  // Check file type
  if (file.type !== "application/pdf") {
    errors.push({
      field: "file",
      message: "Only PDF files are allowed",
    });
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    errors.push({
      field: "file",
      message: "File size must be less than 10MB",
    });
  }

  return errors;
};
