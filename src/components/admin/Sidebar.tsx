"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  SlidersHorizontal,
  BadgeDollarSign,
  Award,
  Settings,
  LogOut,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "./AdminContext";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Domain Catalog",
    href: "/admin/domains",
    icon: Globe,
    exact: false,
    badge: "105",
  },
  {
    name: "Filters & Taxonomy",
    href: "/admin/filters",
    icon: SlidersHorizontal,
    exact: false,
  },
  {
    name: "Offers & Pipeline",
    href: "/admin/offers",
    icon: BadgeDollarSign,
    exact: false,
    badge: "Active",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    name: "Track Record",
    href: "/admin/track-record",
    icon: Award,
    exact: false,
  },
  {
    name: "Site Configuration",
    href: "/admin/settings",
    icon: Settings,
    exact: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAdmin();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#090b0e] text-white select-none border-r border-neutral-800/80">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 h-20 border-b border-neutral-800/70">
        <Link
          href="/admin"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700/80 flex items-center justify-center text-white font-black text-base tracking-tight shadow-md group-hover:scale-105 transition-all">
            <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              S
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base text-white">
                SISORA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase -mt-0.5">
              .SI BROKERAGE TERMINAL
            </span>
          </div>
        </Link>

        {/* Mobile close */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Group */}
      <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const active = isItemActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "relative group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                active
                  ? "bg-white text-black shadow-md font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    active ? "text-black" : "text-neutral-400 group-hover:text-white"
                  )}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight border",
                    active
                      ? "bg-black/10 text-black border-black/10"
                      : item.badgeColor || "bg-white/5 text-neutral-400 border-white/10"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Live Website & User Card */}
      <div className="p-3.5 border-t border-neutral-800/70 space-y-2 bg-black/20">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-white/10"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            <span>Open Public Portal</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
            sisora.si ↗
          </span>
        </Link>

        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-xs font-bold text-white shrink-0">
              A
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">
                Admin
              </span>
              <span className="text-[10px] text-neutral-400 font-mono truncate">
                admin@sisora.si
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign out of console"
            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 z-30">
        <div className="sticky top-0 h-screen w-64">{navContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
