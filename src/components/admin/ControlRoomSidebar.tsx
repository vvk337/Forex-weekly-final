"use client";

import React from "react";

interface SidebarLink {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ControlRoomSidebarProps {
  visibleTabs: SidebarLink[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
}

export default function ControlRoomSidebar({
  visibleTabs,
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  toggleSidebarCollapse,
  showMobileSidebar,
  setShowMobileSidebar,
}: ControlRoomSidebarProps) {
  return (
    <aside className={`fixed md:sticky top-14 left-0 h-[calc(100vh-3.5rem)] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-40 transition-all duration-300 flex flex-col shrink-0 ${
      sidebarCollapsed ? "w-16" : "w-64"
    } ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      <div className="flex-grow flex flex-col justify-between min-h-0">
        {/* Navigation Links list */}
        <div className="flex-grow overflow-y-auto">
          <nav className="p-3 space-y-1">
            {visibleTabs.filter(link => link.id !== "inbox").map((link) => (
              <button
                key={link.id}
                title={sidebarCollapsed ? link.label : undefined}
                onClick={() => {
                  setActiveTab(link.id);
                  setShowMobileSidebar(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-sm text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === link.id
                    ? "bg-brand-red text-white"
                    : "text-neutral-550 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-850"
                }`}
              >
                {link.icon}
                <span className={sidebarCollapsed ? "hidden" : "ml-2.5 inline"}>{link.label}</span>
              </button>
            ))}

            {/* Inbox Section header */}
            <div className="pt-4 pb-1">
              <span className={`px-3 text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-505 block ${sidebarCollapsed ? "hidden" : "block"}`}>
                Inbox
              </span>
              {sidebarCollapsed && (
                <div className="border-t border-neutral-100 dark:border-neutral-855 mx-3 my-2"></div>
              )}
            </div>

            {/* Direct Messages */}
            <button
              onClick={() => {
                setActiveTab("inbox-dm");
                setShowMobileSidebar(false);
              }}
              title={sidebarCollapsed ? "Direct Messages" : undefined}
              className={`w-full flex items-center px-3 py-2 rounded-sm text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === "inbox-dm"
                  ? "bg-brand-red text-white"
                  : "text-neutral-550 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-855"
              }`}
            >
              <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className={sidebarCollapsed ? "hidden" : "ml-2.5 inline"}>Direct Messages</span>
            </button>

            {/* Groups */}
            <button
              onClick={() => {
                setActiveTab("inbox-groups");
                setShowMobileSidebar(false);
              }}
              title={sidebarCollapsed ? "Groups" : undefined}
              className={`w-full flex items-center px-3 py-2 rounded-sm text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === "inbox-groups"
                  ? "bg-brand-red text-white"
                  : "text-neutral-550 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-855"
              }`}
            >
              <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className={sidebarCollapsed ? "hidden" : "ml-2.5 inline"}>Groups</span>
            </button>

            {/* Announcements */}
            <button
              onClick={() => {
                setActiveTab("inbox-announcements");
                setShowMobileSidebar(false);
              }}
              title={sidebarCollapsed ? "Announcements" : undefined}
              className={`w-full flex items-center px-3 py-2 rounded-sm text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === "inbox-announcements"
                  ? "bg-brand-red text-white"
                  : "text-neutral-550 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-855"
              }`}
            >
              <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className={sidebarCollapsed ? "hidden" : "ml-2.5 inline"}>Announcements</span>
            </button>

            {/* Public Inquiries (if visible) */}
            {visibleTabs.some(link => link.id === "inbox") && (
              <button
                onClick={() => {
                  setActiveTab("inbox");
                  setShowMobileSidebar(false);
                }}
                title={sidebarCollapsed ? "Public Inquiries" : undefined}
                className={`w-full flex items-center px-3 py-2 rounded-sm text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "inbox"
                    ? "bg-brand-red text-white"
                    : "text-neutral-550 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-855"
                }`}
              >
                <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className={sidebarCollapsed ? "hidden" : "ml-2.5 inline"}>Public Inquiries</span>
              </button>
            )}
          </nav>
        </div>

        {/* Collapse Toggle Button at Sidebar bottom */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-850">
          <button
            onClick={toggleSidebarCollapse}
            className="w-full flex items-center justify-center p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-450 dark:text-neutral-400 cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg className={`w-4 h-4 stroke-current fill-none stroke-2 transform transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} viewBox="0 0 24 24">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
