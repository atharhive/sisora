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

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Domain Modal
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
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [domainList, searchQuery, categoryFilter, typeFilter]);

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
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Domain Inventory Catalog
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {domainList.length} domains in catalog. Manage pricing buttons, categories, and marketplace status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Domain</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain name or tags (e.g. money, ai, liquid)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
          >
            <option value="all">All Types</option>
            {types.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-500">Loading catalog...</p>
          </div>
        ) : filteredDomains.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No domains match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10">★</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price &amp; Mode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDomains.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(d.id, d.featured)}
                        className={`cursor-pointer transition-colors ${
                          d.featured ? "text-amber-500" : "text-neutral-300 hover:text-amber-400"
                        }`}
                        title={d.featured ? "Featured on homepage" : "Mark as featured"}
                      >
                        <Star className={`w-4 h-4 ${d.featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">{d.name}</span>
                        <Link
                          href={`/domains/${d.slug}`}
                          target="_blank"
                          className="text-neutral-400 hover:text-black"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      {d.tags && d.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {d.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-semibold text-neutral-700">
                      {d.type?.label || "One-word"}
                    </td>

                    <td className="p-4 text-neutral-600">
                      {d.category?.name || "General"}
                    </td>

                    <td className="p-4">
                      {d.pricing_mode === "make_offer" ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                          Make Offer
                        </span>
                      ) : (
                        <div>
                          <span className="font-black text-neutral-900">
                            {formatPrice(d.price)}
                          </span>
                          {d.pricing_mode === "both" && (
                            <span className="block text-[10px] text-neutral-400">
                              + Make Offer enabled
                            </span>
                          )}
                          {d.custom_cta_label && (
                            <span className="block text-[10px] text-emerald-600 font-semibold truncate max-w-[120px]">
                              CTA: {d.custom_cta_label}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {d.status || "available"}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit Domain"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* DOMAIN ADD/EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">
                {modalMode === "add" ? "Add Domain to Catalog" : `Edit Domain: ${form.name}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDomain} className="mt-6 space-y-5">
              {/* Domain Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Domain Name (with or without .si)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Wealth.si"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={form.status || "available"}
                    onChange={(e) => setForm({ ...form, status: e.target.value as DomainStatus })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    <option value="available">Available for Acquisition</option>
                    <option value="pending">Pending Deal</option>
                    <option value="in_escrow">In Escrow</option>
                    <option value="sold">Sold (Private)</option>
                    <option value="hidden">Hidden / Draft</option>
                  </select>
                </div>
              </div>

              {/* SELECT TYPE + INLINE ADD TYPE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Domain Type
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickAddTypeOpen(true)}
                    className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Type</span>
                  </button>
                </div>

                {quickAddTypeOpen && (
                  <div className="mb-3 p-3 bg-neutral-100 rounded-xl flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="New Type Label (e.g. Brandable, 2-Letter)..."
                      value={newTypeLabel}
                      onChange={(e) => setNewTypeLabel(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddType}
                      className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickAddTypeOpen(false)}
                      className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <select
                  value={form.type_id || ""}
                  onChange={(e) => setForm({ ...form, type_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                >
                  <option value="">Select Domain Type...</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECT CATEGORY + INLINE ADD CATEGORY */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Filter Category (Industry)
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickAddCatOpen(true)}
                    className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Category</span>
                  </button>
                </div>

                {quickAddCatOpen && (
                  <div className="mb-3 p-3 bg-neutral-100 rounded-xl flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="New Category Name (e.g. Artificial Intelligence)..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleQuickAddCategory}
                      className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickAddCatOpen(false)}
                      className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <select
                  value={form.category_id || ""}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECT VALUATION CATEGORY + INLINE ADD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Valuation Category / Filter Bracket
                  </label>
                  <button
                    type="button"
                    onClick={() => setQuickAddValOpen(true)}
                    className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Valuation Bracket</span>
                  </button>
                </div>

                {quickAddValOpen && (
                  <div className="mb-3 p-3 bg-neutral-100 rounded-xl space-y-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. $10,000 – $25,000)..."
                      value={newValLabel}
                      onChange={(e) => setNewValLabel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min Price (0)"
                        value={newValMin}
                        onChange={(e) => setNewValMin(e.target.value ? Number(e.target.value) : "")}
                        className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Max Price (optional)"
                        value={newValMax}
                        onChange={(e) => setNewValMax(e.target.value ? Number(e.target.value) : "")}
                        className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickAddValOpen(false)}
                        className="px-3 py-1 text-xs text-neutral-600 hover:text-black cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickAddValuation}
                        className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Save Range
                      </button>
                    </div>
                  </div>
                )}

                <select
                  value={form.valuation_id || ""}
                  onChange={(e) => setForm({ ...form, valuation_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                >
                  <option value="">Auto-match from Price or Select...</option>
                  {valuations.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICING MODE & BUTTON CONFIG */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Pricing Mode &amp; Action Button Behavior
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "fixed_price", label: "Fixed Price" },
                    { id: "make_offer", label: "Make an Offer" },
                    { id: "both", label: "Both (Fixed + Offer)" },
                    { id: "custom", label: "Custom Escrow Link" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setForm({ ...form, pricing_mode: mode.id as PricingMode })}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                      className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                {form.pricing_mode === "custom" && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={form.custom_cta_label || ""}
                        onChange={(e) => setForm({ ...form, custom_cta_label: e.target.value })}
                        placeholder="e.g. Buy Now via Escrow"
                        className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Target Link (Escrow / Atom URL)
                      </label>
                      <input
                        type="url"
                        value={form.custom_cta_url || ""}
                        onChange={(e) => setForm({ ...form, custom_cta_url: e.target.value })}
                        placeholder="https://escrow.com/..."
                        className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Domain Description &amp; Commercial Value
                </label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="High-authority generic asset commanding instant authority for fintech, wealth management, banking, or digital payment rails..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Fintech, Money, Category Killer, Super Intelligence"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <input
                  type="checkbox"
                  id="featured_check"
                  checked={form.featured || false}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded text-black focus:ring-black cursor-pointer"
                />
                <label htmlFor="featured_check" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                  Feature this domain on the homepage and top priority slots
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === "add" ? "Add Domain" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
