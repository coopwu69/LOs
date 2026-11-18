import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY } from "@/components/evaluation/copy";
import { ADVISOR_COPY } from "@/components/advisor/advisor-copy";
import { reportVariantFor } from "@/lib/report-variants";

// SINGLE SOURCE for the report step (company step 5 / advisor part 4).
// The wizards, the print view and the Word export all call reportContentFor()
// and render what it returns — nothing else reads reportItems / reportRubric
// directly, so editing the wording here (or in lib/report-variants.ts for one
// program) changes every surface at once.

export type ReportRole = "company" | "advisor";

export type ReportContent = {
  items: readonly string[];
  /** Generic level labels, ordered low → high (value 1..4). */
  ratingLabels: readonly string[];
  /** Per-item level descriptions, each ordered low → high; undefined = labels only. */
  rubric: readonly (readonly string[])[] | undefined;
  /** Item indexes that also accept "X" (unable to assess). */
  naItems: readonly number[];
  naLabel: string | null;
  /** Replaces the wizard's [short, title, description] for this step; null = keep the default. */
  step: [string, string, string] | null;
  /** Section heading used by the print view and the Word export. */
  docTitle: string;
};

export function reportContentFor(role: ReportRole, programCode: string | null | undefined, locale: Locale): ReportContent {
  const variant = reportVariantFor(programCode);
  const v = variant?.copy[locale];
  if (role === "company") {
    const c = WIZARD_COPY[locale];
    return {
      items: v?.items ?? c.reportItems,
      ratingLabels: c.reportRating,
      rubric: v?.rubric ?? c.reportRubric,
      naItems: variant?.naItems ?? [],
      naLabel: v?.naLabel ?? null,
      step: v?.step ?? null,
      docTitle: v?.step[0] ?? c.steps[4][0],
    };
  }
  const a = ADVISOR_COPY[locale];
  return {
    items: v?.items ?? a.reportItems,
    ratingLabels: a.reportRating,
    rubric: v?.rubric ?? a.reportRubric,
    naItems: variant?.naItems ?? [],
    naLabel: v?.naLabel ?? null,
    step: v?.step ?? null,
    docTitle: v ? `${locale === "th" ? "ส่วนที่ 4" : "Part 4:"} ${v.step[1]}` : a.reportTitle,
  };
}
