import { PraefatioAction } from "@/services/json-extractor/types/json-extractor.types.js";

/**
 * Represents a single conversation entry between a user and the agent.
 */
export interface ConversationEntry {
  userAddress: string;
  userMessage: string;
  agentResponse: string;
  tomasReply?: string;
  caseFacts: string[];
  actions: PraefatioAction[];
  sufficiencyScore: number;
  timestamp: number;
  price?: number;
}
