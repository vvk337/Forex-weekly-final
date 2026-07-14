"use client";

import React, { useEffect, useState } from "react";

interface Session {
  name: string;
  startUtc: number; // Hour of day in UTC (0-23)
  endUtc: number;   // Hour of day in UTC (0-23)
}

const SESSIONS: Session[] = [
  { name: "Sydney Session", startUtc: 22, endUtc: 7 },
  { name: "Tokyo Session", startUtc: 0, endUtc: 9 },
  { name: "London Session", startUtc: 8, endUtc: 17 },
  { name: "New York Session", startUtc: 13, endUtc: 22 },
];

export default function TradingSessionsWidget() {
  const [sessionStates, setSessionStates] = useState<{ name: string; active: boolean }[]>([]);

  useEffect(() => {
    const checkSessions = () => {
      const now = new Date();
      const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const hour = now.getUTCHours();

      // Forex market is closed on weekends globally:
      // Closes Friday at 22:00 UTC (New York close) and opens Sunday at 22:00 UTC (Sydney open)
      const isMarketClosed =
        (day === 5 && hour >= 22) || // Friday after 10 PM UTC
        day === 6 ||                 // Saturday
        (day === 0 && hour < 22);    // Sunday before 10 PM UTC

      const updated = SESSIONS.map((session) => {
        let active = false;

        if (!isMarketClosed) {
          const { startUtc, endUtc } = session;
          if (startUtc < endUtc) {
            // Normal range (e.g., Tokyo: 0 to 9)
            active = hour >= startUtc && hour < endUtc;
          } else {
            // Spans midnight (e.g., Sydney: 22 to 7)
            active = hour >= startUtc || hour < endUtc;
          }
        }

        return { name: session.name, active };
      });

      setSessionStates(updated);
    };

    checkSessions();
    // Check and update states every 30 seconds
    const interval = setInterval(checkSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show a realistic placeholder during server rendering to prevent layout shift
  if (sessionStates.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors animate-pulse">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-10"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors">
      <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-brand-dark dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4 flex justify-between items-center">
        <span>Trading Session Status</span>
        <span className="text-[9px] text-neutral-400 font-mono tracking-widest">LIVE UTC</span>
      </h3>
      <div className="space-y-3">
        {sessionStates.map((ses, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs font-semibold">
            <span className="text-neutral-700 dark:text-neutral-300">{ses.name}</span>
            <div className="flex items-center space-x-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${ses.active ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`}></span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${ses.active ? "text-emerald-500" : "text-neutral-400"}`}>
                {ses.active ? "Active" : "Closed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
