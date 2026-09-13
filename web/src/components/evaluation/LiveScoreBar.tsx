"use client";

import type { Locale } from "@/lib/i18n";

// Live, real-time score summary bar for the company evaluation wizard (G7,
// goal.md). Shown sticky at the top of the viewport across all 6 steps so the
// evaluator can see how many points they've awarded so far as they answer.
//
// This component is purely presentational — the parent (EvaluationWizard)
// reads FormData on every `formVersion` change and computes the raw
// counts/maxes, then passes them in. The math mirrors the server-side scoring
// in `web/src/app/programs/[programId]/actions.ts` (loScore/loCount/loMax,
// cScore/cCount) and the post-submission display in CompletionScreen.tsx, so
// the live numbers match what the server will eventually persist for the same
// answers. See goal.md G7 for the 35/25/40 weighting (company share = 60).
//
// "Current pace" semantics: unanswered questions do NOT count as 0 against the
// denominator — each section's fraction uses only the questions answered so
// far (`answeredScore / answeredMax`). A section with zero answers shows a
// neutral "ยังไม่เริ่ม / Not started" state rather than a misleading 0%.

type LiveScoreBarProps = {
  locale: Locale;
  // LO (competency) section — raw, answered-only.
  loScore: number;
  loMax: number; // answeredLoCount * loMaxPerQuestion; 0 when nothing answered
  // Report/project section — raw, answered-only. Divisor is 4 per item (G4).
  reportScore: number;
  reportMax: number; // answeredReportCount * 4; 0 when nothing answered
  // Weighted combination, out of 60 (company's full share: LOs 35 + Report 25).
  totalWeighted: number; // loWeightedPct + reportWeightedPct, 0..60
};

type LiveScoreCopy = {
  losLabel: string;
  reportLabel: string;
  totalLabel: string;
  notStarted: string;
  hint: string; // explains the 60-point company share
};

const LIVE_SCORE_COPY: Record<Locale, LiveScoreCopy> = {
  th: {
    losLabel: "ผลลัพธ์การเรียนรู้",
    reportLabel: "รายงาน/โครงงาน",
    totalLabel: "คะแนนรวม",
    notStarted: "ยังไม่เริ่ม",
    hint: "คะแนนถ่วงน้ำหนักฝั่งสถานประกอบการ (เต็ม 60)",
  },
  en: {
    losLabel: "Learning Outcomes",
    reportLabel: "Report / Project",
    totalLabel: "Total",
    notStarted: "Not started",
    hint: "Company weighted score (out of 60)",
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
};

// One side-by-side mini-progress segment: label + weight badge, raw
// `score/max · percent`, and a thin progress bar.
function Segment({ label, weight, score, max, notStarted }: SegmentProps) {
  const started = max > 0;
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
          <span className="text-tertiary">{notStarted}</span>
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
  loScore,
  loMax,
  reportScore,
  reportMax,
  totalWeighted,
}: LiveScoreBarProps) {
  const copy = LIVE_SCORE_COPY[locale];
  const totalMax = 60;
  const totalPct = Math.round((totalWeighted / totalMax) * 100);
  const anyStarted = loMax > 0 || reportMax > 0;

  return (
    <div
      className="sticky top-0 z-10 mb-6 border-b border-border-default bg-raised/95 px-5 py-3 backdrop-blur sm:px-8"
      aria-label={copy.hint}
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <Segment
          label={copy.losLabel}
          weight="35%"
          score={loScore}
          max={loMax}
          notStarted={copy.notStarted}
        />
        <Segment
          label={copy.reportLabel}
          weight="25%"
          score={reportScore}
          max={reportMax}
          notStarted={copy.notStarted}
        />

        {/* Vertical divider */}
        <div className="hidden h-12 w-px shrink-0 bg-border-default sm:block" aria-hidden="true" />

        {/* Total segment — weighted combination out of 60 */}
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold text-secondary">{copy.totalLabel}</p>
          <p className="mt-0.5 text-2xl font-semibold leading-none text-primary">
            {anyStarted ? formatWeighted(totalWeighted) : "0"}
            <span className="text-base font-normal text-tertiary"> / {totalMax}</span>
          </p>
          <p className="mt-1 text-xs text-tertiary">
            {anyStarted ? `${totalPct}%` : copy.notStarted}
          </p>
        </div>
      </div>
    </div>
  );
}
