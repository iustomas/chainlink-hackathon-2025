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
  /** Professional cover page options */
  coverPage?: {
    /** Subtitle for the cover page */
    subtitle?: string;
    /** Document type (e.g., "Service Proposal", "Legal Analysis") */
    documentType?: string;
    /** Client name (if applicable) */
    clientName?: string;
    /** Reference number */
    referenceNumber?: string;
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
    /** Confidentiality notice */
    confidentialityNotice?: string;
  };
}

export interface TomasInvestigatoOptions {
  /** User address */
  userAddress: string;
  /** The proposal content (supports markdown formatting) */
  content: string;
  /** Title of the proposal */
  title?: string;
  /** Author name */
  author?: string;
  /** Subject of the investigato report */
  subject?: string;
  /** Keywords for the investigato report */
  keywords?: string[];
  /** Custom date for the cover page */
  customDate?: string;
  /** Links to include in the investigato report */
  links?: Array<{
    text: string;
    url: string;
    fontSize?: number;
  }>;
  /** Filename to save the PDF locally */
  filename?: string;
  /** Whether to upload the PDF to Google Cloud Storage */
  uploadToCloud?: boolean;
  /** Professional cover page options */
  coverPage?: {
    /** Subtitle for the cover page */
    subtitle?: string;
    /** Document type (e.g., "Deep Research Report", "Legal Investigation") */
    documentType?: string;
    /** Client name (if applicable) */
    clientName?: string;
    /** Reference number */
    referenceNumber?: string;
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
    /** Confidentiality notice */
    confidentialityNotice?: string;
  };
}

export interface TomasRespondeoOptions {
  /** User address */
  userAddress: string;
  /** The response content (supports markdown formatting) */
  content: string;
  /** Title of the response */
  title?: string;
  /** Author name */
  author?: string;
  /** Subject of the response */
  subject?: string;
  /** Keywords for the response */
  keywords?: string[];
  /** Custom date for the cover page */
  customDate?: string;
  /** Links to include in the response */
  links?: Array<{
    text: string;
    url: string;
    fontSize?: number;
  }>;
  /** Filename to save the PDF locally */
  filename?: string;
  /** Whether to upload the PDF to Google Cloud Storage */
  uploadToCloud?: boolean;
  /** Professional cover page options */
  coverPage?: {
    /** Subtitle for the cover page */
    subtitle?: string;
    /** Document type (e.g., "Legal Response", "Case Analysis") */
    documentType?: string;
    /** Client name (if applicable) */
    clientName?: string;
    /** Reference number */
    referenceNumber?: string;
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
    /** Confidentiality notice */
    confidentialityNotice?: string;
  };
}
