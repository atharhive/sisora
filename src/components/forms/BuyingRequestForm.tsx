"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { buyingRequestSchema } from "@/lib/validators";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domainName: formData.budget
            ? `Acquisition Mandate (${formData.budget})`
            : "Acquisition Mandate Request",
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          message: `[Budget: ${formData.budget.trim() || "Not specified"}]\n\nRequirements:\n${formData.requirements.trim()}`,
          type: "buy",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit acquisition request.");
      }

      setIsSubmitted(true);
      success(
        "Acquisition mandate submitted. Our senior broker will follow up under strict NDA.",
        "Request Logged"
      );
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit request. Please try again or email deals@sisora.si.";
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
        <h4 className="text-xl font-bold text-neutral-950">Acquisition Mandate Active</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed">
          Your domain acquisition criteria has been logged directly with our private mandate desk.
          We will analyze registry records and contact unlisted owners confidentially.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                budget: "",
                requirements: "",
              });
            }}
          >
            Submit Another Mandate
          </Button>
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
          label="Phone / WhatsApp (Optional)"
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
          Buyer identity remains 100% confidential. We initiate discreet, anonymized negotiations to prevent seller price inflation.
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center font-bold"
        isLoading={isSubmitting}
      >
        <span>Initiate Stealth Acquisition Request</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
}

export default BuyingRequestForm;
