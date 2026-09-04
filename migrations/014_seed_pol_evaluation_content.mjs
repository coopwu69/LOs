// Seed evaluation content for POL (รัฐศาสตร์ การเมืองการปกครอง),
// สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์. Had a source document
// registered (parse_status='needs_manual') but 0 evaluation_templates.
//
// Source: "แบบประเมินสหกิจ หลักสูตรการเมืองการปกครอง.docx". Unlike the
// other schools processed so far, this document has no domain labels
// at all (no ด้านความรู้/ทักษะ/จริยธรรม/ลักษณะบุคคล headers) and gives 6 bare
// "LO" statements plus a separate 10-item 1-5 checklist with entirely
// empty rating cells (no rubric text of any kind). There is no
// knowledge-domain statement anywhere in the source -- every LO is
// skills, ethics, or character-flavored -- so this template
// deliberately has 0 knowledge questions rather than fabricating one;
// the wizard already renders sections with no questions as nothing
// (see steps.tsx: `if (!items.length) return null`).
//
// Domain classification (by content, matching the LAW/ANSCI/FSI/INTD
// precedent of grouping by what the statement actually describes):
//   LO1-3 (research/analysis, information handling, communication) -> skills
//   LO4 (responsibility, discipline, rules)                        -> ethics
//   LO5-6 (interpersonal relations, diligence, self-development)   -> character
//
// All 4 rubric levels are authored from scratch (the source gave none),
// using the bare LO text plus supporting detail from the document's
// own 10-item checklist as source material -- same approach as the
// agriculture school's ANSCI/FSI templates.
//
// Safety:
// - Single transaction, rollback on error
// - --dry-run flag prints what would be inserted without committing
// - Idempotent guard: aborts if a template already exists for the program

import { createRequire } from "module";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(__dirname, "..", "web");
const require = createRequire(path.join(webDir, "package.json"));
const { Pool } = require("pg");

const env = readFileSync(path.join(webDir, ".env.local"), "utf8");
const match = env.match(/DATABASE_URL="([^"]+)"/);
process.env.DATABASE_URL = match[1];
const DRY_RUN = process.argv.includes("--dry-run");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const RUBRIC_LABELS = [
  { label: "ระดับดีมาก", score: 4 },
  { label: "ระดับดี", score: 3 },
  { label: "ระดับพอใช้", score: 2 },
  { label: "ระดับควรปรับปรุง", score: 1 },
];

const SECTION_META = {
  skills: { title_th: "ด้านทักษะ (Skills)", sequence: 2 },
  ethics: { title_th: "ด้านจริยธรรม (Ethics)", sequence: 3 },
  character: { title_th: "ด้านลักษณะบุคคล", sequence: 4 },
};

const PROGRAM_ID = "e3358ea1-f598-4cc3-bf4d-047706991322"; // POL
const SOURCE_DOCUMENT_ID = "23270562-c1f8-4a62-bac1-ddf758770981";
const TITLE = "หลักสูตรรัฐศาสตรบัณฑิต สาขาการเมืองการปกครอง";

