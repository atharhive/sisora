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

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        {/* Top Badge */}
        <div className="flex items-center justify-start mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-[11px] font-bold tracking-wider text-neutral-800 uppercase shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SISORA: A .SI DOMAIN BROKERAGE</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 space-y-6">
            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-950 leading-[1.05] text-balance">
              Sisora: A Dedicated Brokerage for <span className="underline decoration-neutral-300 decoration-4 underline-offset-8">.SI Domains</span>
            </h1>

            {/* Subtitle verbatim from PDF */}
            <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed font-normal">
              Sisora is a dedicated brokerage connecting .si domain investors to buy and sell domain names. We manage negotiations between buyers and sellers, helping turn opportunities into completed transactions.
            </p>

            {/* Dual Primary Buttons verbatim from PDF */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/buy-domains"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-neutral-950 px-7 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95"
              >
                <span>I&apos;m Looking to Buy</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell-domains"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-7 py-4 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-50 hover:border-neutral-900 active:scale-95"
              >
                <span>I&apos;m Looking to Sell</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column Quick Highlight */}
          <div className="lg:col-span-4 flex flex-col justify-end">
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

        {/* OUR SPECIALIZATION (Verbatim from PDF) */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
              Our Specialization
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {SPECIALIZATIONS.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-900 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-neutral-950 mb-1.5 leading-snug">
                      {spec.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
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
