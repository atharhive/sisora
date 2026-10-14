"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DomainCard, DomainItem } from "@/components/domains/DomainCard";

const DEFAULT_FEATURED_DOMAINS: DomainItem[] = [
  {
    id: "f-1",
    name: "Equator.si",
    slug: "equator",
    category: "Premium Dictionary Word",
    tags: ["Travel", "Tech", "Climate", "Global Business"],
    price: null,
    priceType: "make_offer",
    featured: true,
    description: "Exceptional one-word global dictionary asset for travel platforms, climate tech, or modern international branding.",
  },
  {
    id: "f-2",
    name: "Absence.si",
    slug: "absence",
    category: "SaaS / HR / Business",
    tags: ["HR Tech", "Workforce Management", "SaaS"],
    price: null,
    priceType: "make_offer",
    featured: true,
    description: "The definitive enterprise brand for HR platforms, time-tracking SaaS, leave management, or digital security.",
  },
  {
    id: "f-3",
    name: "Gentle.si",
    slug: "gentle",
    category: "Premium Word",
    tags: ["Branding", "Tech", "Lifestyle", "Wellness"],
    price: null,
    priceType: "make_offer",
    featured: true,
    description: "Clean, calming one-word brand ideal for consumer wellness, AI assistants, organic products, or luxury lifestyle ventures.",
  },
  {
    id: "f-4",
    name: "Licence.si",
    slug: "licence",
    category: "Business / Legal / Tech",
    tags: ["Compliance", "Software", "Business Services"],
    price: null,
    priceType: "make_offer",
    featured: true,
    description: "High-authority corporate domain for software licensing, legal compliance, fintech verification, or accreditation portals.",
  },
];

export interface FeaturedDomainsProps {
  domains?: DomainItem[];
}

export function FeaturedDomains({ domains }: FeaturedDomainsProps) {
  const displayDomains =
    domains && domains.length > 0
      ? domains.slice(0, 4)
      : DEFAULT_FEATURED_DOMAINS;

  return (
    <section className="w-full bg-white py-14 sm:py-20 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading & View All link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
              Featured .SI Domains
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-neutral-500 max-w-xl">
              Selected premium .si domains available for acquisition.
            </p>
          </div>

          <Link
            href="/buy-domains"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-black hover:text-neutral-700 transition-colors shrink-0"
          >
            <span>View All Domains</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayDomains.map((domain) => (
            <DomainCard
              key={domain.id || domain.name}
              domain={domain}
              featured={Boolean(domain.featured)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDomains;
