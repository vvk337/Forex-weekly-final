import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyJWT } from "@/lib/auth";

// Cache variables for live RSS feed
let cachedHeadlines: string[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper to check if request is authenticated as admin
async function isAuthenticated(request: Request) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("admin_token="))
    ?.split("=")[1];

  if (!token) return false;
  const decoded = await verifyJWT(token);
  return !!decoded;
}

// Simple regex XML parser for RSS headlines
function parseRSSHeadlines(xmlText: string): string[] {
  const headlines: string[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;
  
  while ((itemMatch = itemRegex.exec(xmlText)) !== null && headlines.length < 8) {
    const itemContent = itemMatch[1];
    const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/;
    const titleMatch = itemContent.match(titleRegex);
    if (titleMatch && titleMatch[1]) {
      const cleanTitle = titleMatch[1]
        .trim()
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/<!\[CDATA\[/g, "")
        .replace(/\]\]>/g, "");
        
      if (cleanTitle && !cleanTitle.includes("Yahoo") && !cleanTitle.includes("Yahoo Finance")) {
        headlines.push(cleanTitle);
      }
    }
  }
  return headlines;
}

// Auto-seed/find configuration
async function getOrCreateConfig() {
  let config = await prisma.tickerConfig.findUnique({
    where: { id: "ticker" },
  });

  if (!config) {
    const initialText = JSON.stringify([
      { text: "ALERT: Federal Reserve hints at near-term interest rate cuts", expiryOption: "infinity", expiresAt: null },
      { text: "EUR/USD hits new monthly highs as dollar softens", expiryOption: "infinity", expiresAt: null },
      { text: "Gold spikes past $2,400 on geopolitical safe-haven demands", expiryOption: "infinity", expiresAt: null },
      { text: "S&P 500 futures rise early before inflation updates", expiryOption: "infinity", expiresAt: null }
    ]);
    config = await prisma.tickerConfig.create({
      data: {
        id: "ticker",
        mode: "auto",
        manualText: initialText,
      },
    });
  }
  return config;
}

// GET latest ticker headlines
export async function GET() {
  try {
    const config = await getOrCreateConfig();
    
    // Parse manual headlines
    let manualItems: any[] = [];
    try {
      if (config.manualText.trim().startsWith("[")) {
        manualItems = JSON.parse(config.manualText);
      } else {
        // Fallback migration for old format
        manualItems = config.manualText
          .split("|")
          .map((text) => ({
            text: text.trim(),
            expiryOption: "infinity",
            expiresAt: null,
          }))
          .filter((item) => item.text.length > 0);
      }
    } catch (e) {
      console.error("Error parsing manual headlines:", e);
    }

    // Filter out expired items
    const now = Date.now();
    const activeManualItems = manualItems.filter((item) => {
      if (item.expiresAt === null) return true;
      return item.expiresAt > now;
    });

    const manualHeadlines = activeManualItems.map((item) => item.text);

    // If mode is manual and we have active headlines, return them
    if (config.mode === "manual" && manualHeadlines.length > 0) {
      return NextResponse.json({ mode: "manual", headlines: manualHeadlines, manualText: config.manualText }, { status: 200 });
    }

    // If mode is manual but all manual items have expired, fall back to auto-pilot RSS feed
    const isFallbackMode = config.mode === "manual" && manualHeadlines.length === 0;

    // Auto Mode: check cache first
    if (cachedHeadlines.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json({ 
        mode: isFallbackMode ? "manual" : "auto", 
        headlines: cachedHeadlines, 
        manualText: config.manualText,
        isExpiredFallback: isFallbackMode
      }, { status: 200 });
    }

    // Fetch fresh headlines from Yahoo Finance RSS
    try {
      const response = await fetch("https://finance.yahoo.com/news/rss", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 300 },
      });

      if (response.ok) {
        const xmlText = await response.text();
        const parsed = parseRSSHeadlines(xmlText);

        if (parsed.length > 0) {
          cachedHeadlines = parsed;
          cacheTimestamp = now;
          return NextResponse.json({ 
            mode: isFallbackMode ? "manual" : "auto", 
            headlines: parsed, 
            manualText: config.manualText,
            isExpiredFallback: isFallbackMode
          }, { status: 200 });
        }
      }
    } catch (fetchErr) {
      console.error("RSS fetch error:", fetchErr);
    }

    // Fallback if RSS fetch fails entirely
    const fallbackManual = manualHeadlines.length > 0 ? manualHeadlines : ["ALERT: Real-time financial briefing ticker active"];
    return NextResponse.json({ 
      mode: config.mode, 
      headlines: fallbackManual, 
      manualText: config.manualText,
      isFallback: true 
    }, { status: 200 });

  } catch (error) {
    console.error("GET Breaking News Error:", error);
    return NextResponse.json({ error: "Failed to load breaking news" }, { status: 500 });
  }
}

// PUT update config settings
export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mode, manualText } = body;

    if (!mode || (mode !== "auto" && mode !== "manual")) {
      return NextResponse.json({ error: "Invalid ticker mode (must be 'auto' or 'manual')" }, { status: 400 });
    }

    // Upsert the configuration record
    const updated = await prisma.tickerConfig.upsert({
      where: { id: "ticker" },
      update: {
        mode,
        manualText: manualText !== undefined ? manualText : "[]",
      },
      create: {
        id: "ticker",
        mode,
        manualText: manualText !== undefined ? manualText : "[]",
      },
    });

    // Invalidate the cache to ensure updates are immediate
    cachedHeadlines = [];
    cacheTimestamp = 0;

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Ticker Config Error:", error);
    return NextResponse.json({ error: "Failed to save ticker configuration" }, { status: 500 });
  }
}
