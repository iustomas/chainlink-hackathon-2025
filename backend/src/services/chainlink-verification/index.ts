// crypto
import { createHmac } from "crypto";

// types
import { EscalateToLawyerRequest } from "../../api/tomas/types/tomas.types.js";

/**
 * Service for verifying Chainlink Functions calls
 * Implements multiple security layers to ensure calls come from Chainlink Functions
 */
export class ChainlinkVerificationService {
  private chainlinkApiKey: string;
  private readonly chainlinkIPs: Set<string>;
  private readonly maxTimestampDiff: number = 300; // 5 minutes
  private readonly chainlinkPublicKey: string;

  constructor(
    chainlinkApiKey: string,
    chainlinkPublicKey: string,
    allowedIPs: string[] = []
  ) {
    this.chainlinkApiKey = chainlinkApiKey;
    this.chainlinkPublicKey = chainlinkPublicKey;
    this.chainlinkIPs = new Set(allowedIPs);
  }

  /**
   * Verify that the request comes from Chainlink Functions
   * @param request The escalation request
   * @param clientIP The client IP address
   * @param headers The request headers
   * @returns True if verification passes, false otherwise
   */
  public verifyChainlinkCall(
    request: EscalateToLawyerRequest,
    clientIP: string,
    headers: Record<string, string>
  ): boolean {
    try {
      // 1. Verify IP address is from Chainlink Functions
      if (!this.verifyIPAddress(clientIP)) {
        console.log("Chainlink verification failed: Invalid IP address");
        return false;
      }

      // 2. Verify API key
      if (!this.verifyAPIKey(headers)) {
        console.log("Chainlink verification failed: Invalid API key");
        return false;
      }

      // 3. Verify timestamp is recent
      if (!this.verifyTimestamp(request.timestamp)) {
        console.log("Chainlink verification failed: Invalid timestamp");
        return false;
      }

      // 4. Verify signature (if provided)
      if (
        headers["x-chainlink-signature"] &&
        !this.verifySignature(request, headers)
      ) {
        console.log("Chainlink verification failed: Invalid signature");
        return false;
      }

      // 5. Verify request format matches Chainlink Functions
      if (!this.verifyRequestFormat(request)) {
        console.log("Chainlink verification failed: Invalid request format");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Chainlink verification error:", error);
      return false;
    }
  }

  /**
   * Verify that the IP address is from Chainlink Functions
   * @param clientIP The client IP address
   * @returns True if IP is allowed
   */
  private verifyIPAddress(clientIP: string): boolean {
    // If no IPs are configured, allow all (for development)
    if (this.chainlinkIPs.size === 0) {
      console.log("Warning: No Chainlink IPs configured, allowing all IPs");
      return true;
    }

    return this.chainlinkIPs.has(clientIP);
  }

  /**
   * Verify the API key from headers
   * @param headers The request headers
   * @returns True if API key is valid
   */
  private verifyAPIKey(headers: Record<string, string>): boolean {
    const apiKey = headers["x-chainlink-api-key"] || headers["authorization"];

    if (!apiKey) {
      return false;
    }

    // Remove "Bearer " prefix if present
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "");

    return cleanApiKey === this.chainlinkApiKey;
  }

  /**
   * Verify that the timestamp is recent
   * @param timestamp The timestamp to verify
   * @returns True if timestamp is valid
   */
  private verifyTimestamp(timestamp: number): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    const diff = Math.abs(currentTime - timestamp);
    return diff <= this.maxTimestampDiff;
  }

  /**
   * Verify the signature from Chainlink Functions
   * @param request The escalation request
   * @param headers The request headers
   * @returns True if signature is valid
   */
  private verifySignature(
    request: EscalateToLawyerRequest,
    headers: Record<string, string>
  ): boolean {
    const signature = headers["x-chainlink-signature"];

    if (!signature) {
      return false;
    }

    try {
      // Create the message that was signed
      const message = this.createSignMessage(request);

      // Verify the signature using Chainlink's public key
      // This is a simplified version - in production you'd use proper crypto verification
      const expectedSignature = this.generateExpectedSignature(message);

      return signature === expectedSignature;
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  /**
   * Create the message that should be signed by Chainlink Functions
   * @param request The escalation request
   * @returns The message to be signed
   */
  private createSignMessage(request: EscalateToLawyerRequest): string {
    const messageData = {
      caseId: request.caseId,
      contractAddress: request.contractAddress.toLowerCase(),
      timestamp: request.timestamp,
      nonce: request.nonce,
    };

    return JSON.stringify(messageData);
  }

  /**
   * Generate expected signature for verification
   * @param message The message to sign
   * @returns The expected signature
   */
  private generateExpectedSignature(message: string): string {
    // In production, this would use proper cryptographic verification
    // For now, we'll use HMAC as a placeholder
    return createHmac("sha256", this.chainlinkPublicKey)
      .update(message)
      .digest("hex");
  }

  /**
   * Verify that the request format matches what Chainlink Functions sends
   * @param request The escalation request
   * @returns True if format is valid
   */
  private verifyRequestFormat(request: EscalateToLawyerRequest): boolean {
    // Verify all required fields are present
    if (!request.caseId || !request.contractAddress || !request.nonce) {
      return false;
    }

    // Verify contract address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(request.contractAddress)) {
      return false;
    }

    // Verify timestamp is reasonable
    const currentTime = Math.floor(Date.now() / 1000);
    if (
      request.timestamp > currentTime + 60 ||
      request.timestamp < currentTime - 3600
    ) {
      return false;
    }

    return true;
  }

  /**
   * Add an IP address to the allowed list
   * @param ip The IP address to allow
   */
  public addAllowedIP(ip: string): void {
    this.chainlinkIPs.add(ip);
  }

  /**
   * Remove an IP address from the allowed list
   * @param ip The IP address to remove
   */
  public removeAllowedIP(ip: string): void {
    this.chainlinkIPs.delete(ip);
  }

  /**
   * Get all allowed IP addresses
   * @returns Array of allowed IP addresses
   */
  public getAllowedIPs(): string[] {
    return Array.from(this.chainlinkIPs);
  }

  /**
   * Update the API key
   * @param newApiKey The new API key
   */
  public updateApiKey(newApiKey: string): void {
    this.chainlinkApiKey = newApiKey;
  }
}

// Create singleton instance with configuration from environment
const chainlinkApiKey =
  process.env.CHAINLINK_API_KEY || "default-chainlink-key";
const chainlinkPublicKey =
  process.env.CHAINLINK_PUBLIC_KEY || "default-public-key";
const allowedIPs = process.env.CHAINLINK_ALLOWED_IPS
  ? process.env.CHAINLINK_ALLOWED_IPS.split(",").map((ip) => ip.trim())
  : [];

export const chainlinkVerificationService = new ChainlinkVerificationService(
  chainlinkApiKey,
  chainlinkPublicKey,
  allowedIPs
);
