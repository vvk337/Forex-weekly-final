"use client";

import React from "react";
import ForexRatesWidget from "@/components/widgets/ForexRatesWidget";
import TradingViewMarketDataWidget from "@/components/widgets/TradingViewMarketDataWidget";
import TradingViewCryptoScreenerWidget from "@/components/widgets/TradingViewCryptoScreenerWidget";

export default function ForexPage() {
  return (
    <div className="w-full animate-fadeIn space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Market Quotations</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Forex Rates & Quotes
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          Real-time rates for major, minor, and exotic currency pairs, commodities, treasury bond yields, and cryptocurrency metrics.
        </p>
      </div>

      {/* 1. Live Ticker Tape (Full Width) */}
      <ForexRatesWidget />
      
      {/* 2. Global Market Dashboard (Wide Grid Tabbed) */}
      <div className="max-w-7xl mx-auto">
        <TradingViewMarketDataWidget />
      </div>

      {/* 3. Cryptocurrency Screener (Wide Table) */}
      <div className="max-w-7xl mx-auto">
        <TradingViewCryptoScreenerWidget />
      </div>
    </div>
  );
}
