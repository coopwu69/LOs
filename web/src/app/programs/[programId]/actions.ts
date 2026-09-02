"use server";

import { getPool } from "@/lib/db";
import {
  UUID_PATTERN,
  submissionEnvelopeSchema,
  generalStepSchema,
  feedbackStepSchema,
  reportStepSchema,
  REPORT_ITEM_COUNT,
  flattenZodToKeys,
  localizeFieldErrors,
  localizeError,
  type SubmitResult,
} from "@/lib/evaluation-schema";

type DraftInput = {
  draftToken: string;
  programId: string;
  templateId: string;
  currentStep: number;
  payload: Record<string, string>;
};

export async function saveEvaluationDraft(input: DraftInput) {
  if (!UUID_PATTERN.test(input.draftToken) || !UUID_PATTERN.test(input.programId) || !UUID_PATTERN.test(input.templateId)) {
    return { success: false as const };
  }

  try {
    const result = await getPool().query(
      `INSERT INTO evaluation_drafts (draft_token, program_id, template_id, payload_json, current_step)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       ON CONFLICT (draft_token) DO UPDATE
       SET payload_json = EXCLUDED.payload_json,
           current_step = EXCLUDED.current_step,
           updated_at = now()
       WHERE evaluation_drafts.status = 'draft'
       RETURNING updated_at`,
      [input.draftToken, input.programId, input.templateId, JSON.stringify(input.payload), Math.max(0, Math.min(input.currentStep, 5))]
    );
    const updatedAt = result.rows[0]?.updated_at;
    return updatedAt
      ? { success: true as const, updatedAt: new Date(updatedAt).toISOString() }
      : { success: false as const };
  } catch (error) {
    console.error("Unable to save evaluation draft", error);
    return { success: false as const };
  }
}

export async function loadEvaluationDraft(draftToken: string, programId: string, templateId: string) {
  if (!UUID_PATTERN.test(draftToken) || !UUID_PATTERN.test(programId) || !UUID_PATTERN.test(templateId)) return null;

  try {
    const result = await getPool().query(
      `SELECT payload_json, current_step
       FROM evaluation_drafts
       WHERE draft_token = $1 AND program_id = $2 AND template_id = $3 AND status = 'draft'`,
      [draftToken, programId, templateId]
    );
    if (!result.rows[0]) return null;
    return {
      payload: result.rows[0].payload_json as Record<string, string>,
      currentStep: Number(result.rows[0].current_step) || 0,
    };
  } catch (error) {
    console.error("Unable to load evaluation draft", error);
    return null;
  }
}

