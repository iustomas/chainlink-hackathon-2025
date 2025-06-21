// nomic foundation
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-toolbox";

// hardhat
import { HardhatUserConfig } from "hardhat/config";
import "@chainlink/hardhat-chainlink";

// dotenv
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localFunctionsTestnet: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || "",
    },
  },
};

export default config;
