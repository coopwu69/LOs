import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Paragraph,
  ShadingType,
} from "docx";
import { getProgram, getProgramRouteKey, getTemplateDoc } from "@/lib/db";
import {
  isFixtureMode,
  getFixtureProgram,
  getFixtureTemplateDoc,
} from "@/lib/fixtures";
import type { TemplateDoc, SectionRow, QuestionRow } from "@/lib/types";

export const dynamic = "force-dynamic";

const DOMAIN_LABELS: Record<string, string> = {
  knowledge: "ความรู้",
  skills: "ทักษะ",
  ethics: "จริยธรรม",
  character: "ลักษณะบุคคล",
  general: "ทั่วไป",
};

const PART_TITLES: Record<number, string> = {
  1: "ตอนที่ 1 — ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตรด้านความรู้และทักษะ",
  2: "ตอนที่ 2 — ผลลัพธ์การเรียนรู้ด้านทักษะทางสังคม",
};

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const dashedBorder = { style: BorderStyle.DASHED, size: 6, color: "000000" };
const solidBorder = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };

function p(text: string, opts?: { bold?: boolean; size?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }) {
  return new Paragraph({
    alignment: opts?.align,
    children: [new TextRun({ text, bold: opts?.bold, size: opts?.size ?? 22 })],
  });
}

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, bold: true })],
  });
}

function emptyDashedLine(): Paragraph {
  return new Paragraph({
    border: { bottom: dashedBorder },
    spacing: { after: 120 },
    children: [new TextRun({ text: "" })],
  });
}

function labeledDashedLine(label: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, bottom: dashedBorder, left: noBorder, right: noBorder },
        children: [p(label, { bold: true })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        borders: { top: noBorder, bottom: dashedBorder, left: noBorder, right: noBorder },
        children: [p("")],
      }),
    ],
  });
}

function headerInfoTable(): Table {
  const rows = [
    labeledDashedLine("สำนักวิชา"),
    labeledDashedLine("หลักสูตร"),
    labeledDashedLine("ภาคการศึกษา/ปีการศึกษา"),
    labeledDashedLine("รหัสนักศึกษา"),
    labeledDashedLine("ชื่อ-สกุล นักศึกษา"),
    labeledDashedLine("ชื่อสถานประกอบการ"),
    labeledDashedLine("ชื่อ-สกุล อาจารย์นิเทศ"),
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
}

function ratingScaleTable(doc: TemplateDoc): Table {
  const levels =
    doc.scale_status === "legacy_5"
      ? [
          { score: 5, label: "ระดับดีมากที่สุด" },
          { score: 4, label: "ระดับดีมาก" },
          { score: 3, label: "ระดับดี" },
          { score: 2, label: "ระดับพอใช้" },
          { score: 1, label: "ระดับควรปรับปรุง" },
        ]
      : [
          { score: 4, label: "ระดับดีมาก" },
          { score: 3, label: "ระดับดี" },
          { score: 2, label: "ระดับพอใช้" },
          { score: 1, label: "ระดับควรปรับปรุง" },
        ];
  const headerRow = new TableRow({
    tableHeader: true,
    children: levels.map(
      (l) =>
        new TableCell({
          width: { size: Math.floor(100 / levels.length), type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: "F0F0F0" },
          borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
          children: [p(`${l.score}`, { bold: true, align: AlignmentType.CENTER }), p(l.label, { size: 18, align: AlignmentType.CENTER })],
        })
    ),
  });
  // Empty row for scoring
  const emptyRow = new TableRow({
    children: levels.map(
      () =>
        new TableCell({
          width: { size: Math.floor(100 / levels.length), type: WidthType.PERCENTAGE },
          borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
          children: [p("☐", { align: AlignmentType.CENTER, size: 28 })],
        })
    ),
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, emptyRow],
  });
}

function questionBlock(question: QuestionRow, index: number): (Paragraph | Table)[] {
  const blocks: (Paragraph | Table)[] = [];
  const loCode = question.lo_code ?? `ข้อ ${index + 1}`;
  blocks.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: `${loCode}  `, bold: true, color: "2563EB" }),
        new TextRun({ text: question.text, bold: true }),
      ],
    })
  );
  if (question.text_en) {
    blocks.push(p(question.text_en, { size: 18 }));
  }
  if (question.plo_refs && question.plo_refs.length > 0) {
    blocks.push(p(`อ้างอิง: ${question.plo_refs.join(", ")}`, { size: 18 }));
  }

  // Options as a table
  const sorted = (question.options.length > 0 ? [...question.options] : [
    { id: `${question.id}-5`, score: 5, label_th: "ยอดเยี่ยม", description_th: null, sequence: 1 },
    { id: `${question.id}-4`, score: 4, label_th: "ดีมาก", description_th: null, sequence: 2 },
    { id: `${question.id}-3`, score: 3, label_th: "ดี", description_th: null, sequence: 3 },
    { id: `${question.id}-2`, score: 2, label_th: "พอใช้", description_th: null, sequence: 4 },
    { id: `${question.id}-1`, score: 1, label_th: "ต้องปรับปรุง", description_th: null, sequence: 5 },
  ]).sort((a, b) => b.score - a.score);
  const optRows = sorted.map(
    (opt) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
            children: [p(String(opt.score), { bold: true, align: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
            children: [p(opt.label_th, { bold: true })],
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
            children: [p(opt.description_th ?? "—", { size: 20 })],
          }),
        ],
      })
  );
  blocks.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: optRows,
    })
  );
  // Comment line
  blocks.push(p("ความเห็นเพิ่มเติม:", { size: 18 }));
  blocks.push(emptyDashedLine());
  return blocks;
}

