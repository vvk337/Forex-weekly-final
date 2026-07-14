"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface SponsorData {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  buttonText: string;
  imageUrl: string;
}

export default function EditSponsorPage() {
  const router = useRouter();
  const params = useParams();
  const sponsorId = params.id as string;

  const [formData, setFormData] = useState<SponsorData>({
    id: "",
    title: "",
    description: "",
    linkUrl: "",
    buttonText: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch all and find matching
    fetch("/api/sponsors")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to retrieve placements");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const matched = data.find((s) => s.id === sponsorId);
          if (matched) {
            setFormData(matched);
          } else {
            setError("Sponsor placement not found.");
          }
        }
      })
      .catch((err: any) => setError(err.message || "Failed to load sponsor configuration"))
      .finally(() => setLoading(false));
  }, [sponsorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/sponsors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during save request");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-xs text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
        Retrieving sponsor placement settings...
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Creator Console</span>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-brand-dark dark:text-white mt-1">
            Edit Sponsor: <span className="font-mono text-brand-red">{sponsorId}</span>
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
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Placement Location (Locked)
          </label>
          <input
            type="text"
            disabled
            value={formData.id}
            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2 text-xs text-neutral-500 focus:outline-none font-mono uppercase"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Sponsor Title / Main Headline
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Global Liquidity, spreads from 0.0 Pips"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors font-serif font-bold text-sm"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Description / Promo Details
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe the sponsored service, promotions or conditions..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Button / CTA Text
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Start Trading"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
              Target Link URL
            </label>
            <input
              type="text"
              required
              placeholder="e.g. https://broker.com/sign-up"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Sponsor Image Logo URL (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. /images/sponsor-logo.png"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors font-mono text-[11px]"
          />
          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block mt-1.5">
            Provide a local path or external link to the image/logo. Leave empty for text-only layouts.
          </span>
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
            disabled={saving}
            className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
