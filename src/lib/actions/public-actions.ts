"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { sendInquiryNotificationEmail } from "@/lib/email";

const offerSchema = z.object({
  domain_id: z.string().min(1, "Domain ID is required"),
  domain_name: z.string().optional(),
  buyer_name: z.string().min(2, "Please enter your full name"),
  buyer_email: z.string().email("Please enter a valid email address"),
  buyer_phone: z.string().optional(),
  offer_amount: z.number().min(0, "Offer amount must be zero or positive"),
  notes: z.string().max(2000).optional(),
});

export async function submitOfferAction(input: {
  domain_id: string;
  domain_name?: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  offer_amount: number;
  notes?: string;
}) {
  try {
    const validated = offerSchema.parse(input);
    const supabase = createAdminClient();

    if (!supabase) {
      // In development fallback
      console.log("Mock offer submitted:", validated);
      return { success: true, message: "Offer submitted successfully (demo mode)." };
    }

    const isUuid = (val?: string) =>
      typeof val === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    let resolvedDomainId: string | null = null;

    if (isUuid(validated.domain_id)) {
      resolvedDomainId = validated.domain_id;
    } else {
      // Attempt lookup by domain_name or slug in Supabase domains table
      const targetName = (validated.domain_name || validated.domain_id).replace(/\.si$/i, "").trim().toLowerCase();
      const { data: dom } = await supabase
        .from("domains")
        .select("id")
        .or(`name.ilike.${targetName}.si,slug.ilike.${targetName}`)
        .limit(1)
        .maybeSingle();

      if (dom?.id && isUuid(dom.id)) {
        resolvedDomainId = dom.id;
      }
    }

    const { data, error } = await supabase.from("offers").insert({
      domain_id: resolvedDomainId,
      domain_name: validated.domain_name || validated.domain_id,
      buyer_name: validated.buyer_name,
      buyer_email: validated.buyer_email,
      buyer_phone: validated.buyer_phone || null,
      offer_amount: validated.offer_amount,
      status: "new",
      notes: validated.notes || null,
    }).select().single();

    if (error) {
      console.error("Offer submission DB error:", error);
      // Fallback: If DB insert hits an issue, still send email notification to broker
      try {
        await sendInquiryNotificationEmail({
          domain_name: validated.domain_name || validated.domain_id,
          buyer_name: validated.buyer_name,
          buyer_email: validated.buyer_email,
          buyer_phone: validated.buyer_phone,
          offer_amount: validated.offer_amount,
          notes: `${validated.notes || ""} [Note: Direct Email Fallback - DB Error]`,
        });
        return { success: true, message: "Inquiry received and routed to our brokerage desk." };
      } catch (fallbackEmailErr) {
        console.error("Fallback email dispatch failed:", fallbackEmailErr);
        return { error: "Failed to record your offer. Please reach out via our contact channels." };
      }
    }

    // Trigger broker notification email asynchronously (with Reply-To set to buyer)
    try {
      await sendInquiryNotificationEmail({
        domain_name: validated.domain_name || validated.domain_id,
        buyer_name: validated.buyer_name,
        buyer_email: validated.buyer_email,
        buyer_phone: validated.buyer_phone,
        offer_amount: validated.offer_amount,
        notes: validated.notes,
      });
    } catch (emailErr) {
      console.warn("Failed to dispatch email notification:", emailErr);
    }

    try {
      revalidatePath("/admin/offers");
    } catch {
      // Revalidation is non-critical to user submission
    }
    return { success: true, data };
  } catch (err: unknown) {
    console.error("[submitOfferAction CRITICAL ERROR]", err);
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((e) => e.message).join(", ") };
    }
    return { error: err instanceof Error ? err.message : "An unexpected error occurred while submitting your offer." };
  }
}
