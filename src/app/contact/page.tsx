import type { Metadata } from "next";
import { MessageSquare, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Sisora | .SI Domain Brokerage Desk",
  description:
    "Have a question, domain inquiry, or partnership opportunity? We're here to help. Reach Sisora via email, WhatsApp, X, or LinkedIn.",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.03-.5.2-.17.18-.67.65-.67 1.6 0 .94.69 1.86.78 1.99.1.13 1.33 2.05 3.24 2.88 1.59.69 1.91.55 2.26.52.35-.03 1.13-.46 1.29-.91.16-.45.16-.84.11-.91-.05-.08-.18-.13-.37-.23s-1.13-.56-1.31-.62c-.17-.07-.3-.1-.43.1-.13.19-.5.62-.61.75-.12.13-.23.15-.42.05-.19-.1-.8-.29-1.53-.94-.57-.51-.95-1.14-1.06-1.33-.11-.19-.01-.3.08-.39.09-.09.19-.23.29-.34.1-.12.13-.2.2-.33.06-.13.03-.25-.02-.34-.04-.1-.43-1.04-.6-1.42-.16-.38-.32-.32-.44-.33h-.37z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export default function ContactPage() {
  const contactChannels = [
    {
      title: "Email",
      value: SITE_CONFIG.contact.email,
      subtext: "Fastest response for offers, appraisals, and broker mandates",
      icon: Mail,
      href: `mailto:${SITE_CONFIG.contact.email}`,
      actionText: "Send Email",
    },
    {
      title: "WhatsApp",
      value: SITE_CONFIG.contact.whatsapp,
      subtext: "Direct desk with Domingo & brokerage team for instant messaging",
      icon: WhatsAppIcon,
      href: `https://wa.me/${SITE_CONFIG.contact.whatsappRaw}`,
      actionText: "Chat on WhatsApp",
    },
    {
      title: "X (Twitter)",
      value: "x.com/SisoraBrokerage",
      subtext: "Official brokerage updates, market insights, and deal flow",
      icon: TwitterIcon,
      href: SITE_CONFIG.social.twitter,
      actionText: "Visit @SisoraBrokerage",
    },
    {
      title: "LinkedIn",
      value: "linkedin.com/showcase/4l-com/",
      subtext: "Connect directly with our professional network & leadership",
      icon: LinkedInIcon,
      href: SITE_CONFIG.social.linkedin,
      actionText: "Open LinkedIn Showcase",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#090a0c]">
      {/* Header section with exact PDF text */}
      <section className="border-b border-neutral-200/90 bg-[#ebedf0]/60 py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-300 bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-3 sm:mb-4 shadow-2xs">
            <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-900" />
            <span>Contact Us Page For Sisora</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight">
            Have a question, domain inquiry, or partnership opportunity?
          </h1>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base lg:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            We&apos;re here to help. Reach our brokerage desk directly through any of our channels below.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
          {/* Left Column: Direct Contact Cards (2x2 grid on mobile) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-0.5 sm:mb-1">
                Direct Touchpoints
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                Brokerage Contact Channels
              </h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-neutral-500">
                Direct lines to our principals for confidential deal negotiations and escrow releases.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-4">
              {contactChannels.map((channel, i) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={i}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 group cursor-pointer"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">
                          {channel.title}
                        </h3>
                        <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
                      </div>
                      <p className="text-xs sm:text-base font-bold text-neutral-950 truncate mt-0.5">
                        {channel.value}
                      </p>
                      <p className="hidden sm:block text-xs text-neutral-500 mt-1 leading-relaxed">
                        {channel.subtext}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Escrow Guarantee Callout */}
            <div className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-1.5 sm:space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-neutral-950 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Escrow.com &amp; Atom.com Guarantee</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                All Sisora transactions settle through licensed third-party escrow. Funds are never released until registry transfer and domain control are verified by both parties.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Form that stays in place while side details scroll */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-4 sm:p-10 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Online Inquiry
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                  Send a Direct Message
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  We reply within 24 hours to all qualified inquiries.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
