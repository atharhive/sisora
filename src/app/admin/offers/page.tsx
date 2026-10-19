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
  ArrowRight,
  TrendingUp,
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
  new: { bg: "bg-amber-50 border-amber-200/80 text-amber-800", text: "text-amber-800", label: "New Inquiry" },
  reviewing: { bg: "bg-blue-50 border-blue-200/80 text-blue-800", text: "text-blue-800", label: "In Review" },
  countered: { bg: "bg-purple-50 border-purple-200/80 text-purple-800", text: "text-purple-800", label: "Counter-Offered" },
  accepted: { bg: "bg-emerald-50 border-emerald-200/80 text-emerald-800", text: "text-emerald-800", label: "Accepted" },
  declined: { bg: "bg-rose-50 border-rose-200/80 text-rose-800", text: "text-rose-800", label: "Declined" },
  in_escrow: { bg: "bg-indigo-50 border-indigo-200/80 text-indigo-800", text: "text-indigo-800", label: "In Escrow" },
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

  const totalVolume = offers.reduce((acc, o) => acc + (Number(o.offer_amount) || 0), 0);
  const newCount = offers.filter((o) => o.status === "new").length;
  const escrowCount = offers.filter((o) => o.status === "in_escrow").length;

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
    <div className="space-y-6">
      {/* 1. HEADER DECK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-700">
            <BadgeDollarSign className="w-3.5 h-3.5 text-neutral-900" />
            <span>Buyer Inquiries &amp; Escrow Pipeline</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-950">
            Offers &amp; Deal Pipeline
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Review buyer bids, record offline acquisitions, and transition deals into licensed Escrow.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="group inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-neutral-300" />
          <span>Record New Offer</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      {/* 2. THREE PIPELINE METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
            Pipeline Volume
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-neutral-950 tracking-tight font-sans">
              ${totalVolume.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-neutral-400">USD</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">Sum of all active buyer inquiries</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
            New Inquiries Pending
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700 tracking-tight">
              {newCount}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Needs Review
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">Requires initial broker outreach</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
            In Escrow Transfer
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-700 tracking-tight">
              {escrowCount}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Closing
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">Secured with Escrow.com or Atom</p>
        </div>
      </div>

      {/* 3. SEARCH & STATUS FILTER BAR */}
      <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by target domain, buyer name, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/80 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shrink-0"
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

      {/* 4. OFFERS LEDGER TABLE */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
            <p className="text-xs text-neutral-500 font-mono">Loading offer pipeline...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No offers match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200/70 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Target Asset</th>
                  <th className="p-4">Offer Amount</th>
                  <th className="p-4">Buyer Identity</th>
                  <th className="p-4">Status Stepper</th>
                  <th className="p-4">Negotiation Notes</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOffers.map((o) => {
                  const badge = STATUS_BADGES[o.status] || STATUS_BADGES.new;
                  return (
                    <tr key={o.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4 pl-6">
                        <span className="font-extrabold text-neutral-950 text-sm tracking-tight block">
                          {o.domain_name || "Unassigned"}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          .SI Brokerage
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-black text-neutral-950 text-base font-sans block">
                          ${Number(o.offer_amount).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {o.currency} verified
                        </span>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-neutral-900">{o.buyer_name}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                          <Mail className="w-3 h-3 text-neutral-400" />
                          <span>{o.buyer_email}</span>
                        </div>
                        {o.buyer_phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            <span>{o.buyer_phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleQuickStatusChange(o.id, e.target.value as OfferStatus)}
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer focus:outline-none transition-all ${badge.bg}`}
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
                        {o.notes ? (
                          <span className="font-medium text-xs">{o.notes}</span>
                        ) : (
                          <span className="text-neutral-400 italic">No notes</span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(o)}
                          className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit Offer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(o.id)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* 5. MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-xl font-black text-neutral-950 tracking-tight">
                {modalMode === "add" ? "Record Offline Offer" : "Edit Offer Details"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Target Domain Asset
                </label>
                <select
                  value={form.domain_id}
                  onChange={(e) => setForm({ ...form, domain_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Offer Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.offer_amount || ""}
                    onChange={(e) => setForm({ ...form, offer_amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-black text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Deal Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as OfferStatus })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Buyer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.buyer_name || ""}
                  onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Buyer Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.buyer_email || ""}
                    onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Buyer Phone / Telegram
                  </label>
                  <input
                    type="text"
                    value={form.buyer_phone || ""}
                    onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                    placeholder="+1 ... or @telegram"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Broker Notes &amp; Counter-Offer Strategy
                </label>
                <textarea
                  rows={3}
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Private broker notes, counter-offer details, Escrow link reference..."
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer shadow-md"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === "add" ? "Record Offer" : "Update Offer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
