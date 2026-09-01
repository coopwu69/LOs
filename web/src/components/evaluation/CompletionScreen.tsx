"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type CompletionScreenProps = {
  referenceId: string;
  loScore: number;
  loCount: number;
  loMax: number;
  cScore: number;
  cCount: number;
  locale: Locale;
};

// Completion screen shown after a successful submission.
//
// Shows a success banner, the evaluation reference ID, and a score
// summary. The reference ID uses a monospace font for legibility.
// A "back to home" link provides a clear exit.
//
// Accessibility:
// - role="status" so screen readers announce the success.
// - The reference ID is in a <span> with font-mono for clarity.
// - The score summary uses a <dl> with <dt>/<dd> pairs.
export function CompletionScreen({
  referenceId,
  loScore,
  loCount,
  loMax,
  cScore,
  cCount,
  locale,
}: CompletionScreenProps) {
  const copy = COPY[locale];
  const loPercent = loMax > 0 && loCount > 0 ? Math.round((loScore / (loCount * loMax)) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="rounded-xl border border-success-border bg-success-bg px-6 py-10 text-center"
        role="status"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-raised text-2xl text-success-text">
          ✓
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-primary">{copy.successTitle}</h2>
        <p className="mt-2 text-secondary">
          {copy.successText}{" "}
          <span className="font-mono font-medium text-primary">{referenceId}</span>
        </p>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl border border-border-default bg-raised p-6 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-secondary">{copy.completionScore}</dt>
          <dd className="mt-1 text-2xl font-semibold text-primary">
            {loScore}
            <span className="text-base font-normal text-secondary"> / {loCount * loMax}</span>
          </dd>
          <dd className="mt-0.5 text-xs text-tertiary">{loPercent}%</dd>
        </div>
        <div>
          <dt className="text-sm text-secondary">{copy.completionQuestions}</dt>
          <dd className="mt-1 text-2xl font-semibold text-primary">{loCount}</dd>
        </div>
        <div>
          <dt className="text-sm text-secondary">{copy.completionReport}</dt>
          <dd className="mt-1 text-2xl font-semibold text-primary">
            {cScore}
            <span className="text-base font-normal text-secondary"> / {cCount * 5}</span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 text-center">
        <Link
          href={copy.completionCloseHref}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active"
        >
          {copy.completionClose}
        </Link>
      </div>
    </div>
  );
}
