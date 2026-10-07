// Restructure the PA (รัฐประศาสนศาสตร์) evaluation template: split the
// single 'general' section ("ด้านทั่วไป", 11 questions) into the standard
// 4-domain layout used by every other program, and add rubric
// descriptions to all 44 options (currently 0/44 have description_th).
//
// Why: the company wizard groups questions into "ส่วน 3 จาก 6 —
// ความรู้และทักษะ" via PRIMARY_DOMAINS (knowledge/skills) and puts
// everything else in "ส่วน 4 จาก 6 — จริยธรรมและบุคลิก". With a
// 'general'-typed section, all 11 PA questions rendered in step 4 and
// step 3 was empty.
//
// Domain classification follows the LAW/ANSCI/POL precedent of grouping
// by what the statement actually describes:
//   Q1  (theory/principles application)      -> knowledge
//   Q2-4 (analysis, IT tools, research use)  -> skills
//   Q5-7 (honesty, discipline, duty)         -> ethics
//   Q8-11 (self-development, leadership,
//          initiative, volunteerism)         -> character
//
// Questions are UPDATEd in place (same ids) rather than re-inserted, so
// any existing submissions/drafts that reference question ids keep
// working; option rows are also updated in place. Leading ordinal
// artifacts ("1 ", "2 ") left over from the source-document parse are
// stripped from question text and lo_code LO1-LO11 is assigned.
//
// Same "user edit" semantics as migrations 026/027: snapshot the current
// template into template_revisions (kind='edit') before mutating.
//
// Safety: single transaction, --dry-run supported, aborts if the PA
// template is already in the 4-domain layout.

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

const PROGRAM_ID = "68263458-6130-4aed-b249-f90ab60243b9"; // PA
const TEMPLATE_ID = "3edea286-b068-444d-a181-2d2e096bca49";

const SECTIONS = [
  { domain: "knowledge", title_th: "ด้านความรู้", sequence: 1 },
  { domain: "skills", title_th: "ด้านทักษะ", sequence: 2 },
  { domain: "ethics", title_th: "ด้านจริยธรรม", sequence: 3 },
  { domain: "character", title_th: "ด้านลักษณะบุคคล", sequence: 4 },
];

