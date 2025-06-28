#!/usr/bin/env tsx

// dotenv
import dotenv from "dotenv";

// services
import { vaultService } from "../src/services/firestore/vault.service.js";

// types
import { VaultFile } from "../src/services/firestore/types/vault.types.js";

// Load environment variables
dotenv.config();

/**
 * Script to add a test document to a user's vault
 */
async function addVaultDocument() {
  const userAddress = "0x6914c5b9ab9b49bCF84f980Ff773Bf2ae6186A6D";

  // Sample document data
  const testDocument: VaultFile = {
    userAddress,
    name: "test-document.pdf",
    type: "pdf",
    url: "https://storage.googleapis.com/test-bucket/test-document.pdf",
    size: 1.5, // Size in MB
    timestamp: Date.now(),
    description: "Test document for vault functionality",
    tags: ["test", "document", "vault"],
    isPublic: false,
  };

  try {
    console.log("🚀 Adding document to vault...");
    console.log("📍 User Address:", userAddress);
    console.log("📄 Document Name:", testDocument.name);
    console.log("📏 Document Size:", testDocument.size, "MB");

    await vaultService.addVaultFile(testDocument);

    console.log("✅ Document added successfully to vault!");

    // Verify by getting user's vault files
    console.log("\n📋 Verifying vault contents...");
    const vaultFiles = await vaultService.getUserVaultFiles(userAddress);
    const totalSize = await vaultService.getUserVaultTotalSize(userAddress);
    const fileCount = await vaultService.getUserVaultFileCount(userAddress);

    console.log("📊 Total files in vault:", fileCount);
    console.log("💾 Total size:", totalSize, "MB");
    console.log(
      "📁 Files:",
      vaultFiles.map((file) => ({
        name: file.name,
        size: file.size,
        timestamp: new Date(file.timestamp).toISOString(),
      }))
    );
  } catch (error) {
    console.error("❌ Error adding document to vault:", error);
    process.exit(1);
  }
}

// Run the script
addVaultDocument()
  .then(() => {
    console.log("\n🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
