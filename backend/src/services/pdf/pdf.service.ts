import PdfPrinter from "pdfmake";

import {
  PDFGenerationOptions,
  PDFGenerationResult,
  PDFLinkData,
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
            if (image.data.startsWith("data:")) {
              images[imageName] = image.data;
            } else {
              const svgContent = image.data;
              const base64 = Buffer.from(svgContent, "utf8").toString("base64");
              images[imageName] = `data:image/svg+xml;base64,${base64}`;
            }
          } else {
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
          alignment: "justify",
        },
        footer: function (currentPage: number, pageCount: number) {
          const leftMargin = 50;
          const rightMargin = 50;
          const pageWidth = 595.28;

          return {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: leftMargin,
                    y1: 0,
                    x2: pageWidth - rightMargin,
                    y2: 0,
                    lineWidth: 1,
                    lineColor: "#AAAAAA",
                  },
                ],
                margin: [0, 10, 0, 0],
              },
              {
                text:
                  currentPage === 1
                    ? [
                        {
                          text: "Tomas from iustomas.ai and Affiliates",
                          fontSize: 8,
                          color: "#AAAAAA",
                          margin: [0, -2, 0, 0],
                        },
                      ]
                    : [
                        {
                          text: currentPage.toString() + "  ",
                          bold: true,
                          fontSize: 10,
                          color: "#2C3E50",
                        },
                        {
                          text: "Tomas from iustomas.ai and Affiliates",
                          fontSize: 8,
                          color: "#AAAAAA",
                          margin: [0, -3, 0, 0],
                        },
                      ],
                alignment: "center",
                margin: [0, 8, 0, 0],
              },
            ],
            margin: [0, 0, 0, 0],
          };
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
            alignment: "justify",
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
            pageCount: 1,
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
      content.push(...this.processMarkdownText(options.content));
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

    // Add decorative header line
    content.push({
      canvas: [
        {
          type: "line",
          x1: 50,
          y1: 0,
          x2: 545,
          y2: 0,
          lineWidth: 2,
          lineColor: "#2C3E50",
        },
      ],
      margin: [0, 0, 0, 35],
    });

    // Add logo if provided (positioned at top right)
    if (coverPage.logo && coverPage.logo.name && images[coverPage.logo.name]) {
      content.push({
        image: coverPage.logo.name,
        width: coverPage.logo.width || 100,
        height: coverPage.logo.height || 50,
        alignment: "right",
        margin: [0, 0, 0, 50],
      });
    }

    // Add document type (if provided)
    if (coverPage.documentType) {
      content.push({
        text: coverPage.documentType,
        fontSize: 13,
        color: "#7F8C8D",
        alignment: "center",
        margin: [0, 0, 0, 20],
        italics: true,
      });
    }

    // Add main title
    content.push({
      text: coverPage.title,
      fontSize: 30,
      bold: true,
      alignment: "center",
      margin: [0, 0, 0, 25],
      color: "#2C3E50",
    });

    // Add subtitle if provided
    if (coverPage.subtitle) {
      content.push({
        text: coverPage.subtitle,
        fontSize: 15,
        alignment: "center",
        margin: [0, 0, 0, 30],
        color: "#34495E",
        italics: true,
      });
    }

    // Add decorative separator (centered)
    content.push({
      canvas: [
        {
          type: "line",
          x1: 175,
          y1: 0,
          x2: 420,
          y2: 0,
          lineWidth: 1,
          lineColor: "#BDC3C7",
        },
      ],
      margin: [0, 0, 0, 30],
    });

    // Add author/firm name
    content.push({
      text: coverPage.author,
      fontSize: 19,
      bold: true,
      alignment: "center",
      margin: [0, 0, 0, 25],
      color: "#2C3E50",
    });

    // Add client name if provided
    if (coverPage.clientName) {
      content.push({
        text: `Prepared for: ${coverPage.clientName}`,
        fontSize: 13,
        alignment: "center",
        margin: [0, 0, 0, 20],
        color: "#34495E",
      });
    }

    // Add reference number if provided
    if (coverPage.referenceNumber) {
      content.push({
        text: `Reference: ${coverPage.referenceNumber}`,
        fontSize: 11,
        alignment: "center",
        margin: [0, 0, 0, 30],
        color: "#7F8C8D",
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
        fontSize: 13,
        alignment: "center",
        margin: [0, 0, 0, 40],
        color: "#34495E",
      });
    }

    // Add contact information section (balanced)
    if (coverPage.contactInfo) {
      const contactStack: any[] = [];

      if (coverPage.contactInfo.firmName) {
        contactStack.push({
          text: coverPage.contactInfo.firmName,
          fontSize: 15,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 8],
          color: "#2C3E50",
        });
      }

      if (coverPage.contactInfo.address) {
        contactStack.push({
          text: coverPage.contactInfo.address,
          fontSize: 11,
          alignment: "center",
          margin: [0, 0, 0, 4],
          color: "#7F8C8D",
        });
      }

      if (coverPage.contactInfo.phone) {
        contactStack.push({
          text: `Tel: ${coverPage.contactInfo.phone}`,
          fontSize: 11,
          alignment: "center",
          margin: [0, 0, 0, 4],
          color: "#7F8C8D",
        });
      }

      if (coverPage.contactInfo.email) {
        contactStack.push({
          text: coverPage.contactInfo.email,
          fontSize: 11,
          alignment: "center",
          margin: [0, 0, 0, 4],
          color: "#7F8C8D",
        });
      }

      if (coverPage.contactInfo.website) {
        contactStack.push({
          text: coverPage.contactInfo.website,
          fontSize: 11,
          alignment: "center",
          margin: [0, 0, 0, 20],
          color: "#7F8C8D",
        });
      }

      if (contactStack.length > 0) {
        content.push({
          stack: contactStack,
          margin: [0, 0, 0, 30],
        });
      }
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
      alignment: "justify",
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
        // Empty line - add proper spacing
        result.push({ text: "", margin: [0, 8, 0, 8] });
        continue;
      }

      // Process headers (#, ##, ###, ####)
      if (line.match(/^#+\s/)) {
        const headerMatch = line.match(/^#+/);
        if (headerMatch) {
          const headerLevel = headerMatch[0].length;
          const headerText = line.replace(/^#+\s*/, "").trim();

          const fontSize =
            headerLevel === 1
              ? 24
              : headerLevel === 2
                ? 18
                : headerLevel === 3
                  ? 16
                  : 14;
          const margin =
            headerLevel === 1
              ? [0, 25, 0, 15]
              : headerLevel === 2
                ? [0, 20, 0, 10]
                : [0, 15, 0, 8];

          result.push({
            text: headerText,
            fontSize: fontSize,
            bold: true,
            margin: margin,
            color: "#2c3e50",
            alignment: "left",
          });
          continue;
        }
      }

      // Process lists (- item)
      if (line.trim().startsWith("-")) {
        const listItem = line.replace(/^-\s*/, "").trim();
        const processedItem = this.processBoldText(listItem);
        result.push({
          text: processedItem,
          margin: [20, 3, 0, 3],
          fontSize: 11,
          alignment: "justify",
        });
        continue;
      }

      // Process lists (* item)
      if (line.trim().startsWith("*")) {
        const listItem = line.replace(/^\*\s*/, "").trim();
        const processedItem = this.processBoldText(listItem);
        result.push({
          text: processedItem,
          margin: [20, 3, 0, 3],
          fontSize: 11,
          alignment: "justify",
        });
        continue;
      }

      // Process numbered lists (1. item)
      if (/^\d+\.\s/.test(line.trim())) {
        const listItem = line.replace(/^\d+\.\s*/, "").trim();
        const processedItem = this.processBoldText(listItem);
        result.push({
          text: processedItem,
          margin: [20, 3, 0, 3],
          fontSize: 11,
          alignment: "justify",
        });
        continue;
      }

      // Process regular text with bold formatting
      const processedLine = this.processBoldText(line);
      result.push({
        text: processedLine,
        fontSize: 11,
        margin: [0, 3, 0, 3],
        alignment: "justify",
      });
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
