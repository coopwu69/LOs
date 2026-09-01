import type { TemplateDoc, ProgramRow, RevisionRow } from "./types";

// Standard 4-level rubric. Used when creating new LOs and as the conversion target.
export const STANDARD_4_LABELS: Record<number, string> = {
  4: "ระดับดีมาก",
  3: "ระดับดี",
  2: "ระดับพอใช้",
  1: "ระดับควรปรับปรุง",
};

export const LEGACY_5_LABELS: Record<number, string> = {
  5: "ระดับดีมากที่สุด",
  4: "ระดับดีมาก",
  3: "ระดับดี",
  2: "ระดับพอใช้",
  1: "ระดับควรปรับปรุง",
};

export function isFixtureMode(): boolean {
  return process.env.USE_FIXTURES === "1" || process.env.USE_FIXTURES === "true";
}

// ---------- Fixture programs ----------

const programEngineering: ProgramRow = {
  id: "fix-eng",
  code: "วศ.บ. (วิศวกรรมคอมพิวเตอร์)",
  name_th: "หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์",
  school: "สำนักวิชาวิศวกรรมศาสตร์",
  slug: "computer-engineering",
  revision_label: "ฉบับร่าง 2567",
  form_status: "submitted",
};

const programNursing: ProgramRow = {
  id: "fix-nur",
  code: "พย.บ.",
  name_th: "หลักสูตรพยาบาลศาสตรบัณฑิต",
  school: "สำนักวิชาพยาบาลศาสตร์",
  slug: "nursing",
  revision_label: "ฉบับร่าง 2565",
  form_status: "submitted",
};

const programLaw: ProgramRow = {
  id: "fix-law",
  code: "น.บ.",
  name_th: "หลักสูตรนิติศาสตรบัณฑิต",
  school: "สำนักวิชานิติศาสตร์",
  slug: "law",
  revision_label: "ฉบับร่าง 2566",
  form_status: "pending",
};

// ---------- Fixture template docs ----------

const engineeringTemplate: TemplateDoc = {
  id: "fix-eng-tpl",
  program: programEngineering,
  title: "แบบประเมินผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชาสหกิจศึกษา",
  course_codes: ["040203xxx-xxx", "040203xxx-xxx"],
  scale_status: "standard_4",
  source_layout: "standard_two_part",
  plos: [
    { id: "plo-1", code: "PLO1", domain_type: "knowledge", text: "ประยุกต์ใช้ความรู้ด้านคณิตศาสตร์ วิทยาศาสตร์ และวิศวกรรมศาสตร์ในการวิเคราะห์และแก้ปัญหา", sequence: 1 },
    { id: "plo-2", code: "PLO2", domain_type: "skills", text: "ออกแบบและพัฒนาระบบคอมพิวเตอร์ซอฟต์แวร์และฮาร์ดแวร์ตามหลักวิศวกรรม", sequence: 2 },
    { id: "plo-3", code: "PLO3", domain_type: "ethics", text: "ปฏิบัติงานด้วยความรับผิดชอบและยึดมั่นในจริยธรรมทางวิชาชีพ", sequence: 3 },
    { id: "plo-4", code: "PLO4", domain_type: "character", text: "ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพในบริบทที่หลากหลาย", sequence: 4 },
  ],
  sections: [
    {
      id: "sec-1",
      domain_type: "knowledge",
      title_th: "ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตรด้านความรู้และทักษะ",
      part: 1,
      sequence: 1,
      questions: [
        {
          id: "q-1",
          lo_code: "LO1",
          text: "สามารถใช้นวัตกรรมและเทคโนโลยีสื่อดิจิทัลได้อย่างเหมาะสมกับงาน",
          text_en: "Apply digital media innovations and technologies appropriately to the task",
          plo_refs: ["PLO1", "PLO2"],
          sequence: 1,
          options: [
            { id: "o-1-4", score: 4, label_th: "ระดับดีมาก", description_th: "สามารถใช้นวัตกรรมและเทคโนโลยีสื่อดิจิทัลได้อย่างเชี่ยวชาญและเหมาะสมกับงาน", sequence: 1 },
            { id: "o-1-3", score: 3, label_th: "ระดับดี", description_th: "ใช้นวัตกรรมและเทคโนโลยีได้ดี แต่ต้องการคำแนะนำในบางครั้ง", sequence: 2 },
            { id: "o-1-2", score: 2, label_th: "ระดับพอใช้", description_th: "สามารถใช้งานได้ในระดับพื้นฐาน", sequence: 3 },
            { id: "o-1-1", score: 1, label_th: "ระดับควรปรับปรุง", description_th: "ยังไม่สามารถใช้งานได้อย่างเหมาะสม", sequence: 4 },
          ],
        },
        {
          id: "q-2",
          lo_code: "LO2",
          text: "วิเคราะห์และแก้ไขปัญหาทางวิศวกรรมได้อย่างเป็นระบบ",
          text_en: null,
          plo_refs: ["PLO1"],
          sequence: 2,
          options: [
            { id: "o-2-4", score: 4, label_th: "ระดับดีมาก", description_th: "วิเคราะห์และแก้ปัญหาได้อย่างเป็นระบบและครอบคลุม พร้อมเสนอทางเลือกที่เหมาะสม", sequence: 1 },
            { id: "o-2-3", score: 3, label_th: "ระดับดี", description_th: "วิเคราะห์และแก้ปัญหาได้ดี ครอบคลุมปัจจัยสำคัญ", sequence: 2 },
            { id: "o-2-2", score: 2, label_th: "ระดับพอใช้", description_th: "แก้ปัญหาได้ในกรณีที่คุ้นเคย ต้องการคำแนะนำในปัญหาใหม่", sequence: 3 },
            { id: "o-2-1", score: 1, label_th: "ระดับควรปรับปรุง", description_th: "ยังไม่สามารถวิเคราะห์ปัญหาได้อย่างเป็นระบบ", sequence: 4 },
          ],
        },
      ],
    },
    {
      id: "sec-2",
      domain_type: "ethics",
      title_th: "ผลลัพธ์การเรียนรู้ด้านทักษะทางสังคม",
      part: 2,
      sequence: 2,
      questions: [
        {
          id: "q-3",
          lo_code: "LO3",
          text: "ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพในบริบทที่หลากหลาย",
          text_en: null,
          plo_refs: ["PLO4"],
          sequence: 1,
          options: [
            { id: "o-3-4", score: 4, label_th: "ระดับดีมาก", description_th: "ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพ ปรับตัวได้ดีในทุกบริบท", sequence: 1 },
            { id: "o-3-3", score: 3, label_th: "ระดับดี", description_th: "ทำงานร่วมกับผู้อื่นได้ดีในบริบทที่คุ้นเคย", sequence: 2 },
            { id: "o-3-2", score: 2, label_th: "ระดับพอใช้", description_th: "ทำงานร่วมกับผู้อื่นได้ในระดับพื้นฐาน", sequence: 3 },
            { id: "o-3-1", score: 1, label_th: "ระดับควรปรับปรุง", description_th: "ยังปรับตัวเข้ากับการทำงานร่วมกับผู้อื่นได้ยาก", sequence: 4 },
          ],
        },
      ],
    },
  ],
};

