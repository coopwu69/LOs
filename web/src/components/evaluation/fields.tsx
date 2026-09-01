"use client";

import { forwardRef } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY } from "./copy";
import { localizeError } from "@/lib/evaluation-schema";

// Shared control styling — matches the original wizard's control class
// and the semantic token system from globals.css.
const controlClass =
  "mt-2 min-h-11 w-full rounded-lg border border-border-strong bg-raised px-3.5 py-2.5 text-base text-primary placeholder:text-tertiary transition-colors hover:border-border-focus focus-visible:border-border-focus disabled:cursor-not-allowed disabled:bg-sunken disabled:text-secondary";

const errorControlClass =
  "mt-2 min-h-11 w-full rounded-lg border border-error-text bg-error-bg px-3.5 py-2.5 text-base text-primary placeholder:text-tertiary transition-colors hover:border-error-text focus-visible:border-error-text disabled:cursor-not-allowed disabled:bg-sunken disabled:text-secondary";

export function Required() {
  return <span className="ml-1 text-error-text" aria-hidden="true">*</span>;
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  pattern?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  readOnly?: boolean;
  defaultValue?: string;
  min?: number;
  autoComplete?: string;
  spellCheck?: boolean;
  error?: string;
  locale: Locale;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, name, type = "text", placeholder, required, helper, pattern, inputMode, readOnly, defaultValue, min, autoComplete, spellCheck, error },
  ref,
) {
  const helperId = helper ? `${name}-helper` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-primary">
        {label}
        {required && <Required />}
      </label>
      {helper && (
        <p id={helperId} className="mt-1 text-sm leading-relaxed text-secondary">
          {helper}
        </p>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        inputMode={inputMode}
        readOnly={readOnly}
        defaultValue={defaultValue}
        min={min}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={error ? errorControlClass : controlClass}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
});

type SelectFieldProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  error?: string;
};

export function SelectField({ label, name, options, placeholder, required, error }: SelectFieldProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-primary">
        {label}
        {required && <Required />}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        autoComplete="off"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={error ? errorControlClass : controlClass}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  helper?: string;
  error?: string;
};

export function TextAreaField({ label, name, required, helper, error }: TextAreaFieldProps) {
  const helperId = helper ? `${name}-helper` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-primary">
        {label}
        {required && <Required />}
      </label>
      {helper && (
        <p id={helperId} className="mt-1 text-sm leading-relaxed text-secondary">
          {helper}
        </p>
      )}
      <textarea
        id={name}
        name={name}
        required={required}
        rows={5}
        autoComplete="off"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={`${error ? errorControlClass : controlClass} resize-y`}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}

// Helper to resolve a localized error message from an error key.
export function resolveFieldError(errorKey: string | undefined, locale: Locale): string | undefined {
  if (!errorKey) return undefined;
  return localizeError(errorKey, locale);
}

export { controlClass };
export const copy = WIZARD_COPY;
