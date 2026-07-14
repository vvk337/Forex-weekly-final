"use client";

import React, { useEffect, useState } from "react";

interface AdBannerProps {
  size: "leaderboard" | "square" | "inline";
  className?: string;
}

interface SponsorData {
  title: string;
  description: string;
  linkUrl: string;
  buttonText: string;
  imageUrl: string;
}

export default function AdBanner({ size, className = "" }: AdBannerProps) {
  const [sponsor, setSponsor] = useState<SponsorData>({
    title: "",
    description: "",
    linkUrl: "#",
    buttonText: "",
    imageUrl: "",
  });

  // Set default fallbacks based on size
  useEffect(() => {
    if (size === "leaderboard") {
      setSponsor({
        title: "Forex Weekly Institutional Terminal",
        description: "Access institutional-grade currency flows, macroeconomic triggers, and algorithmic feeds in real-time.",
        linkUrl: "#",
        buttonText: "Apply for Beta Access",
        imageUrl: "",
      });
    } else if (size === "square") {
      setSponsor({
        title: "Trade with the World's #1 FX Broker",
        description: "Tightest spreads, instant withdraws, and award-winning 24/7 technical support.",
        linkUrl: "#",
        buttonText: "Open Live Account",
        imageUrl: "",
      });
    } else {
      setSponsor({
        title: "Forex Weekly Academy: Master market order blocks & liquidity sweeps.",
        description: "Master market order blocks & liquidity sweeps.",
        linkUrl: "#",
        buttonText: "Free Guide",
        imageUrl: "",
      });
    }

    // Fetch dynamic database settings
    fetch("/api/sponsors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const matched = data.find((s) => s.id === size);
          if (matched) setSponsor(matched);
        }
      })
      .catch((err) => console.error(`Error loading ${size} sponsor:`, err));
  }, [size]);

  if (size === "leaderboard") {
    return (
      <div className={`w-full max-w-[970px] min-h-[90px] md:min-h-[250px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-300 ${className}`}>
        <div className="absolute top-1.5 left-2">
          <span className="text-[8px] font-bold tracking-widest text-neutral-400 dark:text-neutral-600 uppercase">ADVERTISEMENT</span>
        </div>
        <div className="text-center max-w-xl z-10 flex flex-col items-center">
          {sponsor.imageUrl && (
            <img
              src={sponsor.imageUrl}
              alt="Sponsor Logo"
              className="h-10 object-contain mb-3 bg-white p-1 rounded border border-neutral-200"
            />
          )}
          <h4 className="font-serif font-bold text-neutral-800 dark:text-neutral-200 text-sm sm:text-base md:text-lg">
            {sponsor.title}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {sponsor.description}
          </p>
          <a
            href={sponsor.linkUrl}
            className="inline-block mt-3 text-xs font-bold text-white bg-brand-red px-4 py-1.5 rounded hover:bg-brand-red-dark transition-colors duration-200"
          >
            {sponsor.buttonText}
          </a>
        </div>
        {/* Abstract design elements to look like a chart grid */}
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.02] pointer-events-none grid grid-cols-12 grid-rows-6">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="border-t border-l border-neutral-900"></div>
          ))}
        </div>
      </div>
    );
  }

  if (size === "square") {
    return (
      <div className={`w-full max-w-[300px] h-[250px] mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded flex flex-col justify-between p-5 relative overflow-hidden transition-colors duration-300 ${className}`}>
        <div className="absolute top-1.5 left-2">
          <span className="text-[8px] font-bold tracking-widest text-neutral-400 dark:text-neutral-600 uppercase">SPONSOR</span>
        </div>
        
        <div className="mt-4 flex flex-col items-start">
          {sponsor.imageUrl && (
            <img
              src={sponsor.imageUrl}
              alt="Sponsor Logo"
              className="h-8 object-contain mb-3 bg-white p-1 rounded border border-neutral-200"
            />
          )}
          <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest block mb-1">
            Premium Broker Sponsor
          </span>
          <h4 className="font-serif font-bold text-neutral-800 dark:text-neutral-100 text-base leading-snug">
            {sponsor.title}
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-normal line-clamp-3">
            {sponsor.description}
          </p>
        </div>

        <a
          href={sponsor.linkUrl}
          className="w-full text-center bg-brand-dark hover:bg-brand-red text-white text-xs font-bold py-2.5 rounded border border-neutral-700 dark:border-neutral-600 transition-colors duration-200"
        >
          {sponsor.buttonText}
        </a>
      </div>
    );
  }

  return (
    <div className={`w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-3 px-4 rounded flex items-center justify-between text-xs transition-colors duration-300 ${className}`}>
      <span className="text-[8px] font-bold tracking-widest text-neutral-400 dark:text-neutral-600 uppercase mr-3 shrink-0">SPONSOR</span>
      <div className="flex items-center truncate mr-4">
        {sponsor.imageUrl && (
          <img
            src={sponsor.imageUrl}
            alt="Sponsor Logo"
            className="h-5 w-5 object-contain mr-2.5 shrink-0 bg-white p-0.5 rounded border border-neutral-200"
          />
        )}
        <span className="text-neutral-700 dark:text-neutral-300 truncate">
          {sponsor.title}
        </span>
      </div>
      <a href={sponsor.linkUrl} className="text-brand-red font-bold hover:underline shrink-0">
        {sponsor.buttonText} &rarr;
      </a>
    </div>
  );
}
