import React from "react";

const STATS = [
  {
    highlight: "100+",
    label: "INVESTOR NETWORK",
  },
  {
    highlight: "PREMIUM",
    label: ".SI DOMAIN FOCUS",
  },
  {
    highlight: "END-TO-END",
    label: "BROKERAGE SUPPORT",
  },
  {
    highlight: "SECURE",
    label: "TRANSACTIONS",
  },
];

export function StatsBar() {
  return (
    <section className="w-full border-y border-neutral-200 bg-neutral-100/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 lg:grid-cols-4">
          {STATS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-colors hover:bg-neutral-200/40"
            >
              <span className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
                {item.highlight}
              </span>
              <span className="mt-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsBar;
