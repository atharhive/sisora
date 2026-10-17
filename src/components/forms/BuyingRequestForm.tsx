"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, ArrowRight, Mail, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { buyingRequestSchema } from "@/lib/validators";
import { SITE_CONFIG } from "@/lib/data";

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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    return "http://t.me/SisoraBrokerage";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error("Please check the form fields.", "Validation Error");
      return;
    }

    const mailto = getMailtoLink();
    window.open(mailto, "_blank");

    setIsSubmitted(true);
    success(
      `Opening email client to ${SITE_CONFIG.contact.email}. Please review and hit send!`,
      "Email Ready"
    );
    onSuccess?.();
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-xl font-bold text-neutral-950">Acquisition Request Ready</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed">
          Your confidential acquisition criteria has been formatted for{" "}
          <span className="font-semibold text-black">{SITE_CONFIG.contact.email}</span>.
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

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center font-bold"
      >
        <span>Send Acquisition Request via Email</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
}

export default BuyingRequestForm;
