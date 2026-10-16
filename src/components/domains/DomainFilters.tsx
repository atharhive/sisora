"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DomainFiltersProps {
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
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
}

const PRICE_RANGES = [
  { id: "all", label: "All Valuations" },
  { id: "under-25k", label: "Under $25,000" },
  { id: "25k-50k", label: "$25,000 – $50,000" },
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

  const isResetVisible = hasActiveFilters || searchQuery !== "" || selectedCategory !== "" || priceType !== "all";

  const renderFilterContent = () => (
    <div className="space-y-6 text-[#090a0c] text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
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
            placeholder="Search keywords, e.g. pay, ai..."
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

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
            Category
          </label>
          <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory?.("")}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer",
                selectedCategory === ""
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <span>All Categories</span>
              {selectedCategory === "" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory?.(isSelected ? "" : cat)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  <span className="truncate">{cat}</span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
          Valuation Range
        </label>
        <div className="flex flex-col gap-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = priceType === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onPriceTypeChange?.(isSelected && range.id !== "all" ? "all" : range.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer",
                  isSelected
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                )}
              >
                <span>{range.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-300 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-neutral-900 shadow-xs hover:bg-neutral-50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
            <span>Filter Domains</span>
          </div>
          {isResetVisible && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white">
              •
            </span>
          )}
        </button>
      </div>

      {/* Desktop Panel */}
      <div className={cn("w-full", className)}>
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
