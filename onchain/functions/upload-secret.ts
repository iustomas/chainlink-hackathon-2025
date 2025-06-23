// chainlink functions toolkit to upload secrets
import { SecretsManager } from "@chainlink/functions-toolkit";

// dotenv for loading environment variables
import * as dotenv from "dotenv";

// ethers for interacting with the blockchain
import { Wallet, ethers } from "ethers";

dotenv.config();

/**
 * Script to upload a secret to Chainlink Functions DON-hosted secrets.
 *
 */

// BASE mainnet router and DON ID
const ROUTER_ADDRESS = "0xf9b8fc078197181c841c296c876945aaa425b278";
const DON_ID = "fun-base-mainnet-1";

const CHAINLINK_SECRET = process.env.CHAINLINK_SECRET;
if (!CHAINLINK_SECRET) {
  console.error("[ERROR] CHAINLINK_SECRET not found in .env");
  process.exit(1);
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("[ERROR] PRIVATE_KEY not found in .env");
  process.exit(1);
}

const RPC_URL = "https://mainnet.base.org";

async function main() {
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

  // Upload secret as DON-hosted
  const slotId = 0;
  const secrets = { chainlinkSecret: CHAINLINK_SECRET as string };

  // 1. Encrypt the secrets
  const { encryptedSecrets } = await secretsManager.encryptSecrets(secrets);

  // 2. Upload the encrypted secrets to the DON
  const gatewayUrls = [
    "https://01.functions-gateway.chain.link/",
    "https://02.functions-gateway.chain.link/",
  ];
  const minutesUntilExpiration = 60;

  const { version } = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecrets,
    gatewayUrls,
    slotId,
    minutesUntilExpiration,
  });

  console.log(`Secret uploaded! Slot ID: ${slotId}, Version: ${version}`);
}

main().catch((e) => {
  console.error("[ERROR] Failed to upload secret:", e);
  process.exit(1);
});
