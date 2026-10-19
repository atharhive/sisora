"use client";

import React, { useState, useEffect } from "react";
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
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Dynamic Taxonomies &amp; Search Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Filter &amp; Taxonomy Configuration
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Manage domain types, industry sectors, and valuation brackets. All changes reflect live on the website immediately.
          </p>
        </div>

        <div>
          {activeTab === "types" && (
            <button
              onClick={() => handleOpenTypeModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Domain Type</span>
            </button>
          )}
          {activeTab === "categories" && (
            <button
              onClick={() => handleOpenCatModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
          {activeTab === "valuations" && (
            <button
              onClick={() => handleOpenValModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Valuation Range</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-px">
        <button
          onClick={() => setActiveTab("types")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "types"
              ? "border-black text-black bg-white shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Domain Types ({types.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "categories"
              ? "border-black text-black bg-white shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Filter Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("valuations")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "valuations"
              ? "border-black text-black bg-white shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Valuation Ranges ({valuations.length})</span>
        </button>
      </div>

      {/* Tab 1: Types */}
      {activeTab === "types" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>Type Label</span>
            <span>Display Order / Actions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-500">Loading domain types...</p>
            </div>
          ) : types.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">No domain types defined yet.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {types.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{t.label}</span>
                      <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                        slug: {t.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-400 font-medium">Order: {t.display_order}</span>
                    <button
                      onClick={() => handleOpenTypeModal(t)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteType(t.id, t.label)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Categories */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>Category Name</span>
            <span>Display Order / Actions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">No categories found.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{c.name}</span>
                      <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                        slug: {c.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-400 font-medium">Order: {c.display_order}</span>
                    <button
                      onClick={() => handleOpenCatModal(c)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Valuations */}
      {activeTab === "valuations" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>Valuation Bracket</span>
            <span>Range Details &amp; Actions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-500">Loading valuation ranges...</p>
            </div>
          ) : valuations.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">No valuation categories found.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {valuations.map((v) => (
                <div key={v.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/60 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{v.label}</span>
                      {v.is_make_offer && (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                          Make an Offer Bracket
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {v.is_make_offer
                        ? "Catches all domains with no fixed price"
                        : `$${(v.min_price || 0).toLocaleString()} – ${v.max_price ? `$${v.max_price.toLocaleString()}` : "Above"}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-400 font-medium">Order: {v.display_order}</span>
                    <button
                      onClick={() => handleOpenValModal(v)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteValuation(v.id, v.label)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL FOR TYPES */}
      {modalOpen && activeTab === "types" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {modalMode === "add" ? "Add Domain Type" : "Edit Domain Type"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveType} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Type Label (e.g. One-word, Two-Word, LL, Brandable)
                </label>
                <input
                  type="text"
                  required
                  value={typeForm.label || ""}
                  onChange={(e) => setTypeForm({ ...typeForm, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. 4-Letter Brandable"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                  <span>{modalMode === "add" ? "Create Type" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR CATEGORIES */}
      {modalOpen && activeTab === "categories" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {modalMode === "add" ? "Add Filter Category" : "Edit Filter Category"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category Name (e.g. Fintech &amp; Wealth, AI &amp; Robotics)
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name || ""}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                  <span>{modalMode === "add" ? "Create Category" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR VALUATION RANGES */}
      {modalOpen && activeTab === "valuations" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {modalMode === "add" ? "Add Valuation Range" : "Edit Valuation Range"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveValuation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Range Label (e.g. Under $10,000, $25,000 – $50,000, Make an Offer)
                </label>
                <input
                  type="text"
                  required
                  value={valForm.label || ""}
                  onChange={(e) => setValForm({ ...valForm, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. $10,000 – $25,000"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <input
                  type="checkbox"
                  id="make_offer_check"
                  checked={valForm.is_make_offer || false}
                  onChange={(e) => setValForm({ ...valForm, is_make_offer: e.target.checked })}
                  className="rounded text-black focus:ring-black"
                />
                <label htmlFor="make_offer_check" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                  This is the &quot;Make an Offer&quot; category (No price bounds)
                </label>
              </div>

              {!valForm.is_make_offer && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={valForm.display_order ?? 0}
                  onChange={(e) => setValForm({ ...valForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
                  <span>{modalMode === "add" ? "Create Valuation Range" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
