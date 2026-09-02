import { z } from "zod";

// Shared Zod schema for the evaluation wizard.
// Used by both the client (inline validation + error summaries) and the
// server action (authoritative validation before persistence).
//
// Field names mirror the form input names so FormData can be validated
// directly. The schema intentionally preserves the existing payload shape
// and scoring keys — do not rename without updating actions.ts and the
// draft restore logic.

export const SEMESTER_PATTERN = /^[1-2]$/;
// Buddhist-era academic year, currently offered from 2569 onward.
export const ACADEMIC_YEAR_PATTERN = /^25(6[9]|[7-9][0-9])$/;
export const STUDENT_CODE_PATTERN = /^\d{8}$/;
export const PHONE_PATTERN = /^[0-9+()\-\s]{8,20}$/;
export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// --- General step (step 0) ---
export const generalStepSchema = z.object({
  evaluator_email: z
    .string()
    .min(1, "required")
    .email("email")
    .max(254, "email"),
  semester: z.string().min(1, "required").regex(SEMESTER_PATTERN, "semester"),
  academic_year: z.string().min(1, "required").regex(ACADEMIC_YEAR_PATTERN, "academic_year"),
  company: z.string().min(1, "required").max(200, "length"),
  evaluator_name: z.string().min(1, "required").max(120, "length"),
  position: z.string().min(1, "required").max(120, "length"),
  department: z.string().min(1, "required").max(120, "length"),
  phone: z
    .string()
    .min(1, "required")
    .regex(PHONE_PATTERN, "phone")
    .max(20, "phone"),
  student_code: z
    .string()
    .min(1, "required")
    .regex(STUDENT_CODE_PATTERN, "student_code"),
  student_name: z.string().min(1, "required").max(200, "length"),
  school: z.string().max(200).optional(),
  program: z.string().max(200).optional(),
});

// --- Feedback step (step 4) ---
export const feedbackStepSchema = z.object({
  strengths: z.string().min(1, "required").max(2000, "length"),
  improvements: z.string().min(1, "required").max(2000, "length"),
  hiring_interest: z.enum(["yes", "no"], { error: "required" }),
  coop_next_year: z.enum(["yes", "no"], { error: "required" }),
  next_year_count: z
    .string()
    .min(1, "required")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "non_negative"),
});

// --- Report step (step 3) — five fixed items, scores 1–5 (25 points total) ---
export const REPORT_ITEM_COUNT = 5;
export const reportItemSchema = z
  .string()
  .min(1, "required")
  .refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 5;
  }, "score_range");

export const reportStepSchema = z.object({
  "c-0": reportItemSchema,
  "c-1": reportItemSchema,
  "c-2": reportItemSchema,
  "c-3": reportItemSchema,
  "c-4": reportItemSchema,
});

// --- Competency questions (steps 1 & 2) ---
// Each LO question is `lo-{questionId}` with a value that must be an integer
// within the allowed score set. The allowed set is dynamic (from DB options
// or fallback 1–5), so the per-question validation is built at runtime via
// `buildCompetencySchema`.
export function buildCompetencySchema(config: {
  requiredQuestionIds: string[];
  allowedScoresByQuestion: Map<string, Set<number>>;
}): z.ZodObject<Record<string, z.ZodString>> {
  const shape: Record<string, z.ZodString> = {};
  for (const questionId of config.requiredQuestionIds) {
    const allowed = config.allowedScoresByQuestion.get(questionId);
    const usesFallback = !allowed || allowed.size === 0;
    const validSet = usesFallback ? new Set([1, 2, 3, 4, 5]) : allowed;
    const validArr = [...(validSet ?? [])].sort((a, b) => a - b);
    shape[`lo-${questionId}`] = z
      .string()
      .min(1, "required")
      .refine((v) => {
        const n = Number(v);
        return Number.isInteger(n) && (validSet?.has(n) ?? false);
      }, "score_range")
      .refine(
        () => true,
        `Allowed: ${validArr.join(", ")}`,
      );
  }
  return z.object(shape);
}

