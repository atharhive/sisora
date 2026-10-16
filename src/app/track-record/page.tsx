import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, ShieldCheck, ArrowRight, TrendingUp, History, Globe2 } from "lucide-react";
import { TrackRecordSection } from "@/components/sections/TrackRecordSection";

export const metadata: Metadata = {
  title: "Track Record & Notable Transactions | Sisora Brokerage",
  description:
    "Domain brokerage experience founded by Domingo. Notable transactions include LM.si, Need.si, LLL.coms, CVCV.com, and premium .ai domain acquisitions.",
};

const EXPANDED_EXPERIENCE = [
  {
    category: "Notable .SI Brokerage Deals",
    items: [
      {
        asset: "LM.si",
        metric: "2-Letter ccTLD",
        detail: "Private investor-to-investor acquisition of an ultra-scarce two-letter Slovenian domain asset.",
      },
      {
        asset: "Need.si",
        metric: "One-Word Dictionary",
        detail: "High-yield commercial generic asset brokered directly to a technology enterprise.",
      },
    ],
  },
  {
    category: "Broader Domain Industry Deal History",
    items: [
      {
        asset: "LLL.com Transactions",
        metric: "Liquid Global Real Estate",
        detail: "Closed several 3-letter .com transactions with leading global domain investors and investment funds.",
      },
      {
        asset: "CVCV.com & One-Word .coms",
        metric: "Tier-1 Brandables",
        detail: "High-value brand acquisitions and negotiations on prime single-word English dictionary .coms and CVCV.com patterns.",
      },
      {
        asset: "LLL.ai & One-Word .ai",
        metric: "Super Intelligence / AI",
        detail: "Structured early acquisitions of 3-letter and defining dictionary keyword assets in the artificial intelligence sector.",
      },
    ],
  },
];

export default function TrackRecordPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-900">
      {/* Header section with exact PDF text */}
      <section className="border-b border-neutral-200/80 bg-white/60 backdrop-blur-sm py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-3 shadow-2xs">
            <Award className="h-3.5 w-3.5 text-neutral-900" />
            <span>Verifiable Track Record</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight">
            Domain Brokerage Experience
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            Founded by <span className="font-semibold text-neutral-950">Domingo</span>, Sisora connects domain investors and facilitates professional negotiations in the .si domain market.
          </p>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/contact?intent=brokerage-opportunity"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
            >
              <span>Discuss a Brokerage Opportunity →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded Main Track Record Section */}
      <TrackRecordSection />

      {/* Expanded Industry Depth Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="max-w-3xl mb-6 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Global Industry Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Domingo&apos;s Domain Industry Authority
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Domingo is one of the most active dealmakers in the secondary domain market, having closed multiple LLL.com transactions, CVCV.coms, single-word .coms, and LLL.ai assets before founding Sisora to lead the .si market.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {EXPANDED_EXPERIENCE.map((group, idx) => (
            <div key={idx} className="space-y-3 sm:space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-2">
                {group.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5 sm:mb-2">
                        {item.metric}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold text-neutral-950 mb-1.5 sm:mb-2">
                        {item.asset}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Verbatim Footnote */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl border border-neutral-200/80 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-neutral-500 italic">
            These represent Domingo’s previous brokerage transactions. More deals will be added as Sisora grows.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-950 hover:underline shrink-0"
          >
            <span>Partner with Domingo on .SI deals →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
