// hono
import { Context } from "hono";

// services
import { conversationHistoryService } from "../../services/firestore/conversation-history.service.js";

// controller
export const conversationController = {
  /**
   * Deletes all conversation history for a specific user address.
   * @param c - Hono context
   * @returns JSON response with status and message
   */
  deleteAllConversationHistory: async (c: Context) => {
    try {
      const address = c.req.query("address");

      if (!address) {
        return c.json(
          {
            status: "error",
            message: "Address query parameter is required",
          },
          400
        );
      }

      // Validate EVM address format
      if (!address.startsWith("0x") || address.length !== 42) {
        return c.json(
          {
            status: "error",
            message:
              "Invalid EVM address format. Address must start with '0x' and be 42 characters long",
            address,
          },
          400
        );
      }

      // Additional validation: check if it's a valid hex string
      const hexRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!hexRegex.test(address)) {
        return c.json(
          {
            status: "error",
            message:
              "Invalid EVM address. Address must be a valid hexadecimal string",
            address,
          },
          400
        );
      }

      await conversationHistoryService.deleteAllConversationHistory(address);

      return c.json({
        status: "success",
        message: "All conversation history deleted successfully",
        address,
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
