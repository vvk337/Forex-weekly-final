export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'weekly-updates' | 'daily-feed' | 'global-events' | 'forex' | 'learn-forex';
  publishedAt: string;
  author: string;
  readingTime: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface ForexQuote {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  trend: 'up' | 'down';
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export const mockBreakingNews = [
  "US Inflation Data (CPI) drops to 2.8%, increasing chances of Federal Reserve interest rate cut in September.",
  "ECB maintains rates but hints at policy easing as Eurozone economic activity slows down.",
  "GBP/USD rallies to 1.3150 following positive UK retail sales report.",
  "Gold hits new historic high at $2,480/oz amid escalating global geopolitical tensions.",
  "Japan's inflation rises to 2.5%, mounting pressure on Bank of Japan to hike interest rates."
];

export const mockForexQuotes: ForexQuote[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: "1.0924", change: "+0.0035", changePercent: "+0.32%", trend: "up" },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", price: "1.2842", change: "+0.0056", changePercent: "+0.44%", trend: "up" },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", price: "154.68", change: "-0.82", changePercent: "-0.53%", trend: "down" },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", price: "0.6654", change: "-0.0012", changePercent: "-0.18%", trend: "down" },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", price: "0.8845", change: "-0.0028", changePercent: "-0.32%", trend: "down" },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen", price: "198.64", change: "-0.24", changePercent: "-0.12%", trend: "down" }
];

export const mockEconomicEvents: EconomicEvent[] = [
  { id: "1", time: "12:00 PM", currency: "GBP", event: "BoJ Interest Rate Decision", importance: "high", actual: "0.25%", forecast: "0.25%", previous: "0.10%" },
  { id: "2", time: "02:30 PM", currency: "EUR", event: "German GDP (QoQ) (Q2)", importance: "medium", actual: "-0.1%", forecast: "0.1%", previous: "0.2%" },
  { id: "3", time: "06:00 PM", currency: "USD", event: "Core CPI (MoM) (Jul)", importance: "high", actual: "0.2%", forecast: "0.2%", previous: "0.1%" },
  { id: "4", time: "06:00 PM", currency: "USD", event: "CPI (YoY) (Jul)", importance: "high", actual: "2.9%", forecast: "3.0%", previous: "3.0%" },
  { id: "5", time: "07:30 PM", currency: "CAD", event: "Retail Sales (MoM) (Jun)", importance: "medium", actual: "0.4%", forecast: "-0.2%", previous: "-0.6%" }
];

export const mockArticles: Article[] = [
  {
    id: "featured-1",
    title: "The Great Divergence: How Divergent Central Bank Policies Are Shaping Forex Trends for Q3",
    excerpt: "Federal Reserve hints at interest rate cuts while the European Central Bank stays neutral, creating major volatility in G10 currencies. We analyze what this means for EUR/USD and GBP/USD.",
    category: "weekly-updates",
    publishedAt: "2026-07-13",
    author: "David Vance",
    readingTime: "8 min read",
    imageUrl: "/images/featured-divergence.jpg",
    isFeatured: true
  },
  {
    id: "art-1",
    title: "EUR/USD technical analysis: Bulls target 1.1000 level after strong CPI data",
    excerpt: "EUR/USD continues its upward trajectory. The technical indicators show a strong bullish momentum breakout on the daily chart as treasury yields fall.",
    category: "daily-feed",
    publishedAt: "2026-07-13",
    author: "Elena Rostova",
    readingTime: "4 min read",
    imageUrl: "/images/eur-usd-chart.jpg"
  },
  {
    id: "art-2",
    title: "BoJ interest rate hike signals: Will the Yen finally recover?",
    excerpt: "The Bank of Japan raised its interest rates to 0.25% in a surprise move. We look at the long-term impact on carry trades and USD/JPY currency pairs.",
    category: "forex",
    publishedAt: "2026-07-12",
    author: "Kenji Sato",
    readingTime: "6 min read",
    imageUrl: "/images/boj-yen.jpg"
  },
  {
    id: "art-3",
    title: "Understanding interest rate differentials: The cornerstone of Forex trading",
    excerpt: "A comprehensive guide to why interest rates matter, how carry trade works, and how to use central bank calendars to predict price movements.",
    category: "learn-forex",
    publishedAt: "2026-07-11",
    author: "Marcus Aurelius",
    readingTime: "12 min read",
    imageUrl: "/images/interest-rates.jpg"
  },
  {
    id: "art-4",
    title: "Geopolitical tensions escalate in the Middle East: Gold reaches record heights",
    excerpt: "Safety assets rally as global event risks increase. Gold breaks historical boundaries, while USD benefits from safe-haven flows.",
    category: "global-events",
    publishedAt: "2026-07-12",
    author: "Sarah Jenkins",
    readingTime: "5 min read",
    imageUrl: "/images/gold-record.jpg"
  },
  {
    id: "art-5",
    title: "GBP/USD targets 1.2900 resistance ahead of Bank of England minutes release",
    excerpt: "Sterling displays resilience following higher-than-expected UK service sector inflation metrics, keeping rates elevated.",
    category: "daily-feed",
    publishedAt: "2026-07-13",
    author: "Elena Rostova",
    readingTime: "3 min read",
    imageUrl: "/images/gbp-usd.jpg"
  },
  {
    id: "art-6",
    title: "How to read an economic calendar: A beginner's handbook",
    excerpt: "Learn how to filter out market noise and focus on High Impact events like CPI, Non-Farm Payrolls, and FOMC meetings.",
    category: "learn-forex",
    publishedAt: "2026-07-10",
    author: "Marcus Aurelius",
    readingTime: "7 min read",
    imageUrl: "/images/economic-calendar-guide.jpg"
  }
];
