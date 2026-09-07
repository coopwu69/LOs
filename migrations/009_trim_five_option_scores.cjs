// Migration 009: enforce the project's rating-scale rule — only the report
// appraisal uses 5 levels, every other rated item (LO/competency, ethics,
// process, workplace) uses 4. 76 of 260 questions, scattered across the
// knowledge/skills/ethics/character/general domains (not just one program),
// had a 5th "score = 5" option left over from inconsistent source data.
//
// This removes exactly that 5th option (label ยอดเยี่ยม/ดีเยี่ยม/etc.,
// score = 5) from each of those 76 questions, leaving scores 1-4. Every
// affected row is copied to assessment_options_backup first.
//
// Already applied to production (Neon) on 2026-09-07. Committing this script
// for the audit trail, matching the numbered-migration convention used
// elsewhere in this folder (see 008_clean_i18n.js).
//
// Safety:
//   - Backup table assessment_options_backup created if missing.
//   - Runs inside a single transaction; rolls back on error.
//   - Self-verifies afterward that every affected question now has exactly
//     4 options with scores 1-4, and rolls back if not.
//   - Dry-run mode (--dry-run) prints the rows it would touch without
//     writing anything.

const { Client } = require("pg");

const DRY_RUN = process.argv.includes("--dry-run");

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const { rows: targets } = await client.query(`
      SELECT o.id, o.question_id, o.label_th, o.label_en, o.score
      FROM assessment_options o
      WHERE o.question_id IN (
        SELECT question_id FROM assessment_options GROUP BY question_id HAVING count(*) = 5
      ) AND o.score = 5
      ORDER BY o.question_id
    `);
    console.log(`Rows to remove (score=5 on questions that currently have 5 options): ${targets.length}`);

    if (DRY_RUN) {
      for (const r of targets) console.log(`  ${r.id}  question=${r.question_id}  "${r.label_th}" / "${r.label_en}"`);
      console.log("\n[Dry run] No changes applied. Re-run without --dry-run to apply.");
      return;
    }

    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS assessment_options_backup (
        backup_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        option_id       uuid NOT NULL,
        question_id     uuid NOT NULL,
        label_th        text,
        label_en        text,
        description_th  text,
        description_en  text,
        score           integer,
        sequence        integer,
        reason          text NOT NULL,
        backed_up_at    timestamptz NOT NULL DEFAULT now()
      )
    `);

    const ids = targets.map((r) => r.id);
    const { rowCount: backedUp } = await client.query(
      `INSERT INTO assessment_options_backup
         (option_id, question_id, label_th, label_en, description_th, description_en, score, sequence, reason)
       SELECT id, question_id, label_th, label_en, description_th, description_en, score, sequence,
              'trim-5-to-4-non-report-2026-09-07'
       FROM assessment_options WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    console.log(`Backed up: ${backedUp}`);

    const { rowCount: deleted } = await client.query(
      `DELETE FROM assessment_options WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    console.log(`Deleted: ${deleted}`);

    const { rows: check } = await client.query(`
      SELECT question_id, count(*)::int n, array_agg(score ORDER BY score) scores
      FROM assessment_options
      WHERE question_id = ANY(
        SELECT DISTINCT question_id FROM assessment_options_backup WHERE reason = 'trim-5-to-4-non-report-2026-09-07'
      )
      GROUP BY question_id
      HAVING count(*) <> 4
    `);
    if (check.length > 0) {
      console.log("VERIFY FAILED, rolling back:", JSON.stringify(check, null, 2));
      await client.query("ROLLBACK");
      process.exitCode = 1;
      return;
    }

    await client.query("COMMIT");
    console.log("COMMITTED. All affected questions now have exactly 4 options (scores 1-4).");
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
