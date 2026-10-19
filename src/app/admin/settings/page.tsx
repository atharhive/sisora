"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Check,
  Building2,
  Percent,
  FileCheck2,
  ShieldCheck,
  Loader2,
  Globe,
  Settings,
  ArrowRight,
  TrendingUp,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  Lock,
  Database,
  Radio,
  ArrowLeft,
} from "lucide-react";
import { getSiteSettings, saveSiteSettings } from "@/lib/actions/admin-actions";
import { SiteSettings } from "@/types/database";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const { success, error: toastError } = useToast();
  const [config, setConfig] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings();
        // Ensure stats array exists
        if (!data.stats || !Array.isArray(data.stats)) {
          data.stats = [
            { highlight: "105+", label: "Curated .SI Assets" },
            { highlight: "100%", label: "Escrow Secured" },
            { highlight: "24-48h", label: "Fast Ownership Transfer" },
            { highlight: "Direct", label: "Broker Negotiation" },
          ];
        }
        setConfig(data);
      } catch {
        toastError("Failed to load brokerage configuration.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    const res = await saveSiteSettings(config);
    setSaving(false);

    if (res.error) {
      toastError(res.error);
    } else {
      success("Site settings and brokerage configuration saved successfully!");
    }
  };

  const handleAddStat = () => {
    if (!config) return;
    setConfig({
      ...config,
      stats: [...(config.stats || []), { highlight: "New Stat", label: "Metric Description" }],
    });
  };

  const handleUpdateStat = (index: number, field: "highlight" | "label", value: string) => {
    if (!config) return;
    const updated = [...(config.stats || [])];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, stats: updated });
  };

  const handleRemoveStat = (index: number) => {
    if (!config) return;
    const updated = config.stats.filter((_, i) => i !== index);
    setConfig({ ...config, stats: updated });
  };

  if (loading || !config) {
    return (
      <div className="p-20 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Loading brokerage settings...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. LUXURY HEADER DECK */}
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
            Brokerage Operations &amp; Configuration
          </h2>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal max-w-xl">
            Configure commercial terms, lead routing endpoints, direct contact channels, and homepage metric counters.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="group inline-flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-60 shrink-0"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5 text-neutral-300" />
          )}
          <span>Save All Settings</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2. BENTO SETTINGS GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Commercial Terms */}
          <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                <Percent className="w-4 h-4 text-neutral-900" />
                <span>Transaction Economics</span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                Commercial Brokerage Terms
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Standard Brokerage Commission
                </label>
                <input
                  type="text"
                  value={config.brokerage_commission}
                  onChange={(e) => setConfig({ ...config, brokerage_commission: e.target.value })}
                  placeholder="e.g. 15% Commission"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Displayed in buyer escrow guides and brokerage agreements.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Exclusive Brokerage Mandate
                </label>
                <input
                  type="text"
                  value={config.brokerage_exclusivity}
                  onChange={(e) => setConfig({ ...config, brokerage_exclusivity: e.target.value })}
                  placeholder="e.g. 90-Day Exclusive Agreement"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Representation terms for seller listings.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                Licensed Escrow Coordination &amp; Settlement
              </label>
              <input
                type="text"
                value={config.contact_escrow_info}
                onChange={(e) => setConfig({ ...config, contact_escrow_info: e.target.value })}
                placeholder="e.g. Licensed Escrow via Escrow.com & Atom.com"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Shown across checkout, buyer offer confirmation modals, and trust badges.
              </span>
            </div>
          </div>

          {/* Card 2: Contact Channels & Lead Inboxes */}
          <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                <Mail className="w-4 h-4 text-neutral-900" />
                <span>Lead Routing Endpoints</span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                Official Inboxes &amp; Communication Channels
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Broker Inquiries Email
                </label>
                <input
                  type="email"
                  value={config.contact_email}
                  onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Telegram Broker Direct Handle
                </label>
                <input
                  type="text"
                  value={config.contact_telegram}
                  onChange={(e) => setConfig({ ...config, contact_telegram: e.target.value })}
                  placeholder="@SisoraBrokerage"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Phone / WhatsApp Direct Line
                </label>
                <input
                  type="text"
                  value={config.contact_phone}
                  onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  Primary Operating Location
                </label>
                <input
                  type="text"
                  value={config.contact_location}
                  onChange={(e) => setConfig({ ...config, contact_location: e.target.value })}
                  placeholder="Global Investor Network / Ljubljana"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Social & Industry Footprint */}
          <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                <Globe className="w-4 h-4 text-neutral-900" />
                <span>External Industry Presence</span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                Social Profiles &amp; Brokerage Showcase
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  X (Twitter) Profile URL
                </label>
                <input
                  type="url"
                  value={config.social_twitter}
                  onChange={(e) => setConfig({ ...config, social_twitter: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-1.5">
                  LinkedIn Organization URL
                </label>
                <input
                  type="url"
                  value={config.social_linkedin}
                  onChange={(e) => setConfig({ ...config, social_linkedin: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Homepage Metric Stats Counters */}
          <div className="bg-white p-7 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  <TrendingUp className="w-4 h-4 text-neutral-900" />
                  <span>Homepage Metric Counters</span>
                </div>
                <h3 className="text-base font-bold text-neutral-950">
                  Dynamic Marketing &amp; Authority Metrics
                </h3>
              </div>

              <button
                type="button"
                onClick={handleAddStat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 text-xs font-bold text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(config.stats || []).map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3 group"
                >
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                        Figure
                      </span>
                      <input
                        type="text"
                        value={stat.highlight}
                        onChange={(e) => handleUpdateStat(idx, "highlight", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-black text-neutral-950 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                        Label
                      </span>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer self-start"
                    title="Remove Metric"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: Telemetry & Live Infrastructure */}
        <div className="space-y-6">
          {/* Security & RLS Status Card */}
          <div className="bg-neutral-950 text-white p-7 rounded-3xl shadow-xl space-y-5 sticky top-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">System Telemetry</h4>
                  <p className="text-[10px] text-neutral-400">PostgreSQL RLS Protected</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-300">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-neutral-400">Database Engine</span>
                <span className="font-mono font-bold text-white text-[11px]">Supabase PG15</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-neutral-400">Row-Level Security</span>
                <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  10 Tables Enforced
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-neutral-400">ISR Revalidation</span>
                <span className="font-mono text-white text-[11px]">Dynamic on Save</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-neutral-400">Audit Logging</span>
                <span className="font-mono text-emerald-400 text-[11px]">Active</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Updates saved here immediately propagate to public route caches (<code className="text-neutral-200 font-mono">/</code>, <code className="text-neutral-200 font-mono">/about</code>, <code className="text-neutral-200 font-mono">/contact</code>) and the contact drawer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
