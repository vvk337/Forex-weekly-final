"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeptChange = (dept: string) => {
    if (departments.includes(dept)) {
      setDepartments(departments.filter((d) => d !== dept));
    } else {
      setDepartments([...departments, dept]);
    }
  };

  const handleWorkspaceChange = (ws: string) => {
    if (workspaces.includes(ws)) {
      setWorkspaces(workspaces.filter((w) => w !== ws));
    } else {
      setWorkspaces([...workspaces, ws]);
    }
  };

  const generateTempPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let temp = "";
    for (let i = 0; i < 10; i++) {
      temp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(temp);
    setForcePasswordChange(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username: username.trim(),
          email: email.trim(),
          password,
          role,
          departments,
          workspaces,
          phone,
          dob,
          forcePasswordChange,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <Link href="/admin/dashboard" className="text-xs font-bold text-brand-red uppercase tracking-wider hover:underline">
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brand-dark dark:text-white mt-3">
          Invite Backend User
        </h1>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          Add an editor, supervisor, or administrator profile to the Forex Weekly CMS platform.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded text-xs font-bold">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 space-y-6 transition-colors duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
              className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. john@forexweekly.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 flex justify-between items-center">
              <span>Password</span>
              <button
                type="button"
                onClick={generateTempPassword}
                className="text-[9px] text-brand-red hover:underline uppercase tracking-wide normal-case"
              >
                Generate Temp Password
              </button>
            </label>
            <input
              type="text"
              required
              placeholder="Type password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3.5 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 rounded-sm px-3 py-2 text-xs text-brand-dark dark:text-neutral-200 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
            >
              <option value="EMPLOYEE">Employee (Editor/Writer)</option>
              <option value="SUPERVISOR">Supervisor (Content Reviewer)</option>
              <option value="ADMIN">Admin (Workspace Manager)</option>
              <option value="OWNER">Owner (System Director)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. +1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="forcePasswordChange"
              checked={forcePasswordChange}
              onChange={(e) => setForcePasswordChange(e.target.checked)}
              className="accent-brand-red h-4 w-4 cursor-pointer"
            />
            <label htmlFor="forcePasswordChange" className="text-xs font-bold text-neutral-600 dark:text-neutral-350 cursor-pointer select-none">
              Force Password Change on Next Login
            </label>
          </div>
        </div>

        {/* Multi Select Departments */}
        <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 block">
            Assigned Departments
          </label>
          <div className="flex flex-wrap gap-4">
            {["Editorial", "Marketing", "Research", "Support"].map((dept) => (
              <label key={dept} className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-350 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={departments.includes(dept)}
                  onChange={() => handleDeptChange(dept)}
                  className="accent-brand-red cursor-pointer"
                />
                <span>{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Multi Select Workspaces */}
        <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-500 block">
            Assigned Workspaces
          </label>
          <div className="flex flex-wrap gap-4">
            {["Publication", "Marketing", "Research"].map((ws) => (
              <label key={ws} className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-350 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={workspaces.includes(ws)}
                  onChange={() => handleWorkspaceChange(ws)}
                  className="accent-brand-red cursor-pointer"
                />
                <span>{ws} Workspace</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-5 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating User..." : "Invite User"}
          </button>
        </div>
      </form>
    </div>
  );
}
