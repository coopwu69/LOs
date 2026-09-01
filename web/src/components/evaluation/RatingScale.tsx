"use client";

import type { Option } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { ENGLISH_SCORE_LABELS } from "./copy";

type RatingOption = Option | { value: string; label: string };

type RatingScaleProps = {
  name: string;
  options: RatingOption[];
  required?: boolean;
  locale: Locale;
  error?: string;
};

// Accessible 1–5 rating control rendered as a radio group.
// Each option is a labelled radio input. On small screens the labels
// stack vertically; on ≥640px they form a 5-column row with the numeric
// value shown as a large label and the text label below.
//
// Keyboard: Tab moves into the group and focuses the checked (or first)
// radio; arrow keys move between options (native radio behaviour).
// Screen readers announce the group label via the fieldset/legend.
export function RatingScale({ name, options, required = true, locale, error }: RatingScaleProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <div aria-invalid={error ? "true" : undefined} aria-describedby={errorId}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {options.map((option, index) => {
          const value = "score" in option ? String(option.score) : option.value;
          const label =
            "label_th" in option
              ? locale === "en"
                ? option.label_en || ENGLISH_SCORE_LABELS[option.score] || option.label_th
                : option.label_th
              : option.label;
          const id = `${name}-${value}-${index}`;
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border-strong bg-raised px-3 py-2.5 transition-colors hover:border-border-focus hover:bg-hover focus-within:shadow-[var(--shadow-focus-ring)] has-[:checked]:border-action has-[:checked]:bg-info-bg sm:flex-col sm:justify-center sm:gap-1 sm:text-center"
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={value}
                required={required && index === 0}
                aria-describedby={errorId}
                className="h-5 w-5 accent-action"
              />
              <span className="text-sm font-semibold text-primary">{value}</span>
              <span className="text-xs text-secondary">{label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}
