// Quick DB probe for picking a program to screenshot in the help guide.
//   node scripts/db-check.mjs
// Lists active programs with question + confirmation counts, then the latest
// rows in curriculum_review_confirmations.
import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const envFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const progs = await pool.query(`
    SELECT p.code, p.slug, p.name_th, p.school, p.id::text AS id,
      (SELECT COUNT(*) FROM evaluation_questions q
        JOIN evaluation_templates t ON t.id = q.template_id
        WHERE t.program_id = p.id)::int AS qcount,
      (SELECT COUNT(*) FROM curriculum_review_confirmations c
        WHERE c.program_id = p.id)::int AS confs
    FROM programs p
    WHERE p.is_active = true
    ORDER BY qcount DESC
    LIMIT 15`);
  for (const r of progs.rows) {
    console.log(`${r.slug || r.code} | ${r.code} | ${r.name_th} | school=${r.school} | questions=${r.qcount} | confs=${r.confs} | id=${r.id}`);
  }
  const conf = await pool.query(
    `SELECT program_id::text, role, reviewer_name, confirmed_at
     FROM curriculum_review_confirmations ORDER BY confirmed_at DESC LIMIT 10`,
  );
  console.log("\nexisting confirmations:", conf.rows.length);
  for (const r of conf.rows) console.log(" ", r.role, r.reviewer_name, r.confirmed_at);
  await pool.end();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
