import { getTemplateDoc } from "./db";
import { isFixtureMode, getFixtureTemplateDoc } from "./fixtures";
import type { Locale } from "./i18n";
import { programDisplayName } from "./i18n";
import { FORM_NAMES } from "./form-names";
import { FORM_ROLES, type FormRole } from "./routes";
import { WIZARD_COPY, PRIMARY_DOMAINS, ENGLISH_SCORE_LABELS } from "@/components/evaluation/copy";
import { ADVISOR_COPY } from "@/components/advisor/advisor-copy";
import { STUDENT_COPY } from "@/components/student/student-copy";
import type { TemplateDoc, SectionRow, QuestionRow, OptionRow, ProgramRow } from "./types";

// G12: assembles a role-specific, locale-resolved "form document" — the full
// set of section headers, questions, answer options, and rubric text a
// reviewer sees on /{school}/{program}/{role}/{lang}, in reading order. The
// per-role DOCX export renders this model into a printable Word file.
//
// This is DIFFERENT from the existing /export/docx route, which exports the
// shared LO question template (role-neutral). Here each role's own
// non-LO copy (report items, center questions, skills, expenses, …) is
// pulled from the same copy modules the wizards use, so the Word file can't
// drift from the live form.

export type FormDocQuestionType = "rating" | "text" | "choice" | "checkbox" | "info";

export type FormDocScaleLevel = {
  score: number;
  label: string;
  description?: string;
  /** Present when this level is intentionally unselectable (e.g. skill level 1). */
  disabled?: boolean;
};

export type FormDocQuestion = {
  /** LO code or short item label (e.g. "ข้อ 1", "LO1.1"). Optional for text/info. */
  code?: string;
  text: string;
  type: FormDocQuestionType;
  /** For "rating": the levels ordered high -> low (matches the on-screen card order). */
  scale?: FormDocScaleLevel[];
  /** For "choice": the selectable options. */
  choices?: string[];
  /** For "checkbox": the items that can be multi-selected. */
  items?: string[];
  helper?: string;
  /** Optional English text shown alongside (for reference) when the doc is Thai. */
  textEn?: string;
};

export type FormDocSection = {
  title: string;
  questions: FormDocQuestion[];
};

export type RoleFormDoc = {
  role: FormRole;
  formName: string;
  programName: string;
  programCode: string;
  sections: FormDocSection[];
};

// ---------- LO locale resolution ----------

function loQuestionText(q: QuestionRow, locale: Locale): string {
  if (locale === "th") return q.text;
  return q.text_en?.trim() || q.text;
}

function loOptionLabel(opt: OptionRow, locale: Locale): string {
  if (locale === "th") return opt.label_th;
  return opt.label_en?.trim() || ENGLISH_SCORE_LABELS[opt.score] || `Level ${opt.score}`;
}

function loOptionDescription(opt: OptionRow, locale: Locale): string | undefined {
  const th = opt.description_th?.trim();
  const en = opt.description_en?.trim();
  if (locale === "th") return th || undefined;
  return en || th || undefined;
}

// Build the rating scale for an LO question from its DB options. Falls back to
// the wizard's LO fallback scale (WIZARD_COPY.rating) when a question has no
// options configured — same fallback the on-screen RatingCard uses.
function loScale(question: QuestionRow, locale: Locale): FormDocScaleLevel[] {
  const opts = question.options.length > 0
    ? [...question.options]
    : fallbackLoOptions();
  return opts
    .sort((a, b) => b.score - a.score)
    .map((opt) => ({
      score: opt.score,
      label: loOptionLabel(opt, locale),
      description: loOptionDescription(opt, locale),
    }));
}

function fallbackLoOptions(): OptionRow[] {
  const labels = WIZARD_COPY.th.rating; // low -> high, 5 levels
  return labels.map((label, i) => ({
    id: `fallback-${i}`,
    score: i + 1,
    label_th: label,
    label_en: WIZARD_COPY.en.rating[i],
    description_th: null,
    description_en: null,
    sequence: i + 1,
  }));
}

// Split a template's LO sections into the two competency groups every wizard
// uses: primary (knowledge/skills) and secondary (ethics/character), per
// PRIMARY_DOMAINS in copy.ts.
function splitLoSections(doc: TemplateDoc): { primary: SectionRow[]; secondary: SectionRow[] } {
  const primary = doc.sections.filter((s) => PRIMARY_DOMAINS.has(s.domain_type));
  const secondary = doc.sections.filter((s) => !PRIMARY_DOMAINS.has(s.domain_type));
  return { primary, secondary };
}

