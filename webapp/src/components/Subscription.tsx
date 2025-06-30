"use client";

// react
import React, { useState } from "react";

// wagmi
import { useAccount, useReadContract, useWriteContract } from "wagmi";

// reown
import { modal } from "../../context";

// components
import DashboardHeader from "./DashboardHeader";

// onchain
import TomasSubscriptionABI from "../../onchain/TomasSubscriptionABI.json";
import { TOMAS_SUBSCRIPTION_CONTRACT_ADDRESS } from "../../onchain";

// icons
import {
  LuCheck,
  LuCreditCard,
  LuCalendar,
  LuUser,
  LuTriangle,
  LuLoader,
} from "react-icons/lu";

/**
 * Subscription component for managing user subscriptions
 */
export default function Subscription() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Get connected wallet address
  const { address } = useAccount();

  // Read contract data
  const { data: hasActiveSubscription, isLoading: isLoadingSubscription } =
    useReadContract({
      address: TOMAS_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: TomasSubscriptionABI,
      functionName: "hasActiveSubscription",
      args: [address],
      query: {
        enabled: !!address,
      },
    }) as { data: boolean | undefined; isLoading: boolean };

  const { data: requiredWETHAmount, isLoading: isLoadingAmount } =
    useReadContract({
      address: TOMAS_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: TomasSubscriptionABI,
      functionName: "getRequiredWETHAmount",
      query: {
        enabled: !!address,
      },
    }) as { data: bigint | undefined; isLoading: boolean };

  const { data: pricingInfo, isLoading: isLoadingPricing } = useReadContract({
    address: TOMAS_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
    abi: TomasSubscriptionABI,
    functionName: "getPricingInfo",
    query: {
      enabled: !!address,
    },
  }) as { data: [bigint, bigint, bigint] | undefined; isLoading: boolean };

  // Write contract
  const { writeContract, isPending } = useWriteContract();

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  const handlePayment = async () => {
    if (!requiredWETHAmount) return;

    // Add 10% buffer to account for potential price fluctuations
    const amountWithBuffer =
      (BigInt(requiredWETHAmount as bigint) * BigInt(110)) / BigInt(100);

    try {
      setIsProcessing(true);
      await writeContract({
        address: TOMAS_SUBSCRIPTION_CONTRACT_ADDRESS as `0x${string}`,
        abi: TomasSubscriptionABI,
        functionName: "payWithETH",
        value: amountWithBuffer,
      });
    } catch (error) {
      console.error("Error making payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show connect wallet screen if no address
  if (!address) {
    return (
      <div className="relative w-full h-full font-spectral bg-white flex flex-col">
        {/* Header section */}
        <DashboardHeader />

        <div className="flex-1 px-[40px] flex flex-col min-h-0 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden">
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500 text-lg">
              <div className="text-6xl mb-4 text-gray-400">
                <LuCreditCard className="w-24 h-24" />
              </div>

              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                Subscription
              </h1>

              <p className="text-center mb-8 max-w-md">
                Please connect your wallet to manage your subscription.
              </p>

              <button
                className="bg-black text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={handleConnect}
              >
                <h2 className="text-lg font-semibold">Connect Wallet</h2>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingSubscription || isLoadingAmount || isLoadingPricing) {
    return (
      <div className="relative w-full h-full font-spectral bg-white flex flex-col">
        {/* Header section */}
        <DashboardHeader />

        <div className="flex-1 px-[40px] flex flex-col min-h-0 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden">
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mb-4">
                <LuLoader className="w-12 h-12" />
              </div>
              <p className="text-gray-500">Loading subscription details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
      {/* Header section */}
      <DashboardHeader />

      <div className="flex-1 px-[40px] flex flex-col min-h-0 transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Subscription
            </h1>
            <p className="text-gray-600">
              Manage your Tomas subscription and billing
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          {/* Subscription Status */}
          <div className="mb-8">
            {hasActiveSubscription ? (
              <div className="bg-[#FBFBF9] border border-[#F0EEE7] rounded-lg p-6">
                <div className="flex items-center">
                  <div className="text-gray-700 text-2xl mr-3">
                    <LuCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Active Subscription
                    </h3>
                    <p className="text-gray-600">
                      You have an active subscription. Enjoy unlimited access to
                      Tomas services!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#FBFBF9] border border-[#F0EEE7] rounded-lg p-6">
                <div className="flex items-center">
                  <div className="text-gray-700 text-2xl mr-3">
                    <LuTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No Active Subscription
                    </h3>
                    <p className="text-gray-600">
                      You don&apos;t have an active subscription. Subscribe to
                      get unlimited access.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Information */}
          {pricingInfo && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pricing
              </h2>
              <div className="bg-[#FBFBF9] border border-[#F0EEE7] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-gray-700 text-2xl mr-3">
                      <LuCreditCard className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Monthly Subscription
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        $100 USD
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Required ETH</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {requiredWETHAmount
                        ? `${(
                            Number(requiredWETHAmount as bigint) / 1e18
                          ).toFixed(6)} ETH`
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <LuCalendar className="w-4 h-4 mr-2" />
                    <span>30-day billing cycle</span>
                  </div>
                  <div className="flex items-center">
                    <LuUser className="w-4 h-4 mr-2" />
                    <span>Unlimited requests</span>
                  </div>
                  <div className="flex items-center">
                    <LuCheck className="w-4 h-4 mr-2" />
                    <span>Priority support</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!hasActiveSubscription ? (
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isPending || isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={handlePayment}
                disabled={isPending || isProcessing}
              >
                {isPending || isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Start Subscription"
                )}
              </button>
            ) : (
              <div className="flex-1 px-6 py-3 rounded-lg bg-[#FBFBF9] border border-[#F0EEE7] text-gray-600 font-semibold text-center">
                Subscription Active
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p className="mb-2">
              • All payments are processed in Ethereum (ETH) on Base network
            </p>
            <p className="mb-2">
              • We use Chainlink data feeds to convert USD to ETH
            </p>
            <p>• A 10% buffer is added to account for price fluctuations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
