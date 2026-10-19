"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck, Mail, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { inquiryFormSchema } from "@/lib/validators";
import { SITE_CONFIG } from "@/lib/data";
import { submitOfferAction } from "@/lib/actions/public-actions";

export interface InquiryFormProps {
  domainName?: string;
  domainId?: string;
  initialType?: "buy" | "sell" | "general";
  onSuccess?: () => void;
  className?: string;
}

export function InquiryForm({
  domainName: initialDomainName = "",
  domainId,
  initialType = "buy",
  onSuccess,
  className,
}: InquiryFormProps) {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    domainName: initialDomainName,
    name: "",
    email: "",
    phone: "",
    offerPrice: "",
    message: "",
    type: initialType,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const targetDomain = (formData.domainName || initialDomainName || "SISORA Domain").trim();
    const payload = {
      domainName: targetDomain,
      domainId: domainId || undefined,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      offerPrice: formData.offerPrice.trim() || undefined,
      message: formData.message.trim() || undefined,
      type: formData.type || "buy",
    };

    const parseResult = inquiryFormSchema.safeParse(payload);
    if (!parseResult.success) {
      const errs: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errs[field]) {
          errs[field] = issue.message;
        }
      });
      setErrors(errs);
      return false;
    }

    setErrors({});
    return true;
  };

  const getMailtoLink = () => {
    const targetDomain = formData.domainName || initialDomainName || "SISORA Domain";
    const subject = `[Domain Inquiry] ${targetDomain} - from ${formData.name || "Buyer"}`;
    const cleanPrice = formData.offerPrice.trim()
      ? parseFloat(formData.offerPrice.replace(/[^0-9.]/g, "")) || 0
      : 0;
    const priceStr = cleanPrice > 0 ? `$${cleanPrice.toLocaleString()} USD` : "Price on Request / Inquire";

    const body = `Hello SISORA Brokerage Team,

I am interested in inquiring about the domain: ${targetDomain}

--- Inquirer Details ---
Name: ${formData.name}
Email: ${formData.email}
Phone / Telegram: ${formData.phone || "Not provided"}
Inquiry Type: ${formData.type.toUpperCase()}
Offer / Target Budget: ${priceStr}

--- Message / Offer Details ---
${formData.message || "Please provide acquisition terms, pricing, and escrow options."}

---
Sent via SISORA Brokerage Portal (sisora.si)`;

    return `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const getTelegramLink = () => {
    return "https://t.me/SisoraBrokerage";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error("Please enter your name and a valid email address.", "Validation Notice");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const targetDomain = formData.domainName || initialDomainName || "General Inquiry";
      const cleanPrice = formData.offerPrice.trim()
        ? parseFloat(formData.offerPrice.replace(/[^0-9.]/g, "")) || 0
        : 0;

      // 1. Save directly into Supabase database / Admin Panel Offers pipeline
      const res = await submitOfferAction({
        domain_id: domainId || "inquiry",
        domain_name: targetDomain,
        buyer_name: formData.name.trim(),
        buyer_email: formData.email.trim(),
        buyer_phone: formData.phone.trim() || undefined,
        offer_amount: cleanPrice, // 0 = Price on Request
        notes: `[Inquiry Type: ${formData.type}]${cleanPrice > 0 ? ` [Proposed Offer: $${cleanPrice.toLocaleString()} USD]` : " [Pricing: On Request]"} ${formData.message.trim() || "General acquisition request"}`,
      });

      if (res?.error) {
        setSubmitError(res.error);
        error(res.error, "Submission Issue");
        return;
      }

      success(
        `Inquiry logged in Sisora pipeline & routed to ${SITE_CONFIG.contact.email}!`,
        "Inquiry Received"
      );
      setIsSubmitted(true);
      onSuccess?.();
    } catch {
      setSubmitError("Could not connect to the database. You can instantly send your inquiry using the direct options below:");
      error("Submission interrupted. Please use direct email or X below.", "Notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const targetDomain = formData.domainName || initialDomainName || "Domain";
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 text-center space-y-4 animate-in fade-in duration-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-xl font-bold text-neutral-950">Inquiry Received &amp; Logged</h4>
        <p className="mx-auto max-w-md text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
          Your inquiry for <span className="font-bold text-black">{targetDomain}</span> has been securely recorded in the SISORA brokerage deal pipeline and routed to{" "}
          <span className="font-semibold text-neutral-900">{SITE_CONFIG.contact.email}</span>.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getMailtoLink()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Mail className="h-4 w-4" />
            <span>Open Email App</span>
          </a>
          <a
            href={SITE_CONFIG.social.twitter || "https://x.com/SisoraBrokerage"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Chat on X</span>
          </a>
          <a
            href={getTelegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            <MessageSquare className="h-4 w-4 text-sky-500" />
            <span>Chat on Telegram</span>
          </a>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                domainName: initialDomainName,
                name: "",
                email: "",
                phone: "",
                offerPrice: "",
                message: "",
                type: initialType,
              });
            }}
            className="text-xs font-semibold text-neutral-500 hover:text-black underline cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className || "space-y-4 text-left"}>
      {initialDomainName ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Target Domain Name
            </span>
            <span className="text-base font-bold text-neutral-900 font-sans">
              {initialDomainName}
            </span>
          </div>
          <span className="rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700">
            .SI Domain
          </span>
        </div>
      ) : (
        <Input
          label="Domain of Interest"
          placeholder="e.g. ai.si or equator.si"
          value={formData.domainName}
          onChange={(e) =>
            setFormData({ ...formData, domainName: e.target.value })
          }
          error={errors.domainName}
          required
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          placeholder="John Smith"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />
        <Input
          label="Business Email"
          type="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Offer Amount / Budget ($ USD)"
          placeholder="e.g. 5,000 (Optional - leave blank for price quote)"
          value={formData.offerPrice}
          onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
        />
        <Input
          label="Phone / Telegram (Optional)"
          placeholder="+1 (555) 000-0000 or @handle"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
        />
      </div>

      <Textarea
        label="Inquiry Message (Optional)"
        placeholder="Provide additional details regarding your acquisition timeline, offer amount, or escrow preferences..."
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
      />

      <div className="flex items-center gap-2 text-xs text-neutral-500 py-1">
        <ShieldCheck className="h-4 w-4 text-neutral-700 shrink-0" />
        <span>Inquiries are logged in the brokerage pipeline and sent to {SITE_CONFIG.contact.email} with strict confidentiality.</span>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 text-left space-y-3 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-neutral-900">
                Direct Broker Channel Ready
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                Automated logging had a connection hiccup, but your inquiry for{" "}
                <span className="font-semibold text-neutral-900">{formData.domainName || initialDomainName || "this domain"}</span> is completely preserved! 
                Click below to dispatch your inquiry directly to our desk with all your information pre-filled:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={getMailtoLink()}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Send Pre-filled Email</span>
            </a>
            <a
              href={SITE_CONFIG.social.twitter || "https://x.com/SisoraBrokerage"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Chat on X</span>
            </a>
            <a
              href={getTelegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-sky-500" />
              <span>Telegram Desk</span>
            </a>
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center font-bold cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting Inquiry...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Acquisition Inquiry
          </>
        )}
      </Button>
    </form>
  );
}

export default InquiryForm;
