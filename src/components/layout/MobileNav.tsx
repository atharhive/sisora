"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight, Mail, Send, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/data";

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/buy-domains", label: "Buy Domains" },
  { href: "/sell-domains", label: "Sell Domains" },
  { href: "/for-investors", label: "For Investors" },
  { href: "/track-record", label: "Track Record" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInquiry?: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const prevPathname = React.useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <Link href="/" onClick={onClose} className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-neutral-950">
              SISORA.SI
            </span>
            <span className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
              A .SI DOMAIN BROKERAGE
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.99]",
                    isActive
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 opacity-30" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Direct Contacts */}
          <div className="mt-8 pt-6 border-t border-neutral-100 px-2 space-y-3">
            <span className="text-[10px] font-black tracking-wider uppercase text-neutral-400">
              Direct Brokerage Channels
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium transition-colors border border-neutral-200/60"
              >
                <Mail className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                <span className="truncate">Email</span>
              </a>
              <a
                href="https://x.com/SisoraBrokerage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium transition-colors border border-neutral-200/60"
              >
                <svg className="h-3.5 w-3.5 text-neutral-900 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="truncate">X (Twitter)</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-neutral-100 p-5 space-y-2.5 bg-neutral-50/50">
          <Link
            href="/buy-domains"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-colors"
          >
            <span>I&apos;m Looking to Buy →</span>
          </Link>
          <Link
            href="/sell-domains"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-900 shadow-xs hover:bg-neutral-100 transition-colors"
          >
            <span>I&apos;m Looking to Sell →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
