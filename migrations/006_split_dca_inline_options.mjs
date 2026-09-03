// DCA migration: split inline options out of question.text into assessment_options.
//
// Pattern in DB (all 7 DCA questions):
//   ": <question> | ☑ ระดับดีมาก (desc) ☑ ระดับดี (desc) ☑ ระดับพอใช้ (desc) ☑ ระดับควรปรับปรุง (desc)"
//
// Goal:
//   - question.text → "<question>"  (strip leading ": ", strip " | ☑ ...")
//   - assessment_options → 4 rows per question (score 4/3/2/1, label + description)
//
// Safety:
//   - Creates question_text_backup table first (id, question_id, original_text, backed_up_at)
//   - Runs everything inside a single transaction; rolls back on any error
//   - Dry-run mode prints the planned changes without touching the DB

import { Pool } from "pg";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL="([^"]+)"/);
process.env.DATABASE_URL = match[1];

const DRY_RUN = process.argv.includes("--dry-run");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Score mapping for the 4 standard levels used in DCA source documents.
const SCORE_BY_LABEL = {
  "ระดับดีมาก": 4,
  "ระดับดี": 3,
  "ระดับพอใช้": 2,
  "ระดับควรปรับปรุง": 1,
};

// Parse one DCA question text into { cleanText, options[] }.
// Returns null if the text doesn't match the expected pattern (so we skip it
// instead of corrupting data).
function parseDcaQuestionText(rawText) {
  const pipeIdx = rawText.indexOf("|");
  if (pipeIdx === -1) return null;
  if (!rawText.includes("☑")) return null;

  // Question portion = everything before the first "|", strip leading ": " / whitespace.
  let questionPart = rawText.slice(0, pipeIdx).trim();
  questionPart = questionPart.replace(/^:\s+/, "").trim();
  if (!questionPart) return null;

  // Options portion = everything after the first "|".
  const optionsPart = rawText.slice(pipeIdx + 1).trim();

  // Split on "☑" — each chunk looks like "ระดับดีมาก (description)".
  const chunks = optionsPart
    .split("☑")
    .map((s) => s.trim())
    .filter(Boolean);

  if (chunks.length !== 4) return null;

  const options = [];
  for (const chunk of chunks) {
    // Match "LABEL (DESCRIPTION)" — LABEL is one of the known levels.
    // Use the first matching known label as the boundary.
    let matchedLabel = null;
    let labelEnd = -1;
    for (const label of Object.keys(SCORE_BY_LABEL)) {
      if (chunk.startsWith(label)) {
        matchedLabel = label;
        labelEnd = label.length;
        break;
      }
    }
    if (!matchedLabel) return null;

    const rest = chunk.slice(labelEnd).trim();
    // Description is wrapped in parentheses; strip them if present.
    let description = rest;
    if (description.startsWith("(") && description.endsWith(")")) {
      description = description.slice(1, -1).trim();
    }
    if (!description) return null;

    options.push({
      score: SCORE_BY_LABEL[matchedLabel],
      label_th: matchedLabel,
      description_th: description,
    });
  }

  // Validate we got all 4 expected scores.
  const expectedScores = [4, 3, 2, 1];
  const gotScores = options.map((o) => o.score).sort((a, b) => b - a);
  if (expectedScores.some((s, i) => s !== gotScores[i])) return null;

  return { cleanText: questionPart, options };
}

async function run() {
  const client = await pool.connect();
  try {
    // 1. Load all DCA questions that still have inline options.
    const { rows: questions } = await client.query(`
      SELECT q.id, q.lo_code, q.text
      FROM evaluation_questions q
      JOIN evaluation_templates t ON t.id = q.template_id
      JOIN programs p ON p.id = t.program_id
      WHERE p.slug = 'dca' AND q.text LIKE '%|%☑%'
      ORDER BY q.sequence
    `);

    console.log(`Found ${questions.length} DCA questions with inline options.`);

    // 2. Parse each one; collect planned changes. Bail out if any fails to parse.
    const planned = [];
    for (const q of questions) {
      const parsed = parseDcaQuestionText(q.text);
      if (!parsed) {
        throw new Error(
          `Failed to parse question ${q.id} (lo_code=${q.lo_code}). Text does not match expected DCA pattern.\n` +
            `First 200 chars: ${q.text.slice(0, 200)}`,
        );
      }
      planned.push({ id: q.id, lo_code: q.lo_code, original: q.text, ...parsed });
    }

    // 3. Preview.
    console.log("\n=== PREVIEW ===");
    for (const p of planned) {
      console.log(`\n[${p.lo_code}] ${p.id}`);
      console.log(`  BEFORE: ${p.original.slice(0, 120)}...`);
      console.log(`  AFTER:  ${p.cleanText}`);
      console.log(`  OPTIONS (${p.options.length}):`);
      for (const opt of p.options) {
        console.log(`    score=${opt.score}  label="${opt.label_th}"  desc="${opt.description_th.slice(0, 80)}${opt.description_th.length > 80 ? "..." : ""}"`);
      }
    }

    if (DRY_RUN) {
      console.log("\n[DRY RUN] No changes applied. Re-run without --dry-run to apply.");
      return;
    }

    // 4. Apply inside a transaction.
    await client.query("BEGIN");

    // 4a. Create backup table if it doesn't exist yet.
    await client.query(`
      CREATE TABLE IF NOT EXISTS question_text_backup (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id uuid NOT NULL,
        original_text text NOT NULL,
        backed_up_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    // 4b. Backup original text for the questions we're about to change.
    for (const p of planned) {
      await client.query(
        `INSERT INTO question_text_backup (question_id, original_text)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM question_text_backup b
           WHERE b.question_id = $1 AND b.original_text = $2
         )`,
        [p.id, p.original],
      );
    }

    // 4c. Insert options (sequence: highest score first, matches existing convention).
    let insertedOptions = 0;
    for (const p of planned) {
      for (let i = 0; i < p.options.length; i++) {
        const opt = p.options[i];
        await client.query(
          `INSERT INTO assessment_options (question_id, label_th, description_th, score, sequence)
           VALUES ($1, $2, $3, $4, $5)`,
          [p.id, opt.label_th, opt.description_th, opt.score, i + 1],
        );
        insertedOptions++;
      }
    }

    // 4d. Update question.text to the cleaned version.
    let updatedQuestions = 0;
    for (const p of planned) {
      await client.query(`UPDATE evaluation_questions SET text = $1, updated_at = now() WHERE id = $2`, [
        p.cleanText,
        p.id,
      ]);
      updatedQuestions++;
    }

    await client.query("COMMIT");
    console.log(`\n=== APPLIED ===`);
    console.log(`  Questions updated: ${updatedQuestions}`);
    console.log(`  Options inserted:  ${insertedOptions}`);
    console.log(`  Backup rows:       ${planned.length} (in question_text_backup)`);
    console.log(`\nTo rollback: restore text from question_text_backup and delete the inserted options.`);
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore rollback error */
    }
    console.error("\nERROR:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
