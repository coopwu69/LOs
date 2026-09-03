// Seed evaluation content for INTD (การออกแบบภายใน — Interior Design),
// สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ. Previously 0 evaluation
// templates. ARCH (the school's other program) is intentionally left
// alone here — no source document for it yet.
//
// Source: "ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา-ออกแบบภายใน.xlsx"
// (assessment_source_documents id fddc4cd2-7a38-4393-82b3-3368b213f0d4,
// parse_status='needs_manual' — XLSX PLO matrices are never
// auto-parsed). Sheet "แบบประเมิน LOs" already contains complete,
// ready-to-use 5-level rubrics (ยอดเยี่ยม/ดีมาก/ดี/พอใช้/ควรปรับปรุง) for
// 6 CLOs across all 4 domains — unlike the agriculture school's source
// docs, this content is reproduced verbatim, not authored from
// scratch. Two PLOs (PLO11, PLO13) appear in the reference PLO list
// but were not turned into separate evaluation items in the school's
// own "แบบประเมิน LOs" sheet, so they are omitted here too.
//
// This is a 5-level (legacy_5) rubric, not the project's 4-level
// standard — reproduced as-is to stay faithful to the source; the
// dashboard already has a first-class "legacy_5" status for exactly
// this case (see web/src/lib/db.ts getSchoolsWithProgress).
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
  { label: "ยอดเยี่ยม", score: 5 },
  { label: "ดีมาก", score: 4 },
  { label: "ดี", score: 3 },
  { label: "พอใช้", score: 2 },
  { label: "ควรปรับปรุง", score: 1 },
];

const SECTION_META = {
  knowledge: { title_th: "ด้านความรู้ (Knowledge)", sequence: 1 },
  skills: { title_th: "ด้านทักษะ (Skills)", sequence: 2 },
  ethics: { title_th: "ด้านจริยธรรม (Ethics)", sequence: 3 },
  character: { title_th: "ด้านลักษณะบุคคล", sequence: 4 },
};

const PROGRAM_ID = "e8c356e2-db95-4845-a003-296252e73e8b"; // INTD
const SOURCE_DOCUMENT_ID = "fddc4cd2-7a38-4393-82b3-3368b213f0d4";
const TITLE = "หลักสูตรการออกแบบภายใน สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ มหาวิทยาลัยวลัยลักษณ์";
const VERSION_LABEL = "2567";

