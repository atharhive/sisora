import React from "react";
import { Users, Handshake, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    title: "Buyer Outreach & Evaluation",
    description:
      "We identify qualified corporate buyers, founders, and domain investors actively looking to acquire .si assets.",
    icon: Users,
  },
  {
    title: "Professional Negotiations",
    description:
      "We manage negotiations between buyers and sellers within the authority granted to us, communicating all offers and counteroffers.",
    icon: Handshake,
  },
  {
    title: "Escrow & Closing Coordination",
    description:
      "We coordinate payment and domain transfer through licensed Escrow.com or Atom.com, ensuring zero risk of asset forfeiture.",
    icon: ShieldCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="w-full bg-[#f4f5f7] py-8 sm:py-16 lg:py-24 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-6 sm:mb-14 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Brokerage Methodology
            </span>
            <span className="text-[11px] font-medium text-neutral-400 md:hidden">
              Swipe →
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950">
            How Sisora Works
          </h2>
          <p className="mt-2 text-xs sm:text-base text-neutral-600 leading-relaxed">
            Unlike simple domain listing websites, Sisora actively manages negotiations between buyers and sellers. From initial buyer outreach to offers, counteroffers, and transaction coordination, we help both parties work toward a successful deal.
          </p>
        </div>

        {/* 3 Steps - Mobile Swipe Rail */}
        <div className="flex md:grid gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x no-scrollbar md:grid-cols-3 md:gap-6 lg:gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-4 sm:p-8 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-900 hover:shadow-lg transition-all duration-300 snap-start shrink-0 w-[240px] md:w-auto"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors">
                      Phase 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-xl font-bold text-neutral-950 mb-1.5 sm:mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-[11px] sm:text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
