import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  CreditCard,
  MessageCircle,
  Send,
  Calendar,
  Lock,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getDomainBySlug, DOMAINS } from "@/lib/data";
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
    title: `${domain.name} is for sale | SISORA .SI Brokerage`,
    description:
      domain.description ||
      `Buy or make an offer on ${domain.name}. 100% secure escrow transfer, flexible lease-to-own, and immediate DNS delegation.`,
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
    description: `High-impact brandable domain ${slug.toLowerCase()}.si available for acquisition or lease-to-own.`,
    category: "Generic Asset",
    tags: ["Premium", "Domain", "Slovenia"],
    price: 8500,
    priceType: "fixed",
    featured: false,
    status: "active",
    totalVisitors: 1240,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const visitors = domain.totalVisitors || 3820;
  const priceDisplay = domain.price ? formatPrice(domain.price) : "Make Offer";
  const leasePriceMonthly = domain.price ? Math.round(domain.price / 24) : null;

  // Monthly traffic bar mockup
  const trafficBars = [42, 58, 45, 68, 74, 62, 85, 91, 79, 88, 96, 100];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Bar */}
      <div className="border-b border-zinc-900 bg-zinc-950/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/buy-domains" className="hover:text-white transition-colors">
            Buy Domains
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-200 font-mono font-medium">{domain.name}</span>
        </div>
      </div>

      {/* Main Two-Column Listing Section (C2.io style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Green badge: PREMIUM DOMAIN FOR SALE */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PREMIUM DOMAIN FOR SALE
              </span>
              {domain.category && (
                <Badge variant="secondary" size="md">
                  {domain.category}
                </Badge>
              )}
            </div>

            {/* 2. Domain name large */}
            <div>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black font-mono tracking-tight text-white uppercase break-words">
                {domain.name}
              </h1>
              {domain.description && (
                <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                  {domain.description}
                </p>
              )}
            </div>

            {/* 3. Domain Logo / Preview Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[240px] shadow-2xl">
              {/* Subtle grid pattern background */}
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white font-mono font-bold text-2xl shadow-lg mb-4">
                  {domain.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white mb-2">
                  {domain.name}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="text-emerald-400">● Active DNS</span>
                  <span>|</span>
                  <span>Registered .SI Registry Asset</span>
                </div>
              </div>
            </div>

            {/* 4. Traffic Stats Section */}
            <div className="rounded-2xl border border-zinc-850 bg-zinc-950 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    TOTAL VISITORS
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-1">
                    {visitors.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                  <TrendingUp className="w-4 h-4" />
                  <span>+23.4% organic type-in traffic</span>
                </div>
              </div>

              {/* Sparkline-style chart (CSS div bars) */}
              <div>
                <div className="text-xs font-medium text-zinc-400 mb-3 flex items-center justify-between">
                  <span>12-Month Traffic Trend</span>
                  <span className="font-mono text-zinc-400">Monthly breakdown</span>
                </div>

                <div className="h-28 flex items-end justify-between gap-1.5 sm:gap-2 pt-4 px-1">
                  {trafficBars.map((height, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full rounded-t bg-zinc-800 group-hover:bg-emerald-500 transition-colors duration-150 relative"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-white whitespace-nowrap shadow-md">
                          {Math.round(visitors * (height / 800))}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">
                        {months[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Domain Asset Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/60">
                <span className="text-zinc-400 block text-[10px] uppercase font-sans">Extension</span>
                <span className="text-white font-bold text-sm">.SI (Slovenia / EU)</span>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/60">
                <span className="text-zinc-400 block text-[10px] uppercase font-sans">Length</span>
                <span className="text-white font-bold text-sm">{domain.slug.length} Characters</span>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/60 col-span-2 sm:col-span-1">
                <span className="text-zinc-400 block text-[10px] uppercase font-sans">Transfer Speed</span>
                <span className="text-emerald-400 font-bold text-sm">Within 24-48 Hours</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (GET THIS DOMAIN) ================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Heading */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  GET THIS DOMAIN
                </h2>
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Escrow Verified
                </span>
              </div>

              {/* Price display (large, bold) */}
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-400">
                  {domain.price ? "Fixed Buyout Price" : "Current Status"}
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white mt-1">
                  {priceDisplay}
                </div>
                {domain.price && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Inclusive of registry transfer fee and third-party escrow protection.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {/* 1. Buy now green button */}
                <a href="#inquire" className="block w-full">
                  <Button
                    variant="green"
                    size="lg"
                    className="w-full justify-center text-lg font-bold py-4 h-14 shadow-lg shadow-emerald-950"
                  >
                    {domain.price ? `Buy Now - ${priceDisplay}` : "Submit Formal Offer"}
                  </Button>
                </a>

                {/* 2. Make an offer option */}
                {domain.price && (
                  <a href="#inquire" className="block w-full">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full justify-center text-sm font-semibold h-11"
                    >
                      Make an Offer
                    </Button>
                  </a>
                )}

                {/* 3. Lease to own option */}
                {leasePriceMonthly && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span>Lease-to-Own Option</span>
                      </span>
                      <span className="font-mono text-emerald-400">
                        ${leasePriceMonthly.toLocaleString()}/mo
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Spread acquisition cost over up to 24 months with immediate DNS delegation for your business.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Chat with the seller option */}
              <div className="pt-4 border-t border-zinc-900 space-y-2.5">
                <div className="text-xs font-semibold text-zinc-300">
                  Chat with the Broker Desk:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hello, I would like to inquire about acquiring the domain ${domain.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://t.me/sisora_brokerage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-white transition-colors"
                  >
                    <Send className="w-4 h-4 text-sky-400" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              {/* 5. Payment method icons area */}
              <div className="pt-4 border-t border-zinc-900 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Accepted Payment Methods
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    Visa / Mastercard
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    PayPal
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    Wire / SWIFT
                  </span>
                  <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    Crypto (USDT/BTC)
                  </span>
                </div>
              </div>

              {/* 6. SAFE AND SECURE PURCHASE section */}
              <div className="pt-4 border-t border-zinc-900 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  SAFE AND SECURE PURCHASE
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Secure transaction via licensed escrow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Fast registry transfer (24-48 hours)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Flexible payment options & lease-to-own</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section Below */}
      <section id="inquire" className="border-t border-zinc-900 bg-zinc-950/80 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Direct Broker Channel</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Inquire or Submit Offer for {domain.name}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-lg mx-auto">
              Our brokerage desk will verify escrow availability, terms, or transfer procedures immediately upon receipt.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 shadow-2xl">
            <InquiryForm domainName={domain.name} domainId={domain.id} />
          </div>
        </div>
      </section>
    </div>
  );
}
