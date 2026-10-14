import React from "react";
import { ClipboardList, Handshake, Check } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Submit Your Inquiry",
    description:
      "Tell us whether you're buying or selling and share your requirements.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Connect With the Right Party",
    description:
      "We evaluate the opportunity and introduce interested buyers and sellers.",
    icon: Handshake,
  },
  {
    number: "03",
    title: "Negotiate & Close",
    description:
      "We coordinate negotiations and help with a secure transfer process.",
    icon: Check,
  },
];

export function HowItWorks() {
  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
            How Sisora Works
          </h2>
          <p className="mt-3 text-base text-neutral-500 leading-relaxed">
            Our streamlined three-step brokerage model is engineered for
            transparency, speed, and discretion.
          </p>
        </div>

        {/* 3 Steps in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-neutral-200 bg-white shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-200"
              >
                {/* Circled Number Badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-sm font-black shadow-xs mb-6">
                  {step.number}
                </div>

                {/* Step Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200/80 text-black mb-5">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
                  {step.description}
                </p>

                {/* Step Indicator on Tablet/Desktop */}
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-14 -right-6 w-12 border-t-2 border-dashed border-neutral-200 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
