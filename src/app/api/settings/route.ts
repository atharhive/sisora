import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { auth } from "@/lib/auth";

const settingItemSchema = z.object({
  key: z.string().min(1, "Key is required").max(100),
  value: z.string().max(5000),
  group: z.string().max(50).default("general"),
});

const updateSettingsSchema = z.union([
  z.array(settingItemSchema),
  z.object({
    settings: z.array(settingItemSchema),
  }),
]);

export async function GET() {
  try {
    const allSettings = await db.select().from(siteSettings);

    const grouped: Record<string, Record<string, string>> = {};

    for (const item of allSettings) {
      const group = item.group || "general";
      if (!grouped[group]) {
        grouped[group] = {};
      }
      grouped[group][item.key] = item.value;
    }

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = updateSettingsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.issues,
        },
        { status: 400 }
      );
    }

    const items = Array.isArray(parseResult.data)
      ? parseResult.data
      : parseResult.data.settings;

    for (const item of items) {
      await db
        .insert(siteSettings)
        .values({
          key: item.key,
          value: item.value,
          group: item.group || "general",
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: item.value,
            ...(item.group ? { group: item.group } : {}),
          },
        });
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      count: items.length,
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Internal server error while updating settings" },
      { status: 500 }
    );
  }
}
