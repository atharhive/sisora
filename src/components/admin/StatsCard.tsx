import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatsTrend {
  value: string | number;
  label?: string;
  positive?: boolean;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: StatsTrend;
  iconColor?: string;
  className?: string;
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = "text-neutral-900 bg-neutral-100",
  className,
  description,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            "p-2.5 rounded-lg shrink-0 flex items-center justify-center",
            iconColor
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>

        {trend && (
          <div
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
              trend.positive
                ? "text-emerald-700 bg-emerald-50"
                : "text-rose-700 bg-rose-50"
            )}
          >
            {trend.positive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {(trend?.label || description) && (
        <p className="mt-1.5 text-xs text-neutral-500">
          {trend?.label || description}
        </p>
      )}
    </div>
  );
}

export default StatsCard;
