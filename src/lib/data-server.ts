import { createAdminClient } from "@/lib/supabase/admin";
import { DOMAINS, DomainItem, getDomainType } from "@/lib/data";

// Helper to map DB row to frontend DomainItem format
export function mapDbDomainToDomainItem(d: {
  id: string;
  name: string;
  slug: string;
  extension?: string;
  category?: { name: string } | null;
  type?: { label: string } | null;
  tags?: string[] | null;
  price?: number | null;
  pricing_mode?: string | null;
  featured?: boolean;
  status?: string;
  total_visitors?: number;
  description?: string;
  created_at?: string;
}): DomainItem {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    extension: d.extension || ".si",
    category: d.category?.name || "Premium Domain",
    domainType: d.type?.label || getDomainType({ name: d.name, slug: d.slug } as DomainItem),
    tags: Array.isArray(d.tags) ? d.tags : [],
    price: d.price !== null && d.price !== undefined ? Number(d.price) : null,
    priceType: d.pricing_mode === "fixed_price" ? "fixed" : "make_offer",
    featured: !!d.featured,
    status: d.status || "available",
    totalVisitors: d.total_visitors || 0,
    description: d.description || "",
    createdAt: d.created_at,
  };
}

/**
 * Fetches all active domains from Supabase database.
 * Falls back to static domains.json if DB is not configured or fails.
 */
export async function getPublicDomains(): Promise<DomainItem[]> {
  try {
    const supabase = createAdminClient();
    if (!supabase) return DOMAINS;

    const { data, error } = await supabase
      .from("domains")
      .select("*, type:domain_types(*), category:domain_categories(*), valuation:valuation_categories(*)")
      .order("featured", { ascending: false })
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return DOMAINS;
    }

    return data.map(mapDbDomainToDomainItem);
  } catch (err) {
    console.error("Failed to fetch public domains from DB, falling back to static:", err);
    return DOMAINS;
  }
}

/**
 * Fetches all featured domains for the homepage.
 */
export async function getPublicFeaturedDomains(): Promise<DomainItem[]> {
  try {
    const domains = await getPublicDomains();
    const featured = domains.filter((d) => d.featured);
    return featured.length > 0 ? featured : domains.slice(0, 4);
  } catch {
    return DOMAINS.filter((d) => d.featured);
  }
}

/**
 * Fetches single domain by its slug or name.
 */
export async function getPublicDomainBySlug(slug: string): Promise<DomainItem | undefined> {
  const cleanSlug = slug.toLowerCase().replace(/\.si$/i, "").trim();
  try {
    const supabase = createAdminClient();
    if (!supabase) {
      return DOMAINS.find(
        (d) => d.slug.toLowerCase() === cleanSlug || d.name.toLowerCase() === `${cleanSlug}.si`
      );
    }

    const { data, error } = await supabase
      .from("domains")
      .select("*, type:domain_types(*), category:domain_categories(*), valuation:valuation_categories(*)")
      .or(`slug.ilike.${cleanSlug},name.ilike.${cleanSlug}.si`)
      .limit(1)
      .maybeSingle();

    if (data && !error) {
      return mapDbDomainToDomainItem(data);
    }

    return DOMAINS.find(
      (d) => d.slug.toLowerCase() === cleanSlug || d.name.toLowerCase() === `${cleanSlug}.si`
    );
  } catch (err) {
    console.error("Error fetching domain by slug:", err);
    return DOMAINS.find((d) => d.slug.toLowerCase() === cleanSlug);
  }
}
