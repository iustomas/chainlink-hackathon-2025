// path
import path from "path";

// fs
import fs from "fs/promises";

// pdf service
import { pdfService, PDFGenerationOptions } from "../services/pdf/index.js";

/**
 * Example usage of the PDF service with long text, bold formatting and logo
 */
async function exampleUsage() {
  try {
    console.log(
      "Generating advanced PDF with long text, bold formatting and logo..."
    );

    // Read the logo file (PNG as buffer)
    const logoPath = path.join(
      process.cwd(),
      "src",
      "assets",
      "logo",
      "logo-black-bg.png"
    );
    let logoData: Buffer;

    try {
      logoData = await fs.readFile(logoPath);
      console.log("Logo loaded successfully");
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
      logoData = Buffer.from(placeholderData);
    }

    const longText = `**Intelligent Legal Service Proposal**

This document presents a **comprehensive proposal** for an artificial intelligence-based legal assistance service that revolutionizes the way legal professionals and their clients interact with legal information.

## **Main Service Features**

### **1. Intelligent Document Analysis**
Our system uses **advanced natural language processing algorithms** to analyze complex legal documents. It can automatically identify:
- **Important clauses** and critical contractual terms
- **Legal risks** in commercial agreements
- **Inconsistencies** in legal documentation
- **Optimization opportunities** in contracts and agreements

### **2. Automatic Summary Generation**
The service generates **executive summaries** of extensive legal documents, highlighting:
- **Key points** of each section
- **Main obligations** of the involved parties
- **Critical dates** and important deadlines
- **Legal consequences** of non-compliance

### **3. Legal Research Assistance**
Our platform provides **advanced research tools** that include:
- **Semantic search** in legal databases
- **Case law analysis** of relevant jurisprudence
- **Case comparison** of similar situations
- **Identification of important legal precedents**

## **Benefits for Legal Professionals**

### **Operational Efficiency**
Lawyers can **significantly reduce time** spent on repetitive tasks such as:
- Manual review of extensive contracts
- Search for specific legal information
- Preparation of executive summaries
- Contractual risk analysis

### **Accuracy and Consistency**
The system ensures **consistent results** and **high accuracy** in:
- Identification of critical legal terms
- Risk and opportunity analysis
- Legal documentation generation
- Regulatory compliance

### **Service Scalability**
The platform allows law firms to **handle greater volume** of cases without compromising service quality, facilitating:
- **Business growth** without proportional increases in staff
- **Simultaneous attention** to multiple clients
- **Optimization of human and technological resources**

## **Practical Applications**

### **Corporate Law**
- **Merger and acquisition analysis**
- **Commercial contract review**
- **Automated due diligence**
- **Regulatory compliance**

### **Labor Law**
- **Employment contract analysis**
- **Corporate policy evaluation**
- **Labor conflict management**
- **Labor regulation compliance**

### **Civil Law**
- **Purchase and sale contract review**
- **Lease agreement analysis**
- **Civil liability evaluation**
- **Succession management**

## **Technology and Security**

### **Advanced Infrastructure**
Our system uses **cutting-edge technologies** including:
- **Machine Learning** specialized in legal language
- **Natural language processing** adapted to legal context
- **Semantic analysis algorithms** for deep understanding
- **Intelligent recommendation systems**

### **Security and Confidentiality**
We guarantee **maximum security** in handling sensitive information:
- **End-to-end encryption** of all data
- **GDPR compliance** and data protection regulations
- **Regular security audits**
- **Controlled access** and multi-factor authentication

## **Implementation and Support**

### **Implementation Process**
Our team provides **complete support** during implementation:
- **Custom configuration** according to specific needs
- **Staff training** in platform usage
- **Secure migration** of existing data
- **Integration** with current systems

### **Continuous Support**
We offer **specialized technical support** that includes:
- **24/7 assistance** for technical queries
- **Regular system updates**
- **Continuous improvements** based on user feedback
- **Additional training** according to emerging needs

## **Investment and Return**

### **Transparent Pricing Model**
Our pricing model is designed to **maximize return on investment**:
- **Scalable prices** according to usage volume
- **No hidden costs** or additional charges
- **Free trial periods**
- **Discounts** for long-term commitments

### **Expected Return on Investment**
Clients can expect **significant improvements** in:
- **60-80% reduction** in document review time
- **40-60% increase** in case handling capacity
- **30-50% improvement** in legal analysis accuracy
- **25-40% reduction** in operational costs

## **Conclusion**

This **revolutionary platform** represents the future of legal practice, combining **human expertise** with **technological efficiency** to provide superior legal services. We invite your organization to be part of this **digital transformation** of the legal sector.

For more information on how we can **customize this solution** for your specific needs, please do not hesitate to contact us. We are committed to the **success of your legal practice** and ready to demonstrate the tangible value our platform can bring to your organization.`;

    const advancedOptions: PDFGenerationOptions = {
      content: longText,
      title: "Intelligent Legal Service Proposal",
      author: "Tomas - AI Legal Assistant",
      subject: "Artificial Intelligence Services for the Legal Sector",
      keywords: [
        "AI",
        "legal",
        "automation",
        "analysis",
        "contracts",
        "efficiency",
      ],
      pageSize: "A4",
      orientation: "portrait",
      fontSize: 11,
      lineHeight: 1.4,
      margins: 50,
      coverPage: {
        title: "Intelligent Legal Service Proposal",
        author: "Tomas - AI Legal Assistant",
        subtitle: "Transforming Legal Practice with Artificial Intelligence",
        documentType: "Service Proposal",
        clientName: "Law Firms and Legal Professionals",
        // referenceNumber: "PROP-2025-001",
        logo: {
          data: logoData,
          name: "logo",
          width: 40,
          height: 40,
          format: "png",
        },
        showDate: true,
        customDate: "June 2025",
        contactInfo: {
          firmName: "Tomas Legal AI",
          address: "Advanced Legal Artificial Intelligence Platform",
          // phone: "+1 (555) 123-4567",
          email: "eugenio@iustomas.ai",
          website: "www.iustomas.ai",
        },
        // confidentialityNotice: "Este documento contiene información confidencial y está destinado únicamente al destinatario especificado.",
      },
      links: [
        {
          text: "More information about our services",
          url: "https://iustomas.ai",
          fontSize: 12,
        },
        {
          text: "Contact for inquiries",
          url: "mailto:eugenio@iustomas.ai",
          fontSize: 12,
        },
      ],
    };

    const advancedResult = await pdfService.generatePDF(advancedOptions);
    await fs.writeFile("propuesta-servicio-legal.pdf", advancedResult.pdfBytes);

    console.log(
      `PDF generado exitosamente: ${advancedResult.size} bytes, ${advancedResult.pageCount} páginas`
    );
    console.log("Archivo guardado como: propuesta-servicio-legal.pdf");
  } catch (error) {
    console.error("Error generando PDF:", error);
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleUsage();
}

/**
 * Example usage of Tomas PDF service with professional cover page
 */
async function exampleTomasPDF() {
  try {
    console.log("Generating Tomas PDF with professional cover page...");

    // Import Tomas PDF service
    const { tomasPdfService } = await import("../services/pdf/index.js");

    const proposalContent = `**Legal Service Proposal**

This document presents a comprehensive proposal for our AI-powered legal assistance services.

## **Service Overview**

Our advanced AI system provides:

### **1. Document Analysis**
- Automated contract review
- Risk assessment
- Compliance checking

### **2. Legal Research**
- Case law analysis
- Precedent identification
- Regulatory updates

### **3. Document Generation**
- Contract drafting
- Legal briefs
- Compliance reports

## **Benefits**

- **60-80% time reduction** in document review
- **40-60% increase** in case handling capacity
- **30-50% improvement** in accuracy
- **25-40% reduction** in operational costs

## **Technology Stack**

- **Machine Learning** specialized in legal language
- **Natural Language Processing** for document understanding
- **Semantic Analysis** for deep comprehension
- **Secure Cloud Infrastructure** with end-to-end encryption

## **Implementation**

Our team provides complete support including:
- Custom configuration
- Staff training
- Data migration
- System integration

## **Pricing**

Transparent pricing model with:
- Scalable pricing based on usage
- No hidden costs
- Free trial periods
- Long-term commitment discounts

## **Conclusion**

This revolutionary platform represents the future of legal practice, combining human expertise with technological efficiency.`;

    const result = await tomasPdfService.generatePdfProposal({
      userAddress: "0x1234567890123456789012345678901234567890",
      content: proposalContent,
      title: "AI-Powered Legal Services Proposal",
      author: "Tomas - AI Legal Assistant",
      customDate: "June 2025",
      coverPage: {
        subtitle: "Revolutionizing Legal Practice with Artificial Intelligence",
        documentType: "Professional Service Proposal",
        clientName: "Innovative Law Firm",
        referenceNumber: "PROP-2025-001",
        contactInfo: {
          firmName: "Tomas Legal AI",
          address: "Advanced Legal Artificial Intelligence Platform",
          phone: "+1 (555) 123-4567",
          email: "eugenio@iustomas.ai",
          website: "www.iustomas.ai",
        },
      },
      filename: "tomas-proposal-example.pdf",
      uploadToCloud: false, // Set to true to upload to cloud storage
    });

    console.log(
      `Tomas PDF generated successfully: ${result.size} bytes, ${result.pageCount} pages`
    );
    console.log("File saved as: tomas-proposal-example.pdf");

    if (result.cloudStorageUrl) {
      console.log(`Cloud storage URL: ${result.cloudStorageUrl}`);
    }
  } catch (error) {
    console.error("Error generating Tomas PDF:", error);
  }
}

export { exampleUsage, exampleTomasPDF };
