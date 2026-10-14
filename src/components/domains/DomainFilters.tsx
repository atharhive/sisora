"use client";

import React, { useState } from "react";
import { Search, RotateCcw, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  keyword: string;
  domainTypes: string[];
  categories: string[];
  priceRanges: string[];
  sortBy: string;
}

export interface DomainFiltersProps {
  // Legacy / Direct page props
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  priceType?: string;
  onPriceTypeChange?: (type: string) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;

  // Structured filter props
  filters?: FilterState;
  onChange?: (filters: FilterState) => void;
  totalResults?: number;
  className?: string;
}

const DEFAULT_DOMAIN_TYPES = [
  { id: ".si", label: ".si" },
  { id: ".com", label: ".com" },
  { id: ".net", label: ".net" },
  { id: ".org", label: ".org" },
  { id: ".io", label: ".io" },
];

const DEFAULT_CATEGORIES = [
  { id: "one-word", label: "One Word" },
  { id: "premium", label: "Premium" },
  { id: "dictionary-word", label: "Dictionary Word" },
  { id: "brandable", label: "Brandable" },
  { id: "technology", label: "Technology" },
  { id: "finance", label: "Finance" },
];

const PRICE_RANGES = [
  { id: "under-500", label: "Under $500" },
  { id: "500-1000", label: "$500 - $1,000" },
  { id: "1000-5000", label: "$1,000 - $5,000" },
  { id: "5000-10000", label: "$5,000 - $10,000" },
  { id: "over-10000", label: "$10,000+" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha-asc", label: "Name: A to Z" },
  { value: "newest", label: "Recently Added" },
];

export function DomainFilters({
  categories: passedCategories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  priceType,
  onPriceTypeChange,
  hasActiveFilters,
  onReset,
  filters: externalFilters,
  onChange,
  totalResults,
  className,
}: DomainFiltersProps) {
  const [internalState, setInternalState] = useState<FilterState>({
    keyword: searchQuery || "",
    domainTypes: [".si"],
    categories: selectedCategory ? [selectedCategory] : [],
    priceRanges: [],
    sortBy: "featured",
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const currentKeyword =
    typeof searchQuery === "string" ? searchQuery : (externalFilters?.keyword ?? internalState.keyword);

  const activeCategories = passedCategories && passedCategories.length > 0
    ? passedCategories.map((c) => ({ id: c.toLowerCase(), label: c }))
    : DEFAULT_CATEGORIES;

  const currentCategoryList = selectedCategory
    ? [selectedCategory.toLowerCase()]
    : (externalFilters?.categories ?? internalState.categories);

  const currentDomainTypes = externalFilters?.domainTypes ?? internalState.domainTypes;
  const currentPriceRanges = externalFilters?.priceRanges ?? internalState.priceRanges;
  const currentSortBy = externalFilters?.sortBy ?? internalState.sortBy;

  const handleKeywordChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      const next = { ...internalState, keyword: val };
      setInternalState(next);
      onChange?.(next);
    }
  };

  const toggleCategory = (catLabel: string) => {
    if (onSelectCategory) {
      const isSelected = selectedCategory?.toLowerCase() === catLabel.toLowerCase();
      onSelectCategory(isSelected ? "" : catLabel);
    } else {
      const catId = catLabel.toLowerCase();
      const exists = currentCategoryList.includes(catId);
      const nextCategories = exists
        ? currentCategoryList.filter((c) => c !== catId)
        : [...currentCategoryList, catId];
      const next = { ...internalState, categories: nextCategories };
      setInternalState(next);
      onChange?.(next);
    }
  };

  const toggleDomainType = (typeId: string) => {
    const exists = currentDomainTypes.includes(typeId);
    const nextTypes = exists
      ? currentDomainTypes.filter((t) => t !== typeId)
      : [...currentDomainTypes, typeId];
    const next = { ...internalState, domainTypes: nextTypes };
    setInternalState(next);
    onChange?.(next);
  };

  const togglePriceRange = (rangeId: string) => {
    if (onPriceTypeChange) {
      // Map to priceType if available
      onPriceTypeChange(priceType === rangeId ? "all" : rangeId);
    }
    const exists = currentPriceRanges.includes(rangeId);
    const nextRanges = exists
      ? currentPriceRanges.filter((r) => r !== rangeId)
      : [...currentPriceRanges, rangeId];
    const next = { ...internalState, priceRanges: nextRanges };
    setInternalState(next);
    onChange?.(next);
  };

  const handleSortChange = (sortBy: string) => {
    const next = { ...internalState, sortBy };
    setInternalState(next);
    onChange?.(next);
  };

  const handleResetAll = () => {
    if (onReset) {
      onReset();
    }
    const resetState: FilterState = {
      keyword: "",
      domainTypes: [".si"],
      categories: [],
      priceRanges: [],
      sortBy: "featured",
    };
    setInternalState(resetState);
    onChange?.(resetState);
  };

  const isResetVisible =
    Boolean(hasActiveFilters) ||
    Boolean(currentKeyword) ||
    (selectedCategory ? selectedCategory !== "" : currentCategoryList.length > 0) ||
    currentPriceRanges.length > 0;

  const FilterPanelContent = () => (
    <div className="space-y-6 text-neutral-900 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            Filter Domains
          </h2>
          {typeof totalResults === "number" && (
            <p className="text-xs text-neutral-500 mt-0.5">
              {totalResults} {totalResults === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        {isResetVisible && (
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            id="filter-search-input"
            type="text"
            value={currentKeyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="Search keywords, letters..."
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Sort By Select Dropdown */}
      <div className="space-y-2">
        <label
          htmlFor="filter-sort-select"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-600"
        >
          Sort By
        </label>
        <div className="relative">
          <select
            id="filter-sort-select"
            value={currentSortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-neutral-300 bg-white py-2 pl-3 pr-8 text-xs sm:text-sm text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Domain Type Checkboxes */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
          Domain Type
        </label>
        <div className="space-y-2">
          {DEFAULT_DOMAIN_TYPES.map((type) => {
            const checked = currentDomainTypes.includes(type.id);
            return (
              <label
                key={type.id}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700 hover:text-black cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDomainType(type.id)}
                  className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                />
                <span className={cn(checked && "font-semibold text-black")}>
                  {type.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category Checkboxes */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
          Category
        </label>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {activeCategories.map((cat) => {
            const isSelected = selectedCategory
              ? selectedCategory.toLowerCase() === cat.label.toLowerCase()
              : currentCategoryList.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700 hover:text-black cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(cat.label)}
                  className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                />
                <span className={cn(isSelected && "font-semibold text-black")}>
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Checkboxes */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
          Price Range
        </label>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isSelected = priceType
              ? priceType === range.id
              : currentPriceRanges.includes(range.id);
            return (
              <label
                key={range.id}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-700 hover:text-black cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePriceRange(range.id)}
                  className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                />
                <span className={cn(isSelected && "font-semibold text-black")}>
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-neutral-600" />
            <span>Filter Domains</span>
          </div>
          {isResetVisible && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
              •
            </span>
          )}
        </button>
      </div>

      {/* Desktop Panel */}
      <div className={cn("w-full", className)}>
        <FilterPanelContent />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="text-base font-bold text-neutral-950">
                Filter Domains
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-black cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 pr-1">
              <FilterPanelContent />
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-black py-3 text-center text-sm font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DomainFilters;
