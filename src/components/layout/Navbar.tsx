"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Weekly Updates", href: "/weekly-updates" },
  { label: "Daily Feed", href: "/daily-feed" },
  { label: "Global Events", href: "/global-events" },
  { label: "Forex", href: "/forex" },
  { label: "Learn Forex", href: "/learn-forex" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "glassmorphism shadow-md border-neutral-200/80 dark:border-neutral-800/80 py-2"
          : "bg-white dark:bg-brand-dark border-neutral-200 dark:border-neutral-800 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-xs lg:text-sm font-bold uppercase tracking-wider transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "text-brand-red"
                    : "text-brand-dark hover:text-brand-red dark:text-neutral-200 dark:hover:text-brand-red"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-brand-red transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Small Brand Indicator for Scrolled/Sticky Header on Desktop */}
        <div className={`md:hidden ${isScrolled ? "block" : "invisible"} font-serif text-sm font-bold tracking-widest`}>
          <Link href="/" className="text-brand-dark dark:text-white">
            FOREX <span className="text-brand-red">WEEKLY</span>
          </Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <Link
            href="/free-assessment"
            className="inline-flex items-center justify-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 border border-brand-red hover:border-brand-red-dark rounded-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg cursor-pointer"
          >
            Get Free Assessment
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded text-brand-dark dark:text-neutral-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            // Close SVG
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // Hamburger SVG
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-brand-dark border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? "opacity-100 scale-y-100 py-4" : "opacity-0 scale-y-0 h-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-3 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 text-sm font-bold uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-900 transition-colors ${
                  isActive
                    ? "text-brand-red"
                    : "text-brand-dark dark:text-neutral-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/free-assessment"
            className="w-full text-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider py-3 rounded-sm transition-all duration-200 mt-2"
          >
            Get Free Assessment
          </Link>
        </div>
      </div>
    </nav>
  );
}
