// Add rubric descriptions to the IR (ความสัมพันธ์ระหว่างประเทศ) ethics +
// character questions (LO11-LO16). Migration 026 seeded those 6 questions
// with labels+scores but NULL description_th because the source docx
// ("IRสถานประกอบการการนำความรู้ไปใช้และความสามารถ.docx") only contains
// rubric tables for ด้านความรู้ and ด้านทักษะ.
//
// These descriptions are authored in the same 4-tier style the source
// doc uses for sections 3 (knowledge/skills): level 4 = does it
// independently, level 3 = mostly, minor guidance, level 2 = partial,
// periodic guidance, level 1 = still cannot even after guidance.
//
// Same "as if edited through the web" semantics as 026: snapshot the
// current template into template_revisions (kind='edit') before mutating.
//
// Safety: single transaction, --dry-run supported, only touches the 6
// ethics/character questions of the IR template.

import { createRequire } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(__dirname, "..", "web");
const require = createRequire(path.join(webDir, "package.json"));
const { Pool } = require("pg");

const env = readFileSync(path.join(webDir, ".env.local"), "utf8");
const match = env.match(/DATABASE_URL="?([^"\n]+)"?/);
process.env.DATABASE_URL = match[1];
const DRY_RUN = process.argv.includes("--dry-run");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const TEMPLATE_ID = "bfbda363-e985-407e-94c1-61a02c18109c"; // IR

// rubric[0] = score 4 (ดีมาก) … rubric[3] = score 1 (ควรปรับปรุง)
const RUBRICS = {
  LO11: [ // จริยธรรม 1 — ความรับผิดชอบต่อหน้าที่
    "รับผิดชอบงานที่ได้รับมอบหมายครบถ้วน ส่งงานตรงกำหนดเสมอ และติดตามแก้ไขข้อผิดพลาดของตนเองจนเสร็จสมบูรณ์โดยไม่ต้องตักเตือน",
    "รับผิดชอบและส่งงานตามกำหนดได้เป็นส่วนใหญ่ ต้องได้รับการเตือนหรือติดตามเล็กน้อย",
    "ส่งงานล่าช้าหรือต้องถูกติดตามเป็นครั้งคราว แก้ไขข้อผิดพลาดได้เมื่อได้รับคำแนะนำ",
    "ส่งงานไม่ตรงกำหนดเป็นประจำ หรือไม่รับผิดชอบแก้ไขข้อผิดพลาดของตนเองแม้ได้รับคำเตือน",
  ],
  LO12: [ // จริยธรรม 2 — ความซื่อสัตย์และการปฏิบัติตามระเบียบ
    "รายงานข้อมูลตามความเป็นจริงเสมอ ปฏิบัติตามระเบียบ และรักษาความลับของหน่วยงานได้อย่างเคร่งครัดด้วยตนเอง",
    "ปฏิบัติตามระเบียบและรักษาความลับของหน่วยงานได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อยในบางกรณี",
    "ยังมีข้อบกพร่องในการปฏิบัติตามระเบียบหรือการรายงานข้อมูลเป็นครั้งคราว ต้องได้รับคำเตือนเป็นระยะ",
    "ไม่ปฏิบัติตามระเบียบ รายงานข้อมูลไม่ตรงความเป็นจริง หรือเผยแพร่ข้อมูลที่ควรรักษาไว้ แม้ได้รับคำเตือน",
  ],
  LO13: [ // จริยธรรม 3 — การเคารพผู้อื่นและความแตกต่าง
    "รับฟังความคิดเห็นที่แตกต่างอย่างเปิดกว้าง และปฏิบัติต่อเพื่อนร่วมงานหรือผู้รับบริการอย่างให้เกียรติและเสมอภาคด้วยตนเองเสมอ",
    "ให้เกียรติและรับฟังผู้อื่นได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อยในบางสถานการณ์",
    "รับฟังหรือปฏิบัติต่อผู้อื่นอย่างให้เกียรติได้บางส่วน ยังมีพฤติกรรมที่ต้องปรับปรุงเมื่อถูกชี้แนะ",
    "ไม่รับฟังความคิดเห็นที่แตกต่าง หรือปฏิบัติต่อผู้อื่นไม่ให้เกียรติจนกระทบงานแม้ได้รับคำเตือน",
  ],
  LO14: [ // ลักษณะบุคคล 4 — การทำงานร่วมกับผู้อื่น
    "ร่วมมือกับทีมอย่างสม่ำเสมอ ปฏิบัติตามบทบาทที่ได้รับอย่างครบถ้วน และช่วยหาข้อยุติเมื่อมีความเห็นต่างด้วยตนเอง",
    "ร่วมงานกับทีมได้ดีเป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อยเมื่อเกิดความเห็นต่าง",
    "ร่วมงานกับทีมได้บางส่วน ยังต้องมีผู้ช่วยประสานเมื่อมีข้อขัดแย้งหรือบทบาทไม่ชัดเจน",
    "ไม่ร่วมมือกับทีม หรือสร้างความขัดแย้งจนกระทบเป้าหมายของงานแม้ได้รับคำแนะนำ",
  ],
  LO15: [ // ลักษณะบุคคล 5 — ความกระตือรือร้นและการพัฒนาตนเอง
    "แสดงความกระตือรือร้นในการเรียนรู้งานอย่างสม่ำเสมอ รับฟังข้อเสนอแนะ และนำไปปรับปรุงการปฏิบัติงานจนเห็นผลด้วยตนเอง",
    "ตั้งใจเรียนรู้และรับฟังข้อเสนอแนะได้เป็นส่วนใหญ่ นำไปปรับปรุงงานได้เมื่อมีคำแนะนำเล็กน้อย",
    "เรียนรู้หรือปรับปรุงงานได้บางส่วนเมื่อมีผู้ชี้แนะ แต่ยังขาดความต่อเนื่อง",
    "ไม่แสดงความสนใจเรียนรู้งาน หรือไม่นำข้อเสนอแนะไปปรับปรุงแม้ได้รับคำแนะนำซ้ำหลายครั้ง",
  ],
  LO16: [ // ลักษณะบุคคล 6 — ภาวะผู้นำและการปรับตัว
    "ริเริ่มและช่วยขับเคลื่อนงานได้ตามโอกาส ปรับบทบาทเป็นผู้นำหรือผู้ตามได้เหมาะกับสถานการณ์ด้วยตนเอง",
    "รับบทบาทที่มอบหมายและเริ่มริเริ่มงานได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
    "ทำตามบทบาทที่ได้รับได้บางส่วน ยังไม่ค่อยริเริ่มหรือปรับตัวตามสถานการณ์ ต้องมีผู้ชี้แนะเป็นระยะ",
    "ไม่ริเริ่มและไม่ปรับบทบาทตามสถานการณ์เลย ต้องได้รับการช่วยเหลือใกล้ชิด",
  ],
};

