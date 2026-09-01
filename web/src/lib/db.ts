import { Pool } from "pg";
import type {
  ProgramRow,
  TemplateDoc,
  SectionRow,
  QuestionRow,
  OptionRow,
  PloRow,
  RevisionRow,
  ScaleStatus,
  Domain,
} from "./types";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Configure it in web/.env.local (local dev) or the Vercel project env (production)."
  );
}

let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

// ---------- Public row shapes (kept for callers that still import them) ----------
export type Program = ProgramRow & { name_en?: string | null };

export function getProgramRouteKey(program: Pick<ProgramRow, "code" | "slug">): string {
  return (program.slug?.trim() || program.code.trim()).toLowerCase();
}

export type Template = {
  id: string;
  program_id: string;
  name: string | null;
  title: string | null;
  title_en: string | null;
  status: string;
  status_enum: string;
  version_label: string | null;
  source_document_id: string | null;
  extraction_confidence: string | null;
  needs_review: boolean;
};

export type Section = {
  id: string;
  template_id: string;
  title_th: string;
  title_en: string | null;
  domain_type: string;
  sequence: number;
};

export type Question = {
  id: string;
  template_id: string;
  section_id: string | null;
  text: string;
  text_en: string | null;
  lo_code: string | null;
  question_type: string;
  is_required: boolean;
  sequence: number;
};

export type Option = {
  id: string;
  question_id: string;
  label_th: string;
  label_en: string | null;
  description_th: string | null;
  description_en: string | null;
  score: number;
  sequence: number;
};

export type SchoolWithProgress = {
  name: string;
  program_count: number;
  submitted_count: number;
  pending_count: number;
  standard_4_count: number;
  legacy_5_count: number;
  needs_descriptions_count: number;
  programs: ProgramRow[];
};

// ---------- Helpers ----------

function asDomain(value: unknown): Domain {
  const v = String(value ?? "general") as Domain;
  return ["knowledge", "skills", "ethics", "character", "general"].includes(v)
    ? v
    : "general";
}

function asScaleStatus(value: unknown): ScaleStatus {
  const v = String(value ?? "needs_descriptions") as ScaleStatus;
  return ["standard_4", "legacy_5", "needs_descriptions"].includes(v)
    ? v
    : "needs_descriptions";
}

function asStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) return value.map((v) => String(v));
  return null;
}

// ---------- Template doc (single round-trip via json_agg) ----------

