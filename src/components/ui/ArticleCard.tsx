"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/data/mockData";

interface ArticleCardProps {
  article: Article;
  layout?: "grid" | "horizontal" | "minimal";
  aspectRatio?: string;
}

export default function ArticleCard({ article, layout = "grid", aspectRatio = "aspect-video" }: ArticleCardProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "weekly-updates":
        return "Weekly Update";
      case "daily-feed":
        return "Daily Feed";
      case "global-events":
        return "Global Event";
      case "forex":
        return "Forex Market";
      case "learn-forex":
        return "Learn Forex";
      default:
        return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "weekly-updates":
        return "bg-brand-red/10 text-brand-red border-brand-red/20";
      case "daily-feed":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
      case "global-events":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
      case "forex":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "learn-forex":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const linkHref = `/${article.category}/${article.id}`;

  if (layout === "minimal") {
    return (
      <div className="py-4 border-b border-neutral-100 dark:border-neutral-900 group">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 border rounded-sm ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category)}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{article.publishedAt}</span>
        </div>
        <Link href={linkHref} className="group-hover:text-brand-red transition-colors cursor-pointer">
          <h4 className="font-serif font-bold text-base leading-snug text-brand-dark dark:text-neutral-100 group-hover:text-brand-red">
            {article.title}
          </h4>
        </Link>
        <span className="text-[10px] text-neutral-400 block mt-1.5">{article.readingTime}</span>
      </div>
    );
  }

  if (layout === "horizontal") {
    return (
      <div className="flex flex-col sm:flex-row gap-5 py-6 border-b border-neutral-100 dark:border-neutral-900 group">
        <Link href={linkHref} className={`sm:w-1/3 shrink-0 rounded overflow-hidden relative bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${aspectRatio} group-hover:shadow-md transition-all duration-300 cursor-pointer`}>
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            {/* Visual representation instead of empty page */}
            <span className="text-2xl font-bold font-serif opacity-30 select-none text-neutral-600">FW</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </Link>
        
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 border rounded-sm ${getCategoryColor(article.category)}`}>
                {getCategoryLabel(article.category)}
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{article.publishedAt}</span>
            </div>
            
            <Link href={linkHref} className="group-hover:text-brand-red transition-colors cursor-pointer">
              <h3 className="font-serif font-bold text-lg md:text-xl leading-tight text-brand-dark dark:text-neutral-500 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors">
                {article.title}
              </h3>
            </Link>
            
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-50/50 dark:border-neutral-900/50 text-[10px] text-neutral-400">
            <span>By <strong className="text-neutral-600 dark:text-neutral-300 font-semibold">{article.author}</strong></span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div className="flex flex-col h-full bg-white dark:bg-brand-dark border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300">
      <Link href={linkHref} className={`relative block bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden ${aspectRatio} cursor-pointer`}>
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
          <span className="text-3xl font-bold font-serif opacity-30 select-none text-neutral-600">FOREX WEEKLY</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center space-x-3 mb-2.5">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 border rounded-sm ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category)}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{article.publishedAt}</span>
        </div>
        
        <Link href={linkHref} className="group-hover:text-brand-red transition-colors flex-grow cursor-pointer">
          <h3 className="font-serif font-bold text-base md:text-lg leading-snug text-brand-dark dark:text-neutral-100 group-hover:text-brand-red transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-900 text-[10px] text-neutral-400 mt-auto">
          <span>By <strong className="text-neutral-600 dark:text-neutral-300 font-semibold">{article.author}</strong></span>
          <span>{article.readingTime}</span>
        </div>
      </div>
    </div>
  );
}
