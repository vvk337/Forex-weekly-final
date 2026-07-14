"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface SponsorData {
  title: string;
  description: string;
  linkUrl: string;
  buttonText: string;
  imageUrl: string;
}

export default function Header() {
  const [sponsor, setSponsor] = useState<SponsorData>({
    title: "Global Liquidity, institutional Spreads from 0.0 Pips",
    description: "Trade 80+ currency pairs with low latency execution.",
    linkUrl: "#",
    buttonText: "Start Trading",
    imageUrl: "",
  });

  useEffect(() => {
    fetch("/api/sponsors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const leader = data.find((s) => s.id === "leaderboard");
          if (leader) setSponsor(leader);
        }
      })
      .catch((err) => console.error("Error loading header sponsor:", err));
  }, []);

  return (
    <header className="w-full bg-white dark:bg-brand-dark border-b border-neutral-200 dark:border-neutral-800 py-6 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 transition-colors duration-300">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center group select-none">
        <div className="relative flex flex-col justify-center items-center h-20 w-44 font-serif">
          {/* Large Backing Initials F and W */}
          <div className="absolute inset-0 flex justify-center items-center leading-none text-[84px] font-bold tracking-tight">
            <span className="text-brand-red select-none transform translate-y-[-2px]">F</span>
            <span className="text-brand-dark dark:text-neutral-100 select-none transform translate-y-[2px] ml-[-6px] transition-colors duration-300">W</span>
          </div>

          {/* Central Overlay Box & Border Lines */}
          <div className="relative z-10 w-full flex flex-col justify-center items-center">
            {/* Top Line */}
            <div className="w-[105%] h-[1.5px] bg-brand-dark dark:bg-neutral-200 transition-colors duration-300"></div>
            
            {/* Text Middle */}
            <div className="bg-white dark:bg-brand-dark py-1 px-4 text-center transition-colors duration-300">
              <span className="text-xs font-bold tracking-[0.35em] uppercase text-brand-dark dark:text-neutral-100 transition-colors duration-300">
                FOREX WEEKLY
              </span>
            </div>
            
            {/* Bottom Line */}
            <div className="w-[105%] h-[1.5px] bg-brand-dark dark:bg-neutral-200 transition-colors duration-300"></div>
          </div>
        </div>
      </Link>

      {/* Leaderboard Ad Placeholder (728x90) */}
      <div className="hidden lg:block w-[728px] h-[90px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded relative overflow-hidden group select-none transition-colors duration-300">
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <div className="flex items-center flex-grow mr-4">
            {/* Sponsor image logo if provided */}
            {sponsor.imageUrl && (
              <img
                src={sponsor.imageUrl}
                alt="Sponsor Logo"
                className="h-8 max-w-[110px] object-contain mr-4 shrink-0 rounded bg-white p-1 border border-neutral-200"
              />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">SPONSOR</span>
              <span className="text-sm font-serif font-bold text-neutral-800 dark:text-neutral-200 mt-1 line-clamp-1">
                {sponsor.title}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {sponsor.description}
              </span>
            </div>
          </div>
          <a
            href={sponsor.linkUrl}
            className="bg-brand-dark hover:bg-brand-red text-white text-xs font-bold px-4 py-2 rounded border border-neutral-700 dark:border-neutral-600 transition-all duration-300 shrink-0"
          >
            {sponsor.buttonText}
          </a>
        </div>
        {/* Subtle decorative grid lines to look like market charts */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg width="200" height="90" viewBox="0 0 200 90">
            <path d="M 0 60 Q 40 10 80 50 T 160 20 T 200 70" fill="none" stroke="red" strokeWidth="2" />
          </svg>
        </div>
      </div>
      
      {/* Mobile/Tablet Fallback Ad Block (hidden on Desktop) */}
      <div className="lg:hidden w-full h-[60px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mr-3">SPONSOR:</span>
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
          {sponsor.title}
        </span>
        <a href={sponsor.linkUrl} className="text-xs font-bold text-brand-red ml-2 hover:underline shrink-0">
          {sponsor.buttonText}
        </a>
      </div>
    </header>
  );
}
