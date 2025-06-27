// hono
import { Hono } from "hono";

// controllers
import { conversationController } from "./conversation.controller.js";

const conversationRoutes = new Hono();

conversationRoutes.get(
  "/get-conversation-history-and-last-extracted-facts",
  conversationController.getConversationHistoryAndLastExtractedFacts
);

conversationRoutes.delete(
  "/delete-all-conversation-history",
  conversationController.deleteAllConversationHistory
);

export { conversationRoutes };
