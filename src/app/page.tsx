import React from "react";
import Link from "next/link";
import prisma from "@/lib/db";
import { mockArticles } from "@/data/mockData";
import ArticleCard from "@/components/ui/ArticleCard";
import AdBanner from "@/components/ui/AdBanner";
import BreakingNewsBar from "@/components/widgets/BreakingNewsBar";
import ForexRatesWidget from "@/components/widgets/ForexRatesWidget";
import EconomicCalendarWidget from "@/components/widgets/EconomicCalendarWidget";
import NewsletterSection from "@/components/ui/NewsletterSection";
import TradingSessionsWidget from "@/components/widgets/TradingSessionsWidget";
import TradingViewTechnicalAnalysisWidget from "@/components/widgets/TradingViewTechnicalAnalysisWidget";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

// Helper to fetch articles from database with dynamic seeding, search filtering, and safe fallback
async function getArticles(search?: string) {
  try {
    // Check count and seed if empty
    const count = await prisma.article.count();
    if (count === 0) {
      const data = mockArticles.map((art) => ({
        title: art.title,
        excerpt: art.excerpt,
        content: `This is the full publication of the article: "${art.title}". 
        
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat, arcu vel mollis tempor, neque libero rhoncus justo, vel elementum enim sapien vel leo. Cras elementum rhoncus sem. Proin hendrerit, leo ac pellentesque imperdiet, erat felis pulvinar neque, a posuere tortor arcu quis turpis. 
        
        Duis sit amet ligula ut est pretium elementum. Pellentesque sed dolor. Aliquam congue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.`,
        category: art.category,
        publishedAt: new Date(art.publishedAt),
        author: art.author,
        imageUrl: art.imageUrl,
        isFeatured: art.isFeatured || false,
      }));
      await prisma.article.createMany({ data });
    }
    
    // Build search filters if query exists
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const dbArticles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });

    // Map DB fields back to UI Article types
    return dbArticles.map((art) => ({
      id: art.id,
      title: art.title,
      excerpt: art.excerpt,
      category: art.category as any,
      publishedAt: art.publishedAt.toISOString().split("T")[0],
      author: art.author,
      readingTime: "5 min read", // Mocked value
      imageUrl: art.imageUrl,
      isFeatured: art.isFeatured,
    }));
  } catch (error) {
    console.error("Database load error, falling back to static mock data:", error);
    
    // Local mock filtering
    if (search) {
      const query = search.toLowerCase();
      return mockArticles.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.excerpt.toLowerCase().includes(query)
      );
    }
    return mockArticles;
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search } = await searchParams;
  const articles = await getArticles(search);

  // Extract featured articles
  const featuredArticle = articles.find((art) => art.isFeatured) || articles[0];
  const gridArticles = articles.filter((art) => !art.isFeatured && art.category !== "learn-forex").slice(0, 4);
  const educationalArticles = articles.filter((art) => art.category === "learn-forex").slice(0, 2);
  const dailyFeedArticles = articles.filter((art) => art.category === "daily-feed").slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Breaking News Ticker (Full Width) */}
      <BreakingNewsBar />

      {/* 2. Live TradingView Ticker Tape Widget (Full Width) */}
      <ForexRatesWidget />

      {search ? (
        /* Render search results in list card (horizontal layout) format */
        <div className="space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-4 flex justify-between items-center transition-colors">
            <div className="text-xs">
              Viewing search results for: <strong className="text-brand-red font-bold font-mono text-sm">"{search}"</strong>
              <span className="text-neutral-400 ml-2">({articles.length} publications found)</span>
            </div>
            <Link href="/" className="text-xs font-bold text-neutral-400 hover:text-brand-red uppercase tracking-wider">
              Clear Search
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 border border-neutral-100 dark:border-neutral-850 rounded text-neutral-400 text-xs font-bold uppercase tracking-widest bg-neutral-50/50 dark:bg-neutral-900/10">
              No articles match your search parameters. Try searching for other terms like "fed", "inflation", or "rates".
            </div>
          ) : (
            <div className="bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6 divide-y divide-neutral-100 dark:divide-neutral-850/55">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} layout="horizontal" />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Render normal homepage grid */
        articles.length === 0 ? (
          <div className="text-center py-16 border border-neutral-100 dark:border-neutral-850 rounded text-neutral-400 text-xs font-bold uppercase tracking-widest bg-neutral-50/50 dark:bg-neutral-900/10">
            No articles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (8 Cols on large screens) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Large Hero Featured Article */}
              {featuredArticle && (
                <div className="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 bg-white dark:bg-brand-dark-card">
                  {/* Visual Featured Image */}
                  <Link href={`/${featuredArticle.category}/${featuredArticle.id}`} className="relative block h-72 sm:h-96 w-full bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer">
                    {featuredArticle.imageUrl ? (
                      <img
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <span className="text-5xl font-bold font-serif opacity-20 select-none text-neutral-600 tracking-wider">FEATURED REPORT</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                    
                    {/* Overlay Metadata */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                      <span className="bg-brand-red text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-sm">
                        WEEKLY INTELLIGENCE REPORT
                      </span>
                      <h2 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl leading-tight group-hover:text-neutral-200 transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-[10px] text-neutral-300 pt-1">
                        <span>By <strong>{featuredArticle.author}</strong></span>
                        <span>&bull;</span>
                        <span>{featuredArticle.publishedAt}</span>
                        <span>&bull;</span>
                        <span>{featuredArticle.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                      {featuredArticle.excerpt}
                    </p>
                    <Link
                      href={`/${featuredArticle.category}/${featuredArticle.id}`}
                      className="inline-flex items-center text-xs font-bold text-brand-red uppercase tracking-wider mt-4 hover:text-brand-red-dark hover:translate-x-1 transition-all cursor-pointer"
                    >
                      Read Full Analysis &rarr;
                    </Link>
                  </div>
                </div>
              )}

              {gridArticles.length > 0 && (
                <>
                  <hr className="border-neutral-200 dark:border-neutral-800" />
                  
                  {/* Grid of Latest Articles */}
                  <div>
                    <h2 className="font-serif font-bold text-xl text-brand-dark dark:text-white mb-5 uppercase tracking-wider border-l-2 border-brand-red pl-3.5">
                      Latest Market Analysis
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {gridArticles.map((art) => (
                        <ArticleCard key={art.id} article={art} layout="grid" />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="border-neutral-200 dark:border-neutral-800" />

              {/* Full-width Economic Calendar (Embedded in left panel) */}
              <EconomicCalendarWidget />

              {educationalArticles.length > 0 && (
                <>
                  <hr className="border-neutral-200 dark:border-neutral-800" />
                  
                  {/* Learn Forex Column */}
                  <div>
                    <h2 className="font-serif font-bold text-xl text-brand-dark dark:text-white mb-5 uppercase tracking-wider border-l-2 border-brand-red pl-3.5 flex justify-between items-center">
                      <span>Learn Forex & Trading Systems</span>
                      <Link href="/learn-forex" className="text-xs font-bold text-brand-red lowercase hover:underline normal-case tracking-normal">
                        View Academy &rarr;
                      </Link>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {educationalArticles.map((art) => (
                        <ArticleCard key={art.id} article={art} layout="grid" aspectRatio="aspect-[4/3]" />
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Right Column / Sidebar (4 Cols on large screens) */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Square Ad Banner Sponsor (300x250) */}
              <AdBanner size="square" />

              {/* Technical Analysis widget replacing the Daily Technical Feed box */}
              <TradingViewTechnicalAnalysisWidget />

              {/* Sponsored Links / Recommendations Block */}
              <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 transition-colors text-xs space-y-4">
                <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-brand-dark dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  Institutional Partners
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="hover:text-brand-red transition-colors flex justify-between items-center group font-medium">
                      <span>Global Prime (STP Brokers)</span>
                      <span className="text-[10px] text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-red transition-colors flex justify-between items-center group font-medium">
                      <span>TradingView Charting Suite</span>
                      <span className="text-[10px] text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-red transition-colors flex justify-between items-center group font-medium">
                      <span>Beeks FX Low-Latency VPS</span>
                      <span className="text-[10px] text-neutral-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Inline Sponsor Strip */}
              <AdBanner size="inline" />

              {/* Trading Session status indicator widget */}
              <TradingSessionsWidget />

            </aside>
          </div>
        )
      )}

      {/* 4. Bottom Full-Width Newsletter Signup Banner */}
      <hr className="border-neutral-200 dark:border-neutral-800" />
      <NewsletterSection />
    </div>
  );
}
