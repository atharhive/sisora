import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { FeaturedDomains } from "@/components/sections/FeaturedDomains";
import { BuyerSellerCTA } from "@/components/sections/BuyerSellerCTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SAMPLE_DOMAINS } from "@/lib/data/sample-domains";

export const metadata: Metadata = {
  title: "SISORA | Premium .SI Domain Brokerage",
  description:
    "Acquire and sell high-value .SI domains. Professional brokerage, secure escrow transfers, and confidential portfolio acquisitions.",
};

export default function HomePage() {
  const featured = SAMPLE_DOMAINS.filter((d) => d.featured);

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsBar />
      <FeaturedDomains domains={featured} />
      <BuyerSellerCTA />
      <HowItWorks />
    </div>
  );
}
