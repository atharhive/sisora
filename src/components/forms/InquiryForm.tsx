"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { inquiryFormSchema } from "@/lib/validators";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          domainName: formData.domainName.trim(),
          domainId: domainId || undefined,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          message: formData.message.trim() || undefined,
          type: formData.type,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit domain inquiry.");
      }

      setIsSubmitted(true);
      success(
        `Inquiry for ${formData.domainName} submitted. Our brokerage desk will respond within 24 hours.`,
        "Inquiry Received"
      );
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again or email deals@sisora.si";
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
        <h4 className="text-xl font-bold text-neutral-950">Inquiry Confirmed</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed">
          Thank you for reaching out regarding{" "}
          <span className="font-semibold text-black">{formData.domainName}</span>.
          A dedicated broker from SISORA will review your requirements and respond
          confidentially via email.
        </p>
        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                domainName: initialDomainName,
                name: "",
                email: "",
                phone: "",
                message: "",
                type: initialType,
              });
            }}
          >
            Submit Another Request
          </Button>
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
            .SI Asset
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
        label="Phone / WhatsApp (Optional)"
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
        <span>Strict confidentiality guaranteed. We never disclose buyer identities without consent.</span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center font-bold"
        isLoading={isSubmitting}
      >
        <Send className="h-4 w-4 mr-2" />
        Submit Confidential Inquiry
      </Button>
    </form>
  );
}

export default InquiryForm;
