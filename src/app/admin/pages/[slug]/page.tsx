"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Code,
  Sliders,
  Plus,
  Trash2,
  FileText,
  Search,
} from "lucide-react";
import type { Page } from "@/db/schema";

const DEFAULT_CONTENT_TEMPLATES: Record<string, Record<string, string>> = {
  home: {
    heroHeadline: "The Premier Marketplace for .SI Domains",
    heroSubheadline:
      "Acquire premium Slovenian digital assets, strategic brandable names, and short .si domains.",
    ctaPrimaryText: "Explore Portfolio",
    ctaSecondaryText: "Sell Your Domain",
    trustBadge: "Accredited .SI Domain Brokerage",
    portfolioHeading: "Featured Premium Domains",
    portfolioSubheading:
      "Hand-selected top-tier domain assets ready for immediate acquisition.",
  },
  about: {
    heroHeadline: "About SISORA",
    heroSubheadline:
      "Specialized domain brokerage dedicated exclusively to the Slovenian .SI namespace.",
    missionStatement:
      "Connecting visionary entrepreneurs and global enterprises with high-value digital real estate.",
    experienceSummary:
      "Decades of combined registry experience, secure escrow protocols, and private negotiation.",
  },
  "buy-domains": {
    heroHeadline: "Acquire Premium .SI Domains",
    heroSubheadline:
      "Safe, transparent acquisition process backed by official registrar transfer protocols.",
    escrowGuarantee:
      "All transactions processed through verified escrow to ensure 100% buyer protection.",
    transferTimeline:
      "Standard transfer authorization codes issued within 24 business hours.",
  },
  "sell-domains": {
    heroHeadline: "Monetize Your .SI Domain Portfolio",
    heroSubheadline:
      "Partner with SISORA to reach qualified global buyers, enterprises, and domain investors.",
    commissionRate: "15% flat commission only upon successful closed sale.",
    valuationNotice:
      "Complimentary expert appraisal for premium, one-word, and high-traffic .si assets.",
  },
  investors: {
    heroHeadline: "Institutional & Investor Acquisitions",
    heroSubheadline:
      "Access curated off-market portfolios, bulk packages, and high-yield digital assets.",
    marketInsight:
      ".SI domains represent significant strategic branding value in Central and Eastern Europe.",
    contactPrompt:
      "Schedule a confidential portfolio briefing with our acquisitions desk.",
  },
  contact: {
    heroHeadline: "Contact Our Brokerage Desk",
    heroSubheadline:
      "Speak directly with an accredited .SI domain specialist regarding any listing or inquiry.",
    officeHours: "Monday to Friday, 09:00 - 18:00 CET",
    responseCommitment:
      "All inquiries receive an individual response within 12 business hours.",
  },
};

