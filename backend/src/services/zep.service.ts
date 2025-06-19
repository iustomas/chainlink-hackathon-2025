// zep sdk
import { ZepClient } from "@getzep/zep-cloud";
import type { Message as ZepMessage } from "@getzep/zep-cloud/api";

const API_KEY = process.env.ZEP_API_KEY;

// Initialize Zep client
const client = new ZepClient({
  apiKey: API_KEY,
});

/**
 * ZepService handles storing conversations in ZEP memory.
 * userId: Ethereum address (string)
 * sessionId: caseId (string)
 */
export class ZepService {
  /**
   * Ensure the user exists in ZEP. If already exists, this is a no-op.
   */
  static async ensureUser(userId: string) {
    // ZEP requires email, firstName, lastName, but we only have address
    // We'll use address as email and leave names empty
    try {
      await client.user.add({
        userId,
        email: `${userId}@tomasweb3.test`,
        firstName: "",
        lastName: "",
      });
    } catch (err: any) {
      if (err?.message && err.message.includes("already exists")) return;
      throw err;
    }
  }

  /**
   * Ensure the session exists in ZEP. If already exists, this is a no-op.
   */
  static async ensureSession(userId: string, sessionId: string) {
    try {
      await client.memory.addSession({
        sessionId,
        userId,
      });
    } catch (err: any) {
      if (err?.message && err.message.includes("already exists")) return;
      throw err;
    }
  }

  /**
   * Add messages to a session in ZEP.
   * @param userId - Ethereum address
   * @param sessionId - caseId
   * @param messages - Array of messages (role, content, roleType)
   */
  static async addMessages(
    userId: string,
    sessionId: string,
    messages: ZepMessage[]
  ) {
    await this.ensureUser(userId);
    await this.ensureSession(userId, sessionId);
    await client.memory.add(sessionId, { messages });
  }
}
