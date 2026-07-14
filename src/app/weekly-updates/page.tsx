import React from "react";
import prisma from "@/lib/db";
import { mockArticles } from "@/data/mockData";
import ArticleCard from "@/components/ui/ArticleCard";

async function getWeeklyArticles() {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { category: "weekly-updates" },
      orderBy: { publishedAt: "desc" },
    });

    return dbArticles.map((art) => ({
      id: art.id,
      title: art.title,
      excerpt: art.excerpt,
      category: art.category as any,
      publishedAt: art.publishedAt.toISOString().split("T")[0],
      author: art.author,
      readingTime: "8 min read",
      imageUrl: art.imageUrl,
    }));
  } catch (error) {
    console.error("Prisma load error, falling back:", error);
    return mockArticles.filter((art) => art.category === "weekly-updates");
  }
}

export default async function WeeklyUpdatesPage() {
  const weeklyArticles = await getWeeklyArticles();

  return (
    <div className="w-full animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Reports & Intelligence</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Weekly Updates
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          Deep-dive macroeconomic reports, currency flows analysis, and institutional outlooks published every Saturday morning to prepare you for the trading week ahead.
        </p>
      </div>

      {/* Articles Grid */}
      {weeklyArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyArticles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500">
          No reports found. Check back on Saturday for our next release.
        </div>
      )}
    </div>
  );
}
