// firestore
import { Firestore } from "@google-cloud/firestore";

// types
import { ConversationEntry } from "./types/conversation-history.types.js";

/**
 * Service for handling conversation history in Firestore.
 */
export class ConversationHistoryService {
  private firestore: Firestore;
  private collectionName: string;

  constructor() {
    this.firestore = new Firestore();
    this.collectionName = "tomas-conversation-history";
  }

  /**
   * Adds a conversation entry to the user's history and the extracted facts from the agent response.
   * @param userAddress - The user's address (string)
   * @param userMessage - The message sent by the user (string)
   * @param agentResponse - The response from the agent (string)
   * @param extractedFacts - The extracted facts from the agent response ([string])
   * @returns Promise<void>
   */
  async addConversationAndExtractedFacts(
    userAddress: string,
    userMessage: string,
    agentResponse: string,
    extractedFacts: string[]
  ): Promise<void> {
    const entry: ConversationEntry = {
      userAddress,
      userMessage,
      agentResponse,
      caseFacts: extractedFacts,
      timestamp: Date.now(),
    };

    await this.firestore.collection(this.collectionName).add(entry);
  }

  /**
   * Retrieves the full conversation history for a user, ordered by timestamp ascending.
   * @param userAddress - The user's address (string)
   * @returns Promise<ConversationEntry[]> - Array of conversation entries
   */
  async getConversationHistory(
    userAddress: string
  ): Promise<ConversationEntry[]> {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where("userAddress", "==", userAddress)
      .orderBy("timestamp", "asc")
      .get();

    return snapshot.docs.map((doc) => doc.data() as ConversationEntry);
  }
}

// Export singleton instance
export const conversationHistoryService = new ConversationHistoryService();
