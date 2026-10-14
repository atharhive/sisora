"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  ExternalLink,
  Copy,
  Download,
  Check,
  Plus,
} from "lucide-react";
import { DOMAINS, DomainItem } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function ManageDomainsPage() {
  const { success } = useToast();
  const [domainList, setDomainList] = useState<DomainItem[]>(DOMAINS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    domainList.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [domainList]);

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return domainList.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        categoryFilter === "all" || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [domainList, searchQuery, categoryFilter]);

  const toggleFeatured = (id: string) => {
    setDomainList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: !d.featured } : d))
    );
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(domainList, null, 2));
    setCopied(true);
    success("Copied domains.json to clipboard!", "Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(domainList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "domains.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    success("Downloaded updated domains.json file.", "Downloaded");
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Domain Catalog Manager
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {domainList.length} total domains configured in <code className="font-semibold text-neutral-700">src/data/domains.json</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyJson}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied!" : "Copy JSON"}</span>
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download domains.json</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search domain name or tags (e.g. cloud, ai, fintech)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Domain Cards / Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/75 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Domain Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Valuation</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDomains.map((domain) => (
                <tr key={domain.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(domain.id)}
                      title={domain.featured ? "Unfeature" : "Feature on Homepage"}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          domain.featured
                            ? "fill-amber-400 text-amber-500"
                            : "text-neutral-300 hover:text-neutral-500"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900 text-sm">
                    {domain.name}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">
                    <span className="inline-block bg-neutral-100 border border-neutral-200 rounded-md px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                      {domain.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-800">
                    {domain.price ? formatPrice(domain.price) : "Make Offer"}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 max-w-xs truncate">
                    {domain.tags.join(", ")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/domains/${domain.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-black underline"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
