import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublicDomains } from "@/lib/data-server";
import { BuyDomainsClient } from "@/components/domains/BuyDomainsClient";
import { SITE_CONFIG } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Buy .SI Domains | Verified Portfolio | ${SITE_CONFIG.site.name}`,
  description:
    "Explore verified premium .SI domains for sale. Super Intelligence and generic dictionary assets available for secure escrow acquisition.",
};

export default async function BuyDomainsPage() {
  const domains = await getPublicDomains();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f5f7]" />}>
      <BuyDomainsClient initialDomains={domains} />
    </Suspense>
  );
}