// --- Full submission envelope (hidden fields + all steps) ---
// The server action validates the envelope then runs step-specific checks.
export const submissionEnvelopeSchema = z.object({
  programId: z.string().min(1, "required").regex(UUID_PATTERN, "uuid"),
  templateId: z.string().min(1, "required").regex(UUID_PATTERN, "uuid"),
  draftToken: z.string().regex(UUID_PATTERN, "uuid").or(z.literal("")),
  locale: z.enum(["th", "en"]).catch("th"),
});

// --- Error message keys → localized strings ---
// The schema emits short error *keys* (not Thai/English text) so the client
// can localize them per locale. See `localizeError` below.
export type ErrorKey =
  | "required"
  | "email"
  | "semester"
  | "academic_year"
  | "phone"
  | "student_code"
  | "uuid"
  | "length"
  | "score_range"
  | "non_negative";

export const ERROR_MESSAGES: Record<"th" | "en", Record<ErrorKey, string>> = {
  th: {
    required: "กรุณากรอกข้อมูลในช่องนี้",
    email: "รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
    semester: "กรุณาเลือกภาคการศึกษา",
    academic_year: "กรุณาเลือกปีการศึกษา",
    phone: "เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
    student_code: "รหัสนักศึกษาต้องเป็นตัวเลข 8 หลัก",
    uuid: "ไม่พบหลักสูตรหรือแบบประเมิน กรุณาเปิดแบบประเมินใหม่อีกครั้ง",
    length: "ข้อมูลยาวเกินไป กรุณากรอกให้สั้นลง",
    score_range: "คะแนนไม่ถูกต้อง กรุณาเลือกจากตัวเลือกที่กำหนด",
    non_negative: "กรุณากรอกจำนวนเป็นตัวเลขที่ไม่ติดลบ",
  },
  en: {
    required: "This field is required.",
    email: "Enter a valid email address and try again.",
    semester: "Please select a semester.",
    academic_year: "Please select an academic year.",
    phone: "The phone number is invalid. Please check and try again.",
    student_code: "The student ID must contain exactly 8 digits.",
    uuid: "The program or evaluation could not be found. Please reopen the evaluation.",
    length: "The value is too long. Please shorten it.",
    score_range: "The score is invalid. Please choose from the available options.",
    non_negative: "Please enter a non-negative whole number.",
  },
};

export function localizeError(errorKey: string, locale: "th" | "en"): string {
  const messages = ERROR_MESSAGES[locale];
  return (messages as Record<string, string>)[errorKey] ?? messages.required;
}

// Convert a Zod error into a flat Record<fieldName, errorKey> map.
// The first issue per field wins; values are error *keys* for localization.
export function flattenZodToKeys(
  error: z.ZodError,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (path && !(path in result)) {
      // Zod 4 stores custom refine messages as the issue message.
      // For built-in checks (email, min, regex) we map to a key.
      const key = issue.code === "invalid_type" && issue.input === undefined ? "required" : issue.message;
      result[path] = key;
    }
  }
  return result;
}

// Convert a flat Record<fieldName, errorKey> into localized messages.
export function localizeFieldErrors(
  fieldErrors: Record<string, string>,
  locale: "th" | "en",
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [field, key] of Object.entries(fieldErrors)) {
    out[field] = localizeError(key, locale);
  }
  return out;
}

// --- Validation helpers for the client wizard ---
// The client validates one step at a time. Each helper returns a
// Record<fieldName, errorKey> map (empty = valid).
export function validateGeneralStep(
  data: Record<string, string>,
): Record<string, string> {
  const result = generalStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateReportStep(
  data: Record<string, string>,
): Record<string, string> {
  const result = reportStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateFeedbackStep(
  data: Record<string, string>,
): Record<string, string> {
  const result = feedbackStepSchema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

export function validateCompetencyStep(
  data: Record<string, string>,
  config: { requiredQuestionIds: string[]; allowedScoresByQuestion: Map<string, Set<number>> },
): Record<string, string> {
  if (config.requiredQuestionIds.length === 0) return {};
  const schema = buildCompetencySchema(config);
  const result = schema.safeParse(data);
  return result.success ? {} : flattenZodToKeys(result.error);
}

// --- Types ---
export type FieldErrors = Record<string, string>;

export type SubmitResult =
  | { success: true; id: string; loScore: number; loCount: number; loMax: number; cScore: number; cCount: number }
  | { success: false; error: string; fieldErrors?: FieldErrors };
