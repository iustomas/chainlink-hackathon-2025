/**
 * Represents a file stored in the user's vault.
 */
export interface VaultFile {
  userAddress: string;
  name: string;
  type: string;
  url: string;
  size: number; // Size in MB
  timestamp: number;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}
