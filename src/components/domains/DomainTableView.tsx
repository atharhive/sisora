"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check, ExternalLink, SearchX } from "lucide-react";
import { DomainItem, getDomainType } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface DomainTableViewProps {
  domains: DomainItem[];
  emptyMessage?: string;
  onResetFilters?: () => void;
  onInquire?: (domain: DomainItem) => void;
}

export function DomainTableView({
  domains,
  emptyMessage = "No domains match your current search or filter criteria.",
  onResetFilters,
  onInquire,
}: DomainTableViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, domain: DomainItem) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(domain.name);
    setCopiedId(domain.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-2xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 mb-4">
          <SearchX className="h-6 w-6 text-neutral-600" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No Domains Found</h3>
        <p className="mt-1 text-sm text-neutral-500 max-w-sm">{emptyMessage}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onResetFilters ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          ) : (
            <Link href="/buy-domains">
              <Button variant="secondary" size="sm">
                Reset Filters
              </Button>
            </Link>
          )}
          <Link href="/contact">
            <Button variant="primary" size="sm">
              Custom Acquisition Request
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-2xs overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[620px] sm:min-w-[680px]">
          <thead>
            <tr className="border-b border-neutral-200 bg-[#f8f9fa] text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Domain
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Type
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Price
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {domains.map((domain) => {
              const type = getDomainType(domain);
              const slug = domain.slug || domain.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const isMakeOffer = !domain.price || domain.priceType === "make_offer";
              const isCopied = copiedId === domain.id;

              return (
                <tr
                  key={domain.id || domain.name}
                  className="group hover:bg-neutral-50/80 transition-colors"
                >
                  {/* Domain Name */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/domains/${slug}`}
                        className="font-black text-base sm:text-lg text-neutral-950 hover:text-neutral-600 transition-colors tracking-tight font-sans"
                      >
                        {domain.name.toUpperCase()}
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, domain)}
                        title={isCopied ? "Copied!" : "Copy domain name"}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-400 hover:text-neutral-900 rounded-md hover:bg-neutral-200/60 cursor-pointer"
                      >
                        {isCopied ? (
                          <Check className="h-3 w-3 text-emerald-600 stroke-[2.5]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    {domain.category && (
                      <span className="block text-[11px] text-neutral-500 mt-0.5">
                        {domain.category}
                      </span>
                    )}
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 sm:px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200/80">
                      {type}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 sm:px-6 font-mono font-black text-sm sm:text-base text-neutral-950">
                    {isMakeOffer ? (
                      <span className="text-neutral-500 font-sans text-xs font-bold uppercase tracking-wider">
                        Make Offer
                      </span>
                    ) : (
                      formatPrice(domain.price)
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Available</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/domains/${slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-950 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all active:scale-95 shadow-2xs"
                      >
                        <span>Acquire</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DomainTableView;
