"use client";

import React, { useState, useEffect } from "react";
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
        setConfig(data);
      } catch {
        toastError("Failed to load settings.");
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

  if (loading || !config) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-neutral-200">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <p className="text-xs text-neutral-500">Loading brokerage settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Brokerage &amp; Contact Configuration
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Controls lead routing inboxes, Telegram broker handles, transaction terms, and licensed escrow options across the entire website.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Brokerage Terms Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <Percent className="w-4 h-4" />
          <span>Brokerage Commercial Terms</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Standard Brokerage Commission
            </label>
            <input
              type="text"
              value={config.brokerage_commission}
              onChange={(e) => setConfig({ ...config, brokerage_commission: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Exclusive Brokerage Period
            </label>
            <input
              type="text"
              value={config.brokerage_exclusivity}
              onChange={(e) => setConfig({ ...config, brokerage_exclusivity: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Contact Channels Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>Contact Channels &amp; Lead Inboxes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brokerage Inquiries Email
            </label>
            <input
              type="email"
              value={config.contact_email}
              onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Telegram Broker Handle / URL
            </label>
            <input
              type="text"
              value={config.contact_telegram}
              onChange={(e) => setConfig({ ...config, contact_telegram: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Phone Display
            </label>
            <input
              type="text"
              value={config.contact_phone}
              onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Escrow Coordination Text
            </label>
            <input
              type="text"
              value={config.contact_escrow_info}
              onChange={(e) => setConfig({ ...config, contact_escrow_info: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span>Social &amp; Professional Profiles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={config.social_linkedin}
              onChange={(e) => setConfig({ ...config, social_linkedin: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              X (Twitter) URL
            </label>
            <input
              type="text"
              value={config.social_twitter}
              onChange={(e) => setConfig({ ...config, social_twitter: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
