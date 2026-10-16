import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Award, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";

const NOTABLE_TRANSACTIONS = [
  {
    domain: "LM.si",
    type: "2-Letter Premium .SI",
    description: "Ultra-rare two-letter ccTLD brokered directly between domain investors.",
    tag: "Completed Deal",
  },
  {
    domain: "Need.si",
    type: "One-Word Dictionary .SI",
    description: "High-value English generic dictionary asset acquired through private brokerage.",
    tag: "Completed Deal",
  },
];

export function TrackRecordSection() {
  return (
    <section className="w-full bg-[#f4f5f7] py-16 sm:py-24 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Experience & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 shadow-2xs">
              <Award className="h-3.5 w-3.5 text-neutral-900" />
              <span>Track Record</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 leading-[1.1]">
              Domain Brokerage Experience
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
              Founded by <span className="font-semibold text-neutral-950">Domingo</span>, Sisora connects domain investors and facilitates professional negotiations in the .si domain market.
            </p>

            <p className="text-sm text-neutral-500 leading-relaxed">
              With extensive experience closing high-value secondary deals across LLL.coms, CVCV.com, one-word .coms, and .ai assets, Domingo brings deep domain industry relationships and disciplined closing processes to .si domain investors.
            </p>

            <div className="pt-2">
              <Link
                href="/contact?intent=brokerage"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
              >
                <span>Discuss a Brokerage Opportunity</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Notable Transactions Cards */}
          <div className="lg:col-span-6 space-y-5">
            <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Notable Transactions
              </span>
              <span className="text-xs font-mono font-medium text-neutral-400">
                Verified Brokerage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {NOTABLE_TRANSACTIONS.map((item, idx) => (
                  <div
                    key={idx}
                    className="group p-6 rounded-2xl border border-neutral-200/80 bg-white shadow-xs hover:border-neutral-900 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black tracking-tight text-neutral-950 group-hover:text-neutral-700 transition-colors">
                      {item.domain}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mt-1">
                      {item.type}
                    </p>
                    <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-neutral-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-neutral-900" />
                    <span>Brokered by Domingo</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verbatim footnote from PDF */}
            <p className="text-xs text-neutral-400 italic pt-2">
              These represent Domingo’s previous brokerage transactions. More deals will be added as Sisora grows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackRecordSection;
