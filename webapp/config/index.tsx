// config/index.tsx

// wagmi
import { cookieStorage, createStorage } from "@wagmi/core";

// reown
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, base } from "@reown/appkit/networks";

export const REOWN_PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!REOWN_PROJECT_ID) {
  throw new Error(
    "NEXT_PUBLIC_REOWN_PROJECT_ID is not defined in environment variables"
  );
}

export const networks = [mainnet, base];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: REOWN_PROJECT_ID,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
