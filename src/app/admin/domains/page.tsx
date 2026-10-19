"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  SlidersHorizontal,
  Globe,
  Tag,
  DollarSign,
  ShieldCheck,
  Layers,
  FolderTree,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  getAllDomains,
  saveDomain,
  deleteDomain,
  toggleDomainFeatured,
  getDomainTypes,
  saveDomainType,
  getDomainCategories,
  saveDomainCategory,
  getValuationCategories,
  saveValuationCategory,
} from "@/lib/actions/admin-actions";
import {
  DbDomain,
  DomainType,
  DomainCategory,
  ValuationCategory,
  PricingMode,
  DomainStatus,
} from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function ManageDomainsPage() {
  const { success, error: toastError } = useToast();
  const [domainList, setDomainList] = useState<DbDomain[]>([]);
  const [types, setTypes] = useState<DomainType[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [valuations, setValuations] = useState<ValuationCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);

  // Inline Quick-Add Modals
  const [quickAddTypeOpen, setQuickAddTypeOpen] = useState(false);
  const [newTypeLabel, setNewTypeLabel] = useState("");
  const [quickAddCatOpen, setQuickAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [quickAddValOpen, setQuickAddValOpen] = useState(false);
  const [newValLabel, setNewValLabel] = useState("");
  const [newValMin, setNewValMin] = useState<number | "">("");
  const [newValMax, setNewValMax] = useState<number | "">("");

  // Domain Form State
  const [form, setForm] = useState<Partial<DbDomain>>({
    name: "",
    slug: "",
    extension: ".si",
    type_id: "",
    category_id: "",
    valuation_id: "",
    tags: [],
    price: null,
    pricing_mode: "fixed_price",
    custom_cta_label: "",
    custom_cta_url: "",
    featured: false,
    status: "available",
    description: "",
  });

  const [tagsInput, setTagsInput] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [d, t, c, v] = await Promise.all([
        getAllDomains(),
        getDomainTypes(),
        getDomainCategories(),
        getValuationCategories(),
      ]);
      setDomainList(d);
      setTypes(t);
      setCategories(c);
      setValuations(v);
    } catch {
      toastError("Failed to load catalog data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered domains
  const filteredDomains = useMemo(() => {
    return domainList.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.tags && d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory =
        categoryFilter === "all" ||
        d.category_id === categoryFilter ||
        d.category?.name === categoryFilter ||
        d.category?.slug === categoryFilter;
      const matchesType =
        typeFilter === "all" ||
        d.type_id === typeFilter ||
        d.type?.label === typeFilter ||
        d.type?.slug === typeFilter;
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [domainList, searchQuery, categoryFilter, typeFilter, statusFilter]);

  const handleOpenAdd = () => {
    setModalMode("add");
    setForm({
      name: "",
      slug: "",
      extension: ".si",
      type_id: types[0]?.id || "",
      category_id: categories[0]?.id || "",
      valuation_id: valuations[0]?.id || "",
      tags: [],
      price: 15000,
      pricing_mode: "fixed_price",
      custom_cta_label: "",
      custom_cta_url: "",
      featured: false,
      status: "available",
      description: "",
    });
    setTagsInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (d: DbDomain) => {
    setModalMode("edit");
    setForm(d);
    setTagsInput((d.tags || []).join(", "));
    setModalOpen(true);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toastError("Domain name is required.");
      return;
    }

    setSaving(true);
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<DbDomain> = {
      ...form,
      tags: parsedTags,
    };

    const res = await saveDomain(payload);
    setSaving(false);

    if (res.error) {
      toastError(res.error);
    } else {
      success(modalMode === "add" ? "Domain added successfully!" : "Domain updated successfully!");
      setModalOpen(false);
      loadData();
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const res = await toggleDomainFeatured(id, !current);
    if (res.error) {
      toastError(res.error);
    } else {
      setDomainList((prev) =>
        prev.map((d) => (d.id === id ? { ...d, featured: !current } : d))
      );
      success(!current ? "Marked as featured" : "Removed from featured");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    const res = await deleteDomain(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Domain deleted.");
      loadData();
    }
  };

  // Inline Quick-Add Handlers
  const handleQuickAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeLabel.trim()) return;
    const res = await saveDomainType({ label: newTypeLabel.trim(), display_order: types.length + 1 });
    if (res.data) {
      setTypes((prev) => [...prev, res.data]);
      setForm((prev) => ({ ...prev, type_id: res.data.id }));
      setNewTypeLabel("");
      setQuickAddTypeOpen(false);
      success(`Added type "${res.data.label}"`);
    }
  };

  const handleQuickAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await saveDomainCategory({ name: newCatName.trim(), display_order: categories.length + 1 });
    if (res.data) {
      setCategories((prev) => [...prev, res.data]);
      setForm((prev) => ({ ...prev, category_id: res.data.id }));
      setNewCatName("");
      setQuickAddCatOpen(false);
      success(`Added category "${res.data.name}"`);
    }
  };

  const handleQuickAddValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValLabel.trim()) return;
    const res = await saveValuationCategory({
      label: newValLabel.trim(),
      min_price: newValMin !== "" ? Number(newValMin) : null,
      max_price: newValMax !== "" ? Number(newValMax) : null,
      display_order: valuations.length + 1,
    });
    if (res.data) {
      setValuations((prev) => [...prev, res.data]);
      setForm((prev) => ({ ...prev, valuation_id: res.data.id }));
      setNewValLabel("");
      setNewValMin("");
      setNewValMax("");
      setQuickAddValOpen(false);
      success(`Added valuation bracket "${res.data.label}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER DECK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-700">
            <Globe className="w-3.5 h-3.5 text-neutral-900" />
            <span>Inventory Master Ledger &bull; {domainList.length} Total</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-950">
            Domain Inventory Catalog
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Manage pricing buttons, dynamic taxonomy tags, descriptions, and verified listings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="group inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-neutral-300" />
          <span>Add New Domain</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      {/* 2. SEARCH & ADVANCED FILTER BAR */}
      <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col lg:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by domain name (e.g. money, ai) or tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/80 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shrink-0"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/80 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shrink-0"
          >
            <option value="all">All Types ({types.length})</option>
            {types.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200/80 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shrink-0"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="in_escrow">In Escrow</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* 3. STRUCTURED DOMAINS TABLE */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
            <p className="text-xs text-neutral-500 font-mono">Synchronizing portfolio ledger...</p>
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No domains match the selected search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200/70 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6 w-12 text-center">★</th>
                  <th className="p-4">Domain Asset</th>
                  <th className="p-4">Pattern / Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Acquisition Price &amp; Mode</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDomains.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/70 transition-colors group">
                    <td className="p-4 pl-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(d.id, d.featured)}
                        className={`cursor-pointer transition-transform active:scale-125 ${
                          d.featured ? "text-amber-500" : "text-neutral-300 hover:text-amber-400"
                        }`}
                        title={d.featured ? "Featured on homepage" : "Mark as featured"}
                      >
                        <Star className={`w-4 h-4 ${d.featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          {d.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-neutral-950 text-sm tracking-tight">
                              {d.name}
                            </span>
                            <Link
                              href={`/domains/${d.slug}`}
                              target="_blank"
                              className="text-neutral-400 hover:text-black transition-colors"
                              title="View listing page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                          {d.tags && d.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {d.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded-md font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-bold text-[11px] font-mono">
                        {d.type?.label || "One-word"}
                      </span>
                    </td>

                    <td className="p-4 font-medium text-neutral-600">
                      {d.category?.name || "General Asset"}
                    </td>

                    <td className="p-4">
                      {d.pricing_mode === "make_offer" ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Make an Offer</span>
                        </span>
                      ) : (
                        <div>
                          <span className="font-black text-neutral-950 text-sm">
                            {formatPrice(d.price)}
                          </span>
                          {d.pricing_mode === "both" && (
                            <span className="block text-[10px] text-neutral-400 font-medium">
                              + Inquiries Accepted
                            </span>
                          )}
                          {d.custom_cta_label && (
                            <span className="block text-[10px] text-emerald-600 font-bold truncate max-w-[130px]">
                              CTA: {d.custom_cta_label}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          d.status === "available"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                            : d.status === "in_escrow"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200/80"
                            : "bg-amber-50 text-amber-800 border-amber-200/80"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            d.status === "available" ? "bg-emerald-500" : "bg-indigo-500"
                          }`}
                        />
                        <span>{d.status || "available"}</span>
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit Domain"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Domain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. STRUCTURED ADD/EDIT MODAL (DOUBLE-BEZEL CONCENTRIC CARDS) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative rounded-[2rem] p-1.5 bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-200 shadow-2xl max-w-2xl w-full">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Inventory Administration
                  </span>
                  <h3 className="text-xl font-black text-neutral-950 tracking-tight">
                    {modalMode === "add" ? "Add Domain Asset" : `Edit Domain: ${form.name}`}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDomain} className="space-y-6">
                {/* SECTION 1: IDENTITY & SLUG */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Asset Identity &amp; Extension</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Domain Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name || ""}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Wealth.si"
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Listing Status
                      </label>
                      <select
                        value={form.status || "available"}
                        onChange={(e) => setForm({ ...form, status: e.target.value as DomainStatus })}
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                      >
                        <option value="available">Available for Sale</option>
                        <option value="pending">Negotiation Pending</option>
                        <option value="in_escrow">In Escrow Transfer</option>
                        <option value="sold">Sold (Private)</option>
                        <option value="hidden">Hidden / Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: DYNAMIC TAXONOMY & FILTERS */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Dynamic Taxonomies &amp; Filter Attributes</span>
                  </h4>

                  {/* Type Selector with Inline Add */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Domain Type Pattern
                      </label>
                      <button
                        type="button"
                        onClick={() => setQuickAddTypeOpen(true)}
                        className="text-[11px] font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add New Type</span>
                      </button>
                    </div>

                    {quickAddTypeOpen && (
                      <div className="mb-2 p-2 bg-white rounded-xl border border-neutral-300 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type name (e.g. Brandable)..."
                          value={newTypeLabel}
                          onChange={(e) => setNewTypeLabel(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddType}
                          className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickAddTypeOpen(false)}
                          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <select
                      value={form.type_id || ""}
                      onChange={(e) => setForm({ ...form, type_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                    >
                      <option value="">Select Domain Type...</option>
                      {types.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selector with Inline Add */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Filter Category (Industry Sector)
                      </label>
                      <button
                        type="button"
                        onClick={() => setQuickAddCatOpen(true)}
                        className="text-[11px] font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add New Category</span>
                      </button>
                    </div>

                    {quickAddCatOpen && (
                      <div className="mb-2 p-2 bg-white rounded-xl border border-neutral-300 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Category name (e.g. AI & Robotics)..."
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddCategory}
                          className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickAddCatOpen(false)}
                          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <select
                      value={form.category_id || ""}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Valuation Bracket */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                        Valuation Bracket (Filter Range)
                      </label>
                      <button
                        type="button"
                        onClick={() => setQuickAddValOpen(true)}
                        className="text-[11px] font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Valuation Bracket</span>
                      </button>
                    </div>

                    {quickAddValOpen && (
                      <div className="mb-2 p-3 bg-white rounded-xl border border-neutral-300 space-y-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. $10,000 – $25,000)..."
                          value={newValLabel}
                          onChange={(e) => setNewValLabel(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border rounded-lg"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setQuickAddValOpen(false)}
                            className="text-xs text-neutral-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleQuickAddValuation}
                            className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}

                    <select
                      value={form.valuation_id || ""}
                      onChange={(e) => setForm({ ...form, valuation_id: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                    >
                      <option value="">Auto-match or select bracket...</option>
                      {valuations.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SECTION 3: PRICING MODE & BUTTON ACTIONS */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Pricing Model &amp; Action Button Behavior</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "fixed_price", label: "Fixed Price" },
                      { id: "make_offer", label: "Make Offer" },
                      { id: "both", label: "Fixed + Offer" },
                      { id: "custom", label: "Escrow Link" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setForm({ ...form, pricing_mode: mode.id as PricingMode })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          form.pricing_mode === mode.id
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {form.pricing_mode !== "make_offer" && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Fixed Acquisition Price ($ USD)
                      </label>
                      <input
                        type="number"
                        value={form.price !== null ? form.price : ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            price: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        placeholder="e.g. 24995"
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  )}

                  {form.pricing_mode === "custom" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                          Custom Button Label
                        </label>
                        <input
                          type="text"
                          value={form.custom_cta_label || ""}
                          onChange={(e) => setForm({ ...form, custom_cta_label: e.target.value })}
                          placeholder="e.g. Buy Now via Escrow"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                          Target URL (Escrow.com / Atom.com)
                        </label>
                        <input
                          type="url"
                          value={form.custom_cta_url || ""}
                          onChange={(e) => setForm({ ...form, custom_cta_url: e.target.value })}
                          placeholder="https://escrow.com/..."
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 4: DESCRIPTION & TAGS */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Commercial Description &amp; Meta Tags</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Commercial Value Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={form.description || ""}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="High-authority generic asset commanding instant authority for fintech, wealth management, banking, or digital payment rails..."
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Search Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Fintech, Money, Category Killer, Super Intelligence"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="featured_checkbox"
                      checked={form.featured || false}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                    />
                    <label htmlFor="featured_checkbox" className="text-xs font-bold text-neutral-800 cursor-pointer">
                      Feature this domain asset on the homepage hero showcase
                    </label>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer shadow-md"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{modalMode === "add" ? "Create Listing" : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
