// Export PDF service and types
export * from "./pdf.service.js";
export * from "./types/pdf.types.js";

// Create and export a default instance
import { PDFServiceImpl } from "./pdf.service.js";

/**
 * Default PDF service instance
 */
export const pdfService = new PDFServiceImpl();
