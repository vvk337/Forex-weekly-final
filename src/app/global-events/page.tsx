"use client";

import React from "react";
import EconomicCalendarWidget from "@/components/widgets/EconomicCalendarWidget";

export default function GlobalEventsPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Macroeconomic Triggers</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Global Events
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          Track upcoming interest rate decisions, employment data, manufacturing outputs, and geopolitical briefings that trigger major fluctuations in currency exchange rates.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <EconomicCalendarWidget />
      </div>
    </div>
  );
}
