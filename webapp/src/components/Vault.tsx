"use client";

// react
import React, { useState, useEffect } from "react";

// next
import Image from "next/image";

// wagmi
import { useAccount } from "wagmi";

// reown
import { modal } from "../../context";

// components
import DashboardHeader from "./DashboardHeader";

// types
import { VaultFile, VaultResponse } from "@/types/vault.types";

// services
import { vaultService } from "@/services/vault.service";

// utils
import { formatFileSize, formatDate } from "@/utils/vault.utils";

// icons
import {
  LuFileText,
  LuFile,
  LuImage,
  LuVideo,
  LuMusic,
  LuDownload,
  LuGlobe,
  LuActivity,
  LuHardDrive,
  LuFolder,
  LuTriangle,
} from "react-icons/lu";

/**
 * Vault component for file management and storage
 */
export default function Vault() {
  const [vaultData, setVaultData] = useState<VaultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get connected wallet address
  const { address } = useAccount();

  const handleConnect = () => {
    if (modal) {
      modal.open();
    }
  };

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await vaultService.getUserVaultFiles(address);
        setVaultData(data);
      } catch (err) {
        console.error("Error fetching vault data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch vault data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVaultData();
  }, [address]);

  const handleFileClick = (file: VaultFile) => {
    window.open(file.url, "_blank");
  };

  const handleDownload = (file: VaultFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIconComponent = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "application/pdf":
      case "pdf":
        return <Image src="/assets/pdf.svg" alt="PDF" width={32} height={32} />;

      case "doc":
      case "docx":
        return <LuFileText className="w-8 h-8 text-gray-700" />;

      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return <LuImage className="w-8 h-8 text-gray-700" />;

      case "mp4":
      case "avi":
      case "mov":
        return <LuVideo className="w-8 h-8 text-gray-700" />;

      case "mp3":
      case "wav":
        return <LuMusic className="w-8 h-8 text-gray-700" />;

      default:
        return <LuFile className="w-8 h-8 text-gray-700" />;
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
                <LuFolder className="w-24 h-24" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Vault</h1>
              <p className="text-center mb-8 max-w-md">
                Please connect your wallet to access your vault files.
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

  return (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
      {/* Header section */}
      <DashboardHeader />

      <div className="flex-1 px-[40px] flex flex-col min-h-0 transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <p className="text-gray-600">
              Manage and access your stored documents and files
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mb-4"></div>
              <p className="text-gray-500">Loading your vault...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <div className="text-red-600 text-4xl mb-4">
                  <LuTriangle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Vault
                </h3>

                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Vault content */}
          {vaultData && !loading && !error && (
            <div className="flex-1 flex flex-col">
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#FBFBF9] border border-[#F0EEE7] rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-gray-700 text-2xl mr-3">
                      <LuActivity className="w-8 h-8" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Files
                      </p>

                      <p className="text-2xl font-bold text-gray-900">
                        {vaultData.stats.totalFiles}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FBFBF9] border border-[#F0EEE7] rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-gray-700 text-2xl mr-3">
                      <LuHardDrive className="w-8 h-8" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Size
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatFileSize(vaultData.stats.totalSizeMB)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files section */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Files
                </h2>

                {vaultData.files.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                    <div className="text-6xl mb-4 text-gray-400">
                      <LuFolder className="w-12 h-12" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">No files yet</h3>

                    <p className="text-center max-w-md">
                      Your vault is empty. Talk to Tomas to get started.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vaultData.files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-white border border-[#F0EEE7] rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        onClick={() => handleFileClick(file)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center justify-center w-12 h-12">
                            {getFileIconComponent(file.type)}
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                              title="Download"
                            >
                              <LuDownload className="w-4 h-4" />
                            </button>
                            {file.isPublic && (
                              <span className="text-xs bg-[#FBFBF9] text-gray-700 px-2 py-1 rounded flex items-center gap-1 border border-[#F0EEE7]">
                                <LuGlobe className="w-3 h-3" />
                                Public
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {file.name}
                          </h3>

                          {file.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {file.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{formatDate(file.timestamp)}</span>
                          </div>

                          {file.tags && file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {file.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="text-xs bg-[#FBFBF9] text-gray-600 px-2 py-1 rounded border border-[#F0EEE7]"
                                >
                                  {tag}
                                </span>
                              ))}
                              {file.tags.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{file.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
