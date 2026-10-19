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
    name: "Domains",
    href: "/admin/domains",
    icon: Globe,
    exact: false,
  },
  {
    name: "Filters & Taxonomy",
    href: "/admin/filters",
    icon: SlidersHorizontal,
    exact: false,
  },
  {
    name: "Offers & Inquiries",
    href: "/admin/offers",
    icon: BadgeDollarSign,
    exact: false,
  },
  {
    name: "Track Record",
    href: "/admin/track-record",
    icon: Award,
    exact: false,
  },
  {
    name: "Site Settings",
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
    <div className="flex flex-col h-full bg-neutral-900 text-white select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-800/80">
        <Link
          href="/admin"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black text-sm tracking-tight group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base text-white">
              SISORA
            </span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase -mt-0.5">
              .SI Brokerage
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
          Management Console
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
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150",
                active
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/80 font-medium"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active ? "text-black" : "text-neutral-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / User & Logout */}
      <div className="p-3 border-t border-neutral-800/80 space-y-1">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors font-medium"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </span>
          <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
            .si
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-rose-400 hover:bg-neutral-800/80 transition-colors font-medium text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:border-r lg:border-neutral-800 z-30">
        <div className="sticky top-0 h-screen w-64">{navContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
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
