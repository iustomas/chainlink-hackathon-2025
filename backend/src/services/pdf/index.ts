// Export PDF service and types
export * from "./pdf.service.js";
export * from "./types/pdf.types.js";
export * from "./tomas.pdf.service.js";

// Create and export a default instance
import { PDFServiceImpl } from "./pdf.service.js";
import { tomasPdfService } from "./tomas.pdf.service.js";

/**
 * Default PDF service instance
 */
export const pdfService = new PDFServiceImpl();

/**
 * Default Tomas PDF service instance for legal proposals
 */
export { tomasPdfService };
