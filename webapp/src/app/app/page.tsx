"use client";

// components
import Navbar from "@/components/Navbar";

// wagmi
import { useAccount } from "wagmi";

// icons
import { FaWallet } from "react-icons/fa";

// reown
import { modal } from "../../../context";

export default function App() {
  const { address, isConnected } = useAccount();

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
            <button className="px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
              Start Legal Case
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
