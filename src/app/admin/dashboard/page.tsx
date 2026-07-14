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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [sponsors, setSponsors] = useState<DbSponsor[]>([]);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  
  // Ticker states
  const [tickerMode, setTickerMode] = useState<"auto" | "manual">("auto");
  const [tickerText, setTickerText] = useState("");
  const [savingTicker, setSavingTicker] = useState(false);
  const [tickerMessage, setTickerMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"articles" | "sponsors" | "inbox" | "ticker">("articles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setTickerText(data.manualText || "");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load database content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Delete failed");
      }

      setArticles(articles.filter((art) => art.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete request failed");
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inbox message?")) return;

    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Delete failed");
      }

      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete request failed");
    }
  };

  const handleSaveTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTicker(true);
    setTickerMessage("");
    setError("");

    try {
      const res = await fetch("/api/breaking-news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: tickerMode, manualText: tickerText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setTickerMessage("News ticker configuration saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update news ticker configuration");
    } finally {
      setSavingTicker(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout request failed", err);
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
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
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

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/admin/dashboard/create"
            className="inline-flex items-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm transition-all"
          >
            + New Publication
          </Link>
          <button
            onClick={handleLogout}
            className="border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab("articles")}
          className={`py-3 px-6 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "articles"
              ? "border-brand-red text-brand-red font-extrabold"
              : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          }`}
        >
          Publications
        </button>
        <button
          onClick={() => setActiveTab("sponsors")}
          className={`py-3 px-6 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "sponsors"
              ? "border-brand-red text-brand-red font-extrabold"
              : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          }`}
        >
          Sponsored Placements
        </button>
        <button
          onClick={() => setActiveTab("ticker")}
          className={`py-3 px-6 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "ticker"
              ? "border-brand-red text-brand-red font-extrabold"
              : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          }`}
        >
          Breaking News
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`py-3 px-6 text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "inbox"
              ? "border-brand-red text-brand-red font-extrabold"
              : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          }`}
        >
          Inbox Messages
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold">
          {error}
        </div>
      )}

      {tickerMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded text-xs font-bold">
          {tickerMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-xs text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
          Retrieving database records...
        </div>
      ) : activeTab === "articles" ? (
        /* PUBLICATIONS TAB */
        articles.length === 0 ? (
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
                        <button
                          onClick={() => handleDelete(art.id)}
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
        )
      ) : activeTab === "sponsors" ? (
        /* SPONSORS TAB */
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
                    <td className="py-4 px-5 shrink-0 whitespace-nowrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                        {spo.id}
                      </span>
                    </td>
                    <td className="py-4 px-5 max-w-[280px] sm:max-w-md truncate text-neutral-900 dark:text-neutral-200 font-serif font-bold text-sm">
                      {spo.title}
                    </td>
                    <td className="py-4 px-5 text-neutral-500 font-mono text-[10px] truncate max-w-[150px]">
                      {spo.linkUrl}
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap">
                      {spo.imageUrl ? (
                        <div className="flex items-center space-x-2">
                          <img
                            src={spo.imageUrl}
                            alt="Logo"
                            className="h-6 w-12 object-contain bg-white border border-neutral-200 p-0.5 rounded"
                          />
                           <span className="text-[10px] text-emerald-500 font-semibold">Active</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400">Text Only</span>
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
      ) : activeTab === "ticker" ? (
        /* NEWS TICKER CONFIGURATION TAB */
        <form onSubmit={handleSaveTicker} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 shadow-sm max-w-xl space-y-6">
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

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Custom Override Headlines
            </label>
            <textarea
              rows={4}
              placeholder="e.g., URGENT: Fed raises benchmark rates by 25bps | NASDAQ trading volume spikes to monthly record"
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              disabled={tickerMode === "auto"}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors disabled:opacity-40 resize-none leading-relaxed"
            />
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block mt-1.5 leading-normal">
              💡 <strong>Pro Tip:</strong> Separate multiple news alerts with a vertical bar <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-[11px] font-mono text-brand-red">|</code> to make them scroll continuously.
            </span>
          </div>

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
      ) : (
        /* INBOX TAB */
        messages.length === 0 ? (
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
                      <td className="py-4 px-5 max-w-[150px] truncate text-neutral-800 dark:text-neutral-300 font-semibold">
                        {msg.subject}
                      </td>
                      <td className="py-4 px-5 max-w-sm text-neutral-500 dark:text-neutral-400 leading-normal text-xs whitespace-pre-wrap">
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
        )
      )}
    </div>
  );
}
