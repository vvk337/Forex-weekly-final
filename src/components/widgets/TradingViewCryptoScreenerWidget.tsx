"use client";

import React, { useEffect, useRef } from "react";

export default function TradingViewCryptoScreenerWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const isDark = document.documentElement.classList.contains("dark");

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: isDark ? "dark" : "light",
      isTransparent: false,
      locale: "en",
      width: "100%",
      height: 550
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 shadow-sm transition-colors duration-300">
      <div className="border-b border-neutral-150 dark:border-neutral-800 pb-3.5 mb-4">
        <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-brand-dark dark:text-neutral-100">
          Cryptocurrency Market Screener
        </h3>
        <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Top crypto prices, capitalization, and changes</p>
      </div>

      {/* TradingView Widget Mount */}
      <div ref={containerRef} className="tradingview-widget-container w-full min-h-[550px]" />
    </div>
  );
}
