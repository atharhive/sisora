import React, { forwardRef } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "green";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  withArrow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      withArrow = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 shadow-sm border border-black",
      secondary:
        "border border-black text-black bg-white hover:bg-black hover:text-white active:bg-neutral-900",
      outline:
        "border border-neutral-300 text-neutral-800 bg-white hover:border-black hover:text-black",
      ghost:
        "text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 bg-transparent border border-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm border border-red-600 focus-visible:ring-red-600",
      green:
        "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm border border-emerald-600",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
      md: "h-10 px-4 py-2 text-sm gap-2 rounded-lg",
      lg: "h-12 px-6 text-base gap-2.5 rounded-xl font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        <span>{children}</span>

        {!isLoading &&
          (rightIcon ||
            (withArrow && (
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            )))}
      </button>
    );
  }
);

Button.displayName = "Button";
