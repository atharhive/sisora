import React from "react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "new"
  | "pending"
  | "active"
  | "replied"
  | "closed"
  | "sold"
  | "reserved"
  | "reviewing"
  | "accepted"
  | "rejected"
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim();

  let colorClasses = "bg-neutral-100 text-neutral-700 border-neutral-200";
  let dotColor = "bg-neutral-400";

  if (normalized === "new" || normalized === "pending") {
    colorClasses = "bg-amber-50 text-amber-800 border-amber-200/80";
    dotColor = "bg-amber-500";
  } else if (
    normalized === "active" ||
    normalized === "replied" ||
    normalized === "accepted"
  ) {
    colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-200/80";
    dotColor = "bg-emerald-500";
  } else if (
    normalized === "closed" ||
    normalized === "sold" ||
    normalized === "rejected"
  ) {
    colorClasses = "bg-neutral-100 text-neutral-600 border-neutral-200";
    dotColor = "bg-neutral-400";
  } else if (normalized === "reserved" || normalized === "reviewing") {
    colorClasses = "bg-sky-50 text-sky-800 border-sky-200/80";
    dotColor = "bg-sky-500";
  }

  const label =
    normalized.length > 0
      ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
      : "Unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase text-[11px]",
        colorClasses,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
