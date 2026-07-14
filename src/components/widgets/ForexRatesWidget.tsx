"use client";

import React, { useEffect, useRef } from "react";

export default function ForexRatesWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous instances
    containerRef.current.innerHTML = "";

    // Create the container element for script to execute
    const tvContainer = document.createElement("div");
    tvContainer.innerHTML = `
      <tv-ticker-tape symbols="FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,FOREXCOM:DJI,FX:EURUSD,BITSTAMP:BTCUSD,BITSTAMP:ETHUSD,CMCMARKETS:GOLD"></tv-ticker-tape>
    `;
    containerRef.current.appendChild(tvContainer);

    // Load the TradingView widget script
    const script = document.createElement("script");
    script.src = "https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js";
    script.type = "module";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script on unmount to prevent duplicates
      script.remove();
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-4 transition-colors duration-300">
      <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-serif font-bold text-xs tracking-wider uppercase text-brand-dark dark:text-neutral-100">
            Live Markets Ticker
          </h3>
        </div>
        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
          Powered by TradingView
        </span>
      </div>
      
      {/* TradingView Ticker Tape container */}
      <div ref={containerRef} className="w-full overflow-hidden rounded relative min-h-[46px]" />
    </div>
  );
}
