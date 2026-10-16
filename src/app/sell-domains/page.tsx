import type { Metadata } from "next";
import { Handshake, ShieldCheck, Scale, Lock, FileText } from "lucide-react";
import { SellDomainForm } from "@/components/forms/SellDomainForm";

export const metadata: Metadata = {
  title: "Sell Your .SI Domains | Sisora Domain Brokerage",
  description:
    "Let Sisora represent your domains through a focused brokerage process designed to connect you with potential investors. 15% standard commission, 90-day exclusive terms.",
};

const TERMS = [
  {
    title: "15% Commission",
    description:
      "Our standard brokerage commission is 15% of the final sale price, payable according to the agreed brokerage terms.",
    icon: Scale,
    highlight: "Standard Rate",
  },
  {
    title: "90-Day Exclusive Agreement",
    description:
      "Each accepted domain is subject to a 90-day exclusive brokerage agreement. During this period, the owner agrees not to independently sell, advertise, promote, or appoint another broker to market the domain, as specified in the signed agreement.",
    icon: Lock,
    highlight: "Exclusivity Term",
  },
  {
    title: "Professional Negotiations",
    description:
      "We manage negotiations between buyers and sellers within the authority granted to us.",
    icon: Handshake,
    highlight: "Managed Dialogue",
  },
  {
    title: "Transaction Coordination",
    description:
      "We help coordinate payment and domain transfer through Escrow.com or Atom.com, as appropriate and subject to the selected platform's requirements.",
    icon: ShieldCheck,
    highlight: "Escrow Transfer",
  },
];

export default function SellDomainsPage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#090a0c]">
      {/* Header section with exact PDF text */}
      <section className="border-b border-neutral-200/90 bg-[#ebedf0]/60 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-4 shadow-2xs">
            <Handshake className="h-3.5 w-3.5 text-neutral-900" />
            <span>Dedicated Representation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight">
            Sell Your .SI Domains
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Let Sisora represent your domains through a focused brokerage process designed to connect you with potential investors.
          </p>
          <p className="mt-2 text-sm sm:text-base text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            We handle buyer outreach and negotiations, communicate offers and counteroffers, and help coordinate the closing process.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#submit-form"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
            >
              <span>Submit Your Domains →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Two-Column Layout: Terms on Left (Scrolls), Submission Form on Right (Sticky) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Our Brokerage Terms (Verbatim from PDF) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Transparency &amp; Governance
              </span>
              <h2 className="text-3xl font-black text-neutral-950 tracking-tight">
                Our Brokerage Terms
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Clear, straightforward terms designed to align our incentives directly with maximizing the realized value of your .SI portfolio.
              </p>
            </div>

            <div className="space-y-4">
              {TERMS.map((term, idx) => {
                const Icon = term.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-700">
                        {term.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-950 mb-1.5">
                      {term.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {term.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Verbatim Footnote from PDF */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start gap-3 text-xs text-neutral-500 leading-relaxed shadow-2xs">
              <FileText className="h-4 w-4 text-neutral-700 shrink-0 mt-0.5" />
              <p>
                The specific commission obligations, exclusivity period, and transaction terms will be documented in the applicable brokerage agreement.
              </p>
            </div>
          </div>

          {/* Right Column: Submission Form (Sticky) */}
          <div id="submit-form" className="lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-lg">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Owner Representation Mandate
                </span>
                <h3 className="text-2xl font-black text-neutral-950 tracking-tight">
                  Submit Your .SI Domains
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Provide your domain portfolio details below. Our senior desk will review within 24 hours.
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
