"use client";

import React from "react";

interface ControlRoomLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarCollapsed: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
  children: React.ReactNode;
}

export default function ControlRoomLayout({
  header,
  sidebar,
  sidebarCollapsed,
  showMobileSidebar,
  setShowMobileSidebar,
  children,
}: ControlRoomLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Top Header */}
      {header}

      {/* Main Inner Body below Header */}
      <div className="flex-grow flex min-h-0 relative">
        {/* Sidebar */}
        {sidebar}

        {/* Overlays for mobile sidebar */}
        {showMobileSidebar && (
          <div
            onClick={() => setShowMobileSidebar(false)}
            className="fixed inset-0 bg-neutral-955/40 z-30 md:hidden transition-opacity"
          ></div>
        )}

        {/* Right Content Panel */}
        <main className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "md:pl-16" : "md:pl-64"
        }`}>
          <div className="p-6 md:p-8 space-y-6 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
