"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, Mail, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { sellSubmissionSchema } from "@/lib/validators";
import { SITE_CONFIG } from "@/lib/data";
import { submitOfferAction } from "@/lib/actions/public-actions";

export interface SellDomainFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function SellDomainForm({ onSuccess, className }: SellDomainFormProps) {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    domainName: "",
    ownerName: "",
    email: "",
    phone: "",
    askingPrice: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const payload = {
      domainName: formData.domainName.trim(),
      ownerName: formData.ownerName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      askingPrice: formData.askingPrice.trim() || undefined,
      description: formData.description.trim() || undefined,
    };

    const parseResult = sellSubmissionSchema.safeParse(payload);
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
    const subject = `[Domain for Sale] ${formData.domainName} - Asking: ${formData.askingPrice || "Open to Offers"}`;
    const body = `Hello SISORA Brokerage Team,

I would like to submit the following .SI domain for brokerage and sale:

Domain Name: ${formData.domainName}
Owner / Representative: ${formData.ownerName}
Email: ${formData.email}
Phone / Telegram: ${formData.phone || "Not provided"}
Asking Price / Reserve: ${formData.askingPrice || "Open for valuation / make offer"}

--- Background & Notes ---
${formData.description || "No additional notes provided."}

---
Submitted via SISORA Sell Domain Portal (sisora.si)`;

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
      error("Please check the form fields.", "Validation Error");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPrice = parseFloat(formData.askingPrice.replace(/[^0-9.]/g, "")) || 1;
      await submitOfferAction({
        domain_id: "seller-submission",
        domain_name: formData.domainName.trim(),
        buyer_name: formData.ownerName.trim(),
        buyer_email: formData.email.trim(),
        buyer_phone: formData.phone.trim() || undefined,
        offer_amount: cleanPrice,
        notes: `[Domain Seller Submission] Asking Price: ${formData.askingPrice || "Open to offers"}\n${formData.description.trim()}`,
      });

      setIsSubmitted(true);
      success(
        `Listing submission recorded & dispatched to ${SITE_CONFIG.contact.email}!`,
        "Submission Received"
      );
      onSuccess?.();
    } catch {
      error("Could not record submission. Please email sisorasales@gmail.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-xl font-bold text-neutral-950">Domain Submission Received</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed font-normal">
          Your listing request for{" "}
          <span className="font-bold text-black">{formData.domainName}</span>{" "}
          has been routed to our team at <span className="font-semibold text-black">{SITE_CONFIG.contact.email}</span>. We will review your asset and reply directly to your email.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getMailtoLink()}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Open Email Client</span>
          </a>
          <a
            href={SITE_CONFIG.social.twitter || "https://x.com/SisoraBrokerage"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors shadow-2xs"
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
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <MessageSquare className="h-4 w-4 text-sky-500" />
            <span>Submit via Telegram</span>
          </a>
        </div>
        <div className="pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-xs font-semibold text-neutral-500 hover:text-black underline cursor-pointer"
          >
            Submit Another Domain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className || "space-y-4 text-left"}>
      <Input
        label="Domain Name to Sell"
        placeholder="e.g. brand.si or startup.si"
        value={formData.domainName}
        onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
        error={errors.domainName}
        helperText="Must be an active or registered .SI domain name you represent or legally own."
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          placeholder="Alexander Smith"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          error={errors.ownerName}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="alex@domainowner.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone / Telegram (Optional)"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
        />
        <Input
          label="Desired Asking Price (Optional)"
          placeholder="e.g. $25,000 or Leave blank for appraisal"
          value={formData.askingPrice}
          onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
          error={errors.askingPrice}
        />
      </div>

      <Textarea
        label="Domain Background / History (Optional)"
        placeholder="Traffic statistics, previous offers, industry relevance, or reasons for liquidating..."
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
      />

      <div className="rounded-xl bg-neutral-100 border border-neutral-200/80 p-3.5 flex items-start gap-2.5 text-xs text-neutral-600">
        <ShieldCheck className="h-4 w-4 text-black shrink-0 mt-0.5" />
        <span>
          No upfront listing fees. We operate on a standard success-based commission model upon successful escrow closing.
        </span>
      </div>

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
            <span>Submitting Asset...</span>
          </>
        ) : (
          <>
            <span>Submit Domain for Brokerage</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}

export default SellDomainForm;
