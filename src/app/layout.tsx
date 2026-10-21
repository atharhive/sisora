import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SISORA.SI | A Dedicated Brokerage for .SI Domains",
  description:
    "Sisora is a dedicated brokerage connecting .si domain investors to buy and sell domain names. We manage negotiations between buyers and sellers, helping turn opportunities into completed transactions.",
  keywords: [
    "SI domains",
    "domain brokerage",
    "buy SI domain",
    "sell SI domain",
    "premium domains",
    "Slovenia domains",
    "domain investor",
    "stealth domain acquisition",
    "Super Intelligence",
  ],
  authors: [{ name: "SISORA" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SISORA.SI | A Dedicated Brokerage for .SI Domains",
    description:
      "Sisora is a dedicated brokerage connecting .si domain investors to buy and sell domain names. We manage negotiations between buyers and sellers, helping turn opportunities into completed transactions.",
    siteName: "SISORA.SI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#f4f5f7] text-[#090a0c] selection:bg-neutral-900 selection:text-white">
        <ToastProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