const nursingTemplate: TemplateDoc = {
  id: "fix-nur-tpl",
  program: programNursing,
  title: "แบบประเมินผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชาสหกิจศึกษา",
  course_codes: null,
  scale_status: "legacy_5",
  source_layout: "legacy_five_level",
  plos: [
    { id: "plo-n1", code: "PLO1", domain_type: "knowledge", text: "ประยุกต์ความรู้ทางพยาบาลศาสตร์ในการดูแลผู้ป่วย", sequence: 1 },
    { id: "plo-n2", code: "PLO2", domain_type: "skills", text: "ปฏิบัติการพยาบาลได้อย่างถูกต้องตามมาตรฐานวิชาชีพ", sequence: 2 },
  ],
  sections: [
    {
      id: "sec-n1",
      domain_type: "knowledge",
      title_th: "ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตรด้านความรู้และทักษะ",
      part: 1,
      sequence: 1,
      questions: [
        {
          id: "q-n1",
          lo_code: "LO1",
          text: "ปฏิบัติการพยาบาลตามกระบวนการพยาบาลได้อย่างเป็นระบบ",
          text_en: null,
          plo_refs: ["PLO1", "PLO2"],
          sequence: 1,
          options: [
            { id: "o-n1-5", score: 5, label_th: "ระดับดีมากที่สุด", description_th: "ปฏิบัติได้ครบถ้วนสมบูรณ์ สามารถสอนผู้อื่นได้", sequence: 1 },
            { id: "o-n1-4", score: 4, label_th: "ระดับดีมาก", description_th: "ปฏิบัติได้ถูกต้องครบถ้วน", sequence: 2 },
            { id: "o-n1-3", score: 3, label_th: "ระดับดี", description_th: "ปฏิบัติได้ดี ต้องการคำแนะนำเล็กน้อย", sequence: 3 },
            { id: "o-n1-2", score: 2, label_th: "ระดับพอใช้", description_th: "ปฏิบัติได้ในระดับพื้นฐาน", sequence: 4 },
            { id: "o-n1-1", score: 1, label_th: "ระดับควรปรับปรุง", description_th: "ยังปฏิบัติไม่ได้", sequence: 5 },
          ],
        },
      ],
    },
  ],
};

