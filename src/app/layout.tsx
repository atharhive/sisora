import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SISORA | Premium .SI Domain Brokerage",
  description:
    "Acquire and sell high-value .SI domains. Professional brokerage, secure escrow transfers, and confidential portfolio acquisitions.",
  keywords: [
    "SI domains",
    "domain brokerage",
    "buy SI domain",
    "sell SI domain",
    "premium domains",
    "Slovenia domains",
    "domain investor",
    "stealth domain acquisition",
  ],
  authors: [{ name: "SISORA" }],
  openGraph: {
    title: "SISORA | Premium .SI Domain Brokerage",
    description:
      "Acquire and sell high-value .SI domains. Professional brokerage, secure escrow transfers, and confidential portfolio acquisitions.",
    siteName: "SISORA",
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
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <ToastProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
