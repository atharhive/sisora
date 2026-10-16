import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe2,
  ShieldCheck,
  Award,
  ArrowRight,
  Target,
  Eye,
  User,
  CheckCircle2,
} from "lucide-react";
import { TrackRecordSection } from "@/components/sections/TrackRecordSection";

export const metadata: Metadata = {
  title: "About Sisora | A Dedicated Brokerage for .SI Domain Investors",
  description:
    "Founded by Domingo. Built for .SI domain investors. Sisora actively manages negotiations between buyers and sellers, from initial buyer outreach to transaction coordination.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-900">
      {/* Header section with exact PDF text */}
      <section className="border-b border-neutral-200/80 bg-white/60 backdrop-blur-sm py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-3 shadow-2xs">
            <span>Specialized Domain Brokerage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight">
            A Dedicated Brokerage for .SI Domain Investors
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Founded by <span className="font-semibold text-neutral-950">Domingo</span>. Built for .SI domain investors.
          </p>
        </div>
      </section>

      {/* Core Narrative verbatim from PDF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 border-b border-neutral-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-snug">
              Built Exclusively for the .SI Domain Market
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              Sisora was founded by Domingo with a clear objective: to build a specialized brokerage focused exclusively on .si domain names.
            </p>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              The platform is designed primarily for domain investors looking to acquire or sell names within the .si market.
            </p>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              Unlike a simple domain listing website, Sisora actively manages negotiations between buyers and sellers. From initial buyer outreach to offers, counteroffers, and transaction coordination, we help both parties work toward a successful deal.
            </p>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              Our approach emphasizes quality inventory, professional communication, transparent brokerage terms, and a straightforward closing process.
            </p>
          </div>

          {/* Mission & Vision Cards (verbatim from PDF) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
            {/* Our Mission */}
            <div className="p-5 sm:p-7 rounded-2xl border border-neutral-200/80 bg-white shadow-xs hover:border-neutral-900 transition-colors">
              <div className="flex items-center gap-2.5 mb-2.5 text-neutral-950">
                <div className="h-8 w-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Target className="h-4 w-4" />
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">Our Mission</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To connect .si domain investors and facilitate domain transactions through professional brokerage and negotiation.
              </p>
            </div>

            {/* Our Vision */}
            <div className="p-5 sm:p-7 rounded-2xl border border-neutral-200/80 bg-white shadow-xs hover:border-neutral-900 transition-colors">
              <div className="flex items-center gap-2.5 mb-2.5 text-neutral-950">
                <div className="h-8 w-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Eye className="h-4 w-4" />
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">Our Vision</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To establish Sisora as a recognized specialist in investor-to-investor .si domain brokerage.
              </p>
              <div className="mt-3 pt-2.5 border-t border-neutral-200/80 text-[11px] font-bold text-neutral-900">
                Founded by Domingo. Built for .SI domain investors.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is Domingo (Verbatim from PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 border-b border-neutral-200/80">
        <div className="rounded-3xl border border-neutral-200/80 bg-white shadow-sm p-6 sm:p-12">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 shadow-2xs">
              <User className="h-3.5 w-3.5 text-neutral-900" />
              <span>Founder Profile</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              Who Is Domingo
            </h2>

            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal">
              He is one of the most active guys in the domain industry, having closed several LLL.com deals and worked with some of the world’s top domain investors on LLL.coms, CVCV.com, One word .coms, LLL.ai, One word .ai names and many more, among many others. Recently, he has also been involved in deals involving .si domains like LM.si, Need.si, and more.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/track-record"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-95"
              >
                <span>View Notable Transactions</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-neutral-900 hover:bg-neutral-100 transition-all active:scale-95"
              >
                <span>Connect with Domingo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Track Record */}
      <TrackRecordSection />
    </div>
  );
}
