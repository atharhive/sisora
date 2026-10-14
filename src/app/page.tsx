import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { FeaturedDomains } from "@/components/sections/FeaturedDomains";
import { BuyerSellerCTA } from "@/components/sections/BuyerSellerCTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { getFeaturedDomains, SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: SITE_CONFIG.site.title,
  description: SITE_CONFIG.site.description,
};

export default function HomePage() {
  const featured = getFeaturedDomains();

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
