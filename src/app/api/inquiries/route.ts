import { NextRequest, NextResponse } from "next/server";
import { eq, desc, and, count, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { auth } from "@/lib/auth";
import { inquiryFormSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type")?.trim();
    const status = searchParams.get("status")?.trim();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "12", 10);

    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 12;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (type) {
      conditions.push(eq(inquiries.type, type));
    }

    if (status) {
      conditions.push(eq(inquiries.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(whereClause);

    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    const inquiryList = await db
      .select()
      .from(inquiries)
      .where(whereClause)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      inquiries: inquiryList,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = checkRateLimit(ip, "form");

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = inquiryFormSchema.safeParse(body);

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

    const [newInquiry] = await db
      .insert(inquiries)
      .values({
        domainId: data.domainId || null,
        domainName: data.domainName,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || null,
        type: data.type || "buy",
        status: "new",
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully",
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error while submitting inquiry" },
      { status: 500 }
    );
  }
}
