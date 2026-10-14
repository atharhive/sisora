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
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex flex-col select-none">
            <span className="text-xl font-black tracking-tight text-neutral-950 sm:text-2xl transition-colors group-hover:text-neutral-700">
              SISORA
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-neutral-500 uppercase transition-colors group-hover:text-neutral-700">
              A .SI BROKERAGE FIRM
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
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-black font-semibold bg-neutral-100"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search + CTA + Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search domains"
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {/* Submit an Inquiry CTA Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
            >
              <span>Submit an Inquiry</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black lg:hidden focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3 sm:px-6 animate-in slide-in-from-top-2 duration-150">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-2xl items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search available .SI domain names (e.g. cloud, pay, studio)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
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