// Same query as snapshotCurrent() in
// web/src/app/programs/[programId]/edit/actions.ts — keep identical.
const SNAPSHOT_SQL = `SELECT
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

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log(DRY_RUN ? "DRY RUN — no changes will be committed\n" : "Adding IR ethics/character rubrics...\n");

    // 1. Snapshot current state (kind='edit') before mutating.
    const { rows: snapRows } = await client.query(SNAPSHOT_SQL, [TEMPLATE_ID]);
    await client.query(
      `INSERT INTO template_revisions
         (template_id, kind, snapshot_json, note, created_at)
       VALUES ($1, 'edit', $2::jsonb, $3, now())`,
      [
        TEMPLATE_ID,
        JSON.stringify(snapRows[0] ?? null),
        "เพิ่มคำอธิบาย rubric ด้านจริยธรรมและลักษณะบุคคล (IR)",
      ]
    );
    console.log("  [IR] snapshot -> template_revisions (kind='edit')");

    // 2. Update option descriptions for the 6 questions, keyed by score.
    let updated = 0;
    for (const [loCode, rubric] of Object.entries(RUBRICS)) {
      const q = await client.query(
        "SELECT id FROM evaluation_questions WHERE template_id = $1 AND lo_code = $2",
        [TEMPLATE_ID, loCode]
      );
      if (q.rows.length !== 1) {
        throw new Error(`IR: expected exactly 1 question with lo_code=${loCode}, found ${q.rows.length}`);
      }
      for (let i = 0; i < 4; i++) {
        const score = 4 - i;
        const r = await client.query(
          "UPDATE assessment_options SET description_th = $3, updated_at = now() WHERE question_id = $1 AND score = $2",
          [q.rows[0].id, score, rubric[i]]
        );
        updated += r.rowCount;
      }
    }
    console.log(`  [IR] updated ${updated} option descriptions across 6 questions`);

    if (DRY_RUN) {
      await client.query("ROLLBACK");
      console.log("\nDry run complete, rolled back.");
    } else {
      await client.query("COMMIT");
      console.log("\nCommitted.");
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("FAILED, rolled back:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
