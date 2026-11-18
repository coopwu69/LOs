// Parity guard: every question label a filler sees in a wizard step must also be
// present in the print/Word document model (getRoleFormDoc). If someone edits a
// step component (or the document builder) and the two drift apart, this fails
// with the exact labels that are missing — before it reaches a deployed file.
//
// Run: npm run test:parity
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { getRoleFormDoc } from "../src/lib/form-doc";
import { reportContentFor } from "../src/lib/report-content";
import { FeedbackStep, ReportStep } from "../src/components/evaluation/steps";
import { SkillExpectationGroup } from "../src/components/evaluation/SkillExpectationGroup";
import { AdvisorOtherStep, AdvisorProcessStep, AdvisorReportStep } from "../src/components/advisor/advisor-steps-extra";
import { StudentClosingStep, StudentExpensesStep, StudentReflectionStep } from "../src/components/student/student-steps";
import type { Locale } from "../src/lib/i18n";
import type { FormRole } from "../src/lib/routes";

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();

// Question text lives in <legend>/<label>; rating-card and checkbox option labels hold an <input>.
function questionLabels(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<(legend|label)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (/<input\b[^>]*type="(radio|checkbox)"/.test(m[2])) continue;
    const text = plain(m[2]);
    if (text) out.push(text);
  }
  return out;
}

// Cut at the required marker so tooltip text appended after it is not part of the question.
const stripDecor = (label: string) => label.replace(/^\d+\.\s*/, "").split(" *")[0].trim();

type Step = [string, ReactElement];
function stepsFor(role: FormRole, code: string, locale: Locale): Step[] {
  const base = { locale, errors: {}, formVersion: 0 };
  if (role === "company")
    return [
      ["skills", <SkillExpectationGroup key="skills" {...base} />],
      ["report", <ReportStep key="report" errors={{}} formVersion={0} content={reportContentFor("company", code, locale)} />],
      ["feedback", <FeedbackStep key="feedback" {...base} answered={0} total={0} />],
    ];
  if (role === "advisor")
    return [
      ["report", <AdvisorReportStep key="report" {...base} content={reportContentFor("advisor", code, locale)} />],
      ["comments", <AdvisorOtherStep key="comments" {...base} />],
      ["process", <AdvisorProcessStep key="process" {...base} />],
    ];
  return [
    ["expenses", <StudentExpensesStep key="expenses" {...base} />],
    ["reflection", <StudentReflectionStep key="reflection" locale={locale} errors={{}} startNumber={1} />],
    ["closing", <StudentClosingStep key="closing" {...base} startNumber={1} />],
  ];
}

// IMAG has its own report variant; ARCH uses every shared default.
for (const code of ["IMAG", "ARCH"]) {
  for (const role of ["company", "advisor", "student"] as const) {
    for (const locale of ["th", "en"] as const) {
      test(`${code} ${role} ${locale}: wizard labels are all in the print/Word model`, async () => {
        const program = { id: "x", code, name_th: "t", name_en: "e", school: "s", slug: code.toLowerCase(), revision_label: null, form_status: "submitted" };
        const doc = await getRoleFormDoc(program as never, role, locale);
        const docText = plain(JSON.stringify(doc.sections));
        const missing: string[] = [];
        for (const [name, element] of stepsFor(role, code, locale)) {
          for (const label of questionLabels(renderToStaticMarkup(element))) {
            const key = stripDecor(label);
            // Some labels append a unit/suffix after the question; the question part must still match.
            const head = key.split(" (")[0];
            if (key.length > 3 && !docText.includes(key) && !docText.includes(head)) missing.push(`[${name}] ${label}`);
          }
        }
        assert.deepEqual(missing, [], `Shown in the form but missing from print/Word:\n${missing.join("\n")}`);
      });
    }
  }
}

test("IMAG report step shows the new wording everywhere; other programs keep the default", async () => {
  const mk = (code: string) => ({ id: "x", code, name_th: "t", name_en: "e", school: "s", slug: code.toLowerCase(), revision_label: null, form_status: "submitted" });
  const oldText = "รายงาน/ชิ้นงาน/โครงงานที่ได้รับมอบหมาย";
  const newText = "ผลงานที่ได้รับมอบหมายตรงตามวัตถุประสงค์";
  for (const role of ["company", "advisor"] as const) {
    const imag = JSON.stringify((await getRoleFormDoc(mk("IMAG") as never, role, "th")).sections);
    assert.ok(imag.includes(newText) && !imag.includes(oldText), `IMAG ${role}`);
    const arch = JSON.stringify((await getRoleFormDoc(mk("ARCH") as never, role, "th")).sections);
    assert.ok(!arch.includes(newText), `ARCH ${role} must not get the IMAG wording`);
  }
});
