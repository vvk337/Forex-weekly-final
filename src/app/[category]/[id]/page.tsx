import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { mockArticles } from "@/data/mockData";
import AdBanner from "@/components/ui/AdBanner";

interface ArticleDetailPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// Next.js will prerender these paths at build time
export async function generateStaticParams() {
  try {
    const dbArticles = await prisma.article.findMany({
      select: { id: true, category: true }
    });
    return dbArticles.map((art) => ({
      category: art.category,
      id: art.id,
    }));
  } catch (error) {
    console.error("generateStaticParams error, falling back to mock articles:", error);
    return mockArticles.map((art) => ({
      category: art.category,
      id: art.id,
    }));
  }
}

// Enable on-demand generation for articles created in dashboard after build
export const dynamicParams = true;

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { category, id } = await params;
  
  let article;
  let related: { id: string; title: string; category: any; publishedAt: string }[] = [];

  try {
    const dbArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (dbArticle && dbArticle.category === category) {
      article = {
        id: dbArticle.id,
        title: dbArticle.title,
        excerpt: dbArticle.excerpt,
        content: dbArticle.content,
        category: dbArticle.category as any,
        publishedAt: dbArticle.publishedAt.toISOString().split("T")[0],
        author: dbArticle.author,
        readingTime: "6 min read",
        imageUrl: dbArticle.imageUrl,
        isFeatured: dbArticle.isFeatured,
      };

      // Get related
      const dbRelated = await prisma.article.findMany({
        where: {
          category,
          NOT: { id }
        },
        take: 2,
        orderBy: { publishedAt: "desc" }
      });

      related = dbRelated.map(art => ({
        id: art.id,
        title: art.title,
        category: art.category as any,
        publishedAt: art.publishedAt.toISOString().split("T")[0],
      }));
    }
  } catch (error) {
    console.error("Prisma error fetching single article, trying mock data:", error);
  }

  // Fallback to mock data if not found in database or DB failed
  if (!article) {
    const mock = mockArticles.find((art) => art.id === id && art.category === category);
    if (!mock) {
      notFound();
    }
    article = {
      ...mock,
      content: `This is the full publication of the article: "${mock.title}". 
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat, arcu vel mollis tempor, neque libero rhoncus justo, vel elementum enim sapien vel leo. Cras elementum rhoncus sem. Proin hendrerit, leo ac pellentesque imperdiet, erat felis pulvinar neque, a posuere tortor arcu quis turpis. 
      
      Duis sit amet ligula ut est pretium elementum. Pellentesque sed dolor. Aliquam congue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.`,
    };
    related = mockArticles
      .filter((art) => art.category === category && art.id !== id)
      .slice(0, 2)
      .map(art => ({
        id: art.id,
        title: art.title,
        category: art.category as any,
        publishedAt: art.publishedAt,
      }));
  }

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Back Button */}
      <Link href={`/${category}`} className="text-xs font-bold text-neutral-400 hover:text-brand-red uppercase tracking-wider flex items-center transition-colors">
        &larr; Back to {category.replace("-", " ")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <article className="lg:col-span-8 space-y-6">
          <div className="space-y-3.5 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <span className="bg-brand-red/10 text-brand-red border border-brand-red/20 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-sm">
              {category.replace("-", " ")}
            </span>
            
            <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl leading-tight text-brand-dark dark:text-white">
              {article.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span>By <strong className="text-neutral-700 dark:text-neutral-300">{article.author}</strong></span>
              <span>&bull;</span>
              <span>Published: {article.publishedAt}</span>
              <span>&bull;</span>
              <span>{article.readingTime}</span>
            </div>
          </div>

          {/* Featured visual placeholder representing high-end editorial chart or asset */}
          <div className="w-full aspect-video bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded relative overflow-hidden flex items-center justify-center select-none">
            <span className="text-4xl font-bold font-serif opacity-10 text-neutral-600">FOREX WEEKLY ANALYTICS</span>
            {/* Draw a subtle abstract candle chart decoration */}
            <div className="absolute inset-x-0 bottom-4 height-2/3 opacity-20 flex justify-around items-end px-12 pointer-events-none">
              {[60, 80, 50, 90, 70, 110, 85, 120, 100, 140].map((h, i) => (
                <div key={i} className="flex flex-col items-center w-3">
                  <div className="w-[1px] h-6 bg-brand-red"></div>
                  <div className="w-2.5 bg-brand-red rounded-sm" style={{ height: `${h / 2}px` }}></div>
                  <div className="w-[1px] h-6 bg-brand-red"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Article Text Content */}
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-6 text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {article.content}
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Related Articles Section */}
          {related.length > 0 && (
            <div className="pt-4">
              <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white mb-4 uppercase tracking-wider">
                Related Analyses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {related.map((art) => (
                  <Link
                    key={art.id}
                    href={`/${art.category}/${art.id}`}
                    className="border border-neutral-150 dark:border-neutral-850 rounded p-4 block hover:border-neutral-350 dark:hover:border-neutral-750 hover:shadow-sm transition-all"
                  >
                    <span className="text-[9px] font-bold text-brand-red uppercase tracking-widest block mb-1">
                      {art.publishedAt}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 space-y-6">
          <AdBanner size="square" />
          
          <div className="bg-neutral-50 dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-5 text-xs">
            <h4 className="font-serif font-bold text-sm text-neutral-950 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2.5 mb-3 uppercase tracking-wider">
              Weekly Briefings
            </h4>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
              Get our weekend macroeconomic overview delivered straight to your inbox every Saturday.
            </p>
            <Link
              href="/free-assessment"
              className="block w-full text-center bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-2.5 rounded tracking-wider uppercase"
            >
              Get Free Assessment
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
