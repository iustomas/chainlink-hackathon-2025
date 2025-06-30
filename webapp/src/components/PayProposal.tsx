"use client";

// react
import React, { useState } from "react";

// next
import Image from "next/image";
import Link from "next/link";

// react icons
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

// wagmi
import { useWriteContract } from "wagmi";

// onchain
import PAY_PROPOSAL_ABI from "../../onchain/PayProposalABI.json";
import { PAY_PROPOSAL_CONTRACT_ADDRESS } from "../../onchain";

interface PayProposalProps {
  price: number;
  onPay: () => void;
}

/**
 * PayProposal component for handling proposal payment with collapse/expand functionality
 */
export default function PayProposal({ price, onPay }: PayProposalProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { writeContract, isPending } = useWriteContract();

  const handlePayClick = async () => {
    if (isPending) return;

    try {
      await writeContract({
        address: PAY_PROPOSAL_CONTRACT_ADDRESS as `0x${string}`,
        abi: PAY_PROPOSAL_ABI,
        functionName: "payProposal",
        value: BigInt(0), // Set to 0 as requested
      });

      console.log("PayProposal contract called successfully");
      onPay();
    } catch (error) {
      console.error("Error calling PayProposal contract:", error);
      onPay();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center relative w-full mx-auto">
        <button
          onClick={toggleCollapse}
          className={`absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 transition-all duration-300 ease-in-out z-10 hover:scale-110 ${
            isCollapsed ? "top-1/2 -translate-y-1/2 right-2" : ""
          }`}
          aria-label={
            isCollapsed
              ? "Expand proposal details"
              : "Collapse proposal details"
          }
        >
          {isCollapsed ? (
            <LuChevronUp className="w-6 h-6 cursor-pointer" />
          ) : (
            <LuChevronDown className="w-6 h-6 cursor-pointer" />
          )}
        </button>

        {/* Header content with smooth fade animation */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isCollapsed ? "max-h-0 opacity-0" : "max-h-32 opacity-100"
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 transform transition-all duration-300 ease-in-out">
            Proposal Ready
          </h2>

          <p className="text-gray-600 mb-4 transform transition-all duration-300 ease-in-out">
            Your legal proposal is ready. Please proceed with payment to access
            it.
          </p>
        </div>

        <div
          className={`bg-white rounded-xl border border-gray-200 w-[600px] mx-auto transition-all duration-500 ease-in-out transform ${
            isCollapsed ? "p-3 scale-95" : "p-6 scale-100"
          }`}
        >
          {/* Content with smooth slide animation */}
          {!isCollapsed && (
            <div className="transition-all duration-500 ease-in-out overflow-hidden mb-6">
              <div className="flex items-center justify-between mb-4 transform transition-all duration-300 ease-in-out">
                <span className="text-lg font-medium text-gray-700">
                  Proposal Price:
                </span>

                <span className="text-2xl font-bold text-black">
                  ${price.toFixed(2)}
                </span>
              </div>

              {/* Payment method explanation */}
              <div className="p-4 bg-gray-50 rounded-lg transform transition-all duration-300 ease-in-out hover:bg-gray-100">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Link
                    href="https://coinmarketcap.com/currencies/ethereum/"
                    target="_blank"
                    className="transform transition-all duration-200 hover:scale-110"
                  >
                    <Image
                      src={"/assets/onchain-logos/eth.svg"}
                      alt="ETH"
                      className="w-8 h-8"
                      width={32}
                      height={32}
                    />
                  </Link>

                  <span className="text-sm font-medium text-gray-700">+</span>

                  <Link
                    href="https://base.org"
                    target="_blank"
                    className="transform transition-all duration-200 hover:scale-110"
                  >
                    <Image
                      src={"/assets/onchain-logos/base.svg"}
                      alt="Base Chain"
                      className="w-8 h-8"
                      width={32}
                      height={32}
                    />
                  </Link>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Payment is made in ETH on Base network
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handlePayClick}
            disabled={isPending}
            className="w-full bg-black text-white rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-md cursor-pointer flex items-center justify-center gap-2 hover:bg-[#2c3552] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 px-6 py-4 text-lg"
          >
            {isPending ? (
              <>
                <span className="loader-tomas inline-block w-4 h-4 border-2 border-white rounded-full animate-spin"></span>
                <span>Processing Payment...</span>
              </>
            ) : (
              <span>Pay Tomas</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
