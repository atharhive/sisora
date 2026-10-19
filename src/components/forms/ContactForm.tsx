"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { contactFormSchema } from "@/lib/validators";
import { SITE_CONFIG } from "@/lib/data";
import { submitOfferAction } from "@/lib/actions/public-actions";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      await submitOfferAction({
        domain_id: "contact-inquiry",
        domain_name: `Contact: ${formData.subject}`,
        buyer_name: formData.name.trim(),
        buyer_email: formData.email.trim(),
        buyer_phone: formData.phone.trim() || undefined,
        offer_amount: 1,
        notes: `[Subject: ${formData.subject}] ${formData.message.trim()}`,
      });

      setIsSubmitted(true);
      success(
        `Message delivered to ${SITE_CONFIG.contact.email} and recorded in our pipeline!`,
        "Message Sent"
      );
      onSuccess?.();
    } catch {
      error("Could not send message. Please email sisorasales@gmail.com directly.");
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
        <h4 className="text-xl font-bold text-neutral-950">Message Sent Successfully</h4>
        <p className="mx-auto max-w-md text-sm text-neutral-600 leading-relaxed font-normal">
          Your inquiry regarding <span className="font-bold text-black">{formData.subject}</span> has been dispatched to{" "}
          <span className="font-semibold text-black">{SITE_CONFIG.contact.email}</span>. Our brokerage team will reply directly to your email address shortly.
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
        disabled={isSubmitting}
        className="w-full justify-center font-bold cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}

export default ContactForm;
