"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Compliance</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400 mt-1">Last Updated: July 13, 2026</p>
      </div>

      <div className="prose dark:prose-invert text-xs md:text-sm leading-relaxed space-y-6 text-neutral-700 dark:text-neutral-300">
        <p>
          At Forex Weekly, accessible from www.forexweekly.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Forex Weekly and how we use it.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">Log Files</h3>
        <p>
          Forex Weekly follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">Cookies and Web Beacons</h3>
        <p>
          Like any other website, Forex Weekly uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">Advertising Partners Privacy Policies</h3>
        <p>
          Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Forex Weekly, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>

        <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white pt-2">Consent</h3>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </div>
  );
}
