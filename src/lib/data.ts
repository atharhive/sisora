import domainsData from "@/data/domains.json";
import siteConfigData from "@/data/site-config.json";

export interface DomainItem {
  id: string;
  name: string;
  slug: string;
  extension: string;
  category: string;
  tags: string[];
  price: number | null;
  priceType: string;
  featured: boolean;
  status: string;
  totalVisitors?: number;
  description: string;
  createdAt?: string;
}

export interface SiteConfig {
  site: {
    name: string;
    subtitle: string;
    title: string;
    description: string;
    url: string;
  };
  contact: {
    email: string;
    phone: string;
    phoneRaw: string;
    telegram: string;
    telegramUrl?: string;
    location: string;
    address: string;
  };
  social: {
    twitter: string;
    linkedin: string;
    telegram?: string;
  };
  specialization?: string[];
  stats: Array<{ highlight: string; label: string }>;
  hero: {
    badge?: string;
    headline: string;
    subheadline: string;
    primaryCta?: string;
    secondaryCta?: string;
    taglineSmall?: string;
    taglineBig?: string;
    taglineDescription?: string;
  };
  brokerageTerms?: {
    commission: string;
    commissionDetail: string;
    exclusivity: string;
    exclusivityDetail: string;
    negotiations: string;
    negotiationsDetail: string;
    coordination: string;
    coordinationDetail: string;
    footnote: string;
  };
  founder?: {
    name: string;
    title: string;
    bio: string;
    notableDeals: Array<{ domain: string; type: string }>;
    footnote: string;
  };
}

export const DOMAINS: DomainItem[] = domainsData as DomainItem[];
export const SITE_CONFIG: SiteConfig = siteConfigData as SiteConfig;

export function getDomainBySlug(slug: string): DomainItem | undefined {
  return DOMAINS.find(
    (d) =>
      d.slug.toLowerCase() === slug.toLowerCase() ||
      d.name.toLowerCase() === slug.toLowerCase() ||
      d.name.toLowerCase() === `${slug.toLowerCase()}.si`
  );
}

export function getFeaturedDomains(): DomainItem[] {
  return DOMAINS.filter((d) => d.featured);
}