// matchText = leading fragment of the CURRENT question text (to locate
// the row); text = cleaned text; rubric[0]=score4 … rubric[3]=score1.
const QUESTIONS = [
  {
    matchText: "การนำหลักการและทฤษฎีรัฐประศาสนศาสตร์",
    domain: "knowledge", loCode: "LO1",
    text: "การนำหลักการและทฤษฎีรัฐประศาสนศาสตร์ไปปรับใช้กับการปฏิบัติงานในสถานประกอบการ",
    rubric: [
      "นำหลักการและทฤษฎีรัฐประศาสนศาสตร์มาประยุกต์ใช้กับงานได้ตรงประเด็นและเหมาะสมด้วยตนเอง",
      "นำหลักการและทฤษฎีมาใช้กับงานได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "นำหลักการและทฤษฎีมาใช้กับงานได้บางส่วน ต้องมีผู้ช่วยชี้แนวทาง",
      "ยังนำหลักการและทฤษฎีมาประยุกต์ใช้กับงานไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "ใช้กระบวนการคิดวิเคราะห์และความคิดสร้างสรรค์",
    domain: "skills", loCode: "LO2",
    text: "ใช้กระบวนการคิดวิเคราะห์และความคิดสร้างสรรค์ เพื่อระบุและวิเคราะห์ปัญหาพร้อมเสนอแนวทางแก้ไขอย่างเป็นระบบ",
    rubric: [
      "ใช้กระบวนการคิดวิเคราะห์ระบุปัญหาและเสนอแนวทางแก้ไขได้อย่างเป็นระบบด้วยตนเอง",
      "วิเคราะห์ปัญหาและเสนอแนวทางได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "วิเคราะห์ปัญหาได้บางส่วน แต่แนวทางแก้ไขยังไม่เป็นระบบ ต้องมีผู้ชี้แนะ",
      "ยังวิเคราะห์ปัญหาหรือเสนอแนวทางแก้ไขไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "สามารถใช้เครื่องมือเทคโนโลยีสารสนเทศ",
    domain: "skills", loCode: "LO3",
    text: "สามารถใช้เครื่องมือเทคโนโลยีสารสนเทศในการสืบค้น วิเคราะห์ และรายงานข้อมูลที่เกี่ยวข้องกับการปฏิบัติงานได้อย่างมีประสิทธิภาพ",
    rubric: [
      "ใช้เครื่องมือเทคโนโลยีในการสืบค้น วิเคราะห์ และรายงานข้อมูลได้ถูกต้องและมีประสิทธิภาพด้วยตนเอง",
      "ใช้เครื่องมือเทคโนโลยีได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "ใช้เครื่องมือพื้นฐานได้ แต่การสืบค้นหรือวิเคราะห์ยังไม่ครบ ต้องได้รับคำแนะนำเป็นระยะ",
      "ยังใช้เครื่องมือเทคโนโลยีที่จำเป็นต่องานไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "สามารถนำผลการวิจัยหรือการวิเคราะห์ข้อมูล",
    domain: "skills", loCode: "LO4",
    text: "สามารถนำผลการวิจัยหรือการวิเคราะห์ข้อมูล เพื่อเสนอแนะแนวทางแก้ไขปัญหา หรือปรับปรุงงานในสถานประกอบการได้อย่างเหมาะสม",
    rubric: [
      "นำผลการวิจัยหรือการวิเคราะห์ข้อมูลมาเสนอแนวทางแก้ไขปัญหาได้ตรงประเด็นและเหมาะสมด้วยตนเอง",
      "นำผลการวิเคราะห์มาเสนอแนวทางได้เป็นส่วนใหญ่ ต้องปรับแก้เล็กน้อย",
      "เสนอแนวทางได้บางส่วน แต่หลักฐานหรือความเหมาะสมยังไม่เพียงพอ ต้องมีผู้ชี้แนะ",
      "ยังนำผลการวิจัยหรือข้อมูลมาเสนอแนวทางไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "แสดงออกมีความซื่อสัตย์สุจริต",
    domain: "ethics", loCode: "LO5",
    text: "แสดงออกถึงความซื่อสัตย์สุจริตในการปฏิบัติงานของสถานประกอบการ",
    rubric: [
      "แสดงความซื่อสัตย์สุจริตในการปฏิบัติงานอย่างสม่ำเสมอด้วยตนเอง",
      "แสดงความซื่อสัตย์สุจริตได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อยในบางกรณี",
      "ยังมีพฤติกรรมที่ต้องระวังหรือปรับปรุงเป็นครั้งคราว ต้องได้รับคำเตือนเป็นระยะ",
      "พบพฤติกรรมที่ไม่ซื่อสัตย์จนกระทบความน่าเชื่อถือแม้ได้รับคำเตือน",
    ],
  },
  {
    matchText: "แสดงออกถึงความมีวินัยและปฏิบัติตามกฎระเบียบ",
    domain: "ethics", loCode: "LO6",
    text: "แสดงออกถึงความมีวินัยและปฏิบัติตามกฎระเบียบของสถานประกอบการ",
    rubric: [
      "มีวินัยและปฏิบัติตามกฎระเบียบของสถานประกอบการอย่างเคร่งครัดและสม่ำเสมอ",
      "ปฏิบัติตามกฎระเบียบได้เป็นส่วนใหญ่ ต้องได้รับการเตือนเล็กน้อยเป็นครั้งคราว",
      "มีข้อผิดพลาดเรื่องวินัยหรือเวลาเป็นครั้งคราว ต้องได้รับคำเตือนเป็นระยะ",
      "ไม่ปฏิบัติตามกฎระเบียบของสถานประกอบการแม้ได้รับคำเตือน",
    ],
  },
  {
    matchText: "สามารถรับผิดชอบต่องานที่ได้รับมอบหมาย",
    domain: "ethics", loCode: "LO7",
    text: "สามารถรับผิดชอบต่องานที่ได้รับมอบหมาย และส่งมอบงานได้ตามกำหนดเวลา",
    rubric: [
      "รับผิดชอบงานที่ได้รับมอบหมายครบถ้วน และส่งมอบงานตรงตามกำหนดเวลาเสมอด้วยตนเอง",
      "รับผิดชอบและส่งมอบงานตามกำหนดได้เป็นส่วนใหญ่ ต้องได้รับการเตือนเล็กน้อย",
      "ส่งมอบงานล่าช้าหรือต้องถูกติดตามเป็นครั้งคราว แก้ไขได้เมื่อได้รับคำแนะนำ",
      "ไม่รับผิดชอบงานหรือส่งมอบงานไม่ตรงกำหนดเป็นประจำแม้ได้รับคำเตือน",
    ],
  },
  {
    matchText: "แสดงออกถึงความพยายามในการเรียนรู้สิ่งใหม่",
    domain: "character", loCode: "LO8",
    text: "แสดงออกถึงความพยายามในการเรียนรู้สิ่งใหม่ เพื่อพัฒนาความรู้และทักษะที่เกี่ยวข้องกับงานที่ได้รับมอบหมาย",
    rubric: [
      "แสดงความพยายามเรียนรู้สิ่งใหม่อย่างสม่ำเสมอ และนำมาพัฒนาความรู้และทักษะที่เกี่ยวข้องกับงานด้วยตนเอง",
      "แสดงความพยายามเรียนรู้เป็นส่วนใหญ่ พัฒนาตนเองได้เมื่อได้รับคำแนะนำเล็กน้อย",
      "เรียนรู้สิ่งใหม่ได้บางส่วนเมื่อมีผู้ชี้แนะ แต่ยังขาดความต่อเนื่อง",
      "ไม่แสดงความพยายามเรียนรู้หรือพัฒนาตนเองแม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "แสดงออกถึงลักษณะของความเป็นผู้นำ",
    domain: "character", loCode: "LO9",
    text: "แสดงออกถึงลักษณะของความเป็นผู้นำในการทำงานร่วมกับบุคลากรของสถานประกอบการ",
    rubric: [
      "แสดงภาวะผู้นำในการทำงานร่วมกับบุคลากรอย่างเหมาะสมและสม่ำเสมอด้วยตนเอง",
      "แสดงภาวะผู้นำได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "แสดงภาวะผู้นำได้บางสถานการณ์ ยังต้องได้รับการสนับสนุนเป็นระยะ",
      "ไม่แสดงภาวะผู้นำหรือไม่ร่วมมือกับบุคลากรแม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "มีความคิดริเริ่มสร้างสรรค์",
    domain: "character", loCode: "LO10",
    text: "มีความคิดริเริ่มสร้างสรรค์ ในการแก้ปัญหาหรือปรับปรุงกระบวนการทำงานของสถานประกอบการ",
    rubric: [
      "มีความคิดริเริ่มสร้างสรรค์ แก้ปัญหาหรือปรับปรุงกระบวนการทำงานได้ด้วยตนเองและเห็นผล",
      "เสนอแนวคิดหรือปรับปรุงงานได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "มีความคิดริเริ่มบางส่วน แต่ยังนำไปใช้จริงไม่ได้ ต้องมีผู้ชี้แนะ",
      "ไม่แสดงความคิดริเริ่มหรือความพยายามปรับปรุงงานแม้ได้รับคำแนะนำ",
    ],
  },
  {
    matchText: "แสดงออกถึง จิตอาสาและความกระตือรือร้น",
    domain: "character", loCode: "LO11",
    text: "แสดงออกถึงจิตอาสาและความกระตือรือร้นในการช่วยเหลือผู้อื่นหรือสนับสนุนกิจกรรมของสถานประกอบการ",
    rubric: [
      "แสดงจิตอาสาและความกระตือรือร้น ช่วยเหลือผู้อื่นหรือสนับสนุนกิจกรรมของสถานประกอบการอย่างสม่ำเสมอ",
      "ช่วยเหลือผู้อื่นหรือร่วมกิจกรรมได้เป็นส่วนใหญ่ ต้องได้รับการเชิญชวนเล็กน้อย",
      "ช่วยเหลือหรือร่วมกิจกรรมได้บางส่วนเมื่อได้รับมอบหมาย",
      "ไม่แสดงความกระตือรือร้นหรือไม่ช่วยเหลือผู้อื่นแม้ได้รับมอบหมาย",
    ],
  },
];

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
    console.log(DRY_RUN ? "DRY RUN — no changes will be committed\n" : "Updating PA...\n");

    const tpl = await client.query(
      "SELECT id FROM evaluation_templates WHERE id = $1 AND program_id = $2",
      [TEMPLATE_ID, PROGRAM_ID]
    );
    if (tpl.rows.length === 0) {
      throw new Error("PA: template not found — check TEMPLATE_ID/PROGRAM_ID");
    }

    const sec = await client.query(
      "SELECT domain_type, count(*) FROM assessment_sections WHERE template_id = $1 GROUP BY domain_type",
      [TEMPLATE_ID]
    );
    const domains = sec.rows.map((r) => r.domain_type).sort();
    if (domains.join(",") === "character,ethics,knowledge,skills") {
      throw new Error("PA: template already has the 4-domain layout — aborting to avoid duplicates");
    }

    // 1. Snapshot pre-edit state (kind='edit').
    const { rows: snapRows } = await client.query(SNAPSHOT_SQL, [TEMPLATE_ID]);
    await client.query(
      `INSERT INTO template_revisions
         (template_id, kind, snapshot_json, note, created_at)
       VALUES ($1, 'edit', $2::jsonb, $3, now())`,
      [
        TEMPLATE_ID,
        JSON.stringify(snapRows[0] ?? null),
        "แยกด้านทั่วไปเป็น 4 ด้าน + เพิ่มคำอธิบาย rubric (PA)",
      ]
    );
    console.log("  [PA] snapshot -> template_revisions (kind='edit')");

    // 2. Create the 4 domain sections.
    const sectionIds = {};
    for (const s of SECTIONS) {
      const r = await client.query(
        `INSERT INTO assessment_sections (template_id, title_th, domain_type, sequence, part)
         VALUES ($1, $2, $3::domain_type, $4, 1) RETURNING id`,
        [TEMPLATE_ID, s.title_th, s.domain, s.sequence]
      );
      sectionIds[s.domain] = r.rows[0].id;
    }

    // 3. Move/clean each existing question into its domain section.
    const seqByDomain = {};
    for (const q of QUESTIONS) {
      seqByDomain[q.domain] = (seqByDomain[q.domain] ?? 0) + 1;
      const found = await client.query(
        "SELECT id FROM evaluation_questions WHERE template_id = $1 AND text LIKE $2 LIMIT 2",
        [TEMPLATE_ID, `%${q.matchText}%`]
      );
      if (found.rows.length !== 1) {
        throw new Error(`PA: expected 1 question matching "${q.matchText}", found ${found.rows.length}`);
      }
      const questionId = found.rows[0].id;
      await client.query(
        `UPDATE evaluation_questions
           SET section_id = $2, lo_code = $3, text = $4, sequence = $5, updated_at = now()
         WHERE id = $1`,
        [questionId, sectionIds[q.domain], q.loCode, q.text, seqByDomain[q.domain]]
      );
      for (let i = 0; i < 4; i++) {
        await client.query(
          "UPDATE assessment_options SET description_th = $3, updated_at = now() WHERE question_id = $1 AND score = $2",
          [questionId, 4 - i, q.rubric[i]]
        );
      }
    }
    console.log(`  [PA] moved ${QUESTIONS.length} questions, updated ${QUESTIONS.length * 4} option descriptions`);

    // 4. Remove the now-empty 'general' section.
    const del = await client.query(
      "DELETE FROM assessment_sections WHERE template_id = $1 AND domain_type = 'general'",
      [TEMPLATE_ID]
    );
    console.log(`  [PA] removed ${del.rowCount} empty general section(s)`);

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
