"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 mb-8">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Support & Queries</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mt-1">
          Contact Us
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl">
          For editorial inquiries, premium broker sponsorships, API data licensing, or general help, get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-6">
          <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-white mb-4">Send a Message</h3>
          
          {sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded text-xs font-bold">
              Message received. Our editorial team will review and reply within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3.5 py-2 text-xs focus:outline-none focus:border-brand-red transition-colors text-brand-dark dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3.5 py-2 text-xs focus:outline-none focus:border-brand-red transition-colors text-brand-dark dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3.5 py-2 text-xs focus:outline-none focus:border-brand-red transition-colors text-brand-dark dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-brand-red transition-colors text-brand-dark dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-sm transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Corporate details */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900 rounded p-6">
            <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-200 mb-2">Editorial Desk</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              If you have tip-offs, central bank leak transcripts, or market commentary proposals:
            </p>
            <a href="mailto:editor@forexweekly.com" className="text-brand-red hover:underline text-xs font-bold block mt-2">
              editor@forexweekly.com
            </a>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900 rounded p-6">
            <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-200 mb-2">Sponsorships & Partners</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              For brokerage banner integrations, custom widget sponsorships, or co-branded reports:
            </p>
            <a href="mailto:partners@forexweekly.com" className="text-brand-red hover:underline text-xs font-bold block mt-2">
              partners@forexweekly.com
            </a>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-900 rounded p-6 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-200 mb-2">Office Headquarters</h4>
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">Forex Weekly Media Group Ltd.</p>
            <p>12 Wall Street, Financial District</p>
            <p>New York, NY 10005, United States</p>
            <p className="pt-2">Registration No: NY-928420-B</p>
          </div>
        </div>
      </div>
    </div>
  );
}
