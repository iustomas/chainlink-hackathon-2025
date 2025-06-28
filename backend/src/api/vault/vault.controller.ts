// hono
import { Context } from "hono";

// services
import { vaultService } from "../../services/firestore/vault.service.js";

// validators
import { validateAddressAndReturnResponse } from "./validators/vault.validator.js";

// controller
export const vaultController = {
  /**
   * Retrieves all files for a specific user from their vault.
   * @param c - Hono context
   * @returns JSON response with user's vault files
   */
  getUserVaultFiles: async (c: Context) => {
    try {
      const userAddress = c.req.query("userAddress");

      // Validate address and handle error response if needed
      const validationResult = validateAddressAndReturnResponse(c, userAddress);

      if (!validationResult.isValid) {
        return validationResult.response;
      }

      const vaultFiles = await vaultService.getUserVaultFiles(
        validationResult.address
      );

      const totalSize = await vaultService.getUserVaultTotalSize(
        validationResult.address
      );

      const fileCount = await vaultService.getUserVaultFileCount(
        validationResult.address
      );

      return c.json({
        status: "success",
        message: "User vault files retrieved successfully",
        address: validationResult.address,
        files: vaultFiles,
        stats: {
          totalFiles: fileCount,
          totalSizeMB: totalSize,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error retrieving vault files:", error);

      return c.json(
        {
          status: "error",
          message: "Failed to retrieve vault files",
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  },
};
