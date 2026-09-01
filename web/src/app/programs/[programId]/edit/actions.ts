"use server";

import { revalidatePath } from "next/cache";
import { getPool } from "@/lib/db";
import type { ScaleStatus } from "@/lib/types";

// Shape sent from the editor client. Mirrors TemplateDoc but with mutable ids
// (client-generated temp ids prefixed with "new-" for unsaved rows).
export type EditPayload = {
  templateId: string;
  programId: string;
  title: string | null;
  courseCodes: string[] | null;
  scaleStatus: ScaleStatus;
  sections: {
    id: string;
    titleTh: string;
    part: number;
    sequence: number;
    questions: {
      id: string;
      loCode: string | null;
      text: string;
      textEn: string | null;
      ploRefs: string[] | null;
      sequence: number;
      options: {
        id: string;
        score: number;
        labelTh: string;
        descriptionTh: string | null;
        sequence: number;
      }[];
    }[];
  }[];
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isExistingId(id: string): boolean {
  return UUID_RE.test(id);
}

// Build a serializable snapshot of the current template state for revision history.
async function snapshotCurrent(templateId: string): Promise<unknown> {
  const { rows } = await getPool().query(
    `SELECT
       t.id, t.title, t.course_codes, t.scale_status, t.source_layout,
       COALESCE(
         json_agg(
           json_build_object(
             'id', s.id, 'title_th', s.title_th, 'part', COALESCE(s.part,1), 'sequence', s.sequence,
             'questions', COALESCE((
               SELECT json_agg(
                 json_build_object(
                   'id', q.id, 'lo_code', q.lo_code, 'text', q.text, 'text_en', q.text_en,
                   'plo_refs', q.plo_refs, 'sequence', q.sequence,
                   'options', COALESCE((
                     SELECT json_agg(
                       json_build_object('id', o.id, 'score', o.score, 'label_th', o.label_th,
                                          'description_th', o.description_th, 'sequence', o.sequence)
                       ORDER BY o.score DESC, o.sequence
                     ) FROM assessment_options o WHERE o.question_id = q.id
                   ), '[]'::json)
                 ) ORDER BY q.sequence
               ) FROM evaluation_questions q WHERE q.section_id = s.id
             ), '[]'::json)
           ) ORDER BY s.part, s.sequence
         ), '[]'::json
       ) AS sections
     FROM evaluation_templates t
     LEFT JOIN assessment_sections s ON s.template_id = t.id
     WHERE t.id = $1
     GROUP BY t.id`,
    [templateId]
  );
  return rows[0] ?? null;
}

export async function saveTemplate(payload: EditPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isExistingId(payload.templateId) || !isExistingId(payload.programId)) {
    return { ok: false, error: "ไม่พบแบบประเมินหรือหลักสูตร กรุณารีเฟรชหน้าแล้วลองอีกครั้ง" };
  }
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Snapshot current state into template_revisions BEFORE mutating.
    const snapshot = await snapshotCurrent(payload.templateId);
    await client.query(
      `INSERT INTO template_revisions (template_id, kind, snapshot_json, note, created_at)
       VALUES ($1, 'edit', $2::jsonb, $3, now())`,
      [payload.templateId, JSON.stringify(snapshot), "แก้ไขแบบประเมินผ่านเว็บ"]
    );

    // 2. Update template-level fields.
    await client.query(
      `UPDATE evaluation_templates
       SET title = $2, course_codes = $3::jsonb, scale_status = $4, updated_at = now()
       WHERE id = $1`,
      [
        payload.templateId,
        payload.title,
        payload.courseCodes ? JSON.stringify(payload.courseCodes) : null,
        payload.scaleStatus,
      ]
    );

    // 3. Reconcile sections (insert/update/delete).
    const incomingSectionIds = payload.sections.filter((s) => isExistingId(s.id)).map((s) => s.id);
    if (incomingSectionIds.length > 0) {
      await client.query(
        `DELETE FROM assessment_sections WHERE template_id = $1 AND NOT (id = ANY($2::uuid[]))`,
        [payload.templateId, incomingSectionIds]
      );
    } else {
      await client.query(`DELETE FROM assessment_sections WHERE template_id = $1`, [payload.templateId]);
    }

    for (const section of payload.sections) {
      if (isExistingId(section.id)) {
        await client.query(
          `UPDATE assessment_sections
           SET title_th = $2, part = $3, sequence = $4, updated_at = now()
           WHERE id = $1`,
          [section.id, section.titleTh, section.part, section.sequence]
        );
      } else {
        const ins = await client.query(
          `INSERT INTO assessment_sections (template_id, title_th, part, sequence)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [payload.templateId, section.titleTh, section.part, section.sequence]
        );
        section.id = String(ins.rows[0].id);
      }

      // Reconcile questions within this section.
      const incomingQIds = section.questions.filter((q) => isExistingId(q.id)).map((q) => q.id);
      if (incomingQIds.length > 0) {
        await client.query(
          `DELETE FROM evaluation_questions WHERE section_id = $1 AND NOT (id = ANY($2::uuid[]))`,
          [section.id, incomingQIds]
        );
      } else {
        await client.query(`DELETE FROM evaluation_questions WHERE section_id = $1`, [section.id]);
      }

      for (const question of section.questions) {
        if (isExistingId(question.id)) {
          await client.query(
            `UPDATE evaluation_questions
             SET lo_code = $2, text = $3, text_en = $4, plo_refs = $5::jsonb, sequence = $6, updated_at = now()
             WHERE id = $1`,
            [
              question.id,
              question.loCode,
              question.text,
              question.textEn,
              question.ploRefs ? JSON.stringify(question.ploRefs) : null,
              question.sequence,
            ]
          );
        } else {
          const ins = await client.query(
            `INSERT INTO evaluation_questions (template_id, section_id, text, text_en, lo_code, plo_refs, sequence, question_type, is_required)
             VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, 'single_choice', true) RETURNING id`,
            [
              payload.templateId,
              section.id,
              question.text,
              question.textEn,
              question.loCode,
              question.ploRefs ? JSON.stringify(question.ploRefs) : null,
              question.sequence,
            ]
          );
          question.id = String(ins.rows[0].id);
        }

        // Reconcile options within this question.
        const incomingOptIds = question.options.filter((o) => isExistingId(o.id)).map((o) => o.id);
        if (incomingOptIds.length > 0) {
          await client.query(
            `DELETE FROM assessment_options WHERE question_id = $1 AND NOT (id = ANY($2::uuid[]))`,
            [question.id, incomingOptIds]
          );
        } else {
          await client.query(`DELETE FROM assessment_options WHERE question_id = $1`, [question.id]);
        }

        for (const option of question.options) {
          if (isExistingId(option.id)) {
            await client.query(
              `UPDATE assessment_options
               SET score = $2, label_th = $3, description_th = $4, sequence = $5, updated_at = now()
               WHERE id = $1`,
              [option.id, option.score, option.labelTh, option.descriptionTh, option.sequence]
            );
          } else {
            await client.query(
              `INSERT INTO assessment_options (question_id, score, label_th, description_th, sequence)
               VALUES ($1, $2, $3, $4, $5)`,
              [question.id, option.score, option.labelTh, option.descriptionTh, option.sequence]
            );
          }
        }
      }
    }

    await client.query("COMMIT");
    revalidatePath(`/programs/${payload.programId}`);
    revalidatePath(`/programs/${payload.programId}/edit`);
    revalidatePath(`/programs/${payload.programId}/history`);
    revalidatePath(`/schools/[school]`);
    revalidatePath(`/`);
    return { ok: true };
  } catch (e) {
    await client.query("ROLLBACK");
    return {
      ok: false,
      error: e instanceof Error ? e.message : "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง",
    };
  } finally {
    client.release();
  }
}

export async function restoreRevision(
  revisionId: string,
  programId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isExistingId(revisionId) || !isExistingId(programId)) {
    return { ok: false, error: "ข้อมูลไม่ถูกต้อง" };
  }

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT template_id::text AS template_id, snapshot_json
       FROM template_revisions WHERE id = $1`,
      [revisionId]
    );
    const rev = rows[0] as { template_id: string; snapshot_json: unknown } | undefined;
    if (!rev) {
      await client.query("ROLLBACK");
      return { ok: false, error: "ไม่พบเวอร์ชันที่เลือก" };
    }

    // Record a 'restore' revision capturing current state before overwriting.
    const currentSnapshot = await snapshotCurrent(rev.template_id);
    await client.query(
      `INSERT INTO template_revisions (template_id, kind, snapshot_json, note, created_at)
       VALUES ($1, 'restore', $2::jsonb, $3, now())`,
      [rev.template_id, JSON.stringify(currentSnapshot), "คืนค่าก่อนเขียนทับด้วยเวอร์ชันเก่า"]
    );

    const snap = rev.snapshot_json as {
      title?: string | null;
      course_codes?: string[] | null;
      scale_status?: ScaleStatus;
      sections?: {
        id: string; title_th: string; part: number; sequence: number;
        questions: {
          id: string; lo_code: string | null; text: string; text_en: string | null;
          plo_refs: string[] | null; sequence: number;
          options: { id: string; score: number; label_th: string; description_th: string | null; sequence: number }[];
        }[];
      }[];
    } | null;

    if (snap) {
      await client.query(
        `UPDATE evaluation_templates SET title = $2, course_codes = $3::jsonb, scale_status = $4, updated_at = now() WHERE id = $1`,
        [rev.template_id, snap.title ?? null, snap.course_codes ? JSON.stringify(snap.course_codes) : null, snap.scale_status ?? "needs_descriptions"]
      );
      // Wipe and re-insert sections/questions/options from snapshot.
      await client.query(`DELETE FROM assessment_sections WHERE template_id = $1`, [rev.template_id]);
      for (const section of snap.sections ?? []) {
        const secIns = await client.query(
          `INSERT INTO assessment_sections (id, template_id, title_th, part, sequence) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET title_th = EXCLUDED.title_th, part = EXCLUDED.part, sequence = EXCLUDED.sequence`,
          [section.id, rev.template_id, section.title_th, section.part, section.sequence]
        );
        void secIns;
        for (const q of section.questions ?? []) {
          await client.query(
            `INSERT INTO evaluation_questions (id, template_id, section_id, text, text_en, lo_code, plo_refs, sequence, question_type, is_required)
             VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, 'single_choice', true)
             ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, text_en = EXCLUDED.text_en, lo_code = EXCLUDED.lo_code, plo_refs = EXCLUDED.plo_refs, sequence = EXCLUDED.sequence, section_id = EXCLUDED.section_id`,
            [q.id, rev.template_id, section.id, q.text, q.text_en, q.lo_code, q.plo_refs ? JSON.stringify(q.plo_refs) : null, q.sequence]
          );
          for (const o of q.options ?? []) {
            await client.query(
              `INSERT INTO assessment_options (id, question_id, score, label_th, description_th, sequence)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score, label_th = EXCLUDED.label_th, description_th = EXCLUDED.description_th, sequence = EXCLUDED.sequence`,
              [o.id, q.id, o.score, o.label_th, o.description_th, o.sequence]
            );
          }
        }
      }
    }

    await client.query("COMMIT");
    revalidatePath(`/programs/${programId}`);
    revalidatePath(`/programs/${programId}/edit`);
    revalidatePath(`/programs/${programId}/history`);
    revalidatePath(`/`);
    return { ok: true };
  } catch (e) {
    await client.query("ROLLBACK");
    return { ok: false, error: e instanceof Error ? e.message : "คืนค่าไม่สำเร็จ" };
  } finally {
    client.release();
  }
}

// useActionState-compatible wrapper: parses the JSON payload from a hidden form field.
export async function saveTemplateAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const raw = String(formData.get("payload") ?? "");
  if (!raw) return { ok: false, error: "ไม่พบข้อมูลที่จะบันทึก" };
  let payload: EditPayload;
  try {
    payload = JSON.parse(raw) as EditPayload;
  } catch {
    return { ok: false, error: "ข้อมูลไม่ถูกต้อง" };
  }
  return saveTemplate(payload);
}