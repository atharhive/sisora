import type { Metadata } from "next";
import { Users2, SearchCheck, Layers, EyeOff, ShieldCheck, Building2 } from "lucide-react";
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
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header section */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
            <Building2 className="w-4 h-4 text-neutral-900" />
            <span>Institutional &amp; Investor Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
            For .SI Domain Investors
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            A dedicated platform for .si domain investors. Connect, acquire, and sell premium .si domains through professional brokerage.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Services list */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-950">
                Brokerage Services for Investors
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Tailored transaction execution designed to protect capital and maximize portfolio yields.
              </p>
            </div>

            <div className="space-y-4">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200/80 px-2.5 py-0.5 rounded-full">
                        {svc.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mt-2">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Escrow note */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-3 text-xs text-neutral-600 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900 block mb-0.5">
                  Institutional Confidentiality
                </span>
                All private acquisitions and portfolio movements are handled under strict non-disclosure terms.
              </div>
            </div>
          </div>

          {/* Right Column: Buying Request Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              <h2 className="text-xl font-bold text-neutral-950 mb-1">
                Submit a Buying Request
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mb-6">
                Tell us what you&apos;re looking for and we&apos;ll notify you when matching assets become available.
              </p>
              <BuyingRequestForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
