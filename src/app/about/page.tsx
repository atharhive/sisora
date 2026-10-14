import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe2,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Lock,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { StatsBar } from "@/components/sections/StatsBar";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About SISORA | Premier .SI Domain Brokerage",
  description:
    "Learn about SISORA, the premier private brokerage for high-value .SI domains. Our methodology, institutional escrow approach, and why .SI assets are strategic European digital real estate.",
};

const whySiPoints = [
  {
    title: "Strategic European Tech Gateway",
    description:
      "Slovenia represents one of Central Europe's most digitally forward, eurozone-anchored economies with pioneering tech clusters in artificial intelligence, robotics, and blockchain.",
    icon: Globe2,
  },
  {
    title: "Global Semantic & Acronym Power",
    description:
      ".SI carries immediate cross-border resonance: representing 'System Integration', 'Silicon', and the affirmative 'Sí' across Spanish and Italian markets, alongside pristine 2-letter tech acronyms.",
    icon: Cpu,
  },
  {
    title: "Strict Registry Security & Rights",
    description:
      "Regulated under the high-integrity protocols of Arnes (Academic and Research Network of Slovenia), registrant property rights are legally shielded with dependable dispute resolution.",
    icon: ShieldCheck,
  },
  {
    title: "High Scarcity with Exponential Upside",
    description:
      "While legacy gTLDs (.com) have reached saturation, .SI offers elite single-word keywords, dictionary definitions, and premium short brands with massive long-term brand equity.",
    icon: TrendingUp,
  },
];

const approachPillars = [
  {
    title: "Absolute Confidentiality",
    description:
      "Every mandate is shielded behind strict bilateral NDAs. We protect buyer identities to eliminate speculative price gouging and keep seller portfolios discreet.",
    icon: Lock,
  },
  {
    title: "Data-Driven Appraisals",
    description:
      "We replace guesswork with rigorous market comparables, traffic analytics, trademark clearances, and strategic brand value modeling.",
    icon: Award,
  },
  {
    title: "End-to-End Registry Transfer",
    description:
      "We orchestrate the entire transaction lifecycle—from neutral third-party escrow funding through Arnes registry push and nameserver validation.",
    icon: CheckCircle2,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header section */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
            <span>Specialized Domain Advisory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
            About SISORA
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            The dedicated private brokerage for premium .SI digital real estate. Connecting visionary founders, multinational enterprises, and domain investors.
          </p>
        </div>
      </section>

      {/* Company Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-b border-neutral-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
              Elevating Digital Asset Brokerage for Central Europe and Beyond
            </h2>
            <p className="text-base text-neutral-700 leading-relaxed">
              SISORA was founded on a singular premise: premium country-code top-level domains (ccTLDs) are the most undervalued commercial assets on the modern internet. As brands increasingly prioritize authority, memorability, and regional compliance, high-value .SI domains provide category-defining legitimacy.
            </p>
            <p className="text-base text-neutral-600 leading-relaxed">
              Headquartered with global reach, SISORA serves as the primary gateway for acquiring and monetizing .SI domains. Whether representing multinational enterprises securing their trademark footprint or facilitating private liquidity for domain investors, our team delivers seamless, institutional-grade executions.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/buy-domains">
                <Button variant="primary" size="md">
                  Explore Current Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="md">
                  Schedule an Executive Call
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-8 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-950">Our Core Mission</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                To build a frictionless, transparent, and secure exchange ecosystem that unlocks the true intrinsic value of .SI domains for businesses, developers, and asset managers worldwide.
              </p>
              <div className="pt-4 border-t border-neutral-200 space-y-3 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Licensed Third-Party Escrow Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Official Arnes Registry Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Zero Public Identity Disclosure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why .SI Domains Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-b border-neutral-200">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            Strategic Value Proposition
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Why High-Value .SI Domains?
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Four key pillars that make .SI digital assets a powerful addition to any corporate brand or alternative investment balance sheet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whySiPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-neutral-200 bg-white flex flex-col justify-between hover:border-neutral-400 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            Professional Standards
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Our Brokerage Methodology
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            A disciplined, client-first approach built on trust, discretion, and transactional excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approachPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-xs transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{p.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reused StatsBar Section */}
      <StatsBar />
    </div>
  );
}
