"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Copy,
  Download,
  Check,
  Building2,
} from "lucide-react";
import { SITE_CONFIG, SiteConfig } from "@/lib/data";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const { success } = useToast();
  const [config, setConfig] = useState<SiteConfig>(SITE_CONFIG);
  const [copied, setCopied] = useState(false);

  const copyConfigJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    success("Copied site-config.json to clipboard!", "Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConfigJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "site-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    success("Downloaded updated site-config.json file.", "Downloaded");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Site Configuration &amp; Contact Settings
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Stored in <code className="font-semibold text-neutral-700">src/data/site-config.json</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyConfigJson}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied!" : "Copy JSON"}</span>
          </button>
          <button
            type="button"
            onClick={downloadConfigJson}
            className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download site-config.json</span>
          </button>
        </div>
      </div>

      {/* Contact Channels Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>Contact &amp; Lead Inboxes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brokerage Inquiries Email
            </label>
            <input
              type="email"
              value={config.contact.email}
              onChange={(e) =>
                setConfig({
                  ...config,
                  contact: { ...config.contact, email: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              WhatsApp Contact Number
            </label>
            <input
              type="text"
              value={config.contact.whatsapp}
              onChange={(e) =>
                setConfig({
                  ...config,
                  contact: { ...config.contact, whatsapp: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Phone Display
            </label>
            <input
              type="text"
              value={config.contact.phone}
              onChange={(e) =>
                setConfig({
                  ...config,
                  contact: { ...config.contact, phone: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Office Location
            </label>
            <input
              type="text"
              value={config.contact.location}
              onChange={(e) =>
                setConfig({
                  ...config,
                  contact: { ...config.contact, location: e.target.value },
                })
              }
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
              value={config.social.linkedin}
              onChange={(e) =>
                setConfig({
                  ...config,
                  social: { ...config.social, linkedin: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              X (Twitter) URL
            </label>
            <input
              type="text"
              value={config.social.twitter}
              onChange={(e) =>
                setConfig({
                  ...config,
                  social: { ...config.social, twitter: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
