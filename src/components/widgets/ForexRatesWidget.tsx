"use client";

import React from "react";
import { mockForexQuotes } from "@/data/mockData";

export default function ForexRatesWidget() {
  return (
    <div className="w-full bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors duration-300">
      <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-brand-red"></span>
          <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-brand-dark dark:text-neutral-100">
            Live Forex Rates
          </h3>
        </div>
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          Feed: Delayed 15m
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {mockForexQuotes.map((quote) => {
          const isUp = quote.trend === "up";
          return (
            <div
              key={quote.symbol}
              className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900 rounded p-3 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {quote.symbol}
                </span>
                <span
                  className={`text-[9px] font-bold px-1 rounded-sm ${
                    isUp
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {isUp ? "▲" : "▼"}
                </span>
              </div>

              <div className="mt-2.5">
                <div className="text-base font-bold font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
                  {quote.price}
                </div>
                <div
                  className={`text-[10px] font-bold font-mono mt-0.5 ${
                    isUp ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {quote.changePercent}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
