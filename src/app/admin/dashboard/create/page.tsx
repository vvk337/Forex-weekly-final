"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "David Vance", // default editor
    imageUrl: "",
    isFeatured: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic client validation
    if (!formData.category) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish article");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Creator Console</span>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-brand-dark dark:text-white mt-1">
            New Publication
          </h1>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-xs font-bold text-neutral-400 hover:text-brand-red uppercase tracking-wider"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold leading-normal">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
            >
              <option value="">Select Category</option>
              <option value="weekly-updates">Weekly Updates</option>
              <option value="daily-feed">Daily Feed</option>
              <option value="global-events">Global Events</option>
              <option value="forex">Forex</option>
              <option value="learn-forex">Learn Forex</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Author
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Article Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Fed Hints at September Rate Cut Amid CPI Declines"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors font-serif font-bold text-sm"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Excerpt / Summary
          </label>
          <input
            type="text"
            required
            placeholder="Provide a concise 1-2 sentence description of the key take-aways."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Cover Image URL (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. /images/eur-usd-chart.jpg"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Publication Body Content
          </label>
          <textarea
            required
            rows={10}
            placeholder="Write full publication content. Supports paragraphs and simple formatting..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors resize-y min-h-[200px]"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="accent-brand-red h-4 w-4 cursor-pointer"
          />
          <label
            htmlFor="isFeatured"
            className="text-xs font-bold text-neutral-600 dark:text-neutral-300 cursor-pointer select-none"
          >
            Mark as Featured Hero Article (Overrides previous featured)
          </label>
        </div>

        <div className="flex justify-end items-center space-x-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Link
            href="/admin/dashboard"
            className="px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-500 text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
