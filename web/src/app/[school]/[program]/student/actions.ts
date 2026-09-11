"use server";

import { getPool } from "@/lib/db";
import {
  UUID_PATTERN,
  flattenZodToKeys,
  localizeFieldErrors,
  localizeError,
} from "@/lib/evaluation-schema";
import {
  studentSubmissionEnvelopeSchema,
  studentGeneralStepSchema,
  studentExpensesStepSchema,
  studentReflectionStepSchema,
  studentClosingStepSchema,
  type StudentSubmitResult,
} from "@/lib/student-schema";

type DraftInput = {
  draftToken: string;
  programId: string;
  templateId: string;
  currentStep: number;
  payload: Record<string, string>;
};

// New tables, self-created on first use — same pattern the company form's
// actions.ts already uses, mirroring evaluation_drafts/evaluation_submissions
// (migrations/004) column-for-column. A dedicated pair of tables (not a
// shared table with a role discriminator, despite goal.md Q16 tentatively
// leaning the other way) matches this codebase's actual precedent: the
// advisor form already has its own advisor_drafts/advisor_submissions
// (migrations/006) rather than reusing evaluation_*.
async function ensureStudentTables() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.student_drafts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      draft_token uuid UNIQUE NOT NULL,
      program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
      template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
      payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
      current_step integer NOT NULL DEFAULT 0 CHECK (current_step BETWEEN 0 AND 5),
      status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      submitted_at timestamptz
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.student_submissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
      template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE SET NULL,
      payload_json jsonb NOT NULL,
      lo_score integer,
      lo_count integer,
      lo_max integer,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

export async function saveStudentDraft(input: DraftInput) {
  if (!UUID_PATTERN.test(input.draftToken) || !UUID_PATTERN.test(input.programId) || !UUID_PATTERN.test(input.templateId)) {
    return { success: false as const };
  }
  try {
    await ensureStudentTables();
    const result = await getPool().query(
      `INSERT INTO student_drafts (draft_token, program_id, template_id, payload_json, current_step)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       ON CONFLICT (draft_token) DO UPDATE
       SET payload_json = EXCLUDED.payload_json,
           current_step = EXCLUDED.current_step,
           updated_at = now()
       WHERE student_drafts.status = 'draft'
       RETURNING updated_at`,
      [input.draftToken, input.programId, input.templateId, JSON.stringify(input.payload), Math.max(0, Math.min(input.currentStep, 5))]
    );
    const updatedAt = result.rows[0]?.updated_at;
    return updatedAt
      ? { success: true as const, updatedAt: new Date(updatedAt).toISOString() }
      : { success: false as const };
  } catch (error) {
    console.error("Unable to save student draft", error);
    return { success: false as const };
  }
}

export async function loadStudentDraft(draftToken: string, programId: string, templateId: string) {
  if (!UUID_PATTERN.test(draftToken) || !UUID_PATTERN.test(programId) || !UUID_PATTERN.test(templateId)) return null;
  try {
    await ensureStudentTables();
    const result = await getPool().query(
      `SELECT payload_json, current_step
       FROM student_drafts
       WHERE draft_token = $1 AND program_id = $2 AND template_id = $3 AND status = 'draft'`,
      [draftToken, programId, templateId]
    );
    if (!result.rows[0]) return null;
    return {
      payload: result.rows[0].payload_json as Record<string, string>,
      currentStep: Number(result.rows[0].current_step) || 0,
    };
  } catch (error) {
    console.error("Unable to load student draft", error);
    return null;
  }
}

