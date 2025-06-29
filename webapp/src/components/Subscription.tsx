"use client";

// react
import React from "react";

// components
import DashboardHeader from "./DashboardHeader";

/**
 * Subscription component for managing user subscriptions
 */
export default function Subscription() {
  return (
    <div className="relative w-full h-full font-spectral bg-white flex flex-col">
      {/* Header section */}
      <DashboardHeader />

      <div className="flex-1 px-[40px] flex flex-col min-h-0 transition-all duration-300 ease-in-out overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out mt-[20px] overflow-hidden">
          <div>Subscription</div>
        </div>
      </div>
    </div>
  );
}
