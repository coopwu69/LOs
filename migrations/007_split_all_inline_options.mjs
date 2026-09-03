// Bulk migration: split inline options out of question.text for ALL programs.
//
// Patterns handled:
//   A. ": <q> | ☑ ระดับX (desc) ..."            — DCA-style (already done, but idempotent)
//   B. ": <q> |  5 (ยอดเยี่ยม): desc  4 (ดีมาก): desc  3 (ดี): desc  2 (พอใช้): desc  1 (ต้องปรับปรุง): desc"
//   C. ": <q> ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)"  — `|` is NOT options
//   D1. "| <q>" (starts with |, no options pattern)    — MARSCI-style
//   D2. ": <q>" (no pipe at all, no options)           — plain question
//
// For ALL patterns:
//   - Strip leading ": " from question text
//   - Strip trailing " ผลการเรียนรู้ที่คาดหวัง" if present
//   - Insert 4 standard options (4=ดีมาก, 3=ดี, 2=พอใช้, 1=ควรปรับปรุง)
//   - If options have descriptions in the source text, use them; otherwise leave null
//   - 5-level → 4-level mapping: 5→4 (use 5's desc), 4→drop, 3→3, 2→2, 1→1
//
// Safety:
//   - Skip questions that already have options in assessment_options
//   - Create/use question_text_backup table
//   - Single transaction, rollback on error
//   - --dry-run flag for preview

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

const STANDARD_4 = [
  { score: 4, label_th: "ระดับดีมาก", description_th: null },
  { score: 3, label_th: "ระดับดี", description_th: null },
  { score: 2, label_th: "ระดับพอใช้", description_th: null },
  { score: 1, label_th: "ระดับควรปรับปรุง", description_th: null },
];

// 5-level label → target 4-level score
const FIVE_TO_FOUR = {
  5: 4, // ยอดเยี่ยม → ดีมาก (use 5's desc)
  4: null, // ดีมาก → drop (merged into 4)
  3: 3, // ดี → ดี
  2: 2, // พอใช้ → พอใช้
  1: 1, // ต้องปรับปรุง → ควรปรับปรุง
};

function cleanQuestionText(raw) {
  let t = raw.trim();
  // Strip leading ": " or ":  " (any spaces after colon)
  t = t.replace(/^:\s+/, "").trim();
  // Strip trailing " ผลการเรียนรู้ที่คาดหวัง"
  t = t.replace(/\s*ผลการเรียนรู้ที่คาดหวัง\s*$/, "").trim();
  return t;
}

// Parse pattern A: "q | ☑ ระดับX (desc) ☑ ระดับY (desc) ..."
function parsePatternA(text) {
  if (!text.includes("☑")) return null;
  const pipeIdx = text.indexOf("|");
  if (pipeIdx === -1) return null;
  const q = cleanQuestionText(text.slice(0, pipeIdx));
  if (!q) return null;
  const optionsPart = text.slice(pipeIdx + 1).trim();
  const chunks = optionsPart.split("☑").map((s) => s.trim()).filter(Boolean);
  const SCORE_BY_LABEL = {
    "ระดับดีมาก": 4,
    "ระดับดี": 3,
    "ระดับพอใช้": 2,
    "ระดับควรปรับปรุง": 1,
    "ระดับดีมากที่สุด": 4, // 5-level label → merge to 4
  };
  const options = [];
  for (const chunk of chunks) {
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
    let desc = rest;
    if (desc.startsWith("(") && desc.endsWith(")")) desc = desc.slice(1, -1).trim();
    if (!desc) return null;
    const score = SCORE_BY_LABEL[matchedLabel];
    // For 5-level "ระดับดีมากที่สุด" (score 5→4), only keep if we don't already have score 4
    if (options.some((o) => o.score === score)) {
      // Replace existing score 4's desc with the higher one (5's desc)
      if (score === 4) {
        const existing = options.find((o) => o.score === 4);
        existing.description_th = desc;
      }
      continue;
    }
    options.push({ score, label_th: matchedLabel === "ระดับดีมากที่สุด" ? "ระดับดีมาก" : matchedLabel, description_th: desc });
  }
  // Ensure we have exactly 4 distinct scores 4,3,2,1
  const scores = options.map((o) => o.score).sort((a, b) => b - a);
  if (scores.join(",") !== "4,3,2,1") return null;
  return { cleanText: q, options };
}

