import React from "react";
import prisma from "@/lib/db";
import { mockArticles } from "@/data/mockData";
import ArticleCard from "@/components/ui/ArticleCard";

async function getEducationalArticles() {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { category: "learn-forex" },
      orderBy: { publishedAt: "desc" },
    });

    return dbArticles.map((art) => ({
      id: art.id,
      title: art.title,
      excerpt: art.excerpt,
      category: art.category as any,
      publishedAt: art.publishedAt.toISOString().split("T")[0],
      author: art.author,
      readingTime: "10 min read",
      imageUrl: art.imageUrl,
    }));
  } catch (error) {
    console.error("Prisma load error, falling back:", error);
    return mockArticles.filter((art) => art.category === "learn-forex");
  }
}

export default async function LearnForexPage() {
  const educationalArticles = await getEducationalArticles();

  return (
    <div className="w-full animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Trading Academy</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Learn Forex
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          Comprehensive masterclasses, tutorials, and strategy guides written by veteran traders to build your foundation in price action, macro fundamentals, and money management.
        </p>
      </div>

      {/* Articles Grid */}
      {educationalArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalArticles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500">
          No educational content found. Check back soon for fresh lessons.
        </div>
      )}
    </div>
  );
}
