import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Paragraph,
} from "docx";
import { getProgram, getProgramRouteKey } from "@/lib/db";
import { isFixtureMode, getFixtureProgram } from "@/lib/fixtures";
import { resolveLocale } from "@/lib/i18n";
import { isFormRole } from "@/lib/routes";
import { getRoleFormDoc, type RoleFormDoc, type FormDocQuestion } from "@/lib/form-doc";

export const dynamic = "force-dynamic";

// Font + sizes mirror the existing /export/docx route so the two Word files
// share the same look. TH Sarabun New is embedded so the file renders
// correctly on machines without the font installed.
const FONT_NAME = "TH Sarabun New";
const FONT = { ascii: FONT_NAME, hAnsi: FONT_NAME, cs: FONT_NAME, eastAsia: FONT_NAME };
const SIZE_BODY = 32; // 16pt
const SIZE_HEADING = 36; // 18pt
const SIZE_TITLE = 40; // 20pt

const FONT_FILE = path.join(process.cwd(), "src", "assets", "fonts", "THSarabunNew.ttf");
let fontData: Buffer | null | undefined;

function getEmbeddedFont(): Buffer | null {
  if (fontData === undefined) {
    try {
      fontData = readFileSync(FONT_FILE);
    } catch {
      fontData = null;
    }
  }
  return fontData;
}

const dashedBorder = { style: BorderStyle.DASHED, size: 6, color: "000000" };
const solidBorder = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };

function run(opts: { text: string; bold?: boolean; size?: number; color?: string; break?: number }) {
  const size = opts.size ?? SIZE_BODY;
  return new TextRun({
    text: opts.text,
    bold: opts.bold,
    boldComplexScript: opts.bold,
    color: opts.color,
    break: opts.break,
    font: FONT,
    size,
    sizeComplexScript: size,
  });
}

function p(text: string, opts?: { bold?: boolean; size?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }) {
  return new Paragraph({
    alignment: opts?.align,
    children: [run({ text, bold: opts?.bold, size: opts?.size ?? SIZE_BODY })],
  });
}

function emptyDashedLine(): Paragraph {
  return new Paragraph({
    border: { bottom: dashedBorder },
    spacing: { after: 120 },
    children: [run({ text: "" })],
  });
}

// A scale table: one row per level (score | label | description), ordered
// high -> low to match the on-screen card order.
function scaleTable(question: FormDocQuestion): Table {
  const levels = question.scale ?? [];
  const rows = levels.map((lvl) => {
    const cells = [
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
        children: [p(String(lvl.score), { bold: true, align: AlignmentType.CENTER })],
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
        children: [p(lvl.disabled ? `${lvl.label} —` : lvl.label, { bold: true })],
      }),
      new TableCell({
        width: { size: 67, type: WidthType.PERCENTAGE },
        borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder },
        children: [p(lvl.description ?? "—")],
      }),
    ];
    return new TableRow({ children: cells });
  });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
}

// A checkbox list: one paragraph per option, each prefixed with ☐.
function checkboxList(items: string[]): Paragraph[] {
  return items.map((item) =>
    new Paragraph({
      spacing: { after: 40 },
      children: [run({ text: "☐  " }), run({ text: item })],
    })
  );
}

function questionBlock(question: FormDocQuestion, index: number): (Paragraph | Table)[] {
  const blocks: (Paragraph | Table)[] = [];
  const code = question.code ?? `${index + 1}`;
  blocks.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        run({ text: `${code}  `, bold: true, color: "2563EB" }),
        run({ text: question.text, bold: true }),
      ],
    })
  );
  if (question.textEn) {
    blocks.push(p(question.textEn));
  }
  if (question.helper) {
    blocks.push(p(question.helper));
  }

  switch (question.type) {
    case "rating":
      blocks.push(scaleTable(question));
      blocks.push(emptyDashedLine());
      break;
    case "text":
      blocks.push(emptyDashedLine());
      break;
    case "info":
      blocks.push(emptyDashedLine());
      break;
    case "choice":
      if (question.choices) blocks.push(...checkboxList(question.choices));
      break;
    case "checkbox":
      if (question.items) blocks.push(...checkboxList(question.items));
      if (question.scale) blocks.push(scaleTable(question));
      break;
  }
  return blocks;
}

function sectionBlock(title: string, questions: FormDocQuestion[]): (Paragraph | Table)[] {
  const blocks: (Paragraph | Table)[] = [
    new Paragraph({
      spacing: { before: 300, after: 80 },
      border: { bottom: solidBorder },
      children: [run({ text: title, bold: true, size: SIZE_HEADING })],
    }),
  ];
  questions.forEach((q, i) => {
    for (const b of questionBlock(q, i)) blocks.push(b);
  });
  return blocks;
}

function buildDocx(doc: RoleFormDoc): Document {
  const children: (Paragraph | Table)[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [run({ text: doc.formName, bold: true, size: SIZE_TITLE })],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [run({ text: doc.programName, bold: true, size: SIZE_HEADING })],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [run({ text: doc.programCode })],
    })
  );

  for (const section of doc.sections) {
    for (const b of sectionBlock(section.title, section.questions)) children.push(b);
  }

  // Signature
  children.push(p(""));
  children.push(p("ลงชื่อผู้กรอก: ____________________   ตำแหน่ง: ____________________   วันที่: ____________________"));

  const embeddedFont = getEmbeddedFont();

  return new Document({
    creator: "ระบบแบบประเมินสหกิจศึกษา (COOP69)",
    title: doc.formName,
    description: `${doc.formName} — ${doc.programName}`,
    ...(embeddedFont ? { fonts: [{ name: FONT_NAME, data: embeddedFont }] } : {}),
    styles: {
      default: {
        document: { run: { font: FONT, size: SIZE_BODY, sizeComplexScript: SIZE_BODY } },
        heading1: {
          run: { font: FONT, size: SIZE_HEADING, sizeComplexScript: SIZE_HEADING, bold: true, boldComplexScript: true, color: "000000" },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        heading2: {
          run: { font: FONT, size: SIZE_HEADING, sizeComplexScript: SIZE_HEADING, bold: true, boldComplexScript: true, color: "000000" },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
      },
    },
    sections: [
      {
        properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children,
      },
    ],
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ programId: string; role: string }> }
) {
  const { programId, role } = await params;
  if (!isFormRole(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) {
    return NextResponse.json({ error: "ไม่พบหลักสูตร" }, { status: 404 });
  }
  const programKey = getProgramRouteKey(program);
  if (programId !== programKey) {
    const canonicalUrl = req.nextUrl.clone();
    canonicalUrl.pathname = `/programs/${programKey}/review/export/${role}`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const locale = resolveLocale(req.nextUrl.searchParams.get("lang") ?? undefined, false);
  const doc = await getRoleFormDoc(program, role, locale);
  const document = buildDocx(doc);
  const buffer = await Packer.toBuffer(document);
  const uint8 = new Uint8Array(buffer);

  const safeCode = program.code.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9]/g, "_");
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const filename = `${roleLabel}_${safeCode}.docx`;

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
