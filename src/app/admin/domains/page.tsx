"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Filter,
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatPrice } from "@/lib/utils";
import type { Domain } from "@/db/schema";

export default function ManageDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Domain | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/domains");
      if (!res.ok) {
        throw new Error(`Failed to load domains (${res.status})`);
      }
      const data = await res.json();
      setDomains(Array.isArray(data) ? data : data.domains || []);
    } catch (err: any) {
      setError(err?.message || "Could not retrieve domains list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/domains/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete domain (${res.status})`);
      }
      setDomains((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.message || "Failed to delete domain");
    } finally {
      setIsDeleting(false);
    }
  };

  // Unique categories for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    domains.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [domains]);

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return domains.filter((d) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        d.name.toLowerCase().includes(query) ||
        (d.category && d.category.toLowerCase().includes(query)) ||
        (Array.isArray(d.tags) &&
          d.tags.some((t) => t.toLowerCase().includes(query)));

      const matchesStatus =
        statusFilter === "all" || d.status.toLowerCase() === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || d.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [domains, searchQuery, statusFilter, categoryFilter]);

  const columns: Column<Domain>[] = [
    {
      key: "name",
      label: "Domain Name",
      sortable: true,
      render: (domain) => {
        const fullDomain = domain.name.endsWith(domain.extension)
          ? domain.name
          : `${domain.name}${domain.extension}`;
        return (
          <div className="flex items-center gap-2.5">
            <Link
              href={`/admin/domains/${domain.id}`}
              className="font-bold text-neutral-900 hover:text-black hover:underline"
            >
              {fullDomain}
            </Link>
            <a
              href={`/domain/${domain.slug || domain.name}`}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-neutral-700"
              title="Open public page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (domain) => (
        <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded font-medium">
          {domain.category || "General"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (domain) => {
        if (domain.priceType === "make_offer" || !domain.price) {
          return (
            <span className="text-xs font-semibold text-neutral-600">
              Make Offer
            </span>
          );
        }
        if (domain.priceType === "inquiry") {
          return (
            <span className="text-xs font-semibold text-neutral-500 italic">
              Inquire
            </span>
          );
        }
        return (
          <span className="font-semibold text-neutral-900">
            {formatPrice(domain.price)}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (domain) => <StatusBadge status={domain.status} />,
    },
    {
      key: "featured",
      label: "Featured",
      sortable: true,
      className: "text-center",
      headerClassName: "text-center",
      render: (domain) => (
        <div className="flex justify-center">
          {domain.featured ? (
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          ) : (
            <Star className="w-4 h-4 text-neutral-300" />
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (domain) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/domains/${domain.id}`}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Edit domain"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(domain)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete domain"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Manage Domains
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage your .SI domain listings, pricing, and availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDomains}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors shadow-xs"
            title="Refresh domains"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-neutral-900" : ""}`}
            />
          </button>

          <Link
            href="/admin/domains/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Domain</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchDomains}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domains by name, category, or tags..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>

          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredDomains}
        loading={loading}
        emptyTitle="No domains found"
        emptyMessage={
          searchQuery
            ? "Try adjusting your search terms or filters."
            : "Get started by adding your first .SI domain."
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Domain"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}${deleteTarget?.extension}"? This action cannot be undone.`}
        confirmText="Delete Domain"
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
