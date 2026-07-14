"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Our Mission</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          About Forex Weekly
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          Providing transparent, institutional-grade macroeconomic reports and currency research to retail and professional traders worldwide.
        </p>
      </div>

      {/* Editorial Content */}
      <div className="prose dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed space-y-6 text-neutral-700 dark:text-neutral-300">
        <p className="text-base font-serif font-medium text-neutral-900 dark:text-neutral-100 leading-normal">
          Founded in 2024, Forex Weekly emerged to solve a critical problem in the trading industry: the lack of clear, conflict-free, and high-quality macroeconomic analysis. While other websites focus on quick clickbait headlines, we focus on structural narratives.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-4">Conflict-Free Editorial Standard</h3>
        <p>
          Unlike traditional news outlets sponsored by marketing conglomerates, Forex Weekly does not run manipulative user acquisition funnels. We charge no retail subscription and carry no member dashboards. All research is public, transparent, and independent. Our revenue model relies strictly on clearly labeled premium broker sponsorships and institutional data terminals.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-4">Our Methodology</h3>
        <p>
          We blend **top-down macroeconomic analysis** (interest rate differentials, central bank policies, sovereign bond yields) with **bottom-up technical indicators** (market order blocks, liquidity pools, support/resistance ranges). This dual approach ensures that our traders have both the compass of global macro trends and the map of local price charts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 mt-8">
          <div>
            <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100">Macro Intelligence</h4>
            <p className="text-xs text-neutral-500 mt-1">We track central banks, inflation curves, and global capital flows to explain structural market directions.</p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100">Technical Rigor</h4>
            <p className="text-xs text-neutral-500 mt-1">No random indicators. We prioritize market structure, liquidity sweeps, and high-probability zones.</p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100">Traders First</h4>
            <p className="text-xs text-neutral-500 mt-1">All guides, calculators, and articles are designed strictly for execution, clarity, and speed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
