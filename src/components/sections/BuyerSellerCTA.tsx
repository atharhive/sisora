import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck } from "lucide-react";

export function BuyerSellerCTA() {
  return (
    <section className="w-full bg-[#f4f5f7] py-16 sm:py-24 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Panel: Looking to Buy */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-12 shadow-xs flex flex-col justify-between group hover:border-neutral-900 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-neutral-500">
                LOOKING TO BUY?
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Acquire Verified .SI Digital Real Estate
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg">
                Explore verified, premium SI (Super Intelligence) and generic keyword digital real estate. All assets ready for instant acquisition through licensed Escrow.com and Atom.com.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <Link
                href="/buy-domains"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-95"
              >
                <span>Browse Domains For Sale</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
              <Link
                href="/contact?intent=buy"
                className="inline-flex items-center justify-center text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
              >
                <span>Submit Buying Request →</span>
              </Link>
            </div>
          </div>

          {/* Right Panel: Looking to Sell */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 sm:p-12 shadow-xs flex flex-col justify-between group hover:border-neutral-900 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-neutral-500">
                LOOKING TO SELL?
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Sell Your .SI Domains Through Sisora
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg">
                Let Sisora represent your domains through a focused brokerage process designed to connect you with potential investors. We handle buyer outreach and negotiations.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <Link
                href="/sell-domains"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-95"
              >
                <span>Submit Your Domains</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
              <span className="text-xs font-mono text-neutral-500 text-center sm:text-right">
                15% Success Commission
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuyerSellerCTA;
