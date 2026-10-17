import type { Metadata } from "next";
import { MessageSquare, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Sisora | .SI Domain Brokerage Desk",
  description:
    "Have a question, domain inquiry, or partnership opportunity? We're here to help. Reach Sisora via email, Telegram, X, or LinkedIn.",
};

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
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
      title: "X (Twitter)",
      value: "x.com/SisoraBrokerage",
      subtext: "Official brokerage updates, market insights, and deal flow",
      icon: TwitterIcon,
      href: "https://x.com/SisoraBrokerage",
      actionText: "Visit @SisoraBrokerage",
    },
    {
      title: "Email",
      value: SITE_CONFIG.contact.email,
      subtext: "Fastest response for offers, appraisals, and broker mandates",
      icon: Mail,
      href: `mailto:${SITE_CONFIG.contact.email}`,
      actionText: "Send Email",
    },
    {
      title: "Telegram",
      value: "@SisoraBrokerage",
      subtext: "Direct desk with Domingo & brokerage team for instant messaging",
      icon: TelegramIcon,
      href: "http://t.me/SisoraBrokerage",
      actionText: "Chat on Telegram",
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