const lawTemplate: TemplateDoc = {
  id: "fix-law-tpl",
  program: programLaw,
  title: "แบบประเมินผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชาสหกิจศึกษา",
  course_codes: null,
  scale_status: "needs_descriptions",
  source_layout: "standard_two_part",
  plos: [
    { id: "plo-l1", code: "PLO1", domain_type: "knowledge", text: "วิเคราะห์และตีความกฎหมายได้อย่างถูกต้อง", sequence: 1 },
  ],
  sections: [
    {
      id: "sec-l1",
      domain_type: "knowledge",
      title_th: "ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตรด้านความรู้และทักษะ",
      part: 1,
      sequence: 1,
      questions: [
        {
          id: "q-l1",
          lo_code: "LO1",
          text: "เขียนคำคิดเห็นทางกฎหมายได้อย่างถูกต้องและชัดเจน",
          text_en: null,
          plo_refs: ["PLO1"],
          sequence: 1,
          options: [
            { id: "o-l1-4", score: 4, label_th: "ระดับดีมาก", description_th: null, sequence: 1 },
            { id: "o-l1-3", score: 3, label_th: "ระดับดี", description_th: null, sequence: 2 },
            { id: "o-l1-2", score: 2, label_th: "ระดับพอใช้", description_th: null, sequence: 3 },
            { id: "o-l1-1", score: 1, label_th: "ระดับควรปรับปรุง", description_th: null, sequence: 4 },
          ],
        },
      ],
    },
  ],
};

// ---------- Fixture accessors ----------

const FIXTURE_TEMPLATES: TemplateDoc[] = [
  engineeringTemplate,
  nursingTemplate,
  lawTemplate,
];

const FIXTURE_PROGRAMS: ProgramRow[] = [
  programEngineering,
  programNursing,
  programLaw,
];

function matchesProgramRef(program: ProgramRow, programRef: string): boolean {
  const ref = programRef.toLowerCase();
  return program.id.toLowerCase() === ref || program.code.toLowerCase() === ref || program.slug?.toLowerCase() === ref;
}

export function getFixtureTemplateDoc(programRef: string): TemplateDoc | null {
  return FIXTURE_TEMPLATES.find((t) => matchesProgramRef(t.program, programRef)) ?? null;
}

export function getFixtureProgram(programRef: string): ProgramRow | null {
  return FIXTURE_PROGRAMS.find((p) => matchesProgramRef(p, programRef)) ?? null;
}

export function getFixtureSchoolsWithProgress() {
  const bySchool = new Map<string, ProgramRow[]>();
  for (const p of FIXTURE_PROGRAMS) {
    const school = p.school ?? "—";
    const arr = bySchool.get(school) ?? [];
    arr.push(p);
    bySchool.set(school, arr);
  }
  return Array.from(bySchool.entries()).map(([name, programs]) => {
    const templates = programs
      .map((p) => getFixtureTemplateDoc(p.id))
      .filter((t): t is TemplateDoc => t !== null);
    return {
      name,
      program_count: programs.length,
      submitted_count: programs.filter((p) => p.form_status === "submitted").length,
      pending_count: programs.filter((p) => p.form_status === "pending").length,
      standard_4_count: templates.filter((t) => t.scale_status === "standard_4").length,
      legacy_5_count: templates.filter((t) => t.scale_status === "legacy_5").length,
      needs_descriptions_count: templates.filter(
        (t) => t.scale_status === "needs_descriptions"
      ).length,
      programs,
    };
  });
}

export function getFixtureProgramsBySchool(schoolName: string): ProgramRow[] {
  return FIXTURE_PROGRAMS.filter((p) => p.school === schoolName);
}

const FIXTURE_REVISIONS: Record<string, RevisionRow[]> = {
  "fix-eng-tpl": [
    { id: "rev-eng-2", kind: "edit", note: "เพิ่มคำอธิบายเกณฑ์ระดับ 4 และ 3", created_at: "2026-08-28T14:30:00" },
    { id: "rev-eng-1", kind: "import", note: "นำเข้าจากเอกสารต้นฉบับ", created_at: "2026-08-15T09:00:00" },
  ],
  "fix-nur-tpl": [
    { id: "rev-nur-1", kind: "import", note: "นำเข้าจากเอกสารต้นฉบับ (5 ระดับ)", created_at: "2026-08-10T09:00:00" },
  ],
  "fix-law-tpl": [
    { id: "rev-law-1", kind: "import", note: "นำเข้าจากเอกสารต้นฉบับ", created_at: "2026-08-12T09:00:00" },
  ],
};

export function getFixtureRevisions(templateId: string): RevisionRow[] {
  return FIXTURE_REVISIONS[templateId] ?? [];
}
