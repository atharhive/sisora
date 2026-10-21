import React from "react";
import Link from "next/link";
import {
  Globe,
  SlidersHorizontal,
  BadgeDollarSign,
  Award,
  Settings,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import {
  getAllDomains,
  getAllOffers,
  getTrackRecordData,
  getSiteSettings,
  getDomainTypes,
  getDomainCategories,
} from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [domains, offers, trackRecord, siteSettings, types, categories] = await Promise.all([
    getAllDomains(),
    getAllOffers(),
    getTrackRecordData(),
    getSiteSettings(),
    getDomainTypes(),
    getDomainCategories(),
  ]);

  const totalDomains = domains.length;
  const featuredDomains = domains.filter((d) => d.featured).length;
  const portfolioValuation = domains.reduce((acc, d) => acc + (d.price || 0), 0);
  const totalOffers = offers.length;
  const newOffers = offers.filter((o) => o.status === "new").length;
  const totalTrackDeals = trackRecord.deals.length;

  const oneWordCount = domains.filter((d) => d.type?.slug === "one-word" || d.name.length <= 10).length;
  const twoLetterCount = domains.filter((d) => d.type?.slug === "ll" || d.slug.length === 2).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. EXECUTIVE HERO DECK */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-semibold transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Public Website</span>
              </Link>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Console Live</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              SISORA Brokerage Overview
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-normal">
              Portfolio management, buyer negotiation pipelines, and secondary market authority for premium <span className="font-semibold text-neutral-900">.si</span> domain assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/domains"
              className="group inline-flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-300" />
              <span>Add Domain</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/offers"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-all shadow-2xs"
            >
              <BadgeDollarSign className="w-3.5 h-3.5 text-neutral-600" />
              <span>Inquiries ({newOffers} New)</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-all shadow-2xs group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <BarChart3 className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black transition-colors" />
              <span>Visitor Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ASYMMETRICAL BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Bento Major: Portfolio Valuation (Col-Span 7) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Total Portfolio Valuation
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>Liquid Tier-1 Inventory</span>
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 font-sans">
                ${portfolioValuation.toLocaleString()}
              </span>
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                USD Active Value
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Combined asking price across all fixed-price assets. Make-Offer assets are evaluated dynamically based on buyer bids.
            </p>
          </div>

          {/* Asset Classification Pills */}
          <div className="pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Asset Distribution
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  One-Word
                </span>
                <span className="text-base font-extrabold text-neutral-900 mt-0.5 block">
                  {oneWordCount}
                </span>
                <span className="text-[10px] text-neutral-400">Dictionary words</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  2-Letter (LL)
                </span>
                <span className="text-base font-extrabold text-neutral-900 mt-0.5 block">
                  {twoLetterCount}
                </span>
                <span className="text-[10px] text-neutral-400">Ultra-scarce</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Featured
                </span>
                <span className="text-base font-extrabold text-neutral-900 mt-0.5 block">
                  {featuredDomains}
                </span>
                <span className="text-[10px] text-neutral-400">Homepage hero</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Minor 1: Deal Pipeline Pulse (Col-Span 5) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Acquisitions Pipeline
              </span>
              <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center font-bold text-xs">
                {newOffers}
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-950 mt-2 tracking-tight">
              {totalOffers} Total Inquiries
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Direct visitor purchase offers and broker negotiations logged in the database.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-800">New Buyer Inquiries</span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900">{newOffers} pending</span>
            </div>

            <Link
              href="/admin/offers"
              className="group flex items-center justify-between p-3 rounded-xl bg-neutral-900 text-white hover:bg-black transition-all text-xs font-bold"
            >
              <span>Review Deal Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. COMMAND HUBS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {/* Hub 0: Traffic & Visitor Analytics */}
        <Link
          href="/admin/analytics"
          className="group rounded-2xl p-4 sm:p-5 bg-white border border-neutral-200/80 hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-neutral-900">Traffic &amp; Analytics</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                Live visitor telemetry, country origins, buyer search demand, and referrer paths.
              </p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900">
            <span>View Telemetry</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Hub 1: Domain Manager */}
        <Link
          href="/admin/domains"
          className="group rounded-2xl p-4 sm:p-5 bg-white border border-neutral-200/80 hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-900">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Domain Catalog</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                Manage all {totalDomains} domains, edit rich descriptions, and toggle pricing buttons.
              </p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900">
            <span>Manage Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Hub 2: Filters & Taxonomy */}
        <Link
          href="/admin/filters"
          className="group rounded-2xl p-4 sm:p-5 bg-white border border-neutral-200/80 hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-900">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Filters &amp; Taxonomy</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                {types.length} domain types, {categories.length} categories, and valuation brackets.
              </p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900">
            <span>Edit Taxonomies</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Hub 3: Track Record */}
        <Link
          href="/admin/track-record"
          className="group rounded-2xl p-4 sm:p-5 bg-white border border-neutral-200/80 hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-900">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Track Record</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                {totalTrackDeals} verified transactions, authority bio, and credentials copy.
              </p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900">
            <span>Edit Track Record</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Hub 4: Brokerage Configuration */}
        <Link
          href="/admin/settings"
          className="group rounded-2xl p-4 sm:p-5 bg-white border border-neutral-200/80 hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3"
        >
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center text-neutral-900">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">Site Configuration</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                Lead inboxes ({siteSettings.contact_email}), Telegram handle, and terms.
              </p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900">
            <span>Configure Settings</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* 4. SECURITY & SYSTEM INTEGRITY BANNER */}
      <div className="p-4 rounded-xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs border border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Enterprise Row-Level Security Active
            </span>
            <span className="text-[11px] text-neutral-400">
              Database protected with PostgreSQL RLS &bull; Sessions secured via cryptographic SSR cookies.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            ● 100% Operational
          </span>
        </div>
      </div>
    </div>
  );
}
