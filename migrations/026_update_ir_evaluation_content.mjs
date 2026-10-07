// Update evaluation content for IR (รัฐศาสตร์ ความสัมพันธ์ระหว่างประเทศ),
// สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์.
//
// Source: "IRสถานประกอบการการนำความรู้ไปใช้และความสามารถ.docx" — the new
// workplace-side (สถานประกอบการ) competency evaluation for IR year-4
// students. The existing template was auto-parsed from the older document
// "LO และแบบสอบถาม - หลักสูตรรัฐศาสตร์ IR 2567.docx" into a single
// 'general' section holding 15 LO statements with bare 4/3/2/1 options
// and no rubric text. The new source is fully structured:
//   - ด้านความรู้    5 questions + full 4-level rubrics
//   - ด้านทักษะ      5 questions + full 4-level rubrics
//   - ด้านจริยธรรม   3 questions (questions only — source gives no rubric
//                  rows for ethics/character, so description_th stays NULL;
//                  the UI falls back to the label like the report step)
//   - ด้านลักษณะบุคคล 3 questions (same, no rubric rows in source)
//
// Requested semantics (user): "แก้ไขของเก่า ของเก่าก็เก็บเป็น log ไว้
// เสมือนผู้ใช้แก้เองจริง" — so this migration mirrors the app's own
// saveTemplate() flow exactly: snapshot the pre-edit state into
// template_revisions (kind='edit', same snapshotCurrent() SQL) BEFORE
// mutating, then reconcile sections/questions/options in place. The old
// 15-question content is recoverable from /history restore.
//
// Safety:
// - Single transaction, rollback on error
// - --dry-run prints the plan without committing
// - Aborts if the IR template is missing or was already migrated to the
//   4-domain layout (idempotent guard)

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

const PROGRAM_ID = "2dc8a1bc-d457-472d-91c9-cdfc69d31234"; // IR
const TEMPLATE_ID = "bfbda363-e985-407e-94c1-61a02c18109c";

const RUBRIC_LABELS = [
  { label: "ระดับดีมาก", score: 4 },
  { label: "ระดับดี", score: 3 },
  { label: "ระดับพอใช้", score: 2 },
  { label: "ระดับควรปรับปรุง", score: 1 },
];

const SECTIONS = [
  { domain: "knowledge", title_th: "ด้านความรู้", sequence: 1 },
  { domain: "skills", title_th: "ด้านทักษะ", sequence: 2 },
  { domain: "ethics", title_th: "ด้านจริยธรรม", sequence: 3 },
  { domain: "character", title_th: "ด้านลักษณะบุคคล", sequence: 4 },
];

