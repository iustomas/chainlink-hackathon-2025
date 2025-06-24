"use client";

// react
import React, { useState } from "react";

// icons

import {
  LuMessageCircle,
  LuArchive,
  // LuWorkflow,
  LuClock,
  LuLibraryBig,
  LuCircleHelp,
  LuSettings,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";

/**
 * Sidebar component for the left side of the app.
 * Professional and minimal design inspired by the provided reference image.
 * Contains main navigation and bottom section for help and settings.
 * Includes a collapse/expand button next to the title.
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-[250px]"
      } h-full min-h-screen bg-[#FBFBF9] flex flex-col justify-between border-r border-gray-200 transition-all duration-200`}
    >
      <div>
        <div
          className={`flex items-center ${
            collapsed ? "px-2" : "pl-10 pr-2"
          } pt-6 pb-10 gap-2`}
        >
          <h3
            className={`text-2xl font-serif font-semibold text-[#222] ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Tomas
          </h3>

          <button
            className="ml-auto p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <LuChevronsRight size={22} />
            ) : (
              <LuChevronsLeft size={22} />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarOption
            icon={<LuMessageCircle size={20} />}
            label="Tomas"
            collapsed={collapsed}
          />

          <SidebarOption
            icon={<LuArchive size={20} />}
            label="Vault"
            collapsed={collapsed}
          />

          {/* <SidebarOption
            icon={<LuWorkflow size={20} />}
            label="Workflows"
            collapsed={collapsed}
          /> */}

          <SidebarOption
            icon={<LuClock size={20} />}
            label="History"
            collapsed={collapsed}
          />

          <SidebarOption
            icon={<LuLibraryBig size={20} />}
            label="Library"
            collapsed={collapsed}
          />
        </nav>
      </div>

      <div
        className={`flex flex-col gap-1 ${collapsed ? "px-2" : "pr-2"} pb-6`}
      >
        <SidebarOption
          icon={<LuCircleHelp size={20} />}
          label="Help"
          collapsed={collapsed}
        />

        <SidebarOption
          icon={<LuSettings size={20} />}
          label="Settings"
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}

/**
 * SidebarOption component for rendering a single sidebar menu item.
 * @param icon ReactNode - Icon to display
 * @param label string - Label for the menu item
 * @param collapsed boolean - Whether the sidebar is collapsed
 */
function SidebarOption({
  icon,
  label,
  collapsed = false,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}) {
  return (
    <div
      className={`flex items-center ${
        collapsed ? "justify-center px-2" : "gap-3 pl-10 pr-2"
      } py-2 rounded-lg cursor-pointer group transition-colors hover:bg-[#E6F0FA]`}
    >
      <span className="text-[#38456D] group-hover:text-[#1976D2] transition-colors">
        {icon}
      </span>
      {!collapsed && (
        <span className="text-base text-[#38456D] font-medium group-hover:text-[#1976D2] transition-colors">
          {label}
        </span>
      )}
    </div>
  );
}
