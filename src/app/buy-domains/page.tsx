"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ArrowUpDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";
import { DOMAINS, getDomainType } from "@/lib/data";
import { DomainGrid } from "@/components/domains/DomainGrid";
import { DomainTableView } from "@/components/domains/DomainTableView";
import { DomainFilters } from "@/components/domains/DomainFilters";
import { BuyingRequestForm } from "@/components/forms/BuyingRequestForm";
import { cn } from "@/lib/utils";

const TYPE_TABS = [
  { id: "all", label: "All" },
  { id: "one-word", label: "One-word" },
  { id: "ll", label: "LL" },
  { id: "lll", label: "LLL" },
  { id: "cvcv", label: "CVCV" },
];

function BuyDomainsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [buyingModalOpen, setBuyingModalOpen] = useState(false);
  
  // Default view is "grid" (Cards view), can be toggled to "table"
  const initialView = searchParams.get("view") === "table" ? "table" : "grid";
  const [viewMode, setViewMode] = useState<"table" | "grid">(initialView);

  // Read state from URL
  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedType = searchParams.get("type") || "all";
  const priceType = searchParams.get("priceType") || "all";
  const sortBy = searchParams.get("sort") || "featured";

  // Helper to update search params
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        (key === "priceType" && value === "all") ||
        (key === "type" && value === "all")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    DOMAINS.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, []);

  // Compute counts for the tabs
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: DOMAINS.length,
      "one-word": 0,
      ll: 0,
      lll: 0,
      cvcv: 0,
    };
    DOMAINS.forEach((d) => {
      const t = getDomainType(d).toLowerCase().replace(/[^a-z0-9]/g, "");
      if (t === "oneword" || t === "word") counts["one-word"]++;
      else if (t === "ll") counts["ll"]++;
      else if (t === "lll") counts["lll"]++;
      else if (t === "cvcv") counts["cvcv"]++;
    });
    return counts;
  }, []);

  // Filter and sort domains
  const filteredDomains = useMemo(() => {
    return DOMAINS.filter((d) => {
      // Structure / Type filter
      if (selectedType !== "all") {
        const dType = getDomainType(d).toLowerCase().replace(/[^a-z0-9]/g, "");
        const targetType = selectedType.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (dType !== targetType) return false;
      }

      // Search filter across name, description, tags, and category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = d.name.toLowerCase().includes(query);
        const matchesDesc = d.description?.toLowerCase().includes(query);
        const matchesTag = d.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = d.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTag && !matchesCategory) return false;
      }

      // Category filter
      if (
        selectedCategory &&
        d.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Valuation Range filter
      if (priceType === "under-25k" && (d.price === null || d.price >= 25000)) return false;
      if (priceType === "25k-50k" && (d.price === null || d.price < 25000 || d.price > 50000)) return false;
      if (priceType === "50k-plus" && (d.price === null || d.price < 50000)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "alpha-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "price-asc") {
        const pA = a.price ?? 9999999;
        const pB = b.price ?? 9999999;
        return pA - pB;
      }
      if (sortBy === "price-desc") {
        const pA = a.price ?? 0;
        const pB = b.price ?? 0;
        return pB - pA;
      }
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedType, searchQuery, selectedCategory, priceType, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedCategory ||
      selectedType !== "all" ||
      priceType !== "all" ||
      sortBy !== "featured"
  );

  const handleResetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#090a0c]">
      {/* Header section with exact PDF text */}
      <section className="border-b border-neutral-200/90 bg-[#ebedf0]/60 py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <div className="max-w-3xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-700 shadow-2xs">
                <Sparkles className="h-3 w-3 text-neutral-900" />
                <span>Primary .SI Acquisition Desk</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight font-sans">
                Buy .SI Domains
              </h1>
              <p className="text-xs sm:text-base lg:text-lg text-neutral-600 leading-relaxed">
                Explore verified, premium SI (Super Intelligence) and generic keyword digital real estate. All assets ready for instant acquisition through licensed <span className="font-semibold text-neutral-900">Escrow.com</span> and <span className="font-semibold text-neutral-900">Atom.com</span>.
              </p>
            </div>

            {/* Direct CTA button from PDF */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBuyingModalOpen(true)}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 sm:px-7 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
              >
                <span>Submit a Buying Request</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog with Reference Image Inspired Header & Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar - Sticky while domains scroll */}
          <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 lg:self-start rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <DomainFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => updateParams({ category: cat })}
              domainType={selectedType}
              onDomainTypeChange={(type) => updateParams({ type })}
              searchQuery={searchQuery}
              onSearchChange={(q) => updateParams({ q })}
              priceType={priceType}
              onPriceTypeChange={(type) => updateParams({ priceType: type })}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
              totalResults={filteredDomains.length}
            />
          </aside>

          {/* Catalog Listing */}
          <main className="lg:col-span-3 space-y-6">
            {/* Curated Section Header & Filter Tabs (from reference image) */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 font-sans">
                    Domains for Sale
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                    A curated selection of premium One-word, LL, LLL, and CVCV .SI domains.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-500 shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Escrow.com &amp; Atom.com Verified</span>
                </div>
              </div>

              {/* Working Filter Tabs matching reference image */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100">
                {TYPE_TABS.map((tab) => {
                  const isActive = selectedType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => updateParams({ type: tab.id })}
                      className={cn(
                        "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95",
                        isActive
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "bg-white text-neutral-700 hover:bg-neutral-100 hover:text-black border border-neutral-300/80 shadow-2xs"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={cn(
                          "text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded",
                          isActive
                            ? "bg-neutral-800 text-white"
                            : "bg-neutral-100 text-neutral-500"
                        )}
                      >
                        {typeCounts[tab.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sorting & View Toggle Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
              <div className="text-xs sm:text-sm text-neutral-600">
                Showing <span className="font-bold text-neutral-950">{filteredDomains.length}</span> verified .SI {filteredDomains.length === 1 ? "asset" : "assets"}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                {/* View Mode Toggle: Cards (default) vs Curated Table */}
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("grid");
                      updateParams({ view: null });
                    }}
                    title="Card Grid View (Default)"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95",
                      viewMode === "grid"
                        ? "bg-white text-neutral-950 shadow-2xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("table");
                      updateParams({ view: "table" });
                    }}
                    title="Curated Table View"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95",
                      viewMode === "table"
                        ? "bg-white text-neutral-950 shadow-2xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5">
                  <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-neutral-500">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Sort:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-900 focus:border-black focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="alpha-asc">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer Trigger */}
            <div className="lg:hidden">
              <DomainFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => updateParams({ category: cat })}
                domainType={selectedType}
                onDomainTypeChange={(type) => updateParams({ type })}
                searchQuery={searchQuery}
                onSearchChange={(q) => updateParams({ q })}
                priceType={priceType}
                onPriceTypeChange={(type) => updateParams({ priceType: type })}
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                totalResults={filteredDomains.length}
              />
            </div>

            {/* Curated Table or Grid view based on toggle */}
            {viewMode === "table" ? (
              <DomainTableView
                domains={filteredDomains}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <DomainGrid
                domains={filteredDomains}
                onResetFilters={handleResetFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modal for "Submit a Buying Request" */}
      {buyingModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setBuyingModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Buyer Mandate
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-950 font-sans">
                  Submit a Buying Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBuyingModalOpen(false)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-black cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <BuyingRequestForm onSuccess={() => setBuyingModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyDomainsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f5f7]" />}>
      <BuyDomainsContent />
    </Suspense>
  );
}