export async function submitStudentSurvey(_prevState: unknown, formData: FormData): Promise<StudentSubmitResult> {
  const raw = Object.fromEntries(formData);
  const programId = String(raw.programId || "");
  const templateId = String(raw.templateId || "");
  const draftToken = String(raw.draftToken || "");
  const isEnglish = raw.locale === "en";
  const message = (th: string, en: string) => (isEnglish ? en : th);

  const envelopeResult = studentSubmissionEnvelopeSchema.safeParse({
    programId,
    draftToken,
    locale: String(raw.locale || "th"),
  });
  if (!envelopeResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(envelopeResult.error), isEnglish ? "en" : "th");
    return {
      success: false,
      error: message("ไม่พบหลักสูตรหรือแบบสอบถาม กรุณาเปิดแบบสอบถามใหม่อีกครั้ง", "The program or questionnaire could not be found. Please reopen it."),
      fieldErrors,
    };
  }
  const locale = isEnglish ? "en" : "th";

  const generalResult = studentGeneralStepSchema.safeParse({
    student_code: raw.student_code,
    student_name: raw.student_name,
    semester: raw.semester,
    academic_year: raw.academic_year,
    st_workplace_name: raw.st_workplace_name,
    st_workplace_address: raw.st_workplace_address,
  });
  if (!generalResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(generalResult.error), locale);
    return { success: false, error: message("ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละส่วนก่อนส่ง", "Required information is missing. Please review each section before submitting."), fieldErrors };
  }

  const expensesData: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("st_") && (key.includes("wage") || key.includes("cost") || key.includes("expenses") || key.includes("accommodation") || key === "st_compensation_type" || key === "st_benefits_other" || key.startsWith("st_benefits-"))) {
      expensesData[key] = String(value);
    }
  }
  const expensesResult = studentExpensesStepSchema.safeParse(expensesData);
  if (!expensesResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(expensesResult.error), locale);
    return { success: false, error: message("ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละส่วนก่อนส่ง", "Required information is missing. Please review each section before submitting."), fieldErrors };
  }

  const reflectionResult = studentReflectionStepSchema.safeParse({
    st_strengths: raw.st_strengths,
    st_improvements: raw.st_improvements,
  });
  if (!reflectionResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(reflectionResult.error), locale);
    return { success: false, error: message("ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละส่วนก่อนส่ง", "Required information is missing. Please review each section before submitting."), fieldErrors };
  }

  const closingResult = studentClosingStepSchema.safeParse({
    "center-0": raw["center-0"],
    "center-1": raw["center-1"],
    st_workplace_support_0: raw.st_workplace_support_0,
    st_workplace_support_1: raw.st_workplace_support_1,
    st_workplace_support_2: raw.st_workplace_support_2,
    st_workplace_support_3: raw.st_workplace_support_3,
    st_workplace_support_4: raw.st_workplace_support_4,
    st_future_placement: raw.st_future_placement,
    st_future_placement_other: raw.st_future_placement_other,
    st_other_comments: raw.st_other_comments,
  });
  if (!closingResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(closingResult.error), locale);
    return { success: false, error: message("ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละส่วนก่อนส่ง", "Required information is missing. Please review each section before submitting."), fieldErrors };
  }

  const pool = getPool();
  await ensureStudentTables();

  try {
    let loScore = 0;
    let loCount = 0;
    let loMax = 0;

    // LO scoring — same query shape and fallback rules as the company form's
    // actions.ts (1-4 fallback when a question has no DB-configured options).
    const optionResult = await pool.query(
      `WITH selected_questions AS (
         SELECT DISTINCT ON (COALESCE(NULLIF(UPPER(BTRIM(lo_code)), ''), id::text))
                id, is_required,
                COALESCE(NULLIF(UPPER(BTRIM(lo_code)), ''), id::text) AS question_key
         FROM evaluation_questions
         WHERE template_id = $1
         ORDER BY COALESCE(NULLIF(UPPER(BTRIM(lo_code)), ''), id::text), LENGTH(text), sequence
       )
       SELECT q.id AS question_id, q.is_required, o.score
       FROM selected_questions q
       LEFT JOIN assessment_options o ON o.question_id = q.id`,
      [templateId]
    );
    const allowedScores = new Map<string, Set<number>>();
    const requiredQuestions = new Set<string>();
    for (const row of optionResult.rows) {
      const questionId = String(row.question_id);
      const scores = allowedScores.get(questionId) ?? new Set<number>();
      if (row.score !== null) {
        scores.add(Number(row.score));
        loMax = Math.max(loMax, Number(row.score));
      }
      allowedScores.set(questionId, scores);
      if (row.is_required) requiredQuestions.add(questionId);
    }

    const competencyFieldErrors: Record<string, string> = {};
    for (const questionId of requiredQuestions) {
      if (!raw[`lo-${questionId}`]) competencyFieldErrors[`lo-${questionId}`] = localizeError("required", locale);
    }
    for (const [key, value] of Object.entries(raw)) {
      if (!key.startsWith("lo-")) continue;
      const questionId = key.slice(3);
      const score = parseInt(String(value), 10);
      const configuredScores = allowedScores.get(questionId);
      const usesFallbackScale = configuredScores?.size === 0;
      if (!configuredScores || (usesFallbackScale ? score < 1 || score > 4 : !configuredScores.has(score))) {
        competencyFieldErrors[key] = localizeError("score_range", locale);
        continue;
      }
      if (usesFallbackScale) loMax = Math.max(loMax, 4);
      loScore += score;
      loCount++;
    }
    if (Object.keys(competencyFieldErrors).length > 0) {
      return {
        success: false,
        error: message("กรุณาตอบคำถามผลลัพธ์การเรียนรู้ (LO) ที่จำเป็นให้ครบทุกข้อ", "Please answer all required learning-outcome questions."),
        fieldErrors: competencyFieldErrors,
      };
    }
    const payload = JSON.stringify(raw);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        `INSERT INTO student_submissions (program_id, template_id, payload_json, lo_score, lo_count, lo_max)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6)
         RETURNING id`,
        [programId, templateId, payload, loScore, loCount, loMax]
      );
      if (UUID_PATTERN.test(draftToken)) {
        await client.query(
          `UPDATE student_drafts SET status = 'submitted', submitted_at = now(), updated_at = now()
           WHERE draft_token = $1 AND program_id = $2 AND template_id = $3`,
          [draftToken, programId, templateId]
        );
      }
      await client.query("COMMIT");
      return { success: true, id: result.rows[0].id, loScore, loCount, loMax };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Unable to submit student survey", error);
    return { success: false, error: message("บันทึกแบบสอบถามไม่สำเร็จ กรุณาลองอีกครั้ง", "The questionnaire could not be saved. Please try again.") };
  }
}
