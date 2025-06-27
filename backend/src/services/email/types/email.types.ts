// Types
export interface EmailServiceConfig {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
}

export interface EscalationEmailData {
  userAddress: string;
}

export interface EmailServiceResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
