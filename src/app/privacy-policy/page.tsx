import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SISORA Domain Brokerage",
  description:
    "Review the privacy policy and confidentiality standards of SISORA. We maintain strict client discretion and comply with global data protection regulations.",
};

export default function PrivacyPolicyPage() {
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
            <span className="text-zinc-200">Privacy Policy</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Client Confidentiality</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Last updated: October 2026 • Effective Date: January 1, 2024
          </p>
        </div>
      </section>

      {/* Policy content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-zinc max-w-none space-y-10 text-sm sm:text-base leading-relaxed text-zinc-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              1. Overview & Commitment to Discretion
            </h2>
            <p>
              SISORA (&quot;SISORA&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates as a premier private domain brokerage firm specializing in the acquisition, disposition, and structured transfer of .SI top-level domains. Because domain transactions frequently involve strategic corporate brand acquisitions, investor confidentiality and data privacy are foundational to our operations.
            </p>
            <p className="mt-3">
              This Privacy Policy explains what information we collect, how it is handled, and the measures we employ to maintain strict transactional anonymity when requested under bilateral Non-Disclosure Agreements (NDAs).
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you provide directly to us when utilizing our brokerage services, submitting domain inquiries, or registering acquisition mandates:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Contact Details:</strong> Name, corporate email address, telephone or WhatsApp number, and country of residence.
              </li>
              <li>
                <strong className="text-zinc-200">Transaction Criteria:</strong> Target domain names, desired budgets, portfolio holdings, and acquisition schedules.
              </li>
              <li>
                <strong className="text-zinc-200">Technical Data:</strong> IP addresses, browser types, and standard web interaction metrics gathered automatically to secure our platform against denial-of-service and malicious scanning.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              3. Purpose of Processing
            </h2>
            <p>
              We process personal data strictly for legitimate business purposes associated with domain brokerage:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-zinc-400">
              <li>Evaluating and verifying legal registrant authority for domains submitted for brokerage.</li>
              <li>Executing stealth buyer inquiries and negotiating terms on your explicit behalf.</li>
              <li>Coordinating with licensed third-party escrow partners (such as Escrow.com or Dan.com) to complete secure financial settlements.</li>
              <li>Facilitating official registry authorization (EPP code transmission) with Arnes-accredited registrars.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              4. Anonymity and Stealth Acquisitions
            </h2>
            <p>
              When a client engages SISORA under a stealth acquisition mandate, our brokers act as the authorized negotiator. We do not reveal the beneficial buyer&apos;s identity, company name, or capitalization to domain owners or counterparties without prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              5. Data Sharing and Third-Party Disclosures
            </h2>
            <p>
              SISORA will never monetize, sell, or rent your personal data to advertisers or commercial data brokers. We share information only with:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Licensed Escrow Agents:</strong> Required to fulfill Anti-Money Laundering (AML) and Know-Your-Customer (KYC) compliance for legal financial clearance.
              </li>
              <li>
                <strong className="text-zinc-200">Domain Registries & Registrars:</strong> Strictly the registrant information legally required by the Arnes registry to update domain ownership records.
              </li>
              <li>
                <strong className="text-zinc-200">Law Enforcement:</strong> Solely when compelled by a court order, subpoena, or applicable international law.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              6. Data Security & Storage
            </h2>
            <p>
              We implement industry-standard encryption protocols (TLS/SSL in transit, AES-256 at rest) to safeguard all correspondence, contracts, and inquiry details against unauthorized intrusion.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              7. Your Legal Rights (GDPR & Global Privacy)
            </h2>
            <p>
              Depending on your jurisdiction, you retain the legal right to request access to, correction of, or permanent erasure of your personal records from our databases. To exercise these rights, please contact our privacy compliance desk.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-900">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              8. Contact Our Privacy Desk
            </h2>
            <p>
              For any questions regarding this Privacy Policy or our confidential handling of domain transactions, please contact:
            </p>
            <div className="mt-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-1">
              <div>SISORA Brokerage Operations</div>
              <div>Email: deals@sisora.si</div>
              <div>Direct: +91 98765 43210</div>
              <div>Location: India (Global Client Services)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