function loQuestionsFromSections(sections: SectionRow[], locale: Locale): FormDocQuestion[] {
  const out: FormDocQuestion[] = [];
  for (const section of sections) {
    for (const q of section.questions) {
      out.push({
        code: q.lo_code ?? undefined,
        text: loQuestionText(q, locale),
        textEn: locale === "th" ? (q.text_en?.trim() || undefined) : undefined,
        type: "rating",
        scale: loScale(q, locale),
      });
    }
  }
  return out;
}

// Build a "rating" question from a plain text item + a 4-level (or n-level)
// label array ordered low -> high. Used for report items, center items, and
// workplace items that have no DB options.
function ratingQuestion(text: string, labelsLowHigh: readonly string[], code?: string): FormDocQuestion {
  const scale: FormDocScaleLevel[] = labelsLowHigh
    .map((label, i) => ({ score: i + 1, label }))
    .reverse(); // high -> low for display
  return { code, text, type: "rating", scale };
}

// ---------- Per-role assembly ----------

function companySections(doc: TemplateDoc | null, locale: Locale): FormDocSection[] {
  const c = WIZARD_COPY[locale];
  const { primary, secondary } = doc ? splitLoSections(doc) : { primary: [], secondary: [] };
  const sections: FormDocSection[] = [];

  // 1. General info
  sections.push({
    title: c.steps[0][0],
    questions: [
      info(c.evaluatorInfo),
      info(c.evaluatorName), info(c.email), info(c.semester), info(c.academicYear),
      info(c.company), info(c.position), info(c.department), info(c.phone),
      info(c.studentInfo),
      info(c.studentCode), info(c.studentName), info(c.school), info(c.program),
    ],
  });

  // 2. Expected skills (16 skills, each a checkbox + 5-level necessity; level 1 disabled)
  const skillQs: FormDocQuestion[] = c.skills.map((skill, i) => ({
    code: `${i + 1}`,
    text: skill,
    type: "checkbox",
    scale: c.skillNecessity.map((label, idx) => ({
      score: idx + 1,
      label,
      disabled: idx === 0,
    })).reverse(),
    helper: c.skillNecessityDisabledHint,
  }));
  sections.push({
    title: c.steps[1][0],
    questions: [info(c.skillsInstructions), ...skillQs],
  });

  // 3. Knowledge and skills (LO primary)
  sections.push({ title: c.steps[2][0], questions: loQuestionsFromSections(primary, locale) });

  // 4. Ethics and character (LO secondary)
  sections.push({ title: c.steps[3][0], questions: loQuestionsFromSections(secondary, locale) });

  // 5. Report / project
  sections.push({
    title: c.steps[4][0],
    questions: c.reportItems.map((item, i) => ratingQuestion(item, c.reportRating, `${i + 1}`)),
  });

  // 6. Feedback
  sections.push({
    title: c.steps[5][0],
    questions: [
      text(c.strengths, c.strengthsHelp),
      text(c.improvements, c.improvementsHelp),
      choice(c.hiring, [c.interested, c.notInterested]),
      choice(c.nextYear, [c.willing, c.unavailable]),
      text(c.nextYearCount),
      info(c.processNotice),
      ...c.centerItems.map((item, i) => ratingQuestion(item, c.centerRating, `${i + 1}`)),
      text(c.otherComments),
    ],
  });

  return sections;
}

function advisorSections(doc: TemplateDoc | null, locale: Locale): FormDocSection[] {
  const c = WIZARD_COPY[locale];
  const a = ADVISOR_COPY[locale];
  const { primary, secondary } = doc ? splitLoSections(doc) : { primary: [], secondary: [] };
  const sections: FormDocSection[] = [];

  // 1-3. General info + LO competencies (same split as company)
  sections.push({
    title: c.steps[0][0],
    questions: [
      info(c.evaluatorInfo),
      info(c.evaluatorName), info(c.email), info(c.semester), info(c.academicYear),
      info(c.studentInfo),
      info(c.studentCode), info(c.studentName), info(c.school), info(c.program),
    ],
  });
  sections.push({ title: c.steps[2][0], questions: loQuestionsFromSections(primary, locale) });
  sections.push({ title: c.steps[3][0], questions: loQuestionsFromSections(secondary, locale) });

  // 4. Report
  sections.push({
    title: a.reportTitle,
    questions: a.reportItems.map((item, i) => ratingQuestion(item, a.reportRating, `${i + 1}`)),
  });

  // 5. Comments
  sections.push({
    title: a.otherTitle,
    questions: [
      ...a.otherItems.map((item, i) => ratingQuestion(item, a.rating4, `${i + 1}`)),
      text(a.strengths, a.strengthsHelp),
      text(a.improvements, a.improvementsHelp),
    ],
  });

  // 6. Center + workplace
  sections.push({
    title: c.steps[5][0],
    questions: [
      ...a.centerItems.map((item, i) => ratingQuestion(item, a.rating4, `${i + 1}`)),
      ...a.workplaceItems.map((item, i) => ratingQuestion(item, a.rating4, `${i + 1}`)),
      choice(a.premiumWorkplace, [a.premiumYes, a.premiumNo, a.premiumReview]),
      choice(a.futurePlacement, [a.futureShould, a.futureShouldNot, a.futureOther]),
      text(a.otherComments),
    ],
  });

  return sections;
}

