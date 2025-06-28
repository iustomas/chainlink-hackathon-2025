// firestore
import { Firestore } from "@google-cloud/firestore";

// types
import { VaultFile } from "./types/vault.types.js";

/**
 * Service for handling vault files in Firestore.
 */
export class VaultService {
  private firestore: Firestore;
  private collectionName: string;

  constructor() {
    this.firestore = new Firestore();
    this.collectionName = "tomas-vault";
  }

  /**
   * Retrieves all files for a specific user from their vault, ordered by timestamp descending (newest first).
   * @param userAddress - The user's address (string)
   * @returns Promise<VaultFile[]> - Array of vault files
   */
  async getUserVaultFiles(userAddress: string): Promise<VaultFile[]> {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where("userAddress", "==", userAddress)
      .orderBy("timestamp", "desc")
      .get();

    return snapshot.docs.map((doc) => doc.data() as VaultFile);
  }

  /**
   * Adds a new file to the user's vault.
   * @param vaultFile - The vault file object to add
   * @returns Promise<void>
   */
  async addVaultFile(vaultFile: VaultFile): Promise<void> {
    await this.firestore.collection(this.collectionName).add(vaultFile);
  }

  /**
   * Deletes a specific file from the user's vault by document ID.
   * @param documentId - The Firestore document ID
   * @returns Promise<void>
   */
  async deleteVaultFile(documentId: string): Promise<void> {
    await this.firestore
      .collection(this.collectionName)
      .doc(documentId)
      .delete();
  }

  /**
   * Deletes all files for a specific user from their vault.
   * @param userAddress - The user's address (string)
   * @returns Promise<void>
   */
  async deleteAllUserVaultFiles(userAddress: string): Promise<void> {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where("userAddress", "==", userAddress)
      .get();

    const batch = this.firestore.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  /**
   * Gets the total size of all files in a user's vault.
   * @param userAddress - The user's address (string)
   * @returns Promise<number> - Total size in MB
   */
  async getUserVaultTotalSize(userAddress: string): Promise<number> {
    const files = await this.getUserVaultFiles(userAddress);

    return files.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Gets the count of files in a user's vault.
   * @param userAddress - The user's address (string)
   * @returns Promise<number> - Number of files
   */
  async getUserVaultFileCount(userAddress: string): Promise<number> {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where("userAddress", "==", userAddress)
      .count()
      .get();

    return snapshot.data().count;
  }
}

// Export singleton instance
export const vaultService = new VaultService();
