"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Tag,
  DollarSign,
  Layers,
} from "lucide-react";
import { slugify } from "@/lib/utils";
import type { Domain } from "@/db/schema";

const CATEGORIES = [
  "One Word",
  "Premium",
  "Dictionary Word",
  "Brandable",
  "Short",
  "Tech",
  "Business & Finance",
  "AI & Data",
  "Crypto & Web3",
  "Ecommerce",
  "Health & Life",
];

export default function EditDomainPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  // Form states
  const [name, setName] = useState("");
  const [extension, setExtension] = useState(".si");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Premium");
  const [tagsInput, setTagsInput] = useState("");
  const [price, setPrice] = useState<string>("");
  const [priceType, setPriceType] = useState<"fixed" | "make_offer" | "inquiry">(
    "make_offer"
  );
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"active" | "sold" | "reserved">("active");

  // UX states
  const [loadingDomain, setLoadingDomain] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-slugify when name changes if slug hasn't been manually altered
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  // Fetch existing domain
  useEffect(() => {
    if (isNew) return;

    const fetchDomain = async () => {
      setLoadingDomain(true);
      setError(null);
      try {
        const res = await fetch(`/api/domains/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to load domain (Status ${res.status})`);
        }
        const domain: Domain = await res.json();
        setName(domain.name || "");
        setExtension(domain.extension || ".si");
        setSlug(domain.slug || "");
        setDescription(domain.description || "");
        setCategory(domain.category || "Premium");
        setTagsInput(
          Array.isArray(domain.tags) ? domain.tags.join(", ") : ""
        );
        setPrice(domain.price ? String(domain.price) : "");
        setPriceType(
          (domain.priceType as "fixed" | "make_offer" | "inquiry") || "make_offer"
        );
        setFeatured(Boolean(domain.featured));
        setStatus(
          (domain.status as "active" | "sold" | "reserved") || "active"
        );
        setSlugTouched(true);
      } catch (err: any) {
        setError(err?.message || "Error fetching domain details.");
      } finally {
        setLoadingDomain(false);
      }
    };

    fetchDomain();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim().replace(/\.si$/i, "");
    if (!cleanName) {
      setError("Please provide a domain name.");
      return;
    }

    setSaving(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const numericPrice =
      priceType === "fixed" && price ? parseInt(price, 10) : null;

    const payload = {
      name: cleanName,
      extension: extension.trim() || ".si",
      slug: slug.trim() || slugify(cleanName),
      description: description.trim() || null,
      category: category.trim() || null,
      tags,
      price: numericPrice,
      priceType,
      featured,
      status,
    };

    try {
      const url = isNew ? "/api/domains" : `/api/domains/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/domains");
      }, 600);
    } catch (err: any) {
      setError(err?.message || "Failed to save domain. Please try again.");
      setSaving(false);
    }
  };

  if (loadingDomain) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
        <p className="text-sm text-neutral-500 font-medium">
          Loading domain details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/domains"
            className="p-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors"
            title="Back to domains list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              {isNew ? "Add New Domain" : `Edit Domain: ${name}${extension}`}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isNew
                ? "Register a new .SI domain to your brokerage catalog."
                : "Modify pricing, metadata, visibility, and status."}
            </p>
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
            Domain saved successfully! Redirecting to list...
          </span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Section: Basic Info */}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-500" />
              <span>Domain Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="domain-name"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Domain Name *
                </label>
                <div className="flex rounded-xl shadow-xs">
                  <input
                    id="domain-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. meta, cloud, invest"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-l-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                  <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-neutral-200 bg-neutral-100 text-neutral-600 font-semibold text-sm">
                    {extension}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="domain-extension"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  TLD Extension
                </label>
                <input
                  id="domain-extension"
                  type="text"
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="domain-slug"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  URL Slug
                </label>
                <div className="flex rounded-xl">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-100 text-neutral-500 text-xs font-mono">
                    /domain/
                  </span>
                  <input
                    id="domain-slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugTouched(true);
                    }}
                    placeholder="domain-slug"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-r-xl text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="domain-description"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Description / Marketing Copy
                </label>
                <textarea
                  id="domain-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Highlight key value points, use cases, branding appeal, or industry fit for this domain..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all resize-y"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Section: Pricing & Commercials */}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <span>Pricing & Commercials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price-type"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Pricing Strategy
                </label>
                <select
                  id="price-type"
                  value={priceType}
                  onChange={(e) =>
                    setPriceType(
                      e.target.value as "fixed" | "make_offer" | "inquiry"
                    )
                  }
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                >
                  <option value="fixed">Fixed Buy-Now Price (USD)</option>
                  <option value="make_offer">Accepting Offers (Make Offer)</option>
                  <option value="inquiry">Price Upon Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="domain-price"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Asking Price (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <span className="text-sm font-bold">$</span>
                  </div>
                  <input
                    id="domain-price"
                    type="number"
                    min="0"
                    step="1"
                    disabled={priceType !== "fixed"}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={priceType === "fixed" ? "e.g. 5000" : "Disabled for Make Offer / Inquiry"}
                    className="w-full pl-8 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Section: Categorization & Status */}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>Categorization & Visibility</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="domain-category"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Category
                </label>
                <select
                  id="domain-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="domain-status"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Listing Status
                </label>
                <select
                  id="domain-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "active" | "sold" | "reserved")
                  }
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                >
                  <option value="active">Active (Available for purchase)</option>
                  <option value="reserved">Reserved (Under negotiation)</option>
                  <option value="sold">Sold (Archived / Historical)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="domain-tags"
                  className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                >
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <input
                    id="domain-tags"
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="saas, cloud, enterprise, ai, fintech"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Featured toggle switch */}
              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      featured ? "bg-neutral-900" : "bg-neutral-200"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform ${
                        featured ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-900">
                      Feature on Homepage & Premium Showcases
                    </span>
                    <span className="text-xs text-neutral-500">
                      Highlighted prominently in search and curated portfolios.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/domains"
            className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
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
                <span>{isNew ? "Create Domain" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
