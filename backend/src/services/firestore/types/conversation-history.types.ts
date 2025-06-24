/**
 * Represents a single conversation entry between a user and the agent.
 */
export interface ConversationEntry {
  userAddress: string;
  userMessage: string;
  agentResponse: string;
  timestamp: number;
}
