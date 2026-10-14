import type { Metadata } from "next";
import { Target, Briefcase, Lock, ShieldCheck, CheckCircle2, DollarSign } from "lucide-react";
import { SellDomainForm } from "@/components/forms/SellDomainForm";

export const metadata: Metadata = {
  title: "Sell Your .SI Domains | SISORA Brokerage",
  description:
    "Monetize and liquidate high-value .SI domains. Professional representation, targeted buyer outreach, and guaranteed escrow protection.",
};

const benefits = [
  {
    title: "Targeted Buyer Outreach",
    description:
      "We identify and contact qualified corporate end-users, industry leaders, and institutional investors actively seeking high-value Slovenian digital real estate.",
    icon: Target,
  },
  {
    title: "Professional Representation",
    description:
      "Our senior domain brokers lead high-stakes negotiations, eliminate bad-faith lowballers, and defend premium asset valuations on your terms.",
    icon: Briefcase,
  },
  {
    title: "Confidential Process",
    description:
      "Protect your market standing and digital holdings. We execute discreet private sales backed by binding Non-Disclosure Agreements (NDAs).",
    icon: Lock,
  },
  {
    title: "Domain Naming Rights & Escrow",
    description:
      "No risk of asset forfeiture. Buyer funds are locked into licensed escrow before you release authorization codes or transfer registry control.",
    icon: ShieldCheck,
  },
];

export default function SellDomainsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header section */}
      <section className="border-b border-zinc-900 bg-zinc-950/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <DollarSign className="w-4 h-4" />
            <span>Maximize Digital Asset Value</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Sell Your .SI Domains
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Partner with the dedicated .SI brokerage specialists. We turn dormant digital assets into high-yield liquidity with zero upfront fees.
          </p>
        </div>
      </section>

      {/* Two-Column Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Benefits & Trust points (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Why Broker With SISORA?
              </h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Selling a premium domain name requires specialized market knowledge and access to capitalized corporate decision-makers. Here is why owners entrust their portfolios to us:
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/60">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Commission guarantee callout */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Our Success-Only Brokerage Model</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                We only succeed when you do. SISORA collects a competitive success commission only upon escrow release. If your domain does not sell, you owe nothing.
              </p>
            </div>
          </div>

          {/* Right Column: SellDomainForm (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 shadow-xl shadow-black/40">
              <div className="mb-6 pb-4 border-b border-zinc-850">
                <h3 className="text-xl font-bold text-white">
                  Domain Submission Form
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Complete the details below. Our valuation team reviews every asset and responds with an appraisal within 24 to 48 hours.
                </p>
              </div>

              <SellDomainForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
