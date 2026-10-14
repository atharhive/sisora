import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { domains } from "@/db/schema";
import { auth } from "@/lib/auth";
import { domainSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const isUuid = UUID_REGEX.test(id);
    const [domain] = isUuid
      ? await db.select().from(domains).where(eq(domains.id, id)).limit(1)
      : await db.select().from(domains).where(eq(domains.slug, id)).limit(1);

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(domain);
  } catch (error) {
    console.error("Error fetching domain:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching domain" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isUuid = UUID_REGEX.test(id);

    const [existing] = isUuid
      ? await db.select().from(domains).where(eq(domains.id, id)).limit(1)
      : await db.select().from(domains).where(eq(domains.slug, id)).limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    // Validate with domainSchema partial to allow full or partial updates
    const parseResult = domainSchema.partial().safeParse(body);

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

    let updatedSlug = existing.slug;
    if (data.name && data.name !== existing.name) {
      const baseSlug = slugify(data.name);
      let candidateSlug = baseSlug;
      let counter = 1;

      while (true) {
        const [conflict] = await db
          .select({ id: domains.id })
          .from(domains)
          .where(eq(domains.slug, candidateSlug))
          .limit(1);

        if (!conflict || conflict.id === existing.id) {
          updatedSlug = candidateSlug;
          break;
        }
        candidateSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const [updatedDomain] = await db
      .update(domains)
      .set({
        ...(data.name ? { name: data.name, slug: updatedSlug } : {}),
        ...(data.extension !== undefined ? { extension: data.extension } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.tags !== undefined ? { tags: data.tags } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.priceType !== undefined ? { priceType: data.priceType } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(domains.id, existing.id))
      .returning();

    return NextResponse.json(updatedDomain);
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json(
      { error: "Internal server error while updating domain" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isUuid = UUID_REGEX.test(id);

    const [existing] = isUuid
      ? await db.select({ id: domains.id }).from(domains).where(eq(domains.id, id)).limit(1)
      : await db.select({ id: domains.id }).from(domains).where(eq(domains.slug, id)).limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    await db.delete(domains).where(eq(domains.id, existing.id));

    return NextResponse.json({
      success: true,
      message: "Domain deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting domain:", error);
    return NextResponse.json(
      { error: "Internal server error while deleting domain" },
      { status: 500 }
    );
  }
}
