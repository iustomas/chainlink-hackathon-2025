// Types for Tomas API

export interface ValidationError {
  field: string;
  message: string;
}

export interface TalkWithTomasRequest {
  userAddress: string;
  message: string;
}

export interface TalkWithTomasResponse {
  success: boolean;
  response: string;
  userAddress: string;
  timestamp: string;
  caseFacts?: string[];
}

export interface ScriptumRequest {
  userAddress: string;
  contractAddress: string;
  timestamp: string;
  escalateToHumanLawyer: boolean;
}

export interface EscalateToLawyerRequest {
  userAddress: string;
  contractAddress: string;
  signature: string;
  timestamp: string;
  nonce: string;
}

export interface EscalateToLawyerResponse {
  success: boolean;
  message: string;
  escalationId?: string;
  timestamp: string;
  emailSent?: boolean;
  emailMessageId?: string;
}
