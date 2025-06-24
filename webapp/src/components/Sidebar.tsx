// react
import React from "react";

// icons
import {
  FiMessageCircle,
  FiClock,
  FiFileText,
  FiRepeat,
  FiSettings,
} from "react-icons/fi";

/**
 * Sidebar component for the left side of the chat page.
 * Currently a placeholder. Add navigation or user info as needed.
 */
export default function Sidebar() {
  return (
    <aside className="w-64 h-full min-h-screen bg-[#38456D] flex flex-col p-6 overflow-hidden">
      <h3 className="text-2xl font-bold text-white mb-10">Tomas</h3>

      <nav className="flex flex-col gap-4 flex-1">
        <SidebarOption icon={<FiMessageCircle size={22} />} label="Chat" />
        <SidebarOption icon={<FiClock size={22} />} label="History" />
        <SidebarOption icon={<FiFileText size={22} />} label="Documents" />
        <SidebarOption icon={<FiRepeat size={22} />} label="Transactions" />
        <div className="my-6 border-t-2 border-white/40" />
        <SidebarOption icon={<FiSettings size={22} />} label="Settings" />
      </nav>
    </aside>
  );
}

function SidebarOption({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-[10px] cursor-pointer group transition-colors hover:bg-[#4CA5E6]">
      <span className="text-white group-hover:text-white transition-colors">
        {icon}
      </span>

      <span className="text-base text-white font-medium group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
  );
}
