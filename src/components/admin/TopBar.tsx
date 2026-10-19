"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, ExternalLink, ShieldCheck, Database, Bell } from "lucide-react";
import { useAdmin } from "./AdminContext";

export function TopBar() {
  const pathname = usePathname();
  const { toggleSidebar, user } = useAdmin();

  const getPageInfo = (path: string): { title: string; category: string } => {
    if (path === "/admin") return { title: "Executive Overview", category: "Dashboard" };
    if (path === "/admin/domains") return { title: "Domain Catalog Manager", category: "Inventory" };
    if (path === "/admin/filters") return { title: "Filters & Taxonomy", category: "Engine" };
    if (path === "/admin/offers") return { title: "Offers & Deal Pipeline", category: "Brokerage" };
    if (path === "/admin/track-record") return { title: "Track Record Experience", category: "Authority" };
    if (path === "/admin/settings") return { title: "Site Configuration", category: "Parameters" };
    return { title: "Administration", category: "Terminal" };
  };

  const { title, category } = getPageInfo(pathname);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Context title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600">
            {category}
          </span>
          <span className="hidden sm:inline text-neutral-300">/</span>
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Database Live Heartbeat */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Database className="w-3 h-3 text-emerald-600" />
          <span>PostgreSQL RLS Active</span>
        </div>

        {/* Live Website Preview Button */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          <span className="hidden sm:inline">View Live Site</span>
        </Link>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
