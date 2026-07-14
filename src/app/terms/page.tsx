"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Terms of Service</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Last Updated: July 13, 2026</p>
      </div>

      <div className="prose dark:prose-invert text-xs md:text-sm leading-relaxed space-y-6 text-neutral-700 dark:text-neutral-300">
        <p>
          Welcome to Forex Weekly. These terms and conditions outline the rules and regulations for the use of Forex Weekly Media Group's Website, located at www.forexweekly.com.
        </p>

        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Forex Weekly if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">License & Content Usage</h3>
        <p>
          Unless otherwise stated, Forex Weekly Media Group and/or its licensors own the intellectual property rights for all material on Forex Weekly. All intellectual property rights are reserved. You may access this from Forex Weekly for your own personal use subjected to restrictions set in these terms and conditions.
        </p>

        <p className="font-semibold">You must not:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Republish material from Forex Weekly without explicit citation links.</li>
          <li>Sell, rent or sub-license material from Forex Weekly.</li>
          <li>Reproduce, duplicate or copy material from Forex Weekly for commercial feeds.</li>
          <li>Redistribute content from Forex Weekly (unless content is specifically made for redistribution).</li>
        </ul>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">Disclaimer of Investment Advice</h3>
        <p>
          The information provided on this website is for educational and news reporting purposes only. It does not constitute investment advice, financial advice, trading advice, or any other sort of advice and you should not treat any of the website's content as such. Forex Weekly does not recommend that any currency should be bought, sold, or held by you. Do conduct your own due diligence and consult your financial advisor before making any investment decisions.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">Liability Limitations</h3>
        <p>
          We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
        </p>
      </div>
    </div>
  );
}
