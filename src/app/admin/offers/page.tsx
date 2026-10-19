"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowLeft,
  Copy,
  ExternalLink,
  Send,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  getAllOffers,
  saveOffer,
  updateOfferStatus,
  deleteOffer,
  replyToOfferAction,
  testBrokerEmailAction,
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

type ReplyTemplateKey = "general" | "counter" | "accept";

const TEMPLATES: Record<
  ReplyTemplateKey,
  (domain: string, name: string, amount: number) => { subject: string; body: string }
> = {
  general: (domain, name) => ({
    subject: `SISORA Brokerage: Regarding your inquiry on ${domain}`,
    body: `Hi ${name},

Thank you for your interest in ${domain}.

We have received your acquisition inquiry and would be pleased to assist you with pricing terms, escrow transfer options, and the acquisition timeline.

Please let us know your preferred budget range or if you would like to proceed with standard escrow closing via Escrow.com or Atom.com.

Best regards,
SISORA Domain Brokerage Desk
sisorasales@gmail.com
https://sisora.si`,
  }),
  counter: (domain, name, amount) => ({
    subject: `SISORA Brokerage: Counter-Offer for ${domain}`,
    body: `Hi ${name},

Thank you for submitting your offer on ${domain}.

We have reviewed your proposed terms with the seller. While your initial offer of $${Number(amount).toLocaleString()} USD has been noted, the current reserve price for this premium asset is higher.

Please let us know if you would be open to discussing terms in this range so we can structure a win-win agreement.

Best regards,
SISORA Domain Brokerage Desk
sisorasales@gmail.com
https://sisora.si`,
  }),
  accept: (domain, name, amount) => ({
    subject: `SISORA Brokerage: Offer Accepted for ${domain}`,
    body: `Hi ${name},

We are pleased to inform you that your offer of $${Number(amount).toLocaleString()} USD for ${domain} has been accepted by the seller!

We will now initiate a secure closing via licensed escrow (Escrow.com / Atom.com). To prepare the escrow agreement, please confirm:
1. Legal Entity / Buyer Full Name
2. Registered Business or Personal Address
3. Designated Registrant / DNS Technical Contact

Best regards,
SISORA Domain Brokerage Desk
sisorasales@gmail.com
https://sisora.si`,
  }),
};

