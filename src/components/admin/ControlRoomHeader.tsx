"use client";

import React from "react";
import Link from "next/link";

interface SearchResult {
  title: string;
  type: string;
  sub: string;
  action: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  module: string;
  description: string;
  status: string;
  timestamp: string;
  objectId?: string;
}

interface ControlRoomHeaderProps {
  currentUser: any;
  allowedWorkspaces: string[];
  activeWorkspace: string;
  setActiveWorkspace: (ws: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  showNotificationMenu: boolean;
  setShowNotificationMenu: (show: boolean) => void;
  unreadNotificationsCount: number;
  notifications: NotificationItem[];
  handleMarkAllAsRead: () => void;
  handleMarkAsRead: (id: string) => void;
  setActiveTab: (tab: string) => void;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  handleLogout: () => void;
  toggleMobileSidebar?: () => void;
}

export default function ControlRoomHeader({
  currentUser,
  allowedWorkspaces,
  activeWorkspace,
  setActiveWorkspace,
  searchQuery,
  setSearchQuery,
  searchResults,
  showNotificationMenu,
  setShowNotificationMenu,
  unreadNotificationsCount,
  notifications,
  handleMarkAllAsRead,
  handleMarkAsRead,
  setActiveTab,
  showProfileMenu,
  setShowProfileMenu,
  handleLogout,
  toggleMobileSidebar,
}: ControlRoomHeaderProps) {
  const showWorkspaceDropdown = allowedWorkspaces.length > 1;

  return (
    <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 z-50 transition-colors shrink-0">
      <div className="flex items-center space-x-4">
        {toggleMobileSidebar && (
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-1 text-neutral-500 hover:text-brand-red cursor-pointer"
            title="Toggle Menu"
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
          <span className="h-6 w-6 rounded bg-brand-red flex items-center justify-center text-white font-extrabold text-sm">FW</span>
          <span className="font-serif font-bold text-sm tracking-tight text-brand-dark dark:text-white">Weekly Control</span>
        </Link>
        
        {/* Workspace selector in header */}
        {showWorkspaceDropdown && currentUser && (
          <div className="flex items-center border-l border-neutral-200 dark:border-neutral-855 pl-4 h-6">
            <select
              value={activeWorkspace}
              onChange={(e) => setActiveWorkspace(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold py-1 px-2.5 rounded text-brand-dark dark:text-neutral-200 focus:outline-none cursor-pointer"
            >
              {allowedWorkspaces.map((ws: string) => (
                <option key={ws} value={ws} className="bg-white dark:bg-neutral-955 text-neutral-205">
                  {ws} Workspace
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Global Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-3.5 h-3.5 text-neutral-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search console..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded-sm pl-9 pr-4 py-1.5 w-40 sm:w-56 focus:outline-none focus:border-brand-red focus:w-64 transition-all text-neutral-800 dark:text-neutral-200 font-semibold"
          />

          {/* Search popover */}
          {searchResults.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded shadow-lg z-50 max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-855">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={res.action}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-850 flex flex-col transition-colors cursor-pointer font-semibold"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">{res.title}</span>
                    <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-brand-red/10 text-brand-red border border-brand-red/15">{res.type}</span>
                  </div>
                  <span className="text-[10px] text-neutral-455 mt-0.5 truncate">{res.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="p-1.5 text-neutral-455 hover:text-brand-red dark:text-neutral-400 dark:hover:text-white rounded-full transition-colors relative cursor-pointer"
          >
            <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-red animate-pulse"></span>
            )}
          </button>
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-neutral-905 border border-neutral-200 dark:border-neutral-800 rounded shadow-lg z-50 overflow-hidden font-medium">
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
                <span className="font-bold text-xs text-brand-dark dark:text-white">Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] text-brand-red hover:underline font-extrabold uppercase tracking-wide cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-neutral-400 font-semibold italic">
                    You're all caught up.
                  </div>
                ) : (
                  notifications.map((n) => {
                    const isUnread = n.status === "UNREAD";
                    return (
                      <div
                        key={n.id}
                        className={`p-4 flex flex-col space-y-1 text-xs transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-855/50 ${
                          isUnread ? "bg-neutral-50/20 dark:bg-neutral-855/10" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`font-bold leading-normal text-neutral-800 dark:text-neutral-200 ${isUnread ? "text-brand-dark dark:text-white" : ""}`}>
                            {n.title}
                          </span>
                          <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-505 border border-neutral-200 dark:border-neutral-850">
                            {n.module}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                          {n.description}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[9px] text-neutral-400 font-mono">
                            {new Date(n.timestamp).toLocaleString()}
                          </span>
                          <div className="flex items-center space-x-3">
                            {n.objectId && n.module === "ARTICLE" && (
                              <button
                                onClick={() => {
                                  setActiveTab("articles");
                                  setShowNotificationMenu(false);
                                }}
                                className="text-[9px] text-brand-red hover:underline font-bold cursor-pointer"
                              >
                                View Article
                              </button>
                            )}
                            {isUnread && (
                              <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-[9px] text-neutral-455 hover:text-neutral-800 dark:hover:text-neutral-205 font-bold cursor-pointer"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Trigger */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            >
              <img
                src={currentUser.profilePhoto || "/images/default-avatar.png"}
                alt={currentUser.fullName}
                className="h-8 w-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/default-avatar.png";
                }}
              />
              <span className="hidden sm:inline text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {currentUser.fullName}
              </span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded shadow-lg p-2 z-50 text-xs font-semibold animate-fadeInFast animate-duration-150">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-855">
                  <span className="text-[9px] uppercase font-extrabold text-neutral-400 block">Role &amp; Workspace</span>
                  <span className="text-brand-dark dark:text-white font-bold block">{currentUser.role}</span>
                  <span className="text-[10px] text-neutral-455">{activeWorkspace} Workspace</span>
                </div>
                <Link href="/admin/dashboard/profile" className="block px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-855 rounded text-neutral-700 dark:text-neutral-300" onClick={() => setShowProfileMenu(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-855 rounded text-red-505 font-bold cursor-pointer">
                  Logout Session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
