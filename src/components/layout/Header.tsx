"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav, NAV_LINKS } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buy-domains?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/90 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex flex-col select-none transition-transform active:scale-[0.99]">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-neutral-950 sm:text-2xl transition-colors group-hover:text-neutral-700">
                SISORA<span className="text-neutral-400 group-hover:text-black transition-colors">.SI</span>
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-neutral-500 uppercase transition-colors group-hover:text-neutral-800">
              A .SI DOMAIN BROKERAGE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all duration-150",
                    isActive
                      ? "text-neutral-950 bg-neutral-100/90"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-neutral-950" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search + Direct CTA + Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search domains"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-black hover:border-neutral-300 transition-all cursor-pointer active:scale-95"
            >
              {searchOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>

            {/* Primary Action Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-2.5 text-xs xl:text-sm font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-95"
            >
              <span>Submit Request</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black lg:hidden focus:outline-none focus:ring-2 focus:ring-black cursor-pointer active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="border-t border-neutral-100 bg-neutral-50/90 px-4 py-3 sm:px-6 animate-in slide-in-from-top-2 duration-150 backdrop-blur-xs">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-2xl items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search available .SI domain names (e.g. Pay, Licence, Gentle, Translate)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-neutral-950 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Slide-out Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}

export default Header;
