import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | SISORA Domain Brokerage",
  description:
    "Review the operational terms, transaction rules, and legal agreements governing domain brokerage transactions and portfolio listings at SISORA.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header bar */}
      <section className="border-b border-zinc-900 bg-zinc-950/40 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-200">Terms of Service</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <Scale className="w-4 h-4" />
            <span>Brokerage Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Last updated: October 2026 • Effective Date: January 1, 2024
          </p>
        </div>
      </section>

      {/* Terms content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-zinc max-w-none space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the website of SISORA (&quot;SISORA&quot;, &quot;we&quot;, or &quot;us&quot;), engaging our brokerage advisory, submitting domain names for listing, or initiating formal purchase offers, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, you may not utilize our platform or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              2. Scope of Brokerage Services
            </h2>
            <p>
              SISORA operates as an intermediary advisory and private broker facilitating transactions between prospective buyers and registered owners of .SI domain names. We do not operate as an ICANN or Arnes registrar. All ownership transfers occur directly between the respective domain registrants, coordinated via accredited registrars and licensed third-party escrow partners.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              3. Seller Representations & Warranties
            </h2>
            <p>
              Any seller submitting a domain name to SISORA for appraisal, listing, or brokerage represents and warrants that:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-zinc-400">
              <li>They are the sole legal registrant or authorized corporate representative with full power to sell and transfer the domain.</li>
              <li>The domain is not subject to any pending litigation, Uniform Domain-Name Dispute-Resolution Policy (UDRP) proceeding, or Arnes administrative dispute.</li>
              <li>The domain is unencumbered by liens, security interests, or unauthorized third-party claims.</li>
              <li>The seller agrees not to sell the domain outside of SISORA while under an exclusive brokerage mandate without written notice.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              4. Buyer Terms & Offer Obligations
            </h2>
            <p>
              When a buyer submits a binding purchase offer or agrees to a listed buyout price:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-zinc-400">
              <li>The offer remains binding for a minimum of 72 hours, during which the seller may accept or counter.</li>
              <li>Upon acceptance, the buyer agrees to deposit the full purchase amount into the designated escrow account within three (3) business days.</li>
              <li>Failure to fund escrow upon written contract execution may result in cancellation of the transaction and forfeiture of future access to the brokerage platform.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              5. Escrow & Closing Protocol
            </h2>
            <p>
              To eliminate financial risk for both parties, 100% of transactions brokered by SISORA are closed through licensed third-party escrow services (including Escrow.com or Dan.com):
            </p>
            <ol className="list-decimal pl-5 mt-3 space-y-2 text-zinc-400">
              <li>Buyer deposits cleared funds into escrow.</li>
              <li>Seller provides the official registry EPP/AuthCode and initiates the registrant change.</li>
              <li>Buyer verifies receipt of administrative control and DNS resolution.</li>
              <li>Escrow releases funds directly to the seller, net of agreed brokerage commissions.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              6. Trademark Clearance & Disclaimers
            </h2>
            <p>
              While SISORA conducts preliminary trademark screenings, buyers acknowledge that they are solely responsible for conducting comprehensive legal trademark clearance for their intended business usage of any domain name purchased. SISORA makes no representations regarding the commercial trademark availability of generic terms or dictionary keywords in specific jurisdictions.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              7. Brokerage Commissions & Fees
            </h2>
            <p>
              Brokerage commissions are established in writing prior to commencing negotiations. Unless explicitly agreed otherwise in a separate mandate agreement, commissions are success-based and deducted directly from closing escrow disbursements. No upfront listing fees are charged to sellers.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, SISORA shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from registry outages, delays in registry authorization, or counterparty default during an escrow transaction.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-900">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              9. Inquiries & Legal Notices
            </h2>
            <p>
              For legal correspondence or clarification regarding these terms, please contact:
            </p>
            <div className="mt-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-1">
              <div>SISORA Legal & Brokerage Compliance</div>
              <div>Email: deals@sisora.si</div>
              <div>Direct: +91 98765 43210</div>
              <div>Location: India (Serving Global Clients)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
