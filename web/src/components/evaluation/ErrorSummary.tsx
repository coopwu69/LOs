"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type ErrorSummaryProps = {
  fieldErrors: Record<string, string>;
  locale: Locale;
  onFieldFocus?: (fieldName: string) => void;
};

// Accessible error summary shown above the form footer when validation
// fails. Implements the GOV.UK error summary pattern:
//
// - role="alert" so screen readers announce it immediately.
// - A heading and descriptive help text.
// - A list of errors; clicking an error moves focus to the offending field.
// - On mount, focus moves into the summary so the user is aware of errors.
//
// The fieldErrors map values are already-localized messages (not keys).
// The field name in the href is used to locate the input via getElementById.
export function ErrorSummary({ fieldErrors, locale, onFieldFocus }: ErrorSummaryProps) {
  const copy = COPY[locale];
  const ref = useRef<HTMLDivElement>(null);
  const entries = Object.entries(fieldErrors);
  const count = entries.length;
  const labels: Record<string, string> = {
    evaluator_email: copy.email,
    semester: copy.semester,
    company: copy.company,
    evaluator_name: copy.evaluatorName,
    position: copy.position,
    department: copy.department,
    phone: copy.phone,
    student_code: copy.studentCode,
    student_name: copy.studentName,
    strengths: copy.strengths,
    improvements: copy.improvements,
    hiring_interest: copy.hiring,
    coop_next_year: copy.nextYear,
    next_year_count: copy.nextYearCount,
  };

  // Focus the summary on mount so screen readers announce it.
  useEffect(() => {
    if (count > 0) ref.current?.focus();
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="error-summary-title"
      className="mx-5 mb-5 rounded-lg border border-error-border bg-error-bg px-4 py-3 sm:mx-8"
    >
      <h2 id="error-summary-title" className="text-sm font-semibold text-error-text">
        {copy.errorSummaryTitle} — {copy.errorCount(count)}
      </h2>
      <p className="mt-1 text-sm text-error-text">{copy.errorSummaryHelp}</p>
      <ul className="mt-3 space-y-1.5">
        {entries.map(([field, message]) => {
          const label = labels[field] ?? (field.startsWith("lo-") ? copy.competencyQuestions : field.startsWith("c-") ? copy.reportItems[Number(field.slice(2))] : field);
          return <li key={field}>
            <a
              href={`#${field}`}
              onClick={(e) => {
                e.preventDefault();
                onFieldFocus?.(field);
              }}
              className="text-sm font-medium text-error-text underline underline-offset-2 hover:text-error-text"
            >
              {label}: {message}
            </a>
          </li>;
        })}
      </ul>
    </div>
  );
}