// Parse pattern B: "q |  5 (ยอดเยี่ยม): desc  4 (ดีมาก): desc  3 (ดี): desc  2 (พอใช้): desc  1 (ต้องปรับปรุง): desc"
function parsePatternB(text) {
  if (text.includes("☑")) return null;
  const pipeIdx = text.indexOf("|");
  if (pipeIdx === -1) return null;
  const beforePipe = text.slice(0, pipeIdx);
  const afterPipe = text.slice(pipeIdx + 1).trim();
  // Check for "N (label):" pattern
  const matches = [...afterPipe.matchAll(/(\d)\s*\(([^)]+)\)\s*:\s*([^]*?)(?=\s+\d\s*\(|$)/g)];
  if (matches.length === 0) return null;
  const q = cleanQuestionText(beforePipe);
  if (!q) return null;
  // Build options from matches
  const rawOpts = [];
  for (const m of matches) {
    const srcScore = parseInt(m[1], 10);
    const label = m[2].trim();
    let desc = m[3].trim();
    // Clean up desc — remove trailing whitespace, normalize
    desc = desc.replace(/\s+/g, " ").trim();
    rawOpts.push({ srcScore, label, desc });
  }
  // Map 5→4, 4→drop, 3→3, 2→2, 1→1
  const options = [];
  for (const raw of rawOpts) {
    const targetScore = FIVE_TO_FOUR[raw.srcScore];
    if (targetScore === null) continue; // drop score-4
    if (options.some((o) => o.score === targetScore)) {
      // Already have this score (e.g., 5 mapped to 4 and we already added 4)
      // Keep the one with higher source score (5's desc wins)
      continue;
    }
    // Map label to standard 4-level label
    const stdLabel = STANDARD_4.find((s) => s.score === targetScore)?.label_th;
    options.push({
      score: targetScore,
      label_th: stdLabel,
      description_th: raw.desc || null,
    });
  }
  // Validate we have 4,3,2,1
  const scores = options.map((o) => o.score).sort((a, b) => b - a);
  if (scores.join(",") !== "4,3,2,1") return null;
  return { cleanText: q, options };
}

// Parse pattern C: "q ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)"
function parsePatternC(text) {
  if (!/ผลการประเมิน/.test(text)) return null;
  const pipeIdx = text.indexOf("|");
  if (pipeIdx === -1) return null;
  const beforePipe = text.slice(0, pipeIdx);
  const q = cleanQuestionText(beforePipe);
  if (!q) return null;
  return { cleanText: q, options: STANDARD_4.map((o) => ({ ...o })) };
}

// Parse pattern D1: "| <q>" (starts with |, no options)
function parsePatternD1(text) {
  if (!text.startsWith("|")) return null;
  const q = cleanQuestionText(text.slice(1));
  if (!q) return null;
  return { cleanText: q, options: STANDARD_4.map((o) => ({ ...o })) };
}

// Parse pattern D2: no recognizable options pattern.
// If there's a `|`, take only the text before the first `|` (the rest is
// empty placeholder pipes or stray markup). Then clean and use standard 4 options.
function parsePatternD2(text) {
  let q = text;
  if (text.includes("|")) {
    q = text.slice(0, text.indexOf("|"));
  }
  q = cleanQuestionText(q);
  if (!q) return null;
  return { cleanText: q, options: STANDARD_4.map((o) => ({ ...o })) };
}

function parseQuestion(text) {
  // Try each pattern in order
  return (
    parsePatternA(text) ||
    parsePatternB(text) ||
    parsePatternC(text) ||
    parsePatternD1(text) ||
    parsePatternD2(text)
  );
}

