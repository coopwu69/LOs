import { z } from "zod";
import {
  SEMESTER_PATTERN,
  ACADEMIC_YEAR_PATTERN,
  STUDENT_CODE_PATTERN,
  UUID_PATTERN,
  buildCompetencySchema,
  flattenZodToKeys,
  localizeFieldErrors,
  localizeError,
  ERROR_MESSAGES,
  type FieldErrors,
} from "@/lib/evaluation-schema";

// Shared Zod schema for the advisor evaluation wizard.
// Used by both the client (inline validation + error summaries) and the
// server action (authoritative validation before persistence).
//
// Field names mirror the form input names so FormData can be validated
// directly. The schema intentionally preserves the existing payload shape
// and scoring keys — do not rename without updating actions.ts and the
// draft restore logic.

export const ADVISOR_OTHER_COUNT = 2;
export const ADVISOR_CENTER_COUNT = 2;
export const ADVISOR_WORKPLACE_COUNT = 5;
export const ADVISOR_REPORT_COUNT = 5;

// --- Score items ---
// Only the report appraisal (step 5) uses a 5-level scale; every other rated
// section in this project (other / center / workplace, and the competency
// questions below) uses a 4-level scale. Do not widen adv4ScoreSchema to 5 —
// this split is an explicit, locked project rule, not an oversight.
const adv4ScoreSchema = z
  .string()
  .min(1, "required")
  .refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 4;
  }, "score_range");

const adv5ScoreSchema = z
  .string()
  .min(1, "required")
  .refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 5;
  }, "score_range");

// --- Step 0: General info ---
export const advisorGeneralStepSchema = z.object({
  academic_year: z.string().min(1, "required").regex(ACADEMIC_YEAR_PATTERN, "academic_year"),
  semester: z.string().min(1, "required").regex(SEMESTER_PATTERN, "semester"),
  student_code: z.string().min(1, "required").regex(STUDENT_CODE_PATTERN, "student_code"),
  student_name: z.string().min(1, "required").max(200, "length"),
  company: z.string().min(1, "required").max(200, "length"),
  advisor_name: z.string().min(1, "required").max(120, "length"),
});

// --- Step 3: Other items + strengths / improvements ---
export const advisorOtherStepSchema = z.object({
  "adv-other-0": adv4ScoreSchema,
  "adv-other-1": adv4ScoreSchema,
  adv_strengths: z.string().min(1, "required").max(2000, "length"),
  adv_improvements: z.string().min(1, "required").max(2000, "length"),
});

// --- Step 4: Co-op center + workplace process evaluation ---
export const advisorProcessStepSchema = z
  .object({
    "adv-center-0": adv4ScoreSchema,
    "adv-center-1": adv4ScoreSchema,
    "adv-workplace-0": adv4ScoreSchema,
    "adv-workplace-1": adv4ScoreSchema,
    "adv-workplace-2": adv4ScoreSchema,
    "adv-workplace-3": adv4ScoreSchema,
    "adv-workplace-4": adv4ScoreSchema,
    adv_future_placement: z.enum(["should", "should_not", "other"], { error: "required" }),
    adv_future_placement_other: z.string().optional(),
    adv_other_comments: z.string().max(2000, "length").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.adv_future_placement === "other" && !data.adv_future_placement_other?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "required",
        path: ["adv_future_placement_other"],
      });
    }
  });

// --- Step 5: Report appraisal ---
export const advisorReportStepSchema = z.object({
  "adv-report-0": adv5ScoreSchema,
  "adv-report-1": adv5ScoreSchema,
  "adv-report-2": adv5ScoreSchema,
  "adv-report-3": adv5ScoreSchema,
  "adv-report-4": adv5ScoreSchema,
});

// --- Full submission envelope (hidden fields + all steps) ---
export const advisorSubmissionEnvelopeSchema = z.object({
  programId: z.string().min(1, "required").regex(UUID_PATTERN, "uuid"),
  templateId: z.string().min(1, "required").regex(UUID_PATTERN, "uuid"),
  draftToken: z.string().regex(UUID_PATTERN, "uuid").or(z.literal("")),
  locale: z.enum(["th", "en"]).catch("th"),
  evaluatorRole: z.literal("advisor").catch("advisor"),
});

// --- Competency questions (steps 1 & 2) ---
// Reuses buildCompetencySchema from the company form directly.
export const buildAdvisorCompetencySchema = buildCompetencySchema;

// --- Submit result discriminated union ---
export type AdvisorSubmitResult =
  | {
      success: true;
      id: string;
      loScore: number;
      loCount: number;
      loMax: number;
      otherScore: number;
      otherCount: number;
      centerScore: number;
      centerCount: number;
      reportScore: number;
      reportCount: number;
    }
  | { success: false; error: string; fieldErrors?: FieldErrors };

// Re-export localization helpers so callers only need this module.
export { ERROR_MESSAGES, localizeError, localizeFieldErrors, flattenZodToKeys, type FieldErrors };

// --- Validation helpers for the client wizard ---
// Each helper returns a Record<fieldName, errorKey> map (empty = valid).
export function validateAdvisorGeneralStep(data: Record<string, string>): Record<string, string> {
  const result = advisorGeneralStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateAdvisorOtherStep(data: Record<string, string>): Record<string, string> {
  const result = advisorOtherStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateAdvisorProcessStep(data: Record<string, string>): Record<string, string> {
  const result = advisorProcessStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateAdvisorReportStep(data: Record<string, string>): Record<string, string> {
  const result = advisorReportStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateAdvisorCompetencyStep(
  data: Record<string, string>,
  config: { requiredQuestionIds: string[]; allowedScoresByQuestion: Map<string, Set<number>> },
): Record<string, string> {
  if (config.requiredQuestionIds.length === 0) return {};
  const schema = buildAdvisorCompetencySchema(config);
  const result = schema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}
