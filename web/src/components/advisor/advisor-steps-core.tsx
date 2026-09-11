"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Option, Question, Section } from "@/lib/db";
import { type Locale } from "@/lib/i18n";
import {
  WIZARD_COPY as COPY,
  PRIMARY_DOMAINS,
  optionLabel,
  questionText,
  sectionTitle,
} from "@/components/evaluation/copy";
import { Field, SelectField, Required } from "@/components/evaluation";
import { RatingCard, type RatingLevel } from "@/components/evaluation";
import type { ChangeEvent } from "react";
import { ACADEMIC_TERMS, semestersForYear } from "@/lib/evaluation-schema";

type QuestionWithOptions = Question & { options: Option[] };
type FieldErrors = Record<string, string>;

// Named step indices for the advisor wizard (G9 order). Every navigation,
// validation, completion, and render decision must go through these
// constants — never a raw number — so future reorders can't off-by-one.
export const ADVISOR_STEP = {
  GENERAL: 0,
  KNOWLEDGE: 1,
  ETHICS: 2,
  REPORT: 3,
  COMMENTS: 4,
  PROCESS: 5,
} as const;

// Maps a step index saved by a pre-G9 draft to the current layout. Old
// drafts recorded currentStep against the previous order
// (general/lo1/lo2/other/process/report); the payload fields are unchanged
// so only the position needs translating.
export const ADVISOR_LEGACY_STEP_MAP: Record<number, number> = {
  0: ADVISOR_STEP.GENERAL,
  1: ADVISOR_STEP.KNOWLEDGE,
  2: ADVISOR_STEP.ETHICS,
  3: ADVISOR_STEP.COMMENTS,
  4: ADVISOR_STEP.PROCESS,
  5: ADVISOR_STEP.REPORT,
};

// Marker written into draft payloads so a restore can tell which layout the
// saved step index belongs to. Drafts without it are pre-G9.
export const ADVISOR_DRAFT_LAYOUT = "advisor-g9";
export const ADVISOR_DRAFT_LAYOUT_KEY = "step_layout";

// G9.1: the labels of the two LO sections (indices 1-2) are pinned to the
// company form's section names — "ความรู้และทักษะ" / "จริยธรรมและบุคลิก",
// the same strings as WIZARD_COPY[locale].steps. They are literals, not a
// positional WIZARD_COPY.steps[N] import, because G6 inserts a new section
// at index 1 on the company side and would silently desync the position.
// If the company labels change, update these to match.
export const ADVISOR_STEPS: Record<Locale, [string, string, string][]> = {
  th: [
    ["ข้อมูลทั่วไป", "ข้อมูลทั่วไปของอาจารย์นิเทศและนักศึกษา", "กรอกข้อมูลพื้นฐานที่จำเป็นสำหรับการประเมิน"],
    ["ความรู้และทักษะ", "สมรรถนะความรู้และทักษะ", "ประเมินสมรรถนะที่เกี่ยวข้องกับความรู้และทักษะ"],
    ["จริยธรรมและบุคลิก", "สมรรถนะจริยธรรมและลักษณะบุคคล", "ประเมินสมรรถนะที่เกี่ยวข้องกับจริยธรรมและลักษณะบุคคล"],
    ["รายงาน/โครงงาน", "รายงานหรือโครงงาน", "ประเมินคุณภาพรายงานหรือโครงงานสหกิจศึกษา"],
    ["ข้อคิดเห็น", "ข้อคิดเห็นและจุดเด่น", "บันทึกข้อคิดเห็นเชิงคุณภาพ"],
    ["ศูนย์สหกิจ+หน่วยงาน", "ศูนย์สหกิจศึกษาและสถานประกอบการ", "ประเมินด้านกระบวนการและความเหมาะสม"],
  ],
  en: [
    ["General information", "Advisor and student information", "Provide the basic information required for the evaluation."],
    ["Knowledge and skills", "Knowledge and skills competencies", "Evaluate knowledge- and skills-related competencies."],
    ["Ethics and character", "Ethics and character competencies", "Evaluate ethics- and character-related competencies."],
    ["Report / project", "Report or project", "Evaluate the cooperative education report or project."],
    ["Comments", "Comments and strengths", "Record qualitative comments."],
    ["Co-op center + workplace", "Cooperative education center and workplace", "Evaluate process and placement suitability."],
  ],
};

export const ADVISOR_GENERAL_FIELDS = [
  "academic_year",
  "semester",
  "student_code",
  "student_name",
  "company",
  "advisor_name",
] as const;

