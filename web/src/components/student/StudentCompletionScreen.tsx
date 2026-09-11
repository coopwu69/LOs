"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { homePath } from "@/lib/routes";
import { FORM_NAMES } from "@/lib/form-names";

type StudentCompletionScreenProps = {
  referenceId: string;
  loScore: number;
  loCount: number;
  loMax: number;
  locale: Locale;
};

// Completion screen shown after a successful student-survey submission.
// Mirrors AdvisorCompletionScreen/CompletionScreen (same role="status" +
// reference-id + score-summary pattern), scoped to this form's only scored
// section (LO self-assessment) — the survey's other sections (expenses,
// coop-center evaluation, comments) aren't part of the student's own score.
const COMPLETION_COPY: Record<Locale, { successText: string; loLabel: string; close: string }> = {
  th: {
    successText: "ขอบคุณสำหรับข้อมูล รหัสอ้างอิงคือ",
    loLabel: "คะแนนประเมินตนเอง (LO)",
    close: "กลับหน้าแรก",
  },
  en: {
    successText: "Thank you. Your reference is",
    loLabel: "Self-assessment (LO) score",
    close: "Back to home",
  },
};

export function StudentCompletionScreen({ referenceId, loScore, loCount, loMax, locale }: StudentCompletionScreenProps) {
  const copy = COMPLETION_COPY[locale];
  const successTitle = `${FORM_NAMES[locale].student} — ${locale === "en" ? "submitted" : "ส่งเรียบร้อยแล้ว"}`;
  const max = loCount * loMax;
  const percent = max > 0 ? Math.round((loScore / max) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-success-border bg-success-bg px-6 py-10 text-center" role="status">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-raised text-2xl text-success-text">✓</div>
        <h2 className="mt-5 text-2xl font-semibold text-primary">{successTitle}</h2>
        <p className="mt-2 text-secondary">
          {copy.successText} <span className="font-mono font-medium text-primary">{referenceId}</span>
        </p>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl border border-border-default bg-raised p-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-secondary">{copy.loLabel}</dt>
          <dd className="mt-1 text-2xl font-semibold text-primary">
            {loScore}
            <span className="text-base font-normal text-secondary"> / {max}</span>
          </dd>
          <dd className="mt-0.5 text-xs text-tertiary">{percent}%</dd>
        </div>
      </dl>

      <div className="mt-6 text-center">
        <Link href={homePath(locale)} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active">
          {copy.close}
        </Link>
      </div>
    </div>
  );
}
