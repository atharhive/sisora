"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

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
  onSave?: (saved: boolean) => void;
}

export function DomainCard({
  domain,
  featured = false,
  className,
  onSave,
}: DomainCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const slug = domain.slug || domain.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isMakeOffer = !domain.price || domain.priceType === "make_offer";

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    onSave?.(nextSaved);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg",
        featured && "border-neutral-900 ring-1 ring-neutral-900/10",
        className
      )}
    >
      {/* Top Header Row: Category Badge & Heart/Save button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {domain.category ? (
            <Badge variant="default" size="sm" className="font-semibold text-neutral-800 bg-neutral-100">
              {domain.category}
            </Badge>
          ) : (
            <Badge variant="default" size="sm" className="font-semibold text-neutral-800 bg-neutral-100">
              Premium .SI
            </Badge>
          )}
          {(domain.featured || featured) && (
            <Badge variant="primary" size="sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Heart / Save Icon Button */}
        <button
          type="button"
          onClick={toggleSave}
          aria-label={isSaved ? "Remove from saved domains" : "Save domain"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-black cursor-pointer",
            isSaved && "border-red-200 bg-red-50 text-red-500 hover:text-red-600"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-transform group-hover:scale-105",
              isSaved && "fill-current text-red-500"
            )}
          />
        </button>
      </div>

      {/* Domain Name & Description */}
      <div className="my-5">
        <Link href={`/domains/${slug}`} className="block">
          <h3 className="text-2xl font-extrabold tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700 sm:text-3xl font-sans">
            {domain.name}
          </h3>
        </Link>
        {domain.description && (
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {domain.description}
          </p>
        )}
      </div>

      {/* Tag pills (e.g. Travel, Tech, Climate) */}
      {domain.tags && domain.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {domain.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 border border-neutral-200/60"
            >
              {tag}
            </span>
          ))}
          {domain.tags.length > 3 && (
            <span className="text-[11px] font-medium text-neutral-400">
              +{domain.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Pricing & CTA Button */}
      <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold tracking-wider uppercase text-neutral-400">
            Valuation
          </span>
          <span className="text-base sm:text-lg font-bold text-neutral-900">
            {isMakeOffer ? "Make Offer" : formatPrice(domain.price)}
          </span>
        </div>

        <Link
          href={`/domains/${slug}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-neutral-800 shadow-xs"
        >
          <span>Inquire About This Domain</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default DomainCard;
