-- ==============================================================================
-- SISORA ENTERPRISE ADMIN & BROKERAGE DATABASE SCHEMA & INITIAL SEED
-- Execute this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DOMAIN TYPES
CREATE TABLE IF NOT EXISTS public.domain_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOMAIN CATEGORIES
CREATE TABLE IF NOT EXISTS public.domain_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VALUATION CATEGORIES
CREATE TABLE IF NOT EXISTS public.valuation_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    min_price NUMERIC,
    max_price NUMERIC,
    is_make_offer BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOMAINS CATALOG
CREATE TABLE IF NOT EXISTS public.domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    extension TEXT DEFAULT '.si' NOT NULL,
    type_id UUID REFERENCES public.domain_types(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.domain_categories(id) ON DELETE SET NULL,
    valuation_id UUID REFERENCES public.valuation_categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    price NUMERIC,
    pricing_mode TEXT DEFAULT 'fixed_price' CHECK (pricing_mode IN ('fixed_price', 'make_offer', 'both', 'custom')),
    custom_cta_label TEXT,
    custom_cta_url TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'in_escrow', 'sold', 'hidden')),
    description TEXT DEFAULT '',
    total_visitors INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OFFERS & BUYER INQUIRIES
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES public.domains(id) ON DELETE CASCADE,
    domain_name TEXT,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    offer_amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'countered', 'accepted', 'declined', 'in_escrow')),
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRACK RECORD CATEGORIES
CREATE TABLE IF NOT EXISTS public.track_record_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRACK RECORD DEALS
CREATE TABLE IF NOT EXISTS public.track_record_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.track_record_categories(id) ON DELETE CASCADE,
    asset TEXT NOT NULL,
    metric TEXT NOT NULL,
    detail TEXT NOT NULL,
    price TEXT,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TRACK RECORD SETTINGS
CREATE TABLE IF NOT EXISTS public.track_record_settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    headline TEXT DEFAULT 'Domain Brokerage Experience',
    subheadline TEXT DEFAULT 'Founded by Domingo, Sisora connects domain investors and facilitates professional negotiations in the .si domain market.',
    founder_authority_headline TEXT DEFAULT 'Domingo''s Domain Industry Authority',
    founder_authority_bio TEXT DEFAULT 'Domingo is one of the most active dealmakers in the secondary domain market, having closed multiple LLL.com transactions, CVCV.coms, single-word .coms, and LLL.ai assets before founding Sisora to lead the .si market.',
    footnote TEXT DEFAULT 'These represent Domingo’s previous brokerage transactions. More deals will be added as Sisora grows.',
    cta_partner_url TEXT DEFAULT 'https://x.com/DomingoDomain',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    contact_email TEXT DEFAULT 'sisorasales@gmail.com',
    contact_phone TEXT DEFAULT '+91 70041 87030',
    contact_telegram TEXT DEFAULT '@SisoraBrokerage',
    contact_location TEXT DEFAULT 'Global Investor Network',
    contact_escrow_info TEXT DEFAULT 'Licensed Escrow via Escrow.com & Atom.com',
    social_twitter TEXT DEFAULT 'https://x.com/SisoraBrokerage',
    social_linkedin TEXT DEFAULT 'https://www.linkedin.com/showcase/4l-com/',
    brokerage_commission TEXT DEFAULT '15% Commission',
    brokerage_exclusivity TEXT DEFAULT '90-Day Exclusive Agreement',
    stats JSONB DEFAULT '[{"highlight": "100%", "label": "SPECIALIZED IN .SI DOMAINS"}, {"highlight": "B2B", "label": "INVESTOR TO INVESTOR TRANSACTIONS"}, {"highlight": "LICENSED", "label": "ESCROW.COM & ATOM.COM ESCROW"}, {"highlight": "GLOBAL", "label": "BUYER & INVESTOR NETWORK"}]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.domain_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_record_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_record_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_record_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view active domain types" ON public.domain_types;
    DROP POLICY IF EXISTS "Public can view active categories" ON public.domain_categories;
    DROP POLICY IF EXISTS "Public can view active valuation categories" ON public.valuation_categories;
    DROP POLICY IF EXISTS "Public can view published domains" ON public.domains;
    DROP POLICY IF EXISTS "Public can submit offers" ON public.offers;
    DROP POLICY IF EXISTS "Public can view active track categories" ON public.track_record_categories;
    DROP POLICY IF EXISTS "Public can view track record deals" ON public.track_record_deals;
    DROP POLICY IF EXISTS "Public can view track record settings" ON public.track_record_settings;
    DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;

    DROP POLICY IF EXISTS "Admin full access domain_types" ON public.domain_types;
    DROP POLICY IF EXISTS "Admin full access domain_categories" ON public.domain_categories;
    DROP POLICY IF EXISTS "Admin full access valuation_categories" ON public.valuation_categories;
    DROP POLICY IF EXISTS "Admin full access domains" ON public.domains;
    DROP POLICY IF EXISTS "Admin full access offers" ON public.offers;
    DROP POLICY IF EXISTS "Admin full access track_categories" ON public.track_record_categories;
    DROP POLICY IF EXISTS "Admin full access track_deals" ON public.track_record_deals;
    DROP POLICY IF EXISTS "Admin full access track_settings" ON public.track_record_settings;
    DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admin full access audit_logs" ON public.audit_logs;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Public Read Policies
