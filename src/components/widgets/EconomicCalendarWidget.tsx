"use client";

import React from "react";
import { mockEconomicEvents } from "@/data/mockData";

export default function EconomicCalendarWidget() {
  const getImportanceBadge = (importance: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return <span className="bg-brand-red text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest">High</span>;
      case "medium":
        return <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-extrabold px-1.5 py-0.5 border border-amber-500/10 rounded-sm uppercase tracking-widest">Med</span>;
      case "low":
        return <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest">Low</span>;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors duration-300">
      <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-brand-red"></span>
          <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-brand-dark dark:text-neutral-100">
            Economic Calendar
          </h3>
        </div>
        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          GMT / UTC
        </span>
      </div>

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800 text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">
              <th className="py-2.5 pb-2">Time</th>
              <th className="py-2.5 pb-2">Cur</th>
              <th className="py-2.5 pb-2">Impact</th>
              <th className="py-2.5 pb-2 min-w-[150px]">Event</th>
              <th className="py-2.5 pb-2 text-right">Actual</th>
              <th className="py-2.5 pb-2 text-right">Forecast</th>
              <th className="py-2.5 pb-2 text-right">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
            {mockEconomicEvents.map((event) => {
              const isHighImpact = event.importance === "high";
              return (
                <tr
                  key={event.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors duration-150"
                >
                  <td className="py-3 font-mono text-neutral-500 dark:text-neutral-400">{event.time}</td>
                  <td className="py-3 font-bold text-brand-dark dark:text-neutral-300">{event.currency}</td>
                  <td className="py-3">{getImportanceBadge(event.importance)}</td>
                  <td className={`py-3 text-neutral-800 dark:text-neutral-200 ${isHighImpact ? "font-bold" : ""}`}>
                    {event.event}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {event.actual || "--"}
                  </td>
                  <td className="py-3 text-right font-mono text-neutral-500">{event.forecast}</td>
                  <td className="py-3 text-right font-mono text-neutral-500">{event.previous}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
