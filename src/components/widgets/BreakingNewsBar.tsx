"use client";

import React, { useEffect, useState } from "react";
import { mockBreakingNews } from "@/data/mockData";

export default function BreakingNewsBar() {
  const [headlines, setHeadlines] = useState<string[]>(mockBreakingNews);

  useEffect(() => {
    fetch("/api/breaking-news")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load news ticker");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.headlines) && data.headlines.length > 0) {
          setHeadlines(data.headlines);
        }
      })
      .catch((err) => console.error("Error loading breaking news feed:", err));
  }, []);

  return (
    <div className="w-full bg-white dark:bg-brand-dark border-y border-neutral-200 dark:border-neutral-800 flex items-center relative overflow-hidden h-11 transition-colors duration-300">
      {/* Red Badge */}
      <div className="bg-brand-red text-white text-[10px] font-extrabold uppercase tracking-widest px-4 h-full flex items-center shrink-0 z-10 shadow-lg border-r border-neutral-200 dark:border-neutral-800">
        <span className="animate-pulse flex items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-white mr-2"></span>
          Breaking News
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="flex-grow overflow-hidden relative h-full flex items-center text-xs font-semibold select-none">
        <div className="flex space-x-12 animate-marquee whitespace-nowrap py-1 hover:[animation-play-state:paused]">
          {/* Double content to ensure seamless loop */}
          {[...headlines, ...headlines].map((news, index) => (
            <div key={index} className="flex items-center space-x-2 text-brand-dark dark:text-neutral-200">
              <span className="text-brand-red font-bold font-serif">&bull;</span>
              <span>{news}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
