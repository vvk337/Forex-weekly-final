import React from "react";
import prisma from "@/lib/db";
import { mockArticles } from "@/data/mockData";
import ArticleCard from "@/components/ui/ArticleCard";

async function getDailyArticles() {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { category: "daily-feed" },
      orderBy: { publishedAt: "desc" },
    });

    return dbArticles.map((art) => ({
      id: art.id,
      title: art.title,
      excerpt: art.excerpt,
      category: art.category as any,
      publishedAt: art.publishedAt.toISOString().split("T")[0],
      author: art.author,
      readingTime: "4 min read",
      imageUrl: art.imageUrl,
    }));
  } catch (error) {
    console.error("Prisma load error, falling back:", error);
    return mockArticles.filter((art) => art.category === "daily-feed");
  }
}

export default async function DailyFeedPage() {
  const dailyArticles = await getDailyArticles();

  return (
    <div className="w-full animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Real-time Technical Analysis</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Daily Feed
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          Quick-hit technical outlooks, price action levels, support/resistance lines, and intra-day trade setups updated live during the London and New York sessions.
        </p>
      </div>

      {/* Articles List */}
      {dailyArticles.length > 0 ? (
        <div className="max-w-4xl flex flex-col">
          {dailyArticles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="horizontal" aspectRatio="aspect-[21/9]" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500">
          No daily updates found. Check back tomorrow morning.
        </div>
      )}
    </div>
  );
}
