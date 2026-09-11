import type { Locale } from "./i18n";

// Full, unambiguous names for the three evaluation forms in the system (G1,
// goal.md). Every place that displays a form's name — headers, the form
// picker, exported Word docs, the browser tab, completion screens — must use
// these constants instead of the old short forms ("แบบประเมินหน่วยงาน" /
// "แบบประเมินอาจารย์นิเทศ"), which don't tell the reader whose form it is.
//
// The Thai names are confirmed (goal.md G1). The English names are the
// agent's proposed translation pending sign-off from the coop-education
// center (goal.md Q1) — swap FORM_NAMES.en if the center provides official
// wording.
export const FORM_NAMES: Record<Locale, { company: string; advisor: string; student: string }> = {
  th: {
    company: "แบบประเมินผลการปฏิบัติสหกิจศึกษาจากสถานประกอบการ",
    advisor: "แบบประเมินนักศึกษาสหกิจศึกษาจากอาจารย์นิเทศ",
    student: "แบบสอบถามนักศึกษาหลังกลับจากการปฏิบัติงานสหกิจศึกษา",
  },
  en: {
    // Pending official confirmation — see goal.md Q1.
    company: "Cooperative Education Performance Evaluation by the Workplace",
    advisor: "Cooperative Education Student Evaluation by the Faculty Advisor",
    student: "Post-Placement Student Questionnaire for Cooperative Education",
  },
};

export function formName(role: "company" | "advisor" | "student", locale: Locale): string {
  return FORM_NAMES[locale][role];
}

// Title for the shared LO question template — used by the print preview and
// the Word export, both of which show the underlying LO question set that
// feeds *both* the company and advisor forms for a program, not one specific
// form. Deliberately role-neutral: calling it "the company form" or "the
// advisor form" would misdescribe a document that both forms draw from.
export const TEMPLATE_DOC_TITLE: Record<Locale, string> = {
  th: "รายการผลลัพธ์การเรียนรู้ (LOs) รายวิชาสหกิจศึกษา",
  en: "Cooperative Education Course Learning Outcomes (LOs)",
};
