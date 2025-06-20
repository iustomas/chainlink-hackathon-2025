// crypto
import { createHmac } from "crypto";

// types
import { EscalateToLawyerRequest } from "../../api/tomas/types/tomas.types.js";

/**
 * Service for verifying contract calls and signatures
 */
export class ContractVerificationService {
  private readonly secretKey: string;
  private readonly allowedContracts: Set<string>;
  private readonly maxTimestampDiff: number = 300; // 5 minutes

  constructor(secretKey: string, allowedContracts: string[] = []) {
    this.secretKey = secretKey;
    this.allowedContracts = new Set(allowedContracts);
  }

  /**
   * Verify that the request comes from an authorized contract
   * @param request The escalation request
   * @returns True if verification passes, false otherwise
   */
  public verifyContractCall(request: EscalateToLawyerRequest): boolean {
    try {
      // 1. Verify timestamp is recent
      if (!this.verifyTimestamp(request.timestamp)) {
        console.log("Contract verification failed: Invalid timestamp");
        return false;
      }

      // 2. Verify contract address is allowed
      if (!this.verifyContractAddress(request.contractAddress)) {
        console.log("Contract verification failed: Unauthorized contract");
        return false;
      }

      // 3. Verify signature
      if (!this.verifySignature(request)) {
        console.log("Contract verification failed: Invalid signature");
        return false;
      }

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
   * Verify that the contract address is in the allowed list
   * @param contractAddress The contract address to verify
   * @returns True if contract is allowed
   */
  private verifyContractAddress(contractAddress: string): boolean {
    // If no allowed contracts are specified, allow all
    if (this.allowedContracts.size === 0) {
      return true;
    }
    return this.allowedContracts.has(contractAddress.toLowerCase());
  }

  /**
   * Verify the signature of the request
   * @param request The request to verify
   * @returns True if signature is valid
   */
  private verifySignature(request: EscalateToLawyerRequest): boolean {
    try {
      // Create the message that was signed
      const message = this.createMessage(request);

      // Create expected signature
      const expectedSignature = this.createSignature(message);

      // Compare signatures
      return request.signature === expectedSignature;
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  /**
   * Create the message that should be signed
   * @param request The request data
   * @returns The message string
   */
  private createMessage(request: EscalateToLawyerRequest): string {
    return `${request.caseId}:${request.contractAddress}:${request.timestamp}:${request.nonce}`;
  }

  /**
   * Create a signature for the given message
   * @param message The message to sign
   * @returns The signature
   */
  private createSignature(message: string): string {
    const hmac = createHmac("sha256", this.secretKey);
    hmac.update(message);
    return hmac.digest("hex");
  }

  /**
   * Add a contract to the allowed list
   * @param contractAddress The contract address to allow
   */
  public addAllowedContract(contractAddress: string): void {
    this.allowedContracts.add(contractAddress.toLowerCase());
  }

  /**
   * Remove a contract from the allowed list
   * @param contractAddress The contract address to remove
   */
  public removeAllowedContract(contractAddress: string): void {
    this.allowedContracts.delete(contractAddress.toLowerCase());
  }

  /**
   * Get all allowed contracts
   * @returns Array of allowed contract addresses
   */
  public getAllowedContracts(): string[] {
    return Array.from(this.allowedContracts);
  }
}

// Create singleton instance
const secretKey =
  process.env.CONTRACT_VERIFICATION_SECRET ||
  "default-secret-key-change-in-production";
const allowedContracts = process.env.ALLOWED_CONTRACTS
  ? process.env.ALLOWED_CONTRACTS.split(",").map((addr) => addr.trim())
  : [];

export const contractVerificationService = new ContractVerificationService(
  secretKey,
  allowedContracts
);
