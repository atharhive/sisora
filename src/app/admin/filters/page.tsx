"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Layers,
  FolderTree,
  DollarSign,
  ArrowUpDown,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import {
  getDomainTypes,
  saveDomainType,
  deleteDomainType,
  getDomainCategories,
  saveDomainCategory,
  deleteDomainCategory,
  getValuationCategories,
  saveValuationCategory,
  deleteValuationCategory,
} from "@/lib/actions/admin-actions";
import { DomainType, DomainCategory, ValuationCategory } from "@/types/database";
import { useToast } from "@/components/ui/Toast";

export default function FiltersTaxonomyPage() {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<"types" | "categories" | "valuations">("types");
  const [loading, setLoading] = useState(true);

  // Data states
  const [types, setTypes] = useState<DomainType[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [valuations, setValuations] = useState<ValuationCategory[]>([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);

  // Form states
  const [typeForm, setTypeForm] = useState<Partial<DomainType>>({ label: "", display_order: 0, is_active: true });
  const [catForm, setCatForm] = useState<Partial<DomainCategory>>({ name: "", display_order: 0, is_active: true });
  const [valForm, setValForm] = useState<Partial<ValuationCategory>>({
    label: "",
    min_price: null,
    max_price: null,
    is_make_offer: false,
    display_order: 0,
    is_active: true,
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [t, c, v] = await Promise.all([
        getDomainTypes(),
        getDomainCategories(),
        getValuationCategories(),
      ]);
      setTypes(t);
      setCategories(c);
      setValuations(v);
    } catch {
      toastError("Failed to load taxonomy data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Handlers for Types
  const handleOpenTypeModal = (t?: DomainType) => {
    if (t) {
      setModalMode("edit");
      setTypeForm(t);
    } else {
      setModalMode("add");
      setTypeForm({ label: "", display_order: types.length + 1, is_active: true });
    }
    setModalOpen(true);
  };

  const handleSaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeForm.label) return;
    setSaving(true);
    const res = await saveDomainType(typeForm);
    setSaving(false);
    if (res.error) {
      toastError(res.error);
    } else {
      success(modalMode === "add" ? "Domain type added!" : "Domain type updated!");
      setModalOpen(false);
      loadAll();
    }
  };

  const handleDeleteType = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete the type "${label}"?`)) return;
    const res = await deleteDomainType(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Domain type removed.");
      loadAll();
    }
  };

  // Handlers for Categories
  const handleOpenCatModal = (c?: DomainCategory) => {
    if (c) {
      setModalMode("edit");
      setCatForm(c);
    } else {
      setModalMode("add");
      setCatForm({ name: "", display_order: categories.length + 1, is_active: true });
    }
    setModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;
    setSaving(true);
    const res = await saveDomainCategory(catForm);
    setSaving(false);
    if (res.error) {
      toastError(res.error);
    } else {
      success(modalMode === "add" ? "Category created!" : "Category updated!");
      setModalOpen(false);
      loadAll();
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const res = await deleteDomainCategory(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Category removed.");
      loadAll();
    }
  };

  // Handlers for Valuations
  const handleOpenValModal = (v?: ValuationCategory) => {
    if (v) {
      setModalMode("edit");
      setValForm(v);
    } else {
      setModalMode("add");
      setValForm({
        label: "",
        min_price: null,
        max_price: null,
        is_make_offer: false,
        display_order: valuations.length + 1,
        is_active: true,
      });
    }
    setModalOpen(true);
  };

  const handleSaveValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valForm.label) return;
    setSaving(true);
    const res = await saveValuationCategory(valForm);
    setSaving(false);
    if (res.error) {
      toastError(res.error);
    } else {
      success(modalMode === "add" ? "Valuation range added!" : "Valuation range updated!");
      setModalOpen(false);
      loadAll();
    }
  };

  const handleDeleteValuation = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete valuation range "${label}"?`)) return;
    const res = await deleteValuationCategory(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Valuation range removed.");
      loadAll();
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
            Taxonomy &amp; Filter Architecture
          </h2>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal">
            Customize domain types, industry sectors, and valuation brackets without touching any code.
          </p>
        </div>

        <div>
          {activeTab === "types" && (
            <button
              onClick={() => handleOpenTypeModal()}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-300" />
              <span>Add Domain Type</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
          {activeTab === "categories" && (
            <button
              onClick={() => handleOpenCatModal()}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-300" />
              <span>Add Filter Category</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
          {activeTab === "valuations" && (
            <button
              onClick={() => handleOpenValModal()}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-300" />
              <span>Add Valuation Bracket</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* 2. PILL SEGMENT TABS */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-200/60 rounded-2xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("types")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
            activeTab === "types"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-600 hover:text-black hover:bg-white/40"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Domain Types ({types.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-600 hover:text-black hover:bg-white/40"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Industry Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("valuations")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
            activeTab === "valuations"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-600 hover:text-black hover:bg-white/40"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Valuation Brackets ({valuations.length})</span>
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      {loading ? (
        <div className="p-20 text-center bg-white rounded-3xl border border-neutral-200/80">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
          <p className="text-xs text-neutral-500 font-mono">Loading filter definitions...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: DOMAIN TYPES */}
          {activeTab === "types" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {types.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-3xl bg-white border border-neutral-200/80 hover:border-black transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                        Order #{t.display_order}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        slug: {t.slug}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-neutral-950 tracking-tight">
                      {t.label}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ● Active Filter
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenTypeModal(t)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit Type"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteType(t.id, t.label)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-3xl bg-white border border-neutral-200/80 hover:border-black transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                        Order #{c.display_order}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        slug: {c.slug}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-neutral-950 tracking-tight">
                      {c.name}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ● Live Category
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenCatModal(c)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: VALUATIONS */}
          {activeTab === "valuations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {valuations.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-3xl bg-white border border-neutral-200/80 hover:border-black transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                        Order #{v.display_order}
                      </span>
                      {v.is_make_offer && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Make Offer Bracket
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-neutral-950 tracking-tight">
                      {v.label}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {v.is_make_offer
                        ? "Filters domains with unlisted/negotiable prices"
                        : `$${(v.min_price || 0).toLocaleString()} – ${v.max_price ? `$${v.max_price.toLocaleString()}` : "Unlimited"}`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ● Active Bracket
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenValModal(v)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit Range"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteValuation(v.id, v.label)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Range"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL FOR TYPES */}
      {modalOpen && activeTab === "types" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-950 tracking-tight">
                {modalMode === "add" ? "Create Domain Type" : "Edit Domain Type"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveType} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Type Label (e.g. One-word, Two-Word, LL, Brandable)
                </label>
                <input
                  type="text"
                  required
                  value={typeForm.label || ""}
                  onChange={(e) => setTypeForm({ ...typeForm, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. 4-Letter Brandable"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={typeForm.display_order ?? 0}
                  onChange={(e) => setTypeForm({ ...typeForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
                  <span>{modalMode === "add" ? "Create Type" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR CATEGORIES */}
      {modalOpen && activeTab === "categories" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-950 tracking-tight">
                {modalMode === "add" ? "Create Filter Category" : "Edit Filter Category"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name || ""}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={catForm.display_order ?? 0}
                  onChange={(e) => setCatForm({ ...catForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
                  <span>{modalMode === "add" ? "Create Category" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR VALUATIONS */}
      {modalOpen && activeTab === "valuations" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-black text-neutral-950 tracking-tight">
                {modalMode === "add" ? "Create Valuation Bracket" : "Edit Valuation Bracket"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveValuation} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Range Label
                </label>
                <input
                  type="text"
                  required
                  value={valForm.label || ""}
                  onChange={(e) => setValForm({ ...valForm, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. $10,000 – $25,000"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <input
                  type="checkbox"
                  id="make_offer_check"
                  checked={valForm.is_make_offer || false}
                  onChange={(e) => setValForm({ ...valForm, is_make_offer: e.target.checked })}
                  className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                />
                <label htmlFor="make_offer_check" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  &quot;Make an Offer&quot; bracket (No fixed price bounds)
                </label>
              </div>

              {!valForm.is_make_offer && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Min Price ($ USD)
                    </label>
                    <input
                      type="number"
                      value={valForm.min_price !== null ? valForm.min_price : ""}
                      onChange={(e) =>
                        setValForm({
                          ...valForm,
                          min_price: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="0"
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Max Price ($ USD)
                    </label>
                    <input
                      type="number"
                      value={valForm.max_price !== null ? valForm.max_price : ""}
                      onChange={(e) =>
                        setValForm({
                          ...valForm,
                          max_price: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="Leave empty for unlimited"
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={valForm.display_order ?? 0}
                  onChange={(e) => setValForm({ ...valForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
                  <span>{modalMode === "add" ? "Create Bracket" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
