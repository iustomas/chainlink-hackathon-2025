export interface Metadata {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface CaseFacts {
  facts: string[];
  summary: string;
  [key: string]: any;
}

export interface ClientProfile {
  name: string;
  email?: string;
  preferences?: Record<string, any>;
  [key: string]: any;
}

export interface DialogueTurn {
  messageNumber: number;
  user: string;
  llm: string;
  timestamp: string;
}

export interface DialogueHistory {
  turns: DialogueTurn[];
}

export interface CurrentHypothesis {
  hypothesis: string;
  confidence: number;
  [key: string]: any;
}

export interface SessionStatus {
  status: "active" | "completed" | "error";
  lastAction: string;
  [key: string]: any;
}

export interface CognitiveVectors {
  case_facts: CaseFacts;
  client_profile: ClientProfile;
  dialogue_history: DialogueHistory;
  current_hypothesis: CurrentHypothesis;
  session_status: SessionStatus;
}

export interface ECU {
  metadata: Metadata;
  cognitive_vectors: CognitiveVectors;
}