function sectionBlock(section: SectionRow): (Paragraph | Table)[] {
  const blocks: (Paragraph | Table)[] = [];
  blocks.push(
    new Paragraph({
      spacing: { before: 300, after: 80 },
      border: { bottom: solidBorder },
      children: [
        new TextRun({ text: DOMAIN_LABELS[section.domain_type] ?? section.domain_type, color: "2563EB", size: 20 }),
        new TextRun({ text: "\n", break: 1 }),
        new TextRun({ text: section.title_th, bold: true, size: 26 }),
      ],
    })
  );
  section.questions.forEach((q, i) => {
    for (const b of questionBlock(q, i)) blocks.push(b);
  });
  return blocks;
}

function buildDocx(doc: TemplateDoc): Document {
  const children: (Paragraph | Table)[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: doc.title ?? "แบบประเมินผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชาสหกิจศึกษา", bold: true, size: 32 })],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: doc.program.name_th, bold: true, size: 26 })],
    })
  );
  if (doc.program.revision_label) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: `(${doc.program.revision_label})`, size: 22 })],
      })
    );
  }
  if (doc.course_codes && doc.course_codes.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: `รหัสรายวิชา: ${doc.course_codes.join(", ")}`, size: 20 })],
      })
    );
  }

  // Header info
  children.push(headerInfoTable());
  children.push(p(""));

  // Rating scale
  children.push(heading("ระดับคะแนน (Rating Scale)", HeadingLevel.HEADING_2));
  children.push(ratingScaleTable(doc));
  children.push(p(""));

  // PLOs
  if (doc.plos.length > 0) {
    children.push(heading("ผลลัพธ์การเรียนรู้ของหลักสูตร (PLOs)", HeadingLevel.HEADING_2));
    for (const plo of doc.plos) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${plo.code}  `, bold: true }),
            new TextRun({ text: plo.text, size: 22 }),
          ],
        })
      );
    }
    children.push(p(""));
  }

  // Part 1
  const part1 = doc.sections.filter((s) => s.part === 1);
  if (part1.length > 0) {
    children.push(heading(PART_TITLES[1] ?? "ตอนที่ 1", HeadingLevel.HEADING_1));
    for (const s of part1) {
      for (const b of sectionBlock(s)) children.push(b);
    }
  }

  // Part 2 (page break)
  const part2 = doc.sections.filter((s) => s.part === 2);
  if (part2.length > 0) {
    children.push(
      new Paragraph({
        pageBreakBefore: true,
        children: [new TextRun({ text: PART_TITLES[2] ?? "ตอนที่ 2", bold: true, size: 32 })],
      })
    );
    for (const s of part2) {
      for (const b of sectionBlock(s)) children.push(b);
    }
  }

  // Other parts
  const other = doc.sections.filter((s) => s.part !== 1 && s.part !== 2);
  for (const s of other) {
    for (const b of sectionBlock(s)) children.push(b);
  }

  // Comments
  children.push(heading("ข้อความเห็น", HeadingLevel.HEADING_2));
  children.push(p("จุดเด่นของนักศึกษา (Student's Strengths)", { bold: true }));
  for (let i = 0; i < 3; i++) children.push(emptyDashedLine());
  children.push(p("จุดที่นักศึกษาควรปรับปรุง (Points for Improvement)", { bold: true }));
  for (let i = 0; i < 3; i++) children.push(emptyDashedLine());
  children.push(p("ข้อเสนอแนะอื่นๆ (Other Comments)", { bold: true }));
  for (let i = 0; i < 3; i++) children.push(emptyDashedLine());

  // Signature
  children.push(p(""));
  children.push(p("ลงชื่อผู้ประเมิน: ____________________   ตำแหน่ง: ____________________   วันที่: ____________________"));

  return new Document({
    creator: "ระบบแบบประเมิน LOs รายวิชาสหกิจศึกษา",
    title: doc.title ?? "แบบประเมิน LOs",
    description: `แบบประเมิน LOs สำหรับ ${doc.program.name_th}`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch
          },
        },
        children,
      },
    ],
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  const { programId } = await params;

  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) {
    return NextResponse.json({ error: "ไม่พบหลักสูตร" }, { status: 404 });
  }
  const programKey = getProgramRouteKey(program);
  if (programId !== programKey) {
    const canonicalUrl = req.nextUrl.clone();
    canonicalUrl.pathname = `/programs/${programKey}/export/docx`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  let doc: TemplateDoc | null = null;
  if (isFixtureMode()) {
    doc = getFixtureTemplateDoc(programId);
  } else {
    try {
      doc = await getTemplateDoc(program.id);
    } catch {
      doc = null;
    }
  }
  if (!doc) {
    doc = {
      id: program.id,
      program,
      title: "แบบประเมินผลลัพธ์การเรียนรู้รายวิชาสหกิจศึกษา",
      course_codes: null,
      scale_status: "needs_descriptions",
      source_layout: "wizard_preview",
      plos: [],
      sections: [],
    };
  }

  const document = buildDocx(doc);
  const buffer = await Packer.toBuffer(document);
  const uint8 = new Uint8Array(buffer);

  const safeCode = program.code.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, "_");
  const filename = `LOs_${safeCode}.docx`;

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