const QUESTIONS = [
  {
    domain: "knowledge",
    loCode: "LO1",
    text: "นักศึกษาสามารถเรียนรู้หลักการหรือองค์ความรู้ด้านออกแบบภายใน การเขียนแบบตามมาตรฐานงานก่อสร้าง การประมาณราคา และสามารถประยุกต์ใช้ทำงานภายในสถานประกอบการได้",
    rubric: [
      "นักศึกษาสามารถเรียนรู้หลักการหรือองค์ความรู้ และสามารถประยุกต์ใช้กับการทำงานได้อย่างยอดเยี่ยม และมีการพัฒนาต่อยอดอย่างมีประสิทธิภาพ",
      "นักศึกษาสามารถเรียนรู้หลักการหรือองค์ความรู้ และสามารถประยุกต์ใช้กับการทำงานได้อย่างดี และมีการพัฒนาต่อยอด",
      "นักศึกษาสามารถเรียนรู้หลักการหรือองค์ความรู้ และสามารถประยุกต์ใช้กับการทำงานได้อย่างดี",
      "นักศึกษาสามารถเรียนรู้หลักการหรือองค์ความรู้ และสามารถประยุกต์ใช้กับการทำงานได้ตามมาตรฐาน",
      "นักศึกษาไม่สามารถเรียนรู้หลักการหรือองค์ความรู้ และไม่สามารถประยุกต์ใช้กับการทำงานได้",
    ],
  },
  {
    domain: "skills",
    loCode: "LO2",
    text: "นักศึกษาสามารถทำความเข้าใจการดำเนินงาน หรือกระบวนการการออกแบบภายใน ที่สามารถตอบวัตถุประสงค์ของโครงการ และสามารถปฏิบัติตามได้อย่างถูกต้อง",
    rubric: [
      "นักศึกษาสามารถทำความเข้าใจการดำเนินงาน หรือกระบวนการการออกแบบภายในและสามารถปฏิบัติตามได้อย่างยอดเยี่ยม และมีการพัฒนาต่อเนื่อง",
      "นักศึกษาสามารถทำความเข้าใจการดำเนินงาน หรือกระบวนการการออกแบบภายในและสามารถปฏิบัติตามได้อย่างดี และมีการพัฒนาต่อเนื่อง",
      "นักศึกษาสามารถทำความเข้าใจการดำเนินงาน หรือกระบวนการการออกแบบภายในและสามารถปฏิบัติตามได้อย่างดี",
      "นักศึกษาสามารถทำความเข้าใจการดำเนินงาน หรือกระบวนการการออกแบบภายในและสามารถปฏิบัติตามได้ตามมาตรฐาน",
      "นักศึกษาไม่สามารถทำความเข้าใจการดำเนินงาน หรือกระบวนการการออกแบบภายในและไม่สามารถปฏิบัติตามได้ตามมาตรฐาน",
    ],
  },
  {
    domain: "skills",
    loCode: "LO3",
    text: "นักศึกษามีทักษะการเขียนแบบ การสร้างงานสามมิติ, ทัศนียภาพ การสร้างแบบจำลอง หรือการจัดทำงานเพื่อนำเสนอเกี่ยวกับโครงการออกแบบภายใน และสามารถใช้งานเครื่องมือ, เทคโนโลยีที่เกี่ยวข้องกับการทำงานออกแบบภายในได้",
    rubric: [
      "นักศึกษามีทักษะการทำงานที่ครบตามผลลัพท์การเรียนรู้รายวิชา และสามารถใช้เครื่องมือ, เทคโนโลยีได้อย่างยอดเยี่ยม และมีการพัฒนามากขึ้นอย่างต่อเนื่อง",
      "นักศึกษามีทักษะการทำงานที่ครบตามผลลัพท์การเรียนรู้รายวิชา และสามารถใช้เครื่องมือ, เทคโนโลยีได้อย่างดี และมีการพัฒนามากขึ้น",
      "นักศึกษามีทักษะการทำงานที่ครบตามผลลัพท์การเรียนรู้รายวิชา และสามารถใช้เครื่องมือ, เทคโนโลยีได้อย่างดี",
      "นักศึกษามีทักษะการทำงานตามผลลัพท์การเรียนรู้รายวิชาบางส่วน และสามารถใช้เครื่องมือ, เทคโนโลยีได้ตามมาตรฐาน",
      "นักศึกษาไม่มีทักษะการทำงานตามผลลัพท์การเรียนรู้รายวิชา และไม่สามารถใช้เครื่องมือ, เทคโนโลยีได้",
    ],
  },
  {
    domain: "skills",
    loCode: "LO4",
    text: "นักศึกษามีทักษะในการสื่อสารด้วยการฟัง พูด อ่าน เขียน เพื่อการนำเสนอผลงานตามวัตถุประสงค์ และติดต่อประสานงานทั้งภายในและภายนอกองค์กรได้",
    rubric: [
      "นักศึกษามีทักษะในการสื่อสารด้วยการฟัง พูด อ่าน เขียน และสามารถนำเสนอผลงานได้อย่างยอดเยี่ยม สามารถติดต่อประสานงานได้อย่างมีประสิทธิภาพ",
      "นักศึกษามีทักษะในการสื่อสารด้วยการฟัง พูด อ่าน เขียน และสามารถนำเสนอผลงานได้อย่างดี สามารถติดต่อประสานงานได้อย่างมีประสิทธิภาพ",
      "นักศึกษามีทักษะในการสื่อสารด้วยการฟัง พูด อ่าน เขียน และสามารถนำเสนอผลงานได้อย่างดี สามารถติดต่อประสานงานได้",
      "นักศึกษามีทักษะในการสื่อสารด้วยการฟัง พูด อ่าน เขียน และสามารถนำเสนอผลงานได้ สามารถติดต่อประสานงานได้",
      "นักศึกษาไม่มีทักษะในการสื่อสารด้วยการฟัง พูด อ่าน เขียน และไม่สามารถนำเสนอผลงาน ไม่สามารถติดต่อประสานงานได้",
    ],
  },
  {
    domain: "ethics",
    loCode: "LO5",
    text: "นักศึกษามีความซื่อสัตย์สุจริต มีความรับผิดชอบและกระทำตามกฏระเบียบ, นโยบายปฏิบัติ หรือ ข้อกำหนดขององค์กรได้",
    rubric: [
      "นักศึกษามีความซื่อสัตย์สุจริต มีความรับผิดชอบสูง และกระทำตามกฏระเบียบ, นโยบายปฏิบัติ หรือ ข้อกำหนดขององค์กรได้อย่างยอดเยี่ยม",
      "นักศึกษามีความซื่อสัตย์สุจริต มีความรับผิดชอบสูง และกระทำตามกฏระเบียบ, นโยบายปฏิบัติ หรือ ข้อกำหนดขององค์กรได้อย่างดีมาก",
      "นักศึกษามีความซื่อสัตย์สุจริต มีความรับผิดชอบ และกระทำตามกฏระเบียบ, นโยบายปฏิบัติ หรือ ข้อกำหนดขององค์กรได้อย่างดี",
      "นักศึกษามีความซื่อสัตย์สุจริต มีความรับผิดชอบ และกระทำตามกฏระเบียบ, นโยบายปฏิบัติ หรือ ข้อกำหนดขององค์กรได้",
      "นักศึกษามีความซื่อสัตย์สุจริต มีความรับผิดชอบที่ต่ำ หรือไม่มี และไม่กระทำตามกฏระเบียบ, นโยบายปฏิบัติ หรือ ข้อกำหนดขององค์กร",
    ],
  },
  {
    domain: "character",
    loCode: "LO6",
    text: "นักศึกษาแสดงออกถึงบุคลิกภาพที่ดี มีความคิดเชิงสร้างสรรค์และมีวินัย มีจิตอาสา มีภาวะผู้นำและผู้ตามที่ดี สามารถทำงานร่วมกับผู้อื่นได้",
    rubric: [
      "นักศึกษาสามารถแสดงออกถึงบุคลิกภาพที่ดี มีความคิดเชิงสร้างสรรค์และมีวินัย มีจิตอาสา มีภาวะผู้นำและผู้ตามที่ดี สามารถทำงานร่วมกับผู้อื่นได้อย่างยอดเยี่ยม",
      "นักศึกษาสามารถแสดงออกถึงบุคลิกภาพที่ดี มีความคิดเชิงสร้างสรรค์และมีวินัย มีจิตอาสา มีภาวะผู้นำและผู้ตามที่ดี สามารถทำงานร่วมกับผู้อื่นได้อย่างดี",
      "นักศึกษาสามารถแสดงออกถึงบุคลิกภาพที่ดี มีความคิดเชิงสร้างสรรค์และมีวินัย มีจิตอาสา มีภาวะผู้นำและผู้ตามที่ดี สามารถทำงานร่วมกับผู้อื่นได้",
      "นักศึกษาสามารถแสดงออกถึงบุคลิกภาพได้ และมีวินัย มีจิตอาสา มีภาวะผู้นำและผู้ตามได้ สามารถทำงานร่วมกับผู้อื่นได้",
      "นักศึกษาไม่สามารถแสดงออกถึงบุคลิกภาพได้ และไม่มีวินัย ไม่มีจิตอาสา ไม่มีภาวะผู้นำและผู้ตาม ไม่สามารถทำงานร่วมกับผู้อื่นได้",
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
      throw new Error(`INTD: a template already exists (id=${existing.rows[0].id}) — aborting to avoid duplicates`);
    }

    const templateResult = await client.query(
      `INSERT INTO evaluation_templates
         (program_id, title, name, version_label, source_document_id, status, status_enum, needs_review, extraction_confidence)
       VALUES ($1, $2, $2, $3, $4, 'draft', 'draft', true, 1.00)
       RETURNING id`,
      [PROGRAM_ID, TITLE, VERSION_LABEL, SOURCE_DOCUMENT_ID]
    );
    const templateId = templateResult.rows[0].id;
    console.log(`  [INTD] template ${templateId}`);

    const sectionIds = {};
    for (const domain of ["knowledge", "skills", "ethics", "character"]) {
      const meta = SECTION_META[domain];
      const sectionResult = await client.query(
        `INSERT INTO assessment_sections (template_id, title_th, domain_type, sequence)
         VALUES ($1, $2, $3::domain_type, $4)
         RETURNING id`,
        [templateId, meta.title_th, domain, meta.sequence]
      );
      sectionIds[domain] = sectionResult.rows[0].id;
    }

    const seqByDomain = { knowledge: 0, skills: 0, ethics: 0, character: 0 };
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
    console.log(`  [INTD] ${QUESTIONS.length} questions, ${QUESTIONS.length * RUBRIC_LABELS.length} options across 4 sections (5-level rubric)`);

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
