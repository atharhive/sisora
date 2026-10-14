import type { Metadata } from "next";
import { MessageSquare, Mail, Phone, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact SISORA | Premium .SI Domain Brokerage",
  description:
    "Get in touch with the SISORA domain advisory and brokerage team. Inquire about domain purchases, private portfolio liquidations, and stealth acquisitions.",
};

const contactChannels = [
  {
    title: "Direct Brokerage Desk",
    value: "deals@sisora.si",
    subtext: "Fastest response for offers, appraisals, and inquiries",
    icon: Mail,
    href: "mailto:deals@sisora.si",
    actionText: "Send Email",
  },
  {
    title: "Instant Chat & WhatsApp",
    value: "+91 98765 43210",
    subtext: "Available for expedited deal discussions & escrow coordination",
    icon: Phone,
    href: "https://wa.me/919876543210",
    actionText: "Open WhatsApp",
  },
  {
    title: "Executive LinkedIn",
    value: "linkedin.com/in/yourprofile",
    subtext: "Connect directly with our leadership and brokerage principals",
    icon: ExternalLink,
    href: "https://linkedin.com/in/yourprofile",
    actionText: "Connect on LinkedIn",
  },
  {
    title: "Global Operations",
    value: "India (Serving Global Clients)",
    subtext: "Cross-border escrow execution across US, EU, and Asia-Pacific timezones",
    icon: Globe,
    href: null,
    actionText: "Global Reach",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header section */}
      <section className="border-b border-zinc-900 bg-zinc-950/40 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Sisora
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Have a question about a listed domain, seeking a confidential acquisition, or liquidating a private portfolio? Reach out to our brokerage team.
          </p>
        </div>
      </section>

      {/* Two-Column Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Direct Communication Channels
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Reach our team through your preferred medium. All discussions are handled with strict discretion.
              </p>
            </div>

            {contactChannels.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-zinc-850 bg-zinc-950/70 hover:border-zinc-700 transition-colors flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      {item.title}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-white hover:text-emerald-400 transition-colors block truncate mt-0.5"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-base font-semibold text-white truncate mt-0.5">
                        {item.value}
                      </div>
                    )}
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Escrow badge */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-center gap-3 text-xs text-zinc-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>We utilize industry standard escrow protocols (Escrow.com, Dan.com, Sedo) for 100% fraud protection.</span>
            </div>
          </div>

          {/* Right Column: ContactForm (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 shadow-xl shadow-black/40">
              <div className="mb-6 pb-4 border-b border-zinc-850">
                <h3 className="text-xl font-bold text-white">
                  Send a Confidential Message
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Fill in your details and requirements below. Our desk typically responds within a few hours.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
