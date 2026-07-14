"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-dark text-neutral-400 border-t border-neutral-800 pt-16 pb-8 px-4 sm:px-6 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-neutral-800 pb-12">
        
        {/* Editorial Description Column */}
        <div className="md:col-span-2 flex flex-col space-y-4">
          <Link href="/" className="flex items-center space-x-2 select-none cursor-pointer">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="h-9 w-auto object-contain rounded bg-white p-0.5" 
            />
            <span 
              className="font-serif font-semibold text-lg tracking-tight"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <span className="text-brand-red">forex</span>
              <span className="text-white ml-0.5">weekly</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed max-w-sm">
            Forex Weekly is a premium financial market news and analysis platform delivering objective macroeconomic commentary, daily technical levels, and educational resources to active traders.
          </p>
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest">
            ISSN 2831-928X | Registered Publication
          </span>
        </div>

        {/* Links Column 1: Markets */}
        <div className="flex flex-col space-y-3.5">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">Market Coverage</h4>
          <ul className="text-xs space-y-2.5">
            <li>
              <Link href="/weekly-updates" className="hover:text-white hover:underline transition-colors">
                Weekly Analysis Reports
              </Link>
            </li>
            <li>
              <Link href="/daily-feed" className="hover:text-white hover:underline transition-colors">
                Daily Technical Feed
              </Link>
            </li>
            <li>
              <Link href="/forex" className="hover:text-white hover:underline transition-colors">
                Live Forex Rates
              </Link>
            </li>
            <li>
              <Link href="/global-events" className="hover:text-white hover:underline transition-colors">
                Economic Calendar
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Legal & Contact */}
        <div className="flex flex-col space-y-3.5">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">Company</h4>
          <ul className="text-xs space-y-2.5">
            <li>
              <Link href="/about" className="hover:text-white hover:underline transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white hover:underline transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white hover:underline transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white hover:underline transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimers & Copyright */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-neutral-500">
        <div className="flex flex-col space-y-1.5 text-center md:text-left max-w-2xl">
          <p>
            &copy; {currentYear} Forex Weekly. All rights reserved. Registered trademark of Forex Weekly Media Group.
          </p>
          <p className="leading-normal">
            <strong>Risk Warning:</strong> Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite. The content on this website does not constitute financial advice.
          </p>
        </div>
        <div className="flex items-center space-x-4 shrink-0 font-medium">
          <Link href="/privacy" className="hover:text-neutral-400">Privacy</Link>
          <span>&middot;</span>
          <Link href="/terms" className="hover:text-neutral-400">Terms</Link>
          <span>&middot;</span>
          <Link href="/contact" className="hover:text-neutral-400">Support</Link>
        </div>
      </div>
    </footer>
  );
}
