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

  const [activeTab, setActiveTab] = useState<"articles" | "sponsors" | "inbox" | "ticker" | "users" | "reports">("articles");
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

  // Load current user session
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<string>("Publication");

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

  const getVisibleTabs = () => {
    if (!currentUser) return [];

    const tabs: Array<{ id: "articles" | "sponsors" | "inbox" | "ticker" | "users" | "reports"; label: string }> = [];
    const role = currentUser.role;

    if (activeWorkspace === "Publication") {
      tabs.push({ id: "articles", label: "Publications" });
      tabs.push({ id: "ticker", label: "Breaking News" });
      
      if (role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") {
        tabs.push({ id: "inbox", label: "Inbox Messages" });
      }
    } else if (activeWorkspace === "Marketing") {
      if (role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") {
        tabs.push({ id: "sponsors", label: "Sponsor Placements" });
      }
    } else if (activeWorkspace === "Research") {
      if (role === "OWNER" || role === "ADMIN" || role === "SUPERVISOR") {
        tabs.push({ id: "reports", label: "Research Overview" });
      }
    }

    // Users Directory is always visible to Owner/Admin
    if (role === "OWNER" || role === "ADMIN") {
      tabs.push({ id: "users", label: "Users" });
    }

    return tabs;
  };

  const visibleTabs = getVisibleTabs();

  const allowedWorkspaces = currentUser?.role === "OWNER" || currentUser?.role === "ADMIN" || currentUser?.role === "SUPERVISOR"
    ? ["Publication", "Marketing", "Research"]
    : currentUser?.workspaces || ["Publication"];

  useEffect(() => {
    if (visibleTabs.length > 0) {
      const tabIds = visibleTabs.map((t) => t.id);
      if (!tabIds.includes(activeTab)) {
        setActiveTab(tabIds[0]);
      }
    }
  }, [activeWorkspace, currentUser]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setTickerMessage("");
    try {
      if (activeTab === "articles") {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to load articles");
        const data = await res.json();
        setArticles(data);
      } else if (activeTab === "sponsors") {
        const res = await fetch("/api/sponsors");
        if (!res.ok) throw new Error("Failed to load sponsored sections");
        const data = await res.json();
        setSponsors(data);
      } else if (activeTab === "inbox") {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Failed to load inbox messages");
        const data = await res.json();
        setMessages(data);
      } else if (activeTab === "ticker") {
        const res = await fetch("/api/breaking-news");
        if (!res.ok) throw new Error("Failed to load ticker settings");
        const data = await res.json();
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
          console.error("JSON parse manualText error in dashboard", e);
        }

        while (parsed.length < 4) {
          parsed.push({ text: "", expiryOption: "infinity", expiresAt: null });
        }
        setTickerItems(parsed);
      } else if (activeTab === "users") {
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
        const res = await fetch(`/api/users?${queryParams}`);
        if (!res.ok) throw new Error("Failed to load users list");
        const data = await res.json();
        setUsers(data.users);
        setUsersTotal(data.total);
      } else if (activeTab === "reports") {
        // Static reports tab
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
  ]);

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

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 text-xs text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Retrieving database records...
        </div>
      );
    }

    switch (activeTab) {
      case "articles":
        return articles.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
            Database contains no publications. Click "+ New Publication" to create one.
          </div>
        ) : (
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-850 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="py-3 px-5">Category</th>
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-5">Author</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                  {articles.map((art) => (
                    <tr
                      key={art.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors"
                    >
                      <td className="py-4 px-5 shrink-0 whitespace-nowrap">
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${getCategoryColor(art.category)}`}>
                          {art.category.replace("-", " ")}
                        </span>
                        {art.isFeatured && (
                          <span className="ml-1.5 bg-yellow-500/10 text-yellow-600 border border-yellow-500/25 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                            ★ Featured
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 max-w-[280px] sm:max-w-md truncate text-neutral-900 dark:text-neutral-200 font-serif font-bold text-sm">
                        {art.title}
                      </td>
                      <td className="py-4 px-5 text-neutral-500">{art.author}</td>
                      <td className="py-4 px-5 font-mono text-neutral-500 whitespace-nowrap">
                        {new Date(art.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-5 text-right space-x-3.5 whitespace-nowrap">
                        {currentUser?.role !== "EMPLOYEE" && (
                          <button
                            onClick={() => handleDelete(art.id)}
                            className="text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                          >
                            {currentUser?.role === "SUPERVISOR" ? "Move to Trash" : "Delete"}
                          </button>
                        )}
                        {currentUser?.role === "EMPLOYEE" && (
                          <span className="text-[10px] text-neutral-450 italic font-bold">No Actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "sponsors":
        return (
          <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-850 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="py-3 px-5">Ad Placement</th>
                    <th className="py-3 px-5">Sponsor Title</th>
                    <th className="py-3 px-5">Target Link</th>
                    <th className="py-3 px-5">Logo / Image</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                  {sponsors.map((spo) => (
                    <tr
                      key={spo.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors"
                    >
                      <td className="py-4 px-5 shrink-0 whitespace-nowrap font-mono text-[10.5px] uppercase font-bold text-neutral-400">
                        {spo.id.toUpperCase()}
                      </td>
                      <td className="py-4 px-5 text-neutral-900 dark:text-neutral-200 font-bold text-sm">
                        {spo.title}
                      </td>
                      <td className="py-4 px-5 text-neutral-500 max-w-[150px] truncate">
                        <a href={spo.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-red">
                          {spo.linkUrl}
                        </a>
                      </td>
                      <td className="py-4 px-5">
                        {spo.imageUrl ? (
                          <img
                            src={spo.imageUrl}
                            alt={spo.title}
                            className="h-7 w-20 object-contain border border-neutral-100 dark:border-neutral-800 rounded p-0.5 bg-neutral-50 dark:bg-neutral-950"
                          />
                        ) : (
                          <span className="text-[10px] text-neutral-400 italic">No media loaded</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right space-x-3.5 whitespace-nowrap">
                        <Link
                          href={`/admin/dashboard/sponsors/${spo.id}`}
                          className="text-brand-red hover:text-brand-red-dark font-bold transition-colors"
                        >
                          Edit Spot Settings
                        </Link>
                      </td>
                    </tr>
                  ))}
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
              <p className="text-xs text-neutral-400 leading-normal">
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
                    <span className="text-xs font-bold text-neutral-850 dark:text-neutral-100">
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
                    <span className="text-xs font-bold text-neutral-850 dark:text-neutral-100">
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
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
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
                      <td className="py-4 px-5 max-w-[150px] truncate text-neutral-850 dark:text-neutral-300 font-bold">
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
            {/* Users Search, Sorting, and Filters Row */}
            <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors">
              <form onSubmit={handleUsersSearchSubmit} className="flex-grow flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  className="flex-grow bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 text-brand-dark dark:text-neutral-205 rounded-sm px-3.5 py-1.5 text-xs focus:outline-none focus:border-brand-red transition-all"
                />
                <button
                  type="submit"
                  className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-sm transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3">
                {/* Filter by Role */}
                <select
                  value={usersRoleFilter}
                  onChange={(e) => {
                    setUsersPage(1);
                    setUsersRoleFilter(e.target.value);
                  }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>

                {/* Filter by Status */}
                <select
                  value={usersStatusFilter}
                  onChange={(e) => {
                    setUsersPage(1);
                    setUsersStatusFilter(e.target.value);
                  }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>

                {/* Filter by Archive Status */}
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

                {/* Sort Controls */}
                <select
                  value={`${usersSort}-${usersOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    setUsersSort(sort);
                    setUsersOrder(order as "asc" | "desc");
                  }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded px-2.5 py-1.5 text-xs text-brand-dark dark:text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="fullName-asc">Sort: Name A-Z</option>
                  <option value="fullName-desc">Sort: Name Z-A</option>
                  <option value="role-asc">Sort: Role A-Z</option>
                  <option value="activeSince-desc">Sort: Date Joined</option>
                </select>
              </div>
            </div>

            {/* Users Grid Table */}
            {users.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded text-neutral-400 text-xs uppercase font-bold tracking-widest">
                No users found matching your filter criteria.
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-850 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50">
                        <th className="py-3 px-5">Photo</th>
                        <th className="py-3 px-5">User Details</th>
                        <th className="py-3 px-5">Role</th>
                        <th className="py-3 px-5">Status</th>
                        <th className="py-3 px-5">Departments</th>
                        <th className="py-3 px-5">Last Activity</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors align-middle"
                        >
                          <td className="py-3.5 px-5 shrink-0">
                            <img
                              src={u.profilePhoto || "/images/default-avatar.png"}
                              alt={u.fullName}
                              className="h-8 w-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-850 bg-white"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/default-avatar.png";
                              }}
                            />
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-neutral-900 dark:text-neutral-200 text-sm">
                              {u.fullName}
                            </div>
                            <div className="text-[10.5px] text-neutral-450 mt-0.5 font-mono">
                              @{u.username} &bull; {u.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-5 shrink-0 whitespace-nowrap">
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                              u.role === "OWNER"
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : u.role === "ADMIN"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
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
                                  ? "bg-emerald-500"
                                  : u.status === "SUSPENDED"
                                  ? "bg-rose-500"
                                  : "bg-neutral-500"
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
                              className="text-neutral-505 hover:text-red-600 font-bold transition-colors cursor-pointer"
                            >
                              {u.isArchived ? "Restore" : "Archive"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
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
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 transition-colors">
              <h2 className="font-serif font-bold text-lg text-brand-dark dark:text-white mb-3">
                Research &amp; Platform Metrics
              </h2>
              <p className="text-xs text-neutral-450 mb-6">
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
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 p-4 rounded text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">Active Team Members</span>
                  <span className="text-2xl font-bold text-brand-dark dark:text-white mt-1.5 block">{users.length || 1}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-neutral-100 dark:border-neutral-850 pt-5 space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red block">Recent Platform Events Log</span>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/20 rounded border border-neutral-150 dark:border-neutral-850 p-3 font-mono text-[10px] text-neutral-500 space-y-2">
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

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-neutral-200 dark:border-neutral-800 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red font-sans">Control Room</span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-dark dark:text-white mt-1">
            Editorial Console
          </h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Manage your financial portal publications, articles, sponsored placements, and support inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Workspace Selector */}
          {currentUser && (
            <div className="flex items-center space-x-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-855 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-250 transition-colors">
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500">Workspace:</span>
              <select
                value={activeWorkspace}
                onChange={(e) => setActiveWorkspace(e.target.value)}
                className="bg-transparent font-extrabold text-brand-dark dark:text-neutral-200 focus:outline-none cursor-pointer"
              >
                {allowedWorkspaces.map((ws: string) => (
                  <option key={ws} value={ws} className="bg-white dark:bg-neutral-950 text-brand-dark dark:text-neutral-250 font-bold">
                    {ws} Workspace
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === "users" ? (
            <>
              <Link
                href="/admin/dashboard/profile"
                className="inline-flex items-center border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-650 dark:text-neutral-355 hover:text-neutral-800 dark:hover:text-neutral-100 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm transition-all"
              >
                My Profile
              </Link>
              <Link
                href="/admin/dashboard/users/create"
                className="inline-flex items-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm transition-all"
              >
                + Add User
              </Link>
            </>
          ) : (
            <Link
              href="/admin/dashboard/create"
              className="inline-flex items-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm transition-all"
            >
              + New Publication
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-655 dark:text-neutral-355 hover:text-neutral-800 dark:hover:text-neutral-100 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "users") setUsersPage(1);
              setActiveTab(tab.id);
            }}
            className={`py-3 px-6 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-brand-red text-brand-red font-extrabold"
                : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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

      {/* Dynamic Tab Content */}
      {renderTabContent()}
    </div>
  );
}
