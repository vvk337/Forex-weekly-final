import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forex Weekly | Market News, Technical Analysis & Economic Insights",
  description: "Forex Weekly is a premium market analysis platform delivering weekly updates, daily feeds, live forex charts, and global events for professional traders.",
  keywords: "Forex news, currency markets, weekly forex updates, daily technical feed, economic calendar, forex trading education",
  authors: [{ name: "Forex Weekly Editorial Board" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      >
        <body className="h-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-brand-dark text-brand-dark dark:text-neutral-205 transition-colors duration-300">
        <TopBar />
        <Header />
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
