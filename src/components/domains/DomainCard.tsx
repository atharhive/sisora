"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check, ShieldCheck } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export interface DomainItem {
  id?: string;
  name: string;
  slug?: string;
  extension?: string;
  category?: string | null;
  tags?: string[] | null;
  price?: number | null;
  priceType?: string | null;
  featured?: boolean | null;
  description?: string | null;
}

export interface DomainCardProps {
  domain: DomainItem;
  featured?: boolean;
  className?: string;
}

export function DomainCard({
  domain,
  featured = false,
  className,
}: DomainCardProps) {
  const [copied, setCopied] = useState(false);

  const slug = domain.slug || domain.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isMakeOffer = !domain.price || domain.priceType === "make_offer";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(domain.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-neutral-900/40",
        featured
          ? "border-neutral-950/20 shadow-sm"
          : "border-neutral-200/90 shadow-2xs",
        className
      )}
    >
      {/* Top Row: Category + Copy Domain Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {domain.category && (
            <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 transition-colors group-hover:bg-neutral-950 group-hover:text-white">
              {domain.category}
            </span>
          )}
          {(domain.featured || featured) && (
            <span className="rounded-md bg-neutral-950 px-2.5 py-1 text-[11px] font-bold text-white tracking-wide uppercase">
              Featured
            </span>
          )}
        </div>

        {/* Copy domain button */}
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy domain name"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/80 text-neutral-400 hover:text-black hover:border-neutral-400 hover:bg-neutral-50 transition-all cursor-pointer active:scale-95"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Domain Name & Description */}
      <div className="my-5">
        <Link href={`/domains/${slug}`} className="block group-hover:opacity-90">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700 font-sans">
            {domain.name}
          </h3>
        </Link>
        {domain.description && (
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {domain.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {domain.tags && domain.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {domain.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-500 border border-neutral-200/60"
            >
              {tag}
            </span>
          ))}
          {domain.tags.length > 3 && (
            <span className="text-[11px] font-medium text-neutral-400">
              +{domain.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Pricing & CTA */}
      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-400">
            Asking Price
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-neutral-950">
            {isMakeOffer ? "Make Offer" : formatPrice(domain.price)}
          </span>
        </div>

        <Link
          href={`/domains/${slug}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-neutral-800 active:scale-95 shadow-xs"
        >
          <span>Acquire</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default DomainCard;
