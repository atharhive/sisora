import React from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { DomainCard, DomainItem } from "./DomainCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export interface DomainGridProps {
  domains: DomainItem[];
  loading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export function DomainGrid({
  domains,
  loading = false,
  emptyMessage = "No domains match your current search or filter criteria.",
  onResetFilters,
}: DomainGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`domain-skeleton-${i}`}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-2 py-4">
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs border border-neutral-200 text-neutral-400 mb-4">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {domains.map((domain) => (
        <DomainCard
          key={domain.id || domain.name}
          domain={domain}
          featured={Boolean(domain.featured)}
        />
      ))}
    </div>
  );
}

export default DomainGrid;
