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
}
