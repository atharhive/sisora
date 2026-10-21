-- ==============================================================================
-- SISORA VISITOR ANALYTICS & TRAFFIC LOGS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT,
    country_code TEXT,
    country_name TEXT,
    city TEXT,
    region TEXT,
    path TEXT NOT NULL,
    domain_name TEXT,
    domain_slug TEXT,
    referrer TEXT,
    source TEXT,
    device_type TEXT DEFAULT 'desktop',
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup indexes for analytics aggregations
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_path ON public.site_visits (path);
CREATE INDEX IF NOT EXISTS idx_site_visits_domain_slug ON public.site_visits (domain_slug);
CREATE INDEX IF NOT EXISTS idx_site_visits_country ON public.site_visits (country_code);
CREATE INDEX IF NOT EXISTS idx_site_visits_source ON public.site_visits (source);

-- Row Level Security
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow public insert (via backend API or direct)
DROP POLICY IF EXISTS "Allow public insert to site_visits" ON public.site_visits;
CREATE POLICY "Allow public insert to site_visits" ON public.site_visits
    FOR INSERT WITH CHECK (true);

-- Allow admins full read/write access
DROP POLICY IF EXISTS "Admin full access site_visits" ON public.site_visits;
CREATE POLICY "Admin full access site_visits" ON public.site_visits
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
