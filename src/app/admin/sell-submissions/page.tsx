"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Send,
  Mail,
  Phone,
  Trash2,
  RefreshCw,
  AlertCircle,
  X,
  ExternalLink,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { SellSubmission } from "@/db/schema";

export default function SellSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Submission Detail Modal
  const [selectedSubmission, setSelectedSubmission] =
    useState<SellSubmission | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<SellSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sell-submissions");
      if (!res.ok) {
        throw new Error(`Failed to load sell submissions (${res.status})`);
      }
      const data = await res.json();
      setSubmissions(
        Array.isArray(data) ? data : data.submissions || []
      );
    } catch (err: any) {
      setError(err?.message || "Could not retrieve sell submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/sell-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Fallback to PUT
        const putRes = await fetch(`/api/sell-submissions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!putRes.ok) throw new Error("Status update failed");
      }

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update submission status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sell-submissions/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete submission (${res.status})`);
      }
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (selectedSubmission?.id === deleteTarget.id) {
        setSelectedSubmission(null);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.message || "Failed to delete submission.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sub.domainName.toLowerCase().includes(q) ||
        sub.ownerName.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        (sub.description && sub.description.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" ||
        sub.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const columns: Column<SellSubmission>[] = [
    {
      key: "domainName",
      label: "Domain Name",
      sortable: true,
      render: (sub) => (
        <span className="font-bold text-neutral-900 text-sm group-hover:text-black">
          {sub.domainName}
        </span>
      ),
    },
    {
      key: "ownerName",
      label: "Owner",
      sortable: true,
      render: (sub) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900">{sub.ownerName}</span>
          {sub.phone && (
            <span className="text-xs text-neutral-500">{sub.phone}</span>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (sub) => (
        <a
          href={`mailto:${sub.email}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-neutral-700 hover:text-black hover:underline"
        >
          {sub.email}
        </a>
      ),
    },
    {
      key: "askingPrice",
      label: "Asking Price",
      sortable: true,
      render: (sub) => (
        <span className="font-semibold text-neutral-900 text-xs">
          {sub.askingPrice ? (
            sub.askingPrice.startsWith("$") || isNaN(Number(sub.askingPrice)) ? (
              sub.askingPrice
            ) : (
              `$${Number(sub.askingPrice).toLocaleString()}`
            )
          ) : (
            <span className="text-neutral-400 font-normal italic">Open to offer</span>
          )}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (sub) => <StatusBadge status={sub.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (sub) => {
        const date = sub.createdAt ? new Date(sub.createdAt) : null;
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
      render: (sub) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick status selector */}
          <select
            value={sub.status}
            onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
            className="text-xs py-1 px-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
          >
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={() => setDeleteTarget(sub)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete submission"
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
            Sell Submissions
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Domains submitted by external owners for brokerage and listing consideration.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSubmissions}
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
            onClick={fetchSubmissions}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by domain name, owner, email, or description..."
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
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredSubmissions}
        loading={loading}
        onRowClick={(item) => setSelectedSubmission(item)}
        emptyTitle="No sell submissions"
        emptyMessage="When domain owners submit their .SI domains for valuation or sale, they will appear here."
      />

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setSelectedSubmission(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in zoom-in-95 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Sell Submission
                  </span>
                  <StatusBadge status={selectedSubmission.status} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mt-1">
                  {selectedSubmission.domainName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Domain Owner
                </span>
                <p className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedSubmission.ownerName}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Asking Price
                </span>
                <p className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedSubmission.askingPrice
                    ? selectedSubmission.askingPrice
                    : "Not specified (Open to offers)"}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Email Address
                </span>
                <p className="text-sm font-medium text-neutral-900 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="hover:underline text-neutral-900"
                  >
                    {selectedSubmission.email}
                  </a>
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Phone Number
                </span>
                <p className="text-sm font-medium text-neutral-900 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedSubmission.phone ? (
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  ) : (
                    <span className="text-neutral-400 italic">Not provided</span>
                  )}
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Submission Date
                </span>
                <p className="text-xs font-medium text-neutral-700 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedSubmission.createdAt
                    ? new Date(selectedSubmission.createdAt).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )
                    : "—"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                Domain Description & Notes
              </span>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap min-h-[90px]">
                {selectedSubmission.description || (
                  <span className="text-neutral-400 italic">
                    No additional details provided by the owner.
                  </span>
                )}
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-600">
                  Status:
                </span>
                <div className="flex items-center gap-1">
                  {(["pending", "reviewing", "accepted", "rejected"] as const).map(
                    (s) => (
                      <button
                        key={s}
                        disabled={statusUpdating}
                        onClick={() =>
                          handleUpdateStatus(selectedSubmission.id, s)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                          selectedSubmission.status === s
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=SISORA: Regarding your domain submission ${selectedSubmission.domainName}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Owner</span>
                </a>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedSubmission)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-neutral-200 transition-colors"
                  title="Delete submission"
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
        title="Delete Sell Submission"
        message={`Are you sure you want to delete the sell submission for "${deleteTarget?.domainName}" from ${deleteTarget?.ownerName}?`}
        confirmText="Delete Submission"
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
