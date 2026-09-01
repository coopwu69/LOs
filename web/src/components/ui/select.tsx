"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/** Accessible native select — styled with semantic tokens. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`min-h-11 rounded-lg border border-border-strong bg-raised px-3 pr-8 text-sm text-primary transition-colors focus:border-border-focus focus-visible:shadow-[var(--shadow-focus-ring)] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20strokeWidth%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
