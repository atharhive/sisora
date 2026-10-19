"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  DbDomain,
  DomainType,
  DomainCategory,
  ValuationCategory,
  Offer,
  TrackRecordCategory,
  TrackRecordDeal,
  TrackRecordSettings,
  SiteSettings,
} from "@/types/database";
import domainsData from "@/data/domains.json";
import siteConfigData from "@/data/site-config.json";

// Helper to log audit actions
async function logAudit(action: string, entityType: string, entityId?: string, details?: any) {
  try {
    const admin = createAdminClient();
    if (!admin) return;
    const serverSupabase = await createServerClient();
    const user = serverSupabase ? (await serverSupabase.auth.getUser()).data.user : null;
    const adminEmail = user?.email || "admin@sisora.si";

    await admin.from("audit_logs").insert({
      admin_email: adminEmail,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
    });
  } catch (err) {
    console.error("Failed to log audit:", err);
  }
}

// ============================================================================
// 1. DOMAIN TYPES
// ============================================================================

export async function getDomainTypes(): Promise<DomainType[]> {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");
    const { data, error } = await supabase
      .from("domain_types")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) throw error || new Error("No data");
    return data;
  } catch {
    // Fallback default domain types
    return [
      { id: "dt-1", slug: "one-word", label: "One-word", display_order: 1, is_active: true },
      { id: "dt-2", slug: "two-word", label: "Two-Word", display_order: 2, is_active: true },
      { id: "dt-3", slug: "ll", label: "LL (2-Letter)", display_order: 3, is_active: true },
      { id: "dt-4", slug: "lll", label: "LLL (3-Letter)", display_order: 4, is_active: true },
      { id: "dt-5", slug: "cvcv", label: "CVCV", display_order: 5, is_active: true },
    ];
  }
}

