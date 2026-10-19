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
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Eye,
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
      toastError("Please complete all required deal fields.");
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
    if (!confirm(`Are you sure you want to permanently remove deal "${asset}" from track record?`)) return;
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
    if (!confirm(`Are you sure you want to delete category "${title}" and all associated deal showcases?`)) return;
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
      success("Track record editorial copy updated successfully!");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. LUXURY HEADER DECK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-700">
            <Award className="w-3.5 h-3.5 text-neutral-900" />
            <span>Verifiable Track Record &amp; Authority Engine</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-950">
            Track Record Management
          </h2>
          <p className="text-xs text-neutral-500 font-medium max-w-xl">
            Showcase closed deals, configure brokerage taxonomy, and customize Domingo&apos;s secondary market authority across the public site.
          </p>
        </div>

        <div>
          {activeTab === "deals" && (
            <button
              onClick={handleOpenAddDeal}
              className="group inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-300" />
              <span>Add Notable Deal</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </button>
          )}
          {activeTab === "categories" && (
            <button
              onClick={handleOpenAddCat}
              className="group inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-300" />
              <span>Add Category</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 2. PILL SEGMENT TABS */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-200/60 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("deals")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
            activeTab === "deals"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-600 hover:text-black hover:bg-white/40"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Notable Deals ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
            activeTab === "categories"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-600 hover:text-black hover:bg-white/40"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Taxonomy Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-600 hover:text-black hover:bg-white/40"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Page Copy &amp; Authority Bio</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {/* Tab 1: Deals */}
      {activeTab === "deals" && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-20 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Loading transaction records...
              </p>
            </div>
          ) : deals.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
              <Award className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-900">No Notable Deals Recorded</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Add closed transactions or historic domain sales to reinforce Sisora&apos;s institutional authority.
              </p>
              <button
                onClick={handleOpenAddDeal}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Deal</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deals.map((d) => {
                const cat = categories.find((c) => c.id === d.category_id);
                return (
                  <div
                    key={d.id}
                    className="p-6 rounded-3xl border border-neutral-200/80 bg-white hover:border-black/40 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
                          {d.metric}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full truncate max-w-[130px]">
                          {cat?.title || "General"}
                        </span>
                      </div>

                      {/* Asset Name */}
                      <h4 className="text-2xl font-black text-neutral-950 tracking-tight group-hover:text-black transition-colors">
                        {d.asset}
                      </h4>

                      {/* Detail Text */}
                      <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed font-normal">
                        {d.detail}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-neutral-400">
                          Order #{d.display_order}
                        </span>
                        {d.is_featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditDeal(d)}
                          className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit Deal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(d.id, d.asset)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Deal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <span>Section Category Title</span>
              <span>Deals Linked / Sequence / Actions</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {categories.map((c) => {
                const dealCount = deals.filter((d) => d.category_id === c.id).length;
                return (
                  <div
                    key={c.id}
                    className="p-5 flex items-center justify-between hover:bg-neutral-50/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-bold text-neutral-900">{c.title}</h4>
                        {c.is_active ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">
                        ID: <code className="text-[11px] font-mono">{c.id}</code>
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 block">
                          {dealCount} {dealCount === 1 ? "Deal" : "Deals"}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-medium">
                          Order #{c.display_order}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditCat(c)}
                          className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(c.id, c.title)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Settings & Bio */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Editors */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Copy Card */}
              <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
                <div className="border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    <Award className="w-4 h-4 text-neutral-900" />
                    <span>Track Record Hero Copy</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-950">
                    Public Page Title &amp; Introduction
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                      Main Page Headline
                    </label>
                    <input
                      type="text"
                      value={settings.headline}
                      onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                      Subheadline &amp; Brokerage Value Prop
                    </label>
                    <textarea
                      rows={3}
                      value={settings.subheadline}
                      onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Domingo Bio Card */}
              <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
                <div className="border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    <UserCheck className="w-4 h-4 text-neutral-900" />
                    <span>Founder Domain Authority</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-950">
                    Domingo&apos;s Secondary Market Credentials
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                      Authority Section Headline
                    </label>
                    <input
                      type="text"
                      value={settings.founder_authority_headline}
                      onChange={(e) =>
                        setSettings({ ...settings, founder_authority_headline: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                      Domain Experience Bio Narrative
                    </label>
                    <textarea
                      rows={5}
                      value={settings.founder_authority_bio}
                      onChange={(e) =>
                        setSettings({ ...settings, founder_authority_bio: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                        Footnote Disclosure
                      </label>
                      <input
                        type="text"
                        value={settings.footnote}
                        onChange={(e) => setSettings({ ...settings, footnote: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                        Direct Partner Link (X/Twitter or Contact)
                      </label>
                      <input
                        type="url"
                        value={settings.cta_partner_url}
                        onChange={(e) => setSettings({ ...settings, cta_partner_url: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-black px-7 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-neutral-300" />
                    )}
                    <span>Save Editorial Changes</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Live Preview Card */}
            <div className="space-y-6">
              <div className="bg-neutral-900 text-white p-7 rounded-3xl shadow-xl space-y-4 sticky top-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>Live Public Component Preview</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    Global Industry Background
                  </span>
                  <h4 className="text-lg font-black tracking-tight text-white">
                    {settings.founder_authority_headline || "Domingo's Domain Industry Authority"}
                  </h4>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {settings.founder_authority_bio ||
                    "Domingo is one of the most active dealmakers in the secondary domain market..."}
                </p>

                {settings.footnote && (
                  <p className="text-[11px] text-neutral-500 italic border-t border-white/10 pt-3">
                    {settings.footnote}
                  </p>
                )}

                {settings.cta_partner_url && (
                  <div className="pt-2">
                    <a
                      href={settings.cta_partner_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-neutral-300 underline underline-offset-4"
                    >
                      <span>Connect with Domingo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 4. MODALS */}
      {/* MODAL FOR DEAL */}
      {dealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-neutral-200/80 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Award className="w-4 h-4 text-neutral-900" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-950">
                  {dealModalMode === "add" ? "Add Notable Transaction" : "Edit Transaction"}
                </h3>
              </div>
              <button
                onClick={() => setDealModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Taxonomy Category
                </label>
                <select
                  value={dealForm.category_id}
                  onChange={(e) => setDealForm({ ...dealForm, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
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
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Asset (e.g. LM.si, Need.si)
                  </label>
                  <input
                    type="text"
                    required
                    value={dealForm.asset || ""}
                    onChange={(e) => setDealForm({ ...dealForm, asset: e.target.value })}
                    placeholder="e.g. LM.si"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Metric Tag (e.g. 2-Letter ccTLD)
                  </label>
                  <input
                    type="text"
                    required
                    value={dealForm.metric || ""}
                    onChange={(e) => setDealForm({ ...dealForm, metric: e.target.value })}
                    placeholder="e.g. 2-Letter ccTLD"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Transaction Detail / Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={dealForm.detail || ""}
                  onChange={(e) => setDealForm({ ...dealForm, detail: e.target.value })}
                  placeholder="Private investor acquisition of an ultra-scarce asset..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-normal text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Display Sequence
                  </label>
                  <input
                    type="number"
                    value={dealForm.display_order ?? 1}
                    onChange={(e) => setDealForm({ ...dealForm, display_order: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dealForm.is_featured ?? true}
                      onChange={(e) => setDealForm({ ...dealForm, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded-md text-black focus:ring-black cursor-pointer"
                    />
                    <span className="text-xs font-bold text-neutral-800">Feature on Page</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setDealModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer shadow-sm"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{dealModalMode === "add" ? "Add Deal" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR CATEGORY */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-neutral-200/80 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-neutral-900" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-950">
                  {catModalMode === "add" ? "Add Track Category" : "Edit Track Category"}
                </h3>
              </div>
              <button
                onClick={() => setCatModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Category Section Title
                </label>
                <input
                  type="text"
                  required
                  value={catForm.title || ""}
                  onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                  placeholder="e.g. Notable .SI Brokerage Deals"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                    Display Sequence
                  </label>
                  <input
                    type="number"
                    value={catForm.display_order ?? 1}
                    onChange={(e) => setCatForm({ ...catForm, display_order: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catForm.is_active ?? true}
                      onChange={(e) => setCatForm({ ...catForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded-md text-black focus:ring-black cursor-pointer"
                    />
                    <span className="text-xs font-bold text-neutral-800">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-60 cursor-pointer shadow-sm"
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
