"use client";

import React from "react";
import ForexRatesWidget from "@/components/widgets/ForexRatesWidget";

export default function ForexPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Market Quotations</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Forex Rates & Quotes
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          Real-time rates for major, minor, and exotic currency pairs, commodities, and treasury bond yields to map market sentiments and correlations.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <ForexRatesWidget />
        
        {/* Trading session indicator widgets as a bonus premium touch */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { city: "Sydney", hours: "22:00 - 07:00 GMT", status: "Closed", color: "bg-neutral-400" },
            { city: "Tokyo", hours: "00:00 - 09:00 GMT", status: "Closed", color: "bg-neutral-400" },
            { city: "London", hours: "08:00 - 17:00 GMT", status: "Open", color: "bg-emerald-500" },
            { city: "New York", hours: "13:00 - 22:00 GMT", status: "Open", color: "bg-emerald-500" },
          ].map((session, i) => (
            <div key={i} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-4 flex justify-between items-center transition-colors">
              <div>
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{session.city}</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">{session.hours}</p>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${session.color}`}></span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">{session.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
