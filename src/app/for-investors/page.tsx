import type { Metadata } from "next";
import { Users2, SearchCheck, Layers, EyeOff, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { BuyingRequestForm } from "@/components/forms/BuyingRequestForm";

export const metadata: Metadata = {
  title: "For .SI Domain Investors | SISORA Institutional Advisory",
  description:
    "Institutional services for domain investors: Investor-to-investor brokerage, private stealth acquisitions, bulk portfolio liquidation, and off-market opportunities.",
};

const services = [
  {
    id: "investor-brokerage",
    title: "Investor to Investor Brokerage",
    description:
      "Facilitating high-volume and wholesale secondary transactions between active domainers, funds, and family offices at true market-clearing rates without retail friction.",
    icon: Users2,
    badge: "Direct Liquidity",
  },
  {
    id: "acquisition",
    title: "Domain Acquisition Requests",
    description:
      "Discreet stealth representation for acquiring registered, unlisted .SI domains. We identify real beneficial owners and execute anonymized outreach to avoid speculative price inflation.",
    icon: SearchCheck,
    badge: "Stealth Mandates",
  },
  {
    id: "liquidation",
    title: "Portfolio Liquidation",
    description:
      "Specialized bulk liquidation programs for legacy collectors and holding companies. Structured asset sales, package discounting, and tranche disbursements.",
    icon: Layers,
    badge: "Bulk Programs",
  },
  {
    id: "private-deals",
    title: "Private Deal Opportunities",
    description:
      "Exclusive first-look access to high-tier assets, distressed private holdings, and confidential acquisitions prior to public marketplace listing.",
    icon: EyeOff,
    badge: "VIP Allocation",
  },
];

export default function ForInvestorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header section */}
      <section className="border-b border-zinc-900 bg-zinc-950/40 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <Building2 className="w-4 h-4" />
            <span>Institutional & Family Office Advisory</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            For .SI Domain Investors
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Private capital advisory, confidential stealth acquisitions, and portfolio management engineered specifically for professional domain investors and alternative asset funds.
          </p>
        </div>
      </section>

      {/* Services Grid (4 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Specialized Investor Solutions
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Engineered to maximize return on capital and secure rare category-defining assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                id={svc.id}
                className="relative rounded-2xl border border-zinc-850 bg-zinc-950 p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confidential Execution Under NDA</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Buying Request Form Section */}
      <section className="border-t border-zinc-900 bg-zinc-950/60 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Private Mandates</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Submit an Acquisition Request
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
              Tell us what domains or portfolio criteria you are targeting. Our brokerage team will initiate confidential discovery and deal structuring.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 shadow-2xl">
            <BuyingRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
