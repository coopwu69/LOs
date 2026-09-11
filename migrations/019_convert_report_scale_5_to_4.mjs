// Migration 019: convert the report-appraisal summary scores from the old
// 5-level scale (max 25) to the 4-level scale (max 20) introduced by G4
// (2026-09-11). Both submission tables are affected:
//   - evaluation_submissions.c_score      (company form)
//   - advisor_submissions.report_score    (advisor form)
//
// Formula preserves the original percentage:
//   new = round(old / 25 * 20)        e.g. 20/25 (80%) -> 16/20 (80%)
//
// Per-item values inside payload_json (c-0..c-4 / adv-report-0..adv-report-4)
// are intentionally left untouched — they are kept as the submitted evidence
// on the original scale.
//
// Safety:
//   - Adds <column>_legacy to each table and stores the pre-conversion value
//     there before overwriting, so the conversion is reversible.
//   - Adds report_scale_version (1 = 5-level, 2 = 4-level) so the script is
//     idempotent: already-converted and newly-submitted rows are skipped.
//   - Runs inside one transaction; rolls back on error.
//   - --dry-run previews the changes and rolls back without writing.
//
// Usage:
//   DATABASE_URL=... node migrations/019_convert_report_scale_5_to_4.mjs --dry-run
//   DATABASE_URL=... node migrations/019_convert_report_scale_5_to_4.mjs
//
// NOTE: run this AFTER deploying the 4-level code, and promptly — any row
// inserted after the column exists gets report_scale_version = 2 by default
// and is never touched.

import pg from "pg";

const { Client } = pg;
const DRY_RUN = process.argv.includes("--dry-run");

const TARGETS = [
  { table: "evaluation_submissions", column: "c_score" },
  { table: "advisor_submissions", column: "report_score" },
];

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  await client.query("BEGIN");

  for (const { table, column } of TARGETS) {
    await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column}_legacy int`);
    await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS report_scale_version smallint`);

    // Rows that predate the version column were recorded on the 5-level scale.
    const marked = await client.query(
      `UPDATE ${table} SET report_scale_version = 1 WHERE report_scale_version IS NULL`,
    );

    // Convert only v1 rows: stash the raw value, rescale, bump the version.
    const converted = await client.query(
      `UPDATE ${table}
       SET ${column}_legacy = ${column},
           ${column} = ROUND(${column}::numeric / 25 * 20),
           report_scale_version = 2
       WHERE report_scale_version = 1 AND ${column} IS NOT NULL`,
    );

    // v1 rows with a NULL score have nothing to convert — just bump them.
    await client.query(
      `UPDATE ${table} SET report_scale_version = 2 WHERE report_scale_version = 1`,
    );

    // Rows inserted from now on are already on the 4-level scale.
    await client.query(
      `ALTER TABLE ${table} ALTER COLUMN report_scale_version SET DEFAULT 2`,
    );

    console.log(`${table}: marked_v1=${marked.rowCount} converted=${converted.rowCount}`);
  }

  // --- Self-verify ---
  for (const { table, column } of TARGETS) {
    const pending = await client.query(
      `SELECT COUNT(*)::int AS n FROM ${table} WHERE report_scale_version <> 2 OR report_scale_version IS NULL`,
    );
    if (pending.rows[0].n !== 0) {
      throw new Error(`${table}: ${pending.rows[0].n} row(s) left unconverted`);
    }
    const sample = await client.query(
      `SELECT id, ${column}_legacy AS old, ${column} AS new,
              ROUND(${column}_legacy::numeric / 25 * 100) AS old_pct,
              ROUND(${column}::numeric / 20 * 100) AS new_pct
       FROM ${table} WHERE ${column}_legacy IS NOT NULL`,
    );
    console.log(`${table} converted rows:`, JSON.stringify(sample.rows));
    const mismatch = sample.rows.filter((r) => r.old_pct !== r.new_pct);
    if (mismatch.length > 0) {
      console.warn(`${table}: percentage drift >1pt from rounding:`, JSON.stringify(mismatch));
    }
  }

  if (DRY_RUN) {
    await client.query("ROLLBACK");
    console.log("Dry run — rolled back, nothing written.");
  } else {
    await client.query("COMMIT");
    console.log("Committed.");
  }
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Migration failed, rolled back:", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
