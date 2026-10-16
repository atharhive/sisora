import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedDomains } from "@/components/sections/FeaturedDomains";
import { TrackRecordSection } from "@/components/sections/TrackRecordSection";
import { EscrowEstimator } from "@/components/sections/EscrowEstimator";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { BuyerSellerCTA } from "@/components/sections/BuyerSellerCTA";
import { getFeaturedDomains, SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.site.name} | A Dedicated Brokerage for .SI Domains`,
  description: SITE_CONFIG.site.description,
};

export default function HomePage() {
  const featured = getFeaturedDomains();

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedDomains domains={featured} />
      <TrackRecordSection />
      <EscrowEstimator />
      <HowItWorks />
      <BuyerSellerCTA />
    </div>
  );
}