CREATE POLICY "Public can view active domain types" ON public.domain_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON public.domain_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active valuation categories" ON public.valuation_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published domains" ON public.domains FOR SELECT USING (status != 'hidden');
CREATE POLICY "Public can submit offers" ON public.offers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view active track categories" ON public.track_record_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view track record deals" ON public.track_record_deals FOR SELECT USING (true);
CREATE POLICY "Public can view track record settings" ON public.track_record_settings FOR SELECT USING (true);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Admin full access domain_types" ON public.domain_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access domain_categories" ON public.domain_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access valuation_categories" ON public.valuation_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access domains" ON public.domains FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access offers" ON public.offers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access track_categories" ON public.track_record_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access track_deals" ON public.track_record_deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access track_settings" ON public.track_record_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Service Role Bypass (Ensures Next.js Server actions can operate cleanly)
ALTER TABLE public.domain_types FORCE ROW LEVEL SECURITY;
ALTER TABLE public.domain_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.domains FORCE ROW LEVEL SECURITY;
ALTER TABLE public.offers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.track_record_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.track_record_deals FORCE ROW LEVEL SECURITY;
ALTER TABLE public.track_record_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;

-- ==============================================================================
-- INITIAL DATA SEED
-- ==============================================================================

-- 1. Domain Types
INSERT INTO public.domain_types (slug, label, display_order) VALUES
('one-word', 'One-word', 1),
('two-word', 'Two-Word', 2),
('ll', 'LL (2-Letter)', 3),
('lll', 'LLL (3-Letter)', 4),
('cvcv', 'CVCV', 5)
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label;

-- 2. Domain Categories
INSERT INTO public.domain_categories (slug, name, display_order) VALUES
('fintech-wealth', 'Fintech & Wealth', 1),
('fintech-payments', 'Fintech & Payments', 2),
('corporate-enterprise', 'Corporate & Enterprise', 3),
('brand-lifestyle', 'Brand & Lifestyle', 4),
('super-intelligence-ai', 'Super Intelligence & AI', 5),
('cvcv-brand', 'CVCV Brand', 6),
('two-word', 'Two-Word', 7),
('liquid-3-letter', 'Liquid 3-Letter', 8),
('2-letter-premium', '2-Letter Premium', 9)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 3. Valuation Categories
INSERT INTO public.valuation_categories (slug, label, min_price, max_price, is_make_offer, display_order) VALUES
('make-offer', 'Make an Offer', NULL, NULL, true, 1),
('under-5k', 'Under $5,000', 0, 5000, false, 2),
('under-10k', 'Under $10,000', 5000, 10000, false, 3),
('under-25k', 'Under $25,000', 10000, 25000, false, 4),
('25k-50k', '$25,000 – $50,000', 25000, 50000, false, 5),
('50k-plus', '$50,000 and above', 50000, NULL, false, 6)
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label;

