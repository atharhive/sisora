"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Sparkles,
} from "lucide-react";
import { SAMPLE_DOMAINS, getAllCategories } from "@/lib/data/sample-domains";
import { DomainGrid } from "@/components/domains/DomainGrid";
import { DomainFilters } from "@/components/domains/DomainFilters";
import { Button } from "@/components/ui/Button";

const ITEMS_PER_PAGE = 6;

function BuyDomainsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile filters open state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read state from URL
  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const priceType = searchParams.get("priceType") || "all";
  const sortBy = searchParams.get("sort") || "featured";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Helper to update search params
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "page" && value === "1") || (key === "priceType" && value === "all")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const categories = useMemo(() => getAllCategories(), []);

  // Filter and sort domains
  const filteredDomains = useMemo(() => {
    return SAMPLE_DOMAINS.filter((d) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = d.name.toLowerCase().includes(query);
        const matchesDesc = d.description?.toLowerCase().includes(query);
        const matchesTag = d.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      // Category filter
      if (
        selectedCategory &&
        d.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Price type filter
      if (priceType === "fixed" && (!d.price || d.priceType !== "fixed")) {
        return false;
      }
      if (priceType === "make_offer" && d.priceType !== "make_offer") {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "az") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "za") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "price_asc") {
        const pA = a.price ?? 9999999;
        const pB = b.price ?? 9999999;
        return pA - pB;
      }
      if (sortBy === "price_desc") {
        const pA = a.price ?? 0;
        const pB = b.price ?? 0;
        return pB - pA;
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // default: featured first, then price desc
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.price ?? 0) - (a.price ?? 0);
    });
  }, [searchQuery, selectedCategory, priceType, sortBy]);

  // Pagination calculation
  const totalItems = filteredDomains.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedDomains = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredDomains.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDomains, safePage]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory || priceType !== "all" || sortBy !== "featured"
  );

  const handleResetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header section */}
      <section className="border-b border-zinc-900 bg-zinc-950/40 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary .SI Exchange</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Buy .SI Domains
              </h1>
              <p className="mt-3 text-base text-zinc-400 max-w-2xl leading-relaxed">
                Explore verified, premium Slovenian country-code and generic keyword digital real estate. All assets ready for instant acquisition through licensed escrow.
              </p>
            </div>

            {/* Mobile Filter Toggle & Counter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg">
                {totalItems} Available Asset{totalItems === 1 ? "" : "s"}
              </span>
              <Button
                variant="outline"
                size="md"
                className="md:hidden flex items-center gap-2"
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar (Left Col) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-zinc-850 bg-zinc-950/70 p-6 backdrop-blur-md">
              <DomainFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => updateParams({ category: cat, page: "1" })}
                searchQuery={searchQuery}
                onSearchChange={(q) => updateParams({ q: q, page: "1" })}
                priceType={priceType}
                onPriceTypeChange={(type) => updateParams({ priceType: type, page: "1" })}
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Right Column: Sort bar + DomainGrid + Pagination */}
          <main className="lg:col-span-3 space-y-6">
            {/* Sorting & results toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-850 bg-zinc-950/50">
              <div className="text-xs sm:text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-white font-mono">
                  {totalItems > 0 ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                  {Math.min(safePage * ITEMS_PER_PAGE, totalItems)}
                </span>{" "}
                of <span className="font-semibold text-white font-mono">{totalItems}</span> domains
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-zinc-500" />
                <span className="text-xs text-zinc-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateParams({ sort: e.target.value, page: "1" })}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-500 font-medium cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="az">Name: A to Z</option>
                  <option value="za">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <DomainGrid domains={paginatedDomains} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-400">
                  Page <span className="font-mono text-white font-semibold">{safePage}</span> of{" "}
                  <span className="font-mono text-white font-semibold">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => updateParams({ page: String(safePage - 1) })}
                    className="gap-1 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === safePage;
                      return (
                        <button
                          key={p}
                          onClick={() => updateParams({ page: String(p) })}
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-colors ${
                            isActive
                              ? "bg-white text-black font-bold"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => updateParams({ page: String(safePage + 1) })}
                    className="gap-1 text-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-zinc-950 border-l border-zinc-800 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <span className="font-bold text-white text-lg">Filter Portfolio</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <DomainFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => updateParams({ category: cat, page: "1" })}
                searchQuery={searchQuery}
                onSearchChange={(q) => updateParams({ q: q, page: "1" })}
                priceType={priceType}
                onPriceTypeChange={(type) => updateParams({ priceType: type, page: "1" })}
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            <div className="pt-6 border-t border-zinc-900">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyDomainsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
          Loading domain portfolio...
        </div>
      }
    >
      <BuyDomainsContent />
    </Suspense>
  );
}
