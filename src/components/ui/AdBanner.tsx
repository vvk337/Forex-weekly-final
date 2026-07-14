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
  bgImageUrl?: string;
}

export default function AdBanner({ size, className = "" }: AdBannerProps) {
  const [sponsor, setSponsor] = useState<SponsorData>({
    title: "",
    description: "",
    linkUrl: "#",
    buttonText: "",
    imageUrl: "",
    bgImageUrl: "",
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
        bgImageUrl: "",
      });
    } else if (size === "square") {
      setSponsor({
        title: "Trade with the World's #1 FX Broker",
        description: "Tightest spreads, instant withdraws, and award-winning 24/7 technical support.",
        linkUrl: "#",
        buttonText: "Open Live Account",
        imageUrl: "",
        bgImageUrl: "",
      });
    } else {
      setSponsor({
        title: "Forex Weekly Academy: Master market order blocks & liquidity sweeps.",
        description: "Master market order blocks & liquidity sweeps.",
        linkUrl: "#",
        buttonText: "Free Guide",
        imageUrl: "",
        bgImageUrl: "",
      });
    }

    // Fetch dynamic database settings
    fetch("/api/sponsors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const matched = data.find((s) => s.id === size);
          if (matched) {
            setSponsor({
              ...matched,
              bgImageUrl: matched.bgImageUrl || "",
            });
          }
        }
      })
      .catch((err) => console.error(`Error loading ${size} sponsor:`, err));
  }, [size]);

  if (size === "leaderboard") {
    return (
      <div 
        className={`w-full max-w-[970px] min-h-[90px] md:min-h-[250px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-300 ${className}`}
        style={{
          backgroundImage: sponsor.bgImageUrl ? `url(${sponsor.bgImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Shading overlay for background images */}
        {sponsor.bgImageUrl && (
          <div className="absolute inset-0 bg-neutral-900/50 dark:bg-neutral-950/70 z-0"></div>
        )}

        <div className="absolute top-1.5 left-2 z-10">
          <span className={`text-[8px] font-bold tracking-widest uppercase ${sponsor.bgImageUrl ? "text-neutral-300" : "text-neutral-400 dark:text-neutral-600"}`}>ADVERTISEMENT</span>
        </div>
        <div className="text-center max-w-xl z-10 flex flex-col items-center">
          {sponsor.imageUrl && (
            <img
              src={sponsor.imageUrl}
              alt="Sponsor Logo"
              className="h-10 object-contain mb-3 bg-white p-1 rounded border border-neutral-200 shadow-sm"
            />
          )}
          <h4 className={`font-serif font-bold text-sm sm:text-base md:text-lg ${sponsor.bgImageUrl ? "text-white" : "text-neutral-800 dark:text-neutral-200"}`}>
            {sponsor.title}
          </h4>
          <p className={`text-xs mt-1 ${sponsor.bgImageUrl ? "text-neutral-200" : "text-neutral-500 dark:text-neutral-400"}`}>
            {sponsor.description}
          </p>
          <a
            href={sponsor.linkUrl}
            className={`inline-block mt-3 text-xs font-bold text-white px-4 py-1.5 rounded hover:shadow-lg transition-all duration-200 ${
              sponsor.bgImageUrl ? "bg-brand-red hover:bg-brand-red-dark" : "bg-brand-red hover:bg-brand-red-dark"
            }`}
          >
            {sponsor.buttonText}
          </a>
        </div>
        {/* Abstract design elements to look like a chart grid */}
        {!sponsor.bgImageUrl && (
          <div className="absolute inset-0 opacity-5 dark:opacity-[0.02] pointer-events-none grid grid-cols-12 grid-rows-6">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border-t border-l border-neutral-900"></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (size === "square") {
    return (
      <div 
        className={`w-full max-w-[300px] h-[250px] mx-auto bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded flex flex-col justify-between p-5 relative overflow-hidden transition-colors duration-300 ${className}`}
        style={{
          backgroundImage: sponsor.bgImageUrl ? `url(${sponsor.bgImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Shading overlay for background images */}
        {sponsor.bgImageUrl && (
          <div className="absolute inset-0 bg-neutral-900/50 dark:bg-neutral-950/70 z-0"></div>
        )}

        <div className="absolute top-1.5 left-2 z-10">
          <span className={`text-[8px] font-bold tracking-widest uppercase ${sponsor.bgImageUrl ? "text-neutral-300" : "text-neutral-400 dark:text-neutral-600"}`}>SPONSOR</span>
        </div>
        
        <div className="mt-4 flex flex-col items-start z-10">
          {sponsor.imageUrl && (
            <img
              src={sponsor.imageUrl}
              alt="Sponsor Logo"
              className="h-8 object-contain mb-3 bg-white p-1 rounded border border-neutral-200 shadow-sm"
            />
          )}
          <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest block mb-1">
            Premium Broker Sponsor
          </span>
          <h4 className={`font-serif font-bold text-base leading-snug ${sponsor.bgImageUrl ? "text-white" : "text-neutral-800 dark:text-neutral-100"}`}>
            {sponsor.title}
          </h4>
          <p className={`text-[11px] mt-1.5 leading-normal line-clamp-3 ${sponsor.bgImageUrl ? "text-neutral-200" : "text-neutral-500 dark:text-neutral-400"}`}>
            {sponsor.description}
          </p>
        </div>

        <a
          href={sponsor.linkUrl}
          className={`w-full text-center text-white text-xs font-bold py-2.5 rounded transition-all duration-200 z-10 ${
            sponsor.bgImageUrl
              ? "bg-brand-red hover:bg-brand-red-dark border border-brand-red hover:shadow-lg"
              : "bg-brand-dark hover:bg-brand-red border border-neutral-700 dark:border-neutral-600"
          }`}
        >
          {sponsor.buttonText}
        </a>
      </div>
    );
  }

  // Inline Strip layout
  return (
    <div 
      className={`w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 py-3 px-4 rounded flex items-center justify-between text-xs transition-colors duration-300 relative overflow-hidden ${className}`}
      style={{
        backgroundImage: sponsor.bgImageUrl ? `url(${sponsor.bgImageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Shading overlay for background images */}
      {sponsor.bgImageUrl && (
        <div className="absolute inset-0 bg-neutral-900/50 dark:bg-neutral-950/70 z-0"></div>
      )}

      <span className={`text-[8px] font-bold tracking-widest uppercase mr-3 shrink-0 z-10 ${sponsor.bgImageUrl ? "text-neutral-300" : "text-neutral-400 dark:text-neutral-600"}`}>SPONSOR</span>
      <div className="flex items-center truncate mr-4 z-10">
        {sponsor.imageUrl && (
          <img
            src={sponsor.imageUrl}
            alt="Sponsor Logo"
            className="h-5 w-5 object-contain mr-2.5 shrink-0 bg-white p-0.5 rounded border border-neutral-200 shadow-sm"
          />
        )}
        <span className={`truncate ${sponsor.bgImageUrl ? "text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
          {sponsor.title}
        </span>
      </div>
      <a 
        href={sponsor.linkUrl} 
        className={`font-bold hover:underline shrink-0 z-10 ${sponsor.bgImageUrl ? "text-brand-red" : "text-brand-red"}`}
      >
        {sponsor.buttonText} &rarr;
      </a>
    </div>
  );
}
