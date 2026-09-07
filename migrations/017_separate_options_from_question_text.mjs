// Split rubric options back out of the question text.
//
// The first import of the PDF-based forms read the two-column assessment
// tables as plain text, so the "ผลการประเมิน" column ended up interleaved into
// the "ผลลัพธ์การเรียนรู้ที่คาดหวัง" column: the question text carried the whole
// rubric (ระดับดีเยี่ยม (...) ระดับดีมาก (...) ...) while the options themselves
// were bare labels with no description — and for the "N (ยอดเยี่ยม):" layouts
// the top level was swallowed entirely, leaving 4 options on a 5-point scale.
//
// tools/rebuild_sources.py re-reads those PDFs with pdfplumber's table
// extraction, which keeps the columns apart, and writes one JSON per program.
// This migration replaces the questions/options of those programmes with the
// re-extracted content, and scrubs two smaller artifacts (a trailing page
// number, a table header) out of every other programme's option descriptions.
//
//   node migrations/017_separate_options_from_question_text.mjs --dry-run
//   node migrations/017_separate_options_from_question_text.mjs

import { readFileSync, readdirSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

// pg lives in web/node_modules; resolve it from there rather than from here.
const { Pool } = createRequire(new URL("../web/package.json", import.meta.url))("pg");

// data/rebuilt holds the checked-in output of `python tools/rebuild_sources.py`;
// point REBUILT_DIR elsewhere to apply a fresh extraction instead.
const REBUILT_DIR = process.env.REBUILT_DIR
  ?? fileURLToPath(new URL("../data/rebuilt/", import.meta.url));

const env = readFileSync(fileURLToPath(new URL("../web/.env.local", import.meta.url)), "utf8");
// Accepts both DATABASE_URL="..." (quoted) and DATABASE_URL=... (bare, as
// exported by `vercel env pull` / the Neon dashboard).
process.env.DATABASE_URL = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)[1];
const DRY_RUN = process.argv.includes("--dry-run");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const SECTION_TITLE = {
  knowledge: "ด้านความรู้ (Knowledge)",
  skills: "ด้านทักษะ (Skills)",
  ethics: "ด้านจริยธรรม (Ethics)",
  character: "ด้านลักษณะบุคคล (Character)",
};
const SECTION_ORDER = ["knowledge", "skills", "ethics", "character"];
const PART = { knowledge: 1, skills: 1, ethics: 2, character: 2 };

// Page furniture that leaked into option descriptions of the other programmes.
const HEADER = /\s*(ผลลัพธ์การเ[รยี\s]*นรู้[ทคี่\s]*าดหวั?ง?|ผลการเรียนรู้ที่คาดหวัง|ผลการประเมนิ|ผลการประเมิน)\s*/g;
const PAGE_NUMBER = /\s*\(\s*\d\s*\)\s*$/;

function scrub(text) {
  if (!text) return text;
  const out = text.replace(HEADER, " ").replace(PAGE_NUMBER, "").replace(/\s+/g, " ").trim();
  return out.replace(/^[|\s]+|[|\s]+$/g, "").trim() || null;
}

const client = await pool.connect();
try {
  await client.query("BEGIN");

  // ── 1. programmes rebuilt from their source document ──────────────────────
  const files = readdirSync(REBUILT_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const doc = JSON.parse(readFileSync(path.join(REBUILT_DIR, file), "utf8"));
    const { rows: tpl } = await client.query(
      `SELECT t.id::text AS id, p.id::text AS program_id
       FROM evaluation_templates t JOIN programs p ON p.id = t.program_id
       WHERE p.code = $1 ORDER BY t.created_at DESC LIMIT 1`,
      [doc.code]
    );
    if (!tpl[0]) throw new Error(`no template for ${doc.code}`);
    const templateId = tpl[0].id;

    const domains = SECTION_ORDER.filter((d) => doc.questions.some((q) => q.domain === d));
    const before = await client.query(
      `SELECT COUNT(*)::int AS q,
              (SELECT COUNT(*)::int FROM assessment_options o
               JOIN evaluation_questions q2 ON q2.id = o.question_id WHERE q2.template_id = $1) AS o
       FROM evaluation_questions WHERE template_id = $1`,
      [templateId]
    );

    // Questions cascade-delete their options; drafts key answers by position,
    // not by id, so replacing the rows keeps existing drafts addressable.
    await client.query(`DELETE FROM evaluation_questions WHERE template_id = $1`, [templateId]);
    await client.query(`DELETE FROM assessment_sections WHERE template_id = $1`, [templateId]);

    const sectionId = {};
    for (const [i, domain] of domains.entries()) {
      const { rows } = await client.query(
        `INSERT INTO assessment_sections (template_id, title_th, domain_type, part, sequence)
         VALUES ($1, $2, $3::domain_type, $4, $5) RETURNING id::text AS id`,
        [templateId, SECTION_TITLE[domain], domain, PART[domain], i + 1]
      );
      sectionId[domain] = rows[0].id;
    }

    const seqInSection = {};
    for (const q of doc.questions) {
      seqInSection[q.domain] = (seqInSection[q.domain] ?? 0) + 1;
      const { rows } = await client.query(
        `INSERT INTO evaluation_questions
           (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
         VALUES ($1, $2, $3, $4, $5, 'single_choice'::question_type, true, $6)
         RETURNING id::text AS id`,
        [templateId, sectionId[q.domain], q.text_th, q.text_en, q.lo_code, seqInSection[q.domain]]
      );
      for (const [i, o] of q.options.entries()) {
        await client.query(
          `INSERT INTO assessment_options (question_id, label_th, description_th, score, sequence)
           VALUES ($1, $2, $3, $4, $5)`,
          [rows[0].id, o.label_th, o.description_th, o.score, i + 1]
        );
      }
    }
    const optionCount = doc.questions.reduce((n, q) => n + q.options.length, 0);
    console.log(
      `${doc.code}: questions ${before.rows[0].q} -> ${doc.questions.length}, ` +
      `options ${before.rows[0].o} -> ${optionCount}`
    );
  }

  // ── 2. option-description scrub for every other programme ─────────────────
  const codes = files.map((f) => f.replace(/\.json$/, ""));
  const { rows: options } = await client.query(
    `SELECT o.id::text AS id, p.code, o.description_th
     FROM assessment_options o
     JOIN evaluation_questions q ON q.id = o.question_id
     JOIN evaluation_templates t ON t.id = q.template_id
     JOIN programs p ON p.id = t.program_id
     WHERE NOT (p.code = ANY($1)) AND o.description_th IS NOT NULL`,
    [codes]
  );
  let scrubbed = 0;
  for (const o of options) {
    const next = scrub(o.description_th);
    if (next !== o.description_th) {
      await client.query(
        `UPDATE assessment_options SET description_th = $2, updated_at = now() WHERE id = $1`,
        [o.id, next]
      );
      scrubbed++;
    }
  }
  console.log(`scrubbed ${scrubbed} option descriptions in other programmes`);

  if (DRY_RUN) {
    await client.query("ROLLBACK");
    console.log("\nDRY RUN - rolled back");
  } else {
    await client.query("COMMIT");
    console.log("\ncommitted");
  }
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();
  await pool.end();
}
