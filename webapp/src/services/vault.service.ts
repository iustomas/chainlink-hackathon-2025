// types
import { VaultResponse } from "@/types/vault.types";

/**
 * Service for handling vault-related API calls
 */
export class VaultService {
  private baseUrl: string;

  constructor() {
    // In production, this would come from environment variables
    this.baseUrl = "http://localhost:3000";
  }

  /**
   * Fetches vault files for a specific user address
   * @param userAddress - The user's wallet address
   * @returns Promise<VaultResponse> - The vault data
   */
  async getUserVaultFiles(userAddress: string): Promise<VaultResponse> {
    const response = await fetch(
      `${this.baseUrl}/vault?userAddress=${userAddress}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const vaultService = new VaultService();
