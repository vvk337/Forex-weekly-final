"use client";

import React, { useState } from "react";

export default function FreeAssessmentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    asset: "",
    volume: "",
  });
  const [completed, setCompleted] = useState(false);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompleted(true);
  };

  const getRecommendation = () => {
    if (formData.experience === "Beginner") {
      return {
        title: "Standard STP Account (Commission-Free)",
        desc: "Since you are starting out, we recommend a standard straight-through processing (STP) account. It avoids complex commission equations, offering all-inclusive spreads. Focus on risk management with smaller micro-lots (0.01).",
        leverage: "1:30 to 1:100 recommended",
      };
    }
    if (formData.volume === "Over $250k") {
      return {
        title: "Raw Spread ECN Account + VPS Hosting",
        desc: "Based on your high monthly volume and professional background, your priority is minimizing execution cost. We recommend an ECN account with $0.0 spreads and flat commission rate ($2.0/lot). Utilize VPS hosting to reduce slippage.",
        leverage: "1:100 to 1:500 recommended",
      };
    }
    return {
      title: "Variable Spread ECN Account",
      desc: "An optimal balance for active traders. You will receive narrow spreads (averaging 0.2 pips on EUR/USD) with a minor commission. Great for swing trading majors and minors.",
      leverage: "1:100 recommended",
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-brand-dark-card border border-neutral-200 dark:border-neutral-800 rounded p-8 shadow-sm transition-colors duration-300">
      {/* Header */}
      <div className="text-center border-b border-neutral-100 dark:border-neutral-800 pb-5 mb-6">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-red">Trader Audit</span>
        <h1 className="font-serif font-bold text-2xl text-brand-dark dark:text-white mt-1">
          Trader Profile Assessment
        </h1>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5">
          Find your optimal account parameters and execution setup in 2 minutes.
        </p>
      </div>

      {!completed ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-400">
            <span>Question {step} of 3</span>
            <div className="flex space-x-1">
              <span className={`h-1.5 w-6 rounded-sm ${step >= 1 ? "bg-brand-red" : "bg-neutral-200 dark:bg-neutral-800"}`}></span>
              <span className={`h-1.5 w-6 rounded-sm ${step >= 2 ? "bg-brand-red" : "bg-neutral-200 dark:bg-neutral-800"}`}></span>
              <span className={`h-1.5 w-6 rounded-sm ${step >= 3 ? "bg-brand-red" : "bg-neutral-200 dark:bg-neutral-800"}`}></span>
            </div>
          </div>

          {/* STEP 1: Personal info */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">Professional Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Trading Background */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">What is your current trading experience?</label>
                <div className="grid grid-cols-3 gap-2.5 text-xs font-semibold">
                  {["Beginner", "Intermediate", "Professional"].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setFormData({ ...formData, experience: exp })}
                      className={`py-3.5 border rounded text-center cursor-pointer transition-all ${
                        formData.experience === exp
                          ? "border-brand-red bg-brand-red/5 text-brand-red"
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">What is your primary trading asset class?</label>
                <select
                  required
                  value={formData.asset}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-4 py-2.5 text-xs text-brand-dark dark:text-white focus:outline-none focus:border-brand-red transition-colors"
                >
                  <option value="">Select Asset Class</option>
                  <option value="Major FX">Major Forex Pairs (EUR/USD, GBP/USD)</option>
                  <option value="Exotics">Minor/Exotic Pairs</option>
                  <option value="Commodities">Gold, Silver & Energies</option>
                  <option value="Indices">Indices (S&P 500, Nasdaq)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Volumes */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">What is your estimated monthly trading volume?</label>
                <div className="space-y-2 text-xs font-semibold">
                  {["Under $50,000", "$50,000 - $250,000", "Over $250,000"].map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setFormData({ ...formData, volume: vol })}
                      className={`w-full py-3.5 border rounded px-4 text-left cursor-pointer transition-all flex justify-between items-center ${
                        formData.volume === vol
                          ? "border-brand-red bg-brand-red/5 text-brand-red"
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <span>{vol}</span>
                      {formData.volume === vol && <span className="text-brand-red">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-500 hover:text-brand-dark dark:hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={step === 1 && (!formData.name || !formData.email)}
                onClick={nextStep}
                className="px-6 py-2.5 bg-brand-dark hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={!formData.volume}
                className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 cursor-pointer animate-pulse"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </form>
      ) : (
        /* Completion Results screen */
        <div className="text-center space-y-5 animate-scaleUp">
          <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-500">Audit Successful</h3>
            <h2 className="font-serif font-bold text-xl text-neutral-900 dark:text-white mt-1">
              Assessment Results For {formData.name}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">{formData.email}</p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded p-5 bg-neutral-50 dark:bg-neutral-900 text-left mt-6">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand-red block mb-1">
              Account Strategy
            </span>
            <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
              {recommendation.title}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
              {recommendation.desc}
            </p>
            <div className="mt-4 pt-3.5 border-t border-neutral-200/50 dark:border-neutral-800/50 flex justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>Risk Profile: {formData.experience}</span>
              <span className="text-neutral-800 dark:text-neutral-200">{recommendation.leverage}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCompleted(false);
              setStep(1);
              setFormData({ name: "", email: "", experience: "", asset: "", volume: "" });
            }}
            className="text-xs font-bold text-brand-red hover:underline pt-3 cursor-pointer block mx-auto"
          >
            Start New Assessment
          </button>
        </div>
      )}
    </div>
  );
}
