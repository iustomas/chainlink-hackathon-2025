/**
 * Represents a file stored in the user's vault
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

/**
 * Statistics for the user's vault
 */
export interface VaultStats {
  totalFiles: number;
  totalSizeMB: number;
}

/**
 * Response from the vault API endpoint
 */
export interface VaultResponse {
  status: string;
  message: string;
  address: string;
  files: VaultFile[];
  stats: VaultStats;
  timestamp: string;
}
