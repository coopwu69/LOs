// Clean-up pass: for questions that ALREADY have options in the table but
// whose text still contains inline options (`|`, `☑`) or leading `: `.
// These were skipped by migrate_all.mjs because they had options, but their
// text was never cleaned.
//
// We only clean the text — we do NOT touch the existing options rows.
// Uses the same parse functions as migrate_all.mjs to extract the clean
// question text, then updates only the text column.

import { Pool } from "pg";
import { readFileSync } from "fs";
const env = readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL="([^"]+)"/);
process.env.DATABASE_URL = match[1];
const DRY_RUN = process.argv.includes("--dry-run");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

function cleanQuestionText(raw) {
  let t = raw.trim();
  t = t.replace(/^:\s+/, "").trim();
  t = t.replace(/\s*ผลการเรียนรู้ที่คาดหวัง\s*$/, "").trim();
  return t;
}

// Extract clean question text from any of the inline patterns.
// Returns the clean text, or null if we can't confidently extract it.
function extractCleanText(text) {
  // Pattern A: has ☑
  if (text.includes("☑")) {
    const idx = text.indexOf("|");
    if (idx === -1) return null;
    return cleanQuestionText(text.slice(0, idx));
  }
  // Pattern B: has "N (label):" after |
  if (text.includes("|")) {
    const idx = text.indexOf("|");
    const before = text.slice(0, idx);
    const after = text.slice(idx + 1).trim();
    // If after-pipe has "N (label):" pattern, it's inline options
    if (/\d\s*\([^)]+\)\s*:/.test(after)) {
      return cleanQuestionText(before);
    }
    // If after-pipe is "ผลการประเมิน (1)" or similar placeholder
    if (/ผลการประเมิน|ผลการเรียนรู้/.test(after)) {
      return cleanQuestionText(before);
    }
    // If after-pipe is empty or just more pipes (PA-style "|  |  |  |")
    if (/^\s*\|*\s*$/.test(after) || /^\s*$/.test(after)) {
      return cleanQuestionText(before);
    }
    // If text starts with | (MARSCI-style), take after first |
    if (text.startsWith("|")) {
      return cleanQuestionText(text.slice(1));
    }
    // Otherwise, `|` might be part of the question — leave as is, just strip leading colon
    return cleanQuestionText(text);
  }
  // No pipe — just clean leading colon
  return cleanQuestionText(text);
}

async function run() {
  const client = await pool.connect();
  try {
    // Find questions that still have inline patterns in text
    const { rows: questions } = await client.query(`
      SELECT q.id, q.lo_code, q.text, p.code AS program_code
      FROM evaluation_questions q
      JOIN evaluation_templates t ON t.id = q.template_id
      JOIN programs p ON p.id = t.program_id
      WHERE q.text LIKE '%|%'
         OR q.text LIKE '%☑%'
         OR q.text LIKE ': %'
         OR q.text LIKE ':  %'
      ORDER BY p.code, q.sequence
    `);
    console.log(`Found ${questions.length} questions with text still needing cleanup.`);

    const planned = [];
    const skipped = [];
    for (const q of questions) {
      const clean = extractCleanText(q.text);
      if (!clean || clean === q.text) {
        skipped.push(q);
        continue;
      }
      planned.push({ ...q, cleanText: clean });
    }

    if (skipped.length > 0) {
      console.log(`Skipped ${skipped.length} (no change needed or couldn't extract):`);
      for (const s of skipped.slice(0, 5)) {
        console.log(`  [${s.program_code} ${s.lo_code}] ${s.text.slice(0, 120)}`);
      }
      if (skipped.length > 5) console.log(`  ... and ${skipped.length - 5} more`);
    }

    console.log(`\nWill update ${planned.length} questions.`);
    console.log("\n=== PREVIEW (first 10) ===");
    for (const p of planned.slice(0, 10)) {
      console.log(`  [${p.program_code} ${p.lo_code}]`);
      console.log(`    BEFORE: ${p.text.slice(0, 150)}${p.text.length > 150 ? "..." : ""}`);
      console.log(`    AFTER:  ${p.cleanText.slice(0, 150)}${p.cleanText.length > 150 ? "..." : ""}`);
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
    console.log(`  Backup rows added: ${planned.length}`);
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
