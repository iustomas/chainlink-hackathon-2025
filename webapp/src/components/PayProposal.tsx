"use client";

// react
import React from "react";

// next
import Image from "next/image";
import Link from "next/link";

interface PayProposalProps {
  price: number;
  onPay: () => void;
  userAddress: string;
}

/**
 * PayProposal component for handling proposal payment
 */
export default function PayProposal({
  price,
  onPay,
  userAddress,
}: PayProposalProps) {
  const handlePayClick = async () => {
    try {
      // Call the scriptum endpoint
      const response = await fetch("http://localhost:3000/tomas/scriptum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: userAddress,
          contractAddress: "0x4508b91ec39770c8457b7c9ab9b60c845b09d3dd", // IntakePayment contract address
          timestamp: new Date().toISOString(),
          escalateToHumanLawyer: false, // Default to false, can be made configurable later
        }),
      });

      if (response.ok) {
        console.log("Scriptum endpoint called successfully");
        // Call the original onPay callback
        onPay();
      } else {
        console.error("Failed to call scriptum endpoint:", response.statusText);
        // Still call onPay to maintain the UI flow
        onPay();
      }
    } catch (error) {
      console.error("Error calling scriptum endpoint:", error);
      // Still call onPay to maintain the UI flow
      onPay();
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Proposal Ready
        </h2>

        <p className="text-gray-600 mb-4">
          Your legal proposal is ready. Please proceed with payment to access
          it.
        </p>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-700">
              Proposal Price:
            </span>

            <span className="text-2xl font-bold text-black">
              ${price.toFixed(2)}
            </span>
          </div>

          {/* Payment method explanation */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Link
                href="https://coinmarketcap.com/currencies/ethereum/"
                target="_blank"
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

              <Link href="https://base.org" target="_blank">
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

          <button
            onClick={handlePayClick}
            className="w-full bg-black text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-[#2c3552] transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Pay Tomas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
