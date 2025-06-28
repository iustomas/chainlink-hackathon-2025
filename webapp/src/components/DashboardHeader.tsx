"use client";

// react
import React from "react";

// next
import { usePathname } from "next/navigation";

// wagmi
import { useAccount } from "wagmi";

// utils
import { formatAddress } from "../../utils/format-address";

/**
 * DashboardHeader component that displays the header section with dynamic title based on route
 */
export default function DashboardHeader() {
  const pathname = usePathname();
  const { address } = useAccount();

  // Determine the title based on the current route
  const getTitle = () => {
    if (pathname === "/vault") {
      return "Vault";
    }
    if (pathname === "/chat-provisory") {
      return "Assistant";
    }
    return "Assistant";
  };

  return (
    <div className="flex-shrink-0 px-4 pt-4 pb-2 border-b border-gray-300 bg-white">
      <div className="w-full pl-[20px] flex items-center justify-between">
        <div>
          <h2 className="text-md text-gray-600 mb-1">{getTitle()} /</h2>
        </div>

        {address && (
          <div className="flex items-center space-x-2 pr-2">
            <span
              className="px-4 py-1.5 rounded-[10px] font-semibold border border-black text-black bg-white cursor-default select-text"
              style={{ fontSize: "14px", lineHeight: "20px" }}
            >
              {formatAddress(address as string)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
