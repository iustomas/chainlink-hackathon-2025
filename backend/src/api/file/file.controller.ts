// hono
import { Context } from "hono";

// crypto
import { randomUUID } from "crypto";

// services
import { googleCloudStorageService } from "../../services/storage/google-cloud-storage.service.js";

// types
import { UploadPdfFileResponse } from "./types/file.types.js";

// validator input
import { validatePdfFileUpload } from "./validators/file.validator.js";

/**
 * Controller for file upload endpoints
 */
export const fileController = {
  /**
   * Upload PDF file endpoint
   * @param c - Hono context
   * @returns JSON response with file upload result
   */
  uploadPdfFile: async (c: Context) => {
    try {
      // Get the multipart form data
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const caseId = formData.get("caseId") as string;

      // Validate the request
      const validationErrors = validatePdfFileUpload({ file, caseId });

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

      // Check if file is a PDF
      if (file.type !== "application/pdf") {
        return c.json(
          {
            success: false,
            error: "Only PDF files are allowed",
          },
          400
        );
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return c.json(
          {
            success: false,
            error: "File size exceeds maximum limit of 10MB",
          },
          400
        );
      }

      // Generate unique filename
      const fileExtension = file.name.split(".").pop();
      const uniqueFileName = `${caseId}/${randomUUID()}.${fileExtension}`;

      // Convert file to buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Upload to Google Cloud Storage
      const fileUrl = await googleCloudStorageService.uploadFile(
        fileBuffer,
        uniqueFileName,
        file.type
      );

      const response: UploadPdfFileResponse = {
        success: true,
        fileUrl,
        fileName: file.name,
        caseId,
        timestamp: new Date().toISOString(),
        size: file.size,
      };

      return c.json(response);
    } catch (error) {
      console.error("Error in uploadPdfFile:", error);

      // Check if it's a storage service error
      if (error instanceof Error && error.message?.includes("GCS")) {
        return c.json(
          {
            success: false,
            error: "File upload failed. Please try again later.",
          },
          500
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
