"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function EscrowEstimator() {
  const [dealValue, setDealValue] = useState<number>(24995);

  const commissionRate = 0.15;
  const commission = Math.round(dealValue * commissionRate);
  // Escrow.com standard rate ~3.25% or flat scale
  const estimatedEscrow = Math.round(dealValue * 0.032);
  const netSeller = dealValue - commission;

  return (
    <section className="w-full bg-neutral-950 text-white py-8 sm:py-16 lg:py-24 border-b border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Context & Terms */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-300">
              <Calculator className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-400" />
              <span>Interactive Deal Calculator</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Transparent 15% Brokerage &amp; Escrow Estimator
            </h2>

            <p className="text-xs sm:text-base text-neutral-400 leading-relaxed">
              We operate with absolute transparency. Review the exact financial breakdown of your prospective .SI transaction before signing a brokerage agreement.
            </p>

            <div className="hidden sm:block space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>15% standard success commission on completed sales</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero upfront fees; 90-day exclusive representation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Neutral escrow transfer via licensed Escrow.com or Atom.com</span>
              </div>
            </div>

            <div className="pt-1 sm:pt-2">
              <Link
                href="/sell-domains"
                className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
              >
                <span>Read Full Brokerage Terms</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Interactive Tool Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-900/90 p-4 sm:p-10 shadow-2xl space-y-5 sm:space-y-8">
              {/* Slider & Value Display */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-2 sm:mb-3">
                  <label htmlFor="deal-slider" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Target Domain Valuation
                  </label>
                  <span className="text-xl sm:text-3xl font-mono font-black text-white">
                    {formatPrice(dealValue)}
                  </span>
                </div>

                <input
                  id="deal-slider"
                  type="range"
                  min={5000}
                  max={250000}
                  step={1000}
                  value={dealValue}
                  onChange={(e) => setDealValue(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                />

                {/* Preset quick buttons */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                  {[10000, 24995, 50000, 150000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDealValue(preset)}
                      className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded transition-colors ${
                        dealValue === preset
                          ? "bg-white text-black font-bold"
                          : "bg-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {formatPrice(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breakdown Grid - 3-column row on mobile */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-neutral-800">
                <div className="p-2.5 sm:p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5 sm:mb-1">
                    Fee (15%)
                  </span>
                  <span className="text-xs sm:text-lg font-mono font-bold text-neutral-300">
                    {formatPrice(commission)}
                  </span>
                </div>

                <div className="p-2.5 sm:p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5 sm:mb-1">
                    Est. Escrow
                  </span>
                  <span className="text-xs sm:text-lg font-mono font-bold text-neutral-400">
                    ~{formatPrice(estimatedEscrow)}
                  </span>
                </div>

                <div className="p-2.5 sm:p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                  <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5 sm:mb-1">
                    Net Payout
                  </span>
                  <span className="text-xs sm:text-lg font-mono font-black text-emerald-400">
                    {formatPrice(netSeller)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1 sm:pt-2">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Lock className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span>Subject to executed bilateral agreement</span>
                </div>

                <Link
                  href={`/contact?intent=valuation&amount=${dealValue}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-black hover:bg-neutral-100 transition-all active:scale-95 shadow-xs"
                >
                  <span>Submit for Representation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EscrowEstimator;
