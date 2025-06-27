"use client";

// react
import React, { useState } from "react";

// react icons
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

interface CaseFactsProps {
  caseFacts: string[];
  onToggle?: (isExpanded: boolean) => void;
}

/**
 * Case Facts component to display extracted facts from the conversation
 */
export default function CaseFacts({ caseFacts, onToggle }: CaseFactsProps) {
  const [showCaseFacts, setShowCaseFacts] = useState(true);

  if (caseFacts.length === 0) {
    return null;
  }

  const handleToggle = () => {
    const newState = !showCaseFacts;
    setShowCaseFacts(newState);
    onToggle?.(newState);
  };

  return (
    <div className="hidden lg:flex flex-col max-w-[400px] min-w-[400px] mt-[20px] h-full">
      <button
        className="flex items-center justify-end gap-3 px-4 py-4 w-full focus:outline-none select-none group flex-shrink-0"
        onClick={handleToggle}
        aria-expanded={showCaseFacts}
      >
        <span className="font-semibold text-gray-800 text-lg">Case Facts</span>

        {showCaseFacts ? (
          <LuChevronUp className="w-5 h-5 text-gray-500 transition-transform duration-200 cursor-pointer" />
        ) : (
          <LuChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200 cursor-pointer" />
        )}
      </button>

      {showCaseFacts && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 pb-4 ml-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="space-y-0">
              {caseFacts.map((fact, idx) => (
                <div key={idx}>
                  <p className="py-3 text-sm text-gray-700">{fact}</p>
                  {idx < caseFacts.length - 1 && (
                    <div className="border-b border-gray-200 -mx-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
