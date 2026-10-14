"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useAdmin } from "./AdminContext";

export function TopBar() {
  const pathname = usePathname();
  const { toggleSidebar, user } = useAdmin();

  // Compute page title based on route
  const getPageTitle = (path: string): string => {
    if (path === "/admin") return "Dashboard";
    if (path === "/admin/domains") return "Manage Domains";
    if (path === "/admin/domains/new") return "Add Domain";
    if (path.startsWith("/admin/domains/")) return "Edit Domain";
    if (path === "/admin/inquiries") return "Inquiries";
    if (path === "/admin/sell-submissions") return "Sell Submissions";
    if (path === "/admin/pages") return "Pages";
    if (path.startsWith("/admin/pages/")) return "Edit Page Content";
    if (path === "/admin/settings") return "Site Settings";
    return "Admin Panel";
  };

  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "admin@sisora.si";
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 h-16 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger toggle & Page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Admin user info & Logout */}
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-medium text-xs flex items-center justify-center shrink-0 shadow-xs">
            {initials || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-neutral-900 leading-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-neutral-500 leading-tight">
              {displayEmail}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
