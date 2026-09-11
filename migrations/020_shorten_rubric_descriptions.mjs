// G11 — ย่อคำอธิบาย rubric ที่เขียนโจทย์ซ้ำทุกระดับ
//
// ครอบคลุม 46 คำถาม / 184 ตัวเลือก ใน 9 หลักสูตร
// (MARSCI, CIVIL, SCI, EE, THAI, CHEP, INTD, MECH, PEP)
// ลดจาก 26,445 → 12,954 ตัวอักษร (51%) ยาวสุดหลังย่อ 125 ตัวอักษร
//
// ── ย้อนกลับได้ 2 ทาง ───────────────────────────────────────────
// 1. snapshot ลง template_revisions ก่อนแก้ทุก template ที่แตะ
//    → กดปุ่มกู้คืนได้ที่ /programs/{programId}/history
// 2. ไฟล์ docs/rubric-rewrite-2569-09-11.md เก็บตารางก่อน/หลังไว้ใน git
//
// snapshot ใช้ query เดียวกับ snapshotCurrent() ใน
// web/src/app/programs/[programId]/edit/actions.ts — ถ้าแก้ที่นั่น ต้องแก้ที่นี่ด้วย
// ไม่งั้นปุ่มกู้คืนจะอ่าน snapshot ของ migration นี้ไม่ได้
//
// วิธีรัน (อ่านอย่างเดียวก่อน):
//   node migrations/020_shorten_rubric_descriptions.mjs --dry-run
// วิธีรันจริง:
//   node migrations/020_shorten_rubric_descriptions.mjs --apply

import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { REWRITES } from "./020_rubric_rewrites.mjs";

const require = createRequire(new URL("../web/package.json", import.meta.url));
const { Pool } = require("pg");
const env = readFileSync(fileURLToPath(new URL("../web/.env.local", import.meta.url)), "utf8");
const pool = new Pool({
  connectionString: env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)[1],
  ssl: { rejectUnauthorized: false },
});

const APPLY = process.argv.includes("--apply");
const NOTE = "ย่อคำอธิบาย rubric (G11) — 11 กันยายน 2569";

// สำเนาจาก snapshotCurrent() — ต้องตรงกันเป๊ะ มิฉะนั้นปุ่มกู้คืนใช้ไม่ได้
const SNAPSHOT_SQL = `
  SELECT
    t.id, t.title, t.course_codes, t.scale_status, t.source_layout,
    COALESCE(
      json_agg(
        json_build_object(
          'id', s.id, 'title_th', s.title_th, 'part', COALESCE(s.part,1), 'sequence', s.sequence,
          'questions', COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', q.id, 'lo_code', q.lo_code, 'text', q.text, 'text_en', q.text_en,
                'plo_refs', q.plo_refs, 'sequence', q.sequence,
                'options', COALESCE((
                  SELECT json_agg(
                    json_build_object('id', o.id, 'score', o.score, 'label_th', o.label_th,
                                       'description_th', o.description_th, 'sequence', o.sequence)
                    ORDER BY o.score DESC, o.sequence
                  ) FROM assessment_options o WHERE o.question_id = q.id
                ), '[]'::json)
              ) ORDER BY q.sequence
            ) FROM evaluation_questions q WHERE q.section_id = s.id
          ), '[]'::json)
        ) ORDER BY s.part, s.sequence
      ), '[]'::json
    ) AS sections
  FROM evaluation_templates t
  LEFT JOIN assessment_sections s ON s.template_id = t.id
  WHERE t.id = $1
  GROUP BY t.id`;

const ids = Object.keys(REWRITES);

// --- 1. ตรวจว่า oid ทุกตัวมีจริง และหา template ที่เกี่ยวข้อง ---
const { rows: targets } = await pool.query(
  `SELECT o.id AS oid, o.description_th AS old, q.template_id, p.code AS program, p.id AS program_id
   FROM assessment_options o
   JOIN evaluation_questions q ON q.id = o.question_id
   JOIN evaluation_templates t ON t.id = q.template_id
   JOIN programs p ON p.id = t.program_id
   WHERE o.id = ANY($1::uuid[])`,
  [ids]
);

if (targets.length !== ids.length) {
  const found = new Set(targets.map((r) => r.oid));
  console.error("หยุด: หา option เหล่านี้ไม่พบในฐานข้อมูล");
  console.error(ids.filter((i) => !found.has(i)));
  await pool.end();
  process.exit(1);
}

const templates = [...new Set(targets.map((r) => r.template_id))];
const programs = [...new Set(targets.map((r) => r.program))].sort();

const oldChars = targets.reduce((s, r) => s + (r.old?.trim().length ?? 0), 0);
const newChars = ids.reduce((s, i) => s + REWRITES[i].length, 0);

console.log(`ตัวเลือกที่จะแก้ : ${targets.length}`);
console.log(`template ที่แตะ  : ${templates.length}`);
console.log(`หลักสูตร         : ${programs.join(", ")}`);
console.log(`ตัวอักษร         : ${oldChars.toLocaleString()} → ${newChars.toLocaleString()} (ลด ${Math.round((1 - newChars / oldChars) * 100)}%)`);

if (!APPLY) {
  console.log(`\n[dry-run] ยังไม่เขียนอะไรลงฐานข้อมูล — ใส่ --apply เพื่อรันจริง`);
  await pool.end();
  process.exit(0);
}

// --- 2. snapshot + update ใน transaction เดียว ---
const client = await pool.connect();
try {
  await client.query("BEGIN");

  let snapshotted = 0;
  for (const templateId of templates) {
    const { rows } = await client.query(SNAPSHOT_SQL, [templateId]);
    if (!rows[0]) throw new Error(`snapshot ล้มเหลวสำหรับ template ${templateId}`);
    await client.query(
      `INSERT INTO template_revisions (template_id, kind, snapshot_json, note, created_at)
       VALUES ($1, 'edit', $2::jsonb, $3, now())`,
      [templateId, JSON.stringify(rows[0]), NOTE]
    );
    snapshotted++;
  }
  console.log(`snapshot แล้ว ${snapshotted} template`);

  let updated = 0;
  for (const [oid, text] of Object.entries(REWRITES)) {
    const { rowCount } = await client.query(
      `UPDATE assessment_options SET description_th = $2, updated_at = now() WHERE id = $1`,
      [oid, text]
    );
    updated += rowCount;
  }
  console.log(`อัปเดตคำอธิบายแล้ว ${updated} ตัวเลือก`);

  if (updated !== ids.length) throw new Error(`อัปเดตได้ ${updated} จาก ${ids.length} — rollback`);

  await client.query("COMMIT");
  console.log(`\nสำเร็จ — เปิด /programs/{programId}/history ของแต่ละหลักสูตรเพื่อดูเวอร์ชันก่อนย่อ`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("ล้มเหลว rollback แล้ว:", error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
