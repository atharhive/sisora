import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { admins, domains, pages, siteSettings } from "./schema";

async function main() {
  console.log("🌱 Starting SISORA database seed...");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ Error: DATABASE_URL environment variable is not defined.");
    process.exit(1);
  }

  // Create db connection inline as specified
  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  // ─── 1. Admin Account ─────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sisora.si";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!Sisora";
  const adminName = "SISORA Admin";

  console.log(`👤 Seeding admin account: ${adminEmail}`);
  const passwordHash = await hash(adminPassword, 10);

  const [existingAdmin] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.email, adminEmail))
    .limit(1);

  if (!existingAdmin) {
    await db.insert(admins).values({
      email: adminEmail,
      name: adminName,
      passwordHash,
    });
    console.log("   ✅ Admin created successfully.");
  } else {
    await db
      .update(admins)
      .set({
        name: adminName,
        passwordHash,
      })
      .where(eq(admins.id, existingAdmin.id));
    console.log("   ✅ Admin updated successfully.");
  }

  // ─── 2. Sample Domains ───────────────────────────────────
  console.log("🌐 Seeding premium .SI domains...");

  const sampleDomains = [
    {
      name: "Equator.si",
      slug: "equator-si",
      extension: ".si",
      category: "Brandable / Tech",
      price: 12500,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["technology", "global", "logistics", "fintech"],
      description:
        "A high-impact dictionary word domain ideal for global tech, logistics, travel, or fintech platforms targeting Slovenia and the EU market.",
    },
    {
      name: "Absence.si",
      slug: "absence-si",
      extension: ".si",
      category: "HR & SaaS",
      price: 4800,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["hr", "saas", "software", "workplace"],
      description:
        "Prime single-word domain for HR management software, employee leave tracking SaaS, or modern wellness platforms.",
    },
    {
      name: "Gentle.si",
      slug: "gentle-si",
      extension: ".si",
      category: "Lifestyle & Health",
      price: 8900,
      priceType: "make_offer",
      featured: true,
      status: "active",
      tags: ["beauty", "skincare", "lifestyle", "eco"],
      description:
        "Short, elegant dictionary word perfect for skincare, cosmetics, personal care, conscious living, or eco-luxe brands.",
    },
    {
      name: "Licence.si",
      slug: "licence-si",
      extension: ".si",
      category: "Legal & Technology",
      price: 15000,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["legal", "compliance", "software", "fintech"],
      description:
        "Authoritative generic asset for software licensing, legal compliance, IP protection, fintech, or certification authorities.",
    },
    {
      name: "Optic.si",
      slug: "optic-si",
      extension: ".si",
      category: "Medical & Technology",
      price: 9500,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["optics", "medical", "telecom", "healthcare"],
      description:
        "Clean single-word domain tailored for eyewear retail, optometry networks, laser clinics, or fiber-optic telecommunications.",
    },
    {
      name: "Nordic.si",
      slug: "nordic-si",
      extension: ".si",
      category: "Design & Lifestyle",
      price: 6200,
      priceType: "make_offer",
      featured: true,
      status: "active",
      tags: ["design", "furniture", "nordic", "travel"],
      description:
        "Evocative brand name for Scandinavian design, interior furniture, outdoor lifestyle gear, or alpine tourism.",
    },
    {
      name: "Venture.si",
      slug: "venture-si",
      extension: ".si",
      category: "Finance & VC",
      price: 24000,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["venture", "finance", "investing", "startup"],
      description:
        "The ultimate prestige asset for venture capital firms, startup incubators, private equity, and investment syndicates in Slovenia.",
    },
    {
      name: "Beacon.si",
      slug: "beacon-si",
      extension: ".si",
      category: "IoT & Technology",
      price: 7400,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["iot", "tech", "security", "navigation"],
      description:
        "Strong technology metaphor suited for IoT solutions, smart city tech, navigation systems, or cybersecurity firms.",
    },
    {
      name: "Apex.si",
      slug: "apex-si",
      extension: ".si",
      category: "Business & Consulting",
      price: 18500,
      priceType: "make_offer",
      featured: true,
      status: "active",
      tags: ["consulting", "executive", "premium", "leadership"],
      description:
        "The symbol of pinnacle performance. Outstanding identity for elite management consulting, executive advisory, or performance sports.",
    },
    {
      name: "Pulse.si",
      slug: "pulse-si",
      extension: ".si",
      category: "Health & Media",
      price: 11000,
      priceType: "fixed",
      featured: true,
      status: "active",
      tags: ["health", "media", "fitness", "analytics"],
      description:
        "Dynamic single-word domain for digital health tech, real-time media analytics, news broadcasting, or fitness applications.",
    },
    {
      name: "Craft.si",
      slug: "craft-si",
      extension: ".si",
      category: "Creative & Commerce",
      price: 8200,
      priceType: "make_offer",
      featured: false,
      status: "active",
      tags: ["craft", "creative", "ecommerce", "design"],
      description:
        "Memorable identity for artisanal breweries, design studios, software craft shops, or high-end bespoke craftsmanship.",
    },
    {
      name: "Summit.si",
      slug: "summit-si",
      extension: ".si",
      category: "Events & Enterprise",
      price: 13500,
      priceType: "fixed",
      featured: false,
      status: "active",
      tags: ["events", "enterprise", "conference", "leadership"],
      description:
        "Prestige domain name ideal for executive conferences, enterprise summits, high-altitude tourism, or leadership forums.",
    },
    {
      name: "Nexus.si",
      slug: "nexus-si",
      extension: ".si",
      category: "Cloud & Infrastructure",
      price: 16000,
      priceType: "inquiry",
      featured: false,
      status: "active",
      tags: ["cloud", "ai", "infrastructure", "data"],
      description:
        "The definitive focal point for cloud infrastructure, enterprise APIs, data integrations, AI networks, or IT consulting.",
    },
    {
      name: "Loom.si",
      slug: "loom-si",
      extension: ".si",
      category: "SaaS & Creative",
      price: 5500,
      priceType: "make_offer",
      featured: false,
      status: "active",
      tags: ["saas", "creative", "collaboration", "short"],
      description:
        "Short, unforgettable 4-letter brand for modern creative tools, collaborative workspaces, video platforms, or textile ventures.",
    },
  ];

  for (const item of sampleDomains) {
    const [existing] = await db
      .select({ id: domains.id })
      .from(domains)
      .where(eq(domains.slug, item.slug))
      .limit(1);

    if (!existing) {
      await db.insert(domains).values({
        name: item.name,
        slug: item.slug,
        extension: item.extension,
        category: item.category,
        price: item.price,
        priceType: item.priceType,
        featured: item.featured,
        status: item.status,
        tags: item.tags,
        description: item.description,
        totalVisitors: Math.floor(Math.random() * 85) + 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   + Added domain: ${item.name}`);
    } else {
      await db
        .update(domains)
        .set({
          name: item.name,
          extension: item.extension,
          category: item.category,
          price: item.price,
          priceType: item.priceType,
          featured: item.featured,
          status: item.status,
          tags: item.tags,
          description: item.description,
          updatedAt: new Date(),
        })
        .where(eq(domains.id, existing.id));
      console.log(`   * Updated domain: ${item.name}`);
    }
  }

  // ─── 3. Default Page Content ──────────────────────────────
  console.log("📄 Seeding default page content...");

  const defaultPages = [
    {
      slug: "home",
      title: "SISORA — Premium .SI Domain Brokerage",
      metaTitle: "SISORA | Premium .SI Domain Brokerage & Marketplace",
      metaDescription:
        "Discover and acquire premier .SI domains. SISORA is Slovenia's trusted marketplace for brandable, category-defining .SI domain names.",
      content: {
        heroBadge: "Slovenia's Premier Domain Brokerage",
        headline: "Acquire Defining .SI Domains",
        subheadline:
          "We broker high-value, category-defining Slovenian domains for forward-thinking enterprises, investors, and high-growth startups.",
        ctaPrimary: "Browse Marketplace",
        ctaSecondary: "Inquire on a Domain",
        stats: [
          { label: "Exclusive Portfolio", value: "100+ Domains" },
          { label: "Successful Transfers", value: "99.8%" },
          { label: "Secure Escrow", value: "100% Protected" },
          { label: "Average Settlement", value: "< 48 Hours" },
        ],
        featuredTitle: "Featured Domain Assets",
        featuredSubtitle:
          "Handpicked, liquid digital real estate ready for immediate acquisition.",
        valueProps: [
          {
            title: "Institutional Trust & Escrow",
            description:
              "Every transaction is secured through licensed escrow partners or registered escrow agreements, ensuring safe transfer of ownership.",
          },
          {
            title: "Official .SI Registry Compliance",
            description:
              "Seamless transfer through ARNES-accredited registrars, with complete administrative ownership assigned directly to you.",
          },
          {
            title: "Confidential Brokerage",
            description:
              "Discreet negotiations on your behalf, whether acquiring strategic assets or divesting a high-value portfolio.",
          },
        ],
      },
    },
    {
      slug: "about",
      title: "About SISORA",
      metaTitle: "About Us | SISORA .SI Domain Brokerage",
      metaDescription:
        "Learn about SISORA, the leading brokerage dedicated exclusively to premium .SI domain assets and domain advisory.",
      content: {
        storyHeadline: "The Authority in Slovenian Digital Real Estate",
        storyParagraphs: [
          "SISORA was founded to bridge the gap between global enterprises and high-value Slovenian digital assets. As the .SI extension gains international traction for tech, AI, and regional presence, securing concise, authoritative domain names has become essential.",
          "Our team combines deep domain industry expertise with institutional understanding of Slovenian registrar regulations (ARNES). We represent high-net-worth sellers, acquisition teams, and branding agencies.",
          "From initial valuation and private negotiation to escrow closing and DNS handover, SISORA delivers white-glove brokerage service.",
        ],
        values: [
          {
            title: "Transparency",
            description:
              "Clear pricing models, no hidden brokerage fees, and honest market valuations.",
          },
          {
            title: "Discretion",
            description:
              "Confidential buyer representation and non-disclosure protections for high-profile acquisitions.",
          },
          {
            title: "Speed & Security",
            description:
              "Fast-track technical transfer protocols paired with institutional escrow protection.",
          },
        ],
      },
    },
    {
      slug: "sell",
      title: "Sell Your .SI Domain",
      metaTitle: "Sell Your .SI Domain | SISORA Brokerage",
      metaDescription:
        "List and monetize your premium .SI domain name with SISORA. Access qualified buyers and secure escrow payouts.",
      content: {
        headline: "Liquidate Your Premium .SI Assets",
        subheadline:
          "Put your premium domains in front of decision-makers, venture funds, and fast-growing European enterprises.",
        benefits: [
          {
            title: "Qualified Buyer Network",
            description:
              "Direct outreach to targeted corporations, startups, and tech investors.",
          },
          {
            title: "Competitive Brokerage Commission",
            description:
              "Industry-standard success-only commission rate with zero upfront listing fees.",
          },
          {
            title: "Guaranteed Payouts",
            description:
              "Escrow-secured transactions ensure funds are cleared before domain transfer.",
          },
        ],
        submissionGuidelines:
          "We accept dictionary words, 2-to-4 letter acronyms, and high-impact brandable .SI domains with clear commercial appeal.",
      },
    },
    {
      slug: "buy",
      title: "Buy .SI Domains",
      metaTitle: "Buy Premium .SI Domains | SISORA Brokerage",
      metaDescription:
        "How to purchase premium .SI domains through SISORA. Explore flexible payment options, lease-to-own, and secure escrow.",
      content: {
        headline: "Acquiring Your Identity on .SI",
        subheadline:
          "Step-by-step guidance on securing premier digital real estate with total legal and technical certainty.",
        steps: [
          {
            step: "01",
            title: "Select or Inquire",
            description:
              "Choose a domain from our catalog or submit an inquiry for custom acquisition.",
          },
          {
            step: "02",
            title: "Agree on Terms",
            description:
              "Formalize purchase price and payment terms via fixed price, offer negotiation, or escrow.",
          },
          {
            step: "03",
            title: "Escrow Deposit",
            description:
              "Deposit funds safely with our escrow partner, held securely until transfer completion.",
          },
          {
            step: "04",
            title: "Transfer & Handover",
            description:
              "Receive authorization code and ARNES registry confirmation in under 48 hours.",
          },
        ],
        paymentMethods: [
          "Bank Wire (EUR/USD)",
          "Escrow.com",
          "Cryptocurrency (USDT/USDC/BTC)",
          "Major Credit Cards",
        ],
      },
    },
    {
      slug: "contact",
      title: "Contact SISORA",
      metaTitle: "Contact Us | SISORA Domain Brokerage",
      metaDescription:
        "Get in touch with SISORA domain brokers for acquisitions, appraisals, or general inquiries.",
      content: {
        headline: "Connect With Our Domain Advisors",
        subheadline:
          "Have questions about a specific .SI domain, transfer procedures, or portfolio brokerage? Our team responds within 24 hours.",
        directContacts: {
          email: "inquiries@sisora.si",
          phone: "+386 1 234 5678",
          office: "Dunajska cesta 156, 1000 Ljubljana, Slovenia",
        },
        workingHours: "Monday – Friday: 09:00 – 18:00 CET",
      },
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      metaTitle: "Privacy Policy | SISORA",
      metaDescription:
        "Learn how SISORA collects, uses, and safeguards your personal data under the EU General Data Protection Regulation (GDPR).",
      content: {
        headline: "Privacy Policy",
        lastUpdated: "2026-01-01",
        sections: [
          {
            title: "1. Data Collection",
            text: "We collect only information necessary to respond to domain inquiries, execute domain brokerage agreements, and maintain site security. This includes name, email, phone number, and IP address.",
          },
          {
            title: "2. Legal Basis & GDPR",
            text: "Processing is conducted pursuant to GDPR Article 6(1)(b) (contract fulfillment) and Article 6(1)(f) (legitimate business interest). We never sell or rent your personal data to third parties.",
          },
          {
            title: "3. Escrow & Third-Party Processors",
            text: "When completing transactions, buyer and seller details may be shared with certified escrow providers (such as Escrow.com) and ARNES-accredited registrars strictly for transfer completion.",
          },
        ],
      },
    },
    {
      slug: "terms",
      title: "Terms of Service",
      metaTitle: "Terms of Service | SISORA",
      metaDescription:
        "Terms of service and brokerage rules governing transactions on the SISORA marketplace.",
      content: {
        headline: "Terms of Service",
        lastUpdated: "2026-01-01",
        sections: [
          {
            title: "1. Binding Agreement",
            text: "By submitting an inquiry, offer, or sell submission on SISORA, you agree to these Terms of Service and affirm that you are authorized to negotiate the respective domain asset.",
          },
          {
            title: "2. Domain Ownership Verification",
            text: "All sellers must demonstrate undisputed ownership and control of listed .SI domains prior to payout. SISORA reserves the right to cancel transactions that violate registry rules or third-party IP rights.",
          },
          {
            title: "3. Escrow and Closing",
            text: "All sales over $1,000 USD are routed through approved escrow arrangements. Funds are held in trust until buyer confirms registrant control in the ARNES WHOIS registry.",
          },
        ],
      },
    },
  ];

  for (const pageItem of defaultPages) {
    const [existing] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(eq(pages.slug, pageItem.slug))
      .limit(1);

    if (!existing) {
      await db.insert(pages).values({
        slug: pageItem.slug,
        title: pageItem.title,
        content: pageItem.content,
        metaTitle: pageItem.metaTitle,
        metaDescription: pageItem.metaDescription,
        updatedAt: new Date(),
      });
      console.log(`   + Added page: ${pageItem.slug}`);
    } else {
      await db
        .update(pages)
        .set({
          title: pageItem.title,
          content: pageItem.content,
          metaTitle: pageItem.metaTitle,
          metaDescription: pageItem.metaDescription,
          updatedAt: new Date(),
        })
        .where(eq(pages.id, existing.id));
      console.log(`   * Updated page: ${pageItem.slug}`);
    }
  }

  // ─── 4. Default Site Settings ─────────────────────────────
  console.log("⚙️  Seeding default site settings...");

  const defaultSettings = [
    {
      key: "site_name",
      value: "SISORA",
      group: "general",
    },
    {
      key: "site_tagline",
      value: "Premium .SI Domain Brokerage",
      group: "general",
    },
    {
      key: "site_description",
      value:
        "Slovenia's premier marketplace for brandable, high-value .SI domain names.",
      group: "general",
    },
    {
      key: "site_currency",
      value: "USD",
      group: "general",
    },
    {
      key: "contact_email",
      value: "inquiries@sisora.si",
      group: "contact",
    },
    {
      key: "contact_phone",
      value: "+386 1 234 5678",
      group: "contact",
    },
    {
      key: "contact_address",
      value: "Dunajska cesta 156, 1000 Ljubljana, Slovenia",
      group: "contact",
    },
    {
      key: "contact_hours",
      value: "Mon - Fri: 09:00 - 18:00 CET",
      group: "contact",
    },
    {
      key: "twitter_url",
      value: "https://x.com/sisora_si",
      group: "social",
    },
    {
      key: "linkedin_url",
      value: "https://linkedin.com/company/sisora",
      group: "social",
    },
    {
      key: "commission_rate",
      value: "10%",
      group: "brokerage",
    },
    {
      key: "escrow_partner",
      value: "Escrow.com / Registered Wire Escrow",
      group: "brokerage",
    },
  ];

  for (const setting of defaultSettings) {
    const [existing] = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .where(eq(siteSettings.key, setting.key))
      .limit(1);

    if (!existing) {
      await db.insert(siteSettings).values({
        key: setting.key,
        value: setting.value,
        group: setting.group,
      });
      console.log(`   + Added setting: ${setting.key}`);
    } else {
      await db
        .update(siteSettings)
        .set({
          value: setting.value,
          group: setting.group,
        })
        .where(eq(siteSettings.id, existing.id));
      console.log(`   * Updated setting: ${setting.key}`);
    }
  }

  console.log("✨ Seeding completed successfully!");
}

main().catch((err) => {
  console.error("❌ Seeding failed with error:", err);
  process.exit(1);
});
