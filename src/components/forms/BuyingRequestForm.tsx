"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, ArrowRight, Mail, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { buyingRequestSchema } from "@/lib/validators";
import { SITE_CONFIG } from "@/lib/data";
import { submitOfferAction } from "@/lib/actions/public-actions";

export interface BuyingRequestFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function BuyingRequestForm({ onSuccess, className }: BuyingRequestFormProps) {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      budget: formData.budget.trim() || undefined,
      requirements: formData.requirements.trim(),
    };

    const parseResult = buyingRequestSchema.safeParse(payload);
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
    const subject = `[Acquisition Mandate] ${formData.budget ? `Budget: ${formData.budget}` : "New Request"} - from ${formData.name}`;
    const body = `Hello SISORA Private Brokerage Desk,

I would like to initiate a confidential domain acquisition request:

--- Investor Details ---
Name: ${formData.name}
Email: ${formData.email}
Phone / Telegram: ${formData.phone || "Not provided"}
Estimated Budget: ${formData.budget || "Open / flexible"}

--- Acquisition Mandate & Target Requirements ---
${formData.requirements}

---
Submitted via SISORA Investor Portal (sisora.si)`;

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
    setSubmitError(null);

    try {
      const cleanBudget = parseFloat(formData.budget.replace(/[^0-9.]/g, "")) || 0;
      const res = await submitOfferAction({
        domain_id: "acquisition-mandate",
        domain_name: "Acquisition Mandate Request",
        buyer_name: formData.name.trim(),
        buyer_email: formData.email.trim(),
        buyer_phone: formData.phone.trim() || undefined,
        offer_amount: cleanBudget,
        notes: `[Acquisition Mandate] Budget: ${formData.budget || "Flexible"}\n${formData.requirements.trim()}`,
      });

      if (res?.error) {
        setSubmitError(res.error);
        error(res.error, "Submission Issue");
        return;
      }

      setIsSubmitted(true);
      success(
        `Mandate received & dispatched to ${SITE_CONFIG.contact.email}!`,
        "Request Received"
      );
      onSuccess?.();
    } catch {
      setSubmitError("Could not connect to the database. Use the direct email or chat button below!");
      error("Could not record request. Please use direct email or X below.", "Notice");
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
        <h4 className="text-xl font-bold text-neutral-950">Acquisition Request Received</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed font-normal">
          Your confidential acquisition criteria has been logged in our pipeline and dispatched to{" "}
          <span className="font-semibold text-black">{SITE_CONFIG.contact.email}</span>. Our desk will review your mandate and reply directly to your email address.
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
            Submit Another Mandate
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className || "space-y-4 text-left"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name"
          placeholder="David Vance"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />
        <Input
          label="Corporate / Investor Email"
          type="email"
          placeholder="david@venturecapital.com"
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
          label="Acquisition Budget Range USD (Optional)"
          placeholder="e.g. $10,000 - $50,000"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          error={errors.budget}
        />
      </div>

      <Textarea
        label="Target Domain(s) or Specific Requirements"
        placeholder="Specify target domain names (e.g. fintech.si), desired industry, keyword parameters, or length restrictions..."
        rows={4}
        value={formData.requirements}
        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
        error={errors.requirements}
        required
      />

      <div className="rounded-xl bg-neutral-100 border border-neutral-200/80 p-3.5 flex items-start gap-2.5 text-xs text-neutral-600">
        <Shield className="h-4 w-4 text-black shrink-0 mt-0.5" />
        <span>
          Buyer identity remains 100% confidential. Submitting directly opens your email client addressed to {SITE_CONFIG.contact.email}.
        </span>
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
                Automated logging had a connection hiccup, but your acquisition mandate is preserved! Click below to send directly to our desk:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={getMailtoLink()}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Send Pre-filled Email to {SITE_CONFIG.contact.email}</span>
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
            <span>Submitting Mandate...</span>
          </>
        ) : (
          <>
            <span>Submit Acquisition Mandate</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}

export default BuyingRequestForm;
