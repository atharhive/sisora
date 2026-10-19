"use client";

import React, { useState, useEffect } from "react";
import {
  BadgeDollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Edit,
  Trash2,
  Loader2,
  X,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import {
  getAllOffers,
  saveOffer,
  updateOfferStatus,
  deleteOffer,
  getAllDomains,
} from "@/lib/actions/admin-actions";
import { Offer, DbDomain, OfferStatus } from "@/types/database";
import { useToast } from "@/components/ui/Toast";

const STATUS_BADGES: Record<OfferStatus, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-amber-50 border-amber-200 text-amber-800", text: "text-amber-800", label: "New Inquiry" },
  reviewing: { bg: "bg-blue-50 border-blue-200 text-blue-800", text: "text-blue-800", label: "In Review" },
  countered: { bg: "bg-purple-50 border-purple-200 text-purple-800", text: "text-purple-800", label: "Counter-Offered" },
  accepted: { bg: "bg-emerald-50 border-emerald-200 text-emerald-800", text: "text-emerald-800", label: "Accepted" },
  declined: { bg: "bg-rose-50 border-rose-200 text-rose-800", text: "text-rose-800", label: "Declined" },
  in_escrow: { bg: "bg-indigo-50 border-indigo-200 text-indigo-800", text: "text-indigo-800", label: "In Escrow" },
};

export default function OffersAdminPage() {
  const { success, error: toastError } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [domains, setDomains] = useState<DbDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Offer>>({
    domain_id: "",
    domain_name: "",
    buyer_name: "",
    buyer_email: "",
    buyer_phone: "",
    offer_amount: 0,
    status: "new",
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, d] = await Promise.all([getAllOffers(), getAllDomains()]);
      setOffers(o);
      setDomains(d);
    } catch {
      toastError("Failed to load offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      (o.domain_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setModalMode("add");
    setForm({
      domain_id: domains[0]?.id || "",
      domain_name: domains[0]?.name || "",
      buyer_name: "",
      buyer_email: "",
      buyer_phone: "",
      offer_amount: 5000,
      status: "new",
      notes: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (offer: Offer) => {
    setModalMode("edit");
    setForm(offer);
    setModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.domain_id || !form.buyer_name || !form.buyer_email || !form.offer_amount) {
      toastError("Please fill out all required fields.");
      return;
    }
    setSaving(true);
    const selectedDomain = domains.find((d) => d.id === form.domain_id);
    const payload = {
      ...form,
      domain_name: selectedDomain?.name || form.domain_name,
    };

    const res = await saveOffer(payload);
    setSaving(false);

    if (res.error) {
      toastError(res.error);
    } else {
      success(modalMode === "add" ? "Offer recorded successfully!" : "Offer details updated!");
      setModalOpen(false);
      loadData();
    }
  };

  const handleQuickStatusChange = async (id: string, status: OfferStatus) => {
    const res = await updateOfferStatus(id, status);
    if (res.error) {
      toastError(res.error);
    } else {
      success(`Offer marked as ${STATUS_BADGES[status].label}`);
      loadData();
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer record?")) return;
    const res = await deleteOffer(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Offer record deleted.");
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700 mb-2">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Buyer Inquiries &amp; Brokerage Negotiations</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Offers &amp; Deal Pipeline
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Review incoming acquisition requests, record offline buyer offers, track negotiations, and advance deals into Escrow.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Offer</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by domain, buyer name, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            <option value="all">All Statuses ({offers.length})</option>
            <option value="new">New Inquiries</option>
            <option value="reviewing">In Review</option>
            <option value="countered">Counter-Offered</option>
            <option value="accepted">Accepted</option>
            <option value="in_escrow">In Escrow</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-500">Loading offer pipeline...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No offers match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Target Domain</th>
                  <th className="p-4">Offer Amount</th>
                  <th className="p-4">Buyer Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Broker Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOffers.map((o) => {
                  const badge = STATUS_BADGES[o.status] || STATUS_BADGES.new;
                  return (
                    <tr key={o.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="p-4 font-bold text-neutral-900 text-sm">
                        {o.domain_name || "Unassigned"}
                      </td>
                      <td className="p-4 font-black text-neutral-900 text-sm">
                        ${Number(o.offer_amount).toLocaleString()} {o.currency}
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="font-semibold text-neutral-900">{o.buyer_name}</div>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                          <Mail className="w-3 h-3" />
                          <span>{o.buyer_email}</span>
                        </div>
                        {o.buyer_phone && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                            <Phone className="w-3 h-3" />
                            <span>{o.buyer_phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleQuickStatusChange(o.id, e.target.value as OfferStatus)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none ${badge.bg}`}
                        >
                          <option value="new">New Inquiry</option>
                          <option value="reviewing">In Review</option>
                          <option value="countered">Counter-Offered</option>
                          <option value="accepted">Accepted</option>
                          <option value="in_escrow">In Escrow</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>
                      <td className="p-4 max-w-xs text-neutral-600 truncate" title={o.notes || ""}>
                        {o.notes || <span className="text-neutral-400 italic">No notes</span>}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(o)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit Offer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(o.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Offer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {modalMode === "add" ? "Record New Offer" : "Edit Offer Details"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Target Domain
                </label>
                <select
                  value={form.domain_id}
                  onChange={(e) => setForm({ ...form, domain_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                >
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.price ? `($${d.price.toLocaleString()})` : "(Make Offer)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Offer Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.offer_amount || ""}
                    onChange={(e) => setForm({ ...form, offer_amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Deal Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as OfferStatus })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="reviewing">In Review</option>
                    <option value="countered">Counter-Offered</option>
                    <option value="accepted">Accepted</option>
                    <option value="in_escrow">In Escrow</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Buyer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.buyer_name || ""}
                  onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Buyer Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.buyer_email || ""}
                    onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Buyer Phone / Telegram
                  </label>
                  <input
                    type="text"
                    value={form.buyer_phone || ""}
                    onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                    placeholder="+1 ... or @telegram"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Broker Notes &amp; Negotiation History
                </label>
                <textarea
                  rows={3}
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Internal broker notes, counter-offer details, Escrow link reference..."
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === "add" ? "Save Offer" : "Update Offer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
