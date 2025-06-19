// Types for Tomas API

export interface ValidationError {
  field: string;
  message: string;
}

export interface TalkWithTomasRequest {
  caseId: string;
  message: string;
}

export interface TalkWithTomasResponse {
  success: boolean;
  response: string;
  caseId: string;
  timestamp: string;
}
