"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck, Mail, MessageSquare } from "lucide-react";
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
    message: "",
    type: initialType,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const payload = {
      ...formData,
      domainId: domainId || undefined,
      phone: formData.phone.trim() || undefined,
      message: formData.message.trim() || undefined,
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
    const targetDomain = formData.domainName || "SISORA Domain";
    const subject = `[Domain Inquiry] ${targetDomain} - from ${formData.name}`;
    const body = `Hello SISORA Brokerage Team,

I am interested in inquiring about the domain: ${targetDomain}

--- Inquirer Details ---
Name: ${formData.name}
Email: ${formData.email}
Phone / Telegram: ${formData.phone || "Not provided"}
Inquiry Type: ${formData.type.toUpperCase()}

--- Message / Offer ---
${formData.message || "Please provide pricing and acquisition details."}

---
Sent via SISORA Brokerage Portal (sisora.si)`;

    return `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const getTelegramLink = () => {
    return "http://t.me/SisoraBrokerage";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error("Please fill in required fields correctly.", "Validation Error");
      return;
    }

    // Asynchronously record offer into Supabase pipeline
    submitOfferAction({
      domain_id: domainId || "inquiry",
      domain_name: formData.domainName,
      buyer_name: formData.name,
      buyer_email: formData.email,
      buyer_phone: formData.phone || undefined,
      offer_amount: 1,
      notes: `[Inquiry Type: ${formData.type}] ${formData.message || "General acquisition request"}`,
    }).catch(console.error);

    // Open email client with pre-filled content
    const mailto = getMailtoLink();
    window.open(mailto, "_blank");

    setIsSubmitted(true);
    success(
      `Inquiry recorded and email prepared for ${SITE_CONFIG.contact.email}!`,
      "Offer Submitted"
    );
    onSuccess?.();
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-xl font-bold text-neutral-950">Inquiry Prepared</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed">
          Your inquiry for{" "}
          <span className="font-semibold text-black">{formData.domainName}</span>{" "}
          has been generated. If your email app didn&apos;t open automatically, you can send it directly or chat on Telegram:
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
            href={getTelegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <MessageSquare className="h-4 w-4 text-sky-500" />
            <span>Send via Telegram</span>
          </a>
        </div>
        <div className="pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
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

      <Input
        label="Phone / Telegram (Optional)"
        placeholder="+1 (555) 000-0000"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
      />

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
        <span>Submitting prepares an instant email to {SITE_CONFIG.contact.email} with strict confidentiality.</span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center font-bold"
      >
        <Send className="h-4 w-4 mr-2" />
        Send Inquiry via Email
      </Button>
    </form>
  );
}

export default InquiryForm;
