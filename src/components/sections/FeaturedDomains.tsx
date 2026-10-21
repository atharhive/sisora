"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DomainCard, DomainItem } from "@/components/domains/DomainCard";

const FEATURED_SI_DOMAINS: DomainItem[] = [
  {
    id: "f-pay",
    name: "Pay.si",
    slug: "pay",
    category: "Fintech & Payments",
    tags: ["Fintech", "Payments", "Super Intelligence", "Category Killer"],
    price: 150000,
    priceType: "fixed",
    featured: true,
    description: "Tier-1 category-defining financial technology brand for payments, neo-banking, cross-border settlement, or digital wallet ecosystems.",
  },
  {
    id: "f-licence",
    name: "Licence.si",
    slug: "licence",
    category: "Corporate & Enterprise",
    tags: ["Software Licensing", "Legal Tech", "Compliance", "Enterprise"],
    price: 24995,
    priceType: "fixed",
    featured: true,
    description: "High-authority corporate domain for software licensing, legal compliance, fintech verification, or international accreditation portals.",
  },
  {
    id: "f-gentle",
    name: "Gentle.si",
    slug: "gentle",
    category: "Brand & Lifestyle",
    tags: ["AI Assistant", "Wellness", "Organic", "Luxury Brand"],
    price: 24995,
    priceType: "fixed",
    featured: true,
    description: "Clean, calming one-word brand ideal for consumer wellness, AI companion assistants, organic products, or luxury lifestyle ventures.",
  },
  {
    id: "f-translate",
    name: "Translate.si",
    slug: "translate",
    category: "Super Intelligence & AI",
    tags: ["AI Translation", "Language Tech", "Super Intelligence", "Localization"],
    price: 24995,
    priceType: "fixed",
    featured: true,
    description: "Premium dictionary keyword for artificial intelligence translation engines, global localization platforms, or neural speech tech.",
  },
];

export interface FeaturedDomainsProps {
  domains?: DomainItem[];
}

export function FeaturedDomains({ domains }: FeaturedDomainsProps) {
  // Use passed domains if provided and non-empty, otherwise use fallback featured list
  const displayDomains =
    domains && domains.length > 0
      ? domains.slice(0, 4)
      : FEATURED_SI_DOMAINS;

  return (
    <section className="w-full bg-[#f4f5f7] py-8 sm:py-16 lg:py-24 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading & View All link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-2 sm:mb-3 shadow-2xs">
              <Sparkles className="h-3 w-3 text-neutral-900" />
              <span>Verified Portfolios</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950">
              Featured .SI Domains
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-neutral-600 max-w-xl leading-relaxed">
              Explore verified, premium SI (Super Intelligence) and generic keyword digital real estate. Ready for instant acquisition through licensed Escrow.com and Atom.com.
            </p>
          </div>

          <Link
            href="/buy-domains"
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-white border border-neutral-300 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-neutral-900 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white transition-all shrink-0 active:scale-95 shadow-2xs self-start sm:self-auto"
          >
            <span>View All Domains</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-card grid showcasing the PDF domains */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {displayDomains.map((domain) => (
            <DomainCard
              key={domain.id || domain.name}
              domain={domain}
              featured={Boolean(domain.featured)}
            />
          ))}
        </div>

        {/* Bottom Banner with Buying Request CTA */}
        <div className="mt-6 sm:mt-12 p-4 sm:p-8 rounded-2xl bg-white border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div>
            <h3 className="text-sm sm:text-lg font-bold text-neutral-950">
              Looking for a specific .SI domain name not listed here?
            </h3>
            <p className="text-[11px] sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
              We execute private stealth acquisitions on behalf of corporate buyers and investors.
            </p>
          </div>
          <Link
            href="/contact?intent=acquisition"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition-all active:scale-95 shrink-0 shadow-xs w-full sm:w-auto"
          >
            <span>Submit a Buying Request →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedDomains;
