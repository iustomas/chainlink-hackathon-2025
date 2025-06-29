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

// types
import {
  TomasProposalOptions,
  TomasInvestigatoOptions,
  TomasRespondeoOptions,
} from "./types/tomas.pdf.types.js";

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
      // "logo-black-bg.png"
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

      // Build advanced PDF options with professional cover page
      const pdfOptions: PDFGenerationOptions = {
        content: options.content,
        title: options.title || "Legal Service Proposal",
        author: options.author || "Tomas - AI Legal Assistant",
        subject:
          options.subject ||
          "Artificial Intelligence Services for the Legal Sector",
        keywords: options.keywords || [
          "AI",
          "legal",
          "crypto",
          "web3",
          "onchain",
          "blockchain",
          "automation",
        ],
        pageSize: "A4",
        orientation: "portrait",
        fontSize: 11,
        lineHeight: 1.4,
        margins: 50,
        coverPage: {
          title: options.title || "Legal Service Proposal",
          author: options.author || "Tomas - AI Legal Assistant",
          subtitle:
            options.coverPage?.subtitle ||
            "Transforming Legal Practice with Artificial Intelligence",
          documentType: options.coverPage?.documentType || "Service Proposal",
          clientName: options.userAddress,
          referenceNumber:
            options.coverPage?.referenceNumber || `PROP-${Date.now()}`,
          logo: {
            data: logoData,
            name: "tomas_logo",
            width: 50,
            height: 50,
            format: "png",
          },
          showDate: true,
          customDate: options.customDate || this.getCurrentDate(),
          contactInfo: options.coverPage?.contactInfo || {
            firmName: "Tomas Legal AI",
            address: "Advanced Legal Artificial Intelligence Platform",
            email: "eugenio@iustomas.ai",
            website: "www.iustomas.ai",
          },
          confidentialityNotice: options.coverPage?.confidentialityNotice,
        },
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

          // Upload to Google Cloud Storage
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
            await this.saveDocumentToVault(
              options.userAddress,
              filename,
              cloudStorageUrl,
              result.size,
              "proposal"
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
   * Generate an investigato PDF with cover page and professional formatting
   * @param options - Investigato generation options
   * @returns Promise with PDF generation result including cloud storage URL
   */
  async generatePdfInvestigato(
    options: TomasInvestigatoOptions
  ): Promise<PDFGenerationResult & { cloudStorageUrl?: string }> {
    let tempFilePath: string | undefined;

    try {
      console.log("Generating investigato PDF for Tomas...");

      // Load logo data
      const logoData = await this.loadLogoData();

      // Build advanced PDF options with professional cover page
      const pdfOptions: PDFGenerationOptions = {
        content: options.content,
        title: options.title || "Deep Research Report",
        author: options.author || "Tomas - AI Legal Assistant",
        subject:
          options.subject || "Comprehensive Legal Research and Analysis Report",
        keywords: options.keywords || [
          "AI",
          "legal",
          "crypto",
          "web3",
          "onchain",
          "blockchain",
          "research",
          "investigation",
          "analysis",
        ],
        pageSize: "A4",
        orientation: "portrait",
        fontSize: 11,
        lineHeight: 1.4,
        margins: 50,
        coverPage: {
          title: options.title || "Deep Research Report",
          author: options.author || "Tomas - AI Legal Assistant",
          subtitle:
            options.coverPage?.subtitle ||
            "Comprehensive Legal Research and Analysis",
          documentType: options.coverPage?.documentType || "Research Report",
          clientName:
            options.coverPage?.clientName ||
            "Legal Professionals and Law Firms",
          referenceNumber:
            options.coverPage?.referenceNumber || `RES-${Date.now()}`,
          logo: {
            data: logoData,
            name: "tomas_logo",
            width: 50,
            height: 50,
            format: "png",
          },
          showDate: true,
          customDate: options.customDate || this.getCurrentDate(),
          contactInfo: options.coverPage?.contactInfo || {
            firmName: "Tomas Legal AI",
            address: "Advanced Legal Artificial Intelligence Platform",
            email: "eugenio@iustomas.ai",
            website: "www.iustomas.ai",
          },
          confidentialityNotice: options.coverPage?.confidentialityNotice,
        },
      };

      // Generate PDF using the base service
      const result = await pdfService.generatePDF(pdfOptions);

      // Upload to Google Cloud Storage if uploadToCloud is enabled
      let cloudStorageUrl: string | undefined;
      if (options.uploadToCloud !== false) {
        try {
          const tempDir = os.tmpdir();
          const filename = options.filename || `investigato-${Date.now()}.pdf`;
          tempFilePath = path.join(tempDir, filename);

          await this.saveToLocalFile(result.pdfBytes, tempFilePath);
          console.log(`PDF investigato saved temporarily as: ${tempFilePath}`);

          cloudStorageUrl = await googleCloudStorageService.uploadFile(
            Buffer.from(result.pdfBytes),
            filename,
            "application/pdf"
          );

          console.log(
            `PDF investigato uploaded to cloud storage: ${cloudStorageUrl}`
          );

          // Save to Firestore vault if userAddress is provided
          if (options.userAddress && cloudStorageUrl) {
            await this.saveDocumentToVault(
              options.userAddress,
              filename,
              cloudStorageUrl,
              result.size,
              "investigato"
            );
            console.log(
              `Investigato saved to vault for user: ${options.userAddress}`
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
        `PDF investigato generated successfully: ${result.size} bytes, ${result.pageCount} pages`
      );

      return {
        ...result,
        cloudStorageUrl,
      };
    } catch (error) {
      console.error("Error generating PDF investigato:", error);
      throw new Error(
        `Failed to generate PDF investigato: ${error instanceof Error ? error.message : "Unknown error"}`
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
   * Generate a respondeo PDF with cover page and professional formatting
   * This is the final delivery document for clients
   * @param options - Respondeo generation options
   * @returns Promise with PDF generation result including cloud storage URL
   */
  async generatePdfRespondeo(
    options: TomasRespondeoOptions
  ): Promise<PDFGenerationResult & { cloudStorageUrl?: string }> {
    let tempFilePath: string | undefined;

    try {
      console.log("Generating respondeo PDF for Tomas...");

      // Load logo data
      const logoData = await this.loadLogoData();

      // Build advanced PDF options with professional cover page
      const pdfOptions: PDFGenerationOptions = {
        content: options.content,
        title: options.title || "Legal Response and Analysis",
        author: options.author || "Tomas - AI Legal Assistant",
        subject:
          options.subject || "Comprehensive Legal Response and Case Analysis",
        keywords: options.keywords || [
          "AI",
          "legal",
          "crypto",
          "web3",
          "onchain",
          "blockchain",
          "response",
          "analysis",
          "case",
        ],
        pageSize: "A4",
        orientation: "portrait",
        fontSize: 11,
        lineHeight: 1.4,
        margins: 50,
        coverPage: {
          title: options.title || "Legal Response and Analysis",
          author: options.author || "Tomas - AI Legal Assistant",
          subtitle:
            options.coverPage?.subtitle ||
            "Comprehensive Legal Response and Case Analysis",
          documentType: options.coverPage?.documentType || "Legal Response",
          clientName:
            options.coverPage?.clientName ||
            "Legal Professionals and Law Firms",
          referenceNumber:
            options.coverPage?.referenceNumber || `RESP-${Date.now()}`,
          logo: {
            data: logoData,
            name: "tomas_logo",
            width: 50,
            height: 50,
            format: "png",
          },
          showDate: true,
          customDate: options.customDate || this.getCurrentDate(),
          contactInfo: options.coverPage?.contactInfo || {
            firmName: "Tomas Legal AI",
            address: "Advanced Legal Artificial Intelligence Platform",
            email: "eugenio@iustomas.ai",
            website: "www.iustomas.ai",
          },
          confidentialityNotice: options.coverPage?.confidentialityNotice,
        },
      };

      // Generate PDF using the base service
      const result = await pdfService.generatePDF(pdfOptions);

      // Upload to Google Cloud Storage if uploadToCloud is enabled
      let cloudStorageUrl: string | undefined;
      if (options.uploadToCloud !== false) {
        try {
          const tempDir = os.tmpdir();
          const filename = options.filename || `respondeo-${Date.now()}.pdf`;
          tempFilePath = path.join(tempDir, filename);

          await this.saveToLocalFile(result.pdfBytes, tempFilePath);
          console.log(`PDF respondeo saved temporarily as: ${tempFilePath}`);

          cloudStorageUrl = await googleCloudStorageService.uploadFile(
            Buffer.from(result.pdfBytes),
            filename,
            "application/pdf"
          );

          console.log(
            `PDF respondeo uploaded to cloud storage: ${cloudStorageUrl}`
          );

          // Save to Firestore vault if userAddress is provided
          if (options.userAddress && cloudStorageUrl) {
            await this.saveDocumentToVault(
              options.userAddress,
              filename,
              cloudStorageUrl,
              result.size,
              "respondeo"
            );
            console.log(
              `Respondeo saved to vault for user: ${options.userAddress}`
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
        `PDF respondeo generated successfully: ${result.size} bytes, ${result.pageCount} pages`
      );

      return {
        ...result,
        cloudStorageUrl,
      };
    } catch (error) {
      console.error("Error generating PDF respondeo:", error);
      throw new Error(
        `Failed to generate PDF respondeo: ${error instanceof Error ? error.message : "Unknown error"}`
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
   * Save document to Firestore vault
   * @param userAddress - User's wallet address
   * @param filename - Name of the file
   * @param url - Cloud storage URL
   * @param size - File size in bytes
   * @param documentType - Type of document (proposal, investigato, respondeo)
   */
  private async saveDocumentToVault(
    userAddress: string,
    filename: string,
    url: string,
    size: number,
    documentType: "proposal" | "investigato" | "respondeo"
  ): Promise<void> {
    try {
      const documentConfig = {
        proposal: {
          description: "Legal service proposal generated by Tomas",
          tags: ["proposal", "document"],
        },
        investigato: {
          description: "Dossier report generated by Tomas",
          tags: ["research", "document", "deliverable"],
        },
        respondeo: {
          description: "Final legal response document generated by Tomas",
          tags: ["final", "document", "deliverable"],
        },
      };

      const config = documentConfig[documentType];

      const vaultFile = {
        userAddress,
        name: filename,
        type: "application/pdf",
        url,
        size: Math.round((size / (1024 * 1024)) * 100) / 100,
        timestamp: Date.now(),
        description: config.description,
        tags: config.tags,
        isPublic: false,
      };

      await vaultService.addVaultFile(vaultFile);
    } catch (error) {
      console.error(`Error saving ${documentType} to vault:`, error);
      throw new Error(
        `Failed to save ${documentType} to vault: ${error instanceof Error ? error.message : "Unknown error"}`
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

// Create and export a default instance
export const tomasPdfService = new TomasPDFService();