async function run() {
  const client = await pool.connect();
  try {
    // 1. Load ALL questions that DON'T already have options in the table.
    const { rows: questions } = await client.query(`
      SELECT q.id, q.lo_code, q.text, p.code AS program_code
      FROM evaluation_questions q
      JOIN evaluation_templates t ON t.id = q.template_id
      JOIN programs p ON p.id = t.program_id
      WHERE NOT EXISTS (SELECT 1 FROM assessment_options o WHERE o.question_id = q.id)
      ORDER BY p.code, q.sequence
    `);

    console.log(`Found ${questions.length} questions without options in table.`);

    // 2. Parse each one.
    const planned = [];
    const failed = [];
    for (const q of questions) {
      const parsed = parseQuestion(q.text);
      if (!parsed) {
        failed.push({ id: q.id, lo_code: q.lo_code, program: q.program_code, text: q.text.slice(0, 200) });
        continue;
      }
      planned.push({ ...q, ...parsed });
    }

    if (failed.length > 0) {
      console.log(`\n=== FAILED TO PARSE (${failed.length}) ===`);
      for (const f of failed) {
        console.log(`  [${f.program} ${f.lo_code}] ${f.id}`);
        console.log(`    text: ${f.text}`);
      }
    }

    // 3. Preview by category.
    const byCategory = { A: 0, B: 0, C: 0, D1: 0, D2: 0 };
    for (const p of planned) {
      if (p.text.includes("☑")) byCategory.A++;
      else if (/ผลการประเมิน/.test(p.text)) byCategory.C++;
      else if (p.text.startsWith("|")) byCategory.D1++;
      else if (p.text.includes("|")) byCategory.B++;
      else byCategory.D2++;
    }
    console.log(`\n=== PARSED ${planned.length} questions ===`);
    console.log(`  Pattern A (☑ inline):       ${byCategory.A}`);
    console.log(`  Pattern B (5-level inline):  ${byCategory.B}`);
    console.log(`  Pattern C (ผลการประเมิน):    ${byCategory.C}`);
    console.log(`  Pattern D1 (| prefix):       ${byCategory.D1}`);
    console.log(`  Pattern D2 (no pipe):        ${byCategory.D2}`);

    // 4. Show a few samples per category.
    const showSamples = (label, filter, count = 2) => {
      const samples = planned.filter(filter).slice(0, count);
      if (samples.length === 0) return;
      console.log(`\n--- ${label} samples ---`);
      for (const s of samples) {
        console.log(`  [${s.program_code} ${s.lo_code}]`);
        console.log(`    BEFORE: ${s.text.slice(0, 150)}${s.text.length > 150 ? "..." : ""}`);
        console.log(`    AFTER:  ${s.cleanText.slice(0, 150)}${s.cleanText.length > 150 ? "..." : ""}`);
        console.log(`    OPTIONS: ${s.options.map((o) => `${o.score}:${o.label_th}${o.description_th ? "(+desc)" : ""}`).join(", ")}`);
      }
    };
    showSamples("A", (p) => p.text.includes("☑"));
    showSamples("B", (p) => p.text.includes("|") && !p.text.includes("☑") && !/ผลการประเมิน/.test(p.text) && !p.text.startsWith("|"));
    showSamples("C", (p) => /ผลการประเมิน/.test(p.text));
    showSamples("D1", (p) => p.text.startsWith("|"));
    showSamples("D2", (p) => !p.text.includes("|"));

    if (DRY_RUN) {
      console.log(`\n[DRY RUN] No changes applied. ${planned.length} would be updated, ${failed.length} failed to parse.`);
      return;
    }

    if (failed.length > 0) {
      console.log(`\nABORTING: ${failed.length} questions failed to parse. Fix them or exclude them before running.`);
      console.log(`(Run with --dry-run to see the full list, or inspect the FAILED section above.)`);
      return;
    }

    // 5. Apply inside a transaction.
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS question_text_backup (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id uuid NOT NULL,
        original_text text NOT NULL,
        backed_up_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    let insertedOptions = 0;
    let updatedQuestions = 0;
    for (const p of planned) {
      // Backup
      await client.query(
        `INSERT INTO question_text_backup (question_id, original_text)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM question_text_backup b
           WHERE b.question_id = $1 AND b.original_text = $2
         )`,
        [p.id, p.text],
      );
      // Insert options (sequence: highest score first)
      for (let i = 0; i < p.options.length; i++) {
        const opt = p.options[i];
        await client.query(
          `INSERT INTO assessment_options (question_id, label_th, description_th, score, sequence)
           VALUES ($1, $2, $3, $4, $5)`,
          [p.id, opt.label_th, opt.description_th, opt.score, i + 1],
        );
        insertedOptions++;
      }
      // Update question text
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
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    console.error("\nERROR:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
