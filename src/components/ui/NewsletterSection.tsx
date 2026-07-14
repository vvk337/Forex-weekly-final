"use client";

import React, { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-brand-dark text-white rounded border border-neutral-800 p-8 md:p-12 relative overflow-hidden transition-colors duration-300">
      {/* Decorative vector background */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-2xl relative z-10">
        <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest block mb-2">
          Weekly Insights In Your Inbox
        </span>
        <h2 className="font-serif font-bold text-2xl md:text-3xl leading-tight mb-4">
          Join 24,000+ Macro Traders and Portfolio Managers
        </h2>
        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed mb-6">
          Subscribe to our premium weekend briefings. Get institutional macroeconomic overviews, currency flow reports, and critical support/resistance maps directly to your inbox.
        </p>

        {subscribed ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded text-xs font-bold flex items-center">
            <svg className="w-4 h-4 mr-2 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Thank you for subscribing! You will receive our next weekly intelligence report.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your professional email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-900 border border-neutral-800 text-white rounded px-4 py-3 text-xs w-full focus:outline-none focus:border-brand-red font-sans transition-colors"
            />
            <button
              type="submit"
              className="bg-brand-red hover:bg-brand-red-dark border border-brand-red hover:border-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shrink-0 transition-colors duration-200 cursor-pointer"
            >
              Subscribe Now
            </button>
          </form>
        )}

        <span className="text-[9px] text-neutral-500 block mt-3.5">
          No advertising. No spam. Unsubscribe in one click at any time.
        </span>
      </div>
    </section>
  );
}
