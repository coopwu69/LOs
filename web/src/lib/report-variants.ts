import type { Locale } from "@/lib/i18n";

// Program-specific wording for the company form's report step (step 5 of 6).
// Every program not listed here keeps the shared default in
// components/evaluation/copy.ts — adding an entry changes that program only.
//
// The step keeps the same five score fields (c-0..c-4, 1–4 each), so scoring,
// storage and the live score bar stay unchanged. `naItems` lists item indexes
// that also accept "X" (unable to assess); an "X" answer is stored as the
// literal "X" and left out of both the score and the item count.

export const REPORT_NA_VALUE = "X";

type RubricRow = readonly [string, string, string, string]; // level 1 → 4

export type ReportVariantCopy = {
  /** [short label, title, description] — replaces copy.steps[REPORT]. */
  step: [string, string, string];
  items: readonly string[];
  /** One row per item, ordered low → high (index 0 = level 1). */
  rubric: readonly RubricRow[];
  naLabel: string;
};

export type ReportVariant = {
  /** Item indexes that accept "X". */
  naItems: readonly number[];
  copy: Record<Locale, ReportVariantCopy>;
};

const IMAG_VARIANT: ReportVariant = {
  naItems: [4],
  copy: {
    th: {
      step: ["ผลงานและการปฏิบัติงาน", "ผลงานและการปฏิบัติงานให้สถานประกอบการ", "ประเมินคุณภาพของผลงานที่นักศึกษาทำให้หน่วยงาน และการสื่อสารความก้าวหน้า"],
      items: [
        "ผลงานที่ได้รับมอบหมายตรงตามวัตถุประสงค์และความต้องการของหน่วยงาน/ลูกค้า",
        "คุณภาพของผลงานเมื่อเทียบกับมาตรฐานการทำงานของหน่วยงาน",
        "การส่งมอบงานตรงเวลาและการปรับแก้ตามข้อเสนอแนะ",
        "ผลงานถูกนำไปใช้งานจริงหรือเผยแพร่",
        "การอธิบายและถ่ายทอดผลงาน (รายงาน นำเสนอ หรือสรุปขั้นตอนการทำงาน) ภายใต้ข้อจำกัดด้านความลับ",
      ],
      rubric: [
        [
          "ไม่ตรงตามความต้องการ",
          "ตรงตามความต้องการบางส่วน ต้องปรับแก้มาก",
          "ตรงตามความต้องการเป็นส่วนใหญ่ ต้องปรับแก้เล็กน้อย",
          "ตรงตามความต้องการครบถ้วน",
        ],
        [
          "ต่ำกว่ามาตรฐาน ไม่สามารถนำไปใช้ได้",
          "อยู่ในระดับพอใช้ ต้องมีผู้อื่นช่วยแก้ไขจำนวนมาก",
          "อยู่ในระดับดี ต้องขัดเกลาเล็กน้อยก่อนส่งมอบ",
          "อยู่ในระดับพร้อมส่งมอบหรือเผยแพร่ได้ทันที",
        ],
        [
          "ส่งล่าช้าบ่อย หรือแทบไม่ปรับแก้ตามข้อเสนอแนะ",
          "ส่งล่าช้าเป็นบางครั้ง หรือต้องติดตามเรื่องการแก้ไขบ่อย",
          "ส่งตรงเวลาเป็นส่วนใหญ่ ปรับแก้ตามคำแนะนำได้ดี",
          "ส่งตรงเวลาสม่ำเสมอ และปรับแก้ตามคำแนะนำได้รวดเร็ว",
        ],
        [
          "ไม่ได้ถูกนำไปใช้งาน",
          "อยู่ระหว่างพัฒนา ยังไม่ได้นำไปใช้งานจริง",
          "ใช้งานจริงภายในองค์กร หรือส่งมอบลูกค้าบางส่วน",
          "ส่งมอบลูกค้า/เผยแพร่สู่สาธารณะแล้ว (เช่น ภาพยนตร์ โฆษณา เกม สื่อออนไลน์)",
        ],
        [
          "ไม่สามารถอธิบายหรือสรุปการทำงานได้",
          "อธิบายได้บางส่วน ต้องซักถามเพิ่มเติมมาก",
          "อธิบายได้ชัดเจนเป็นส่วนใหญ่",
          "อธิบายกระบวนการ ขั้นตอน และผลลัพธ์ได้ชัดเจน ครบถ้วน",
        ],
      ],
      naLabel: "ไม่สามารถประเมินได้",
    },
    en: {
      step: ["Work and performance", "Work and performance for the organization", "Assess the quality of the work the student produced for the organization and how progress was communicated"],
      items: [
        "The assigned work meets the objectives and needs of the organization/client.",
        "Quality of the work compared with the organization's working standards.",
        "On-time delivery and revising the work according to feedback.",
        "The work is put to actual use or published.",
        "Explaining and conveying the work (report, presentation, or summary of work steps) within confidentiality limits.",
      ],
      rubric: [
        [
          "Does not meet the requirements",
          "Partly meets the requirements; needs major revisions",
          "Mostly meets the requirements; needs minor revisions",
          "Fully meets the requirements",
        ],
        [
          "Below standard; cannot be used",
          "Fair; needs substantial corrections from others",
          "Good; needs slight polishing before delivery",
          "Ready for immediate delivery or publication",
        ],
        [
          "Often late, or rarely revises according to feedback",
          "Occasionally late, or frequent follow-up needed on revisions",
          "Mostly on time; revises well according to advice",
          "Consistently on time; revises quickly according to advice",
        ],
        [
          "Not put to use",
          "Still in development; not yet put to actual use",
          "In actual use within the organization, or partly delivered to clients",
          "Delivered to clients or published to the public (e.g. films, advertisements, games, online media)",
        ],
        [
          "Cannot explain or summarize the work",
          "Explains in part; needs many follow-up questions",
          "Explains clearly for the most part",
          "Explains the process, steps, and results clearly and completely",
        ],
      ],
      naLabel: "Unable to assess",
    },
  },
};

// Keyed by upper-case program code.
const REPORT_VARIANTS: Record<string, ReportVariant> = {
  IMAG: IMAG_VARIANT,
};

export function reportVariantFor(programCode: string | null | undefined): ReportVariant | null {
  return REPORT_VARIANTS[(programCode ?? "").trim().toUpperCase()] ?? null;
}
