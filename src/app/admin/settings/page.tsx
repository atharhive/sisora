"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Share2,
  Globe,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Building2,
} from "lucide-react";

function Twitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

interface SettingsState {
  // Contact
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  contact_whatsapp: string;

  // Social
  social_twitter: string;
  social_linkedin: string;
  social_whatsapp_url: string;

  // General
  general_site_name: string;
  general_tagline: string;
  general_meta_description: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  contact_phone: "+386 1 000 0000",
  contact_email: "contact@sisora.si",
  contact_address: "Ljubljana, Slovenia",
  contact_whatsapp: "+386 1 000 0000",

  social_twitter: "https://x.com/sisora_si",
  social_linkedin: "https://linkedin.com/company/sisora",
  social_whatsapp_url: "https://wa.me/38610000000",

  general_site_name: "SISORA",
  general_tagline: "Premier .SI Domain Marketplace & Brokerage",
  general_meta_description:
    "Acquire and sell high-value .SI domain names. Secure escrow, accredited registrar transfers, and premium digital assets.",
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Per-section saving state
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [successSection, setSuccessSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        // Handle array of { key, value, group } or key-value object
        if (Array.isArray(data)) {
          const map: Partial<SettingsState> = {};
          data.forEach((item: { key: string; value: string }) => {
            if (item.key in DEFAULT_SETTINGS) {
              (map as any)[item.key] = item.value;
            }
          });
          setSettings((prev) => ({ ...prev, ...map }));
        } else if (typeof data === "object" && data !== null) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      }
    } catch {
      // Keep defaults gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: keyof SettingsState, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveSection = async (section: "contact" | "social" | "general" | "all") => {
    setSavingSection(section);
    setError(null);
    setSuccessSection(null);

    // Formulate payload based on section
    let payload: Record<string, string> = {};

    if (section === "contact" || section === "all") {
      payload.contact_phone = settings.contact_phone;
      payload.contact_email = settings.contact_email;
      payload.contact_address = settings.contact_address;
      payload.contact_whatsapp = settings.contact_whatsapp;
    }
    if (section === "social" || section === "all") {
      payload.social_twitter = settings.social_twitter;
      payload.social_linkedin = settings.social_linkedin;
      payload.social_whatsapp_url = settings.social_whatsapp_url;
    }
    if (section === "general" || section === "all") {
      payload.general_site_name = settings.general_site_name;
      payload.general_tagline = settings.general_tagline;
      payload.general_meta_description = settings.general_meta_description;
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (${res.status})`);
      }

      setSuccessSection(section);
      setTimeout(() => setSuccessSection(null), 3500);
    } catch (err: any) {
      setError(err?.message || "Failed to update settings.");
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
        <p className="text-sm text-neutral-500 font-medium">
          Loading site settings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Site Settings
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Configure global contact info, corporate channels, and default meta tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={Boolean(savingSection)}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors shadow-xs"
            title="Refresh settings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleSaveSection("all")}
            disabled={Boolean(savingSection)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-semibold shadow-xs transition-colors disabled:opacity-60"
          >
            {savingSection === "all" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving All...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Global Success Banner */}
      {successSection && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">
            {successSection === "all"
              ? "All settings saved successfully!"
              : `${successSection.charAt(0).toUpperCase() + successSection.slice(1)} settings saved successfully!`}
          </span>
        </div>
      )}

      {/* 1. General Settings Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                General Settings
              </h3>
              <p className="text-xs text-neutral-500">
                Brand title, core tagline, and baseline search metadata.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={Boolean(savingSection)}
            onClick={() => handleSaveSection("general")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            {savingSection === "general" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Section</span>
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="general_site_name"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Site / Marketplace Name
              </label>
              <input
                id="general_site_name"
                type="text"
                value={settings.general_site_name}
                onChange={(e) => handleChange("general_site_name", e.target.value)}
                placeholder="SISORA"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="general_tagline"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Marketplace Tagline
              </label>
              <input
                id="general_tagline"
                type="text"
                value={settings.general_tagline}
                onChange={(e) => handleChange("general_tagline", e.target.value)}
                placeholder="Premier .SI Domain Marketplace"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="general_meta_description"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Default Meta Description
              </label>
              <textarea
                id="general_meta_description"
                rows={2}
                value={settings.general_meta_description}
                onChange={(e) =>
                  handleChange("general_meta_description", e.target.value)
                }
                placeholder="Global site description used when page-specific meta is not provided..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white resize-y"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Contact Settings Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Contact & Office Details
              </h3>
              <p className="text-xs text-neutral-500">
                Official contact channels displayed across footer, header, and inquiry pages.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={Boolean(savingSection)}
            onClick={() => handleSaveSection("contact")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            {savingSection === "contact" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Section</span>
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contact_phone"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="contact_phone"
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  placeholder="+386 1 000 0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact_email"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="contact@sisora.si"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact_address"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Office / Registry Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="contact_address"
                  type="text"
                  value={settings.contact_address}
                  onChange={(e) => handleChange("contact_address", e.target.value)}
                  placeholder="Ljubljana, Slovenia"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact_whatsapp"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <input
                  id="contact_whatsapp"
                  type="text"
                  value={settings.contact_whatsapp}
                  onChange={(e) => handleChange("contact_whatsapp", e.target.value)}
                  placeholder="+386 1 000 0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Social Media Links Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Social & Direct Messaging Links
              </h3>
              <p className="text-xs text-neutral-500">
                Official profile handles and instant messaging redirection URLs.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={Boolean(savingSection)}
            onClick={() => handleSaveSection("social")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            {savingSection === "social" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Section</span>
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="social_twitter"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Twitter / X URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Twitter className="w-4 h-4" />
                </div>
                <input
                  id="social_twitter"
                  type="url"
                  value={settings.social_twitter}
                  onChange={(e) => handleChange("social_twitter", e.target.value)}
                  placeholder="https://x.com/sisora_si"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="social_linkedin"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                LinkedIn URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Linkedin className="w-4 h-4" />
                </div>
                <input
                  id="social_linkedin"
                  type="url"
                  value={settings.social_linkedin}
                  onChange={(e) => handleChange("social_linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/sisora"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="social_whatsapp_url"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                WhatsApp Direct Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <input
                  id="social_whatsapp_url"
                  type="url"
                  value={settings.social_whatsapp_url}
                  onChange={(e) =>
                    handleChange("social_whatsapp_url", e.target.value)
                  }
                  placeholder="https://wa.me/38610000000"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
