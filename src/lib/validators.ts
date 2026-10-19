import { z } from "zod/v4";

// ─── Contact Form ────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;

// ─── Domain Inquiry ──────────────────────────────────────
export const inquiryFormSchema = z.object({
  domainName: z.string().min(1, "Domain name is required"),
  domainId: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email"),
  phone: z.string().max(60).optional(),
  message: z.string().max(2000).optional(),
  type: z.enum(["buy", "sell", "general"]).default("buy"),
});
export type InquiryFormData = z.infer<typeof inquiryFormSchema>;

// ─── Sell Domain Submission ──────────────────────────────
export const sellSubmissionSchema = z.object({
  domainName: z.string().min(3, "Domain name is required").max(255),
  ownerName: z.string().min(2, "Your name is required").max(100),
  email: z.email("Please enter a valid email"),
  phone: z.string().max(20).optional(),
  askingPrice: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
});
export type SellSubmissionData = z.infer<typeof sellSubmissionSchema>;

// ─── Buying Request ──────────────────────────────────────
export const buyingRequestSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.email("Please enter a valid email"),
  phone: z.string().max(20).optional(),
  budget: z.string().max(100).optional(),
  requirements: z.string().min(10, "Please describe what you're looking for").max(2000),
});
export type BuyingRequestData = z.infer<typeof buyingRequestSchema>;

// ─── Admin Login ─────────────────────────────────────────
export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginData = z.infer<typeof loginSchema>;

// ─── Domain (Admin) ──────────────────────────────────────
export const domainSchema = z.object({
  name: z.string().min(1, "Domain name is required").max(255),
  extension: z.string().max(10).default(".si"),
  description: z.string().max(2000).optional(),
  category: z.string().max(255).optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().int().nonnegative().optional(),
  priceType: z.enum(["fixed", "make_offer", "inquiry"]).default("make_offer"),
  featured: z.boolean().default(false),
  status: z.enum(["active", "sold", "reserved"]).default("active"),
});
export type DomainFormData = z.infer<typeof domainSchema>;

// ─── Site Settings ───────────────────────────────────────
export const siteSettingsSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(5000),
  group: z.string().max(50).default("general"),
});
