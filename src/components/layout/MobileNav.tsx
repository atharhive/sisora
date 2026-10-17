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
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://x.com/SisoraBrokerage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (@SisoraBrokerage)"
                className="flex h-11 items-center justify-center rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white transition-all active:scale-95 shadow-2xs"
              >
                <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                aria-label="Email"
                title={`Email (${SITE_CONFIG.contact.email})`}
                className="flex h-11 items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 transition-all active:scale-95 shadow-2xs"
              >
                <Mail className="h-4 w-4 text-neutral-700 shrink-0" />
              </a>
              <a
                href="http://t.me/SisoraBrokerage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                title="Telegram (@SisoraBrokerage)"
                className="flex h-11 items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 transition-all active:scale-95 shadow-2xs"
              >
                <svg className="h-4 w-4 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
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
