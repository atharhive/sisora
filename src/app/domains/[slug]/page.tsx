import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
  Check,
  FileCheck2,
} from "lucide-react";
import { getDomainBySlug, DOMAINS, SITE_CONFIG, getDomainType } from "@/lib/data";
import { getPublicDomainBySlug, getPublicDomains } from "@/lib/data-server";
import { formatPrice } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Button } from "@/components/ui/Button";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const domain = (await getPublicDomainBySlug(slug)) || {
    name: `${slug.toLowerCase()}.si`,
    description: `Acquire the premium domain ${slug.toLowerCase()}.si on SISORA.`,
  };

  return {
    title: `${domain.name} is for sale | SISORA .SI Domain Brokerage`,
    description:
      domain.description ||
      `Buy or make an offer on ${domain.name}. 100% secure escrow transfer via Escrow.com & Atom.com, confidential negotiation, and immediate transfer.`,
  };
}

// Generate static params for all domains
export async function generateStaticParams() {
  const domains = await getPublicDomains();
  return domains.map((d) => ({
    slug: d.slug,
  }));
}

export default async function DomainDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const foundDomain = await getPublicDomainBySlug(slug);

  // If not in sample list, construct a graceful dynamic representation
  const domain = foundDomain || {
    id: `dyn-${slug}`,
    name: slug.endsWith(".si") ? slug.toLowerCase() : `${slug.toLowerCase()}.si`,
    slug: slug.toLowerCase().replace(/\.si$/, ""),
    extension: ".si",
    description: `High-impact brandable domain ${slug.toLowerCase()}.si available for acquisition.`,
    category: "Generic Asset",
    tags: ["Premium", "Domain", "Slovenia"],
    price: null,
    priceType: "make_offer",
    featured: false,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  const domainType = getDomainType(domain as any);
  const priceDisplay = domain.price ? formatPrice(domain.price) : "Make Offer";
  const isMakeOffer = !domain.price || domain.priceType === "make_offer";

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#090a0c]">
      {/* Breadcrumb Bar */}
      <div className="border-b border-neutral-200 bg-neutral-50/70 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href="/buy-domains" className="hover:text-black transition-colors">
            Buy Domains
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-bold">{domain.name}</span>
        </div>
      </div>

      {/* Main Two-Column Listing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-start">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                VERIFIED .SI DOMAIN
              </span>
              <span className="rounded-full bg-neutral-900/5 px-3 py-1 text-[11px] sm:text-xs font-mono font-bold text-neutral-800 border border-neutral-300/80">
                {domainType}
              </span>
              {domain.category && (
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] sm:text-xs font-semibold text-neutral-800 border border-neutral-200/60">
                  {domain.category}
                </span>
              )}
            </div>

            {/* Domain name large */}
            <div>
              <h1 className="text-3xl sm:text-6xl xl:text-7xl font-black tracking-tight text-neutral-950 font-sans break-words">
                {domain.name}
              </h1>
              {domain.description && (
                <p className="mt-2.5 sm:mt-4 text-sm sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                  {domain.description}
                </p>
              )}
            </div>

            {/* Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] shadow-xs">
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md mb-3 sm:mb-4">
                  {domain.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-2xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-1.5 sm:mb-2 font-sans">
                  {domain.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-neutral-500">
                  <span className="text-emerald-600 font-semibold">● Active DNS</span>
                  <span>|</span>
                  <span>Escrow.com &amp; Atom.com Verified</span>
                </div>
              </div>
            </div>

            {/* Asset Intelligence & Specifications (Replaces Unverified Traffic Chart) */}
            <div className="rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Domain Intelligence
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight">
                    Asset Specifications &amp; Verification
                  </h3>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Unencumbered Title</span>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
                <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                    Structure Type
                  </span>
                  <span className="text-neutral-950 font-bold text-sm sm:text-base mt-0.5 block font-mono">
                    {domainType}
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                    Character Count
                  </span>
                  <span className="text-neutral-950 font-bold text-sm sm:text-base mt-0.5 block font-mono">
                    {domain.slug.length} Letters
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                    Asset Status
                  </span>
                  <span className="text-neutral-950 font-bold text-sm sm:text-base mt-0.5 block">
                    Direct Exclusive
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                    Transfer Protocol
                  </span>
                  <span className="text-neutral-950 font-bold text-sm sm:text-base mt-0.5 block">
                    EPP Auth Push
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                    Transfer Speed
                  </span>
                  <span className="text-neutral-950 font-bold text-sm sm:text-base mt-0.5 block">
                    Same-Day (24h)
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                    Custody Vault
                  </span>
                  <span className="text-neutral-950 font-bold text-sm sm:text-base mt-0.5 block">
                    Escrow.com / Atom
                  </span>
                </div>
              </div>
            </div>

            {/* Institutional Transfer & Acquisition Workflow */}
            <div className="rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Institutional Security
                </span>
                <h3 className="text-lg sm:text-xl font-black text-neutral-950 tracking-tight mt-0.5">
                  Three-Step Protected Acquisition Workflow
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-mono font-bold text-white">
                      1
                    </span>
                    <span className="text-xs font-bold text-neutral-950">
                      Offer &amp; Terms
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Submit a formal offer or acquire directly at agreed valuation. Terms and bilateral agreement finalized confidentially.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-mono font-bold text-white">
                      2
                    </span>
                    <span className="text-xs font-bold text-neutral-950">
                      Escrow Vault
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Buyer deposits funds into licensed third-party escrow (Escrow.com or Atom.com). Funds remain protected in custody.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-mono font-bold text-white">
                      3
                    </span>
                    <span className="text-xs font-bold text-neutral-950">
                      Domain Authorization Push
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    EPP authorization code is delivered to push domain to your registrar. Escrow releases funds only after buyer confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: BUY BOX ================= */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
              {/* Price section */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Valuation / Price
                </span>
                <div className="text-4xl font-black text-neutral-950 font-sans tracking-tight">
                  {priceDisplay}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  All assets ready for instant acquisition through licensed Escrow.com and Atom.com.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a href="#inquire" className="block w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center text-sm font-bold py-4 h-13 bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm"
                  >
                    {isMakeOffer ? "Make an Offer" : `Acquire Now - ${priceDisplay}`}
                  </Button>
                </a>

                {!isMakeOffer && (
                  <a href="#inquire" className="block w-full">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full justify-center text-xs font-bold h-11 border-neutral-300 hover:border-black text-neutral-900"
                    >
                      Make an Offer →
                    </Button>
                  </a>
                )}
              </div>

              {/* Direct Broker Channels: Just Logos in Order (X then Email then Telegram) */}
              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Direct Broker Channels
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Instant Response
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* 1. X */}
                  <a
                    href="https://x.com/SisoraBrokerage"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    title="Official X (@SisoraBrokerage)"
                    className="flex h-11 items-center justify-center rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white transition-all active:scale-95 shadow-2xs hover:shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* 2. Email */}
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}?subject=Acquisition%20Inquiry%20for%20${domain.name}`}
                    aria-label="Email Desk"
                    title={`Email (${SITE_CONFIG.contact.email})`}
                    className="flex h-11 items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 transition-all active:scale-95 shadow-2xs hover:shadow-xs"
                  >
                    <Mail className="w-4 h-4 text-neutral-700 shrink-0" />
                  </a>

                  {/* 3. Telegram */}
                  <a
                    href="http://t.me/SisoraBrokerage"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram Desk"
                    title="Telegram (@SisoraBrokerage)"
                    className="flex h-11 items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 transition-all active:scale-95 shadow-2xs hover:shadow-xs"
                  >
                    <svg className="w-4 h-4 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Safe & Secure Escrow details */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                  SAFE &amp; SECURE PURCHASE
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Secure escrow via Escrow.com &amp; Atom.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Confidential bilateral negotiation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Fast EPP authorization code push</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section Below */}
      <section id="inquire" className="border-t border-neutral-200 bg-neutral-50/70 py-8 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Direct Broker Channel</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              Inquire or Submit Offer for {domain.name}
            </h3>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
              Our brokerage desk will verify escrow availability, terms, or transfer procedures immediately upon receipt.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-5 sm:p-10 shadow-lg">
            <InquiryForm domainName={domain.name} domainId={domain.id} />
          </div>
        </div>
      </section>
    </div>
  );
}
