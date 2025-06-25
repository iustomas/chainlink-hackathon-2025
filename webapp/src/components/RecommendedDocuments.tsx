// react-icons
import { LuFileType } from "react-icons/lu";

export default function RecommendedDocuments() {
  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Key documents to draft
        </h2>
        <span className="text-[#38456D] text-sm font-semibold cursor-pointer">
          See all &gt;
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Term Sheet */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">Term Sheet</h3>
          <p className="text-sm text-gray-500 mb-2 flex-1">
            Summarise key deal terms for investors or partners in a crisp
            one‑pager.
          </p>
          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">Output: PDF / Docx</span>
          </div>
        </div>

        {/* Compliance Policy */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">Compliance Policy</h3>
          <p className="text-sm text-gray-500 mb-2 flex-1">
            Generate a tailored KYC/AML & risk policy aligned with current
            regulations.
          </p>
          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">
              Output: Policy document
            </span>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">Privacy Policy</h3>
          <p className="text-sm text-gray-500 mb-2 flex-1">
            Draft GDPR‑ready privacy terms for your web3 app, including data
            rights & cookies.
          </p>
          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">Output: Legal doc</span>
          </div>
        </div>

        {/* Service Agreement */}
        <div className="bg-[#FBFBF9] rounded-xl p-4 shadow-sm flex flex-col h-full cursor-pointer">
          <h3 className="text-lg font-semibold mb-1">Service Agreement</h3>
          <p className="text-sm text-gray-500 mb-2 flex-1">
            Set clear scope, deliverables and payment terms with freelancers or
            vendors.
          </p>
          <div className="flex items-center gap-2">
            <LuFileType className="text-gray-600 text-sm" />
            <span className="text-xs text-gray-600">
              Output: Contract draft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