function studentSections(doc: TemplateDoc | null, locale: Locale): FormDocSection[] {
  const c = WIZARD_COPY[locale];
  const s = STUDENT_COPY[locale];
  const { primary, secondary } = doc ? splitLoSections(doc) : { primary: [], secondary: [] };
  const sections: FormDocSection[] = [];

  // 1. General info
  sections.push({
    title: s.steps[0][0],
    questions: [
      info(s.disclosure),
      info(c.studentCode), info(c.studentName), info(c.school), info(c.program),
      info(c.semester), info(c.academicYear),
      info(s.workplaceName), info(s.workplaceAddress),
    ],
  });

  // 2. Expenses and accommodation
  sections.push({
    title: s.steps[1][0],
    questions: [
      choice(s.compensationType, [s.compensationNone, s.compensationMoney, s.compensationBenefits, s.compensationMoneyBenefits]),
      text(s.dailyWage, s.amountHelper),
      text(s.monthlyWage, s.amountHelper),
      checkbox(s.benefitsReceived, [
        s.benefitHousing, s.benefitMeals, s.benefitTransport, s.benefitMedical,
        s.benefitLifeInsurance, s.benefitAccidentInsurance, s.benefitUniform, s.benefitOther,
      ]),
      text(s.accommodationCost),
      text(s.foodCost),
      text(s.travelCost),
      text(s.bookFeeCost),
      text(s.materialInsuranceCost),
      text(s.monthlyRentCost),
      text(s.otherExpenses, s.otherExpensesHelper),
      text(s.accommodationInfo, s.accommodationInfoHelper),
      choice(s.recommendAccommodation, [s.recommendYes, s.recommendNo]),
    ],
  });

  // 3-4. LO self-assessment (knowledge/skills, ethics/character)
  sections.push({ title: s.steps[2][0], questions: loQuestionsFromSections(primary, locale) });
  sections.push({ title: s.steps[3][0], questions: loQuestionsFromSections(secondary, locale) });

  // 5. Strengths / growth
  sections.push({
    title: s.steps[4][0],
    questions: [text(s.ownStrengths), text(s.ownImprovements)],
  });

  // 6. Center + workplace
  sections.push({
    title: s.steps[5][0],
    questions: [
      ...s.centerItems.map((item, i) => ratingQuestion(item, s.rating4, `${i + 1}`)),
      ...s.workplaceSupportItems.map((item, i) => ratingQuestion(item, s.rating4, `${i + 1}`)),
      choice(s.futurePlacement, [s.futureShould, s.futureShouldNot, s.futureOther]),
      text(s.otherComments),
    ],
  });

  return sections;
}

// ---------- Builders for non-rating question types ----------

function info(label: string): FormDocQuestion {
  return { text: label, type: "info" };
}
function text(label: string, helper?: string): FormDocQuestion {
  return { text: label, type: "text", helper: helper || undefined };
}
function choice(label: string, options: string[]): FormDocQuestion {
  return { text: label, type: "choice", choices: options };
}
function checkbox(label: string, items: string[]): FormDocQuestion {
  return { text: label, type: "checkbox", items };
}

// ---------- Public API ----------

export async function getRoleFormDoc(
  program: ProgramRow,
  role: FormRole,
  locale: Locale
): Promise<RoleFormDoc> {
  let doc: TemplateDoc | null = null;
  try {
    doc = isFixtureMode() ? getFixtureTemplateDoc(program.id) : await getTemplateDoc(program.id, program);
  } catch {
    doc = null;
  }

  let sections: FormDocSection[];
  if (role === "company") sections = companySections(doc, locale);
  else if (role === "advisor") sections = advisorSections(doc, locale);
  else sections = studentSections(doc, locale);

  return {
    role,
    formName: FORM_NAMES[locale][role],
    programName: programDisplayName(program, locale),
    programCode: program.code,
    sections,
  };
}

export { FORM_ROLES };
