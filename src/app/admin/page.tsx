"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Settings,
  Mail,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { DOMAINS, SITE_CONFIG } from "@/lib/data";

export default function AdminDashboardPage() {
  const totalDomains = DOMAINS.length;
  const featuredDomains = DOMAINS.filter((d) => d.featured).length;
  const portfolioValuation = DOMAINS.reduce((acc, d) => acc + (d.price || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Static Engine &bull; Zero Database Dependency</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Welcome to SISORA Admin
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Your domain brokerage is running high-speed static architecture on Vercel. Inquiries route directly to your inbox.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Site</span>
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

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Active Domains"
          value={totalDomains}
          icon={Globe}
          trend={{ value: "+4 this month", positive: true }}
        />
        <StatsCard
          title="Featured Domains"
          value={featuredDomains}
          icon={ShieldCheck}
        />
        <StatsCard
          title="Portfolio Valuation"
          value={`$${portfolioValuation.toLocaleString()}`}
          icon={Globe}
        />
        <StatsCard
          title="Lead Routing"
          value={SITE_CONFIG.contact.email}
          icon={Mail}
        />
      </div>

      {/* Quick Access & Configuration Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-neutral-900">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/domains"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-black">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Domain Catalog ({totalDomains} domains)
                  </h4>
                  <p className="text-xs text-neutral-500">
                    View list, edit prices, copy JSON for updates
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-black">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Site Configuration &amp; Contact
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Update phone, WhatsApp, email, social profiles
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* How It Works with Option A */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-neutral-900">
            How Site Updates Work (Option A)
          </h3>
          <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="font-bold text-neutral-900 block mb-1">
                📁 Data File Locations
              </span>
              Domains: <code className="text-neutral-800 font-semibold">src/data/domains.json</code><br />
              Site &amp; Contact: <code className="text-neutral-800 font-semibold">src/data/site-config.json</code>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="font-bold text-neutral-900 block mb-1">
                ✉️ Form Inquiries
              </span>
              All submissions on Buy, Sell, and Contact pages immediately open the visitor&apos;s email client pre-filled to <code className="font-bold text-black">{SITE_CONFIG.contact.email}</code> and provide 1-click WhatsApp messaging. No database maintenance needed!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
