"use client";

import { Required } from "./fields";

type Choice = { value: string; label: string };

type ChoiceGroupProps = {
  legend: string;
  name: string;
  options: Choice[];
  required?: boolean;
  error?: string;
};

// Yes/No choice group rendered as an accessible radio fieldset.
export function ChoiceGroup({ legend, name, options, required = true, error }: ChoiceGroupProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset>
      <legend className="text-sm font-medium text-primary">
        {legend}
        {required && <Required />}
      </legend>
      <div
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--option-count),minmax(0,1fr))]"
        style={{ "--option-count": options.length } as React.CSSProperties}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
      >
        {options.map((option, index) => (
          <label
            key={option.value}
            className="flex min-h-12 min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-border-strong bg-raised px-4 py-3 text-sm text-primary transition-colors hover:border-border-focus hover:bg-hover focus-within:shadow-[var(--shadow-focus-ring)] has-[:checked]:border-action has-[:checked]:bg-info-bg"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              required={required && index === 0}
              aria-describedby={errorId}
              className="h-5 w-5 shrink-0 accent-action"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </fieldset>
  );
}
