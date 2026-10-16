import type { Metadata } from "next";
import Link from "next/link";
import { Users2, SearchCheck, Layers, EyeOff, Building2, ArrowRight } from "lucide-react";
import { BuyingRequestForm } from "@/components/forms/BuyingRequestForm";

export const metadata: Metadata = {
  title: "For .SI Domain Investors | Sisora Brokerage",
  description:
    "Founded by Domingo. Built for .SI domain investors. Connect, acquire, and trade premium .si domains through specialized investor-to-investor brokerage.",
};

const INVESTOR_SERVICES = [
  {
    id: "investor-brokerage",
    title: "Investor to Investor Transactions",
    description:
      "Facilitating secondary transactions directly between active domain investors, funds, and family offices at true market-clearing valuations without retail friction.",
    icon: Users2,
    badge: "Direct Liquidity",
  },
  {
    id: "acquisition",
    title: "Confidential Acquisition Mandates",
    description:
      "Stealth representation for acquiring unlisted, registered .si domains. We identify beneficial owners and lead discrete negotiations under strict NDA.",
    icon: SearchCheck,
    badge: "Stealth Mandates",
  },
  {
    id: "liquidation",
    title: "Portfolio Tranche Liquidations",
    description:
      "Structured bulk liquidation programs for legacy collectors and holding portfolios with coordinated escrow settlements.",
    icon: Layers,
    badge: "Bulk Programs",
  },
  {
    id: "private-deals",
    title: "Off-Market Deal Access",
    description:
      "First-look allocation on high-value two-letter, one-word dictionary, and AI/Super Intelligence .si assets prior to public release.",
    icon: EyeOff,
    badge: "VIP Allocation",
  },
];

export default function ForInvestorsPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#090a0c]">
      {/* Header section */}
      <section className="border-b border-neutral-200/90 bg-[#ebedf0]/60 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-4 shadow-2xs">
            <Building2 className="h-3.5 w-3.5 text-neutral-900" />
            <span>Built for .SI Domain Investors</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight">
            For .SI Domain Investors
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Founded by Domingo. Built for .SI domain investors. Connect, acquire, and sell premium .si digital real estate through specialized, discreet brokerage.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#mandate-form"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
            >
              <span>Submit Investor Mandate →</span>
            </a>
            <Link
              href="/track-record"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-7 py-3.5 text-sm font-bold text-neutral-900 hover:bg-neutral-50 hover:border-black transition-all active:scale-95"
            >
              <span>View Track Record</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Services list (Scrolls naturally) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Investor Infrastructure
              </span>
              <h2 className="text-3xl font-black text-neutral-950 tracking-tight">
                Specialized Services for Domain Investors
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Whether you are seeking liquidity for high-value .si names or acquiring strategic AI assets for your investment portfolio, our desk provides institutional-grade transaction handling.
              </p>
            </div>

            <div className="space-y-4">
              {INVESTOR_SERVICES.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-md">
                        {svc.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-950 mb-1.5">
                      {svc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Form that stays pinned in viewport */}
          <div id="mandate-form" className="lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-lg">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Confidential Desk
                </span>
                <h3 className="text-2xl font-black text-neutral-950 tracking-tight">
                  Submit Acquisition / Selling Mandate
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Connect with Domingo and the Sisora brokerage desk regarding target .SI acquisitions or portfolio liquidation.
                </p>
              </div>

              <BuyingRequestForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
