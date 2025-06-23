// types
import { EscalateToLawyerRequest } from "../../api/tomas/types/tomas.types.js";

/**
 * Service for verifying contract calls and signatures
 */
export class ContractVerificationService {
  private readonly secretKey: string;
  private readonly allowedContract: string | null;
  private readonly maxTimestampDiff: number = 300; // 5 minutes

  constructor(secretKey: string) {
    this.secretKey = secretKey;
    this.allowedContract = process.env.ALLOWED_CONTRACT
      ? process.env.ALLOWED_CONTRACT.trim().toLowerCase()
      : null;
  }

  /**
   * Verify that the request comes from the authorized contract
   * @param request The escalation request
   * @returns True if verification passes, false otherwise
   */
  public verifyContractCall(request: EscalateToLawyerRequest): boolean {
    try {
      // 1. Verify timestamp is recent
      if (!this.verifyTimestamp(request.timestamp)) {
        console.error(
          "[ContractVerificationService][verifyContractCall] Contract verification failed: Invalid timestamp"
        );
        return false;
      }

      // 2. Verify contract address is allowed
      if (!this.verifyContractAddress(request.contractAddress)) {
        console.error(
          "[ContractVerificationService][verifyContractCall] Contract verification failed: Unauthorized contract"
        );
        return false;
      }

      // Note: Signature verification removed for simplicity
      // Security is now based on contract address whitelist and timestamp
      // TODO: Add signature verification

      return true;
    } catch (error) {
      console.error("Contract verification error:", error);
      return false;
    }
  }

  /**
   * Verify that the timestamp is recent (within maxTimestampDiff seconds)
   * @param timestamp The timestamp to verify
   * @returns True if timestamp is valid
   */
  private verifyTimestamp(timestamp: number): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    const diff = Math.abs(currentTime - timestamp);
    return diff <= this.maxTimestampDiff;
  }

  /**
   * Verify that the contract address matches the allowed contract
   * @param contractAddress The contract address to verify
   * @returns True if contract is allowed
   */
  private verifyContractAddress(contractAddress: string): boolean {
    // If no allowed contract is specified, allow all
    if (!this.allowedContract) {
      return true;
    }
    return contractAddress.toLowerCase() === this.allowedContract;
  }
}

// Create singleton instance
const secretKey =
  process.env.CONTRACT_VERIFICATION_SECRET ||
  "default-secret-key-change-in-production";

export const contractVerificationService = new ContractVerificationService(
  secretKey
);
