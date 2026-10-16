"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Lock, Zap, Globe2 } from "lucide-react";

const SPECIALIZATIONS = [
  {
    title: "Specialized in .si Domains",
    description: "Exclusive focus and deep liquidity insights within the .si ccTLD and Super Intelligence space.",
    icon: ShieldCheck,
  },
  {
    title: "Investor to Investor Transactions",
    description: "Connecting verified domain investors and portfolios directly for seamless wholesale and secondary trades.",
    icon: Users,
  },
  {
    title: "Confidential & Professional Service",
    description: "Every negotiation is conducted with strict bilateral privacy and seasoned brokerage decorum.",
    icon: Lock,
  },
  {
    title: "Fast and Secure Transaction",
    description: "Ironclad settlement coordination via licensed third-party escrow on Escrow.com and Atom.com.",
    icon: Zap,
  },
  {
    title: "Global Investor or Buyer Network",
    description: "Direct access to multinational end-users, family offices, and tech syndicates worldwide.",
    icon: Globe2,
  },
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f4f5f7] border-b border-neutral-200/80">
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
        {/* Top Badge */}
        <div className="flex items-center justify-start mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-neutral-800 uppercase shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SISORA: A .SI DOMAIN BROKERAGE</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-neutral-950 leading-[1.08] text-balance">
              Sisora: A Dedicated Brokerage for <span className="underline decoration-neutral-300 decoration-4 underline-offset-8">.SI Domains</span>
            </h1>

            {/* Subtitle verbatim from PDF */}
            <p className="max-w-2xl text-xs sm:text-base lg:text-xl text-neutral-600 leading-relaxed font-normal">
              Sisora is a dedicated brokerage connecting .si domain investors to buy and sell domain names. We manage negotiations between buyers and sellers, helping turn opportunities into completed transactions.
            </p>

            {/* Dual Primary Buttons verbatim from PDF - compact side-by-side on mobile */}
            <div className="pt-2 flex flex-row items-center gap-2.5 sm:gap-4">
              <Link
                href="/buy-domains"
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl bg-neutral-950 px-4 py-3 sm:px-7 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95"
              >
                <span>Looking to Buy</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell-domains"
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl border border-neutral-300 bg-white px-4 py-3 sm:px-7 sm:py-4 text-xs sm:text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50 hover:border-neutral-900 active:scale-95"
              >
                <span>Looking to Sell</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column Quick Highlight - Visible on large screens */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end">
            <div className="p-6 rounded-2xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Market Specialization
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Active Brokerage
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black tracking-tight">
                  .SI DIGITAL ASSETS
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Premier Central European ccTLD &amp; global Super Intelligence keyword assets ready for immediate acquisition.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-neutral-300 font-mono">
                <span>Coordination:</span>
                <span className="text-white font-bold">Escrow.com &amp; Atom</span>
              </div>
            </div>
          </div>
        </div>

        {/* OUR SPECIALIZATION (Verbatim from PDF) - Mobile Swipe Rail */}
        <div className="mt-8 sm:mt-16 pt-6 sm:pt-10 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                Core Capabilities
              </span>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950">
                Our Specialization
              </h2>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 sm:hidden">
              Swipe →
            </span>
          </div>

          <div className="flex sm:grid gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x no-scrollbar sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SPECIALIZATIONS.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-900 hover:shadow-md transition-all duration-200 snap-start shrink-0 w-[210px] sm:w-auto"
                >
                  <div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 mb-1 leading-snug">
                      {spec.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
