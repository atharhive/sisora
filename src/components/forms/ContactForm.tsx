"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { contactFormSchema } from "@/lib/validators";
import { SITE_CONFIG } from "@/lib/data";

const SUBJECT_OPTIONS = [
  { value: "Domain Acquisition Inquiry", label: "Domain Acquisition Inquiry" },
  { value: "Portfolio Liquidation / Selling", label: "Portfolio Liquidation / Selling" },
  { value: "Private Investment Mandate", label: "Private Investment Mandate" },
  { value: "Escrow & Registry Transfer Support", label: "Escrow & Registry Transfer Support" },
  { value: "Partnership & Press", label: "Partnership & Press" },
  { value: "General Question", label: "General Question" },
];

export interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ContactForm({ onSuccess, className }: ContactFormProps) {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Domain Acquisition Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const payload = {
      ...formData,
      phone: formData.phone.trim() || undefined,
    };

    const parseResult = contactFormSchema.safeParse(payload);
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
    const subject = `[SISORA Contact] ${formData.subject} - from ${formData.name}`;
    const body = `Hello SISORA Team,

Subject: ${formData.subject}

--- Contact Details ---
Name: ${formData.name}
Email: ${formData.email}
Phone / Telegram: ${formData.phone || "Not provided"}

--- Message ---
${formData.message}

---
Sent via SISORA Contact Form (sisora.si)`;

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
        <h4 className="text-xl font-bold text-neutral-950">Email Prepared</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed">
          Your message has been formatted for{" "}
          <span className="font-semibold text-black">{SITE_CONFIG.contact.email}</span>.
          If your email client didn&apos;t open automatically, send directly or chat on Telegram:
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
            <span>Chat on Telegram</span>
          </a>
        </div>
        <div className="pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-xs font-semibold text-neutral-500 hover:text-black underline cursor-pointer"
          >
            Send Another Message
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
          placeholder="Jane Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
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
        <Select
          label="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          options={SUBJECT_OPTIONS}
          error={errors.subject}
          required
        />
      </div>

      <Textarea
        label="Message"
        placeholder="How can our domain advisory team assist you today? Provide relevant details..."
        rows={5}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        error={errors.message}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center font-bold"
      >
        <Send className="h-4 w-4 mr-2" />
        Send Message via Email
      </Button>
    </form>
  );
}

export default ContactForm;
