"use server";

import { getPool } from "@/lib/db";
import {
  saveAdvisorDraft as dbSaveAdvisorDraft,
  loadAdvisorDraft as dbLoadAdvisorDraft,
  type AdvisorDraftInput,
} from "@/lib/db";
import {
  UUID_PATTERN,
} from "@/lib/evaluation-schema";
import {
  advisorSubmissionEnvelopeSchema,
  advisorGeneralStepSchema,
  advisorOtherStepSchema,
  advisorProcessStepSchema,
  advisorReportStepSchema,
  flattenZodToKeys,
  localizeFieldErrors,
  localizeError,
  ADVISOR_OTHER_COUNT,
  ADVISOR_CENTER_COUNT,
  ADVISOR_WORKPLACE_COUNT,
  ADVISOR_REPORT_COUNT,
  type AdvisorSubmitResult,
} from "@/lib/advisor-schema";

export { type AdvisorDraftInput } from "@/lib/db";

export async function saveAdvisorDraft(input: AdvisorDraftInput) {
  return dbSaveAdvisorDraft(input);
}

export async function loadAdvisorDraft(draftToken: string, programId: string, templateId: string) {
  return dbLoadAdvisorDraft(draftToken, programId, templateId);
}

export async function submitAdvisorEvaluation(
  _prevState: unknown,
  formData: FormData,
): Promise<AdvisorSubmitResult> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const locale = raw.locale === "en" ? "en" : "th";
  const message = (th: string, en: string) => (locale === "en" ? en : th);

  // --- Envelope validation (UUIDs, locale, evaluator role) ---
  const envelopeResult = advisorSubmissionEnvelopeSchema.safeParse({
    programId: raw.programId,
    templateId: raw.templateId,
    draftToken: raw.draftToken,
    locale: raw.locale,
    evaluatorRole: raw.evaluatorRole,
  });
  if (!envelopeResult.success) {
    const keys = flattenZodToKeys(envelopeResult.error);
    const fieldErrors = localizeFieldErrors(keys, locale);
    return {
      success: false,
      error: message(
        "ไม่พบหลักสูตรหรือแบบประเมิน กรุณาเปิดแบบประเมินใหม่อีกครั้ง",
        "The program or evaluation could not be found. Please reopen the evaluation.",
      ),
      fieldErrors,
    };
  }

  const { programId, templateId, draftToken } = envelopeResult.data;

  // --- Step validations ---
  const generalResult = advisorGeneralStepSchema.safeParse(raw);
  const otherResult = advisorOtherStepSchema.safeParse(raw);
  const processResult = advisorProcessStepSchema.safeParse(raw);
  const reportResult = advisorReportStepSchema.safeParse(raw);

  const allFieldErrors: Record<string, string> = {};
  if (!generalResult.success) Object.assign(allFieldErrors, flattenZodToKeys(generalResult.error));
  if (!otherResult.success) Object.assign(allFieldErrors, flattenZodToKeys(otherResult.error));
  if (!processResult.success) Object.assign(allFieldErrors, flattenZodToKeys(processResult.error));
  if (!reportResult.success) Object.assign(allFieldErrors, flattenZodToKeys(reportResult.error));

  const pool = getPool();

  // --- Steps 1 & 2: Competency scoring ---
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
    [templateId],
  );

  const allowedScores = new Map<string, Set<number>>();
  const requiredQuestions = new Set<string>();
  let loMax = 0;
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

  let loScore = 0;
  let loCount = 0;

  // Validate required competency questions are answered.
  for (const questionId of requiredQuestions) {
    if (!raw[`lo-${questionId}`]) {
      allFieldErrors[`lo-${questionId}`] = localizeError("required", locale);
    }
  }

  // Validate competency scores against the allowed set.
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("lo-")) {
      const questionId = key.slice(3);
      const score = parseInt(String(value), 10);
      const configuredScores = allowedScores.get(questionId);
      const usesFallbackScale = !configuredScores || configuredScores.size === 0;
      if (!configuredScores || (usesFallbackScale ? score < 1 || score > 4 : !configuredScores.has(score))) {
        allFieldErrors[key] = localizeError("score_range", locale);
        continue;
      }
      if (usesFallbackScale) loMax = Math.max(loMax, 4);
      loScore += score;
      loCount++;
    }
  }

  if (Object.keys(allFieldErrors).length > 0) {
    return {
      success: false,
      error: message(
        "ข้อมูลที่จำเป็นยังไม่ครบ กรุณาตรวจสอบแต่ละขั้นก่อนส่งแบบประเมิน",
        "Required information is missing. Please review each step before submitting.",
      ),
      fieldErrors: localizeFieldErrors(allFieldErrors, locale),
    };
  }

  // --- Compute other / center / report scores ---
  let otherScore = 0;
  let otherCount = 0;
  for (let i = 0; i < ADVISOR_OTHER_COUNT; i++) {
    const score = parseInt(raw[`adv-other-${i}`] ?? "", 10);
    if (!Number.isNaN(score) && score >= 1 && score <= 4) {
      otherScore += score;
      otherCount++;
    }
  }

  let centerScore = 0;
  let centerCount = 0;
  for (let i = 0; i < ADVISOR_CENTER_COUNT; i++) {
    const score = parseInt(raw[`adv-center-${i}`] ?? "", 10);
    if (!Number.isNaN(score) && score >= 1 && score <= 4) {
      centerScore += score;
      centerCount++;
    }
  }
  for (let i = 0; i < ADVISOR_WORKPLACE_COUNT; i++) {
    const score = parseInt(raw[`adv-workplace-${i}`] ?? "", 10);
    if (!Number.isNaN(score) && score >= 1 && score <= 4) {
      centerScore += score;
      centerCount++;
    }
  }

  let reportScore = 0;
  let reportCount = 0;
  for (let i = 0; i < ADVISOR_REPORT_COUNT; i++) {
    const score = parseInt(raw[`adv-report-${i}`] ?? "", 10);
    if (!Number.isNaN(score) && score >= 1 && score <= 5) {
      reportScore += score;
      reportCount++;
    }
  }

  // Sanity-check the fixed-rating counts; step schemas already enforce this,
  // but the counts are needed for the score summary.
  if (otherCount !== ADVISOR_OTHER_COUNT) {
    return {
      success: false,
      error: message(
        "กรุณาประเมินข้ออื่น ๆ ให้ครบทั้ง 2 ข้อ",
        "Please complete both other evaluation items.",
      ),
    };
  }
  if (centerCount !== ADVISOR_CENTER_COUNT + ADVISOR_WORKPLACE_COUNT) {
    return {
      success: false,
      error: message(
        "กรุณาประเมินศูนย์สหกิจและสถานประกอบการให้ครบ",
        "Please complete the cooperative education center and workplace evaluation.",
      ),
    };
  }
  if (reportCount !== ADVISOR_REPORT_COUNT) {
    return {
      success: false,
      error: message(
        "กรุณาประเมินรายงานให้ครบทั้ง 5 ข้อ",
        "Please complete all five report evaluation items.",
      ),
    };
  }

  // --- Persist submission ---
  const payload = JSON.stringify(raw);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO advisor_submissions (
         program_id, template_id, payload_json,
         lo_score, lo_count, lo_max,
         other_score, other_count,
         center_score, center_count,
         report_score, report_count
       ) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        programId,
        templateId,
        payload,
        loScore,
        loCount,
        loMax,
        otherScore,
        otherCount,
        centerScore,
        centerCount,
        reportScore,
        reportCount,
      ],
    );
    if (UUID_PATTERN.test(draftToken)) {
      await client.query(
        `UPDATE advisor_drafts
         SET status = 'submitted', submitted_at = now(), updated_at = now()
         WHERE draft_token = $1 AND program_id = $2 AND template_id = $3 AND status = 'draft'`,
        [draftToken, programId, templateId],
      );
    }
    await client.query("COMMIT");
    return {
      success: true,
      id: result.rows[0].id,
      loScore,
      loCount,
      loMax,
      otherScore,
      otherCount,
      centerScore,
      centerCount,
      reportScore,
      reportCount,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Unable to submit advisor evaluation", error);
    return {
      success: false,
      error: message(
        "บันทึกแบบประเมินไม่สำเร็จ กรุณาลองอีกครั้ง",
        "The evaluation could not be saved. Please try again.",
      ),
    };
  } finally {
    client.release();
  }
}
