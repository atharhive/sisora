import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Send,
  Calendar,
  Lock,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { getDomainBySlug, DOMAINS, SITE_CONFIG } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomainBySlug(slug) || {
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

// Generate static params for all domains in domains.json
export async function generateStaticParams() {
  return DOMAINS.map((d) => ({
    slug: d.slug,
  }));
}

export default async function DomainDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const foundDomain = getDomainBySlug(slug);

  // If not in sample list, construct a graceful dynamic representation
  const domain = foundDomain || {
    id: `dyn-${slug}`,
    name: slug.endsWith(".si") ? slug.toLowerCase() : `${slug.toLowerCase()}.si`,
    slug: slug.toLowerCase().replace(/\.si$/, ""),
    extension: ".si",
    description: `High-impact brandable domain ${slug.toLowerCase()}.si available for acquisition.`,
    category: "Generic Asset",
    tags: ["Premium", "Domain", "Slovenia"],
    price: 24995,
    priceType: "fixed",
    featured: false,
    status: "active",
    totalVisitors: 3820,
    createdAt: new Date().toISOString(),
  };

  const visitors = domain.totalVisitors || 3820;
  const priceDisplay = domain.price ? formatPrice(domain.price) : "Make Offer";

  // Monthly traffic bar mockup
  const trafficBars = [42, 58, 45, 68, 74, 62, 85, 91, 79, 88, 96, 100];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
            {/* Status badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                VERIFIED .SI DOMAIN
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
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] shadow-xs">
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md mb-3 sm:mb-4">
                  {domain.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-2xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-1.5 sm:mb-2">
                  {domain.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-neutral-500">
                  <span className="text-emerald-600 font-semibold">● Active DNS</span>
                  <span>|</span>
                  <span>Escrow.com &amp; Atom.com Ready</span>
                </div>
              </div>
            </div>

            {/* Traffic Stats Section */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                    ANNUAL TRAFFIC REACH
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-950 mt-1">
                    {visitors.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Verified Type-in Demand</span>
                </div>
              </div>

              {/* Sparkline chart */}
              <div>
                <div className="text-xs font-semibold text-neutral-500 mb-3 flex items-center justify-between">
                  <span>12-Month Traffic Trend</span>
                  <span className="font-mono text-neutral-400">Monthly breakdown</span>
                </div>

                <div className="h-24 flex items-end justify-between gap-1.5 sm:gap-2 pt-2 px-1">
                  {trafficBars.map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full rounded-t bg-neutral-200 group-hover:bg-neutral-900 transition-colors duration-150"
                      />
                      <span className="text-[10px] font-mono text-neutral-400 group-hover:text-black">
                        {months[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Domain Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Extension</span>
                <span className="text-neutral-950 font-bold text-sm">.SI (Slovenia / EU)</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Length</span>
                <span className="text-neutral-950 font-bold text-sm">{domain.slug.length} Characters</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 col-span-2 sm:col-span-1">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Settlement</span>
                <span className="text-neutral-950 font-bold text-sm">Escrow.com / Atom</span>
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
                    {domain.price ? `Acquire Now - ${priceDisplay}` : "Submit Formal Offer"}
                  </Button>
                </a>

                <a href="#inquire" className="block w-full">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full justify-center text-xs font-bold h-11 border-neutral-300 hover:border-black text-neutral-900"
                  >
                    Submit a Buying Request →
                  </Button>
                </a>
              </div>

              {/* Direct Broker Desk Contacts from PDF */}
              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Direct Broker Channels
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}?subject=Acquisition%20Inquiry%20for%20${domain.name}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Email Desk</span>
                  </a>

                  <a
                    href="http://t.me/SisoraBrokerage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    <span>Telegram Desk</span>
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
                    <span>Fast Arnes registry authorization push</span>
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
