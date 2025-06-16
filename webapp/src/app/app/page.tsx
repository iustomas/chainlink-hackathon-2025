"use client";

// components
import Navbar from "@/components/Navbar";

// wagmi
import { useAccount, useReadContract } from "wagmi";

// icons
import { FaWallet } from "react-icons/fa";

// reown
import { modal } from "../../../context";

// onchain
import INTAKE_PAYMENT_ABI from "../../../onchain/IntakePaymentABI.json";
import { INTAKE_PAYMENT_CONTRACT_ADDRESS } from "../../../onchain";

export default function App() {
  const { address, isConnected } = useAccount();

  const { data: hasPaid } = useReadContract({
    address: INTAKE_PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
    abi: INTAKE_PAYMENT_ABI,
    functionName: "hasPaid",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { data: requiredETHAmount } = useReadContract({
    address: INTAKE_PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
    abi: INTAKE_PAYMENT_ABI,
    functionName: "getRequiredETHAmount",
    query: {
      enabled: !!address,
    },
  });

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F4F3ED]">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {!isConnected ? (
          <button
            className="px-8 py-4 text-xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleConnect}
          >
            Conectar Wallet
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-gray-700">
              <FaWallet className="w-6 h-6" />
              <span className="font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            {hasPaid ? (
              <button className="px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                Start Legal Case
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-700">
                  Cost of Service:{" "}
                  {requiredETHAmount
                    ? `${(Number(requiredETHAmount) / 1e18).toFixed(
                        6
                      )} ETH ($0.1 USD)`
                    : "Cargando..."}
                </p>

                <button className="px-8 py-4 text-xl font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer">
                  Pay Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