export async function submitEvaluation(_prevState: unknown, formData: FormData): Promise<SubmitResult> {
  const raw = Object.fromEntries(formData);
  const programId = String(raw.programId || "");
  const templateId = String(raw.templateId || "");
  const draftToken = String(raw.draftToken || "");
  const isEnglish = raw.locale === "en";
  const message = (th: string, en: string) => (isEnglish ? en : th);

  // --- Envelope validation (UUIDs, locale) ---
  const envelopeResult = submissionEnvelopeSchema.safeParse({
    programId,
    templateId,
    draftToken,
    locale: String(raw.locale || "th"),
  });
  if (!envelopeResult.success) {
    const keys = flattenZodToKeys(envelopeResult.error);
    const fieldErrors = localizeFieldErrors(keys, isEnglish ? "en" : "th");
    return {
      success: false,
      error: message("ไม่พบหลักสูตรหรือแบบประเมิน กรุณาเปิดแบบประเมินใหม่อีกครั้ง", "The program or evaluation could not be found. Please reopen the evaluation."),
      fieldErrors,
    };
  }

  const locale = isEnglish ? "en" : "th";

  // --- Step 0: General info validation ---
  const generalResult = generalStepSchema.safeParse({
    evaluator_email: raw.evaluator_email,
    semester: raw.semester,
    academic_year: raw.academic_year,
    company: raw.company,
    evaluator_name: raw.evaluator_name,
    position: raw.position,
    department: raw.department,
    phone: raw.phone,
    student_code: raw.student_code,
    student_name: raw.student_name,
    school: raw.school,
    program: raw.program,
  });
  if (!generalResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(generalResult.error), locale);
    return {
      success: false,
      error: message("ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละขั้นก่อนส่งแบบประเมิน", "Required information is missing. Please review each step before submitting."),
      fieldErrors,
    };
  }

  // --- Step 4: Feedback validation ---
  const feedbackResult = feedbackStepSchema.safeParse({
    strengths: raw.strengths,
    improvements: raw.improvements,
    hiring_interest: raw.hiring_interest,
    coop_next_year: raw.coop_next_year,
    next_year_count: raw.next_year_count,
  });
  if (!feedbackResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(feedbackResult.error), locale);
    return {
      success: false,
      error: message("ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละขั้นก่อนส่งแบบประเมิน", "Required information is missing. Please review each step before submitting."),
      fieldErrors,
    };
  }

  // --- Step 3: Report validation ---
  const reportResult = reportStepSchema.safeParse({
    "c-0": raw["c-0"],
    "c-1": raw["c-1"],
    "c-2": raw["c-2"],
    "c-3": raw["c-3"],
    "c-4": raw["c-4"],
  });
  if (!reportResult.success) {
    const fieldErrors = localizeFieldErrors(flattenZodToKeys(reportResult.error), locale);
    return {
      success: false,
      error: message("กรุณาประเมินรายงานหรือโครงงานให้ครบทั้ง 5 ข้อ", "Please complete all five report or project questions."),
      fieldErrors,
    };
  }

  const pool = getPool();

  // Ensure the submissions table exists (same as original).
  await pool.query(`
    CREATE TABLE IF NOT EXISTS evaluation_submissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
      template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE SET NULL,
      payload_json jsonb NOT NULL,
      lo_score int,
      lo_count int,
      lo_max int,
      c_score int,
      c_count int,
      created_at timestamptz DEFAULT now()
    )
  `);

  try {
    let loScore = 0;
    let loCount = 0;
    let loMax = 0;
    let cScore = 0;
    let cCount = 0;

    // --- Step 1 & 2: Competency scoring (preserved from original) ---
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

    // Validate required competency questions are answered.
    const competencyFieldErrors: Record<string, string> = {};
    for (const questionId of requiredQuestions) {
      if (!raw[`lo-${questionId}`]) {
        competencyFieldErrors[`lo-${questionId}`] = localizeError("required", locale);
      }
    }

    // Validate competency scores against allowed set.
    for (const [key, value] of Object.entries(raw)) {
      if (key.startsWith("lo-")) {
        const questionId = key.slice(3);
        const score = parseInt(String(value), 10);
        const configuredScores = allowedScores.get(questionId);
        const usesFallbackScale = configuredScores?.size === 0;
        if (!configuredScores || (usesFallbackScale ? score < 1 || score > 5 : !configuredScores.has(score))) {
          competencyFieldErrors[key] = localizeError("score_range", locale);
          continue;
        }
        if (usesFallbackScale) loMax = Math.max(loMax, 5);
        loScore += score;
        loCount++;
      }
      if (key.startsWith("c-")) {
        const score = parseInt(String(value), 10);
        if (!Number.isInteger(score) || score < 1 || score > 5) {
          // Already validated by Zod, but keep the guard for safety.
          continue;
        }
        cScore += score;
        cCount++;
      }
    }

    if (Object.keys(competencyFieldErrors).length > 0) {
      return {
        success: false,
        error: message("กรุณาตอบคำถามสมรรถนะที่จำเป็นให้ครบทุกข้อ", "Please answer all required competency questions."),
        fieldErrors: competencyFieldErrors,
      };
    }

    if (cCount !== REPORT_ITEM_COUNT)
      return {
        success: false,
        error: message("กรุณาประเมินรายงานหรือโครงงานให้ครบทั้ง 5 ข้อ", "Please complete all five report or project questions."),
      };

    // --- Persist submission (preserved from original) ---
    const payload = JSON.stringify(raw);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const result = await client.query(
        `INSERT INTO evaluation_submissions (program_id, template_id, payload_json, lo_score, lo_count, lo_max, c_score, c_count)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8)
         RETURNING id`,
        [programId, templateId, payload, loScore, loCount, loMax, cScore, cCount]
      );
      if (UUID_PATTERN.test(draftToken)) {
        await client.query(
          `UPDATE evaluation_drafts SET status = 'submitted', submitted_at = now(), updated_at = now()
           WHERE draft_token = $1 AND program_id = $2 AND template_id = $3`,
          [draftToken, programId, templateId]
        );
      }
      await client.query("COMMIT");
      return { success: true, id: result.rows[0].id, loScore, loCount, loMax, cScore, cCount };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Unable to submit evaluation", error);
    return { success: false, error: message("บันทึกแบบประเมินไม่สำเร็จ กรุณาลองอีกครั้ง", "The evaluation could not be saved. Please try again.") };
  }
}
