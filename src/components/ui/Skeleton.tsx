import React from "react";
import { cn } from "@/lib/utils";

export type SkeletonVariant = "text" | "card" | "image" | "circle";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  const variantStyles: Record<SkeletonVariant, string> = {
    text: "h-4 w-full rounded-md",
    card: "h-48 w-full rounded-xl",
    image: "h-32 w-full rounded-lg aspect-video",
    circle: "h-10 w-10 rounded-full shrink-0",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-neutral-200/80",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
