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
  type FieldErrors,
} from "@/lib/evaluation-schema";

// Shared Zod schema for the student post-placement questionnaire (G10,
// goal.md — the system's 3rd form). Field names mirror form input names so
// FormData can be validated directly, same convention as
// evaluation-schema.ts / advisor-schema.ts.
//
// Field names are prefixed `st_` where the question is unique to this form,
// to keep them unambiguous if a future page ever needs to reason about all
// three forms' payloads together. `center-0`/`center-1` (section 6) and
// `lo-{questionId}` (sections 3-4) intentionally reuse the exact field
// names the company/advisor forms use for the same concepts — same
// questions, different respondent, not a coincidence.

const fourLevelScoreSchema = z
  .string()
  .min(1, "required")
  .refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 4;
  }, "score_range");

// --- Section 1: General information ---
export const studentGeneralStepSchema = z.object({
  student_code: z.string().min(1, "required").regex(STUDENT_CODE_PATTERN, "student_code"),
  student_name: z.string().min(1, "required").max(200, "length"),
  semester: z.string().min(1, "required").regex(SEMESTER_PATTERN, "semester"),
  academic_year: z.string().min(1, "required").regex(ACADEMIC_YEAR_PATTERN, "academic_year"),
  st_workplace_name: z.string().min(1, "required").max(200, "length"),
  st_workplace_address: z.string().min(1, "required").max(500, "length"),
});

// --- Section 2: Compensation, benefits, and accommodation ---
// Only `st_compensation_type` is required (goal.md's table marks just #8
// with a checkmark) — the amounts and accommodation details are optional
// free-form context, not scored data. Disclosure: selecting "none" hides
// (and, on submit, must not carry a stale value for) 8.1-8.3.
export const studentExpensesStepSchema = z
  .object({
    st_compensation_type: z.enum(["none", "money", "benefits", "money_benefits"], { error: "required" }),
    st_daily_wage: z.string().max(20, "length").optional(),
    st_monthly_wage: z.string().max(20, "length").optional(),
    st_benefits_other: z.string().max(200, "length").optional(),
    st_accommodation_cost: z.string().max(20, "length").optional(),
    st_food_cost: z.string().max(20, "length").optional(),
    st_travel_cost: z.string().max(20, "length").optional(),
    st_book_fee_cost: z.string().max(20, "length").optional(),
    st_material_insurance_cost: z.string().max(20, "length").optional(),
    st_monthly_rent_cost: z.string().max(20, "length").optional(),
    st_other_expenses: z.string().max(2000, "length").optional(),
    st_accommodation_info: z.string().max(2000, "length").optional(),
    st_recommend_accommodation: z.enum(["yes", "no"]).optional(),
  })
  .catchall(z.string().optional()); // st_benefits-{n} checkboxes — variable count, validated by presence only

// --- Sections 3-4: LO questions (dynamic per program) — reuses
// buildCompetencySchema exactly like the company/advisor forms. ---
export { buildCompetencySchema };

// --- Section 5: Self-reflection ---
export const studentReflectionStepSchema = z.object({
  st_strengths: z.string().min(1, "required").max(2000, "length"),
  st_improvements: z.string().min(1, "required").max(2000, "length"),
});

// --- Section 6: coop-center process (shared w/ company & advisor forms via
// lib/coop-center-copy.ts), workplace support, and closing comments ---
export const STUDENT_WORKPLACE_SUPPORT_COUNT = 5;

function workplaceSupportShape() {
  const shape: Record<string, z.ZodType<string, string>> = {};
  for (let i = 0; i < STUDENT_WORKPLACE_SUPPORT_COUNT; i++) {
    shape[`st_workplace_support_${i}`] = fourLevelScoreSchema;
  }
  return shape;
}

export const studentClosingStepSchema = z
  .object({
    "center-0": fourLevelScoreSchema,
    "center-1": fourLevelScoreSchema,
    ...workplaceSupportShape(),
    st_future_placement: z.enum(["should", "should_not", "other"], { error: "required" }),
    st_future_placement_other: z.string().max(500, "length").optional(),
    st_other_comments: z.string().max(2000, "length").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.st_future_placement === "other" && !data.st_future_placement_other?.trim()) {
      ctx.addIssue({ code: "custom", message: "required", path: ["st_future_placement_other"] });
    }
  });

// --- Full submission envelope (hidden fields) ---
export const studentSubmissionEnvelopeSchema = z.object({
  programId: z.string().min(1, "required").regex(UUID_PATTERN, "uuid"),
  draftToken: z.string().regex(UUID_PATTERN, "uuid").or(z.literal("")),
  locale: z.enum(["th", "en"]).catch("th"),
});

// --- Validation helpers for the client wizard (same shape as
// evaluation-schema.ts's validate* helpers) ---
export function validateStudentGeneralStep(data: Record<string, string>): FieldErrors {
  const result = studentGeneralStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateStudentExpensesStep(data: Record<string, string>): FieldErrors {
  const result = studentExpensesStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateStudentReflectionStep(data: Record<string, string>): FieldErrors {
  const result = studentReflectionStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateStudentClosingStep(data: Record<string, string>): FieldErrors {
  const result = studentClosingStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export { localizeFieldErrors, localizeError };
export type { FieldErrors };

export type StudentSubmitResult =
  | { success: true; id: string; loScore: number; loCount: number; loMax: number }
  | { success: false; error: string; fieldErrors?: FieldErrors };
