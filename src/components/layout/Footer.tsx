import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";

// Inline social icons for sharp rendering
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.03-.5.2-.17.18-.67.65-.67 1.6 0 .94.69 1.86.78 1.99.1.13 1.33 2.05 3.24 2.88 1.59.69 1.91.55 2.26.52.35-.03 1.13-.46 1.29-.91.16-.45.16-.84.11-.91-.05-.08-.18-.13-.37-.23s-1.13-.56-1.31-.62c-.17-.07-.3-.1-.43.1-.13.19-.5.62-.61.75-.12.13-.23.15-.42.05-.19-.1-.8-.29-1.53-.94-.57-.51-.95-1.14-1.06-1.33-.11-.19-.01-.3.08-.39.09-.09.19-.23.29-.34.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.34-.04-.1-.43-1.04-.6-1.42-.16-.38-.32-.32-.44-.33h-.37z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 4-column layout */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: SISORA logo + tagline + social icons */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white">
                SISORA
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                A .SI BROKERAGE FIRM
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Sisora is a dedicated .si domain brokerage connecting investors
              through professional brokerage and personalized service.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors text-neutral-400 hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/buy-domains"
                  className="hover:text-white transition-colors text-neutral-400 hover:underline"
                >
                  Buy Domains
                </Link>
              </li>
              <li>
                <Link
                  href="/sell-domains"
                  className="hover:text-white transition-colors text-neutral-400 hover:underline"
                >
                  Sell Domains
                </Link>
              </li>
              <li>
                <Link
                  href="/for-investors"
                  className="hover:text-white transition-colors text-neutral-400 hover:underline"
                >
                  For Investors
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors text-neutral-400 hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors text-neutral-400 hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link
                  href="/for-investors"
                  className="hover:text-white transition-colors"
                >
                  Investor to Investor Brokerage
                </Link>
              </li>
              <li>
                <Link
                  href="/for-investors#acquisition"
                  className="hover:text-white transition-colors"
                >
                  Domain Acquisition Requests
                </Link>
              </li>
              <li>
                <Link
                  href="/sell-domains"
                  className="hover:text-white transition-colors"
                >
                  Portfolio Liquidation
                </Link>
              </li>
              <li>
                <Link
                  href="/for-investors"
                  className="hover:text-white transition-colors"
                >
                  Private Deal Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  Market Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{SITE_CONFIG.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{SITE_CONFIG.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <LinkedInIcon className="h-4 w-4 shrink-0 text-neutral-500" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2.5 text-neutral-400">
                  <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{SITE_CONFIG.contact.location}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Sisora.si. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy-policy"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-neutral-700">|</span>
            <Link
              href="/terms-of-service"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
