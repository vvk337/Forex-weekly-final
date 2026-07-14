"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect to dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto my-12 bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-8 shadow-sm transition-colors duration-300">
      {/* Brand */}
      <div className="text-center border-b border-neutral-100 dark:border-neutral-800 pb-5 mb-6 select-none">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-red">Security Portal</span>
        <h1 className="font-serif font-bold text-2xl text-brand-dark dark:text-white mt-1">
          Admin Portal
        </h1>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5">
          Authorized editorial access only.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3.5 rounded text-xs font-bold mb-5 leading-normal">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-3 rounded-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? "Authenticating..." : "Sign In to Console"}
        </button>
      </form>

    </div>
  );
}
