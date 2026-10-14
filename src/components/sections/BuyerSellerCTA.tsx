import React from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export function BuyerSellerCTA() {
  return (
    <section className="w-full bg-neutral-950 py-16 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Panel: Looking to Buy */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 sm:p-12 shadow-xl flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            {/* Globe Watermark */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 text-white/5 transition-transform duration-500 group-hover:scale-105">
              <Globe className="h-64 w-64" strokeWidth={1} />
            </div>

            <div className="relative z-10 space-y-4">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-neutral-400">
                LOOKING TO BUY?
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Find the Right .SI Domain for Your Next Acquisition
              </h3>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg">
                Whether looking for a short brandable asset, an exact-match dictionary word,
                or a confidential off-market deal, our brokerage team sources and negotiates
                on your behalf.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-neutral-800">
              <Link
                href="/for-investors"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.98]"
              >
                <span>Submit Buying Request</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Looking to Sell */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 sm:p-12 shadow-xl flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            {/* .SI Badge Watermark */}
            <div className="pointer-events-none absolute -bottom-8 -right-4 select-none font-mono font-black text-white/5 text-[140px] leading-none transition-transform duration-500 group-hover:scale-105">
              .SI
            </div>

            <div className="relative z-10 space-y-4">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-neutral-400">
                LOOKING TO SELL?
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Have .SI Domains to Sell? Let&apos;s Discuss.
              </h3>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg">
                Maximize the value of your .SI portfolio. We connect reputable domain
                sellers with motivated European and international buyers looking for
                tier-1 domain names.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-neutral-800">
              <Link
                href="/sell-domains"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.98]"
              >
                <span>Submit Your Domains</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuyerSellerCTA;
