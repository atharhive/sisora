"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Database,
  ArrowLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useAdmin } from "./AdminContext";

export function TopBar() {
  const pathname = usePathname();
  const { toggleSidebar } = useAdmin();

  const getPageInfo = (path: string): { title: string; category: string; isSubpage: boolean } => {
    if (path === "/admin") return { title: "Overview", category: "Dashboard", isSubpage: false };
    if (path === "/admin/domains") return { title: "Domain Catalog", category: "Inventory", isSubpage: true };
    if (path === "/admin/filters") return { title: "Filters & Taxonomy", category: "Engine", isSubpage: true };
    if (path === "/admin/offers") return { title: "Offers & Inquiries", category: "Brokerage", isSubpage: true };
    if (path === "/admin/track-record") return { title: "Track Record", category: "Authority", isSubpage: true };
    if (path === "/admin/settings") return { title: "Brokerage Settings", category: "Parameters", isSubpage: true };
    return { title: "Administration", category: "Terminal", isSubpage: true };
  };

  const { title, category, isSubpage } = getPageInfo(pathname);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 h-14 sm:h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation with Back link */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold min-w-0">
          {isSubpage ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-black hover:bg-neutral-100 px-2 py-1 rounded-lg transition-colors shrink-0"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600 shrink-0">
              Admin
            </span>
          )}

          <ChevronRight className="w-3 h-3 text-neutral-300 shrink-0" />

          <h1 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Back to Website & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Database Live Telemetry (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-semibold text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Database className="w-3 h-3 text-emerald-600" />
          <span>PG RLS Active</span>
        </div>

        {/* PRIMARY "BACK TO LIVE SITE" BUTTON */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/90 bg-neutral-50 hover:bg-black hover:text-white hover:border-black text-xs font-bold text-neutral-700 transition-all shadow-2xs cursor-pointer"
          title="Return to Sisora Public Website"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Back to Live Site</span>
          <span className="sm:hidden">Site</span>
        </Link>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out of Admin Console"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
