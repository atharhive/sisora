"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const offerSchema = z.object({
  domain_id: z.string().min(1, "Domain ID is required"),
  domain_name: z.string().optional(),
  buyer_name: z.string().min(2, "Please enter your full name"),
  buyer_email: z.string().email("Please enter a valid email address"),
  buyer_phone: z.string().optional(),
  offer_amount: z.number().positive("Offer amount must be greater than zero"),
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

    const { data, error } = await supabase.from("offers").insert({
      domain_id: validated.domain_id,
      domain_name: validated.domain_name || null,
      buyer_name: validated.buyer_name,
      buyer_email: validated.buyer_email,
      buyer_phone: validated.buyer_phone || null,
      offer_amount: validated.offer_amount,
      status: "new",
      notes: validated.notes || null,
    }).select().single();

    if (error) {
      console.error("Offer submission DB error:", error);
      return { error: "Failed to record your offer. Please reach out via our contact channels." };
    }

    revalidatePath("/admin/offers");
    return { success: true, data };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((e) => e.message).join(", ") };
    }
    return { error: "An unexpected error occurred while submitting your offer." };
  }
}
