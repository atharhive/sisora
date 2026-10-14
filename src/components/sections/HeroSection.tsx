import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Users, Lock, Globe2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Background Scenic Landscape with Smooth Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/hero-mountains.jpg"
          alt="Slovenia Lake Bled Julian Alps"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-right"
        />
        {/* Soft light-to-transparent gradient across the left and bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:via-white/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Heading, Subtitle, CTAs, Feature Pills */}
          <div className="lg:col-span-7 xl:col-span-8 text-left space-y-6">
            {/* Top Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-700 backdrop-blur-xs shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              <span>PREMIUM .SI DOMAIN BROKERAGE</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[1.12]">
              A Dedicated Brokerage for{" "}
              <span className="text-neutral-950">.SI Domains</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-sm sm:text-base lg:text-lg text-neutral-700 leading-relaxed font-normal">
              Connecting .SI domain investors through professional brokerage,
              targeted buyer outreach, and secure transactions.
            </p>

            {/* Dual CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/buy-domains"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
              >
                <span>I&apos;m Looking to Buy</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sell-domains"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-400 bg-white/90 px-6 py-3 text-sm font-semibold text-neutral-900 backdrop-blur-xs transition-all hover:bg-neutral-100 hover:border-black active:scale-[0.98]"
              >
                <span>I&apos;m Looking to Sell</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-neutral-200/80 flex flex-wrap gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                <span>Specialized in .si domains</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-2xs backdrop-blur-xs">
                <Users className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                <span>Investor to Investor Transactions</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-2xs backdrop-blur-xs">
                <Lock className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                <span>Confidential &amp; Professional Service</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-2xs backdrop-blur-xs">
                <Globe2 className="h-3.5 w-3.5 text-neutral-900 shrink-0" />
                <span>Global Investor Network</span>
              </div>
            </div>
          </div>

          {/* Right Column: In Image 1, Lake Bled is featured, with .SI badge overlay at the bottom right */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-end items-end h-full">
            <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-white/40 bg-black/40 px-6 py-4 backdrop-blur-md shadow-2xl text-white">
              <span className="text-5xl font-black tracking-tight text-white drop-shadow-md">
                .SI
              </span>
              <div className="text-left border-l border-white/30 pl-3">
                <p className="text-[11px] font-black tracking-wider uppercase leading-tight text-white">
                  SMALL EXTENSION.
                </p>
                <p className="text-[11px] font-black tracking-wider uppercase leading-tight text-neutral-200">
                  BIG OPPORTUNITIES.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
