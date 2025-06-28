"use client";

// react
import React, { useEffect, useRef, useState } from "react";

// next
import { usePathname } from "next/navigation";

// icons
import { FiCopy, FiCheck } from "react-icons/fi";

// wagmi
import { useAccount, useDisconnect } from "wagmi";

// utils
import { formatAddress } from "../../utils/format-address";

/**
 * DashboardHeader component that displays the header section with dynamic title based on route
 */
export default function DashboardHeader() {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDisconnect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex-shrink-0 px-4 pt-4 pb-2 border-b border-gray-300 bg-white">
      <div className="w-full pl-[20px] flex items-center justify-between">
        <div>
          <h2 className="text-md text-gray-600 mb-1">{getTitle()} /</h2>
        </div>

        {address && (
          <div className="flex items-center space-x-2 pr-2">
            <div className="relative">
              <button
                onClick={() => setShowDisconnect(!showDisconnect)}
                className="px-4 py-1.5 rounded-[10px] font-semibold border border-black text-black bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                style={{ fontSize: "14px", lineHeight: "20px" }}
              >
                {formatAddress(address as string)}
              </button>

              {showDisconnect && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        Wallet Address
                      </span>
                      <button
                        onClick={() => copyToClipboard(address as string)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <FiCheck className="text-green-500 cursor-pointer" />
                        ) : (
                          <FiCopy className="text-gray-500 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    <span className="text-sm text-gray-500 break-all">
                      {address}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      disconnect();
                      setShowDisconnect(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
