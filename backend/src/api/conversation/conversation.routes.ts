// hono
import { Hono } from "hono";

// controllers
import { conversationController } from "./conversation.controller.js";

const conversationRoutes = new Hono();

/**
 * DELETE /conversation/delete-all-conversation-history?address=0x...
 * Deletes all conversation history for a specific user address.
 *
 * Query Parameters:
 * - address: User's wallet address (must be valid EVM address starting with 0x)
 *
 * Example: DELETE /conversation/delete-all-conversation-history?address=0x1234567890abcdef...
 *
 * Response:
 * {
 *   "status": "success",
 *   "message": "All conversation history deleted successfully",
 *   "address": "0x1234567890abcdef...",
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
conversationRoutes.delete(
  "/delete-all-conversation-history",
  conversationController.deleteAllConversationHistory
);

export { conversationRoutes };
