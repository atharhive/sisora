"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { sellSubmissionSchema } from "@/lib/validators";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/sell-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domainName: formData.domainName.trim(),
          ownerName: formData.ownerName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          askingPrice: formData.askingPrice.trim() || undefined,
          description: formData.description.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit domain for brokerage.");
      }

      setIsSubmitted(true);
      success(
        `Domain ${formData.domainName} submitted for valuation and listing review.`,
        "Listing Submitted"
      );
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit domain listing. Please try again or email deals@sisora.si.";
      error(message, "Submission Error");
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
        <h4 className="text-xl font-bold text-neutral-950">Domain Listing Received</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed">
          Your domain <span className="font-semibold text-black">{formData.domainName}</span> has been
          queued for professional appraisal. Our brokerage team will contact you within
          24-48 hours with our valuation and outreach strategy.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                domainName: "",
                ownerName: "",
                email: "",
                phone: "",
                askingPrice: "",
                description: "",
              });
            }}
          >
            Submit Another Domain
          </Button>
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
          label="Phone / WhatsApp (Optional)"
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
        className="w-full justify-center font-bold"
        isLoading={isSubmitting}
      >
        <span>Submit Domain for Brokerage</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
}

export default SellDomainForm;
