"use client";

import React, { useEffect, useState } from "react";

interface SessionStatus {
  name: string;
  label: string;
  active: boolean;
}

export default function TopBar() {
  const [currentDate, setCurrentDate] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessions, setSessions] = useState<SessionStatus[]>([
    { name: "Sydney", label: "SYD", active: false },
    { name: "Tokyo", label: "TYO", active: false },
    { name: "London", label: "LDN", active: false },
    { name: "New York", label: "NYC", active: false },
  ]);

  useEffect(() => {
    let offset = 0;

    const syncTime = async () => {
      try {
        const res = await fetch("/api/time");
        if (res.ok) {
          const data = await res.json();
          offset = new Date(data.datetime).getTime() - Date.now();
        }
      } catch (err) {
        console.error("Failed to sync clock with server time", err);
      }
    };

    const updateClock = () => {
      const serverTime = new Date(Date.now() + offset);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentDate(serverTime.toLocaleDateString("en-US", options));

      // Calculate sessions (UTC)
      const day = serverTime.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const hour = serverTime.getUTCHours();

      // Forex is closed globally on weekends: Friday 22:00 UTC to Sunday 22:00 UTC
      const isMarketClosed =
        (day === 5 && hour >= 22) || // Friday night after NY close
        day === 6 ||                 // Saturday
        (day === 0 && hour < 22);    // Sunday morning/afternoon before Sydney open

      setSessions([
        {
          name: "Sydney",
          label: "SYD",
          active: !isMarketClosed && (hour >= 22 || hour < 7),
        },
        {
          name: "Tokyo",
          label: "TYO",
          active: !isMarketClosed && (hour >= 0 && hour < 9),
        },
        {
          name: "London",
          label: "LDN",
          active: !isMarketClosed && (hour >= 8 && hour < 17),
        },
        {
          name: "New York",
          label: "NYC",
          active: !isMarketClosed && (hour >= 13 && hour < 22),
        },
      ]);
    };

    // Dark Mode initialization
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && systemTheme)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }

    // Sync and start ticking
    syncTime().then(() => {
      updateClock();
    });

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="w-full bg-brand-dark text-white text-xs border-b border-neutral-800 py-2.5 px-4 sm:px-6 md:px-8 flex justify-between items-center transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="font-medium tracking-wider text-neutral-400">{currentDate}</span>
        
        {/* Sessions list replacing Markets: Open */}
        <div className="flex items-center space-x-3 sm:border-l sm:border-neutral-700 sm:pl-4 text-[9px] uppercase font-bold tracking-widest">
          {sessions.map((s) => (
            <div key={s.name} className="flex items-center space-x-1.5" title={`${s.name}: ${s.active ? "Active" : "Closed"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.active ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"}`}></span>
              <span className={s.active ? "text-emerald-400" : "text-neutral-500"}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-5 shrink-0">
        {/* Social Icons */}
        <div className="hidden sm:flex items-center space-x-3 text-neutral-400">
          <a href="#" className="hover:text-brand-red transition-colors" aria-label="Twitter">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-brand-red transition-colors" aria-label="LinkedIn">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-brand-red transition-colors" aria-label="YouTube">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        {/* Theme Toggler */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            // Sun Icon
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Moon Icon
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
