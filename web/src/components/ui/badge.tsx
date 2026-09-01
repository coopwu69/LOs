import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "success" | "warning" | "error" | "info";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-sunken text-secondary border-border-default",
  success: "bg-success-bg text-success-text border-success-border",
  warning: "bg-warning-bg text-warning-text border-warning-border",
  error: "bg-error-bg text-error-text border-error-border",
  info: "bg-info-bg text-info-text border-info-border",
};

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  title?: string;
  className?: string;
};

/** Accessible status badge — color paired with text, never color-only. */
export function Badge({ variant = "neutral", children, title, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
      title={title}
    >
      {children}
    </span>
  );
}

/** Status dot — pairs with Badge or text to reinforce status visually (not color-only). */
export function StatusDot({ variant }: { variant: BadgeVariant }) {
  const dotClass: Record<BadgeVariant, string> = {
    neutral: "bg-tertiary",
    success: "bg-success-text",
    warning: "bg-warning-text",
    error: "bg-error-text",
    info: "bg-info-text",
  };
  return <span className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotClass[variant]}`} aria-hidden="true" />;
}
