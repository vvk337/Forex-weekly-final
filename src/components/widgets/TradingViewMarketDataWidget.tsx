"use client";

import React, { useEffect, useRef } from "react";

export default function TradingViewMarketDataWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const tvWidget = document.createElement("div");
    tvWidget.innerHTML = `
      <tv-market-data symbol-sectors='[{"sectionName":"Indices","symbols":["FOREXCOM:SPXUSD","FOREXCOM:NSXUSD","FOREXCOM:DJI","INDEX:NKY","INDEX:DEU40","FOREXCOM:UKXGBP"]},{"sectionName":"Futures","symbols":["BMFBOVESPA:ISP1!","BMFBOVESPA:EUR1!","CMCMARKETS:GOLD","TVC:USOIL","BMFBOVESPA:CCM1!"]},{"sectionName":"Bonds","symbols":["EUREX:FGBL1!","EUREX:FBTP1!","EUREX:FGBM1!"]},{"sectionName":"Forex","symbols":["FX:EURUSD","FX:GBPUSD","FX:USDJPY","FX:USDCHF","FX:AUDUSD","FX:USDCAD"]}]'></tv-market-data>
    `;
    containerRef.current.appendChild(tvWidget);

    const script = document.createElement("script");
    script.src = "https://widgets.tradingview-widget.com/w/en/tv-market-data.js";
    script.type = "module";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 shadow-sm transition-colors duration-300">
      <div className="border-b border-neutral-150 dark:border-neutral-800 pb-3.5 mb-4">
        <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-brand-dark dark:text-neutral-100">
          Global Market Data Dashboard
        </h3>
        <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Indices &bull; Futures &bull; Bonds &bull; Forex Markets</p>
      </div>
      
      {/* TradingView Widget Mount */}
      <div ref={containerRef} className="w-full overflow-hidden min-h-[450px]" />
    </div>
  );
}
