"use client";

import React, { useEffect, useRef } from "react";

export default function TradingViewTechnicalAnalysisWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const isDark = document.documentElement.classList.contains("dark");

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1h",
      width: "100%",
      isTransparent: false,
      height: 450,
      symbol: "FX:EURUSD",
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: isDark ? "dark" : "light"
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors duration-300">
      <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-red animate-pulse"></span>
          <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-brand-dark dark:text-neutral-100">
            Technical Analysis Feed
          </h3>
        </div>
        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
          EUR/USD &bull; 1H Gauge
        </span>
      </div>

      {/* TradingView Widget Mount */}
      <div ref={containerRef} className="tradingview-widget-container w-full min-h-[450px] overflow-hidden rounded-sm" />
    </div>
  );
}
