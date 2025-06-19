"use client";

// components
import Navbar from "@/components/Navbar";

// wagmi
import { useAccount, useReadContract, useWriteContract } from "wagmi";

// icons
import { FaWallet } from "react-icons/fa";

// reown
import { modal } from "../../../context";

// onchain
import INTAKE_PAYMENT_ABI from "../../../onchain/IntakePaymentABI.json";
import { INTAKE_PAYMENT_CONTRACT_ADDRESS } from "../../../onchain";

// components
import Steps from "@/components/Steps";
import TomasPraefatioChat from "@/components/TomasPraefatioChat";

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
  }) as { data: boolean | undefined };

  const { data: requiredETHAmount } = useReadContract({
    address: INTAKE_PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
    abi: INTAKE_PAYMENT_ABI,
    functionName: "getRequiredETHAmount",
    query: {
      enabled: !!address,
    },
  });

  const { writeContract, isPending } = useWriteContract();

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  const handlePayment = async () => {
    if (!requiredETHAmount) return;

    // Add 10% to the required amount to account for potential price fluctuations
    const amountWithBuffer =
      (BigInt(requiredETHAmount as bigint) * BigInt(110)) / BigInt(100);

    try {
      await writeContract({
        address: INTAKE_PAYMENT_CONTRACT_ADDRESS as `0x${string}`,
        abi: INTAKE_PAYMENT_ABI,
        functionName: "payForIntake",
        value: amountWithBuffer,
      });
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FAF9F5]">
      <Navbar />

      <div className="flex flex-col min-h-[calc(100vh-80px)] w-[1000px] mx-auto">
        {/* Steps Progress */}
        <Steps currentStep={hasPaid ? 2 : 1} />

        {!hasPaid && (
          <div className="mx-auto text-left mt-[40px]">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              What are you paying for in this first step?
            </h2>

            <p className="text-gray-600 mb-8">
              The intake payment allows you to initiate the legal evaluation
              process with Tomas. This initial payment does not include contract
              drafting or delivery of legal documents.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Case Opening
                </h3>

                <p className="text-gray-600">
                  Tomas collects key information about your situation or
                  project.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Preliminary Analysis
                </h3>

                <p className="text-gray-600">
                  Based on the provided information, Tomas reviews your case and
                  evaluates your initial needs.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Personalized Proposal
                </h3>

                <p className="text-gray-600">
                  After the analysis, you will receive a customized service
                  proposal with a clear scope and pricing before moving forward.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 mt-8">
              {!isConnected ? (
                <button
                  className="px-8 py-4 text-xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  onClick={handleConnect}
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaWallet className="w-6 h-6" />
                    <span className="font-medium">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-700">
                      Cost of Service:{" "}
                      {requiredETHAmount
                        ? `${(Number(requiredETHAmount) / 1e18).toFixed(
                            6
                          )} ETH ($0.1 USD)`
                        : "Cargando..."}
                    </p>

                    <button
                      onClick={handlePayment}
                      disabled={isPending}
                      className={`px-8 py-4 text-xl font-semibold text-white rounded-lg transition-colors cursor-pointer ${
                        isPending
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      }`}
                    >
                      {isPending ? "Processing..." : "Pay Service"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {hasPaid && <TomasPraefatioChat />}
      </div>
    </main>
  );
}
