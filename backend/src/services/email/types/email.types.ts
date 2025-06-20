// Types
export interface EmailServiceConfig {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
}

export interface EscalationEmailData {
  caseId: string;
  escalationId: string;

  timestamp: string;
}

export interface EmailServiceResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
