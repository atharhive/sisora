import { NextRequest, NextResponse } from "next/server";
import { eq, desc, count, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { sellSubmissions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sellSubmissionSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status")?.trim();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "12", 10);

    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 12;
    const offset = (page - 1) * limit;

    const whereClause: SQL | undefined = status ? eq(sellSubmissions.status, status) : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(sellSubmissions)
      .where(whereClause);

    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    const submissionList = await db
      .select()
      .from(sellSubmissions)
      .where(whereClause)
      .orderBy(desc(sellSubmissions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      submissions: submissionList,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching sell submissions:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching sell submissions" },
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
    const parseResult = sellSubmissionSchema.safeParse(body);

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

    const [newSubmission] = await db
      .insert(sellSubmissions)
      .values({
        domainName: data.domainName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone || null,
        askingPrice: data.askingPrice || null,
        description: data.description || null,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Submission received successfully",
        submission: newSubmission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sell submission:", error);
    return NextResponse.json(
      { error: "Internal server error while submitting sell request" },
      { status: 500 }
    );
  }
}
