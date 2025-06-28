// path
import path from "path";

// fs
import fs from "fs/promises";

// pdf service
import {
  pdfService,
  PDFGenerationOptions,
  PDFGenerationResult,
} from "./index.js";

/**
 * Tomas PDF Service - Specialized wrapper for generating legal documents
 * Provides functionality to generate professional legal documents PDFs with cover pages
 */
export class TomasPDFService {
  private logoPath: string;

  constructor() {
    this.logoPath = path.join(
      process.cwd(),
      "src",
      "assets",
      "logo",
      "black.png"
    );
  }

  /**
   * Generate a legal proposal PDF with cover page and professional formatting
   * @param options - Proposal generation options
   * @returns Promise with PDF generation result
   */
  async generatePdfProposal(
    options: TomasProposalOptions
  ): Promise<PDFGenerationResult> {
    try {
      console.log("Generating legal proposal PDF for Tomas...");

      // Load logo data
      const logoData = await this.loadLogoData();

      // Build advanced PDF options with cover page
      const pdfOptions: PDFGenerationOptions = {
        content: options.content,
        title: options.title || "Legal Service Proposal",
        author: options.author || "Tomas - Crypto/Onchain Legal Assistant",
        subject:
          options.subject ||
          "Artificial Intelligence Services for the Crypto/Onchain Legal Sector",
        keywords: options.keywords || [
          "AI",
          "legal",
          "crypto",
          "web3",
          "onchain",
          "blockchain",
        ],
        pageSize: "Legal",
        orientation: "portrait",
        fontSize: 11,
        lineHeight: 1.4,
        margins: 50,
        coverPage: {
          title: options.title || "Legal Service Proposal",
          author: options.author || "Tomas - Crypto/Onchain Legal Assistant",
          logo: {
            data: logoData,
            name: "tomas_logo",
            width: 120,
            height: 60,
            format: "png",
          },
          showDate: true,
          customDate: options.customDate || this.getCurrentDate(),
        },
        links: options.links || [
          {
            text: "More information about our services",
            url: "https://tomas-legal-ai.com",
            fontSize: 12,
          },
          {
            text: "Contact for inquiries",
            url: "mailto:contacto@tomas-legal-ai.com",
            fontSize: 12,
          },
        ],
      };

      // Generate PDF using the base service
      const result = await pdfService.generatePDF(pdfOptions);

      // Save to local file if filename is provided
      if (options.filename) {
        await this.saveToLocalFile(result.pdfBytes, options.filename);
        console.log(`PDF proposal saved as: ${options.filename}`);
      }

      console.log(
        `PDF proposal generated successfully: ${result.size} bytes, ${result.pageCount} pages`
      );

      return result;
    } catch (error) {
      console.error("Error generating PDF proposal:", error);
      throw new Error(
        `Failed to generate PDF proposal: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Load logo data from file
   * @returns Buffer with logo data or placeholder
   */
  private async loadLogoData(): Promise<Buffer> {
    try {
      const logoData = await fs.readFile(this.logoPath);
      console.log("Logo loaded successfully");
      return logoData;
    } catch (error) {
      console.warn("Could not read logo file, using placeholder:", error);
      // Create a simple placeholder image if logo is not found
      const placeholderData = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
        0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xcf, 0x00,
        0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb0, 0x00, 0x00, 0x00,
        0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);
      return Buffer.from(placeholderData);
    }
  }

  /**
   * Save PDF bytes to local file
   * @param pdfBytes - PDF data as Uint8Array
   * @param filename - Filename to save as
   */
  private async saveToLocalFile(
    pdfBytes: Uint8Array,
    filename: string
  ): Promise<void> {
    try {
      await fs.writeFile(filename, pdfBytes);
    } catch (error) {
      console.error("Error saving PDF to local file:", error);
      throw new Error(
        `Failed to save PDF to local file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get current date in Spanish format
   * @returns Formatted date string
   */
  private getCurrentDate(): string {
    const now = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  }
}

/**
 * Options for generating Tomas legal proposals
 */
export interface TomasProposalOptions {
  /** The proposal content (supports markdown formatting) */
  content: string;
  /** Title of the proposal */
  title?: string;
  /** Author name */
  author?: string;
  /** Subject of the proposal */
  subject?: string;
  /** Keywords for the proposal */
  keywords?: string[];
  /** Custom date for the cover page */
  customDate?: string;
  /** Links to include in the proposal */
  links?: Array<{
    text: string;
    url: string;
    fontSize?: number;
  }>;
  /** Filename to save the PDF locally */
  filename?: string;
}

// Create and export a default instance
export const tomasPdfService = new TomasPDFService();
