"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Home,
  Info,
  ShoppingBag,
  TrendingUp,
  Mail,
  DollarSign,
} from "lucide-react";
import type { Page } from "@/db/schema";

interface PageMetaItem {
  slug: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  publicUrl: string;
  updatedAt?: Date | string | null;
}

const DEFAULT_PAGES: PageMetaItem[] = [
  {
    slug: "home",
    title: "Home",
    description: "Homepage hero, curated portfolios, value proposition, and primary CTAs.",
    icon: Home,
    publicUrl: "/",
  },
  {
    slug: "about",
    title: "About",
    description: "Company history, .SI registry background, trust, and brokerage credentials.",
    icon: Info,
    publicUrl: "/about",
  },
  {
    slug: "buy-domains",
    title: "Buy Domains",
    description: "Acquisition guide, escrow safety process, transfer timeline, and buyer FAQ.",
    icon: ShoppingBag,
    publicUrl: "/buy",
  },
  {
    slug: "sell-domains",
    title: "Sell Domains",
    description: "Valuation calculator details, seller commissions, and submission guidelines.",
    icon: DollarSign,
    publicUrl: "/sell",
  },
  {
    slug: "investors",
    title: "For Investors",
    description: "Strategic investment thesis, bulk domain portfolio deals, and commercial upside.",
    icon: TrendingUp,
    publicUrl: "/investors",
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Brokerage contact details, direct inquiry form copy, and response guarantee.",
    icon: Mail,
    publicUrl: "/contact",
  },
];

export default function PagesListPage() {
  const [pagesList, setPagesList] = useState<PageMetaItem[]>(DEFAULT_PAGES);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pages");
      if (res.ok) {
        const data = await res.json();
        const dbPages: Page[] = Array.isArray(data) ? data : data.pages || [];

        // Merge DB updatedAt dates with our default list
        const updated = DEFAULT_PAGES.map((item) => {
          const match = dbPages.find((p) => p.slug === item.slug);
          return {
            ...item,
            title: match?.title || item.title,
            updatedAt: match?.updatedAt || null,
          };
        });
        setPagesList(updated);
      }
    } catch {
      // Gracefully maintain DEFAULT_PAGES
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Page Content (CMS)
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage public website copy, hero headers, marketing copy, and SEO meta tags.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPages}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-neutral-900" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Pages Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pagesList.map((item) => {
          const Icon = item.icon;
          const formattedDate = item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Default initial template";

          return (
            <div
              key={item.slug}
              className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <a
                    href={item.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    title="View live page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>

                <Link
                  href={`/admin/pages/${item.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