const QUESTIONS = [
  {
    domain: "skills",
    loCode: "LO1",
    text: "ผู้เรียนมีทักษะการคิด วิเคราะห์ และออกแบบงานวิจัยหรือการศึกษาที่สอดคล้องกับลักษณะงานที่ปฏิบัติ",
    rubric: [
      "วางแผน ปรึกษา และรายงานความคืบหน้าการทำวิจัยหรืองานที่ได้รับมอบหมายได้อย่างเป็นระบบและสม่ำเสมอ ออกแบบแนวทางการศึกษาได้สอดคล้องกับลักษณะงานอย่างเหมาะสม",
      "วางแผนและรายงานความคืบหน้าการทำงานได้ในระดับพื้นฐาน แต่การออกแบบแนวทางการศึกษายังต้องการคำแนะนำเป็นบางครั้ง",
      "วางแผนและรายงานความคืบหน้าการทำงานได้บางส่วน ต้องการการติดตามและให้คำแนะนำอย่างใกล้ชิด",
      "ไม่สามารถวางแผน ปรึกษา หรือรายงานความคืบหน้าการทำงานได้",
    ],
  },
  {
    domain: "skills",
    loCode: "LO2",
    text: "ผู้เรียนมีทักษะในการรับข้อมูลและจับประเด็น เพื่อแยกแยะและจัดสรรข้อมูลต่างๆ ได้อย่างเป็นระเบียบ",
    rubric: [
      "จับประเด็นคำสั่งและปฏิบัติงานตามที่ได้รับมอบหมายได้อย่างถูกต้องครบถ้วน สื่อสารและประสานงานกับผู้ปฏิบัติงานอื่นได้อย่างมีประสิทธิภาพ จัดทำเอกสารได้ถูกต้องตามระเบียบ",
      "จับประเด็นคำสั่งและปฏิบัติงานตามที่ได้รับมอบหมายได้ในระดับพื้นฐาน การประสานงานหรือจัดทำเอกสารยังมีข้อผิดพลาดเล็กน้อย",
      "จับประเด็นคำสั่งได้บางส่วน ต้องการคำอธิบายซ้ำหรือการตรวจสอบเอกสารก่อนดำเนินการ",
      "ไม่สามารถจับประเด็นคำสั่งหรือจัดสรรข้อมูลเพื่อปฏิบัติงานได้",
    ],
  },
  {
    domain: "skills",
    loCode: "LO3",
    text: "ผู้เรียนมีทักษะในการถ่ายทอดและนำเสนอประเด็นต่างๆ ให้สอดคล้องกับลักษณะของงานที่ได้รับมอบหมายได้อย่างถูกต้อง",
    rubric: [
      "อภิปราย ถ่ายทอด และนำเสนอประเด็นเกี่ยวกับงานที่ได้รับมอบหมายได้อย่างมีประสิทธิภาพและชัดเจน เหมาะสมกับผู้ฟังในทุกสถานการณ์",
      "ถ่ายทอดและนำเสนอประเด็นเกี่ยวกับงานที่ได้รับมอบหมายได้ในระดับพื้นฐาน แต่ยังขาดความชัดเจนในบางประเด็น",
      "ถ่ายทอดและนำเสนอประเด็นได้บางส่วน ต้องการการปรับปรุงด้านความชัดเจนและการจัดลำดับเนื้อหา",
      "ไม่สามารถถ่ายทอดหรือนำเสนอประเด็นเกี่ยวกับงานที่ได้รับมอบหมายได้",
    ],
  },
  {
    domain: "ethics",
    loCode: "LO4",
    text: "ผู้เรียนมีความรับผิดชอบในการปฏิบัติงาน มีวินัย และเคารพกฎเกณฑ์ต่างๆ ของหน่วยงาน",
    rubric: [
      "ปฏิบัติงานด้วยความรับผิดชอบอย่างครบถ้วน ตรงต่อเวลา แต่งกายและปฏิบัติตนเหมาะสมกับหน่วยงานอย่างสม่ำเสมอ เคารพกฎระเบียบของหน่วยงานได้อย่างเคร่งครัด",
      "ปฏิบัติงานด้วยความรับผิดชอบและตรงต่อเวลาในระดับพื้นฐาน เคารพกฎระเบียบของหน่วยงานได้ แต่การแต่งกายหรือมารยาทบางครั้งยังไม่เหมาะสม",
      "มีความรับผิดชอบและวินัยบางส่วน ต้องได้รับการตักเตือนเรื่องความตรงต่อเวลาหรือกฎระเบียบเป็นครั้งคราว",
      "ขาดความรับผิดชอบต่อการปฏิบัติงาน ไม่ตรงต่อเวลาและไม่เคารพกฎระเบียบของหน่วยงาน",
    ],
  },
  {
    domain: "character",
    loCode: "LO5",
    text: "ผู้เรียนมีมนุษยสัมพันธ์ที่ดี มีจิตสาธารณะ และพร้อมช่วยเหลือเพื่อนร่วมงาน",
    rubric: [
      "มีความอ่อนน้อมถ่อมตนและมนุษยสัมพันธ์ที่ดีกับเจ้าหน้าที่ในหน่วยงานอย่างสม่ำเสมอ กล้าแสดงออกและพร้อมให้ความช่วยเหลือเพื่อนร่วมงานอย่างเต็มใจ",
      "มีมนุษยสัมพันธ์ที่ดีกับเพื่อนร่วมงานในระดับพื้นฐาน ให้ความช่วยเหลือเมื่อได้รับการร้องขอ",
      "มีปฏิสัมพันธ์กับเพื่อนร่วมงานบางส่วน ยังไม่ค่อยกล้าแสดงออกหรือให้ความช่วยเหลือผู้อื่น",
      "ไม่มีมนุษยสัมพันธ์ที่ดีกับเพื่อนร่วมงาน ไม่แสดงความช่วยเหลือหรือจิตสาธารณะ",
    ],
  },
  {
    domain: "character",
    loCode: "LO6",
    text: "ผู้เรียนมีความใฝ่รู้ ขยัน อดทน และพร้อมพัฒนาตนเองอยู่เสมอ",
    rubric: [
      "แสดงความขยันหมั่นเพียรและความใฝ่รู้อย่างต่อเนื่อง แสวงหาโอกาสพัฒนาตนเองและอดทนต่ออุปสรรคในการทำงานได้เป็นอย่างดี",
      "มีความขยันและใฝ่รู้ในระดับพื้นฐาน พัฒนาตนเองได้เมื่อได้รับคำแนะนำ",
      "มีความขยันหรือความใฝ่รู้บางส่วน ยังขาดความอดทนต่ออุปสรรคในการทำงาน",
      "ไม่แสดงความขยัน ใฝ่รู้ หรือความพยายามพัฒนาตนเอง",
    ],
  },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log(DRY_RUN ? "DRY RUN — no changes will be committed\n" : "Seeding...\n");

    const existing = await client.query(
      "SELECT id FROM evaluation_templates WHERE program_id = $1",
      [PROGRAM_ID]
    );
    if (existing.rows.length > 0) {
      throw new Error(`POL: a template already exists (id=${existing.rows[0].id}) — aborting to avoid duplicates`);
    }

    const templateResult = await client.query(
      `INSERT INTO evaluation_templates
         (program_id, title, name, source_document_id, status, status_enum, needs_review, extraction_confidence)
       VALUES ($1, $2, $2, $3, 'draft', 'draft', true, 1.00)
       RETURNING id`,
      [PROGRAM_ID, TITLE, SOURCE_DOCUMENT_ID]
    );
    const templateId = templateResult.rows[0].id;
    console.log(`  [POL] template ${templateId}`);

    const sectionIds = {};
    for (const domain of ["skills", "ethics", "character"]) {
      const meta = SECTION_META[domain];
      const sectionResult = await client.query(
        `INSERT INTO assessment_sections (template_id, title_th, domain_type, sequence)
         VALUES ($1, $2, $3::domain_type, $4)
         RETURNING id`,
        [templateId, meta.title_th, domain, meta.sequence]
      );
      sectionIds[domain] = sectionResult.rows[0].id;
    }

    const seqByDomain = { skills: 0, ethics: 0, character: 0 };
    for (const q of QUESTIONS) {
      seqByDomain[q.domain] += 1;
      const questionResult = await client.query(
        `INSERT INTO evaluation_questions
           (template_id, section_id, text, lo_code, question_type, is_required, sequence)
         VALUES ($1, $2, $3, $4, 'single_choice', true, $5)
         RETURNING id`,
        [templateId, sectionIds[q.domain], q.text, q.loCode, seqByDomain[q.domain]]
      );
      const questionId = questionResult.rows[0].id;

      for (let i = 0; i < RUBRIC_LABELS.length; i++) {
        const { label, score } = RUBRIC_LABELS[i];
        await client.query(
          `INSERT INTO assessment_options (question_id, label_th, description_th, score, sequence)
           VALUES ($1, $2, $3, $4, $5)`,
          [questionId, label, q.rubric[i], score, i + 1]
        );
      }
    }
    console.log(`  [POL] ${QUESTIONS.length} questions, ${QUESTIONS.length * RUBRIC_LABELS.length} options across 3 sections (no knowledge-domain content in source)`);

    await client.query(
      `UPDATE assessment_source_documents SET parse_status = 'parsed', extraction_confidence = 1.00 WHERE id = $1`,
      [SOURCE_DOCUMENT_ID]
    );

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
