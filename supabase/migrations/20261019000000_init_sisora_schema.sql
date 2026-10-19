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
    founder_authority_headline TEXT DEFAULT 'Domingos Domain Industry Authority',
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
    'Domingos Domain Industry Authority',
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 100000) AND (max_price IS NULL OR max_price >= 100000) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    100000,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    13750,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    13750,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    13750,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 13750) AND (max_price IS NULL OR max_price >= 13750) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    13750,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 4995) AND (max_price IS NULL OR max_price >= 4995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    4995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 14999) AND (max_price IS NULL OR max_price >= 14999) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    14999,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 4995) AND (max_price IS NULL OR max_price >= 4995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    4995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 2995) AND (max_price IS NULL OR max_price >= 2995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    2995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 49999) AND (max_price IS NULL OR max_price >= 49999) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    49999,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 49999) AND (max_price IS NULL OR max_price >= 49999) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    49999,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = false AND (min_price IS NULL OR min_price <= 24995) AND (max_price IS NULL OR max_price >= 24995) ORDER BY min_price DESC NULLS LAST LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    24995,
    ,
    false,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
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
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
     + str.replace(/'/g, ) + ,
    (SELECT id FROM public.domain_types WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.domain_categories WHERE slug =  + str.replace(/'/g, ) +  LIMIT 1),
    (SELECT id FROM public.valuation_categories WHERE is_make_offer = true LIMIT 1),
    ARRAY[ + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + , + str.replace(/'/g, ) + ]::TEXT[],
    NULL,
    ,
    true,
    available,
     + str.replace(/'/g, ) + ,
    5210
) ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    price = EXCLUDED.price,
    pricing_mode = EXCLUDED.pricing_mode,
    featured = EXCLUDED.featured,
    description = EXCLUDED.description;
