import React, { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCount = false,
      autoResize = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      id,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleRef = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    const adjustHeight = () => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };

    useEffect(() => {
      if (autoResize) {
        adjustHeight();
      }
    }, [value, defaultValue, autoResize]);

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold tracking-wide uppercase text-neutral-700"
            >
              {label}
              {props.required && <span className="ml-1 text-red-500">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[11px] text-neutral-400">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <textarea
          id={textareaId}
          ref={handleRef}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(e) => {
            if (autoResize) adjustHeight();
            onChange?.(e);
          }}
          className={cn(
            "flex w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500",
            autoResize && "resize-none overflow-hidden",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder:text-red-300",
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
