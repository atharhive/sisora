import type { Metadata } from "next";
import { MessageSquare, Mail, Phone, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact SISORA | Premium .SI Domain Brokerage",
  description:
    "Get in touch with the SISORA domain advisory and brokerage team. Inquire about domain purchases, private portfolio liquidations, and stealth acquisitions.",
};

export default function ContactPage() {
  const contactChannels = [
    {
      title: "Direct Brokerage Desk",
      value: SITE_CONFIG.contact.email,
      subtext: "Fastest response for offers, appraisals, and inquiries",
      icon: Mail,
      href: `mailto:${SITE_CONFIG.contact.email}`,
      actionText: "Send Email",
    },
    {
      title: "Instant Chat & WhatsApp",
      value: SITE_CONFIG.contact.whatsapp,
      subtext: "Available for expedited deal discussions & escrow coordination",
      icon: Phone,
      href: SITE_CONFIG.social.whatsapp,
      actionText: "Open WhatsApp",
    },
    {
      title: "Executive LinkedIn",
      value: "linkedin.com/company/sisora",
      subtext: "Connect directly with our leadership and brokerage principals",
      icon: ExternalLink,
      href: SITE_CONFIG.social.linkedin,
      actionText: "Connect on LinkedIn",
    },
    {
      title: "Global Operations",
      value: SITE_CONFIG.contact.location,
      subtext: "Cross-border escrow execution across US, EU, and international timezones",
      icon: Globe,
      href: null,
      actionText: "Global Reach",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header section */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
            <MessageSquare className="w-4 h-4 text-neutral-900" />
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Contact Sisora
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Have a question, domain inquiry, or partnership opportunity? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-950">
                Direct Communication Channels
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Reach our team directly for time-sensitive negotiations and escrow updates.
              </p>
            </div>

            <div className="space-y-4">
              {contactChannels.map((channel, i) => {
                const Icon = channel.icon;
                const content = (
                  <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-black shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {channel.title}
                      </h3>
                      <p className="text-base font-bold text-neutral-900 truncate mt-0.5">
                        {channel.value}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {channel.subtext}
                      </p>
                    </div>
                  </div>
                );

                return channel.href ? (
                  <a
                    key={i}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={i}>{content}</div>
                );
              })}
            </div>

            {/* Escrow Trust Indicator */}
            <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-3 text-xs text-neutral-600 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900 block mb-0.5">
                  Verified Escrow Transfers
                </span>
                Every transaction coordinates through certified registrar channels and licensed escrow partners to guarantee 100% buyer and seller protection.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              <h2 className="text-xl font-bold text-neutral-950 mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mb-6">
                Fill in the details below and we will get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
