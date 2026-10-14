"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/buy-domains", label: "Buy Domains" },
  { href: "/sell-domains", label: "Sell Domains" },
  { href: "/for-investors", label: "For Investors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInquiry?: () => void;
}

export function MobileNav({ isOpen, onClose, onOpenInquiry }: MobileNavProps) {
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

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <Link href="/" onClick={onClose} className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-black">
              SISORA
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
              A .SI BROKERAGE FIRM
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col space-y-1.5">
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
                    "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-neutral-200 p-6 space-y-3">
          {onOpenInquiry ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInquiry();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              <span>Submit an Inquiry</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/contact"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              <span>Submit an Inquiry</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <div className="text-center">
            <p className="text-xs text-neutral-400">
              Direct Desk: deals@sisora.si
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
