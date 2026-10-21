import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ISO 3166-1 alpha-2 country name mapping for primary markets
const COUNTRY_NAMES: Record<string, string> = {
  SI: "Slovenia",
  US: "United States",
  DE: "Germany",
  GB: "United Kingdom",
  UK: "United Kingdom",
  AT: "Austria",
  IT: "Italy",
  HR: "Croatia",
  CH: "Switzerland",
  FR: "France",
  NL: "Netherlands",
  BE: "Belgium",
  ES: "Spain",
  CA: "Canada",
  AU: "Australia",
  AE: "United Arab Emirates",
  SG: "Singapore",
  IN: "India",
  JP: "Japan",
  CN: "China",
  BR: "Brazil",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  CZ: "Czech Republic",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  GR: "Greece",
  RS: "Serbia",
  BA: "Bosnia & Herzegovina",
  ME: "Montenegro",
  MK: "North Macedonia",
};

function getCountryName(code: string | null | undefined): string {
  if (!code) return "Unknown Region";
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] || upper;
}

function parseTrafficSource(referrer: string | null, searchParams?: URLSearchParams): string {
  const utmSource = searchParams?.get("utm_source");
  if (utmSource) {
    if (utmSource.toLowerCase().includes("twitter") || utmSource.toLowerCase().includes("x")) return "X (Twitter)";
    if (utmSource.toLowerCase().includes("linkedin")) return "LinkedIn";
    return utmSource;
  }

  if (!referrer || referrer.trim() === "" || referrer === "undefined") {
    return "Direct Navigation";
  }

  try {
    const refUrl = new URL(referrer);
    const host = refUrl.hostname.toLowerCase();

    if (host.includes("x.com") || host.includes("twitter.com") || host.includes("t.co")) return "X (Twitter)";
    if (host.includes("linkedin.com") || host.includes("lnkd.in")) return "LinkedIn";
    if (host.includes("google.")) return "Google Search";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("duckduckgo.")) return "DuckDuckGo";
    if (host.includes("yahoo.")) return "Yahoo";
    if (host.includes("namepros.com")) return "NamePros";
    if (host.includes("dnforum.com")) return "DNForum";
    if (host.includes("escrow.com")) return "Escrow.com";
    if (host.includes("atom.com")) return "Atom.com";
    if (host.includes("dan.com")) return "Dan.com";
    if (host.includes("sedo.com")) return "Sedo";
    if (host.includes("sisora.si") || host.includes("localhost")) return "Internal Navigation";

    return host.replace(/^www\./, "");
  } catch {
    return "Referral";
  }
}

function parseUserAgent(ua: string | null): { device: string; browser: string; os: string } {
  if (!ua) {
    return { device: "desktop", browser: "Unknown", os: "Unknown" };
  }

  const uaLower = ua.toLowerCase();

  // Device
  let device = "desktop";
  if (uaLower.includes("tablet") || uaLower.includes("ipad")) {
    device = "tablet";
  } else if (uaLower.includes("mobile") || uaLower.includes("iphone") || uaLower.includes("android")) {
    device = "mobile";
  }

  // OS
  let os = "Other";
  if (uaLower.includes("mac os") || uaLower.includes("macintosh")) os = "macOS";
  else if (uaLower.includes("windows")) os = "Windows";
  else if (uaLower.includes("iphone") || uaLower.includes("ipad") || uaLower.includes("ios")) os = "iOS";
  else if (uaLower.includes("android")) os = "Android";
  else if (uaLower.includes("linux")) os = "Linux";

  // Browser
  let browser = "Other";
  if (uaLower.includes("edg/")) browser = "Edge";
  else if (uaLower.includes("chrome") && !uaLower.includes("edg")) browser = "Chrome";
  else if (uaLower.includes("safari") && !uaLower.includes("chrome")) browser = "Safari";
  else if (uaLower.includes("firefox")) browser = "Firefox";
  else if (uaLower.includes("opr") || uaLower.includes("opera")) browser = "Opera";

  return { device, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path: string = body.path || "/";

    // Don't track administrative routes or automated bots
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Extract headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    const countryCode = req.headers.get("x-vercel-ip-country") || null;
    const countryName = getCountryName(countryCode);
    const city = req.headers.get("x-vercel-ip-city") ? decodeURIComponent(req.headers.get("x-vercel-ip-city")!) : null;
    const region = req.headers.get("x-vercel-ip-country-region") || null;

    const ua = req.headers.get("user-agent");
    const { device, browser, os } = parseUserAgent(ua);

    const clientReferrer = body.referrer || req.headers.get("referer") || "";
    const source = parseTrafficSource(clientReferrer);
    const screen = body.screen || null;

    // Detect target domain if this is a domain detail page
    let domainSlug: string | null = null;
    let domainName: string | null = null;

    if (path.startsWith("/domains/")) {
      const parts = path.split("?")[0].split("/").filter(Boolean);
      if (parts[1]) {
        domainSlug = parts[1].toLowerCase();
        // Capitalize domain name for display (e.g. licence -> Licence.si)
        domainName = domainSlug.charAt(0).toUpperCase() + domainSlug.slice(1) + ".si";
      }
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: true, warning: "Database client unavailable" });
    }

    const payload = {
      ip_address: ip,
      country_code: countryCode,
      country_name: countryName,
      city: city,
      region: region,
      path: path,
      domain_name: domainName,
      domain_slug: domainSlug,
      referrer: clientReferrer || null,
      source: source,
      device_type: device,
      browser: browser,
      os: os,
      screen_resolution: screen,
    };

    // 1. Try writing directly into site_visits table
    const { error: visitError } = await supabase.from("site_visits").insert(payload);

    // 2. Fallback to audit_logs if site_visits table does not exist in schema cache
    if (visitError) {
      await supabase.from("audit_logs").insert({
        admin_email: "visitor",
        action: "PAGE_VIEW",
        entity_type: domainName ? "domain" : "page",
        entity_id: path,
        ip_address: ip,
        details: payload,
      });
    }

    // 3. If visitor landed on a specific domain, increment domain total_visitors
    if (domainSlug) {
      try {
        const { data: dom } = await supabase
          .from("domains")
          .select("id, total_visitors")
          .or(`slug.eq.${domainSlug},name.ilike.${domainSlug}.si`)
          .limit(1)
          .maybeSingle();

        if (dom?.id) {
          const currentCount = Number(dom.total_visitors) || 0;
          await supabase
            .from("domains")
            .update({ total_visitors: currentCount + 1 })
            .eq("id", dom.id);
        }
      } catch (domErr) {
        // Non-critical, ignore
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[analytics-tracker error]", err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Tracking failed" }, { status: 500 });
  }
}
