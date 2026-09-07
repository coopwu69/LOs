// Migration 008: clean mixed Thai/English text in DB and set missing generic English option labels.
//
// Patterns handled:
//   - assessment_sections.title_th ending with "(English)" -> split into title_th / title_en
//   - evaluation_questions.text ending with "(English)"    -> split into text / text_en
//   - assessment_options.label_en missing and score is 1-5  -> set to standard English label
//
// Safety:
//   - Backups are written to section_title_backup and question_text_backup.
//   - All writes run inside a single transaction; rollback on error.
//   - Dry-run mode prints planned changes without touching the DB.

const { Client } = require("pg");

const DRY_RUN = process.argv.includes("--dry-run");

const ENGLISH_SCORE_LABELS = {
  5: "Excellent",
  4: "Very good",
  3: "Good",
  2: "Fair",
  1: "Needs improvement",
};

function extractEnglish(text) {
  const m = text.match(/\s*\(\s*([^()]+)\)\s*$/);
  if (!m) return { thai: text, english: null };
  const candidate = m[1].trim();
  // Require at least 3 consecutive Latin letters to treat as an English translation.
  if (!/[a-zA-Z]{3,}/.test(candidate)) return { thai: text, english: null };
  const thai = text.slice(0, m.index).trim();
  return { thai, english: candidate };
}

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    // 1. Sections
    const { rows: sections } = await client.query(`
      SELECT id, title_th, title_en
      FROM assessment_sections
      WHERE title_th LIKE '%(%)%'
      ORDER BY sequence
    `);
    const sectionPlans = [];
    for (const s of sections) {
      const { thai, english } = extractEnglish(s.title_th);
      if (english && (s.title_en == null || s.title_en.trim() === "")) {
        sectionPlans.push({ id: s.id, original: s.title_th, thai, english });
      }
    }

    // 2. Questions
    const { rows: questions } = await client.query(`
      SELECT id, text, text_en
      FROM evaluation_questions
      WHERE text LIKE '%(%)%'
      ORDER BY sequence
    `);
    const questionPlans = [];
    for (const q of questions) {
      const { thai, english } = extractEnglish(q.text);
      if (english && (q.text_en == null || q.text_en.trim() === "")) {
        questionPlans.push({ id: q.id, original: q.text, thai, english });
      }
    }

    // 3. Options with missing label_en and known score
    const { rows: options } = await client.query(`
      SELECT id, score, label_en
      FROM assessment_options
      WHERE label_en IS NULL OR label_en = ''
      ORDER BY sequence
    `);
    const optionPlans = [];
    for (const o of options) {
      const label = ENGLISH_SCORE_LABELS[o.score];
      if (label) {
        optionPlans.push({ id: o.id, score: o.score, label });
      }
    }

    console.log(`Planned section splits: ${sectionPlans.length}`);
    console.log(`Planned question splits: ${questionPlans.length}`);
    console.log(`Planned option label fills: ${optionPlans.length}`);

    if (DRY_RUN) {
      console.log("\n=== SECTIONS ===");
      for (const p of sectionPlans.slice(0, 20)) {
        console.log(`  ${p.id}`);
        console.log(`    thai: ${p.thai}`);
        console.log(`    en:   ${p.english}`);
      }
      console.log("\n=== QUESTIONS ===");
      for (const p of questionPlans.slice(0, 20)) {
        console.log(`  ${p.id}`);
        console.log(`    thai: ${p.thai.slice(0, 100)}`);
        console.log(`    en:   ${p.english.slice(0, 100)}`);
      }
      console.log("\n=== OPTIONS ===");
      for (const p of optionPlans.slice(0, 20)) {
        console.log(`  ${p.id} score=${p.score} -> ${p.label}`);
      }
      console.log("\n[Dry run] No changes applied. Re-run without --dry-run to apply.");
      return;
    }

    // 4. Apply in a transaction
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS section_title_backup (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        section_id    uuid NOT NULL,
        original_th   text NOT NULL,
        backed_up_at  timestamptz NOT NULL DEFAULT now()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS question_text_backup (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id   uuid NOT NULL,
        original_text text NOT NULL,
        backed_up_at  timestamptz NOT NULL DEFAULT now()
      )
    `);

    let sectionUpdates = 0;
    for (const p of sectionPlans) {
      await client.query(
        `INSERT INTO section_title_backup (section_id, original_th)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM section_title_backup b
           WHERE b.section_id = $1 AND b.original_th = $2
         )`,
        [p.id, p.original]
      );
      await client.query(
        `UPDATE assessment_sections
         SET title_th = $1, title_en = $2, updated_at = now()
         WHERE id = $3`,
        [p.thai, p.english, p.id]
      );
      sectionUpdates++;
    }

    let questionUpdates = 0;
    for (const p of questionPlans) {
      await client.query(
        `INSERT INTO question_text_backup (question_id, original_text)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM question_text_backup b
           WHERE b.question_id = $1 AND b.original_text = $2
         )`,
        [p.id, p.original]
      );
      await client.query(
        `UPDATE evaluation_questions
         SET text = $1, text_en = $2, updated_at = now()
         WHERE id = $3`,
        [p.thai, p.english, p.id]
      );
      questionUpdates++;
    }

    let optionUpdates = 0;
    for (const p of optionPlans) {
      await client.query(
        `UPDATE assessment_options
         SET label_en = $1, updated_at = now()
         WHERE id = $2`,
        [p.label, p.id]
      );
      optionUpdates++;
    }

    await client.query("COMMIT");
    console.log("\n=== APPLIED ===");
    console.log(`  Section splits:    ${sectionUpdates}`);
    console.log(`  Question splits:   ${questionUpdates}`);
    console.log(`  Option label fills: ${optionUpdates}`);
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    console.error("\nERROR:", err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