// rubric: [score-4, score-3, score-2, score-1] description_th; null => no rubric text in source
const QUESTIONS = [
  // ---- ด้านความรู้ ----
  {
    domain: "knowledge", loCode: "LO1",
    text: "นักศึกษาสามารถอธิบายสถานการณ์ระหว่างประเทศและผลกระทบต่อภารกิจของหน่วยงาน ลูกค้า หรือคู่ความร่วมมือได้ถูกต้องเพียงใด?",
    rubric: [
      "อธิบายสถานการณ์ได้ถูกต้อง และเชื่อมโยงผลกระทบต่อหน่วยงาน หรือผู้ที่เกี่ยวข้องได้ชัดเจนด้วยตนเอง",
      "อธิบายสถานการณ์และผลกระทบที่เกี่ยวข้องกับงานได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "อธิบายเหตุการณ์พื้นฐานได้ แต่ยังเชื่อมโยงผลกระทบต่องานไม่ชัดเจน ต้องได้รับคำแนะนำเป็นระยะ",
      "อธิบายสถานการณ์คลาดเคลื่อนในสาระสำคัญ หรือยังเชื่อมโยงกับงานไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    domain: "knowledge", loCode: "LO2",
    text: "นักศึกษาสามารถนำแนวคิดและความรู้ด้านความสัมพันธ์ระหว่างประเทศมาอธิบายปัญหาและประยุกต์ใช้กับงานที่ได้รับมอบหมายได้เหมาะสมเพียงใด?",
    rubric: [
      "เลือกใช้แนวคิดหรือความรู้ได้ตรงกับปัญหา อธิบายเหตุผล และประยุกต์ใช้กับงานได้ด้วยตนเอง",
      "ใช้แนวคิดหรือความรู้กับงานได้เหมาะสมเป็นส่วนใหญ่ ต้องได้รับคำแนะนำหรือปรับแก้เล็กน้อย",
      "ระบุแนวคิดหรือความรู้ที่เกี่ยวข้องได้ แต่ยังนำมาใช้กับงานได้จำกัด ต้องมีผู้ช่วยชี้แนวทาง",
      "เลือกใช้แนวคิดไม่สอดคล้องกับปัญหา หรือยังนำความรู้มาใช้กับงานไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    domain: "knowledge", loCode: "LO3",
    text: "นักศึกษาสามารถอธิบายบริบททางการเมือง เศรษฐกิจ สังคม และวัฒนธรรมของประเทศหรือภูมิภาคที่เกี่ยวข้องกับงานได้ถูกต้องเพียงใด?",
    rubric: [
      "อธิบายบริบทของประเทศหรือภูมิภาคในมิติที่เกี่ยวข้องกับงานได้ถูกต้อง และชี้ได้ว่าบริบทนั้นส่งผลต่อการทำงานอย่างไร",
      "อธิบายบริบทที่เกี่ยวข้องได้ถูกต้องเป็นส่วนใหญ่ แต่ยังขาดรายละเอียดบางประเด็น ต้องได้รับคำแนะนำเล็กน้อย",
      "ให้ข้อมูลพื้นฐานได้บางส่วน แต่ยังอธิบายความเกี่ยวข้องกับงานไม่ชัดเจน ต้องได้รับคำแนะนำเป็นระยะ",
      "ให้ข้อมูลคลาดเคลื่อนในสาระสำคัญ หรือยังอธิบายบริบทที่จำเป็นต่องานไม่ได้แม้ได้รับคำแนะนำ",
    ],
  },
  {
    domain: "knowledge", loCode: "LO4",
    text: "นักศึกษาสามารถเชื่อมโยงข้อมูลเพื่อวิเคราะห์สาเหตุของปัญหา เปรียบเทียบทางเลือก และเสนอแนวทางที่มีเหตุผลรองรับได้เพียงใด?",
    rubric: [
      "เชื่อมโยงข้อมูล ระบุสาเหตุ เปรียบเทียบข้อดีและข้อจำกัดของทางเลือก และเสนอแนวทางที่มีหลักฐานรองรับและเหมาะกับหน่วยงานได้ด้วยตนเอง",
      "วิเคราะห์สาเหตุและเสนอทางเลือกที่มีเหตุผลได้ แต่การเปรียบเทียบหรือหลักฐานบางส่วนยังต้องปรับแก้เล็กน้อย",
      "ระบุปัญหาและเสนอทางเลือกได้บางส่วน แต่เหตุผลหรือหลักฐานยังไม่เพียงพอ ต้องมีผู้ช่วยชี้แนวทาง",
      "ยังวิเคราะห์สาเหตุไม่ได้ หรือเสนอทางเลือกที่ไม่สอดคล้องกับข้อมูลและบริบทของหน่วยงานแม้ได้รับคำแนะนำ",
    ],
  },
  {
    domain: "knowledge", loCode: "LO5",
    text: "นักศึกษาสามารถนำความรู้ทางวิชาการมาจัดทำผลงานที่มีข้อมูลถูกต้อง มีแหล่งอ้างอิง และตอบโจทย์ของหน่วยงานได้เพียงใด?",
    rubric: [
      "จัดทำผลงานด้วยตนเอง มีข้อมูลถูกต้อง แหล่งอ้างอิงตรวจสอบได้ และตอบโจทย์จนหน่วยงานนำไปใช้ได้",
      "ผลงานมีข้อมูลและแหล่งอ้างอิงเหมาะสม ตอบโจทย์ของหน่วยงาน แต่ต้องปรับแก้เล็กน้อยก่อนใช้",
      "ผลงานตอบโจทย์บางส่วน แต่ข้อมูลหรือแหล่งอ้างอิงยังไม่ครบ ต้องได้รับคำแนะนำและปรับแก้หลายส่วนก่อนใช้",
      "ผลงานมีข้อผิดพลาดในสาระสำคัญ ขาดแหล่งอ้างอิงที่จำเป็น หรือยังไม่ตอบโจทย์จนต้องปรับแก้เป็นส่วนใหญ่",
    ],
  },
  // ---- ด้านทักษะ ----
  {
    domain: "skills", loCode: "LO6",
    text: "นักศึกษาสามารถสืบค้น ตรวจสอบความน่าเชื่อถือ คัดกรอง และสรุปข้อมูลที่จำเป็นต่อการทำงานได้ถูกต้องและตรงกับภารกิจเพียงใด?",
    rubric: [
      "สืบค้นจากแหล่งที่น่าเชื่อถือ ตรวจสอบ คัดกรอง และสรุปข้อมูลได้ถูกต้อง ตรงกับภารกิจด้วยตนเอง",
      "จัดการข้อมูลได้ถูกต้องเป็นส่วนใหญ่ ต้องได้รับคำแนะนำหรือแก้ไขเล็กน้อย",
      "สืบค้นข้อมูลได้ แต่ยังตรวจสอบ คัดกรอง หรือสรุปได้ไม่ครบ ต้องได้รับคำแนะนำเป็นระยะ",
      "ข้อมูลคลาดเคลื่อนหรือไม่ตรงกับงาน และยังจัดการข้อมูลไม่ได้ตามมาตรฐานแม้ได้รับคำแนะนำ",
    ],
  },
  {
    domain: "skills", loCode: "LO7",
    text: "นักศึกษาสามารถใช้โปรแกรมและระบบดิจิทัลเพื่อจัดทำเอกสาร วิเคราะห์ข้อมูล และนำเสนอผลงานได้เหมาะสมกับงานเพียงใด?",
    rubric: [
      "เลือกและใช้โปรแกรมหรือระบบดิจิทัลได้เหมาะกับงาน จัดทำผลงานถูกต้องและพร้อมใช้งานด้วยตนเอง",
      "ใช้โปรแกรมหรือระบบที่จำเป็นได้ ผลงานเป็นไปตามมาตรฐาน ต้องได้รับคำแนะนำเล็กน้อย",
      "ใช้งานพื้นฐานได้ แต่ต้องได้รับความช่วยเหลือเป็นระยะ และปรับแก้ผลงานก่อนใช้",
      "ยังใช้เครื่องมือที่จำเป็นต่องานไม่ได้ตามมาตรฐาน ต้องได้รับความช่วยเหลือใกล้ชิด",
    ],
  },
  {
    domain: "skills", loCode: "LO8",
    text: "นักศึกษาสามารถสื่อสารประเด็น เขียนเอกสาร ประสานงาน และตอบคำถามได้ชัดเจนและตรงประเด็นเพียงใด?",
    rubric: [
      "สื่อสารและเขียนเอกสารได้ชัดเจน เหมาะกับผู้รับ ประสานงานครบถ้วน และตอบคำถามตรงประเด็นด้วยตนเอง",
      "สื่อสารและประสานงานได้เข้าใจ ผลงานต้องปรับแก้เล็กน้อย หรือมีบางประเด็นที่ต้องช่วยชี้แนะ",
      "สื่อสารสาระสำคัญได้บางส่วน แต่ยังไม่ชัดเจนหรือไม่ครบ ต้องช่วยเรียบเรียงและติดตามการประสานงาน",
      "สื่อสารคลาดเคลื่อนหรือขาดสาระสำคัญจนกระทบงาน ต้องได้รับคำแนะนำใกล้ชิด",
    ],
  },
  {
    domain: "skills", loCode: "LO9",
    text: "นักศึกษาสามารถใช้ภาษาอังกฤษและภาษาที่สามสนับสนุนการปฏิบัติงานตามภารกิจที่ได้รับมอบหมายได้เหมาะสมเพียงใด?",
    rubric: [
      "ใช้ภาษาที่จำเป็นต่อภารกิจได้ถูกต้อง สื่อความชัดเจน และเหมาะกับบริบท โดยทำงานได้ด้วยตนเอง",
      "ใช้ภาษาทำงานได้เป็นส่วนใหญ่ มีข้อผิดพลาดเล็กน้อยที่ไม่กระทบความหมาย และต้องช่วยตรวจแก้บางจุด",
      "ใช้ภาษากับงานพื้นฐานได้ แต่ต้องช่วยแปล อธิบาย หรือปรับแก้เป็นระยะเพื่อให้สื่อความถูกต้อง",
      "ยังใช้ภาษาทำภารกิจไม่ได้ตามมาตรฐาน มีข้อผิดพลาดที่กระทบความหมาย และต้องได้รับความช่วยเหลือใกล้ชิด",
    ],
  },
  {
    domain: "skills", loCode: "LO10",
    text: "นักศึกษาสามารถดูแลตนเอง จัดการความเครียด และปรับบุคลิกภาพให้พร้อมและเหมาะสมกับการปฏิบัติงานได้เพียงใด?",
    rubric: [
      "เตรียมตนเองพร้อมทำงาน จัดการความกดดัน ขอความช่วยเหลือเมื่อจำเป็น และปรับบุคลิกภาพให้เหมาะกับงานได้ด้วยตนเอง",
      "มีความพร้อมและรับมือกับความกดดันได้เป็นส่วนใหญ่ ต้องได้รับคำแนะนำเล็กน้อย",
      "ความพร้อมยังไม่สม่ำเสมอ เมื่อเผชิญความกดดันต้องได้รับคำแนะนำเป็นระยะเพื่อกลับมาปฏิบัติงานได้",
      "ยังจัดการความพร้อมหรือความกดดันไม่ได้จนกระทบการปฏิบัติงาน และต้องได้รับการช่วยเหลือใกล้ชิด",
    ],
  },
  // ---- ด้านจริยธรรม (source has questions only, no rubric rows) ----
  {
    domain: "ethics", loCode: "LO11",
    text: "นักศึกษารับผิดชอบงานที่ได้รับมอบหมาย ส่งงานตามกำหนด และติดตามแก้ไขข้อผิดพลาดของตนได้เพียงใด?",
    rubric: null,
  },
  {
    domain: "ethics", loCode: "LO12",
    text: "นักศึกษารายงานข้อมูลตามความเป็นจริง ปฏิบัติตามระเบียบ และรักษาความลับของหน่วยงานได้เหมาะสมเพียงใด?",
    rubric: null,
  },
  {
    domain: "ethics", loCode: "LO13",
    text: "นักศึกษารับฟังความคิดเห็นที่แตกต่าง และปฏิบัติต่อเพื่อนร่วมงานหรือผู้รับบริการอย่างให้เกียรติและไม่เลือกปฏิบัติเพียงใด?",
    rubric: null,
  },
  // ---- ด้านลักษณะบุคคล (source has questions only, no rubric rows) ----
  {
    domain: "character", loCode: "LO14",
    text: "นักศึกษาร่วมมือกับทีม ปฏิบัติตามบทบาทที่ได้รับ และจัดการความเห็นต่างเพื่อให้งานบรรลุเป้าหมายร่วมกันได้เพียงใด?",
    rubric: null,
  },
  {
    domain: "character", loCode: "LO15",
    text: "นักศึกษาแสดงความตั้งใจเรียนรู้งาน รับฟังข้อเสนอแนะ และนำไปปรับปรุงการปฏิบัติงานของตนได้เพียงใด?",
    rubric: null,
  },
  {
    domain: "character", loCode: "LO16",
    text: "นักศึกษาริเริ่มหรือช่วยขับเคลื่อนงานตามโอกาส และปรับบทบาทเป็นผู้นำหรือผู้ตามให้เหมาะกับสถานการณ์ได้เพียงใด?",
    rubric: null,
  },
];

// Exact same query as snapshotCurrent() in
// web/src/app/programs/[programId]/edit/actions.ts — the restore button and
// /history page depend on this shape, do not change it.
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
    console.log(DRY_RUN ? "DRY RUN — no changes will be committed\n" : "Updating IR...\n");

    const tpl = await client.query(
      "SELECT id FROM evaluation_templates WHERE id = $1 AND program_id = $2",
      [TEMPLATE_ID, PROGRAM_ID]
    );
    if (tpl.rows.length === 0) {
      throw new Error("IR: template not found — check TEMPLATE_ID/PROGRAM_ID");
    }

    // Idempotent guard: if the template is already in the 4-domain layout this
    // migration produces, stop rather than duplicating content.
    const sec = await client.query(
      "SELECT domain_type, count(*) FROM assessment_sections WHERE template_id = $1 GROUP BY domain_type",
      [TEMPLATE_ID]
    );
    const domains = sec.rows.map((r) => r.domain_type).sort();
    if (domains.join(",") === "character,ethics,knowledge,skills") {
      throw new Error("IR: template already has the 4-domain layout — aborting to avoid duplicates");
    }

    // 1. Snapshot pre-edit state into template_revisions (kind='edit') — same
    //    as a user pressing Save in the program editor. Old content stays
    //    restorable from /programs/ir/history.
    const { rows: snapRows } = await client.query(SNAPSHOT_SQL, [TEMPLATE_ID]);
    await client.query(
      `INSERT INTO template_revisions
         (template_id, kind, snapshot_json, note, created_at)
       VALUES ($1, 'edit', $2::jsonb, $3, now())`,
      [
        TEMPLATE_ID,
        JSON.stringify(snapRows[0] ?? null),
        "แก้ไขแบบประเมินตามเอกสาร IRสถานประกอบการการนำความรู้ไปใช้และความสามารถ.docx",
      ]
    );
    console.log("  [IR] snapshot -> template_revisions (kind='edit')");

    // 2. Register the new source document for provenance.
    const doc = await client.query(
      `INSERT INTO assessment_source_documents
         (program_id, filename, file_path, file_type, faculty_folder, parse_status, extraction_confidence)
       VALUES ($1, $2, $3, 'docx', $4, 'parsed', 1.00)
       RETURNING id`,
      [
        PROGRAM_ID,
        "IRสถานประกอบการการนำความรู้ไปใช้และความสามารถ.docx",
        "4. สำนักรัฐศาสตร์ฯ 3 หลักสูตร/IRสถานประกอบการการนำความรู้ไปใช้และความสามารถ.docx",
        "4. สำนักรัฐศาสตร์ฯ 3 หลักสูตร",
      ]
    );
    const sourceDocId = doc.rows[0].id;
    await client.query(
      "UPDATE evaluation_templates SET source_document_id = $2, updated_at = now() WHERE id = $1",
      [TEMPLATE_ID, sourceDocId]
    );
    console.log(`  [IR] source document ${sourceDocId}`);

    // 3. Wipe old content (options -> questions -> sections). Old rows are
    //    preserved in the revision snapshot above.
    await client.query(
      `DELETE FROM assessment_options WHERE question_id IN
         (SELECT id FROM evaluation_questions WHERE template_id = $1)`,
      [TEMPLATE_ID]
    );
    await client.query("DELETE FROM evaluation_questions WHERE template_id = $1", [TEMPLATE_ID]);
    await client.query("DELETE FROM assessment_sections WHERE template_id = $1", [TEMPLATE_ID]);
    console.log("  [IR] cleared old sections/questions/options");

    // 4. Insert new 4-domain layout.
    const sectionIds = {};
    for (const s of SECTIONS) {
      const r = await client.query(
        `INSERT INTO assessment_sections (template_id, title_th, domain_type, sequence, part)
         VALUES ($1, $2, $3::domain_type, $4, 1) RETURNING id`,
        [TEMPLATE_ID, s.title_th, s.domain, s.sequence]
      );
      sectionIds[s.domain] = r.rows[0].id;
    }

    const seqByDomain = {};
    for (const q of QUESTIONS) {
      seqByDomain[q.domain] = (seqByDomain[q.domain] ?? 0) + 1;
      const qr = await client.query(
        `INSERT INTO evaluation_questions
           (template_id, section_id, text, lo_code, question_type, is_required, sequence)
         VALUES ($1, $2, $3, $4, 'single_choice', true, $5) RETURNING id`,
        [TEMPLATE_ID, sectionIds[q.domain], q.text, q.loCode, seqByDomain[q.domain]]
      );
      const questionId = qr.rows[0].id;
      for (let i = 0; i < RUBRIC_LABELS.length; i++) {
        const { label, score } = RUBRIC_LABELS[i];
        await client.query(
          `INSERT INTO assessment_options (question_id, label_th, description_th, score, sequence)
           VALUES ($1, $2, $3, $4, $5)`,
          [questionId, label, q.rubric ? q.rubric[i] : null, score, i + 1]
        );
      }
    }
    console.log(`  [IR] 4 sections, ${QUESTIONS.length} questions, ${QUESTIONS.length * 4} options`);

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