export async function getTemplateDoc(programRef: string): Promise<TemplateDoc | null> {
  const program = await getProgram(programRef);
  if (!program) return null;
  const templateResult = await getPool().query(
    `SELECT id::text, COALESCE(title, name) AS title
     FROM evaluation_templates
     WHERE program_id = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [program.id]
  );
  const template = templateResult.rows[0] as { id: string; title: string | null } | undefined;
  if (!template) return null;

  const [sectionResult, questionResult, optionResult] = await Promise.all([
    getPool().query(`SELECT id::text, title_th, domain_type::text, sequence FROM assessment_sections WHERE template_id = $1 ORDER BY sequence`, [template.id]),
    getPool().query(`SELECT id::text, section_id::text, lo_code, text, text_en, sequence FROM evaluation_questions WHERE template_id = $1 ORDER BY sequence`, [template.id]),
    getPool().query(`SELECT o.id::text, o.question_id::text, o.score, o.label_th, o.description_th, o.sequence FROM assessment_options o JOIN evaluation_questions q ON q.id = o.question_id WHERE q.template_id = $1 ORDER BY o.question_id, o.sequence`, [template.id]),
  ]);
  const optionsByQuestion = new Map<string, OptionRow[]>();
  for (const row of optionResult.rows) {
    const questionId = String(row.question_id);
    optionsByQuestion.set(questionId, [...(optionsByQuestion.get(questionId) ?? []), {
      id: String(row.id), score: Number(row.score), label_th: String(row.label_th), description_th: row.description_th ? String(row.description_th) : null, sequence: Number(row.sequence),
    }]);
  }
  const questionsBySection = new Map<string, QuestionRow[]>();
  for (const row of questionResult.rows) {
    const sectionId = String(row.section_id ?? "");
    questionsBySection.set(sectionId, [...(questionsBySection.get(sectionId) ?? []), {
      id: String(row.id), lo_code: row.lo_code ? String(row.lo_code) : null, text: String(row.text), text_en: row.text_en ? String(row.text_en) : null, plo_refs: null, sequence: Number(row.sequence), options: optionsByQuestion.get(String(row.id)) ?? [],
    }]);
  }
  const sections: SectionRow[] = sectionResult.rows.map((row) => {
    const domain = asDomain(row.domain_type);
    return { id: String(row.id), domain_type: domain, title_th: String(row.title_th), part: ["knowledge", "skills"].includes(domain) ? 1 : 2, sequence: Number(row.sequence), questions: questionsBySection.get(String(row.id)) ?? [] };
  });
  const options = [...optionsByQuestion.values()].flat();
  const maxScore = options.reduce((max, option) => Math.max(max, option.score), 0);
  const hasMissingDescriptions = options.length === 0 || options.some((option) => !option.description_th?.trim());

  return {
    id: template.id,
    program,
    title: template.title,
    course_codes: null,
    scale_status: hasMissingDescriptions ? "needs_descriptions" : maxScore >= 5 ? "legacy_5" : "standard_4",
    source_layout: null,
    plos: [],
    sections,
  };
}

export async function getExtendedTemplateDoc(programRef: string): Promise<TemplateDoc | null> {
  const resolvedProgram = await getProgram(programRef);
  if (!resolvedProgram) return null;
  const { rows } = await getPool().query<{
    id: string;
    title: string | null;
    course_codes: string[] | null;
    scale_status: ScaleStatus;
    source_layout: string | null;
    program: ProgramRow;
    plos: PloRow[];
    sections: SectionRow[];
  }>(
    `
    WITH program AS (
      SELECT
        p.id, p.code, p.name_th, p.school, p.slug,
        COALESCE(p.revision_label, NULL) AS revision_label,
        COALESCE(p.form_status, 'pending')::text AS form_status
      FROM programs p
      WHERE p.id = $1
    ),
    template AS (
      SELECT t.*
      FROM evaluation_templates t
      WHERE t.program_id = $1
      ORDER BY t.created_at DESC
      LIMIT 1
    ),
    plos AS (
      SELECT
        COALESCE(
          json_agg(
            json_build_object(
              'id', pp.id::text,
              'code', pp.code,
              'domain_type', pp.domain_type,
              'text', pp.text,
              'sequence', pp.sequence
            ) ORDER BY pp.sequence
          ) FILTER (WHERE pp.id IS NOT NULL),
          '[]'::json
        ) AS arr
      FROM program_plos pp
      WHERE pp.program_id = $1
    ),
    sections AS (
      SELECT
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id::text,
              'domain_type', s.domain_type,
              'title_th', s.title_th,
              'part', COALESCE(s.part, 1),
              'sequence', s.sequence,
              'questions', COALESCE((
                SELECT json_agg(
                  json_build_object(
                    'id', q.id::text,
                    'lo_code', q.lo_code,
                    'text', q.text,
                    'text_en', q.text_en,
                    'plo_refs', q.plo_refs,
                    'sequence', q.sequence,
                    'options', COALESCE((
                      SELECT json_agg(
                        json_build_object(
                          'id', o.id::text,
                          'score', o.score,
                          'label_th', o.label_th,
                          'description_th', o.description_th,
                          'sequence', o.sequence
                        ) ORDER BY o.score DESC, o.sequence
                      ) FILTER (WHERE o.id IS NOT NULL)
                      FROM assessment_options o
                      WHERE o.question_id = q.id
                    ), '[]'::json)
                  ) ORDER BY q.sequence
                ) FILTER (WHERE q.id IS NOT NULL)
                FROM evaluation_questions q
                WHERE q.section_id = s.id
              ), '[]'::json)
            ) ORDER BY s.part, s.sequence
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'::json
        ) AS arr
      FROM assessment_sections s
      JOIN template t ON t.id = s.template_id
    )
    SELECT
      t.id::text AS id,
      t.title,
      t.course_codes,
      ascale.status AS scale_status,
      t.source_layout,
      json_build_object(
        'id', p.id::text,
        'code', p.code,
        'name_th', p.name_th,
        'school', p.school,
        'slug', p.slug,
        'revision_label', p.revision_label,
        'form_status', p.form_status
      ) AS program,
      COALESCE(pl.arr, '[]'::json) AS plos,
      COALESCE(se.arr, '[]'::json) AS sections
    FROM template t
    JOIN program p ON true
    CROSS JOIN LATERAL (
      SELECT COALESCE(t.scale_status, 'needs_descriptions')::text AS status
    ) AS ascale
    CROSS JOIN plos pl
    CROSS JOIN sections se
    `,
    [resolvedProgram.id]
  );

  if (!rows[0]) return null;
  const r = rows[0];

  // Normalize enum-ish fields coming back as strings from json_build_object.
  const program: ProgramRow = {
    ...r.program,
    form_status: r.program.form_status === "submitted" ? "submitted" : "pending",
  };

  const plos: PloRow[] = (r.plos ?? []).map((p) => ({
    ...p,
    domain_type: asDomain(p.domain_type),
  }));

  const sections: SectionRow[] = (r.sections ?? []).map((s) => ({
    ...s,
    domain_type: asDomain(s.domain_type),
    questions: (s.questions ?? []).map((q) => ({
      ...q,
      plo_refs: asStringArray(q.plo_refs),
      options: (q.options ?? []).map((o) => ({ ...o }) as OptionRow),
    })) as QuestionRow[],
  }));

  return {
    id: r.id,
    program,
    title: r.title,
    course_codes: asStringArray(r.course_codes),
    scale_status: asScaleStatus(r.scale_status),
    source_layout: r.source_layout,
    plos,
    sections,
  };
}

// ---------- Schools with progress ----------

export async function getSchoolsWithProgress(): Promise<SchoolWithProgress[]> {
  const { rows } = await getPool().query<{
    name: string;
    program_count: number;
    submitted_count: number;
    pending_count: number;
    standard_4_count: number;
    legacy_5_count: number;
    needs_descriptions_count: number;
    programs: ProgramRow[];
  }>(`
    SELECT
      p.school AS name,
      COUNT(*)::int AS program_count,
      COUNT(*) FILTER (WHERE t.id IS NOT NULL)::int AS submitted_count,
      COUNT(*) FILTER (WHERE t.id IS NULL)::int AS pending_count,
      COUNT(*) FILTER (WHERE t.max_score = 4)::int AS standard_4_count,
      COUNT(*) FILTER (WHERE t.max_score >= 5)::int AS legacy_5_count,
      COUNT(*) FILTER (WHERE t.id IS NOT NULL AND NOT t.descriptions_complete)::int AS needs_descriptions_count,
      json_agg(
        json_build_object(
          'id', p.id::text,
          'code', p.code,
          'name_th', p.name_th,
          'name_en', p.name_en,
          'school', p.school,
          'slug', p.slug,
          'revision_label', NULL,
          'form_status', CASE WHEN t.id IS NULL THEN 'pending' ELSE 'submitted' END
        ) ORDER BY p.code
      ) AS programs
    FROM programs p
    LEFT JOIN LATERAL (
      SELECT
        et.id,
        (SELECT MAX(o.score)
         FROM evaluation_questions q
         JOIN assessment_options o ON o.question_id = q.id
         WHERE q.template_id = et.id) AS max_score,
        COALESCE((SELECT BOOL_AND(NULLIF(BTRIM(o.description_th), '') IS NOT NULL)
                  FROM evaluation_questions q
                  JOIN assessment_options o ON o.question_id = q.id
                  WHERE q.template_id = et.id), false) AS descriptions_complete
      FROM evaluation_templates et
      WHERE et.program_id = p.id
      ORDER BY et.created_at DESC
      LIMIT 1
    ) t ON true
    WHERE p.school IS NOT NULL AND p.is_active = true
    GROUP BY p.school
    ORDER BY p.school
  `);
  return rows.map((r) => ({
    ...r,
    programs: (r.programs ?? []).map((p) => ({
      ...p,
      form_status: p.form_status === "submitted" ? "submitted" : "pending",
    })),
  }));
}

export async function getProgram(programRef: string): Promise<ProgramRow | null> {
  const { rows } = await getPool().query(
    `SELECT
       id::text AS id, code, name_th, name_en, school, slug,
       NULL::text AS revision_label, 'pending'::text AS form_status
     FROM programs
     WHERE id::text = $1 OR LOWER(code) = LOWER($1) OR LOWER(slug) = LOWER($1)
     LIMIT 1`,
    [programRef]
  );
  const r = rows[0] as ProgramRow | undefined;
  if (!r) return null;
  return { ...r, form_status: r.form_status === "submitted" ? "submitted" : "pending" };
}

export async function getProgramsBySchool(schoolName: string): Promise<ProgramRow[]> {
  const { rows } = await getPool().query(
    `SELECT
       p.id::text AS id, p.code, p.name_th, p.name_en, p.school, p.slug,
       NULL::text AS revision_label,
       CASE WHEN t.id IS NULL THEN 'pending' ELSE 'submitted' END AS form_status
     FROM programs p
     LEFT JOIN LATERAL (
       SELECT et.id
       FROM evaluation_templates et
       WHERE et.program_id = p.id
       ORDER BY et.created_at DESC
       LIMIT 1
     ) t ON true
     WHERE p.school = $1 AND p.is_active = true
     ORDER BY p.code`,
    [schoolName]
  );
  return rows.map((r) => ({
    ...r,
    form_status: r.form_status === "submitted" ? "submitted" : "pending",
  })) as ProgramRow[];
}

export async function getTemplatesByProgram(programId: string): Promise<Template[]> {
  const { rows } = await getPool().query(
    `SELECT * FROM evaluation_templates WHERE program_id = $1 ORDER BY created_at DESC`,
    [programId]
  );
  return rows as Template[];
}

export async function getSectionsByTemplate(templateId: string): Promise<Section[]> {
  const { rows } = await getPool().query(
    `SELECT * FROM assessment_sections WHERE template_id = $1 ORDER BY sequence`,
    [templateId]
  );
  return rows as Section[];
}

export async function getQuestionsByTemplate(templateId: string): Promise<Question[]> {
  const { rows } = await getPool().query(
    `SELECT * FROM evaluation_questions WHERE template_id = $1 ORDER BY sequence`,
    [templateId]
  );
  return rows as Question[];
}

export async function getOptionsByQuestion(questionIds: string[]): Promise<Option[]> {
  if (questionIds.length === 0) return [];
  const { rows } = await getPool().query(
    `SELECT * FROM assessment_options WHERE question_id = ANY($1) ORDER BY question_id, sequence`,
    [questionIds]
  );
  return rows as Option[];
}

// ---------- Revisions ----------

export async function hasEditorSchema(): Promise<boolean> {
  const { rows } = await getPool().query<{ ready: boolean }>(`
    SELECT
      to_regclass('public.template_revisions') IS NOT NULL
      AND (SELECT COUNT(*) = 3 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evaluation_templates' AND column_name IN ('course_codes', 'scale_status', 'source_layout'))
      AND (SELECT COUNT(*) = 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessment_sections' AND column_name = 'part')
      AND (SELECT COUNT(*) = 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'evaluation_questions' AND column_name = 'plo_refs') AS ready
  `);
  return Boolean(rows[0]?.ready);
}

export async function getRevisions(templateId: string): Promise<RevisionRow[]> {
  const { rows } = await getPool().query(
    `SELECT id::text AS id, kind, note, to_char(created_at AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD"T"HH24:MI:SS') AS created_at
     FROM template_revisions
     WHERE template_id = $1
     ORDER BY created_at DESC`,
    [templateId]
  );
  return rows as RevisionRow[];
}

export async function getRevision(
  revisionId: string
): Promise<(RevisionRow & { template_id: string; snapshot_json: unknown }) | null> {
  const { rows } = await getPool().query(
    `SELECT id::text AS id, template_id::text AS template_id, kind, note,
            snapshot_json,
            to_char(created_at AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD"T"HH24:MI:SS') AS created_at
     FROM template_revisions WHERE id = $1`,
    [revisionId]
  );
  const r = rows[0] as
    | (RevisionRow & { template_id: string; snapshot_json: unknown })
    | undefined;
  return r ?? null;
}
