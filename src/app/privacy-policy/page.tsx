import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy | SISORA Domain Brokerage",
  description:
    "Review the privacy policy and confidentiality standards of SISORA. We maintain strict client discretion and bilateral non-disclosure protocols.",
};

export default function PrivacyPolicyPage() {
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
            <span className="text-neutral-900 font-bold">Privacy Policy</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Confidentiality &amp; Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Client Discretion, Bilateral NDAs, and Transaction Confidentiality
          </p>
        </div>
      </section>

      {/* Policy content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 sm:p-12 shadow-sm space-y-10 text-sm sm:text-base leading-relaxed text-neutral-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              1. Overview &amp; Commitment to Discretion
            </h2>
            <p>
              SISORA (&quot;SISORA&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates as a dedicated domain brokerage connecting .si domain investors to buy and sell domain names. Because high-value domain transactions involve corporate naming rights and strategic portfolio positioning, client confidentiality is foundational to our operations.
            </p>
            <p className="mt-3">
              We execute discreet private sales backed by bilateral Non-Disclosure Agreements (NDAs), protecting both buyer and seller identities throughout negotiations.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you voluntarily provide when submitting buying requests, listing domain names for representation, or communicating with our desk:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-neutral-600">
              <li>Contact details: Name, email address, phone number, and Telegram handle.</li>
              <li>Transaction data: Target domain names, desired acquisition budgets, and asking valuations.</li>
              <li>Verification documentation: Registry ownership validation required by Escrow.com or Atom.com.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              3. Secure Settlement Partners
            </h2>
            <p>
              All payments, financial escrow deposits, and payout disbursements are conducted through licensed third-party escrow providers (Escrow.com and Atom.com). SISORA never directly holds or stores sensitive banking credentials or credit card numbers.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">
              4. Contact Us Regarding Privacy
            </h2>
            <p>
              If you have inquiries regarding confidentiality agreements or data handling, contact our privacy desk directly at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`} className="font-semibold text-neutral-950 underline">
                {SITE_CONFIG.contact.email}
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
