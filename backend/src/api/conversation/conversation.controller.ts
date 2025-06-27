// hono
import { Context } from "hono";

// services
import { conversationHistoryService } from "../../services/firestore/conversation-history.service.js";

// validators
import { validateAddressAndReturnResponse } from "./validators/conversation.validator.js";

// controller
export const conversationController = {
  getConversationHistoryAndLastExtractedFacts: async (c: Context) => {
    const address = c.req.query("address");

    const validationResult = validateAddressAndReturnResponse(c, address);

    if (!validationResult.isValid) {
      return validationResult.response;
    }

    const conversationHistoryComplete =
      await conversationHistoryService.getConversationHistory(
        validationResult.address
      );

    const lastExtractedFacts =
      conversationHistoryComplete?.[conversationHistoryComplete.length - 1]
        ?.caseFacts || [];

    const conversationHistory = conversationHistoryComplete.map((item) => {
      return {
        message: item?.userMessage,
        response: item?.agentResponse,
        timestamp: item?.timestamp,
      };
    });

    const price =
      conversationHistoryComplete?.[conversationHistoryComplete.length - 1]
        ?.price;

    return c.json({
      status: "success",
      message:
        "Conversation history and last extracted facts retrieved successfully",
      address: validationResult.address,
      conversation: conversationHistory,
      caseFacts: lastExtractedFacts,
      ...(price !== undefined && price !== null && { price }),
    });
  },

  /**
   * Deletes all conversation history for a specific user address.
   * @param c - Hono context
   * @returns JSON response with status and message
   */
  deleteAllConversationHistory: async (c: Context) => {
    try {
      const address = c.req.query("address");

      // Validate address and handle error response if needed
      const validationResult = validateAddressAndReturnResponse(c, address);

      if (!validationResult.isValid) {
        return validationResult.response;
      }

      await conversationHistoryService.deleteAllConversationHistory(
        validationResult.address
      );

      return c.json({
        status: "success",
        message: "All conversation history deleted successfully",
        address: validationResult.address,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error deleting conversation history:", error);

      return c.json(
        {
          status: "error",
          message: "Failed to delete conversation history",
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  },
};
