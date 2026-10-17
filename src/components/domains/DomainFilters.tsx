"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DomainFiltersProps {
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  domainType?: string;
  onDomainTypeChange?: (type: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  priceType?: string;
  onPriceTypeChange?: (type: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
  totalResults?: number;
  className?: string;
  typeCounts?: Record<string, number>;
  priceCounts?: Record<string, number>;
}

export const DOMAIN_TYPES = [
  { id: "all", label: "All Types" },
  { id: "one-word", label: "One-word" },
  { id: "ll", label: "LL" },
  { id: "lll", label: "LLL" },
  { id: "cvcv", label: "CVCV" },
];

const PRICE_RANGES = [
  { id: "all", label: "All Valuations" },
  { id: "make-offer", label: "Make an Offer" },
  { id: "25k-50k", label: "$25,000 – $50,000" },
  { id: "under-5k", label: "Under $5,000" },
  { id: "under-10k", label: "Under $10,000" },
  { id: "under-25k", label: "Under $25,000" },
  { id: "50k-plus", label: "$50,000 and above" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "alpha-asc", label: "Name: A to Z" },
];

export function DomainFilters({
  categories = [],
  selectedCategory = "",
  onSelectCategory,
  domainType = "all",
  onDomainTypeChange,
  searchQuery = "",
  onSearchChange,
  priceType = "all",
  onPriceTypeChange,
  sortBy = "featured",
  onSortChange,
  hasActiveFilters = false,
  onReset,
  totalResults,
  className,
  typeCounts,
  priceCounts,
}: DomainFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(searchInput);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    onSearchChange?.(val);
  };

  const isResetVisible =
    hasActiveFilters ||
    searchQuery !== "" ||
    selectedCategory !== "" ||
    priceType !== "all" ||
    (domainType && domainType !== "all");

  const renderFilterContent = () => (
    <div className="space-y-6 text-[#090a0c] text-left">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between pb-3.5 border-b border-neutral-200 pt-0.5">
        <div>
          <h2 className="text-base font-extrabold text-neutral-950">
            Filter Inventory
          </h2>
          {typeof totalResults === "number" && (
            <p className="text-xs text-neutral-500 mt-0.5">
              {totalResults} {totalResults === 1 ? "domain available" : "domains available"}
            </p>
          )}
        </div>

        {isResetVisible && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Keyword Search Input */}
      <div className="space-y-2">
        <label
          htmlFor="filter-search-input"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-600"
        >
          Keyword Search
        </label>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            id="filter-search-input"
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search keywords, e.g. pay, money..."
            className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onSearchChange?.("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Domain Type Filter: One-word, LL, LLL, CVCV */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
            Structure / Type
          </label>
          {domainType !== "all" && (
            <span className="text-[10px] font-semibold text-neutral-400">
              Active
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {DOMAIN_TYPES.map((type) => {
            const isSelected = domainType === type.id;
            const count = typeCounts?.[type.id];
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onDomainTypeChange?.(isSelected && type.id !== "all" ? "all" : type.id)}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer active:scale-95",
                  type.id === "all" ? "col-span-2" : "col-span-1",
                  isSelected
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/60"
                )}
              >
                <span>{type.label}</span>
                {typeof count === "number" && (
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded ml-1 shrink-0",
                      isSelected
                        ? "bg-neutral-800 text-white"
                        : "bg-neutral-200/70 text-neutral-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Valuation Range Filter - Placed prominently so it's immediately visible */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
            Valuation Range
          </label>
          {priceType !== "all" && (
            <span className="text-[10px] font-semibold text-neutral-400">
              Active
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = priceType === range.id;
            const count = priceCounts?.[range.id];
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onPriceTypeChange?.(isSelected && range.id !== "all" ? "all" : range.id)}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer active:scale-95",
                  range.id === "all" ? "col-span-2" : "col-span-1",
                  isSelected
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/60"
                )}
              >
                <span className="truncate">{range.label}</span>
                {typeof count === "number" && (
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded ml-1 shrink-0",
                      isSelected
                        ? "bg-neutral-800 text-white"
                        : "bg-neutral-200/70 text-neutral-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Dropdown */}
      {categories.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <label
              htmlFor="filter-category-select"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-600"
            >
              Industry Category
            </label>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory?.("")}
                className="text-[10px] font-semibold text-neutral-500 hover:text-black underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <select
            id="filter-category-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory?.(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-2xs"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Compact Search & Filter Row */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search .SI domains..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-9 pr-8 text-xs text-neutral-900 focus:border-black focus:outline-none shadow-2xs"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onSearchChange?.("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-900 shadow-2xs shrink-0 cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
          {isResetVisible && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white">
              •
            </span>
          )}
        </button>
      </div>

      {/* Desktop Panel */}
      <div className={cn("hidden lg:block w-full", className)}>
        {renderFilterContent()}
      </div>

      {/* Mobile Modal Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
        >
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="text-base font-extrabold text-neutral-950">
                Filter Domains
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 pr-1">
              {renderFilterContent()}
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-neutral-950 py-3 text-center text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Show Results ({totalResults ?? 0})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DomainFilters;
