import PdfPrinter from "pdfmake";

import {
  PDFGenerationOptions,
  PDFGenerationResult,
  PDFImageData,
  PDFLinkData,
  PDFGraphicData,
  PDFService,
  PDFCoverPageOptions,
} from "./types/pdf.types.js";

/**
 * PDF service implementation using pdfmake
 * Provides functionality to generate PDFs from string content with graphics, fonts, links and images
 */
export class PDFServiceImpl implements PDFService {
  private printer: PdfPrinter;

  constructor() {
    this.printer = new PdfPrinter({
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    });
  }

  /**
   * Generate a PDF from string content with advanced options
   * @param options - PDF generation options
   * @returns Promise with PDF generation result
   */
  async generatePDF(
    options: PDFGenerationOptions
  ): Promise<PDFGenerationResult> {
    try {
      // Prepare images for pdfmake
      const images: Record<string, string> = {};

      // Add cover page logo to images if present
      if (options.coverPage?.logo) {
        const logoName = options.coverPage.logo.name || "cover_logo";
        if (typeof options.coverPage.logo.data === "string") {
          // Check if it's already a data URL
          if (options.coverPage.logo.data.startsWith("data:")) {
            images[logoName] = options.coverPage.logo.data;
          } else {
            // Convert SVG content to base64 data URL
            const svgContent = options.coverPage.logo.data;
            const base64 = Buffer.from(svgContent, "utf8").toString("base64");
            images[logoName] = `data:image/svg+xml;base64,${base64}`;
          }
        } else {
          // Convert Uint8Array to base64
          const base64 = Buffer.from(options.coverPage.logo.data).toString(
            "base64"
          );
          const mimeType = this.getMimeType(options.coverPage.logo.format);
          images[logoName] = `data:${mimeType};base64,${base64}`;
        }
        // Update logo name for reference
        options.coverPage.logo.name = logoName;
      }

      // Add other images
      if (options.images) {
        for (const image of options.images) {
          const imageName =
            image.name || `image_${Math.random().toString(36).substr(2, 9)}`;
          if (typeof image.data === "string") {
            // Check if it's already a data URL
            if (image.data.startsWith("data:")) {
              images[imageName] = image.data;
            } else {
              // Convert SVG content to base64 data URL
              const svgContent = image.data;
              const base64 = Buffer.from(svgContent, "utf8").toString("base64");
              images[imageName] = `data:image/svg+xml;base64,${base64}`;
            }
          } else {
            // Convert Uint8Array to base64
            const base64 = Buffer.from(image.data).toString("base64");
            const mimeType = this.getMimeType(image.format);
            images[imageName] = `data:${mimeType};base64,${base64}`;
          }
        }
      }

      // Create document definition
      const docDefinition: any = {
        pageSize: options.pageSize || "A4",
        pageOrientation: options.orientation || "portrait",
        pageMargins: [
          options.margins || 50,
          options.margins || 50,
          options.margins || 50,
          options.margins || 50,
        ],
        info: {
          title: options.title || "Generated PDF",
          author: options.author || "PDF Service",
          subject: options.subject || "",
          keywords: options.keywords || [],
        },
        content: this.buildContent(options, images),
        images: images,
        defaultStyle: {
          fontSize: options.fontSize || 12,
          lineHeight: options.lineHeight || 1.2,
        },
        styles: {
          coverTitle: {
            fontSize: 36,
            bold: true,
            margin: [0, 200, 0, 20],
            alignment: "center",
          },
          coverAuthor: {
            fontSize: 24,
            margin: [0, 0, 0, 100],
            alignment: "center",
          },
          coverDate: {
            fontSize: 14,
            margin: [0, 50, 0, 0],
            alignment: "right",
          },
          content: {
            fontSize: options.fontSize || 12,
            lineHeight: options.lineHeight || 1.2,
          },
        },
      };

      // Generate PDF
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition);

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        pdfDoc.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        pdfDoc.on("end", () => {
          const pdfBuffer = Buffer.concat(chunks);
          const pdfBytes = new Uint8Array(pdfBuffer);

          resolve({
            pdfBytes,
            pageCount: 1, // pdfmake doesn't provide page count easily
            size: pdfBytes.length,
          });
        });

        pdfDoc.on("error", reject);
        pdfDoc.end();
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error(
        `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Generate a simple PDF from text content
   * @param content - Text content to include
   * @param title - Optional title for the PDF
   * @returns Promise with PDF generation result
   */
  async generateSimplePDF(
    content: string,
    title?: string
  ): Promise<PDFGenerationResult> {
    return this.generatePDF({
      content,
      title,
      pageSize: "A4",
      orientation: "portrait",
      fontSize: 12,
      margins: 50,
    });
  }

  /**
   * Build content array for pdfmake
   * @param options - PDF generation options
   * @param images - Images dictionary
   * @returns Content array for pdfmake
   */
  private buildContent(
    options: PDFGenerationOptions,
    images: Record<string, string>
  ): any[] {
    const content: any[] = [];

    // Add cover page if specified
    if (options.coverPage) {
      content.push(this.buildCoverPage(options.coverPage, images));
    }

    // Add main content
    if (options.content) {
      content.push({
        text: this.processMarkdownText(options.content),
        style: "content",
      });
    }

    // Add links
    if (options.links) {
      content.push(...this.buildLinks(options.links));
    }

    return content;
  }

  /**
   * Build cover page content
   * @param coverPage - Cover page options
   * @param images - Images dictionary
   * @returns Cover page content
   */
  private buildCoverPage(
    coverPage: PDFCoverPageOptions,
    images: Record<string, string>
  ): any {
    const content: any[] = [];

    // Add title
    content.push({
      text: coverPage.title,
      style: "coverTitle",
    });

    // Add author
    content.push({
      text: coverPage.author,
      style: "coverAuthor",
    });

    // Add logo if provided
    if (coverPage.logo && coverPage.logo.name && images[coverPage.logo.name]) {
      content.push({
        image: coverPage.logo.name,
        width: coverPage.logo.width || 100,
        height: coverPage.logo.height || 50,
        alignment: "right",
      });
    }

    // Add date
    if (coverPage.showDate !== false) {
      const dateText =
        coverPage.customDate ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });

      content.push({
        text: dateText,
        style: "coverDate",
      });
    }

    return {
      stack: content,
      pageBreak: "after",
    };
  }

  /**
   * Build links content
   * @param links - Links array
   * @returns Links content array
   */
  private buildLinks(links: PDFLinkData[]): any[] {
    return links.map((link) => ({
      text: link.text,
      link: link.url,
      fontSize: link.fontSize || 12,
      color: "blue",
      decoration: "underline",
    }));
  }

  /**
   * Clean text of problematic characters
   * @param text - Text to clean
   * @returns Cleaned text
   */
  private cleanText(text: string): string {
    return (
      text
        // Replace smart quotes with regular quotes
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        // Replace em dash and en dash with regular dash
        .replace(/—/g, "-")
        .replace(/–/g, "-")
        // Replace other problematic Unicode characters
        .replace(/…/g, "...")
        .replace(/•/g, "-")
        // Handle line breaks and whitespace
        .replace(/\r\n/g, "\n") // Normalize line breaks
        .replace(/\r/g, "\n") // Normalize line breaks
        .replace(/\t/g, " ") // Replace tabs
        .trim()
    ); // Remove leading/trailing whitespace
  }

  /**
   * Process markdown text and convert to pdfmake format
   * @param text - Text with markdown formatting
   * @returns Array of text objects for pdfmake
   */
  private processMarkdownText(text: string): any[] {
    // First clean the text
    const cleanedText = this.cleanText(text);

    // Split by lines to process each line separately
    const lines = cleanedText.split("\n");
    const result: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === "") {
        // Empty line
        result.push({ text: "", margin: [0, 5, 0, 5] });
        continue;
      }

      // Process headers (##, ###, ####)
      if (line.startsWith("##")) {
        const headerMatch = line.match(/^#+/);
        if (headerMatch) {
          const headerLevel = headerMatch[0].length;
          const headerText = line.replace(/^#+\s*/, "").trim();

          const fontSize = headerLevel === 2 ? 18 : headerLevel === 3 ? 16 : 14;
          const margin = headerLevel === 2 ? [0, 20, 0, 10] : [0, 15, 0, 8];

          result.push({
            text: headerText,
            fontSize: fontSize,
            bold: true,
            margin: margin,
            color: "#2c3e50",
          });
          continue;
        }
      }

      // Process lists (- item)
      if (line.trim().startsWith("-")) {
        const listItem = line.replace(/^-\s*/, "").trim();
        result.push({
          text: listItem,
          margin: [20, 2, 0, 2],
          fontSize: 11,
        });
        continue;
      }

      // Process numbered lists (1. item)
      if (/^\d+\.\s/.test(line.trim())) {
        const listItem = line.replace(/^\d+\.\s*/, "").trim();
        result.push({
          text: listItem,
          margin: [20, 2, 0, 2],
          fontSize: 11,
        });
        continue;
      }

      // Process regular text with bold formatting
      const processedLine = this.processBoldText(line);
      if (Array.isArray(processedLine)) {
        // If it's an array of parts, create a text object with the parts
        result.push({
          text: processedLine,
          fontSize: 11,
          margin: [0, 2, 0, 2],
        });
      } else {
        // If it's a single text object, add the formatting
        result.push({
          ...processedLine,
          fontSize: 11,
          margin: [0, 2, 0, 2],
        });
      }
    }

    return result;
  }

  /**
   * Process bold text in a line
   * @param line - Line of text
   * @returns Text object with bold formatting
   */
  private processBoldText(line: string): any {
    // Match **text** or __text__ patterns
    const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
    const parts: any[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        parts.push({
          text: line.substring(lastIndex, match.index),
        });
      }

      // Add bold text
      const boldText = match[1] || match[2]; // Use first or second group
      parts.push({
        text: boldText,
        bold: true,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last match
    if (lastIndex < line.length) {
      parts.push({
        text: line.substring(lastIndex),
      });
    }

    // If no bold text found, return simple text
    if (parts.length === 0) {
      return { text: line };
    }

    // If only one part, return it directly
    if (parts.length === 1) {
      return parts[0];
    }

    // Return array of parts
    return parts;
  }

  /**
   * Get MIME type for image format
   * @param format - Image format
   * @returns MIME type string
   */
  private getMimeType(format: string): string {
    switch (format.toLowerCase()) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "svg":
        return "image/svg+xml";
      default:
        return "image/png";
    }
  }
}