export default function EditPageContentPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "home";

  // Page fields
  const [title, setTitle] = useState(
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")
  );
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [contentFields, setContentFields] = useState<Record<string, string>>({});

  // Mode: Form fields vs Raw JSON
  const [rawMode, setRawMode] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // New custom key addition
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

  // Statuses
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch Page Data
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (res.ok) {
          const data: Page = await res.json();
          setTitle(data.title || title);
          setMetaTitle(data.metaTitle || "");
          setMetaDescription(data.metaDescription || "");
          const content =
            data.content && typeof data.content === "object"
              ? (data.content as Record<string, string>)
              : DEFAULT_CONTENT_TEMPLATES[slug] || {};
          setContentFields(content);
          setRawJsonText(JSON.stringify(content, null, 2));
        } else {
          // Use default content template if page not yet in DB
          const defaults = DEFAULT_CONTENT_TEMPLATES[slug] || {};
          setContentFields(defaults);
          setRawJsonText(JSON.stringify(defaults, null, 2));
          setMetaTitle(`${title} | SISORA .SI Domains`);
          setMetaDescription(
            `SISORA official ${title.toLowerCase()} page for .SI domain brokerage.`
          );
        }
      } catch {
        const defaults = DEFAULT_CONTENT_TEMPLATES[slug] || {};
        setContentFields(defaults);
        setRawJsonText(JSON.stringify(defaults, null, 2));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  // Sync field value changes
  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...contentFields, [key]: value };
    setContentFields(updated);
    setRawJsonText(JSON.stringify(updated, null, 2));
  };

  // Remove a field
  const handleDeleteField = (key: string) => {
    const updated = { ...contentFields };
    delete updated[key];
    setContentFields(updated);
    setRawJsonText(JSON.stringify(updated, null, 2));
  };

  // Add new field
  const handleAddField = () => {
    if (!newKey.trim()) return;
    const key = newKey.trim().replace(/\s+/g, "_");
    const updated = { ...contentFields, [key]: newValue };
    setContentFields(updated);
    setRawJsonText(JSON.stringify(updated, null, 2));
    setNewKey("");
    setNewValue("");
    setIsAddingField(false);
  };

  // Raw JSON edit handler
  const handleRawJsonChange = (text: string) => {
    setRawJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && parsed !== null) {
        setContentFields(parsed);
        setJsonError(null);
      } else {
        setJsonError("JSON must be a valid object.");
      }
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax.");
    }
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rawMode && jsonError) {
      setError("Please resolve JSON syntax errors before saving.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      slug,
      title: title.trim(),
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      content: contentFields,
    };

    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (${res.status})`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err?.message || "Failed to update page content.");
    } finally {
      setSaving(false);
    }
  };

  const formatKeyName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
        <p className="text-sm text-neutral-500 font-medium">
          Loading page editor...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors"
            title="Back to pages list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Edit Content: {title}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Slug: <span className="font-mono text-neutral-700">/{slug}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="inline-flex rounded-xl bg-neutral-100 p-1 border border-neutral-200">
            <button
              type="button"
              onClick={() => setRawMode(false)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !rawMode
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Form Fields</span>
            </button>
            <button
              type="button"
              onClick={() => setRawMode(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                rawMode
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">
            Page content updated successfully!
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO Metadata Box */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-500" />
            <span>Search Engine Optimization (SEO) & Title</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="page-title"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
              >
                Page Title *
              </label>
              <input
                id="page-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="meta-title"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                >
                  Meta Title
                </label>
                <span className="text-[11px] text-neutral-400">
                  {metaTitle.length}/60 chars recommended
                </span>
              </div>
              <input
                id="meta-title"
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. SISORA | Premium .SI Domains Marketplace"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="meta-description"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                >
                  Meta Description
                </label>
                <span className="text-[11px] text-neutral-400">
                  {metaDescription.length}/160 chars recommended
                </span>
              </div>
              <textarea
                id="meta-description"
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief summary of page content for search engines..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white resize-y"
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-500" />
              <span>Page Text & Section Content</span>
            </h3>

            {!rawMode && (
              <button
                type="button"
                onClick={() => setIsAddingField(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black py-1 px-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Content Key</span>
              </button>
            )}
          </div>

          {/* Add custom field dialog / row */}
          {isAddingField && !rawMode && (
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3 animate-in fade-in">
              <div className="text-xs font-bold text-neutral-900">
                Add New Content Key
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Key name (e.g. footerNotice)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="Initial value / copy"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingField(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-lg shadow-xs"
                >
                  Insert Field
                </button>
              </div>
            </div>
          )}

          {rawMode ? (
            /* Raw JSON Editor */
            <div className="space-y-2">
              <p className="text-xs text-neutral-500">
                Directly edit raw page content JSON payload.
              </p>
              <textarea
                rows={16}
                value={rawJsonText}
                onChange={(e) => handleRawJsonChange(e.target.value)}
                className="w-full p-4 font-mono text-xs bg-neutral-900 text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-700 leading-relaxed resize-y"
              />
              {jsonError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {jsonError}
                </p>
              )}
            </div>
          ) : (
            /* Form Fields Generator */
            <div className="space-y-5">
              {Object.keys(contentFields).length === 0 ? (
                <p className="text-xs text-neutral-400 italic">
                  No content keys configured for this page yet. Click "Add
                  Content Key" to begin.
                </p>
              ) : (
                Object.entries(contentFields).map(([key, val]) => {
                  const isLong = String(val).length > 80 || String(val).includes("\n");
                  return (
                    <div
                      key={key}
                      className="p-4 rounded-xl bg-neutral-50/75 border border-neutral-200/90 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor={`content-${key}`}
                          className="text-xs font-bold text-neutral-900"
                        >
                          {formatKeyName(key)}
                          <span className="ml-2 font-mono text-[10px] text-neutral-400 font-normal">
                            ({key})
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteField(key)}
                          className="p-1 text-neutral-400 hover:text-rose-600 opacity-60 hover:opacity-100 transition-opacity"
                          title="Remove field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isLong ? (
                        <textarea
                          id={`content-${key}`}
                          rows={3}
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-y"
                        />
                      ) : (
                        <input
                          id={`content-${key}`}
                          type="text"
                          value={val}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/pages"
            className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || (rawMode && Boolean(jsonError))}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-semibold shadow-xs transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Page Content</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
