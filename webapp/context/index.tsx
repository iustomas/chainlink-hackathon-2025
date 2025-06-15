// context/index.tsx
"use client";

// react
import React, { type ReactNode } from "react";

// wagmi
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// reown
import { createAppKit } from "@reown/appkit/react";
import { mainnet, base } from "@reown/appkit/networks";

// config
import { wagmiAdapter, REOWN_PROJECT_ID } from "../config";

// Set up queryClient
const queryClient = new QueryClient();

if (!REOWN_PROJECT_ID) {
  throw new Error(
    "NEXT_PUBLIC_REOWN_PROJECT_ID is not defined in environment variables"
  );
}

// Set up metadata
const metadata = {
  name: "Tomas",
  description: "Tomas",
  url: "https://tomas.ai",
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: REOWN_PROJECT_ID,
  networks: [mainnet, base],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
