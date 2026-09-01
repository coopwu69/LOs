import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

const BASE = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:shadow-[var(--shadow-focus-ring)] disabled:opacity-50 disabled:pointer-events-none";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-action text-inverse hover:bg-action-hover active:bg-action-active",
  secondary: "border border-border-strong bg-raised text-primary hover:border-border-focus hover:bg-hover",
  ghost: "text-secondary hover:text-primary hover:bg-hover",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Button({ variant = "secondary", size = "md", children, className = "", type = "button", disabled, onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function ButtonLink({ href, variant = "secondary", size = "md", children, className = "", ariaLabel }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
