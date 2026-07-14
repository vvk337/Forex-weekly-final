"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    } else {
      router.push("/");
    }
  };

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
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6 mr-4 flex-nowrap shrink">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-[10px] lg:text-[11px] xl:text-xs font-extrabold uppercase tracking-wider transition-all duration-200 group cursor-pointer whitespace-nowrap ${
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
        <div className={`md:hidden ${isScrolled ? "block" : "invisible"}`}>
          <Link href="/" className="flex items-center space-x-1.5 select-none cursor-pointer">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="h-6 w-auto object-contain rounded bg-white p-0.5" 
            />
            <span 
              className="font-serif font-semibold text-xs tracking-tight"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <span className="text-brand-red">forex</span>
              <span className="text-brand-dark dark:text-white ml-0.5">weekly</span>
            </span>
          </Link>
        </div>

        {/* Action Button & Search */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4 shrink-0">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-brand-dark dark:text-neutral-200 rounded-sm pl-8 pr-3 py-1.5 text-[10px] lg:text-[11px] w-24 lg:w-32 xl:w-40 focus:w-32 lg:focus:w-44 xl:focus:w-48 focus:outline-none focus:border-brand-red transition-all"
            />
            <button type="submit" className="absolute left-2.5 text-neutral-400 hover:text-brand-red transition-colors" aria-label="Search button">
              <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <Link
            href="/free-assessment"
            className="inline-flex items-center justify-center bg-brand-red hover:bg-brand-red-dark text-white text-[10px] lg:text-[11px] font-bold uppercase tracking-wider py-2 px-3 lg:py-2.5 lg:px-4 border border-brand-red hover:border-brand-red-dark rounded-sm transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg cursor-pointer shrink-0"
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
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative flex items-center mb-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-brand-dark dark:text-neutral-200 rounded-sm pl-8 pr-3 py-2 text-xs w-full focus:outline-none focus:border-brand-red"
            />
            <button type="submit" className="absolute left-2.5 text-neutral-400" aria-label="Mobile search button">
              <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

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