export async function saveDomainType(typeData: Partial<DomainType>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const slug =
    typeData.slug ||
    typeData.label?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const payload = {
    slug,
    label: typeData.label,
    display_order: typeData.display_order ?? 0,
    is_active: typeData.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (typeData.id) {
    res = await supabase.from("domain_types").update(payload).eq("id", typeData.id).select().single();
    await logAudit("UPDATE_DOMAIN_TYPE", "domain_types", typeData.id, payload);
  } else {
    res = await supabase.from("domain_types").insert(payload).select().single();
    await logAudit("CREATE_DOMAIN_TYPE", "domain_types", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };
  revalidatePath("/admin/filters");
  revalidatePath("/admin/domains");
  revalidatePath("/buy-domains");
  return { data: res.data };
}

export async function deleteDomainType(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("domain_types").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_DOMAIN_TYPE", "domain_types", id);
  revalidatePath("/admin/filters");
  revalidatePath("/admin/domains");
  return { success: true };
}

// ============================================================================
// 2. DOMAIN CATEGORIES
// ============================================================================

export async function getDomainCategories(): Promise<DomainCategory[]> {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");
    const { data, error } = await supabase
      .from("domain_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) throw error || new Error("No data");
    return data;
  } catch {
    // Default categories from static data
    return [
      { id: "dc-1", slug: "fintech-wealth", name: "Fintech & Wealth", display_order: 1, is_active: true },
      { id: "dc-2", slug: "fintech-payments", name: "Fintech & Payments", display_order: 2, is_active: true },
      { id: "dc-3", slug: "corporate-enterprise", name: "Corporate & Enterprise", display_order: 3, is_active: true },
      { id: "dc-4", slug: "brand-lifestyle", name: "Brand & Lifestyle", display_order: 4, is_active: true },
      { id: "dc-5", slug: "super-intelligence-ai", name: "Super Intelligence & AI", display_order: 5, is_active: true },
      { id: "dc-6", slug: "cvcv-brand", name: "CVCV Brand", display_order: 6, is_active: true },
      { id: "dc-7", slug: "two-word", name: "Two-Word", display_order: 7, is_active: true },
      { id: "dc-8", slug: "liquid-3-letter", name: "Liquid 3-Letter", display_order: 8, is_active: true },
      { id: "dc-9", slug: "2-letter-premium", name: "2-Letter Premium", display_order: 9, is_active: true },
    ];
  }
}

export async function saveDomainCategory(catData: Partial<DomainCategory>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const slug =
    catData.slug ||
    catData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const payload = {
    slug,
    name: catData.name,
    display_order: catData.display_order ?? 0,
    is_active: catData.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (catData.id) {
    res = await supabase.from("domain_categories").update(payload).eq("id", catData.id).select().single();
    await logAudit("UPDATE_DOMAIN_CATEGORY", "domain_categories", catData.id, payload);
  } else {
    res = await supabase.from("domain_categories").insert(payload).select().single();
    await logAudit("CREATE_DOMAIN_CATEGORY", "domain_categories", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };
  revalidatePath("/admin/filters");
  revalidatePath("/admin/domains");
  revalidatePath("/buy-domains");
  return { data: res.data };
}

export async function deleteDomainCategory(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("domain_categories").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_DOMAIN_CATEGORY", "domain_categories", id);
  revalidatePath("/admin/filters");
  revalidatePath("/admin/domains");
  return { success: true };
}

// ============================================================================
// 3. VALUATION CATEGORIES
// ============================================================================

export async function getValuationCategories(): Promise<ValuationCategory[]> {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");
    const { data, error } = await supabase
      .from("valuation_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) throw error || new Error("No data");
    return data;
  } catch {
    return [
      { id: "vc-1", slug: "make-offer", label: "Make an Offer", min_price: null, max_price: null, is_make_offer: true, display_order: 1, is_active: true },
      { id: "vc-2", slug: "under-5k", label: "Under $5,000", min_price: 0, max_price: 5000, is_make_offer: false, display_order: 2, is_active: true },
      { id: "vc-3", slug: "under-10k", label: "Under $10,000", min_price: 5000, max_price: 10000, is_make_offer: false, display_order: 3, is_active: true },
      { id: "vc-4", slug: "under-25k", label: "Under $25,000", min_price: 10000, max_price: 25000, is_make_offer: false, display_order: 4, is_active: true },
      { id: "vc-5", slug: "25k-50k", label: "$25,000 – $50,000", min_price: 25000, max_price: 50000, is_make_offer: false, display_order: 5, is_active: true },
      { id: "vc-6", slug: "50k-plus", label: "$50,000 and above", min_price: 50000, max_price: null, is_make_offer: false, display_order: 6, is_active: true },
    ];
  }
}

export async function saveValuationCategory(valData: Partial<ValuationCategory>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const slug =
    valData.slug ||
    valData.label?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const payload = {
    slug,
    label: valData.label,
    min_price: valData.min_price !== undefined ? valData.min_price : null,
    max_price: valData.max_price !== undefined ? valData.max_price : null,
    is_make_offer: valData.is_make_offer ?? false,
    display_order: valData.display_order ?? 0,
    is_active: valData.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (valData.id) {
    res = await supabase.from("valuation_categories").update(payload).eq("id", valData.id).select().single();
    await logAudit("UPDATE_VALUATION_CATEGORY", "valuation_categories", valData.id, payload);
  } else {
    res = await supabase.from("valuation_categories").insert(payload).select().single();
    await logAudit("CREATE_VALUATION_CATEGORY", "valuation_categories", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };
  revalidatePath("/admin/filters");
  revalidatePath("/admin/domains");
  revalidatePath("/buy-domains");
  return { data: res.data };
}

export async function deleteValuationCategory(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("valuation_categories").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_VALUATION_CATEGORY", "valuation_categories", id);
  revalidatePath("/admin/filters");
  revalidatePath("/admin/domains");
  return { success: true };
}

// ============================================================================
// 4. DOMAINS CATALOG
// ============================================================================

export async function getAllDomains(): Promise<DbDomain[]> {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");
    const { data, error } = await supabase
      .from("domains")
      .select("*, type:domain_types(*), category:domain_categories(*), valuation:valuation_categories(*)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) throw error || new Error("No data in DB");
    return data as DbDomain[];
  } catch {
    // Return static JSON fallback format mapped to DbDomain
    return (domainsData as any[]).map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      extension: d.extension || ".si",
      type_id: null,
      category_id: null,
      valuation_id: null,
      tags: d.tags || [],
      price: d.price || null,
      pricing_mode: d.priceType === "fixed" ? "fixed_price" : "make_offer",
      custom_cta_label: null,
      custom_cta_url: null,
      featured: !!d.featured,
      status: "available",
      description: d.description || "",
      total_visitors: d.totalVisitors || 0,
      category: { id: "c", slug: d.category, name: d.category, display_order: 0, is_active: true },
      type: { id: "t", slug: d.domainType, label: d.domainType, display_order: 0, is_active: true },
    })) as DbDomain[];
  }
}

export async function saveDomain(domainData: Partial<DbDomain>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const cleanName = (domainData.name || "").trim();
  const slug =
    domainData.slug ||
    cleanName.toLowerCase().replace(/\.si$/i, "").replace(/[^a-z0-9]+/g, "-");

  const payload: any = {
    name: cleanName.endsWith(".si") ? cleanName : `${cleanName}.si`,
    slug,
    extension: domainData.extension || ".si",
    type_id: domainData.type_id || null,
    category_id: domainData.category_id || null,
    valuation_id: domainData.valuation_id || null,
    tags: domainData.tags || [],
    price: domainData.price !== undefined ? domainData.price : null,
    pricing_mode: domainData.pricing_mode || (domainData.price ? "fixed_price" : "make_offer"),
    custom_cta_label: domainData.custom_cta_label || null,
    custom_cta_url: domainData.custom_cta_url || null,
    featured: domainData.featured ?? false,
    status: domainData.status || "available",
    description: domainData.description || "",
    updated_at: new Date().toISOString(),
  };

  let res;
  if (domainData.id && !domainData.id.startsWith("d-")) {
    res = await supabase.from("domains").update(payload).eq("id", domainData.id).select().single();
    await logAudit("UPDATE_DOMAIN", "domains", domainData.id, payload);
  } else {
    res = await supabase.from("domains").insert(payload).select().single();
    await logAudit("CREATE_DOMAIN", "domains", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/domains");
  revalidatePath("/buy-domains");
  revalidatePath(`/domains/${slug}`);
  revalidatePath("/");
  return { data: res.data };
}

export async function toggleDomainFeatured(id: string, featured: boolean) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("domains").update({ featured }).eq("id", id);
  if (error) return { error: error.message };

  await logAudit("TOGGLE_DOMAIN_FEATURED", "domains", id, { featured });
  revalidatePath("/admin");
  revalidatePath("/admin/domains");
  revalidatePath("/buy-domains");
  revalidatePath("/");
  return { success: true };
}

export async function deleteDomain(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("domains").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_DOMAIN", "domains", id);
  revalidatePath("/admin");
  revalidatePath("/admin/domains");
  revalidatePath("/buy-domains");
  return { success: true };
}

// ============================================================================
// 5. OFFERS & INQUIRIES
// ============================================================================

export async function getAllOffers(): Promise<Offer[]> {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) throw error || new Error("No data");
    return data as Offer[];
  } catch {
    return [];
  }
}

export async function saveOffer(offerData: Partial<Offer>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const payload: any = {
    domain_id: offerData.domain_id,
    domain_name: offerData.domain_name || null,
    buyer_name: offerData.buyer_name,
    buyer_email: offerData.buyer_email,
    buyer_phone: offerData.buyer_phone || null,
    offer_amount: Number(offerData.offer_amount) || 0,
    currency: offerData.currency || "USD",
    status: offerData.status || "new",
    notes: offerData.notes || null,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (offerData.id) {
    res = await supabase.from("offers").update(payload).eq("id", offerData.id).select().single();
    await logAudit("UPDATE_OFFER", "offers", offerData.id, payload);
  } else {
    res = await supabase.from("offers").insert(payload).select().single();
    await logAudit("MANUAL_CREATE_OFFER", "offers", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };
  revalidatePath("/admin/offers");
  return { data: res.data };
}

export async function updateOfferStatus(id: string, status: string, notes?: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const updatePayload: any = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (notes !== undefined) updatePayload.notes = notes;

  const { error } = await supabase.from("offers").update(updatePayload).eq("id", id);
  if (error) return { error: error.message };

  await logAudit("UPDATE_OFFER_STATUS", "offers", id, { status, notes });
  revalidatePath("/admin/offers");
  return { success: true };
}

export async function deleteOffer(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_OFFER", "offers", id);
  revalidatePath("/admin/offers");
  return { success: true };
}

// ============================================================================
// 6. TRACK RECORD (CATEGORIES, DEALS, SETTINGS)
// ============================================================================

export async function getTrackRecordData() {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");

    const [catRes, dealsRes, settingsRes] = await Promise.all([
      supabase.from("track_record_categories").select("*").order("display_order", { ascending: true }),
      supabase.from("track_record_deals").select("*").order("display_order", { ascending: true }),
      supabase.from("track_record_settings").select("*").eq("id", "singleton").maybeSingle(),
    ]);

    if (catRes.error || dealsRes.error) throw new Error("DB Error");

    const categories = catRes.data || [];
    const deals = dealsRes.data || [];
    const settings = settingsRes.data || {
      id: "singleton",
      headline: "Domain Brokerage Experience",
      subheadline: "Founded by Domingo, Sisora connects domain investors and facilitates professional negotiations in the .si domain market.",
      founder_authority_headline: "Domingo's Domain Industry Authority",
      founder_authority_bio: "Domingo is one of the most active dealmakers in the secondary domain market, having closed multiple LLL.com transactions, CVCV.coms, single-word .coms, and LLL.ai assets before founding Sisora to lead the .si market.",
      footnote: "These represent Domingo’s previous brokerage transactions. More deals will be added as Sisora grows.",
      cta_partner_url: "https://x.com/DomingoDomain",
    };

    return { categories, deals, settings };
  } catch {
    // Fallback static
    return {
      categories: [
        { id: "c1", title: "Notable .SI Brokerage Deals", display_order: 1, is_active: true },
        { id: "c2", title: "Broader Domain Industry Deal History", display_order: 2, is_active: true },
      ],
      deals: [
        { id: "d1", category_id: "c1", asset: "LM.si", metric: "2-Letter ccTLD", detail: "Private investor-to-investor acquisition of an ultra-scarce two-letter Slovenian domain asset.", price: null, display_order: 1, is_featured: true },
        { id: "d2", category_id: "c1", asset: "Need.si", metric: "One-Word Dictionary", detail: "High-yield commercial generic asset brokered directly to a technology enterprise.", price: null, display_order: 2, is_featured: true },
        { id: "d3", category_id: "c2", asset: "LLL.com Transactions", metric: "Liquid Global Real Estate", detail: "Closed several 3-letter .com transactions with leading global domain investors and investment funds.", price: null, display_order: 1, is_featured: true },
        { id: "d4", category_id: "c2", asset: "CVCV.com & One-Word .coms", metric: "Tier-1 Brandables", detail: "High-value brand acquisitions and negotiations on prime single-word English dictionary .coms and CVCV.com patterns.", price: null, display_order: 2, is_featured: true },
        { id: "d5", category_id: "c2", asset: "LLL.ai & One-Word .ai", metric: "Super Intelligence / AI", detail: "Structured early acquisitions of 3-letter and defining dictionary keyword assets in the artificial intelligence sector.", price: null, display_order: 3, is_featured: true },
      ],
      settings: {
        id: "singleton",
        headline: "Domain Brokerage Experience",
        subheadline: "Founded by Domingo, Sisora connects domain investors and facilitates professional negotiations in the .si domain market.",
        founder_authority_headline: "Domingo's Domain Industry Authority",
        founder_authority_bio: "Domingo is one of the most active dealmakers in the secondary domain market, having closed multiple LLL.com transactions, CVCV.coms, single-word .coms, and LLL.ai assets before founding Sisora to lead the .si market.",
        footnote: "These represent Domingo’s previous brokerage transactions. More deals will be added as Sisora grows.",
        cta_partner_url: "https://x.com/DomingoDomain",
      },
    };
  }
}

export async function saveTrackCategory(catData: Partial<TrackRecordCategory>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const payload = {
    title: catData.title,
    display_order: catData.display_order ?? 0,
    is_active: catData.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (catData.id && !catData.id.startsWith("c")) {
    res = await supabase.from("track_record_categories").update(payload).eq("id", catData.id).select().single();
    await logAudit("UPDATE_TRACK_CATEGORY", "track_record_categories", catData.id, payload);
  } else {
    res = await supabase.from("track_record_categories").insert(payload).select().single();
    await logAudit("CREATE_TRACK_CATEGORY", "track_record_categories", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };
  revalidatePath("/admin/track-record");
  revalidatePath("/track-record");
  return { data: res.data };
}

export async function deleteTrackCategory(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("track_record_categories").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_TRACK_CATEGORY", "track_record_categories", id);
  revalidatePath("/admin/track-record");
  revalidatePath("/track-record");
  return { success: true };
}

export async function saveTrackDeal(dealData: Partial<TrackRecordDeal>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const payload = {
    category_id: dealData.category_id,
    asset: dealData.asset,
    metric: dealData.metric,
    detail: dealData.detail,
    price: dealData.price || null,
    display_order: dealData.display_order ?? 0,
    is_featured: dealData.is_featured ?? true,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (dealData.id && !dealData.id.startsWith("d")) {
    res = await supabase.from("track_record_deals").update(payload).eq("id", dealData.id).select().single();
    await logAudit("UPDATE_TRACK_DEAL", "track_record_deals", dealData.id, payload);
  } else {
    res = await supabase.from("track_record_deals").insert(payload).select().single();
    await logAudit("CREATE_TRACK_DEAL", "track_record_deals", res.data?.id, payload);
  }

  if (res.error) return { error: res.error.message };
  revalidatePath("/admin/track-record");
  revalidatePath("/track-record");
  return { data: res.data };
}

export async function deleteTrackDeal(id: string) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.from("track_record_deals").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAudit("DELETE_TRACK_DEAL", "track_record_deals", id);
  revalidatePath("/admin/track-record");
  revalidatePath("/track-record");
  return { success: true };
}

export async function saveTrackSettings(settingsData: Partial<TrackRecordSettings>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const payload = {
    id: "singleton",
    headline: settingsData.headline,
    subheadline: settingsData.subheadline,
    founder_authority_headline: settingsData.founder_authority_headline,
    founder_authority_bio: settingsData.founder_authority_bio,
    footnote: settingsData.footnote,
    cta_partner_url: settingsData.cta_partner_url,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("track_record_settings").upsert(payload);
  if (error) return { error: error.message };

  await logAudit("UPDATE_TRACK_SETTINGS", "track_record_settings", "singleton", payload);
  revalidatePath("/admin/track-record");
  revalidatePath("/track-record");
  return { success: true };
}

// ============================================================================
// 7. SITE SETTINGS
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    if (!supabase) throw new Error("No supabase client");
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "singleton")
      .maybeSingle();

    if (error || !data) throw error || new Error("No data");
    return data as SiteSettings;
  } catch {
    const cfg = siteConfigData as any;
    return {
      id: "singleton",
      contact_email: cfg.contact?.email || "sisorasales@gmail.com",
      contact_phone: cfg.contact?.phone || "+91 70041 87030",
      contact_telegram: cfg.contact?.telegram || "@SisoraBrokerage",
      contact_location: cfg.contact?.location || "Global Investor Network",
      contact_escrow_info: cfg.contact?.address || "Licensed Escrow via Escrow.com & Atom.com",
      social_twitter: cfg.social?.twitter || "https://x.com/SisoraBrokerage",
      social_linkedin: cfg.social?.linkedin || "https://www.linkedin.com/showcase/4l-com/",
      brokerage_commission: cfg.brokerageTerms?.commission || "15% Commission",
      brokerage_exclusivity: cfg.brokerageTerms?.exclusivity || "90-Day Exclusive Agreement",
      stats: cfg.stats || [],
    };
  }
}

export async function saveSiteSettings(settingsData: Partial<SiteSettings>) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase not configured" };

  const payload = {
    id: "singleton",
    contact_email: settingsData.contact_email,
    contact_phone: settingsData.contact_phone,
    contact_telegram: settingsData.contact_telegram,
    contact_location: settingsData.contact_location,
    contact_escrow_info: settingsData.contact_escrow_info,
    social_twitter: settingsData.social_twitter,
    social_linkedin: settingsData.social_linkedin,
    brokerage_commission: settingsData.brokerage_commission,
    brokerage_exclusivity: settingsData.brokerage_exclusivity,
    stats: settingsData.stats,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) return { error: error.message };

  await logAudit("UPDATE_SITE_SETTINGS", "site_settings", "singleton", payload);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  return { success: true };
}
