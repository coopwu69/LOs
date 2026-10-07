"use client";

import type { Locale } from "@/lib/i18n";

// Live, real-time score summary bar for the company and advisor evaluation
// wizards (G7, goal.md). Shown sticky at the top of the viewport across all steps so the
// evaluator can see how many points they've awarded so far as they answer.
//
// This component is purely presentational — the parent wizard computes the raw
// score/max pairs with `computeLiveScores` (`@/lib/live-score`) and passes
// them in; the weighting lives in WEIGHTS below. The raw math mirrors the
// server-side scoring in each wizard's actions.ts.
//
// "Current pace" semantics: unanswered questions do NOT count as 0 against the
// denominator — each section's fraction uses only the questions answered so
// far (`answeredScore / answeredMax`). A section with zero answers shows a
// neutral "ยังไม่เริ่ม / Not started" state rather than a misleading 0%.

// Weighting per form (G7, goal.md): company share is 60 (LOs 35 + report 25);
// advisor share is 40 (LOs 10 + report 25 + presentation 5, the last entered
// later in the back office so it only shows a placeholder here). The advisor
// pass mark is 24 of 40.
const WEIGHTS = {
  company: { lo: 35, report: 25, presentation: 0, passMark: 0 },
  advisor: { lo: 10, report: 25, presentation: 5, passMark: 24 },
} as const;

type LiveScoreBarProps = {
  locale: Locale;
  variant: keyof typeof WEIGHTS;
  // LO (competency) section — raw, answered-only.
  loScore: number;
  loMax: number; // answeredLoCount * loMaxPerQuestion; 0 when nothing answered
  // Report/project section — raw, answered-only. Divisor is 4 per item (G4).
  reportScore: number;
  reportMax: number; // answeredReportCount * 4; 0 when nothing answered
};

type LiveScoreCopy = {
  losLabel: string;
  reportLabel: string;
  presentationLabel: string;
  presentationPending: string;
  totalLabel: string;
  notStarted: string;
  passMark: string; // prefix, followed by the pass-mark number
  hint: (totalMax: number) => string;
};

const LIVE_SCORE_COPY: Record<Locale, LiveScoreCopy> = {
  th: {
    losLabel: "ผลลัพธ์การเรียนรู้",
    reportLabel: "รายงาน/โครงงาน",
    presentationLabel: "การนำเสนอ",
    presentationPending: "บันทึกภายหลัง",
    totalLabel: "คะแนนรวม",
    notStarted: "ยังไม่เริ่ม",
    passMark: "เกณฑ์ผ่าน",
    hint: (totalMax) => `คะแนนถ่วงน้ำหนัก (เต็ม ${totalMax})`,
  },
  en: {
    losLabel: "Learning Outcomes",
    reportLabel: "Report / Project",
    presentationLabel: "Presentation",
    presentationPending: "Recorded later",
    totalLabel: "Total",
    notStarted: "Not started",
    passMark: "Pass mark",
    hint: (totalMax) => `Weighted score (out of ${totalMax})`,
  },
};

// Format a weighted number that may have a fractional part (e.g. 21 or 21.5).
// Integers render without a decimal; otherwise show one decimal place.
function formatWeighted(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

type SegmentProps = {
  label: string;
  weight: string;
  score: number;
  max: number;
  notStarted: string;
  // When set, the segment is not scored live: shows this text and an empty bar.
  pending?: string;
};

// One side-by-side mini-progress segment: label + weight badge, raw
// `score/max · percent`, and a thin progress bar.
function Segment({ label, weight, score, max, notStarted, pending }: SegmentProps) {
  const started = max > 0 && !pending;
  const pct = started ? Math.round((score / max) * 100) : 0;
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="truncate text-xs font-semibold text-primary">{label}</span>
        <span className="shrink-0 rounded-full bg-sunken px-1.5 py-0.5 text-[10px] font-semibold text-secondary">
          {weight}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-primary">
        {started ? (
          <>
            {score}
            <span className="text-secondary"> / {max}</span>
            <span className="ml-1.5 text-tertiary">· {pct}%</span>
          </>
        ) : (
          <span className="text-tertiary">{pending ?? notStarted}</span>
        )}
      </p>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-sunken"
        role="progressbar"
        aria-valuenow={started ? pct : 0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-action transition-all duration-300 ease-out"
          style={{ width: `${started ? pct : 0}%` }}
        />
      </div>
    </div>
  );
}

export function LiveScoreBar({
  locale,
  variant,
  loScore,
  loMax,
  reportScore,
  reportMax,
}: LiveScoreBarProps) {
  const copy = LIVE_SCORE_COPY[locale];
  const w = WEIGHTS[variant];
  const totalMax = w.lo + w.report + w.presentation;
  const totalWeighted =
    (loMax > 0 ? (loScore / loMax) * w.lo : 0) + (reportMax > 0 ? (reportScore / reportMax) * w.report : 0);
  const totalPct = Math.round((totalWeighted / totalMax) * 100);
  const anyStarted = loMax > 0 || reportMax > 0;

  return (
    <div
      className="sticky top-0 z-10 mb-6 border-b border-border-default bg-raised/95 px-5 py-3 backdrop-blur sm:px-8"
      aria-label={copy.hint(totalMax)}
    >
      <div className="flex items-center gap-3 sm:gap-6">
        <Segment
          label={copy.losLabel}
          weight={`${w.lo}%`}
          score={loScore}
          max={loMax}
          notStarted={copy.notStarted}
        />
        <Segment
          label={copy.reportLabel}
          weight={`${w.report}%`}
          score={reportScore}
          max={reportMax}
          notStarted={copy.notStarted}
        />
        {w.presentation > 0 && (
          <Segment
            label={copy.presentationLabel}
            weight={`${w.presentation}%`}
            score={0}
            max={0}
            notStarted={copy.notStarted}
            pending={copy.presentationPending}
          />
        )}

        {/* Vertical divider */}
        <div className="hidden h-12 w-px shrink-0 bg-border-default sm:block" aria-hidden="true" />

        {/* Total segment — weighted combination */}
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold text-secondary">{copy.totalLabel}</p>
          <p className="mt-0.5 text-2xl font-semibold leading-none text-primary">
            {anyStarted ? formatWeighted(totalWeighted) : "0"}
            <span className="text-base font-normal text-tertiary"> / {totalMax}</span>
          </p>
          <p className="mt-1 text-xs text-tertiary">
            {anyStarted ? `${totalPct}%` : copy.notStarted}
          </p>
          {w.passMark > 0 && (
            <p className="text-xs text-tertiary">
              {copy.passMark} {w.passMark}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
