// Types for Eugenio API

export interface ValidationError {
  field: string;
  message: string;
}

export interface JustTalkWithLLMRequest {
  message: string;
}

export interface JustTalkWithLLMResponse {
  success: boolean;
  response: string;
  timestamp: string;
}
