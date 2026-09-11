"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { homePath } from "@/lib/routes";

type AdvisorCompletionScreenProps = {
  referenceId: string;
  loScore: number;
  loCount: number;
  loMax: number;
  otherScore: number;
  otherCount: number;
  centerScore: number;
  centerCount: number;
  reportScore: number;
  reportCount: number;
  locale: Locale;
};

// Completion screen shown after a successful advisor evaluation submission.
//
// Shows a success banner, the evaluation reference ID, and a score summary
// split into four groups: LO, other, center + workplace, and report.
//
// Accessibility:
// - role="status" so screen readers announce the success.
// - The reference ID is in a <span> with font-mono for clarity.
// - The score summary uses a <dl> with <dt>/<dd> pairs.
const COMPLETION_COPY: Record<Locale, {
  successTitle: string;
  successText: string;
  loLabel: string;
  otherLabel: string;
  centerLabel: string;
  reportLabel: string;
  close: string;
}> = {
  th: {
    successTitle: "ส่งแบบประเมินอาจารย์นิเทศเรียบร้อยแล้ว",
    successText: "ขอบคุณสำหรับข้อมูล รหัสแบบประเมินคือ",
    loLabel: "คะแนนสมรรถนะ",
    otherLabel: "คะแนนอื่น ๆ",
    centerLabel: "คะแนนศูนย์และสถานประกอบการ",
    reportLabel: "คะแนนรายงาน",
    close: "กลับหน้าแรก",
  },
  en: {
    successTitle: "Advisor evaluation submitted",
    successText: "Thank you. Your evaluation reference is",
    loLabel: "Competency score",
    otherLabel: "Other score",
    centerLabel: "Center and workplace score",
    reportLabel: "Report score",
    close: "Back to home",
  },
};

export function AdvisorCompletionScreen({
  referenceId,
  loScore,
  loCount,
  loMax,
  otherScore,
  otherCount,
  centerScore,
  centerCount,
  reportScore,
  reportCount,
  locale,
}: AdvisorCompletionScreenProps) {
  const copy = COMPLETION_COPY[locale];

  // Every scored group uses a 4-level scale since G4 (2026-09-11) — the
  // report appraisal no longer has a 5-level exception.
  const loPercent = loMax > 0 && loCount > 0 ? Math.round((loScore / (loCount * loMax)) * 100) : 0;
  const otherPercent = otherCount > 0 ? Math.round((otherScore / (otherCount * 4)) * 100) : 0;
  const centerPercent = centerCount > 0 ? Math.round((centerScore / (centerCount * 4)) * 100) : 0;
  const reportPercent = reportCount > 0 ? Math.round((reportScore / (reportCount * 4)) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="rounded-xl border border-success-border bg-success-bg px-6 py-10 text-center"
        role="status"
      >
        <h2 className="text-2xl font-semibold text-primary">{copy.successTitle}</h2>
        <p className="mt-2 text-secondary">
          {copy.successText}{" "}
          <span className="font-mono font-medium text-primary">{referenceId}</span>
        </p>
      </div>

      <dl className="mt-6 grid gap-4 rounded-xl border border-border-default bg-raised p-6 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard label={copy.loLabel} score={loScore} max={loCount * loMax} percent={loPercent} />
        <ScoreCard
          label={copy.otherLabel}
          score={otherScore}
          max={otherCount * 4}
          percent={otherPercent}
        />
        <ScoreCard
          label={copy.centerLabel}
          score={centerScore}
          max={centerCount * 4}
          percent={centerPercent}
        />
        <ScoreCard
          label={copy.reportLabel}
          score={reportScore}
          max={reportCount * 4}
          percent={reportPercent}
        />
      </dl>

      <div className="mt-6 text-center">
        <Link
          href={homePath(locale)}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active"
        >
          {copy.close}
        </Link>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  max,
  percent,
}: {
  label: string;
  score: number;
  max: number;
  percent: number;
}) {
  return (
    <div>
      <dt className="text-sm text-secondary">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-primary">
        {score}
        <span className="text-base font-normal text-secondary"> / {max}</span>
      </dd>
      <dd className="mt-0.5 text-xs text-tertiary">{percent}%</dd>
    </div>
  );
}
