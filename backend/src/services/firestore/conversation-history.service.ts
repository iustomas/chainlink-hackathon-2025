// firestore
import { Firestore } from "@google-cloud/firestore";

// types
import { ConversationEntry } from "./types/conversation-history.types.js";
import { PraefatioAction } from "../json-extractor/types/json-extractor.types.js";

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
   * @param actions - The actions to be taken (PraefatioAction[])
   * @param sufficiencyScore - The sufficiency score (number, optional)
   * @returns Promise<void>
   */
  async addConversationAndExtractedFacts(
    userAddress: string,
    userMessage: string,
    agentResponse: string,
    extractedFacts: string[],
    actions: PraefatioAction[],
    sufficiencyScore?: number
  ): Promise<void> {
    const entry: ConversationEntry = {
      userAddress,
      userMessage,
      agentResponse,
      caseFacts: extractedFacts,
      actions: actions ?? [], // <-- asegura que nunca sea undefined
      sufficiencyScore: sufficiencyScore ?? 0,
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

  async deleteAllConversationHistory(userAddress: string): Promise<void> {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where("userAddress", "==", userAddress)
      .get();

    const batch = this.firestore.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

// Export singleton instance
export const conversationHistoryService = new ConversationHistoryService();
