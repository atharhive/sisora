import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { sellSubmissions } from "@/db/schema";
import { auth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateStatusSchema = z.object({
  status: z.string().min(1, "Status is required").max(50),
});

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
    const body = await req.json();
    const parseResult = updateStatusSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const [updatedSubmission] = await db
      .update(sellSubmissions)
      .set({
        status: parseResult.data.status,
      })
      .where(eq(sellSubmissions.id, id))
      .returning();

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating sell submission:", error);
    return NextResponse.json(
      { error: "Internal server error while updating sell submission" },
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

    const [deleted] = await db
      .delete(sellSubmissions)
      .where(eq(sellSubmissions.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sell submission:", error);
    return NextResponse.json(
      { error: "Internal server error while deleting sell submission" },
      { status: 500 }
    );
  }
}
