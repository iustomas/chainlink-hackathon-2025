"use client";

// react
import React from "react";

// components
import DashboardHeader from "./DashboardHeader";

/**
 * Vault component for file management and storage
 */
export default function Vault() {
  return (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
      {/* Header section */}
      <DashboardHeader />

      <div className="flex-1 px-[40px] flex flex-col min-h-0 transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden">
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 text-lg">
            <h1 className="text-2xl font-bold mb-4">Vault</h1>
            <p className="text-center">
              File management and storage coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
