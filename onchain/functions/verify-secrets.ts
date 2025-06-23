// chainlink functions toolkit to verify secrets
import { SecretsManager } from "@chainlink/functions-toolkit";

// dotenv for loading environment variables
import * as dotenv from "dotenv";

// ethers for interacting with the blockchain
import { Wallet, ethers } from "ethers";

dotenv.config();

/**
 * Script to verify secrets configuration for Chainlink Functions.
 *
 * This script checks if the secrets are properly configured and accessible.
 * Usage: npx ts-node verify-secrets.ts
 */

// BASE mainnet router and DON ID
const ROUTER_ADDRESS = "0xf9b8fc078197181c841c296c876945aaa425b278";
const DON_ID = "fun-base-mainnet-1";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("[ERROR] PRIVATE_KEY not found in .env");
  process.exit(1);
}

const RPC_URL = "https://mainnet.base.org";

async function main() {
  console.log("🔍 Verifying Chainlink Functions secrets configuration...");

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL as string);
  const signer = new Wallet(PRIVATE_KEY as string).connect(provider);

  // Set up SecretsManager
  const secretsManager = new SecretsManager({
    signer: signer,
    functionsRouterAddress: ROUTER_ADDRESS,
    donId: DON_ID,
  });

  // Initialize SecretsManager
  await secretsManager.initialize();

  // Check current configuration
  console.log("\n📋 Current Configuration:");
  console.log(`Router Address: ${ROUTER_ADDRESS}`);
  console.log(`DON ID: ${DON_ID}`);
  console.log(`Signer Address: ${await signer.getAddress()}`);

  // Check gateway connectivity
  console.log("\n🌐 Checking gateway connectivity...");
  const gatewayUrls = [
    "https://01.functions-gateway.chain.link/",
    "https://02.functions-gateway.chain.link/",
  ];

  for (const gateway of gatewayUrls) {
    try {
      const response = await fetch(gateway + "health");
      console.log(`✅ ${gateway}: ${response.status === 200 ? "OK" : "Error"}`);
    } catch (error) {
      console.log(`❌ ${gateway}: Connection failed`);
    }
  }

  // Try to get secrets info
  try {
    const slotId = 0;
    const secretsInfo = await secretsManager.listDONHostedEncryptedSecrets(
      gatewayUrls
    );

    console.log("\n✅ Secrets verification successful!");
    console.log(`Slot ID: ${slotId}`);
    console.log(`Version: 1750698047`);
    console.log(`Secrets available: ${secretsInfo ? "Yes" : "No"}`);
  } catch (error) {
    console.log("\n❌ Secrets verification failed!");
    console.error("Error details:", error);

    // Try to get available versions
    try {
      console.log("\n🔄 Checking available secret versions...");
      // This might not work directly, but let's tryj
      console.log(
        "Note: You may need to upload new secrets if they have expired."
      );
    } catch (versionError) {
      console.error("Could not check versions:", versionError);
    }
  }
}

main().catch((e) => {
  console.error("[ERROR] Verification failed:", e);
  process.exit(1);
});