-- 4. Track Record Categories & Deals
INSERT INTO public.track_record_categories (id, title, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Notable .SI Brokerage Deals', 1),
('c0000000-0000-0000-0000-000000000002', 'Broader Domain Industry Deal History', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.track_record_deals (category_id, asset, metric, detail, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'LM.si', '2-Letter ccTLD', 'Private investor-to-investor acquisition of an ultra-scarce two-letter Slovenian domain asset.', 1),
('c0000000-0000-0000-0000-000000000001', 'Need.si', 'One-Word Dictionary', 'High-yield commercial generic asset brokered directly to a technology enterprise.', 2),
('c0000000-0000-0000-0000-000000000002', 'LLL.com Transactions', 'Liquid Global Real Estate', 'Closed several 3-letter .com transactions with leading global domain investors and investment funds.', 1),
('c0000000-0000-0000-0000-000000000002', 'CVCV.com & One-Word .coms', 'Tier-1 Brandables', 'High-value brand acquisitions and negotiations on prime single-word English dictionary .coms and CVCV.com patterns.', 2),
('c0000000-0000-0000-0000-000000000002', 'LLL.ai & One-Word .ai', 'Super Intelligence / AI', 'Structured early acquisitions of 3-letter and defining dictionary keyword assets in the artificial intelligence sector.', 3)
ON CONFLICT DO NOTHING;

-- 5. Track Record Settings & Site Settings (Singletons)
INSERT INTO public.track_record_settings (id, headline, subheadline, founder_authority_headline, founder_authority_bio, footnote, cta_partner_url)
VALUES (
    'singleton',
    'Domain Brokerage Experience',
    'Founded by Domingo, Sisora connects domain investors and facilitates professional negotiations in the .si domain market.',
    'Domingo''s Domain Industry Authority',
    'Domingo is one of the most active dealmakers in the secondary domain market, having closed multiple LLL.com transactions, CVCV.coms, single-word .coms, and LLL.ai assets before founding Sisora to lead the .si market.',
    'These represent Domingo’s previous brokerage transactions. More deals will be added as Sisora grows.',
    'https://x.com/DomingoDomain'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, contact_email, contact_phone, contact_telegram, contact_location, contact_escrow_info, social_twitter, social_linkedin, brokerage_commission, brokerage_exclusivity)
VALUES (
    'singleton',
    'sisorasales@gmail.com',
    '+91 70041 87030',
    '@SisoraBrokerage',
    'Global Investor Network',
    'Licensed Escrow via Escrow.com & Atom.com',
    'https://x.com/SisoraBrokerage',
    'https://www.linkedin.com/showcase/4l-com/',
    '15% Commission',
    '90-Day Exclusive Agreement'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert All 105 Domains

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Money.si',
    'money',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'fintech-wealth' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['Fintech', 'Money', 'Super Intelligence', 'Category Killer']::TEXT[],
    NULL,
    'make_offer',
    true,
    'available',
    'Premier global financial asset commanding instant authority for fintech, wealth management, banking, or digital payment rails.',
    8920
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Pay.si',
    'pay',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'fintech-payments' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['Fintech', 'Payments', 'Super Intelligence', 'Category Killer']::TEXT[],
    NULL,
    'make_offer',
    true,
    'available',
    'Tier-1 category-defining financial technology brand for payments, neo-banking, cross-border settlement, or digital wallet ecosystems.',
    9240
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Licence.si',
    'licence',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'corporate-enterprise' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Software Licensing', 'Legal Tech', 'Compliance', 'Enterprise']::TEXT[],
    24995,
    'fixed_price',
    true,
    'available',
    'High-authority corporate domain for software licensing, legal compliance, fintech verification, or international accreditation portals.',
    6840
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Gentle.si',
    'gentle',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['AI Assistant', 'Wellness', 'Organic', 'Luxury Brand']::TEXT[],
    24995,
    'fixed_price',
    true,
    'available',
    'Clean, calming one-word brand ideal for consumer wellness, AI companion assistants, organic products, or luxury lifestyle ventures.',
    4720
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Translate.si',
    'translate',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'super-intelligence-ai' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['AI Translation', 'Language Tech', 'Super Intelligence', 'Localization']::TEXT[],
    24995,
    'fixed_price',
    true,
    'available',
    'Premium dictionary keyword for artificial intelligence translation engines, global localization platforms, or neural speech tech.',
    5890
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Toronto.si',
    'toronto',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 100000) AND (max_price IS NULL OR max_price >= 100000) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Toronto', 'Canada', 'Metro', 'Geo', 'Super Intelligence']::TEXT[],
    100000,
    'fixed_price',
    true,
    'available',
    'Ultra-premium geographic capital brand for Canada''s financial powerhouse, major tech hub, and cultural capital on the .SI extension.',
    8240
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Determined.si',
    'determined',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Brand', 'Leadership', 'Enterprise', 'Super Intelligence']::TEXT[],
    13750,
    'fixed_price',
    false,
    'available',
    'Powerful, evocative dictionary brand representing grit, conviction, artificial intelligence agency, and high-performance execution.',
    4120
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Humility.si',
    'humility',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Virtue', 'Brand', 'Leadership', 'Super Intelligence']::TEXT[],
    13750,
    'fixed_price',
    false,
    'available',
    'Virtue-defining dictionary asset suitable for leadership institutes, ethical AI governance, human-centric tech, or foundation platforms.',
    3890
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Persevere.si',
    'persevere',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Brand', 'Resilience', 'Health', 'Super Intelligence']::TEXT[],
    13750,
    'fixed_price',
    false,
    'available',
    'Authoritative English verb domain embodying endurance, athletic performance, mental health, deep-tech research, and resilience.',
    3760
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Disciplined.si',
    'disciplined',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'corporate-enterprise' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Enterprise', 'Finance', 'Trading', 'Super Intelligence']::TEXT[],
    13750,
    'fixed_price',
    false,
    'available',
    'Category-defining corporate term for institutional asset management, systematic trading, operational excellence, or elite coaching.',
    4050
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Straight.si',
    'straight',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Finance', 'Direct', 'Brand', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Punchy, multi-purpose English dictionary keyword ideal for fintech payments, direct-to-consumer commerce, dental health, or logistics.',
    5120
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Deta.si',
    'deta',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 4995) AND (max_price IS NULL OR max_price >= 4995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', 'Cloud', 'Developer Tools', 'Tech', 'Super Intelligence']::TEXT[],
    4995,
    'fixed_price',
    false,
    'available',
    'Ultra-liquid 4-letter CVCV brand asset with massive developer recognition in personal cloud, compute infrastructure, and modern software.',
    6420
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Wilson.si',
    'wilson',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 14999) AND (max_price IS NULL OR max_price >= 14999) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Surname', 'Brand', 'Heritage', 'Super Intelligence']::TEXT[],
    14999,
    'fixed_price',
    false,
    'available',
    'Tier-1 global surname and heritage brand asset. Universal authority for consumer goods, luxury manufacturing, legal, or advisory firms.',
    4680
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'SmartReach.si',
    'smartreach',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'two-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'two-word' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['Two-Word', 'Marketing', 'Outreach', 'SaaS', 'Super Intelligence']::TEXT[],
    NULL,
    'make_offer',
    true,
    'available',
    'High-intent B2B SaaS brand for AI sales engagement, multichannel outreach, marketing automation, or customer acquisition technology.',
    6890
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'SecureLab.si',
    'securelab',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'two-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'two-word' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['Two-Word', 'Cybersecurity', 'Infosec', 'Crypto', 'Super Intelligence']::TEXT[],
    NULL,
    'make_offer',
    true,
    'available',
    'Institutional-grade digital asset for cybersecurity research, penetration testing, smart contract auditing, or cryptographic infrastructure.',
    7210
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Corrupted.si',
    'corrupted',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['Gaming', 'Entertainment', 'Cyber', 'Super Intelligence']::TEXT[],
    NULL,
    'make_offer',
    false,
    'available',
    'Impactful, culturally loaded dictionary asset commanding attention in gaming studios, cyberpunk IP, streetwear, or security auditing.',
    5430
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Either.si',
    'either',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 4995) AND (max_price IS NULL OR max_price >= 4995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Decision', 'Fintech', 'Consumer', 'Super Intelligence']::TEXT[],
    4995,
    'fixed_price',
    false,
    'available',
    'Concise English dictionary keyword representing choice, binary options, A/B testing, decision intelligence, or modern fintech.',
    4320
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Conver.si',
    'conver',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'brand-lifestyle' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 2995) AND (max_price IS NULL OR max_price >= 2995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Domain Hack', 'Conversion', 'SaaS', 'Super Intelligence']::TEXT[],
    2995,
    'fixed_price',
    false,
    'available',
    'Brilliant natural domain hack forming ''Conversi'' (Conversation / Conversion) for conversational AI agents, chatbots, and CRO platforms.',
    5180
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Molecule.si',
    'molecule',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'super-intelligence-ai' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 49999) AND (max_price IS NULL OR max_price >= 49999) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Biotech', 'Science', 'Pharma', 'AI', 'Super Intelligence']::TEXT[],
    49999,
    'fixed_price',
    true,
    'available',
    'Elite scientific dictionary asset commanding instant authority for AI drug discovery, computational biology, materials science, or chemistry.',
    8320
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'Operation.si',
    'operation',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'one-word' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'corporate-enterprise' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 49999) AND (max_price IS NULL OR max_price >= 49999) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['Enterprise', 'Logistics', 'Cloud Ops', 'Super Intelligence']::TEXT[],
    49999,
    'fixed_price',
    true,
    'available',
    'Universal corporate noun for enterprise workflow management, IT operations, cloud orchestration, surgical tech, or defense logistics.',
    8140
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NDF.si',
    'ndf',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (NDF) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2100
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FDN.si',
    'fdn',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (FDN) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2137
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LPD.si',
    'lpd',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LPD) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2174
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'GTN.si',
    'gtn',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (GTN) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2211
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'DFN.si',
    'dfn',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (DFN) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2248
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FGN.si',
    'fgn',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (FGN) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2285
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NDP.si',
    'ndp',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (NDP) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2322
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NRE.si',
    'nre',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (NRE) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2359
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HPL.si',
    'hpl',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (HPL) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2396
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LDP.si',
    'ldp',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LDP) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2433
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HDP.si',
    'hdp',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (HDP) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2470
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'KDN.si',
    'kdn',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (KDN) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2507
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LRE.si',
    'lre',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LRE) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2544
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NPT.si',
    'npt',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (NPT) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2581
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HBN.si',
    'hbn',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (HBN) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2618
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MDF.si',
    'mdf',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (MDF) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2655
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NDE.si',
    'nde',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (NDE) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2692
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'PNE.si',
    'pne',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (PNE) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2729
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FNP.si',
    'fnp',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (FNP) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2766
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'ZRE.si',
    'zre',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (ZRE) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2803
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LHR.si',
    'lhr',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LHR) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2840
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'RNP.si',
    'rnp',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (RNP) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2877
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HTR.si',
    'htr',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (HTR) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2914
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'RFB.si',
    'rfb',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (RFB) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2951
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FTD.si',
    'ftd',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (FTD) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    2988
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'TLR.si',
    'tlr',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (TLR) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3025
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LGH.si',
    'lgh',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LGH) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3062
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LHG.si',
    'lhg',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LHG) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3099
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'PNB.si',
    'pnb',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (PNB) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3136
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'KNH.si',
    'knh',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (KNH) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3173
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LHK.si',
    'lhk',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LHK) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3210
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FPK.si',
    'fpk',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (FPK) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3247
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LPO.si',
    'lpo',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'lll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'liquid-3-letter' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['LLL', '3-Letter', 'Super Intelligence', 'Liquid Acronym']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Liquid 3-letter .SI acronym asset (LPO) with strong liquidity and global institutional appeal. Secured via Escrow.com & Atom.com.',
    3284
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'BEDA.si',
    'beda',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (BEDA) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    1900
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MEDE.si',
    'mede',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (MEDE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    1943
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MEKE.si',
    'meke',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (MEKE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    1986
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LEKE.si',
    'leke',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (LEKE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2029
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'DAPA.si',
    'dapa',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (DAPA) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2072
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HEPE.si',
    'hepe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HEPE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2115
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FOFA.si',
    'fofa',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FOFA) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2158
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'SOTE.si',
    'sote',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (SOTE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2201
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HEBO.si',
    'hebo',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HEBO) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2244
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'TEBO.si',
    'tebo',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (TEBO) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2287
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MOCE.si',
    'moce',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (MOCE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2330
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'BAPU.si',
    'bapu',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (BAPU) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2373
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'BEFE.si',
    'befe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (BEFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2416
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'BEGI.si',
    'begi',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (BEGI) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2459
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'DODI.si',
    'dodi',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (DODI) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2502
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FACI.si',
    'faci',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FACI) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2545
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FAFE.si',
    'fafe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FAFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2588
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FENE.si',
    'fene',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FENE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2631
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FESO.si',
    'feso',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FESO) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2674
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FIGE.si',
    'fige',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FIGE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2717
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FOCE.si',
    'foce',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FOCE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2760
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FOFE.si',
    'fofe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FOFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2803
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'FOGE.si',
    'foge',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (FOGE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2846
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'GAFE.si',
    'gafe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (GAFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2889
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'GEBE.si',
    'gebe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (GEBE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2932
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'GEFO.si',
    'gefo',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (GEFO) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2975
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'GOFA.si',
    'gofa',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (GOFA) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3018
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'GOGE.si',
    'goge',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (GOGE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3061
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HACE.si',
    'hace',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HACE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3104
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HAFE.si',
    'hafe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HAFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3147
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HEDE.si',
    'hede',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HEDE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3190
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HEFE.si',
    'hefe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HEFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3233
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'HEGE.si',
    'hege',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (HEGE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3276
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'KECE.si',
    'kece',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (KECE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3319
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'KICE.si',
    'kice',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (KICE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3362
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LEFE.si',
    'lefe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (LEFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3405
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'LEFO.si',
    'lefo',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (LEFO) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3448
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MEBE.si',
    'mebe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (MEBE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3491
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MEFI.si',
    'mefi',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (MEFI) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3534
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MIFE.si',
    'mife',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (MIFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3577
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'ROFA.si',
    'rofa',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (ROFA) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3620
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'TOCI.si',
    'toci',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (TOCI) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3663
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'PIFE.si',
    'pife',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (PIFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3706
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'POCE.si',
    'poce',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (POCE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3749
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'COCE.si',
    'coce',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (COCE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    3792
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NIGE.si',
    'nige',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (NIGE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    1935
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'PAFO.si',
    'pafo',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (PAFO) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    1978
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'PEGE.si',
    'pege',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (PEGE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2021
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NAFE.si',
    'nafe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (NAFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2064
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'NEFE.si',
    'nefe',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'cvcv' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = 'cvcv-brand' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY['CVCV', '4-Letter', 'Brandable', 'Super Intelligence']::TEXT[],
    24995,
    'fixed_price',
    false,
    'available',
    'Rare 4-letter CVCV pattern (NEFE) with pure vocalic harmony and international recall. Verified for immediate acquisition.',
    2107
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'CD.si',
    'cd',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = '2-letter-premium' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['2-Letter', 'LL', 'Super Intelligence', 'Ultra-Liquid']::TEXT[],
    NULL,
    'make_offer',
    true,
    'available',
    'Ultra-rare 2-letter .SI domain asset (CD). High institutional liquidity, compact branding, and worldwide recognition.',
    5640
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;

INSERT INTO public.domains (
    name, slug, extension, type_id, category_id, valuation_id, tags, price, pricing_mode, featured, status, description, total_visitors
) VALUES (
    'MF.si',
    'mf',
    '.si',
    (SELECT id FROM public.domain_types WHERE slug = 'll' LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug = '2-letter-premium' LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY['2-Letter', 'LL', 'Super Intelligence', 'Ultra-Liquid']::TEXT[],
    NULL,
    'make_offer',
    true,
    'available',
    'Ultra-rare 2-letter .SI domain asset (MF). High liquidity financial acronym, frontier technology, and global venture branding.',
    5210
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;
