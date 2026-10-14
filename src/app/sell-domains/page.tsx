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
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header section */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
            <DollarSign className="w-4 h-4 text-neutral-900" />
            <span>Maximize Digital Asset Value</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Sell Your .SI Domains
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
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
              <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">
                Why Broker With SISORA?
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Selling a premium domain name requires specialized market knowledge and access to capitalized corporate decision-makers. Here is why owners entrust their portfolios to us:
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/60">
                    <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shrink-0 mt-0.5 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Commission guarantee callout */}
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Our Success-Only Brokerage Model</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We only succeed when you do. SISORA collects a competitive success commission only upon escrow release. If your domain does not sell, you owe nothing.
              </p>
            </div>
          </div>

          {/* Right Column: SellDomainForm (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
              <div className="mb-6 pb-4 border-b border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900">
                  Domain Submission Form
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
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
