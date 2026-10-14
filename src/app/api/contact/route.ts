import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { contactFormSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";

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
    const parseResult = contactFormSchema.safeParse(body);

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
        domainId: null,
        domainName: data.subject,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: `[Subject: ${data.subject}]\n\n${data.message}`,
        type: "general",
        status: "new",
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Contact message sent successfully",
        inquiry: newInquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Internal server error while submitting contact form" },
      { status: 500 }
    );
  }
}
