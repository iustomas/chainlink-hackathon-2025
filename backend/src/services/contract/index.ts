import { ethers } from "ethers";

// PayProposal contract ABI - only the function we need
const PAY_PROPOSAL_ABI = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "usdPriceE8", type: "uint256" },
    ],
    name: "setProposalPriceForUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * Service for interacting with smart contracts
 */
export class ContractService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;

  /**
   * Initialize the contract service (lazy loading)
   */
  private initialize() {
    if (this.contract) return; // Already initialized

    const rpcUrl = "https://mainnet.base.org";
    const privateKey = process.env.TOMAS_PK;
    const contractAddress = "0xe6c06b962f452139db35ac9be3dfb62422ba9798";

    if (!privateKey) {
      throw new Error("TOMAS_PK environment variable is required");
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      contractAddress,
      PAY_PROPOSAL_ABI,
      this.wallet
    );
  }

  /**
   * Set proposal price for a user in the PayProposal contract
   * @param userAddress The user's address
   * @param usdPriceInteger The price in USD as integer (e.g., 100 for $100)
   * @returns Transaction hash
   */
  async setProposalPriceForUser(
    userAddress: string,
    usdPriceInteger: number
  ): Promise<string> {
    try {
      this.initialize(); // Initialize if not already done

      console.log(
        `Setting proposal price for user ${userAddress}: ${usdPriceInteger} USD (integer)`
      );

      if (!this.contract) {
        throw new Error("Contract not initialized");
      }

      const tx = await this.contract.setProposalPriceForUser(
        userAddress,
        usdPriceInteger
      );
      const receipt = await tx.wait();

      console.log(`Transaction successful. Hash: ${receipt.hash}`);
      return receipt.hash;
    } catch (error) {
      console.error("Error setting proposal price:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const contractService = new ContractService();
