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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                VERIFIED .SI ASSET FOR ACQUISITION
              </span>
              {domain.category && (
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800 border border-neutral-200/60">
                  {domain.category}
                </span>
              )}
            </div>

            {/* Domain name large */}
            <div>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-neutral-950 font-sans break-words">
                {domain.name}
              </h1>
              {domain.description && (
                <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                  {domain.description}
                </p>
              )}
            </div>

            {/* Showcase Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50/70 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[220px] shadow-xs">
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-2xl shadow-md mb-4">
                  {domain.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-2">
                  {domain.name}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
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
                    href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(`Hello, I would like to acquire ${domain.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.03-.5.2-.17.18-.67.65-.67 1.6 0 .94.69 1.86.78 1.99.1.13 1.33 2.05 3.24 2.88 1.59.69 1.91.55 2.26.52.35-.03 1.13-.46 1.29-.91.16-.45.16-.84.11-.91-.05-.08-.18-.13-.37-.23s-1.13-.56-1.31-.62c-.17-.07-.3-.1-.43.1-.13.19-.5.62-.61.75-.12.13-.23.15-.42.05-.19-.1-.8-.29-1.53-.94-.57-.51-.95-1.14-1.06-1.33-.11-.19-.01-.3.08-.39.09-.09.19-.23.29-.34.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.34-.04-.1-.43-1.04-.6-1.42-.16-.38-.32-.32-.44-.33h-.37z" />
                    </svg>
                    <span>WhatsApp</span>
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
      <section id="inquire" className="border-t border-neutral-200 bg-neutral-50/70 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Direct Broker Channel</span>
            </div>
            <h3 className="text-3xl font-black text-neutral-950 tracking-tight">
              Inquire or Submit Offer for {domain.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 max-w-lg mx-auto">
              Our brokerage desk will verify escrow availability, terms, or transfer procedures immediately upon receipt.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-lg">
            <InquiryForm domainName={domain.name} domainId={domain.id} />
          </div>
        </div>
      </section>
    </div>
  );
}
