import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service | SISORA Domain Brokerage",
  description:
    "Review the operational terms, transaction rules, and legal agreements governing domain brokerage transactions and portfolio listings at SISORA.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-900">
      {/* Header bar */}
      <section className="border-b border-neutral-200 bg-neutral-50/60 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-900 font-bold">Terms of Service</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            <Scale className="w-4 h-4" />
            <span>Brokerage Terms</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Governing .SI Domain Brokerage Transactions and Portfolio Representation
          </p>
        </div>
      </section>

      {/* Terms content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 sm:p-12 shadow-sm space-y-10 text-sm sm:text-base leading-relaxed text-neutral-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the website of SISORA (&quot;SISORA&quot;, &quot;we&quot;, or &quot;us&quot;), engaging our brokerage advisory, submitting domain names for representation, or initiating formal purchase offers, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, you may not utilize our platform or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              2. Brokerage Representation Terms
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-neutral-700">
              <li>
                <strong>15% Commission:</strong> Our standard brokerage commission is 15% of the final sale price, payable according to the agreed brokerage terms upon successful closing.
              </li>
              <li>
                <strong>90-Day Exclusive Agreement:</strong> Each accepted domain is subject to a 90-day exclusive brokerage agreement. During this period, the owner agrees not to independently sell, advertise, promote, or appoint another broker to market the domain, as specified in the signed agreement.
              </li>
              <li>
                <strong>Professional Negotiations:</strong> We manage negotiations between buyers and sellers within the authority granted to us.
              </li>
              <li>
                <strong>Transaction Coordination:</strong> We help coordinate payment and domain transfer through Escrow.com or Atom.com, as appropriate and subject to the selected platform&apos;s requirements.
              </li>
            </ul>
            <p className="mt-4 text-xs text-neutral-500 italic">
              The specific commission obligations, exclusivity period, and transaction terms will be documented in the applicable brokerage agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              3. Scope of Brokerage Services
            </h2>
            <p>
              SISORA operates as an intermediary brokerage facilitating secondary market transactions between buyers and domain owners of .SI domain names. We do not operate as an ICANN or Arnes registrar. All ownership transfers occur directly between the respective domain registrants, coordinated via accredited registrars and licensed third-party escrow partners (Escrow.com and Atom.com).
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              4. Direct Desk Contact
            </h2>
            <p>
              For legal or transactional inquiries, contact us directly at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`} className="font-semibold text-neutral-950 underline">
                {SITE_CONFIG.contact.email}
              </a>{" "}
              or via Telegram at{" "}
              <a href={SITE_CONFIG.contact.telegramUrl || "http://t.me/SisoraBrokerage"} target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-950 underline">
                {SITE_CONFIG.contact.telegram || "@SisoraBrokerage"}
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
