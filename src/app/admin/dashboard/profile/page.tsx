"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MeUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profilePhoto: string;
  departments: string[];
  workspaces: string[];
  phone: string;
  dob: string;
  activeSince: string;
}

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  
  // Password change states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Notification Preferences states
  const [articlesEnabled, setArticlesEnabled] = useState(true);
  const [breakingNewsEnabled, setBreakingNewsEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile details");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFullName(data.fullName);
        setPhone(data.phone || "");
        setDob(data.dob || "");
        setProfilePhoto(data.profilePhoto || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });

    fetch("/api/notifications/settings")
      .then((res) => res.json())
      .then((data) => {
        setArticlesEnabled(data.articlesEnabled ?? true);
        setBreakingNewsEnabled(data.breakingNewsEnabled ?? true);
        setAnnouncementsEnabled(data.announcementsEnabled ?? true);
        setSystemEnabled(data.systemEnabled ?? true);
      })
      .catch((e) => console.error("Failed to load settings", e));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setUpdating(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          dob,
          profilePhoto,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile settings");
      }

      setSuccessMsg("Your profile details updated successfully!");
      
      // Reload details
      const meRes = await fetch("/api/users/me");
      const meData = await meRes.json();
      setUser(meData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setUpdating(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccessMsg("Password updated successfully!");
      setPassword("");
      confirmPassword;
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/notifications/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articlesEnabled,
          breakingNewsEnabled,
          announcementsEnabled,
          systemEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update preferences");
      setSuccessMsg("Notification preferences saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-xs text-neutral-400 font-bold uppercase tracking-widest animate-pulse">
        Retrieving profile settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <Link href="/admin/dashboard" className="text-xs font-bold text-brand-red uppercase tracking-wider hover:underline">
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-dark dark:text-white mt-3">
          My Account Profile
        </h1>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          Manage your personal details, credentials, and configuration settings.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded text-xs font-bold">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Metadata */}
        <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 flex flex-col items-center text-center space-y-5 transition-colors">
          <img
            src={user?.profilePhoto || "/images/default-avatar.png"}
            alt={user?.fullName}
            className="h-28 w-28 rounded-full object-cover border border-neutral-200 dark:border-neutral-800 bg-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-avatar.png";
            }}
          />
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-lg text-brand-dark dark:text-white leading-tight">
              {user?.fullName}
            </h2>
            <span className="text-xs text-neutral-450 font-mono block">@{user?.username}</span>
            <span className="inline-block bg-neutral-100 text-neutral-600 dark:bg-neutral-900/50 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-850 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-sm mt-1.5">
              {user?.role}
            </span>
          </div>

          <div className="w-full text-left space-y-3.5 pt-5 border-t border-neutral-100 dark:border-neutral-850 text-xs font-medium">
            <div>
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Email</span>
              <span className="text-brand-dark dark:text-neutral-200">{user?.email}</span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Departments</span>
              <span className="text-brand-dark dark:text-neutral-200">
                {user?.departments && user.departments.length > 0 ? user.departments.join(", ") : "None"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Member Since</span>
              <span className="text-brand-dark dark:text-neutral-200">
                {user ? new Date(user.activeSince).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile details form */}
          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-6 transition-colors duration-300">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-red border-b border-neutral-100 dark:border-neutral-850 pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="/images/default-avatar.png"
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 123 4567"
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="submit"
                disabled={updating}
                className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {updating ? "Saving Details..." : "Update Details"}
              </button>
            </div>
          </form>

          {/* Change password form */}
          <form onSubmit={handlePasswordChange} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-6 transition-colors duration-300">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-red border-b border-neutral-100 dark:border-neutral-850 pb-2">
              Update Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Retype password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="submit"
                disabled={updating}
                className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {updating ? "Saving Password..." : "Update Password"}
              </button>
            </div>
          </form>

          {/* Notification preferences form */}
          <form onSubmit={handleUpdatePreferences} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-6 transition-colors duration-300">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-red border-b border-neutral-100 dark:border-neutral-850 pb-2">
              Notification Preferences
            </h3>

            <div className="space-y-4 font-semibold text-xs text-neutral-700 dark:text-neutral-300">
              <label className="flex items-center space-x-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={articlesEnabled}
                  onChange={(e) => setArticlesEnabled(e.target.checked)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red h-4 w-4"
                />
                <span>Enable Article Notifications (Submissions, Approvals, Revisions)</span>
              </label>

              <label className="flex items-center space-x-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={breakingNewsEnabled}
                  onChange={(e) => setBreakingNewsEnabled(e.target.checked)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red h-4 w-4"
                />
                <span>Enable Breaking News Ticker Alerts</span>
              </label>

              <label className="flex items-center space-x-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementsEnabled}
                  onChange={(e) => setAnnouncementsEnabled(e.target.checked)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red h-4 w-4"
                />
                <span>Enable System Wide Announcements</span>
              </label>

              <label className="flex items-center space-x-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemEnabled}
                  onChange={(e) => setSystemEnabled(e.target.checked)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red h-4 w-4"
                />
                <span>Enable Workspace &amp; System Events (Password, Assignments, Invites)</span>
              </label>
            </div>

            <div className="flex justify-end pt-5 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="submit"
                disabled={savingSettings}
                className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? "Saving Settings..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
