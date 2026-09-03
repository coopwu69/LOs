// Clean CUL and LOG question text.
// These two programs already have proper options in assessment_options, but
// their question.text still has inline rubric text mixed in:
//   CUL: "<question fragment> ยอดเยี่ยม (5) - <desc> ดีมาก (4) - <desc> ..."
//   LOG: "<question> | ดีเยี่ยม (5 คะแนน) <desc> ดีมาก (4 คะแนน) <desc> ..."
//
// We extract the real question by cutting at the first rubric marker:
//   CUL: first occurrence of "ยอดเยี่ยม (5)" or "ดีมาก (4)" or "ดี (3)"
//   LOG: first occurrence of "ดีเยี่ยม" or "ดีมาก" (after `|`)
//
// The question may be truncated mid-sentence (the original parser cut it wrong),
// but that's still better than having the full rubric inline. The text can be
// fixed later in the editor.

import { Pool } from "pg";
import { readFileSync } from "fs";
const env = readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL="([^"]+)"/);
process.env.DATABASE_URL = match[1];
const DRY_RUN = process.argv.includes("--dry-run");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Markers that signal the start of inline rubric text (in order of specificity).
// We cut the question text at the first marker found.
const RUBRIC_MARKERS = [
  "ยอดเยี่ยม (5)",
  "ดีเยี่ยม (5 คะแนน)",
  "ดีเยี่ยม",
  "ดีมาก (4)",
  "ดีมาก (4 คะแนน)",
  "ดี (3)",
  "ดี (3 คะแนน)",
  "พอใช้ (2)",
  "พอใช้ (2 คะแนน)",
  "ต้องปรับปรุง (1)",
  "ควรปรับปรุง (1)",
  "ต้องปรับปรุง (1 คะแนน)",
];

function extractCleanText(text) {
  let t = text.trim();
  // Strip leading ": "
  t = t.replace(/^:\s+/, "").trim();
  // If there's a `|`, take only the part before it (LOG uses | as separator)
  const pipeIdx = t.indexOf("|");
  if (pipeIdx !== -1) {
    t = t.slice(0, pipeIdx).trim();
  }
  // Find the earliest rubric marker
  let cutIdx = -1;
  for (const marker of RUBRIC_MARKERS) {
    const idx = t.indexOf(marker);
    if (idx !== -1 && (cutIdx === -1 || idx < cutIdx)) {
      cutIdx = idx;
    }
  }
  if (cutIdx > 0) {
    t = t.slice(0, cutIdx).trim();
  }
  // Strip trailing whitespace and incomplete words
  t = t.replace(/\s+$/, "").trim();
  return t;
}

async function run() {
  const client = await pool.connect();
  try {
    const { rows: questions } = await client.query(`
      SELECT q.id, q.lo_code, q.text, p.code AS program_code
      FROM evaluation_questions q
      JOIN evaluation_templates t ON t.id = q.template_id
      JOIN programs p ON p.id = t.program_id
      WHERE p.code IN ('CUL','LOG')
      ORDER BY p.code, q.sequence
    `);
    console.log(`Found ${questions.length} CUL+LOG questions.`);

    const planned = [];
    for (const q of questions) {
      const clean = extractCleanText(q.text);
      if (clean && clean !== q.text && clean.length > 5) {
        planned.push({ ...q, cleanText: clean });
      }
    }

    console.log(`Will update ${planned.length} questions.\n=== PREVIEW ===`);
    for (const p of planned) {
      console.log(`\n[${p.program_code} ${p.lo_code ?? "-"}]`);
      console.log(`  BEFORE: ${p.text.slice(0, 200)}${p.text.length > 200 ? "..." : ""}`);
      console.log(`  AFTER:  ${p.cleanText}`);
    }

    if (DRY_RUN) {
      console.log("\n[DRY RUN] No changes applied.");
      return;
    }

    await client.query("BEGIN");
    await client.query(`
      CREATE TABLE IF NOT EXISTS question_text_backup (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id uuid NOT NULL,
        original_text text NOT NULL,
        backed_up_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    let updated = 0;
    for (const p of planned) {
      await client.query(
        `INSERT INTO question_text_backup (question_id, original_text)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM question_text_backup b
           WHERE b.question_id = $1 AND b.original_text = $2
         )`,
        [p.id, p.text],
      );
      await client.query(`UPDATE evaluation_questions SET text = $1, updated_at = now() WHERE id = $2`, [
        p.cleanText,
        p.id,
      ]);
      updated++;
    }
    await client.query("COMMIT");
    console.log(`\n=== APPLIED ===`);
    console.log(`  Questions updated: ${updated}`);
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("\nERROR:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}
run();
