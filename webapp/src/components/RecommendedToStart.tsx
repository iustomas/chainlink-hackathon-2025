// react-icons
import { LuFileType } from "react-icons/lu";

export default function RecommendedToStart() {
  return (
    <div className="mb-10 transition-opacity duration-300 opacity-60 hover:opacity-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Recommended to start
        </h2>
        <span className="text-[#38456D] text-sm font-semibold cursor-pointer">
          See all &gt;
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Launch */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">Token Launch</h3>

          <p className="text-sm text-gray-500 mb-2 flex-1">
            Create and deploy your own token on-chain with a guided legal and
            technical wizard.
          </p>

          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">Output: Legal pack</span>
          </div>
        </div>

        {/* Tokenized Asset Offering */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">RWA Tokenization </h3>

          <p className="text-sm text-gray-500 mb-2 flex-1">
            Issue tokens backed by real-world assets and generate the
            accompanying legal wrapper automatically.
          </p>

          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">Output: Term sheet</span>
          </div>
        </div>

        {/* DAO Launch & Governance */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">
            DAO Launch & Governance
          </h3>

          <p className="text-sm text-gray-500 mb-2 flex-1">
            Spin up a DAO with a governance token, constitution, and on-chain
            voting module in minutes.
          </p>

          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">Output: DAO toolkit</span>
          </div>
        </div>

        {/* DeFi Compliance Pack */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">DeFi Compliance Pack</h3>

          <p className="text-sm text-gray-500 mb-2 flex-1">
            Generate tailored KYC/AML policies, risk disclosures, and terms for
            your protocol—ready for regulators.
          </p>

          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">
              Output: Compliance docs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
