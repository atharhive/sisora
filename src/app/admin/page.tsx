import React from "react";
import Link from "next/link";
import {
  Globe,
  SlidersHorizontal,
  BadgeDollarSign,
  Award,
  Settings,
  Mail,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { getAllDomains, getAllOffers, getTrackRecordData, getSiteSettings } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [domains, offers, trackRecord, siteSettings] = await Promise.all([
    getAllDomains(),
    getAllOffers(),
    getTrackRecordData(),
    getSiteSettings(),
  ]);

  const totalDomains = domains.length;
  const featuredDomains = domains.filter((d) => d.featured).length;
  const portfolioValuation = domains.reduce((acc, d) => acc + (d.price || 0), 0);
  const totalOffers = offers.length;
  const newOffers = offers.filter((o) => o.status === "new").length;
  const totalTrackDeals = trackRecord.deals.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Trust Enterprise Console &bull; Supabase Realtime Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              SISORA Brokerage Admin Console
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Manage your domain inventory, dynamic taxonomies, buyer inquiries, track record authority, and brokerage terms.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Website</span>
            </Link>
            <Link
              href="/admin/domains"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Globe className="w-4 h-4" />
              <span>Manage Domains</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Active Domains"
          value={totalDomains}
          icon={Globe}
          trend={{ value: `${featuredDomains} Featured`, positive: true }}
        />
        <StatsCard
          title="Portfolio Valuation"
          value={`$${portfolioValuation.toLocaleString()}`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Buyer Offers & Leads"
          value={totalOffers}
          icon={BadgeDollarSign}
          trend={{ value: `${newOffers} New Inquiries`, positive: newOffers > 0 }}
        />
        <StatsCard
          title="Track Record Deals"
          value={totalTrackDeals}
          icon={Award}
        />
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manage Domains */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Domain Catalog</h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Add new .si domains, edit descriptions, toggle pricing buttons (Fixed vs Make Offer), set custom Escrow links, and manage availability.
            </p>
          </div>
          <Link
            href="/admin/domains"
            className="inline-flex items-center justify-between text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors pt-2 border-t border-neutral-100"
          >
            <span>Open Domain Manager</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Filters & Taxonomy */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Filters &amp; Taxonomy</h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Add custom domain types (e.g., Brandable, 2-Word), define industry categories, and configure dynamic valuation price brackets.
            </p>
          </div>
          <Link
            href="/admin/filters"
            className="inline-flex items-center justify-between text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors pt-2 border-t border-neutral-100"
          >
            <span>Configure All Filters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Offers & Inquiries */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Offers &amp; Negotiations</h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Review visitor offers, manually record offline buyer inquiries, change status (Reviewing, Accepted, Escrow), and log negotiation notes.
            </p>
          </div>
          <Link
            href="/admin/offers"
            className="inline-flex items-center justify-between text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors pt-2 border-t border-neutral-100"
          >
            <span>Manage Offers ({newOffers} new)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Track Record Page */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Track Record Page</h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Add, edit, and reorder closed transactions, update Domingo&apos;s industry authority bio, and customize track record categories.
            </p>
          </div>
          <Link
            href="/admin/track-record"
            className="inline-flex items-center justify-between text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors pt-2 border-t border-neutral-100"
          >
            <span>Edit Track Record</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brokerage Settings */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Brokerage Settings</h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Configure lead routing emails, Telegram handles, phone numbers, commission rates, and exclusivity agreements.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center justify-between text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors pt-2 border-t border-neutral-100"
          >
            <span>Edit Settings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Security & Database Status */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Security Architecture</h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Protected by Supabase Row-Level Security (RLS), cryptographically signed SSR sessions, and rate-limited API routes.
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Protection Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
