"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Layers,
  Settings,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  getTrackRecordData,
  saveTrackCategory,
  deleteTrackCategory,
  saveTrackDeal,
  deleteTrackDeal,
  saveTrackSettings,
} from "@/lib/actions/admin-actions";
import { TrackRecordCategory, TrackRecordDeal, TrackRecordSettings } from "@/types/database";
import { useToast } from "@/components/ui/Toast";

export default function TrackRecordAdminPage() {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<"deals" | "categories" | "settings">("deals");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<TrackRecordCategory[]>([]);
  const [deals, setDeals] = useState<TrackRecordDeal[]>([]);
  const [settings, setSettings] = useState<TrackRecordSettings>({
    id: "singleton",
    headline: "",
    subheadline: "",
    founder_authority_headline: "",
    founder_authority_bio: "",
    footnote: "",
    cta_partner_url: "",
  });

  // Deal Modal state
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [dealModalMode, setDealModalMode] = useState<"add" | "edit">("add");
  const [dealForm, setDealForm] = useState<Partial<TrackRecordDeal>>({
    category_id: "",
    asset: "",
    metric: "",
    detail: "",
    display_order: 1,
    is_featured: true,
  });

  // Category Modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catModalMode, setCatModalMode] = useState<"add" | "edit">("add");
  const [catForm, setCatForm] = useState<Partial<TrackRecordCategory>>({
    title: "",
    display_order: 1,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTrackRecordData();
      setCategories(data.categories);
      setDeals(data.deals);
      setSettings(data.settings);
    } catch {
      toastError("Failed to load track record data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Deals
  const handleOpenAddDeal = () => {
    setDealModalMode("add");
    setDealForm({
      category_id: categories[0]?.id || "",
      asset: "",
      metric: "",
      detail: "",
      display_order: deals.length + 1,
      is_featured: true,
    });
    setDealModalOpen(true);
  };

  const handleOpenEditDeal = (d: TrackRecordDeal) => {
    setDealModalMode("edit");
    setDealForm(d);
    setDealModalOpen(true);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.asset || !dealForm.metric || !dealForm.detail) {
      toastError("Please complete all deal fields.");
      return;
    }
    setSaving(true);
    const res = await saveTrackDeal(dealForm);
    setSaving(false);

    if (res.error) {
      toastError(res.error);
    } else {
      success(dealModalMode === "add" ? "Deal added to track record!" : "Deal updated!");
      setDealModalOpen(false);
      loadData();
    }
  };

  const handleDeleteDeal = async (id: string, asset: string) => {
    if (!confirm(`Are you sure you want to remove deal "${asset}"?`)) return;
    const res = await deleteTrackDeal(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Deal removed.");
      loadData();
    }
  };

  // Handlers for Categories
  const handleOpenAddCat = () => {
    setCatModalMode("add");
    setCatForm({
      title: "",
      display_order: categories.length + 1,
      is_active: true,
    });
    setCatModalOpen(true);
  };

  const handleOpenEditCat = (c: TrackRecordCategory) => {
    setCatModalMode("edit");
    setCatForm(c);
    setCatModalOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.title) return;
    setSaving(true);
    const res = await saveTrackCategory(catForm);
    setSaving(false);

    if (res.error) {
      toastError(res.error);
    } else {
      success(catModalMode === "add" ? "Track record category created!" : "Category updated!");
      setCatModalOpen(false);
      loadData();
    }
  };

  const handleDeleteCat = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete category "${title}" and all its deals?`)) return;
    const res = await deleteTrackCategory(id);
    if (res.error) {
      toastError(res.error);
    } else {
      success("Category removed.");
      loadData();
    }
  };

  // Handlers for Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await saveTrackSettings(settings);
    setSaving(false);

    if (res.error) {
      toastError(res.error);
    } else {
      success("Track record page copy updated successfully!");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-700 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verifiable Track Record &amp; Authority Manager</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Track Record Page Management
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Add closed deals, configure industry credentials, and edit Domingo&apos;s secondary market authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "deals" && (
            <button
              onClick={handleOpenAddDeal}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Notable Deal</span>
            </button>
          )}
          {activeTab === "categories" && (
            <button
              onClick={handleOpenAddCat}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-px">
        <button
          onClick={() => setActiveTab("deals")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "deals"
              ? "border-black text-black bg-white shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Notable Deals ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "categories"
              ? "border-black text-black bg-white shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
            activeTab === "settings"
              ? "border-black text-black bg-white shadow-2xs"
              : "border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Page Copy &amp; Authority Bio</span>
        </button>
      </div>

      {/* Tab 1: Deals */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-neutral-200">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
              <p className="text-xs text-neutral-500">Loading transactions...</p>
            </div>
          ) : deals.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              No transactions added yet. Click &quot;Add Notable Deal&quot; above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((d) => {
                const cat = categories.find((c) => c.id === d.category_id);
                return (
                  <div
                    key={d.id}
                    className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black transition-all flex flex-col justify-between space-y-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {d.metric}
                        </span>
                        <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                          {cat?.title || "General"}
                        </span>
                      </div>
                      <h4 className="text-xl font-black text-neutral-950 tracking-tight">
                        {d.asset}
                      </h4>
                      <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                        {d.detail}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        Order: {d.display_order}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditDeal(d)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(d.id, d.asset)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Categories */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500 font-semibold">
            <span>Section Category Title</span>
            <span>Display Order / Actions</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {categories.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/60 transition-colors">
                <span className="text-sm font-bold text-neutral-900">{c.title}</span>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-neutral-400 font-medium">Order: {c.display_order}</span>
                  <button
                    onClick={() => handleOpenEditCat(c)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCat(c.id, c.title)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Settings */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-1">
              Page Header &amp; Subheadline
            </h3>
            <p className="text-xs text-neutral-500">
              Customize the hero title and introduction at the top of /track-record.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Page Headline
              </label>
              <input
                type="text"
                value={settings.headline}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Subheadline
              </label>
              <textarea
                rows={2}
                value={settings.subheadline}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-1">
              Domingo&apos;s Domain Authority Bio
            </h3>
            <p className="text-xs text-neutral-500">
              Highlight the founder&apos;s previous high-tier deals (LLL.coms, CVCV.coms, LLL.ai) and Twitter link.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Authority Section Headline
              </label>
              <input
                type="text"
                value={settings.founder_authority_headline}
                onChange={(e) =>
                  setSettings({ ...settings, founder_authority_headline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Authority Bio Narrative
              </label>
              <textarea
                rows={4}
                value={settings.founder_authority_bio}
                onChange={(e) =>
                  setSettings({ ...settings, founder_authority_bio: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Footnote Text
              </label>
              <input
                type="text"
                value={settings.footnote}
                onChange={(e) => setSettings({ ...settings, footnote: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Partner with Domingo Link (Twitter/X or Contact URL)
              </label>
              <input
                type="url"
                value={settings.cta_partner_url}
                onChange={(e) => setSettings({ ...settings, cta_partner_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Page Copy</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL FOR DEAL */}
      {dealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {dealModalMode === "add" ? "Add Notable Transaction" : "Edit Transaction"}
              </h3>
              <button onClick={() => setDealModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Section Category
                </label>
                <select
                  value={dealForm.category_id}
                  onChange={(e) => setDealForm({ ...dealForm, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Asset (e.g. LM.si, Need.si)
                  </label>
                  <input
                    type="text"
                    required
                    value={dealForm.asset || ""}
                    onChange={(e) => setDealForm({ ...dealForm, asset: e.target.value })}
                    placeholder="e.g. LM.si"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Metric Tag (e.g. 2-Letter ccTLD)
                  </label>
                  <input
                    type="text"
                    required
                    value={dealForm.metric || ""}
                    onChange={(e) => setDealForm({ ...dealForm, metric: e.target.value })}
                    placeholder="e.g. 2-Letter ccTLD"
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Transaction Detail / Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={dealForm.detail || ""}
                  onChange={(e) => setDealForm({ ...dealForm, detail: e.target.value })}
                  placeholder="Private investor acquisition of an ultra-scarce asset..."
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={dealForm.display_order ?? 1}
                  onChange={(e) => setDealForm({ ...dealForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setDealModalOpen(false)}
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
                  <span>{dealModalMode === "add" ? "Add Deal" : "Save Deal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR CATEGORY */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {catModalMode === "add" ? "Add Track Category" : "Edit Track Category"}
              </h3>
              <button onClick={() => setCatModalOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  required
                  value={catForm.title || ""}
                  onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                  placeholder="e.g. Notable .SI Brokerage Deals"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={catForm.display_order ?? 1}
                  onChange={(e) => setCatForm({ ...catForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
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
                  <span>{catModalMode === "add" ? "Create Category" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
