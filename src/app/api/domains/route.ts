import { NextRequest, NextResponse } from "next/server";
import { eq, desc, asc, ilike, and, count, isNotNull, lte, gte, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { domains } from "@/db/schema";
import { auth } from "@/lib/auth";
import { domainSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();
    const priceRange = searchParams.get("priceRange")?.trim();
    const status = searchParams.get("status")?.trim();
    const featured = searchParams.get("featured")?.trim();
    const sort = searchParams.get("sort")?.trim();

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "12", 10);
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 12;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (search) {
      conditions.push(ilike(domains.name, `%${search}%`));
    }

    if (category) {
      conditions.push(eq(domains.category, category));
    }

    if (status) {
      conditions.push(eq(domains.status, status));
    }

    if (featured !== null && featured !== undefined && featured !== "") {
      if (featured === "true" || featured === "1") {
        conditions.push(eq(domains.featured, true));
      } else if (featured === "false" || featured === "0") {
        conditions.push(eq(domains.featured, false));
      }
    }

    if (priceRange) {
      const normalizedRange = priceRange.toLowerCase();
      if (
        normalizedRange === "under_1000" ||
        normalizedRange === "under-1000" ||
        normalizedRange === "<1000" ||
        normalizedRange === "0-1000"
      ) {
        conditions.push(and(isNotNull(domains.price), lte(domains.price, 1000))!);
      } else if (
        normalizedRange === "1000_5000" ||
        normalizedRange === "1000-5000"
      ) {
        conditions.push(and(gte(domains.price, 1000), lte(domains.price, 5000))!);
      } else if (
        normalizedRange === "5000_10000" ||
        normalizedRange === "5000-10000"
      ) {
        conditions.push(and(gte(domains.price, 5000), lte(domains.price, 10000))!);
      } else if (
        normalizedRange === "over_10000" ||
        normalizedRange === "over-10000" ||
        normalizedRange === "10000+" ||
        normalizedRange === ">10000"
      ) {
        conditions.push(gte(domains.price, 10000));
      } else if (normalizedRange === "make_offer") {
        conditions.push(eq(domains.priceType, "make_offer"));
      } else if (normalizedRange.includes("-")) {
        const [minStr, maxStr] = normalizedRange.split("-");
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        if (!isNaN(min) && !isNaN(max)) {
          conditions.push(and(gte(domains.price, min), lte(domains.price, max))!);
        } else if (!isNaN(min)) {
          conditions.push(gte(domains.price, min));
        } else if (!isNaN(max)) {
          conditions.push(lte(domains.price, max));
        }
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = desc(domains.createdAt);
    switch (sort) {
      case "name_asc":
        orderByClause = asc(domains.name);
        break;
      case "name_desc":
        orderByClause = desc(domains.name);
        break;
      case "price_asc":
        orderByClause = asc(domains.price);
        break;
      case "price_desc":
        orderByClause = desc(domains.price);
        break;
      case "newest":
      default:
        orderByClause = desc(domains.createdAt);
        break;
    }

    const [countResult] = await db
      .select({ count: count() })
      .from(domains)
      .where(whereClause);

    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    const domainList = await db
      .select()
      .from(domains)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      domains: domainList,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching domains" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = domainSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Auto-generate slug from name and ensure uniqueness
    const baseSlug = slugify(data.name);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (true) {
      const [existing] = await db
        .select({ id: domains.id })
        .from(domains)
        .where(eq(domains.slug, uniqueSlug))
        .limit(1);

      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const [newDomain] = await db
      .insert(domains)
      .values({
        name: data.name,
        slug: uniqueSlug,
        extension: data.extension || ".si",
        description: data.description || null,
        category: data.category || null,
        tags: data.tags || [],
        price: data.price ?? null,
        priceType: data.priceType || "make_offer",
        featured: data.featured ?? false,
        status: data.status || "active",
        totalVisitors: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newDomain, { status: 201 });
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json(
      { error: "Internal server error while creating domain" },
      { status: 500 }
    );
  }
}
