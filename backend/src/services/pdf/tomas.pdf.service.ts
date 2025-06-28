// path
import path from "path";

// fs
import fs from "fs/promises";

// os
import os from "os";

// pdf service
import {
  pdfService,
  PDFGenerationOptions,
  PDFGenerationResult,
} from "./index.js";

// storage service
import { googleCloudStorageService } from "../storage/google-cloud-storage.service.js";

// vault service
import { vaultService } from "../firestore/vault.service.js";

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
   * @returns Promise with PDF generation result including cloud storage URL
   */
  async generatePdfProposal(
    options: TomasProposalOptions
  ): Promise<PDFGenerationResult & { cloudStorageUrl?: string }> {
    let tempFilePath: string | undefined;

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

      // Upload to Google Cloud Storage if uploadToCloud is enabled
      let cloudStorageUrl: string | undefined;
      if (options.uploadToCloud !== false) {
        try {
          const tempDir = os.tmpdir();
          const filename = options.filename || `proposal-${Date.now()}.pdf`;
          tempFilePath = path.join(tempDir, filename);

          await this.saveToLocalFile(result.pdfBytes, tempFilePath);
          console.log(`PDF proposal saved temporarily as: ${tempFilePath}`);

          cloudStorageUrl = await googleCloudStorageService.uploadFile(
            Buffer.from(result.pdfBytes),
            filename,
            "application/pdf"
          );

          console.log(
            `PDF proposal uploaded to cloud storage: ${cloudStorageUrl}`
          );

          // Save to Firestore vault if userAddress is provided
          if (options.userAddress && cloudStorageUrl) {
            await this.saveProposalToVault(
              options.userAddress,
              filename,
              cloudStorageUrl,
              result.size
            );
            console.log(
              `Proposal saved to vault for user: ${options.userAddress}`
            );
          }

          // Delete temporary file after successful upload
          await this.deleteLocalFile(tempFilePath);
          console.log(`Temporary file deleted: ${tempFilePath}`);
          tempFilePath = undefined; // Clear the path since file is deleted
        } catch (uploadError) {
          console.error("Error uploading PDF to cloud storage:", uploadError);
        }
      }

      console.log(
        `PDF proposal generated successfully: ${result.size} bytes, ${result.pageCount} pages`
      );

      return {
        ...result,
        cloudStorageUrl,
      };
    } catch (error) {
      console.error("Error generating PDF proposal:", error);
      throw new Error(
        `Failed to generate PDF proposal: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      if (tempFilePath) {
        try {
          await this.deleteLocalFile(tempFilePath);
          console.log(`Cleaned up temporary file: ${tempFilePath}`);
        } catch (cleanupError) {
          console.error("Error cleaning up temporary file:", cleanupError);
        }
      }
    }
  }

  /**
   * Save proposal to Firestore vault
   * @param userAddress - User's wallet address
   * @param filename - Name of the file
   * @param url - Cloud storage URL
   * @param size - File size in bytes
   */
  private async saveProposalToVault(
    userAddress: string,
    filename: string,
    url: string,
    size: number
  ): Promise<void> {
    try {
      const vaultFile = {
        userAddress,
        name: filename,
        type: "application/pdf",
        url,
        size: Math.round((size / (1024 * 1024)) * 100) / 100,
        timestamp: Date.now(),
        description: "Legal service proposal generated by Tomas",
        tags: ["proposal", "document"],
        isPublic: false,
      };

      await vaultService.addVaultFile(vaultFile);
    } catch (error) {
      console.error("Error saving proposal to vault:", error);
      throw new Error(
        `Failed to save proposal to vault: ${error instanceof Error ? error.message : "Unknown error"}`
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
   * @param filepath - Full file path to save as
   */
  private async saveToLocalFile(
    pdfBytes: Uint8Array,
    filepath: string
  ): Promise<void> {
    try {
      await fs.writeFile(filepath, pdfBytes);
    } catch (error) {
      console.error("Error saving PDF to local file:", error);
      throw new Error(
        `Failed to save PDF to local file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Delete local file
   * @param filepath - Full file path to delete
   */
  private async deleteLocalFile(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error("Error deleting local file:", error);
      throw new Error(
        `Failed to delete local file: ${error instanceof Error ? error.message : "Unknown error"}`
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
  /** User address */
  userAddress: string;
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
  /** Whether to upload the PDF to Google Cloud Storage */
  uploadToCloud?: boolean;
}

// Create and export a default instance
export const tomasPdfService = new TomasPDFService();
