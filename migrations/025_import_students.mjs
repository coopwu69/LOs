// Migration 025: import migrations/students_rows.csv into public.students
// (see 024_create_students_table.sql for the table/rationale).
//
// Idempotent: INSERT ... ON CONFLICT (id) DO UPDATE, batched (200 rows per
// statement) so importing ~5,500 rows finishes in a handful of round-trips
// instead of one network round-trip per row.
//
// Rows whose current_program_id doesn't exist in `programs` are imported
// with current_program_id = NULL (logged) rather than failing the whole
// batch — the FK constraint would otherwise reject the entire statement.
//
// Usage:
//   node migrations/025_import_students.mjs --dry-run
//   node migrations/025_import_students.mjs --apply

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPLY = process.argv.includes("--apply");
const BATCH_SIZE = 200;

const envText = fs.readFileSync(path.join(__dirname, "..", "web", ".env.local"), "utf8");
const DATABASE_URL = envText.match(/DATABASE_URL=(.+)/)[1].trim();

const csvPath = path.join(__dirname, "students_rows.csv");
const raw = fs.readFileSync(csvPath, "utf8");

const lines = raw.split(/\r\n|\n/).filter((l) => l.length > 0);
const header = lines[0].split(",");
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const rows = lines.slice(1).map((line) => {
  const cols = line.split(",");
  return {
    id: cols[idx.id],
    student_code: cols[idx.student_code],
    full_name: cols[idx.full_name],
    current_program_id: cols[idx.current_program_id] || null,
    created_at: cols[idx.created_at],
    updated_at: cols[idx.updated_at],
  };
});

console.log(`Parsed ${rows.length} rows from ${csvPath}`);

const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

const { rows: validProgramIds } = await pool.query(`SELECT id FROM programs`);
const validSet = new Set(validProgramIds.map((r) => r.id));

let nulledCount = 0;
for (const r of rows) {
  if (r.current_program_id && !validSet.has(r.current_program_id)) {
    r.current_program_id = null;
    nulledCount++;
  }
}
console.log(`Rows with unmatched current_program_id (set to NULL): ${nulledCount}`);

if (!APPLY) {
  console.log(`\n[dry-run] would import ${rows.length} rows in ${Math.ceil(rows.length / BATCH_SIZE)} batches — pass --apply to run for real`);
  await pool.end();
  process.exit(0);
}

const client = await pool.connect();
try {
  await client.query("BEGIN");
  let imported = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = [];
    const placeholders = batch.map((r, j) => {
      const base = j * 6;
      values.push(r.id, r.student_code, r.full_name, r.current_program_id, r.created_at, r.updated_at);
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
    });
    await client.query(
      `INSERT INTO students (id, student_code, full_name, current_program_id, created_at, updated_at)
       VALUES ${placeholders.join(", ")}
       ON CONFLICT (id) DO UPDATE SET
         student_code = EXCLUDED.student_code,
         full_name = EXCLUDED.full_name,
         current_program_id = EXCLUDED.current_program_id,
         updated_at = EXCLUDED.updated_at`,
      values
    );
    imported += batch.length;
    console.log(`  ... ${imported}/${rows.length}`);
  }
  await client.query("COMMIT");
  console.log(`Imported/updated ${imported} students.`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Import failed, rolled back:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
