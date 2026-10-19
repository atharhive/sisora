export type PricingMode = "fixed_price" | "make_offer" | "both" | "custom";
export type DomainStatus = "available" | "pending" | "in_escrow" | "sold" | "hidden";
export type OfferStatus = "new" | "reviewing" | "countered" | "accepted" | "declined" | "in_escrow";

export interface DomainType {
  id: string;
  slug: string;
  label: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DomainCategory {
  id: string;
  slug: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ValuationCategory {
  id: string;
  slug: string;
  label: string;
  min_price: number | null;
  max_price: number | null;
  is_make_offer: boolean;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbDomain {
  id: string;
  name: string;
  slug: string;
  extension: string;
  type_id: string | null;
  category_id: string | null;
  valuation_id: string | null;
  tags: string[];
  price: number | null;
  pricing_mode: PricingMode;
  custom_cta_label: string | null;
  custom_cta_url: string | null;
  featured: boolean;
  status: DomainStatus;
  description: string;
  total_visitors: number;
  created_at?: string;
  updated_at?: string;
  // Joined fields for display
  type?: DomainType | null;
  category?: DomainCategory | null;
  valuation?: ValuationCategory | null;
}

export interface Offer {
  id: string;
  domain_id: string;
  domain_name?: string | null;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  offer_amount: number;
  currency: string;
  status: OfferStatus;
  notes: string | null;
  ip_address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TrackRecordCategory {
  id: string;
  title: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TrackRecordDeal {
  id: string;
  category_id: string;
  asset: string;
  metric: string;
  detail: string;
  price: string | null;
  display_order: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  category?: TrackRecordCategory | null;
}

export interface TrackRecordSettings {
  id: string;
  headline: string;
  subheadline: string;
  founder_authority_headline: string;
  founder_authority_bio: string;
  footnote: string;
  cta_partner_url: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  contact_email: string;
  contact_phone: string;
  contact_telegram: string;
  contact_location: string;
  contact_escrow_info: string;
  social_twitter: string;
  social_linkedin: string;
  brokerage_commission: string;
  brokerage_exclusivity: string;
  stats: Array<{ highlight: string; label: string }>;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}
