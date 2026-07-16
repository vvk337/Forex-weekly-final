"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Interfaces
interface DbArticle {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  author: string;
  isFeatured: boolean;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | "TRASH";
  scheduledAt: string | null;
  publishedBy: string | null;
  editedBy: string | null;
  revisionComment: string | null;
  department: string;
  updatedAt: string;
}

interface DbSponsor {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  buttonText: string;
  imageUrl: string;
}

interface DbMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface TickerItem {
  text: string;
  expiryOption: string;
  expiresAt: number | null;
  isDirty?: boolean;
}

interface DbUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profilePhoto: string;
  departments: string[];
  workspaces: string[];
  lastLogin: string | null;
  lastActivity: string | null;
  isOnline: boolean;
  isArchived: boolean;
  activeSince: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [sponsors, setSponsors] = useState<DbSponsor[]>([]);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  
  // Ticker states
  const [tickerMode, setTickerMode] = useState<"auto" | "manual">("auto");
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [savingTicker, setSavingTicker] = useState(false);
  const [tickerMessage, setTickerMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"dashboard" | "articles" | "sponsors" | "inbox" | "inbox-dm" | "inbox-groups" | "inbox-announcements" | "ticker" | "users" | "reports" | "audit-logs">("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Users directory states
  const [users, setUsers] = useState<DbUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersRoleFilter, setUsersRoleFilter] = useState("");
  const [usersStatusFilter, setUsersStatusFilter] = useState("");
  const [usersDeptFilter, setUsersDeptFilter] = useState("");
  const [usersArchivedFilter, setUsersArchivedFilter] = useState(false);
  const [usersSort, setUsersSort] = useState("fullName");
  const [usersOrder, setUsersOrder] = useState<"asc" | "desc">("asc");

  // Add User Form States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserFullName, setAddUserFullName] = useState("");
  const [addUserUsername, setAddUserUsername] = useState("");
  const [addUserEmail, setAddUserEmail] = useState("");
  const [addUserRole, setAddUserRole] = useState("EMPLOYEE");
  const [addUserDept, setAddUserDept] = useState("Publication");
  const [addUserWorkspace, setAddUserWorkspace] = useState("Publication");
  const [addUserPasswordMode, setAddUserPasswordMode] = useState<"invite" | "temp">("invite");
  const [addUserTempPassword, setAddUserTempPassword] = useState("");

  // Load current user session
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<string>("Publication");

  // UI state
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Editorial workflow UI states
  const [articleSubFilter, setArticleSubFilter] = useState<"DRAFT" | "PENDING" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | "TRASH">("PUBLISHED");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [revisionCommentInput, setRevisionCommentInput] = useState("");
  const [activeRevisionArticleId, setActiveRevisionArticleId] = useState<string | null>(null);
  const [scheduleDateInput, setScheduleDateInput] = useState("");
  const [activeScheduleArticleId, setActiveScheduleArticleId] = useState<string | null>(null);
  const [articleTimelineLogs, setArticleTimelineLogs] = useState<Record<string, any[]>>({});

  const toggleExpandArticle = async (id: string | null) => {
    if (!id) {
      setExpandedArticleId(null);
      return;
    }
    setExpandedArticleId(id);
    try {
      const res = await fetch(`/api/audit-logs?objectId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setArticleTimelineLogs((prev) => ({ ...prev, [id]: data }));
      }
    } catch (e) {
      console.error("Failed to fetch article timeline logs", e);
    }
  };

  const [expandedSponsorId, setExpandedSponsorId] = useState<string | null>(null);
  const [sponsorTimelineLogs, setSponsorTimelineLogs] = useState<Record<string, any[]>>({});

  const toggleExpandSponsor = async (id: string | null) => {
    if (!id) {
      setExpandedSponsorId(null);
      return;
    }
    setExpandedSponsorId(id);
    try {
      const res = await fetch(`/api/audit-logs?objectId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setSponsorTimelineLogs((prev) => ({ ...prev, [id]: data }));
      }
    } catch (e) {
      console.error("Failed to fetch sponsor timeline logs", e);
    }
  };
  const [articleAuthorFilter, setArticleAuthorFilter] = useState("");
  const [articleDeptFilter, setArticleDeptFilter] = useState("");
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [articleDateStart, setArticleDateStart] = useState("");
  const [articleDateEnd, setArticleDateEnd] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditUserQuery, setAuditUserQuery] = useState("");
  const [auditModuleFilter, setAuditModuleFilter] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("");
  const [auditDateStart, setAuditDateStart] = useState("");
  const [auditDateEnd, setAuditDateEnd] = useState("");

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (auditUserQuery) params.set("user", auditUserQuery);
      if (auditModuleFilter) params.set("module", auditModuleFilter);
      if (auditActionFilter) params.set("action", auditActionFilter);
      if (auditDateStart) params.set("dateStart", auditDateStart);
      if (auditDateEnd) params.set("dateEnd", auditDateEnd);

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch global audit logs", e);
    }
  };

  useEffect(() => {
    if (activeTab === "audit-logs") {
      fetchAuditLogs();
    }
  }, [activeTab, auditUserQuery, auditModuleFilter, auditActionFilter, auditDateStart, auditDateEnd]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // DM states
  const [dmConversations, setDmConversations] = useState<any[]>([]);
  const [selectedDmConv, setSelectedDmConv] = useState<any | null>(null);
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [dmInput, setDmInput] = useState("");
  const [dmSearchQuery, setDmSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResultsUsers, setSearchResultsUsers] = useState<any[]>([]);
  const [showNewDmModal, setShowNewDmModal] = useState(false);
  const [dmChatSearchQuery, setDmChatSearchQuery] = useState("");

  // Groups states
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [groupMessages, setGroupMessages] = useState<any[]>([]);
  const [groupInput, setGroupInput] = useState("");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupSelectedMembers, setNewGroupSelectedMembers] = useState<string[]>([]);
  const [groupChatSearchQuery, setGroupChatSearchQuery] = useState("");

  // Announcements states
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementMsg, setNewAnnouncementMsg] = useState("");
  const [newAnnouncementExpiry, setNewAnnouncementExpiry] = useState("");
  const [newAnnouncementPinned, setNewAnnouncementPinned] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("sidebar-collapsed");
      if (val === "true") {
        setSidebarCollapsed(true);
      }
    }
  }, []);

  const toggleSidebarCollapse = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error("Failed to fetch user notifications", e);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDmConversations = async () => {
    try {
      const res = await fetch("/api/inbox/conversations");
      if (res.ok) {
        const data = await res.json();
        setDmConversations(data);
      }
    } catch (e) {
      console.error("Failed to load DMs", e);
    }
  };

  const fetchDmMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/inbox/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setDmMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Failed to load conversation messages", e);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/inbox/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (e) {
      console.error("Failed to load groups list", e);
    }
  };

  const fetchGroupMessages = async (groupId: string) => {
    try {
      const res = await fetch(`/api/inbox/conversations/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        setGroupMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Failed to load group messages", e);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/inbox/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (e) {
      console.error("Failed to load announcements list", e);
    }
  };

  useEffect(() => {
    const searchUsers = async () => {
      if (userSearchQuery.trim() === "") {
        setSearchResultsUsers([]);
        return;
      }
      try {
        const res = await fetch(`/api/inbox/users?query=${encodeURIComponent(userSearchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResultsUsers(data);
        }
      } catch (e) {
        console.error("User search failed", e);
      }
    };

    const delay = setTimeout(searchUsers, 500);
    return () => clearTimeout(delay);
  }, [userSearchQuery]);

  useEffect(() => {
    if (activeTab === "inbox-dm") {
      fetchDmConversations();
    } else if (activeTab === "inbox-groups") {
      fetchGroups();
    } else if (activeTab === "inbox-announcements") {
      fetchAnnouncements();
    }
  }, [activeTab]);

  useEffect(() => {
    let interval: any;
    if (activeTab === "inbox-dm" && selectedDmConv) {
      fetchDmMessages(selectedDmConv.id);
      interval = setInterval(() => fetchDmMessages(selectedDmConv.id), 8000);
    } else if (activeTab === "inbox-groups" && selectedGroup) {
      fetchGroupMessages(selectedGroup.id);
      interval = setInterval(() => fetchGroupMessages(selectedGroup.id), 8000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, selectedDmConv, selectedGroup]);

  const handleSendDmMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDmConv || dmInput.trim() === "") return;
    try {
      const res = await fetch(`/api/inbox/conversations/${selectedDmConv.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: dmInput }),
      });
      if (res.ok) {
        setDmInput("");
        fetchDmMessages(selectedDmConv.id);
        fetchDmConversations();
      }
    } catch (e) {
      console.error("Failed to send DM", e);
    }
  };

  const handleStartDm = async (recipientUsername: string, recipientFullName: string, recipientPhoto: string) => {
    try {
      const res = await fetch("/api/inbox/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientUsername }),
      });
      if (res.ok) {
        const conv = await res.json();
        setShowNewDmModal(false);
        setUserSearchQuery("");
        setSearchResultsUsers([]);
        
        await fetchDmConversations();
        
        setSelectedDmConv({
          id: conv.id,
          type: "DIRECT",
          displayName: recipientFullName,
          displayPhoto: recipientPhoto,
        });
      }
    } catch (e) {
      console.error("Failed to start DM", e);
    }
  };

  const handleArchiveDmConversation = async (convId: string, isCurrentlyArchived: boolean) => {
    try {
      const res = await fetch(`/api/inbox/conversations/${convId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isCurrentlyArchived ? "UNARCHIVE" : "ARCHIVE" }),
      });
      if (res.ok) {
        if (selectedDmConv?.id === convId) {
          setSelectedDmConv(null);
          setDmMessages([]);
        }
        fetchDmConversations();
      }
    } catch (e) {
      console.error("Failed to archive conversation", e);
    }
  };

  const handleDeleteDmConversation = async (convId: string) => {
    if (!confirm("Are you sure you want to delete this conversation? This only removes it from your view.")) return;
    try {
      const res = await fetch(`/api/inbox/conversations/${convId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE" }),
      });
      if (res.ok) {
        if (selectedDmConv?.id === convId) {
          setSelectedDmConv(null);
          setDmMessages([]);
        }
        fetchDmConversations();
      }
    } catch (e) {
      console.error("Failed to delete conversation", e);
    }
  };

  const handleSendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || groupInput.trim() === "") return;
    try {
      const res = await fetch(`/api/inbox/conversations/${selectedGroup.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: groupInput }),
      });
      if (res.ok) {
        setGroupInput("");
        fetchGroupMessages(selectedGroup.id);
        fetchGroups();
      }
    } catch (e) {
      console.error("Failed to send group message", e);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim() === "" || newGroupSelectedMembers.length === 0) return;
    try {
      const res = await fetch("/api/inbox/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDesc,
          members: newGroupSelectedMembers,
        }),
      });
      if (res.ok) {
        const group = await res.json();
        setNewGroupName("");
        setNewGroupDesc("");
        setNewGroupSelectedMembers([]);
        setShowCreateGroupModal(false);
        fetchGroups();
        setSelectedGroup(group);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create group");
      }
    } catch (e) {
      console.error("Failed to create group", e);
    }
  };

  const handleArchiveGroup = async (groupId: string) => {
    try {
      const res = await fetch(`/api/inbox/conversations/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ARCHIVE" }),
      });
      if (res.ok) {
        setSelectedGroup(null);
        setGroupMessages([]);
        fetchGroups();
      }
    } catch (e) {
      console.error("Failed to archive group", e);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncementTitle.trim() === "" || newAnnouncementMsg.trim() === "") return;
    try {
      const res = await fetch("/api/inbox/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAnnouncementTitle,
          message: newAnnouncementMsg,
          expiryDate: newAnnouncementExpiry || null,
          isPinned: newAnnouncementPinned,
        }),
      });
      if (res.ok) {
        setNewAnnouncementTitle("");
        setNewAnnouncementMsg("");
        setNewAnnouncementExpiry("");
        setNewAnnouncementPinned(false);
        setShowNewAnnouncementModal(false);
        fetchAnnouncements();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to publish announcement");
      }
    } catch (e) {
      console.error("Failed to publish announcement", e);
    }
  };

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user profile details");
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data);
        if (data.workspaces && data.workspaces.length > 0) {
          setActiveWorkspace(data.workspaces[0]);
        }
      })
      .catch((err) => {
        console.error("Error retrieving user session:", err);
      });
  }, []);

  const getSidebarLinks = () => {
    if (!currentUser) return [];

    const role = currentUser.role;
    const links: Array<{ id: "dashboard" | "articles" | "sponsors" | "inbox" | "ticker" | "users" | "reports" | "audit-logs"; label: string; icon: React.ReactNode }> = [
      { 
        id: "dashboard", 
        label: "Dashboard", 
        icon: (
          <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
        )
      }
    ];

    if (activeWorkspace === "Publication") {
      links.push({ 
        id: "articles", 
        label: "Publications", 
        icon: (
          <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ) 
      });
      links.push({ 
        id: "ticker", 
        label: "Breaking News", 
        icon: (
          <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        ) 
      });
      
      if (role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") {
        links.push({ 
          id: "inbox", 
          label: "Inbox Messages", 
          icon: (
            <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          ) 
        });
      }
    } else if (activeWorkspace === "Marketing") {
      if (role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") {
        links.push({ 
          id: "sponsors", 
          label: "Sponsor Placements", 
          icon: (
            <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            </svg>
          ) 
        });
      }
    } else if (activeWorkspace === "Research") {
      if (role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") {
        links.push({ 
          id: "reports", 
          label: "Research Overview", 
          icon: (
            <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          ) 
        });
      }
    }

    // Users Directory is always visible to Owner/Admin
    if (role === "OWNER" || role === "ADMIN") {
      links.push({ 
        id: "users", 
        label: "Users", 
        icon: (
          <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        ) 
      });
      links.push({
        id: "audit-logs",
        label: "Audit Logs",
        icon: (
          <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        )
      });
    }

    return links;
  };

  const visibleTabs = getSidebarLinks();

  const allowedWorkspaces = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN" || currentUser?.role === "SUPERVISOR"
    ? ["Publication", "Marketing", "Research"]
    : currentUser?.workspaces || ["Publication"];

  useEffect(() => {
    if (visibleTabs.length > 0) {
      const tabIds = visibleTabs.map((t) => t.id) as string[];
      if (!tabIds.includes(activeTab) && !["inbox-dm", "inbox-groups", "inbox-announcements"].includes(activeTab)) {
        setActiveTab("dashboard");
      }
    }
  }, [activeWorkspace, currentUser]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setTickerMessage("");
    try {
      // Build search params for backend filtering
      const articlesParams = new URLSearchParams();
      if (articleSearchQuery) articlesParams.set("search", articleSearchQuery);
      if (articleAuthorFilter) articlesParams.set("author", articleAuthorFilter);
      if (articleDeptFilter) articlesParams.set("department", articleDeptFilter);
      if (articleDateStart) articlesParams.set("dateStart", articleDateStart);
      if (articleDateEnd) articlesParams.set("dateEnd", articleDateEnd);

      const articlesRes = await fetch(`/api/articles?${articlesParams}`);
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setArticles(articlesData);
      }

      const sponsorsRes = await fetch("/api/sponsors");
      if (sponsorsRes.ok) {
        const sponsorsData = await sponsorsRes.json();
        setSponsors(sponsorsData);
      }

      const messagesRes = await fetch("/api/contact");
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }

      const tickerRes = await fetch("/api/breaking-news");
      if (tickerRes.ok) {
        const data = await tickerRes.json();
        setTickerMode(data.mode);
        let parsed = [];
        try {
          if (data.manualText && data.manualText.trim().startsWith("[")) {
            parsed = JSON.parse(data.manualText);
          } else if (data.manualText) {
            parsed = data.manualText
              .split("|")
              .map((t: string) => ({ text: t.trim(), expiryOption: "infinity", expiresAt: null }))
              .filter((x: any) => x.text.length > 0);
          }
        } catch (e) {
          console.error("JSON parse error", e);
        }
        while (parsed.length < 4) {
          parsed.push({ text: "", expiryOption: "infinity", expiresAt: null });
        }
        setTickerItems(parsed);
      }

      // Fetch users list
      const queryParams = new URLSearchParams({
        search: usersSearch,
        role: usersRoleFilter,
        status: usersStatusFilter,
        department: usersDeptFilter,
        archived: usersArchivedFilter ? "true" : "false",
        sort: usersSort,
        order: usersOrder,
        page: usersPage.toString(),
        limit: "10",
      });
      const usersRes = await fetch(`/api/users?${queryParams}`);
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users);
        setUsersTotal(data.total);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load database content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    activeTab,
    usersPage,
    usersRoleFilter,
    usersStatusFilter,
    usersDeptFilter,
    usersArchivedFilter,
    usersSort,
    usersOrder,
    // Add publication filters to triggers
    articleAuthorFilter,
    articleDeptFilter,
    articleSearchQuery,
    articleDateStart,
    articleDateEnd,
  ]);

  // Global simple search handler
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search Articles
    articles.forEach(art => {
      if (art.title.toLowerCase().includes(query) || art.author.toLowerCase().includes(query)) {
        results.push({ type: "Publication", title: art.title, sub: `By ${art.author}`, action: () => { setActiveTab("articles"); setSearchQuery(""); } });
      }
    });

    // Search Users
    users.forEach(u => {
      if (u.fullName.toLowerCase().includes(query) || u.username.toLowerCase().includes(query)) {
        results.push({ type: "User", title: u.fullName, sub: `@${u.username}`, action: () => { setActiveTab("users"); setSearchQuery(""); } });
      }
    });

    // Search Sponsors
    sponsors.forEach(spo => {
      if (spo.title.toLowerCase().includes(query)) {
        results.push({ type: "Sponsor", title: spo.title, sub: `Link: ${spo.linkUrl}`, action: () => { setActiveTab("sponsors"); setSearchQuery(""); } });
      }
    });

    // Search Pages/Navigation options
    const pages = [
      { title: "Publications Board", tab: "articles" },
      { title: "Breaking News Ticker", tab: "ticker" },
      { title: "Sponsor Placements", tab: "sponsors" },
      { title: "Inbox Inquiries", tab: "inbox" },
      { title: "Users Directory", tab: "users" },
      { title: "Reports Dashboard", tab: "reports" },
    ];
    pages.forEach(p => {
      if (p.title.toLowerCase().includes(query)) {
        results.push({ type: "Page Link", title: p.title, sub: "Navigation shortcut", action: () => { setActiveTab(p.tab as any); setSearchQuery(""); } });
      }
    });

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, articles, users, sponsors]);

  const handleDelete = async (id: string) => {
    const actionText = currentUser?.role === "SUPERVISOR" ? "move this publication to trash" : "permanently delete this publication";
    if (!confirm(`Are you sure you want to ${actionText}?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete operation failed");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete article");
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: string, extra = {}) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, ...extra }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to transition status");
      }
      fetchData();
      setActiveRevisionArticleId(null);
      setActiveScheduleArticleId(null);
    } catch (err: any) {
      setError(err.message || "Status change failed");
    }
  };

  const handleRestoreTrash = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}?action=restore`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to restore article");
      }
      fetchData();
    } catch (err: any) {
      setError(err.message || "Restoring draft failed");
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete contact message");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Delete inquiry failed");
    }
  };

  const handleArchiveToggle = async (userId: string, currentlyArchived: boolean) => {
    const actionText = currentlyArchived ? "restore" : "archive";
    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !currentlyArchived }),
      });
      if (!res.ok) throw new Error("Archive toggle failed");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to toggle archive status");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleSaveTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTicker(true);
    setTickerMessage("");
    setError("");

    try {
      const validManualItems = tickerItems.filter((item) => item.text.trim() !== "");
      
      const res = await fetch("/api/breaking-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: tickerMode,
          manualText: JSON.stringify(validManualItems),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update news settings");

      setTickerMessage("Breaking News ticker settings updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save ticker config");
    } finally {
      setSavingTicker(false);
    }
  };

  const handleUsersSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsersPage(1);
    fetchData();
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addUserFullName.trim() === "" || addUserUsername.trim() === "" || addUserEmail.trim() === "") return;
    
    const finalPassword = addUserPasswordMode === "invite" 
      ? Math.random().toString(36).slice(-10) + "Temp1$" 
      : addUserTempPassword;

    if (addUserPasswordMode === "temp" && addUserTempPassword.trim() === "") {
      alert("Please provide a temporary password");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: addUserFullName,
          username: addUserUsername,
          email: addUserEmail,
          password: finalPassword,
          role: addUserRole,
          departments: [addUserDept],
          workspaces: [addUserWorkspace],
          forcePasswordChange: true,
        }),
      });

      if (res.ok) {
        setAddUserFullName("");
        setAddUserUsername("");
        setAddUserEmail("");
        setAddUserTempPassword("");
        setShowAddUserModal(false);
        fetchData(); // Reload user directory list
        alert(addUserPasswordMode === "invite" 
          ? `User invited successfully! Temporary password generated: ${finalPassword}`
          : "User account created successfully!"
        );
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create user account");
      }
    } catch (e) {
      console.error("Failed to create user", e);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "weekly-updates":
        return "bg-brand-red/10 text-brand-red border-brand-red/20";
      case "daily-feed":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
      case "global-events":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
      case "forex":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "learn-forex":
        return "bg-purple-500/10 text-purple-650 dark:text-purple-450 border-purple-500/25";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getBreadcrumbs = () => {
    const activeLabel = visibleTabs.find((t) => t.id === activeTab)?.label || "Overview";
    return (
      <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        <span>Control Room</span>
        <span>&rsaquo;</span>
        <span className="text-neutral-550 dark:text-neutral-400">{activeWorkspace}</span>
        <span>&rsaquo;</span>
        <span className="text-brand-red font-extrabold">{activeLabel}</span>
      </div>
    );
  };

  // Filter in memory for immediate counts
  const filteredArticles = articles.filter(a => a.status === articleSubFilter);

  const renderDashboardWidgets = () => {
    if (!currentUser) return null;
    const role = currentUser.role;

    const myArticles = articles.filter(a => a.author === currentUser.username);
    const myDrafts = myArticles.filter(a => a.status === "DRAFT");
    const myPublished = myArticles.filter(a => a.status === "PUBLISHED");
    const pendingReviews = articles.filter(a => a.status === "PENDING");

    const hasArticleCreate = role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR" || role === "EMPLOYEE";
    const hasTickerCreate = role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR" || role === "EMPLOYEE";
    const hasSponsorManage = role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR";
    const hasUserManage = role === "OWNER" || role === "ADMIN";

    const QuickActionsWidget = (
      <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">Quick Actions</h4>
        <div className="grid grid-cols-1 gap-2.5">
          {hasArticleCreate && (
            <Link href="/admin/dashboard/create" className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 rounded border border-neutral-150 dark:border-neutral-800 text-xs font-bold text-neutral-755 dark:text-neutral-300 transition-colors">
              <span>+ New Publication</span>
              <span className="text-[10px] font-bold text-neutral-400">&rarr;</span>
            </Link>
          )}
          {hasTickerCreate && (
            <button onClick={() => setActiveTab("ticker")} className="flex items-center justify-between p-2.5 w-full bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 rounded border border-neutral-150 dark:border-neutral-800 text-xs font-bold text-neutral-755 dark:text-neutral-300 text-left transition-colors cursor-pointer">
              <span>Create Breaking News</span>
              <span className="text-[10px] font-bold text-neutral-400">&rarr;</span>
            </button>
          )}
          {hasSponsorManage && (
            <button onClick={() => setActiveTab("sponsors")} className="flex items-center justify-between p-2.5 w-full bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 rounded border border-neutral-150 dark:border-neutral-800 text-xs font-bold text-neutral-755 dark:text-neutral-300 text-left transition-colors cursor-pointer">
              <span>Manage Placements</span>
              <span className="text-[10px] font-bold text-neutral-400">&rarr;</span>
            </button>
          )}
          {hasUserManage && (
            <Link href="/admin/dashboard/users/create" className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 rounded border border-neutral-150 dark:border-neutral-800 text-xs font-bold text-neutral-755 dark:text-neutral-300 transition-colors">
              <span>Invite New User</span>
              <span className="text-[10px] font-bold text-neutral-400">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    );

    const EmployeeWidget = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">My Drafts</span>
              <span className="text-2xl font-bold text-brand-dark dark:text-white block mt-1">{myDrafts.length}</span>
            </div>
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">My Published Articles</span>
              <span className="text-2xl font-bold text-brand-dark dark:text-white block mt-1">{myPublished.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">My Draft Publications</h4>
            {myDrafts.length === 0 ? (
              <p className="text-xs text-neutral-455 italic py-4">No active draft publications found.</p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                {myDrafts.map((art) => (
                  <div key={art.id} className="py-3 flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-900 dark:text-neutral-200 max-w-[200px] truncate">{art.title}</span>
                    <span className="text-neutral-400">{new Date(art.publishedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          {QuickActionsWidget}
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">Online Status</h4>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-350">Active Session - Editor</span>
            </div>
          </div>
        </div>
      </div>
    );

    const SupervisorWidget = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">Pending Editorial Reviews</h4>
            {pendingReviews.length === 0 ? (
              <p className="text-xs text-neutral-455 italic py-4">No publications awaiting approval.</p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                {pendingReviews.map((art) => (
                  <div key={art.id} className="py-3.5 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-200">{art.title}</div>
                      <div className="text-[10px] text-neutral-455 mt-0.5">By {art.author} in {art.department}</div>
                    </div>
                    <button onClick={() => { setArticleSubFilter("PENDING"); setActiveTab("articles"); }} className="text-[10px] uppercase font-bold text-brand-red hover:underline cursor-pointer">
                      Review &rsaquo;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          {QuickActionsWidget}
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">Department Scope</h4>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Supervising: {currentUser?.departments?.join(", ") || "Publications"}
            </span>
          </div>
        </div>
      </div>
    );

    const AdminWidget = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">Users Directory Preview</h4>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-200">{u.fullName}</span>
                    <span className="text-[10px] text-neutral-455 ml-1 font-mono">@{u.username}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-brand-red">{u.role}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab("users")} className="text-[10px] uppercase font-bold text-neutral-455 hover:text-brand-red transition-colors block mt-4 text-center w-full">
              View All Directory Users &rsaquo;
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {QuickActionsWidget}
        </div>
      </div>
    );

    const OwnerWidget = (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 text-center">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Platform Users</span>
            <span className="text-2xl font-bold text-brand-dark dark:text-white block mt-1">{users.length}</span>
          </div>
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 text-center">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Publications Total</span>
            <span className="text-2xl font-bold text-brand-dark dark:text-white block mt-1">{articles.length}</span>
          </div>
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 text-center">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Active Campaigns</span>
            <span className="text-2xl font-bold text-brand-dark dark:text-white block mt-1">{sponsors.length}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red mb-3">Owner Master Console</h4>
              <p className="text-xs text-neutral-455 leading-relaxed mb-4">
                Accessing platform-wide overrides. Select appropriate workspaces or search query boxes above.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {QuickActionsWidget}
          </div>
        </div>
      </div>
    );

    if (role === "EMPLOYEE") return EmployeeWidget;
    if (role === "SUPERVISOR") return SupervisorWidget;
    if (role === "ADMIN") return AdminWidget;
    if (role === "OWNER") return OwnerWidget;
    return null;
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-850 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="h-24 bg-neutral-200 dark:bg-neutral-855 rounded"></div>
            <div className="h-24 bg-neutral-200 dark:bg-neutral-855 rounded"></div>
            <div className="h-24 bg-neutral-200 dark:bg-neutral-855 rounded"></div>
          </div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-855 rounded"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return renderDashboardWidgets();

      case "articles":
        const hasSupervisorOrAbove = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN" || currentUser?.role === "SUPERVISOR";
        const hasAdminOrOwner = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";

        return (
          <div className="space-y-6">
            {/* Filters Row */}
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                <input
                  type="text"
                  placeholder="Search articles (title, author, category, status)..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  className="sm:col-span-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-855 text-xs rounded-sm px-3 py-1.5 focus:outline-none focus:border-brand-red text-neutral-800 dark:text-neutral-200"
                />
                <input
                  type="text"
                  placeholder="Filter by author..."
                  value={articleAuthorFilter}
                  onChange={(e) => setArticleAuthorFilter(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-855 text-xs rounded-sm px-3 py-1.5 focus:outline-none focus:border-brand-red text-neutral-800 dark:text-neutral-200"
                />
                <select
                  value={articleDeptFilter}
                  onChange={(e) => setArticleDeptFilter(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-855 text-xs rounded-sm px-2 py-1.5 focus:outline-none text-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <option value="">All Departments</option>
                  <option value="Publications">Publications</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                </select>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={articleDateStart}
                    onChange={(e) => setArticleDateStart(e.target.value)}
                    className="w-1/2 bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-855 text-xs rounded-sm px-1.5 py-1 focus:outline-none text-neutral-600 dark:text-neutral-300"
                  />
                  <input
                    type="date"
                    value={articleDateEnd}
                    onChange={(e) => setArticleDateEnd(e.target.value)}
                    className="w-1/2 bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-855 text-xs rounded-sm px-1.5 py-1 focus:outline-none text-neutral-600 dark:text-neutral-300"
                  />
                </div>
              </div>

              {/* Clear filters trigger */}
              {(articleSearchQuery || articleAuthorFilter || articleDeptFilter || articleDateStart || articleDateEnd) && (
                <button
                  onClick={() => {
                    setArticleSearchQuery("");
                    setArticleAuthorFilter("");
                    setArticleDeptFilter("");
                    setArticleDateStart("");
                    setArticleDateEnd("");
                  }}
                  className="text-[10px] font-bold uppercase text-brand-red hover:underline"
                >
                  &times; Clear Active Filters
                </button>
              )}
            </div>

            {/* Horizontal Sub-Navigation status Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto whitespace-nowrap">
              {(["DRAFT", "PENDING", "PUBLISHED", "SCHEDULED", "ARCHIVED", "TRASH"] as const).map((status) => {
                const count = articles.filter(a => a.status === status).length;
                const labels = {
                  DRAFT: "Drafts",
                  PENDING: "Pending Review",
                  PUBLISHED: "Published",
                  SCHEDULED: "Scheduled",
                  ARCHIVED: "Archived",
                  TRASH: "Trash",
                };
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setArticleSubFilter(status);
                      setExpandedArticleId(null);
                    }}
                    className={`py-3 px-5 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
                      articleSubFilter === status
                        ? "border-brand-red text-brand-red font-extrabold"
                        : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    }`}
                  >
                    {labels[status]} ({count})
                  </button>
                );
              })}
            </div>

            {/* List Table */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest bg-white dark:bg-brand-dark-card transition-colors">
                No publications found under this status.
                {articleSubFilter === "DRAFT" && (
                  <div className="mt-4">
                    <Link href="/admin/dashboard/create" className="inline-flex items-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-sm transition-all">
                      Create your first draft
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden shadow-sm transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-850 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                        <th className="py-3 px-5">Category</th>
                        <th className="py-3 px-5">Title</th>
                        <th className="py-3 px-5">Author</th>
                        <th className="py-3 px-5">Department</th>
                        <th className="py-3 px-5">Date</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                      {filteredArticles.map((art) => {
                        const isExpanded = expandedArticleId === art.id;
                        const isOwnArticle = art.author === currentUser?.username;
                        const isSameDept = currentUser?.departments?.includes(art.department);

                        return (
                          <React.Fragment key={art.id}>
                            <tr
                              className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors align-middle cursor-pointer ${
                                isExpanded ? "bg-neutral-50/30 dark:bg-neutral-900/10" : ""
                              }`}
                              onClick={() => toggleExpandArticle(isExpanded ? null : art.id)}
                            >
                              <td className="py-4 px-5 shrink-0 whitespace-nowrap">
                                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${getCategoryColor(art.category)}`}>
                                  {art.category.replace("-", " ")}
                                </span>
                              </td>
                              <td className="py-4 px-5 max-w-[280px] sm:max-w-md truncate text-neutral-900 dark:text-neutral-200 font-serif font-bold text-sm">
                                <div className="flex items-center space-x-2">
                                  <span>{art.title}</span>
                                  {art.status === "DRAFT" && art.revisionComment && (
                                    <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                                      Needs Revision
                                    </span>
                                  )}
                                  {art.isFeatured && (
                                    <span className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/25 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                                      ★ Featured
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-5 text-neutral-500">{art.author}</td>
                              <td className="py-4 px-5 text-neutral-455 font-bold uppercase text-[10px] tracking-wider">{art.department}</td>
                              <td className="py-4 px-5 font-mono text-neutral-500 whitespace-nowrap">
                                {new Date(art.publishedAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-5 text-right space-x-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                {/* Action workflow buttons */}

                                {/* Employee Gating */}
                                {currentUser?.role === "EMPLOYEE" && (
                                  <>
                                    {art.status === "DRAFT" && isOwnArticle && (
                                      <>
                                        <Link href={`/admin/dashboard/users/create`} className="hidden" /> {/* link check */}
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "PENDING")}
                                          className="text-emerald-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Submit for Review
                                        </button>
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                    {art.status !== "DRAFT" && (
                                      <span className="text-[10px] text-neutral-450 italic font-bold">Read-Only</span>
                                    )}
                                  </>
                                )}

                                {/* Supervisor Actions */}
                                {currentUser?.role === "SUPERVISOR" && (
                                  <>
                                    {art.status === "PENDING" && isSameDept && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "PUBLISHED")}
                                          className="text-emerald-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Approve &amp; Publish
                                        </button>
                                        <button
                                          onClick={() => setActiveScheduleArticleId(art.id)}
                                          className="text-blue-500 hover:text-blue-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Schedule
                                        </button>
                                        <button
                                          onClick={() => setActiveRevisionArticleId(art.id)}
                                          className="text-amber-500 hover:text-amber-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Return
                                        </button>
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Trash
                                        </button>
                                      </>
                                    )}

                                    {art.status === "PUBLISHED" && isSameDept && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "ARCHIVED")}
                                          className="text-neutral-505 hover:text-neutral-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Archive
                                        </button>
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Trash
                                        </button>
                                      </>
                                    )}

                                    {art.status === "SCHEDULED" && isSameDept && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "DRAFT")}
                                          className="text-neutral-505 hover:text-neutral-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Cancel Schedule
                                        </button>
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Trash
                                        </button>
                                      </>
                                    )}

                                    {art.status === "DRAFT" && isSameDept && (
                                      <>
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "PENDING")}
                                          className="text-emerald-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Submit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Trash
                                        </button>
                                      </>
                                    )}

                                    {art.status === "TRASH" && (
                                      <span className="text-[10px] text-neutral-400 italic">No Actions</span>
                                    )}
                                  </>
                                )}

                                {/* Admin / Owner Actions */}
                                {hasAdminOrOwner && (
                                  <>
                                    {art.status === "TRASH" ? (
                                      <>
                                        <button
                                          onClick={() => handleRestoreTrash(art.id)}
                                          className="text-emerald-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Restore
                                        </button>
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Delete Permanently
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {art.status === "PENDING" && (
                                          <button
                                            onClick={() => handleUpdateStatus(art.id, "PUBLISHED")}
                                            className="text-emerald-500 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                                          >
                                            Publish
                                          </button>
                                        )}
                                        {art.status === "PUBLISHED" && (
                                          <button
                                            onClick={() => handleUpdateStatus(art.id, "ARCHIVED")}
                                            className="text-neutral-505 hover:text-neutral-700 font-bold transition-colors cursor-pointer"
                                          >
                                            Archive
                                          </button>
                                        )}
                                        {art.status === "ARCHIVED" && (
                                          <button
                                            onClick={() => handleUpdateStatus(art.id, "DRAFT")}
                                            className="text-emerald-505 hover:text-emerald-700 font-bold transition-colors cursor-pointer"
                                          >
                                            Restore to Draft
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleDelete(art.id)}
                                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                                        >
                                          Trash
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                              </td>
                            </tr>

                            {/* Expandable Article Metadata Panel */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={6} className="bg-neutral-50/50 dark:bg-neutral-900/30 p-5 border-t border-b border-neutral-100 dark:border-neutral-850">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">Article Metadata Info</span>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Author:</span> {art.author}</div>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Department:</span> {art.department}</div>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Current Status:</span> {art.status}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">Publication Logs</span>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Published By:</span> {art.publishedBy || "Not published"}</div>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Published At:</span> {art.publishedAt ? new Date(art.publishedAt).toLocaleString() : "N/A"}</div>
                                      {art.status === "SCHEDULED" && (
                                        <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Scheduled At:</span> {art.scheduledAt ? new Date(art.scheduledAt).toLocaleString() : "N/A"}</div>
                                      )}
                                    </div>
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">Activity Tracking</span>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Created:</span> {new Date(art.publishedAt).toLocaleDateString()}</div>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Last Modified:</span> {new Date(art.updatedAt).toLocaleString()}</div>
                                      <div><span className="font-bold text-neutral-800 dark:text-neutral-200">Last Edited By:</span> {art.editedBy || "N/A"}</div>
                                    </div>
                                  </div>

                                  {/* Article Timeline Logs */}
                                  <div className="mt-5 border-t border-neutral-100 dark:border-neutral-800/85 pt-4">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block mb-3">Article Timeline History</span>
                                    {(!articleTimelineLogs[art.id] || articleTimelineLogs[art.id].length === 0) ? (
                                      <div className="text-[11px] italic text-neutral-450">No timeline history recorded for this article.</div>
                                    ) : (
                                      <div className="border border-neutral-150 dark:border-neutral-850 rounded divide-y divide-neutral-100 dark:divide-neutral-850 max-h-48 overflow-y-auto font-medium">
                                        {articleTimelineLogs[art.id].map((log) => (
                                          <div key={log.id} className="p-3 text-[11.5px] flex flex-col sm:flex-row sm:justify-between gap-1.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors">
                                            <div>
                                              <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
                                                {log.action}
                                              </span>
                                              {log.details && (
                                                <span className="text-neutral-455 ml-2 font-semibold">
                                                  &ldquo;{log.details}&rdquo;
                                                </span>
                                              )}
                                            </div>
                                            <div className="shrink-0 flex items-center space-x-2 text-neutral-400 font-mono text-[9.5px] self-start sm:self-auto">
                                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                                              <span>&bull;</span>
                                              <span className="font-bold uppercase">{log.username}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Return for Revision Modal Panel */}
                                  {activeRevisionArticleId === art.id && (
                                    <div className="mt-4 p-4 border border-amber-500/30 bg-amber-500/5 rounded space-y-3">
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 block">Revision Comment Request Form</span>
                                      <textarea
                                        placeholder="Add revision feedback instructions for employee..."
                                        value={revisionCommentInput}
                                        onChange={(e) => setRevisionCommentInput(e.target.value)}
                                        className="w-full text-xs p-2 bg-white dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-850 rounded focus:outline-none"
                                        rows={3}
                                      />
                                      <div className="flex justify-end space-x-2">
                                        <button
                                          onClick={() => setActiveRevisionArticleId(null)}
                                          className="px-3 py-1 bg-neutral-200 text-neutral-700 font-bold rounded-sm cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "DRAFT", { revisionComment: revisionCommentInput })}
                                          className="px-3 py-1 bg-amber-500 text-white font-bold rounded-sm cursor-pointer"
                                        >
                                          Return Draft
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Schedule Date Modal Panel */}
                                  {activeScheduleArticleId === art.id && (
                                    <div className="mt-4 p-4 border border-blue-500/30 bg-blue-500/5 rounded space-y-3">
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500 block">Schedule Publication Date</span>
                                      <input
                                        type="datetime-local"
                                        value={scheduleDateInput}
                                        onChange={(e) => setScheduleDateInput(e.target.value)}
                                        className="w-full text-xs p-2 bg-white dark:bg-neutral-955 border border-neutral-250 dark:border-neutral-855 rounded focus:outline-none text-neutral-800 dark:text-neutral-200"
                                      />
                                      <div className="flex justify-end space-x-2">
                                        <button
                                          onClick={() => setActiveScheduleArticleId(null)}
                                          className="px-3 py-1 bg-neutral-200 text-neutral-700 font-bold rounded-sm cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleUpdateStatus(art.id, "SCHEDULED", { scheduledAt: new Date(scheduleDateInput).toISOString() })}
                                          className="px-3 py-1 bg-blue-500 text-white font-bold rounded-sm cursor-pointer"
                                        >
                                          Schedule Publication
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Display active revision feedback if present */}
                                  {art.status === "DRAFT" && art.revisionComment && (
                                    <div className="mt-4 p-3.5 bg-rose-500/5 border border-rose-500/20 text-rose-500 rounded text-xs">
                                      <div className="font-extrabold uppercase tracking-wider text-[10px] mb-1">Supervisor feedback (Needs Revision):</div>
                                      <div className="font-semibold">{art.revisionComment}</div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case "sponsors":
        return sponsors.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
            No active advertising placements found.
          </div>
        ) : (
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-855 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="py-3 px-5">Ad Placement</th>
                    <th className="py-3 px-5">Sponsor Title</th>
                    <th className="py-3 px-5">Target Link</th>
                    <th className="py-3 px-5">Logo / Image</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                  {sponsors.map((spo) => {
                    const isExpanded = expandedSponsorId === spo.id;
                    return (
                      <React.Fragment key={spo.id}>
                        <tr
                          className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors cursor-pointer ${isExpanded ? "bg-neutral-50/30 dark:bg-neutral-900/10" : ""}`}
                          onClick={() => toggleExpandSponsor(isExpanded ? null : spo.id)}
                        >
                          <td className="py-4 px-5 shrink-0 whitespace-nowrap font-mono text-[10.5px] uppercase font-bold text-neutral-400">
                            {spo.id.toUpperCase()}
                          </td>
                          <td className="py-4 px-5 text-neutral-900 dark:text-neutral-200 font-bold text-sm">
                            {spo.title}
                          </td>
                          <td className="py-4 px-5 text-neutral-500 max-w-[150px] truncate">
                            <a href={spo.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-red" onClick={e => e.stopPropagation()}>
                              {spo.linkUrl}
                            </a>
                          </td>
                          <td className="py-4 px-5">
                            {spo.imageUrl ? (
                              <img
                                src={spo.imageUrl}
                                alt={spo.title}
                                className="h-7 w-20 object-contain border border-neutral-100 dark:border-neutral-800 rounded p-0.5 bg-neutral-50 dark:bg-neutral-955"
                              />
                            ) : (
                              <span className="text-[10px] text-neutral-400 italic">No media loaded</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right space-x-3.5 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <Link
                              href={`/admin/dashboard/sponsors/${spo.id}`}
                              className="text-brand-red hover:text-brand-red-dark font-bold transition-colors"
                            >
                              Edit Spot Settings
                            </Link>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-neutral-50/50 dark:bg-neutral-900/30 p-5 border-t border-b border-neutral-100 dark:border-neutral-850">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block mb-3">Sponsor Activity Logs</span>
                              {(!sponsorTimelineLogs[spo.id] || sponsorTimelineLogs[spo.id].length === 0) ? (
                                <div className="text-[11px] italic text-neutral-455">No activity logged for this sponsor placement.</div>
                              ) : (
                                <div className="border border-neutral-150 dark:border-neutral-850 rounded divide-y divide-neutral-100 dark:divide-neutral-850 max-h-40 overflow-y-auto font-medium">
                                  {sponsorTimelineLogs[spo.id].map((log) => (
                                    <div key={log.id} className="p-3 text-[11px] flex justify-between items-center hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors">
                                      <div>
                                        <span className="font-bold text-neutral-880 dark:text-neutral-200 uppercase tracking-wide">
                                          {log.action}
                                        </span>
                                        {log.details && (
                                          <span className="text-neutral-455 ml-2 font-semibold">
                                            &ldquo;{log.details}&rdquo;
                                          </span>
                                        )}
                                      </div>
                                      <div className="shrink-0 flex items-center space-x-2 text-neutral-400 font-mono text-[9.5px]">
                                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                                        <span>&bull;</span>
                                        <span className="font-bold uppercase">{log.username}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "ticker":
        return (
          <form onSubmit={handleSaveTicker} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="font-serif font-bold text-base text-brand-dark dark:text-white mb-1.5">
                Breaking News Ticker Settings
              </h3>
              <p className="text-xs text-neutral-405 leading-normal">
                Choose between streaming real-time financial headlines automatically for free, or locking your own custom breaking alerts on the screen.
              </p>
            </div>

            <div className="space-y-3.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">
                Ticker Feed Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex flex-col p-4 border rounded cursor-pointer transition-all duration-200 ${
                  tickerMode === "auto"
                    ? "border-brand-red bg-brand-red/[0.02]"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10 hover:border-neutral-350"
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="radio"
                      name="tickerMode"
                      value="auto"
                      checked={tickerMode === "auto"}
                      onChange={() => setTickerMode("auto")}
                      className="accent-brand-red cursor-pointer"
                    />
                    <span className="text-xs font-bold text-neutral-855 dark:text-neutral-100">
                      Automatic Mode (Free Feed)
                    </span>
                  </div>
                  <span className="text-[10.5px] text-neutral-450 mt-2 leading-relaxed">
                    Fetches live financial news headlines from the Yahoo Finance RSS feed. Fully automated, updating in real-time.
                  </span>
                </label>

                <label className={`flex flex-col p-4 border rounded cursor-pointer transition-all duration-200 ${
                  tickerMode === "manual"
                    ? "border-brand-red bg-brand-red/[0.02]"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10 hover:border-neutral-350"
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="radio"
                      name="tickerMode"
                      value="manual"
                      checked={tickerMode === "manual"}
                      onChange={() => setTickerMode("manual")}
                      className="accent-brand-red cursor-pointer"
                    />
                    <span className="text-xs font-bold text-neutral-855 dark:text-neutral-100">
                      Manual Override Mode
                    </span>
                  </div>
                  <span className="text-[10.5px] text-neutral-450 mt-2 leading-relaxed">
                    Lock your own custom breaking announcements. Useful for major market rate cuts, announcements, or custom updates.
                  </span>
                </label>
              </div>
            </div>

            {tickerMode === "manual" && (
              <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800/80 pt-5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">
                    Manual Headlines Editor
                  </label>
                  <span className="text-[10px] text-neutral-450 font-bold uppercase">
                    {tickerItems.filter(item => item.text.trim() !== "").length} Active / {tickerItems.length} Boxes
                  </span>
                </div>

                <div className="space-y-3.5">
                  {tickerItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 bg-neutral-50/50 dark:bg-neutral-900/10 p-3 rounded border border-neutral-150 dark:border-neutral-850 transition-colors">
                      <div className="flex-grow space-y-1">
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider block">
                          Headline #{idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder={`Type breaking headline #${idx + 1}...`}
                          value={item.text}
                          onChange={(e) => {
                            const updated = [...tickerItems];
                            updated[idx].text = e.target.value;
                            updated[idx].isDirty = true;
                            setTickerItems(updated);
                          }}
                          className="w-full bg-transparent border-b border-transparent focus:border-brand-red focus:outline-none text-xs text-brand-dark dark:text-white font-medium py-0.5"
                        />
                      </div>

                      {/* Expiry Dropdown */}
                      <div className="shrink-0 flex flex-col space-y-1">
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider block">
                          Expiry
                        </span>
                        <select
                          value={item.expiryOption}
                          onChange={(e) => {
                            const updated = [...tickerItems];
                            updated[idx].expiryOption = e.target.value;
                            updated[idx].isDirty = true;
                            setTickerItems(updated);
                          }}
                          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded px-2.5 py-1 text-[11px] text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="infinity">Infinity (Never)</option>
                          <option value="10m">10 min</option>
                          <option value="20m">20 min</option>
                          <option value="30m">30 min</option>
                          <option value="1h">1 hour</option>
                          <option value="10h">10 hours</option>
                          <option value="12h">12 hours</option>
                          <option value="20h">20 hours</option>
                          <option value="24h">24 hours</option>
                          <option value="1d">1 day</option>
                        </select>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = tickerItems.filter((_, i) => i !== idx);
                          setTickerItems(updated);
                        }}
                        className="text-neutral-455 hover:text-red-600 p-1.5 mt-3 transition-colors shrink-0 cursor-pointer"
                        title="Delete headline"
                      >
                        <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Headline control */}
                {tickerItems.length < 11 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (tickerItems.length >= 11) return;
                      setTickerItems([...tickerItems, { text: "", expiryOption: "infinity", expiresAt: null }]);
                    }}
                    className="w-full py-2 border border-dashed border-neutral-300 dark:border-neutral-800 rounded text-center text-xs font-bold text-neutral-500 hover:border-neutral-450 dark:hover:border-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all cursor-pointer"
                  >
                    + Add News Headline Box ({tickerItems.length}/11)
                  </button>
                ) : (
                  <p className="text-[10px] text-amber-500 font-bold text-center uppercase tracking-wider leading-relaxed pt-2">
                    ⚠️ Maximum limit of 11 news headlines reached.
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="submit"
                disabled={savingTicker}
                className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingTicker ? "Saving Settings..." : "Save Ticker Settings"}
              </button>
            </div>
          </form>
        );

      case "inbox":
        return messages.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
            Inbox is empty. No messages submitted.
          </div>
        ) : (
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-850 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="py-3 px-5">Sender</th>
                    <th className="py-3 px-5">Subject</th>
                    <th className="py-3 px-5">Message Content</th>
                    <th className="py-3 px-5">Received At</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors align-top"
                    >
                      <td className="py-4 px-5 shrink-0 whitespace-nowrap">
                        <div className="font-bold text-neutral-900 dark:text-neutral-200">{msg.name}</div>
                        <a href={`mailto:${msg.email}`} className="text-[10px] text-brand-red hover:underline block mt-0.5">
                          {msg.email}
                        </a>
                      </td>
                      <td className="py-4 px-5 max-w-[150px] truncate text-neutral-855 dark:text-neutral-300 font-bold">
                        {msg.subject}
                      </td>
                      <td className="py-4 px-5 max-w-sm text-neutral-500 dark:text-neutral-400 text-xs leading-normal">
                        {msg.message}
                      </td>
                      <td className="py-4 px-5 font-mono text-neutral-500 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleMessageDelete(msg.id)}
                          className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      );

      case "users":
        return (
          <div className="space-y-6">
            <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors">
              <form onSubmit={handleUsersSearchSubmit} className="flex-grow flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  className="flex-grow bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 text-brand-dark dark:text-neutral-205 rounded-sm px-3.5 py-1.5 text-xs focus:outline-none focus:border-brand-red transition-all font-semibold"
                />
                <button
                  type="submit"
                  className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-sm transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={usersRoleFilter}
                  onChange={(e) => {
                    setUsersPage(1);
                    setUsersRoleFilter(e.target.value);
                  }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>

                <select
                  value={usersStatusFilter}
                  onChange={(e) => {
                    setUsersPage(1);
                    setUsersStatusFilter(e.target.value);
                  }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>

                <label className="flex items-center space-x-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={usersArchivedFilter}
                    onChange={(e) => {
                      setUsersPage(1);
                      setUsersArchivedFilter(e.target.checked);
                    }}
                    className="accent-brand-red cursor-pointer"
                  />
                  <span>Show Archived</span>
                </label>

                <select
                  value={`${usersSort}-${usersOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    setUsersSort(sort);
                    setUsersOrder(order as "asc" | "desc");
                  }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="fullName-asc">Sort: Name A-Z</option>
                  <option value="fullName-desc">Sort: Name Z-A</option>
                  <option value="role-asc">Sort: Role A-Z</option>
                  <option value="activeSince-desc">Sort: Date Joined</option>
                </select>

                {(currentUser?.role === "OWNER" || currentUser?.role === "ADMIN") && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-sm transition-colors cursor-pointer"
                  >
                    Add User
                  </button>
                )}
              </div>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
                No users found matching your filter criteria.
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-855 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                        <th className="py-3 px-5">Photo</th>
                        <th className="py-3 px-5">User Details</th>
                        <th className="py-3 px-5">Role</th>
                        <th className="py-3 px-5">Status</th>
                        <th className="py-3 px-5">Departments</th>
                        <th className="py-3 px-5">Last Activity</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-855 font-medium">
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors align-middle"
                        >
                          <td className="py-3.5 px-5 shrink-0">
                            <img
                              src={u.profilePhoto || "/images/default-avatar.png"}
                              alt={u.fullName}
                              className="h-8 w-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-855 bg-white"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/default-avatar.png";
                              }}
                            />
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-neutral-900 dark:text-neutral-200 text-sm">
                              {u.fullName}
                            </div>
                            <div className="text-[10.5px] text-neutral-455 mt-0.5 font-mono">
                              @{u.username} &bull; {u.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-5 shrink-0 whitespace-nowrap">
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                              u.role === "OWNER"
                                ? "bg-red-500/10 text-red-650 border-red-500/20"
                                : u.role === "ADMIN"
                                ? "bg-blue-500/10 text-blue-650 border-blue-500/20"
                                : u.role === "SUPERVISOR"
                                ? "bg-purple-500/10 text-purple-650 border-purple-500/20"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-900/50 dark:text-neutral-400 dark:border-neutral-855"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 shrink-0 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-505"
                                  : u.status === "SUSPENDED"
                                  ? "bg-rose-505"
                                  : "bg-neutral-505"
                              }`}></span>
                              <span className="text-xs uppercase font-extrabold tracking-wide text-neutral-600 dark:text-neutral-400">
                                {u.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-neutral-500">
                            {u.departments && u.departments.length > 0 ? (
                              <span className="text-xs font-semibold">{u.departments.join(", ")}</span>
                            ) : (
                              <span className="text-[10px] text-neutral-400 italic">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 font-mono text-neutral-500 whitespace-nowrap">
                            {u.lastActivity ? (
                              new Date(u.lastActivity).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            ) : (
                              <span className="text-neutral-400">Never</span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-3.5 whitespace-nowrap">
                            <Link
                              href={`/admin/dashboard/users/${u.id}`}
                              className="text-brand-red hover:underline font-bold cursor-pointer"
                            >
                              Edit/Details
                            </Link>
                            <button
                              onClick={() => handleArchiveToggle(u.id, u.isArchived)}
                              className="text-neutral-505 hover:text-red-650 font-bold transition-colors cursor-pointer"
                            >
                              {u.isArchived ? "Restore" : "Archive"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {usersTotal > 10 && (
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
                    <span className="text-neutral-500 text-xs">
                      Showing {(usersPage - 1) * 10 + 1} - {Math.min(usersPage * 10, usersTotal)} of {usersTotal} Users
                    </span>
                    <div className="flex space-x-2">
                      <button
                        disabled={usersPage <= 1}
                        onClick={() => setUsersPage(usersPage - 1)}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-neutral-600 dark:text-neutral-300 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm disabled:opacity-50 cursor-pointer"
                      >
                        Prev
                      </button>
                      <button
                        disabled={usersPage * 10 >= usersTotal}
                        onClick={() => setUsersPage(usersPage + 1)}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-neutral-600 dark:text-neutral-300 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm disabled:opacity-50 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add User Modal Overlay */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-neutral-955/40 z-50 flex items-center justify-center p-4">
                <form onSubmit={handleAddUserSubmit} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 w-full max-w-md rounded shadow-lg overflow-hidden animate-fadeInFast flex flex-col max-h-[550px]">
                  <div className="p-4 border-b border-neutral-105 dark:border-neutral-850 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                    <span className="font-serif font-bold text-xs uppercase text-brand-red tracking-wider">Invite / Create User</span>
                    <button type="button" onClick={() => setShowAddUserModal(false)} className="text-neutral-405 hover:text-neutral-800">
                      <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Full Name</label>
                      <input
                        type="text"
                        required
                        value={addUserFullName}
                        onChange={e => setAddUserFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Username</label>
                      <input
                        type="text"
                        required
                        value={addUserUsername}
                        onChange={e => setAddUserUsername(e.target.value)}
                        placeholder="e.g. johndoe"
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Email Address</label>
                      <input
                        type="email"
                        required
                        value={addUserEmail}
                        onChange={e => setAddUserEmail(e.target.value)}
                        placeholder="e.g. johndoe@forexweekly.com"
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Role</label>
                        <select
                          value={addUserRole}
                          onChange={e => setAddUserRole(e.target.value)}
                          className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                        >
                          <option value="EMPLOYEE">Employee</option>
                          <option value="SUPERVISOR">Supervisor</option>
                          <option value="ADMIN">Admin</option>
                          {currentUser?.role === "OWNER" && <option value="OWNER">Owner</option>}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Department</label>
                        <select
                          value={addUserDept}
                          onChange={e => setAddUserDept(e.target.value)}
                          className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                        >
                          <option value="Publication">Publication</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Research">Research</option>
                          <option value="Support">Support</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Workspace</label>
                      <select
                        value={addUserWorkspace}
                        onChange={e => setAddUserWorkspace(e.target.value)}
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                      >
                        <option value="Publication">Publication</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Research">Research</option>
                      </select>
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-850 pt-3 space-y-3">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 block">Password Type</label>
                      <div className="flex flex-col space-y-2 text-xs font-semibold">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            checked={addUserPasswordMode === "invite"}
                            onChange={() => setAddUserPasswordMode("invite")}
                            className="text-brand-red focus:ring-brand-red h-4 w-4"
                          />
                          <span>Send Invitation (Auto Temp Password)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            checked={addUserPasswordMode === "temp"}
                            onChange={() => setAddUserPasswordMode("temp")}
                            className="text-brand-red focus:ring-brand-red h-4 w-4"
                          />
                          <span>Create Temporary Password</span>
                        </label>
                      </div>

                      {addUserPasswordMode === "temp" && (
                        <div className="space-y-1.5 pt-1 animate-fadeInFast">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Temporary Password</label>
                          <input
                            type="text"
                            required={addUserPasswordMode === "temp"}
                            value={addUserTempPassword}
                            onChange={e => setAddUserTempPassword(e.target.value)}
                            placeholder="Type temp password..."
                            className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none font-semibold"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
                    <button
                      type="submit"
                      disabled={addUserFullName.trim() === "" || addUserUsername.trim() === "" || addUserEmail.trim() === ""}
                      className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {addUserPasswordMode === "invite" ? "Send Invite" : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );

      case "audit-logs":
        return (
          <div className="space-y-6">
            {/* Filters panel */}
            <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 space-y-4 transition-colors">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">Search &amp; Filter Audit Logs</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">User</label>
                  <input
                    type="text"
                    placeholder="Search username..."
                    value={auditUserQuery}
                    onChange={(e) => setAuditUserQuery(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded-sm px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-205 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">Module</label>
                  <select
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded-sm px-2 py-1.5 text-xs text-brand-dark dark:text-neutral-205 focus:outline-none cursor-pointer font-semibold"
                  >
                    <option value="">All Modules</option>
                    <option value="AUTH">AUTH (Sessions)</option>
                    <option value="ARTICLE">ARTICLE (Publications)</option>
                    <option value="USER">USER (Profiles)</option>
                    <option value="SPONSOR">SPONSOR (Ads)</option>
                    <option value="BREAKING_NEWS">BREAKING_NEWS</option>
                    <option value="SYSTEM">SYSTEM (Settings)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">Action</label>
                  <input
                    type="text"
                    placeholder="e.g. Logged In, Created..."
                    value={auditActionFilter}
                    onChange={(e) => setAuditActionFilter(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded-sm px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-205 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">Start Date</label>
                  <input
                    type="date"
                    value={auditDateStart}
                    onChange={(e) => setAuditDateStart(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded-sm px-2 py-1 text-xs text-brand-dark dark:text-neutral-205 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400">End Date</label>
                  <input
                    type="date"
                    value={auditDateEnd}
                    onChange={(e) => setAuditDateEnd(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded-sm px-2 py-1 text-xs text-brand-dark dark:text-neutral-205 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {(auditUserQuery || auditModuleFilter || auditActionFilter || auditDateStart || auditDateEnd) && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setAuditUserQuery("");
                      setAuditModuleFilter("");
                      setAuditActionFilter("");
                      setAuditDateStart("");
                      setAuditDateEnd("");
                    }}
                    className="px-3.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-300 text-[10.5px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Audit Logs Table */}
            {auditLogs.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
                No audit activity history logs found.
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-855 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                        <th className="py-3 px-5">Timestamp</th>
                        <th className="py-3 px-5">User</th>
                        <th className="py-3 px-5">Action</th>
                        <th className="py-3 px-5">Module</th>
                        <th className="py-3 px-5">Object Name / ID</th>
                        <th className="py-3 px-5">Result</th>
                        <th className="py-3 px-5">IP Address</th>
                        <th className="py-3 px-5">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors align-top">
                          <td className="py-3.5 px-5 font-mono text-neutral-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-5 font-bold text-neutral-900 dark:text-neutral-200">
                            @{log.username}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-extrabold text-[11px] uppercase tracking-wide">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 shrink-0 whitespace-nowrap">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200 dark:border-neutral-850 rounded-sm">
                              {log.module}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 max-w-[140px] truncate text-neutral-550 dark:text-neutral-400">
                            {log.objectName || log.objectId || "N/A"}
                          </td>
                          <td className="py-3.5 px-5 shrink-0 whitespace-nowrap">
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                              log.result === "SUCCESS"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}>
                              {log.result}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-neutral-500 text-[10px]">
                            {log.ipAddress || "SYSTEM"}
                          </td>
                          <td className="py-3.5 px-5 text-neutral-500 dark:text-neutral-450 leading-relaxed text-[11px] font-semibold max-w-xs">
                            {log.details || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case "inbox-dm": {
        const filteredDmMessages = dmMessages.filter(m =>
          dmChatSearchQuery.trim() === "" ||
          m.content.toLowerCase().includes(dmChatSearchQuery.toLowerCase())
        );

        return (
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden flex flex-col md:flex-row h-[600px] transition-colors">
            {/* Conversations List Panel (Left) */}
            <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full bg-neutral-50/30 dark:bg-neutral-900/10">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Conversations</span>
                <button
                  onClick={() => setShowNewDmModal(true)}
                  className="px-2.5 py-1 bg-brand-red hover:bg-brand-red-dark text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  New DM
                </button>
              </div>

              {/* Local DM search query */}
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-850">
                <input
                  type="text"
                  placeholder="Search DMs..."
                  value={dmSearchQuery}
                  onChange={e => setDmSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-sm px-2.5 py-1 text-xs focus:outline-none"
                />
              </div>

              {/* DM conversations list */}
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850">
                {dmConversations.filter(c => c.type === "DIRECT" && c.displayName.toLowerCase().includes(dmSearchQuery.toLowerCase())).length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    <p className="font-bold uppercase tracking-widest mb-3">No conversations yet.</p>
                    <button
                      onClick={() => setShowNewDmModal(true)}
                      className="px-3 py-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      New DM
                    </button>
                  </div>
                ) : (
                  dmConversations
                    .filter(c => c.type === "DIRECT" && c.displayName.toLowerCase().includes(dmSearchQuery.toLowerCase()))
                    .map(c => {
                    const isSelected = selectedDmConv?.id === c.id;
                    const isArchived = JSON.parse(c.archivedByUsernames || "[]").includes(currentUser?.username);
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedDmConv(c)}
                        className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors relative group ${
                          isSelected
                            ? "bg-neutral-100 dark:bg-neutral-850"
                            : "hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20"
                        }`}
                      >
                        <img
                          src={c.displayPhoto || "/images/default-avatar.png"}
                          alt={c.displayName}
                          className="h-9 w-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 bg-white"
                        />
                        <div className="min-w-0 flex-grow">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200 truncate pr-1">
                              {c.displayName}
                            </span>
                            <span className="text-[8px] text-neutral-400 font-mono shrink-0">
                              {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${c.unread ? "font-bold text-brand-red" : "text-neutral-450 dark:text-neutral-400 font-medium"}`}>
                            {c.lastMessage}
                          </p>
                          {isArchived && (
                            <span className="text-[7.5px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-850 mt-1 inline-block">
                              Archived
                            </span>
                          )}
                        </div>

                        {c.unread && (
                          <span className="absolute top-4 right-3.5 h-2 w-2 rounded-full bg-brand-red animate-pulse"></span>
                        )}

                        {/* Quick Hover actions drawer */}
                        <div className="absolute right-2.5 bottom-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-50 dark:bg-neutral-900 p-0.5 rounded border border-neutral-150 dark:border-neutral-800/80 shadow-sm" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleArchiveDmConversation(c.id, isArchived)}
                            className="text-[9px] font-extrabold uppercase text-neutral-505 hover:text-brand-red px-1"
                            title={isArchived ? "Unarchive" : "Archive"}
                          >
                            {isArchived ? "Unarc" : "Arc"}
                          </button>
                          <button
                            onClick={() => handleDeleteDmConversation(c.id)}
                            className="text-[9px] font-extrabold uppercase text-red-505 px-1"
                            title="Delete conversation from view"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Room Panel (Right) */}
            <div className="flex-grow flex flex-col h-full bg-white dark:bg-brand-dark-card">
              {selectedDmConv ? (
                <>
                  {/* Active Chat Header */}
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/20 dark:bg-neutral-900/5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedDmConv.displayPhoto}
                        alt={selectedDmConv.displayName}
                        className="h-9 w-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
                      />
                      <div>
                        <span className="font-bold text-xs text-brand-dark dark:text-white block">{selectedDmConv.displayName}</span>
                        <span className="text-[9px] text-neutral-455 uppercase font-extrabold tracking-wider">Direct Message Conversation</span>
                      </div>
                    </div>
                    {/* Chat Text Search */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Search conversation..."
                        value={dmChatSearchQuery}
                        onChange={e => setDmChatSearchQuery(e.target.value)}
                        className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 text-[10px] rounded px-2 py-1 w-32 focus:outline-none"
                      />
                      <button
                        onClick={() => setSelectedDmConv(null)}
                        className="text-neutral-455 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                      >
                        <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Bubble Frame */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/20 dark:bg-neutral-950/10">
                    {filteredDmMessages.length === 0 ? (
                      <div className="text-center py-16 text-neutral-400 text-[11px] font-bold uppercase tracking-wider italic">
                        {dmChatSearchQuery ? "No matches found in conversation history." : "Send a message to start conversation."}
                      </div>
                    ) : (
                      filteredDmMessages.map((m) => {
                        const isMe = m.senderUsername === currentUser?.username;
                        return (
                          <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className="max-w-[70%] flex flex-col space-y-1">
                              <div
                                className={`rounded px-3.5 py-2 text-xs font-semibold leading-relaxed whitespace-pre-wrap ${
                                  isMe
                                    ? "bg-brand-red text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                                }`}
                              >
                                {m.content}
                              </div>
                              <span className={`text-[8.5px] text-neutral-400 font-mono ${isMe ? "text-right" : "text-left"}`}>
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Plain Text Message Composer */}
                  <form onSubmit={handleSendDmMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/10 dark:bg-neutral-900/5 flex items-end space-x-3.5">
                    <textarea
                      placeholder="Type a work-related message... (Enter for line break, max 2000 chars)"
                      value={dmInput}
                      onChange={e => setDmInput(e.target.value)}
                      maxLength={2000}
                      rows={2}
                      className="flex-grow bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-855 text-xs rounded px-3 py-2 focus:outline-none focus:border-brand-red transition-colors font-semibold text-neutral-800 dark:text-neutral-200 resize-none"
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendDmMessage(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={dmInput.trim() === ""}
                      className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50 h-[38px] shrink-0"
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-neutral-50/5 dark:bg-neutral-950/5">
                  <svg className="w-10 h-10 text-neutral-300 mb-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 dark:text-neutral-500">
                    Select a conversation or search for users to start talking.
                  </span>
                </div>
              )}
            </div>

            {/* New DM Selection Modal Overlay */}
            {showNewDmModal && (
              <div className="fixed inset-0 bg-neutral-955/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 w-full max-w-md rounded shadow-lg overflow-hidden animate-fadeInFast flex flex-col max-h-[500px]">
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-850 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                    <span className="font-serif font-bold text-xs uppercase text-brand-red tracking-wider">Start New DM Conversation</span>
                    <button type="button" onClick={() => { setShowNewDmModal(false); setUserSearchQuery(""); setSearchResultsUsers([]); }} className="text-neutral-400 hover:text-neutral-800">
                      <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-850">
                    <input
                      type="text"
                      placeholder="Search active users by Name, Department, or Role..."
                      value={userSearchQuery}
                      onChange={e => setUserSearchQuery(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {searchResultsUsers.length === 0 ? (
                      <div className="text-center text-[10.5px] italic text-neutral-400 py-6">
                        {userSearchQuery ? "No matching team members found." : "Type a query above to search..."}
                      </div>
                    ) : (
                      searchResultsUsers
                        .filter(u => u.username !== currentUser?.username)
                        .map(u => (
                          <div
                            key={u.id}
                            onClick={() => handleStartDm(u.username, u.fullName, u.profilePhoto)}
                            className="p-2.5 rounded border border-neutral-100 dark:border-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-700 flex items-center space-x-3 cursor-pointer transition-colors"
                          >
                            <img src={u.profilePhoto || "/images/default-avatar.png"} alt={u.fullName} className="h-8 w-8 rounded-full object-cover border border-neutral-200 bg-white" />
                            <div>
                              <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{u.fullName}</div>
                              <div className="text-[10px] text-neutral-455 font-mono">@{u.username} &bull; {u.role} ({u.departments.join(", ")})</div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case "inbox-groups": {
        const isManager = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN" || currentUser?.role === "SUPERVISOR";
        const filteredGroupMessages = groupMessages.filter(m =>
          groupChatSearchQuery.trim() === "" ||
          m.content.toLowerCase().includes(groupChatSearchQuery.toLowerCase())
        );

        return (
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden flex flex-col md:flex-row h-[600px] transition-colors">
            {/* Groups List (Left) */}
            <div className="w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full bg-neutral-50/30 dark:bg-neutral-900/10">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Groups</span>
                {isManager && (
                  <button
                    onClick={() => {
                      setShowCreateGroupModal(true);
                      fetch("/api/inbox/users?query=")
                        .then(res => res.json())
                        .then(data => setSearchResultsUsers(data))
                        .catch(e => console.error(e));
                    }}
                    className="px-2.5 py-1 bg-brand-red hover:bg-brand-red-dark text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    + Create Group
                  </button>
                )}
              </div>

              {/* Group Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850">
                {groups.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    <p className="font-bold uppercase tracking-widest mb-3">No group chats yet.</p>
                    {isManager && (
                      <button
                        onClick={() => {
                          setShowCreateGroupModal(true);
                          fetch("/api/inbox/users?query=")
                            .then(res => res.json())
                            .then(data => setSearchResultsUsers(data))
                            .catch(e => console.error(e));
                        }}
                        className="px-2.5 py-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                      >
                        Create Group
                      </button>
                    )}
                  </div>
                ) : (
                  groups.map(g => {
                    const isSelected = selectedGroup?.id === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGroup(g)}
                        className={`p-3.5 cursor-pointer transition-colors relative group flex flex-col space-y-1 ${
                          isSelected
                            ? "bg-neutral-100 dark:bg-neutral-850"
                            : "hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200 truncate">
                            {g.name}
                          </span>
                          <span className="text-[8.5px] text-neutral-400 shrink-0 font-mono">
                            {new Date(g.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-neutral-455 dark:text-neutral-400 truncate">
                          {g.description || "No description provided."}
                        </p>

                        {isManager && g.createdBy === currentUser?.username && (
                          <div className="absolute right-3.5 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleArchiveGroup(g.id)}
                              className="text-[9px] font-extrabold uppercase text-neutral-505 hover:text-brand-red"
                            >
                              Archive Group
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Group Chat Room (Right) */}
            <div className="flex-grow flex flex-col h-full bg-white dark:bg-brand-dark-card">
              {selectedGroup ? (
                <>
                  {/* Group Chat Header */}
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/20 dark:bg-neutral-900/5">
                    <div>
                      <span className="font-bold text-xs text-brand-dark dark:text-white block">{selectedGroup.name}</span>
                      <span className="text-[9.5px] text-neutral-455 font-semibold leading-normal">
                        Members: {JSON.parse(selectedGroup.memberUsernames || "[]").join(", ")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={groupChatSearchQuery}
                        onChange={e => setGroupChatSearchQuery(e.target.value)}
                        className="bg-neutral-50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-850 text-[10px] rounded px-2 py-1 w-32 focus:outline-none"
                      />
                      <button onClick={() => setSelectedGroup(null)} className="text-neutral-455 hover:text-neutral-800 dark:hover:text-neutral-200">
                        <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages Bubble Frame */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/20 dark:bg-neutral-955/10">
                    {filteredGroupMessages.length === 0 ? (
                      <div className="text-center py-16 text-neutral-405 text-[11px] font-bold uppercase tracking-wider italic">
                        No matches found.
                      </div>
                    ) : (
                      filteredGroupMessages.map((m) => {
                        const isMe = m.senderUsername === currentUser?.username;
                        return (
                          <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className="max-w-[70%] flex flex-col space-y-1">
                              {!isMe && (
                                <span className="text-[9px] font-extrabold text-neutral-455 dark:text-neutral-400 block px-1">
                                  @{m.senderUsername}
                                </span>
                              )}
                              <div
                                className={`rounded px-3.5 py-2 text-xs font-semibold leading-relaxed whitespace-pre-wrap ${
                                  isMe
                                    ? "bg-brand-red text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                                }`}
                              >
                                {m.content}
                              </div>
                              <span className={`text-[8.5px] text-neutral-400 font-mono ${isMe ? "text-right" : "text-left"}`}>
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Composer */}
                  <form onSubmit={handleSendGroupMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/10 dark:bg-neutral-900/5 flex items-end space-x-3.5">
                    <textarea
                      placeholder="Type message to group... (Enter for break, max 2000 chars)"
                      value={groupInput}
                      onChange={e => setGroupInput(e.target.value)}
                      maxLength={2000}
                      rows={2}
                      className="flex-grow bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 text-xs rounded px-3 py-2 focus:outline-none focus:border-brand-red transition-colors font-semibold text-neutral-800 dark:text-neutral-200 resize-none"
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendGroupMessage(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={groupInput.trim() === ""}
                      className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-50 h-[38px] shrink-0"
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-neutral-50/5 dark:bg-neutral-955/5">
                  <svg className="w-10 h-10 text-neutral-300 mb-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-400 dark:text-neutral-500">
                    Select a Group Room to view conversation.
                  </span>
                </div>
              )}
            </div>

            {/* Create Group Modal Overlay */}
            {showCreateGroupModal && (
              <div className="fixed inset-0 bg-neutral-955/40 z-50 flex items-center justify-center p-4">
                <form onSubmit={handleCreateGroup} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 w-full max-w-md rounded shadow-lg overflow-hidden animate-fadeInFast flex flex-col max-h-[550px]">
                  <div className="p-4 border-b border-neutral-105 dark:border-neutral-850 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                    <span className="font-serif font-bold text-xs uppercase text-brand-red tracking-wider">Create Group Workspace</span>
                    <button type="button" onClick={() => setShowCreateGroupModal(false)} className="text-neutral-400 hover:text-neutral-800">
                      <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Group Name</label>
                      <input
                        type="text"
                        required
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="e.g. Editorial Supervisors..."
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-455 dark:text-neutral-500">Group Description</label>
                      <input
                        type="text"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                        placeholder="Group description..."
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 block mb-1">Select Group Members</label>
                      <div className="border border-neutral-200 dark:border-neutral-850 rounded p-2.5 h-44 overflow-y-auto space-y-2">
                        {searchResultsUsers
                          .filter(u => u.username !== currentUser?.username)
                          .map((u) => {
                            const isChecked = newGroupSelectedMembers.includes(u.username);
                            return (
                              <label key={u.id} className="flex items-center space-x-3 cursor-pointer select-none py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 px-1.5 rounded">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setNewGroupSelectedMembers(newGroupSelectedMembers.filter(x => x !== u.username));
                                    } else {
                                      setNewGroupSelectedMembers([...newGroupSelectedMembers, u.username]);
                                    }
                                  }}
                                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red h-4 w-4"
                                />
                                <div className="text-xs font-semibold text-neutral-705 dark:text-neutral-300">
                                  {u.fullName} <span className="font-normal text-[10px] text-neutral-450">(@{u.username})</span>
                                </div>
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
                    <button
                      type="submit"
                      disabled={newGroupName.trim() === "" || newGroupSelectedMembers.length === 0}
                      className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Create Group Chat
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      }

      case "inbox-announcements": {
        const isAuthorizedToPublish = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN" || currentUser?.role === "SUPERVISOR";
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <h2 className="font-serif font-bold text-lg text-brand-dark dark:text-white">Announcements Board</h2>
                <p className="text-xs text-neutral-450 mt-1">Read-only general broadcast announcements from supervisors and administration.</p>
              </div>
              {isAuthorizedToPublish && (
                <button
                  onClick={() => setShowNewAnnouncementModal(true)}
                  className="px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
                >
                  Publish Announcement
                </button>
              )}
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
                No active announcements found.
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className={`bg-white dark:bg-brand-dark-card border p-5 rounded-sm transition-all duration-200 ${
                      a.isPinned
                        ? "border-brand-red shadow-sm bg-brand-red/[0.01]"
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-serif font-bold text-sm text-brand-dark dark:text-white leading-tight">
                            {a.title}
                          </h3>
                          {a.isPinned && (
                            <span className="text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-red/10 text-brand-red border border-brand-red/15">
                              Pinned
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-neutral-400 block font-semibold">
                          Published by @{a.createdBy} &bull; {new Date(a.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      {a.expiryDate && (
                        <span className="text-[9.5px] font-mono text-neutral-405 bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded px-2 py-0.5 shrink-0">
                          Expires: {new Date(a.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-650 dark:text-neutral-350 leading-relaxed font-semibold mt-3.5 whitespace-pre-wrap">
                      {a.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Publish Announcement Modal */}
            {showNewAnnouncementModal && (
              <div className="fixed inset-0 bg-neutral-955/40 z-50 flex items-center justify-center p-4">
                <form onSubmit={handlePublishAnnouncement} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 w-full max-w-md rounded shadow-lg overflow-hidden animate-fadeInFast flex flex-col">
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-850 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
                    <span className="font-serif font-bold text-xs uppercase text-brand-red tracking-wider">Publish Announcement</span>
                    <button type="button" onClick={() => setShowNewAnnouncementModal(false)} className="text-neutral-400 hover:text-neutral-800">
                      <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Announcement Title</label>
                      <input
                        type="text"
                        required
                        value={newAnnouncementTitle}
                        onChange={e => setNewAnnouncementTitle(e.target.value)}
                        placeholder="e.g. Server Maintenance Notice..."
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-brand-red/10 text-xs rounded px-3 py-2 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-455 dark:text-neutral-500">Message Content</label>
                      <textarea
                        required
                        rows={4}
                        value={newAnnouncementMsg}
                        onChange={e => setNewAnnouncementMsg(e.target.value)}
                        placeholder="Type general announcement details here..."
                        className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-2 focus:outline-none resize-none font-semibold text-neutral-800 dark:text-neutral-200"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">Expiry Date (Optional)</label>
                        <input
                          type="date"
                          value={newAnnouncementExpiry}
                          onChange={e => setNewAnnouncementExpiry(e.target.value)}
                          className="w-full bg-neutral-50/50 dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs rounded px-3 py-1.5 focus:outline-none cursor-pointer"
                        />
                      </div>
                      <label className="flex items-center space-x-2.5 pt-6 cursor-pointer select-none font-bold text-xs text-neutral-600 dark:text-neutral-350">
                        <input
                          type="checkbox"
                          checked={newAnnouncementPinned}
                          onChange={e => setNewAnnouncementPinned(e.target.checked)}
                          className="rounded border-neutral-300 text-brand-red focus:ring-brand-red h-4 w-4"
                        />
                        <span>Pin Announcement</span>
                      </label>
                    </div>
                  </div>
                  <div className="p-4 border-t border-neutral-100 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
                    <button
                      type="submit"
                      disabled={newAnnouncementTitle.trim() === "" || newAnnouncementMsg.trim() === ""}
                      className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Publish Announcement
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      }

      case "reports":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 transition-colors">
              <h2 className="font-serif font-bold text-lg text-brand-dark dark:text-white mb-3">
                Research &amp; Platform Metrics
              </h2>
              <p className="text-xs text-neutral-455 mb-6">
                View content statistics, publication metrics, and platform performance logs for assigned departments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 p-4 rounded text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">Total Publications</span>
                  <span className="text-2xl font-bold text-brand-dark dark:text-white mt-1.5 block">{articles.length}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 p-4 rounded text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">Sponsored Campaigns</span>
                  <span className="text-2xl font-bold text-brand-dark dark:text-white mt-1.5 block">{sponsors.length}</span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-855 p-4 rounded text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">Active Team Members</span>
                  <span className="text-2xl font-bold text-brand-dark dark:text-white mt-1.5 block">{users.length || 1}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-neutral-100 dark:border-neutral-850 pt-5 space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">Recent Platform Events Log</span>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/20 rounded border border-neutral-150 dark:border-neutral-855 p-3 font-mono text-[10px] text-neutral-500 space-y-2">
                  <div>[INFO] {new Date().toLocaleDateString()} - Seeding and relational schema migrations verified successfully.</div>
                  <div>[INFO] {new Date().toLocaleDateString()} - Expiry check scheduler verified. Active sessions: {users.filter(u => u.isOnline).length || 1} online.</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const showWorkspaceDropdown = allowedWorkspaces.length > 1;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* Dedicate App Top Header */}
      <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6 z-50 transition-colors shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
            <span className="h-6 w-6 rounded bg-brand-red flex items-center justify-center text-white font-extrabold text-sm">FW</span>
            <span className="font-serif font-bold text-sm tracking-tight text-brand-dark dark:text-white">Weekly Control</span>
          </Link>
          
          {/* Workspace selector in header */}
          {showWorkspaceDropdown && currentUser && (
            <div className="flex items-center border-l border-neutral-200 dark:border-neutral-850 pl-4 h-6">
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
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded shadow-lg z-50 max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850">
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
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded shadow-lg p-2 z-50 text-xs font-semibold animate-fadeInFast">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-855">
                    <span className="text-[9px] uppercase font-extrabold text-neutral-400 block">Role &amp; Workspace</span>
                    <span className="text-brand-dark dark:text-neutral-250 font-bold block">{currentUser.role}</span>
                    <span className="text-[10px] text-neutral-455">{activeWorkspace} Workspace</span>
                  </div>
                  <Link href="/admin/dashboard/profile" className="block px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-855 rounded text-neutral-700 dark:text-neutral-300" onClick={() => setShowProfileMenu(false)}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-855 rounded text-red-500 font-bold cursor-pointer">
                    Logout Session
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Inner Body below Header */}
      <div className="flex-grow flex min-h-0 relative">
        {/* 1. LEFT SIDEBAR */}
        <aside className={`fixed inset-y-14 left-0 z-40 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transform transition-all duration-305 md:translate-x-0 h-[calc(100vh-56px)] ${
          sidebarCollapsed ? "w-16" : "w-64"
        } ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex-1 flex flex-col justify-between min-h-0">
            {/* Navigation Links list */}
            <div className="flex-1 overflow-y-auto">
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
                    <span className={sidebarCollapsed ? "hidden" : "inline"}>{link.label}</span>
                  </button>
                ))}

                {/* Inbox Section */}
                <div className="pt-4 pb-1">
                  <span className={`px-3 text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-505 block ${sidebarCollapsed ? "hidden" : "block"}`}>
                    Inbox
                  </span>
                  {sidebarCollapsed && (
                    <div className="border-t border-neutral-100 dark:border-neutral-850 mx-3 my-2"></div>
                  )}
                </div>

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
                  <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className={sidebarCollapsed ? "hidden" : "inline"}>Direct Messages</span>
                </button>

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
                  <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className={sidebarCollapsed ? "hidden" : "inline"}>Groups</span>
                </button>

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
                  <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span className={sidebarCollapsed ? "hidden" : "inline"}>Announcements</span>
                </button>

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
                    <svg className="w-4 h-4 mr-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span className={sidebarCollapsed ? "hidden" : "inline"}>Public Inquiries</span>
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

        {/* Overlays for mobile sidebar */}
        {showMobileSidebar && (
          <div onClick={() => setShowMobileSidebar(false)} className="fixed inset-0 bg-neutral-955/40 z-30 md:hidden transition-opacity"></div>
        )}

        {/* 2. RIGHT CONTENT PANEL */}
        <main className={`flex-grow flex flex-col min-w-0 transition-all duration-305 ${
          sidebarCollapsed ? "md:pl-16" : "md:pl-64"
        }`}>
          {/* Dashboard Content Container */}
          <div className="p-6 md:p-8 space-y-6 w-full max-w-full">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold">
                {error}
              </div>
            )}

            {tickerMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-450 p-4 rounded text-xs font-bold">
                {tickerMessage}
              </div>
            )}

            {/* Render Tab Content Panel */}
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