// --- Step 0: General information ---
export function AdvisorGeneralStep({
  locale,
  errors,
  formVersion,
}: {
  locale: Locale;
  errors?: FieldErrors;
  formVersion: number;
}) {
  const copy = COPY[locale];
  const years = [...new Set(ACADEMIC_TERMS.map((t) => t.year))].sort();
  const academicYearOptions = years.map((year) => ({
    value: year,
    label: locale === "en" ? String(Number(year) - 543) : year,
  }));
  const semesterLabel = (semester: string) => (locale === "en" ? `Semester ${semester}` : `ภาคการศึกษาที่ ${semester}`);

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState("");

  // academic_year drives which semesters are selectable (2569 has 3, 2570
  // onward has 2). The form stays uncontrolled (restoreForm sets DOM values
  // directly on draft restore), so mirror the select's value into state via
  // formVersion the same way ratings/disclosure fields sync from the DOM.
  useEffect(() => {
    const el = containerRef.current?.closest("form")?.elements.namedItem("academic_year");
    if (el instanceof HTMLSelectElement) setSelectedYear(el.value);
  }, [formVersion]);

  const semesterOptions = semestersForYear(selectedYear || years[0]).map((semester) => ({
    value: semester,
    label: semesterLabel(semester),
  }));

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    setSelectedYear(year);
    const semesterEl = event.target.form?.elements.namedItem("semester");
    if (semesterEl instanceof HTMLSelectElement && semesterEl.value && !semestersForYear(year).includes(semesterEl.value)) {
      semesterEl.value = "";
    }
  };

  const advisorNameLabel = locale === "en" ? "Advisor's full name" : "ชื่อ–สกุลอาจารย์นิเทศ";

  return (
    <div className="space-y-10" ref={containerRef}>
      <fieldset>
        <legend className="text-lg font-semibold text-primary">{copy.evaluatorInfo}</legend>
        <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <SelectField
            label={copy.academicYear}
            name="academic_year"
            options={academicYearOptions}
            placeholder={copy.selectAcademicYear}
            required
            error={errors?.academic_year}
            onChange={handleYearChange}
          />
          <SelectField
            label={copy.semester}
            name="semester"
            options={semesterOptions}
            placeholder={copy.selectSemester}
            required
            error={errors?.semester}
          />
          <div className="sm:col-span-2">
            <Field
              label={copy.studentCode}
              name="student_code"
              inputMode="numeric"
              placeholder={copy.studentCodePlaceholder}
              pattern="[0-9]{8}"
              helper={copy.studentCodeHelp}
              autoComplete="off"
              spellCheck={false}
              required
              locale={locale}
              error={errors?.student_code}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label={copy.studentName}
              name="student_name"
              autoComplete="name"
              required
              locale={locale}
              error={errors?.student_name}
            />
          </div>
          <Field
            label={copy.company}
            name="company"
            autoComplete="organization"
            required
            locale={locale}
            error={errors?.company}
          />
          <Field
            label={advisorNameLabel}
            name="advisor_name"
            autoComplete="name"
            required
            locale={locale}
            error={errors?.advisor_name}
          />
        </div>
      </fieldset>
    </div>
  );
}

// --- Steps 1 & 2: LO questions ---
export function AdvisorCompetencyStep({
  sections,
  questions,
  locale,
  errors,
  formVersion,
}: {
  sections: Section[];
  questions: QuestionWithOptions[];
  locale: Locale;
  errors?: FieldErrors;
  formVersion: number;
}) {
  const copy = COPY[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratings, setRatings] = useState<Record<string, number | undefined>>({});

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const next: Record<string, number | undefined> = {};
    for (const q of questions) {
      const group = form.elements.namedItem(`lo-${q.id}`);
      if (group instanceof RadioNodeList) {
        for (const radio of group) {
          if (radio instanceof HTMLInputElement && radio.checked) {
            next[q.id] = Number(radio.value);
            break;
          }
        }
      } else if (group instanceof HTMLInputElement && group.checked) {
        next[q.id] = Number(group.value);
      }
    }
    setRatings(next);
  }, [formVersion, questions]);

  const grouped = useMemo(() => {
    const map = new Map<string, QuestionWithOptions[]>();
    for (const question of questions) {
      if (question.section_id) map.set(question.section_id, [...(map.get(question.section_id) ?? []), question]);
    }
    return map;
  }, [questions]);

  if (questions.length === 0) {
    return (
      <div className="rounded-lg bg-sunken px-5 py-8 text-center text-sm text-secondary">
        {copy.noQuestions}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-10">
      {sections.map((section) => {
        const items = grouped.get(section.id) ?? [];
        if (!items.length) return null;
        return (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-default pb-3">
              <div>
                <p className="text-sm font-medium text-action">
                  {copy.domains[section.domain_type] ?? section.domain_type}
                </p>
                <h3 id={`section-${section.id}`} className="mt-1 text-lg font-semibold text-primary">
                  {sectionTitle(section, locale, copy)}
                </h3>
              </div>
              <span className="text-sm text-secondary">
                {items.length} {copy.questions}
              </span>
            </div>
            <div className="divide-y divide-border-default">
              {items.map((question, index) => {
                const levels: RatingLevel[] =
                  question.options.length > 0
                    ? [...question.options]
                        .sort((a, b) => b.score - a.score)
                        .map((option) => ({
                          value: option.score,
                          label: optionLabel(option, locale),
                          description: (locale === "en" ? option.description_en : option.description_th) || undefined,
                        }))
                    : COPY[locale].rating.map((label, i) => ({
                        value: COPY[locale].rating.length - i,
                        label,
                      }));
                const fieldName = `lo-${question.id}`;
                return (
                  <fieldset key={question.id} className="py-7 first:pt-6 last:pb-0">
                    <legend className="w-full text-base font-medium leading-relaxed text-primary">
                      <span className="mr-2 text-sm font-semibold text-action">
                        {question.lo_code ?? `${copy.question} ${index + 1}`}
                      </span>
                      {questionText(question, locale, copy)}
                      {question.is_required && <Required />}
                    </legend>
                    <div className="mt-4">
                      <RatingCard
                        levels={levels}
                        value={ratings[question.id]}
                        onChange={(v) => setRatings((prev) => ({ ...prev, [question.id]: v }))}
                        name={fieldName}
                        required={question.is_required}
                        error={errors?.[fieldName]}
                        aria-label={question.lo_code ?? `${copy.question} ${index + 1}`}
                      />
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export { PRIMARY_DOMAINS };
