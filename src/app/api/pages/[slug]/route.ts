import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { auth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

const updatePageSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(255).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;

    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (!page) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching page" },
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

    const { slug } = await params;
    const body = await req.json();
    const parseResult = updatePageSchema.safeParse(body);

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

    const [existing] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (!existing) {
      const [newPage] = await db
        .insert(pages)
        .values({
          slug,
          title: data.title || slug,
          content: data.content || {},
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json(newPage);
    }

    const [updatedPage] = await db
      .update(pages)
      .set({
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
        ...(data.metaTitle !== undefined ? { metaTitle: data.metaTitle } : {}),
        ...(data.metaDescription !== undefined ? { metaDescription: data.metaDescription } : {}),
        updatedAt: new Date(),
      })
      .where(eq(pages.slug, slug))
      .returning();

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page content:", error);
    return NextResponse.json(
      { error: "Internal server error while updating page" },
      { status: 500 }
    );
  }
}
