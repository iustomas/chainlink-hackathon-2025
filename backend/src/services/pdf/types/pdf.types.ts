/**
 * Options for PDF generation using pdfmake
 */
export interface PDFGenerationOptions {
  /** The text content to include in the PDF */
  content: string;
  /** Title of the PDF document */
  title?: string;
  /** Author of the PDF document */
  author?: string;
  /** Subject of the PDF document */
  subject?: string;
  /** Keywords for the PDF document */
  keywords?: string[];
  /** Page size (default: A4) */
  pageSize?: "A4" | "A3" | "Letter" | "Legal";
  /** Page orientation (default: portrait) */
  orientation?: "portrait" | "landscape";
  /** Font size for the main content (default: 12) */
  fontSize?: number;
  /** Line height multiplier (default: 1.2) */
  lineHeight?: number;
  /** Margins in points (default: 50) */
  margins?: number;
  /** Custom font data (optional) */
  customFont?: Uint8Array;
  /** Images to include in the PDF */
  images?: PDFImageData[];
  /** Links to include in the PDF */
  links?: PDFLinkData[];
  /** Graphics to include in the PDF */
  graphics?: PDFGraphicData[];
  /** Cover page options */
  coverPage?: PDFCoverPageOptions;
}

/**
 * Cover page options for PDF
 */
export interface PDFCoverPageOptions {
  /** Title for the cover page */
  title: string;
  /** Author name */
  author: string;
  /** Subtitle for the cover page */
  subtitle?: string;
  /** Logo image data */
  logo?: PDFImageData;
  /** Show date on cover page */
  showDate?: boolean;
  /** Custom date text */
  customDate?: string;
  /** Contact information */
  contactInfo?: {
    /** Firm name */
    firmName?: string;
    /** Address */
    address?: string;
    /** Phone number */
    phone?: string;
    /** Email address */
    email?: string;
    /** Website */
    website?: string;
  };
  /** Document type (e.g., "Propuesta de Servicios", "Análisis Legal") */
  documentType?: string;
  /** Client name (if applicable) */
  clientName?: string;
  /** Reference number */
  referenceNumber?: string;
  /** Confidentiality notice */
  confidentialityNotice?: string;
}

/**
 * Image data for PDF inclusion
 */
export interface PDFImageData {
  /** Image data as Uint8Array or base64 string */
  data: Uint8Array | string;
  /** X position on page */
  x?: number;
  /** Y position on page */
  y?: number;
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** Image format */
  format: "png" | "jpg" | "jpeg" | "svg";
  /** Image name for reference */
  name?: string;
}

/**
 * Link data for PDF inclusion
 */
export interface PDFLinkData {
  /** Text to display as link */
  text: string;
  /** URL to link to */
  url: string;
  /** Font size for the link */
  fontSize?: number;
  /** Style for the link */
  style?: string;
}

/**
 * Graphic data for PDF inclusion
 */
export interface PDFGraphicData {
  /** Type of graphic */
  type: "rectangle" | "circle" | "line";
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width (for rectangle) or radius (for circle) */
  width?: number;
  /** Height (for rectangle) */
  height?: number;
  /** End X position (for line) */
  endX?: number;
  /** End Y position (for line) */
  endY?: number;
  /** Fill color (hex string) */
  fillColor?: string;
  /** Stroke color (hex string) */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
}

/**
 * Result of PDF generation
 */
export interface PDFGenerationResult {
  /** Generated PDF as Uint8Array */
  pdfBytes: Uint8Array;
  /** Number of pages in the PDF */
  pageCount: number;
  /** Size of the PDF in bytes */
  size: number;
}

/**
 * PDF service interface
 */
export interface PDFService {
  /**
   * Generate a PDF from string content with options
   * @param options - PDF generation options
   * @returns Promise with PDF generation result
   */
  generatePDF(options: PDFGenerationOptions): Promise<PDFGenerationResult>;

  /**
   * Generate a simple PDF from text content
   * @param content - Text content to include
   * @param title - Optional title for the PDF
   * @returns Promise with PDF generation result
   */
  generateSimplePDF(
    content: string,
    title?: string
  ): Promise<PDFGenerationResult>;
}
