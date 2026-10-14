"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  RefreshCw,
  AlertCircle,
  X,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  Archive,
  Loader2,
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { Inquiry } from "@/db/schema";

function InquiriesContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Details Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiries");
      if (!res.ok) {
        throw new Error(`Failed to load inquiries (${res.status})`);
      }
      const data = await res.json();
      const list: Inquiry[] = Array.isArray(data) ? data : data.inquiries || [];
      setInquiries(list);

      // Check if specific ID was requested in search params
      if (initialId) {
        const matched = list.find((item) => item.id === initialId);
        if (matched) setSelectedInquiry(matched);
      }
    } catch (err: any) {
      setError(err?.message || "Could not retrieve inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [initialId]);

  // Update Status handler
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Fallback to PUT if PATCH not supported
        const putRes = await fetch(`/api/inquiries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!putRes.ok) throw new Error("Status update failed");
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/inquiries/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete inquiry (${res.status})`);
      }
      setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      if (selectedInquiry?.id === deleteTarget.id) {
        setSelectedInquiry(null);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.message || "Failed to delete inquiry.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered List
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        inq.name.toLowerCase().includes(query) ||
        inq.email.toLowerCase().includes(query) ||
        (inq.domainName && inq.domainName.toLowerCase().includes(query)) ||
        (inq.message && inq.message.toLowerCase().includes(query));

      const matchesType =
        typeFilter === "all" || inq.type.toLowerCase() === typeFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        inq.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [inquiries, searchQuery, typeFilter, statusFilter]);

  const typeTabs = [
    { id: "all", label: "All Types" },
    { id: "buy", label: "Buy Requests" },
    { id: "sell", label: "Sell Inquiries" },
    { id: "general", label: "General" },
  ];

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      label: "Contact",
      sortable: true,
      render: (inq) => (
        <div className="flex flex-col">
          <span className="font-bold text-neutral-900 group-hover:text-black">
            {inq.name}
          </span>
          <span className="text-xs text-neutral-500">{inq.email}</span>
        </div>
      ),
    },
    {
      key: "domainName",
      label: "Domain",
      sortable: true,
      render: (inq) => (
        <span className="font-medium text-neutral-800">
          {inq.domainName || (
            <span className="text-neutral-400 italic">General Portfolio</span>
          )}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (inq) => (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700">
          {inq.type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (inq) => <StatusBadge status={inq.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (inq) => {
        const date = inq.createdAt ? new Date(inq.createdAt) : null;
        return (
          <span className="text-xs text-neutral-500 whitespace-nowrap">
            {date
              ? date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (inq) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick status dropdown */}
          <select
            value={inq.status}
            onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
            className="text-xs py-1 px-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>

          <button
            type="button"
            onClick={() => setDeleteTarget(inq)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete inquiry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Inquiries
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Review and respond to domain purchase offers and general inquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-neutral-900" : ""}`}
          />
          <span>Refresh</span>
        </button>
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
            onClick={fetchInquiries}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Tabs and Controls */}
      <div className="space-y-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2 overflow-x-auto">
          {typeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                typeFilter === tab.id
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contact name, email, domain, or message text..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider shrink-0">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Data Table */}
      <DataTable
        columns={columns}
        data={filteredInquiries}
        loading={loading}
        onRowClick={(item) => setSelectedInquiry(item)}
        emptyTitle="No inquiries match your filter"
        emptyMessage="Inquiries submitted via website contact or purchase forms will show here."
      />

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSelectedInquiry(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in zoom-in-95 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-neutral-900 text-white">
                    {selectedInquiry.type}
                  </span>
                  <StatusBadge status={selectedInquiry.status} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mt-2">
                  {selectedInquiry.domainName ? (
                    <span>Inquiry for {selectedInquiry.domainName}</span>
                  ) : (
                    <span>General Portfolio Inquiry</span>
                  )}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Sender Name
                </span>
                <p className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedInquiry.name}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Received On
                </span>
                <p className="text-sm font-medium text-neutral-700 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedInquiry.createdAt
                    ? new Date(selectedInquiry.createdAt).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )
                    : "—"}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Email Address
                </span>
                <p className="text-sm font-medium text-neutral-900 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="hover:underline text-neutral-900"
                  >
                    {selectedInquiry.email}
                  </a>
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Phone Number
                </span>
                <p className="text-sm font-medium text-neutral-900 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedInquiry.phone ? (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="hover:underline"
                    >
                      {selectedInquiry.phone}
                    </a>
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )}
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                Inquiry Message
              </span>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {selectedInquiry.message || (
                  <span className="text-neutral-400 italic">
                    No additional message entered by buyer.
                  </span>
                )}
              </div>
            </div>

            {/* Update Status Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-600">
                  Update Status:
                </span>
                <div className="flex items-center gap-1">
                  {(["new", "replied", "closed"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        selectedInquiry.status === s
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=SISORA: Inquiry regarding ${selectedInquiry.domainName || "Domain Portfolio"}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedInquiry)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-neutral-200 transition-colors"
                  title="Delete inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Inquiry"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Inquiry"
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default function ManageInquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
          <p className="text-xs text-neutral-500 font-medium">Loading inquiries...</p>
        </div>
      }
    >
      <InquiriesContent />
    </Suspense>
  );
}

