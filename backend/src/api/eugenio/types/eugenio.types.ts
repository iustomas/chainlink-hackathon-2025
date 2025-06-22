// Types for Eugenio API

export interface ValidationError {
  field: string;
  message: string;
}

export interface JustTalkWithLLMRequest {
  message: string;
  sessionId?: string;
}

export interface JustTalkWithLLMResponse {
  success: boolean;
  response: string;
  timestamp: string;
  ecu?: any;      // O usa el tipo ECU si lo tienes
  actions?: any;  // O usa el tipo correcto si lo tienes
}
