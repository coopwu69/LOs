"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

/** Accessible text input with optional leading icon (e.g. search). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = "", ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" aria-hidden="true">
            {icon}
          </span>
          <input
            ref={ref}
            className={`w-full min-h-11 rounded-lg border border-border-strong bg-raised pl-10 pr-3 text-sm text-primary placeholder:text-tertiary transition-colors focus:border-border-focus focus-visible:shadow-[var(--shadow-focus-ring)] ${className}`}
            {...props}
          />
        </div>
      );
    }
    return (
      <input
        ref={ref}
        className={`w-full min-h-11 rounded-lg border border-border-strong bg-raised px-3 text-sm text-primary placeholder:text-tertiary transition-colors focus:border-border-focus focus-visible:shadow-[var(--shadow-focus-ring)] ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