export default function OffersAdminPage() {
  const { success, error: toastError } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [domains, setDomains] = useState<DbDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [testingEmail, setTestingEmail] = useState(false);

  // Edit / Add modal states
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

  // Dedicated Reply Modal state
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyOffer, setReplyOffer] = useState<Offer | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ReplyTemplateKey>("general");
  const [sendingReply, setSendingReply] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dedicated Full Note View Modal
  const [viewNoteOffer, setViewNoteOffer] = useState<Offer | null>(null);

  // Dedicated Delete Confirmation Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  // Only sum verified cash offers (> 1) so $1 or $0 inquiries don't skew the metric
  const totalVolume = offers.reduce(
    (acc, o) => acc + (Number(o.offer_amount) > 1 ? Number(o.offer_amount) : 0),
    0
  );
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
    if (!form.domain_id || !form.buyer_name || !form.buyer_email || form.offer_amount === undefined) {
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

  // Test email delivery
  const handleTestEmail = async () => {
    setTestingEmail(true);
    const res = await testBrokerEmailAction();
    setTestingEmail(false);
    if (res.success) {
      success(res.message || "Test email delivered successfully!");
    } else {
      toastError(res.error || "Failed to deliver test email.");
    }
  };

  // Reply handlers
  const handleOpenReplyModal = (offer: Offer) => {
    setReplyOffer(offer);
    const tpl = TEMPLATES.general(offer.domain_name || "Domain Asset", offer.buyer_name, Number(offer.offer_amount) || 0);
    setReplySubject(tpl.subject);
    setReplyBody(tpl.body);
    setSelectedTemplate("general");
    setCopied(false);
    setReplyModalOpen(true);
  };

  const handleApplyTemplate = (tplKey: ReplyTemplateKey) => {
    if (!replyOffer) return;
    setSelectedTemplate(tplKey);
    const tpl = TEMPLATES[tplKey](replyOffer.domain_name || "Domain Asset", replyOffer.buyer_name, Number(replyOffer.offer_amount) || 0);
    setReplySubject(tpl.subject);
    setReplyBody(tpl.body);
  };

  const handleOpenGmail = () => {
    if (!replyOffer) return;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(replyOffer.buyer_email)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
    window.open(url, "_blank");
  };

  const handleOpenMailApp = () => {
    if (!replyOffer) return;
    // RFC 6068: do NOT encode the recipient email with %40
    const url = `mailto:${replyOffer.buyer_email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
    window.location.href = url;
  };

  const handleCopyReply = async () => {
    if (!replyOffer) return;
    const fullText = `To: ${replyOffer.buyer_email}\nSubject: ${replySubject}\n\n${replyBody}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      success("Reply message copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toastError("Could not copy text to clipboard.");
    }
  };

  const handleSendDirectEmail = async () => {
    if (!replyOffer) return;
    setSendingReply(true);
    const res = await replyToOfferAction(replyOffer.id, {
      to: replyOffer.buyer_email,
      subject: replySubject,
      body: replyBody,
      domain_name: replyOffer.domain_name || undefined,
    });
    setSendingReply(false);

    if (res.error) {
      const isSandboxIssue =
        res.error.includes("Sandbox") ||
        res.error.includes("own email address") ||
        res.error.includes("validation_error");
      toastError(
        isSandboxIssue
          ? "Resend test sandbox cannot email external buyers. Click 'Open in Gmail Web' to reply instantly!"
          : res.error
      );
    } else {
      success(`Email sent directly to ${replyOffer.buyer_email}!`);
      setReplyModalOpen(false);
      loadData();
    }
  };

  // Delete modal handlers
  const handleOpenDeleteModal = (offer: Offer) => {
    setOfferToDelete(offer);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    const targetId = offerToDelete.id;
    setDeleting(true);

    // Optimistically remove from state so UI updates instantly
    setOffers((prev) => prev.filter((o) => o.id !== targetId));
    setDeleteModalOpen(false);

    const res = await deleteOffer(targetId);
    setDeleting(false);

    if (res.error) {
      toastError(res.error);
      loadData(); // Revert back if database reported an error
    } else {
      success("Offer record deleted successfully.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER DECK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors mb-1 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Offers &amp; Deal Pipeline
          </h2>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal">
            Review buyer bids, record offline acquisitions, and transition deals into licensed Escrow.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleTestEmail}
            disabled={testingEmail}
            className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer active:scale-[0.98] disabled:opacity-60"
            title="Send test email to verify Resend setup"
          >
            {testingEmail ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Mail className="w-3.5 h-3.5 text-neutral-600" />
            )}
            <span>Test Email Setup</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="group inline-flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-[0.98] cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-300" />
            <span>Record New Offer</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. THREE PIPELINE METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Pipeline Volume
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-sans">
              ${totalVolume.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-neutral-400">USD</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">Sum of all verified buyer cash offers</p>
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
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-neutral-50 border-b border-neutral-200/70 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Target Asset</th>
                  <th className="p-4">Offer Amount</th>
                  <th className="p-4">Buyer Identity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Negotiation Notes</th>
                  <th className="p-4 pr-6 text-right min-w-[190px]">Actions</th>
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
                        {Number(o.offer_amount) > 1 ? (
                          <>
                            <span className="font-black text-neutral-950 text-base font-sans block">
                              ${Number(o.offer_amount).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {o.currency} verified
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 font-bold text-xs">
                              Price on Request
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                              Make offer inquiry
                            </span>
                          </>
                        )}
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

                      <td className="p-4 max-w-xs">
                        {o.notes ? (
                          <div className="space-y-1">
                            <p className="font-medium text-xs text-neutral-700 line-clamp-2">
                              {o.notes}
                            </p>
                            <button
                              type="button"
                              onClick={() => setViewNoteOffer(o)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-900 hover:text-black hover:underline transition-colors cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-neutral-500" />
                              <span>View Full Notes</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic text-xs">No notes</span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReplyModal(o)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                            title={`Reply directly to ${o.buyer_email}`}
                          >
                            <Mail className="w-3.5 h-3.5 text-neutral-300" />
                            <span>Reply</span>
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(o)}
                            className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(o)}
                            className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. DEDICATED FULL NOTE & INQUIRY MODAL */}
      {viewNoteOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Inquiry &amp; Deal Dossier
                </span>
                <h3 className="text-xl font-black text-neutral-950 tracking-tight mt-0.5">
                  {viewNoteOffer.domain_name || "Domain Asset"}
                </h3>
              </div>
              <button
                onClick={() => setViewNoteOffer(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Buyer Details</span>
                <span className="font-bold text-neutral-950 block mt-0.5">{viewNoteOffer.buyer_name}</span>
                <span className="text-neutral-500 block truncate">{viewNoteOffer.buyer_email}</span>
                {viewNoteOffer.buyer_phone && <span className="text-neutral-500 block">{viewNoteOffer.buyer_phone}</span>}
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Offer Status</span>
                <span className="font-extrabold text-neutral-950 text-sm block mt-0.5">
                  {Number(viewNoteOffer.offer_amount) > 1
                    ? `$${Number(viewNoteOffer.offer_amount).toLocaleString()} USD`
                    : "Price on Request"}
                </span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold mt-1 border capitalize bg-neutral-100 text-neutral-800">
                  {viewNoteOffer.status.replace("_", " ")}
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Full Inquiry Message &amp; Broker Notes
              </span>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-sans">
                {viewNoteOffer.notes || "No additional notes recorded."}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  const target = viewNoteOffer;
                  setViewNoteOffer(null);
                  handleOpenReplyModal(target);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-300" />
                <span>Reply to Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => setViewNoteOffer(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DEDICATED REPLY MODAL */}
      {replyModalOpen && replyOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 overflow-y-auto max-h-[92vh] space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Broker Outreach &bull; Direct Buyer Reply
                </span>
                <h3 className="text-xl font-black text-neutral-950 tracking-tight mt-0.5">
                  Reply to {replyOffer.buyer_name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Recipient: <span className="font-semibold text-neutral-900">{replyOffer.buyer_email}</span> &bull; Asset:{" "}
                  <span className="font-semibold text-neutral-900">{replyOffer.domain_name || "Domain"}</span>
                </p>
              </div>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Choose Response Template
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate("general")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    selectedTemplate === "general"
                      ? "border-black bg-neutral-950 text-white shadow-2xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span className="block text-[11px]">General Response</span>
                  <span className="block text-[10px] opacity-75 font-normal truncate">Acknowledge inquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate("counter")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    selectedTemplate === "counter"
                      ? "border-black bg-neutral-950 text-white shadow-2xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span className="block text-[11px]">Counter-Offer</span>
                  <span className="block text-[10px] opacity-75 font-normal truncate">Negotiate pricing</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate("accept")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    selectedTemplate === "accept"
                      ? "border-black bg-neutral-950 text-white shadow-2xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span className="block text-[11px]">Accept &amp; Escrow</span>
                  <span className="block text-[10px] opacity-75 font-normal truncate">Start Escrow transfer</span>
                </button>
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Message Body Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Message Body
              </label>
              <textarea
                rows={8}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs leading-relaxed text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black font-sans"
              />
            </div>

            {/* Actions Grid */}
            <div className="pt-3 border-t border-neutral-100 space-y-2.5">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-[11px] text-neutral-600 leading-relaxed">
                <span className="font-semibold text-neutral-900">Recommended:</span> Use <strong>&ldquo;Open in Gmail Web&rdquo;</strong> to reply directly from your email to the buyer with this message pre-filled. <em>(Direct API sending requires custom domain verification)</em>.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Open in Gmail Web */}
                <button
                  type="button"
                  onClick={handleOpenGmail}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Gmail Web</span>
                </button>

                {/* 2. Open in Default Mail App */}
                <button
                  type="button"
                  onClick={handleOpenMailApp}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-neutral-600" />
                  <span>Open in Mail App</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyReply}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>

                {/* Send via Resend Email Button */}
                <button
                  type="button"
                  disabled={sendingReply}
                  onClick={handleSendDirectEmail}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Direct via Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DEDICATED DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && offerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-950">Delete Offer Record</h4>
                <p className="text-xs text-neutral-500">This action will remove the record from your pipeline.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3.5 text-xs text-neutral-700 space-y-1">
              <div>
                <span className="font-semibold text-neutral-500">Domain:</span>{" "}
                <span className="font-bold text-black">{offerToDelete.domain_name || "Unassigned"}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Buyer:</span>{" "}
                <span className="font-medium text-black">{offerToDelete.buyer_name} ({offerToDelete.buyer_email})</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Offer Amount:</span>{" "}
                <span className="font-bold text-black">
                  {Number(offerToDelete.offer_amount) > 1
                    ? `$${Number(offerToDelete.offer_amount).toLocaleString()} USD`
                    : "Price on Request"}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Are you sure you want to permanently delete this offer? This cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. ADD / EDIT OFFER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
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
                  rows={4}
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Private broker notes, counter-offer details, Escrow link reference..."
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-neutral-100">
                {form.buyer_email ? (
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      handleOpenReplyModal(form as Offer);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-neutral-300 text-xs font-bold text-neutral-850 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Reply to Buyer</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
