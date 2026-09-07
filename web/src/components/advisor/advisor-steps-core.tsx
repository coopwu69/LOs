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
import { ACADEMIC_TERMS } from "@/lib/evaluation-schema";

type QuestionWithOptions = Question & { options: Option[] };
type FieldErrors = Record<string, string>;

export const ADVISOR_STEPS: Record<Locale, [string, string, string][]> = {
  th: [
    ["ข้อมูลทั่วไป", "ข้อมูลทั่วไปของอาจารย์นิเทศและนักศึกษา", "กรอกข้อมูลพื้นฐานที่จำเป็นสำหรับการประเมิน"],
    ["LO ชุดแรก", "สมรรถนะความรู้และทักษะ", "ประเมินสมรรถนะที่เกี่ยวข้องกับความรู้และทักษะ"],
    ["LO ชุดสอง", "สมรรถนะจริยธรรมและลักษณะบุคคล", "ประเมินสมรรถนะที่เกี่ยวข้องกับจริยธรรมและลักษณะบุคคล"],
    ["อื่น ๆ", "ข้อคิดเห็นและจุดเด่น", "บันทึกข้อคิดเห็นเชิงคุณภาพ"],
    ["ศูนย์สหกิจ+หน่วยงาน", "ศูนย์สหกิจศึกษาและสถานประกอบการ", "ประเมินด้านกระบวนการและความเหมาะสม"],
    ["รายงาน", "รายงานหรือโครงงาน", "ประเมินคุณภาพรายงานหรือโครงงานสหกิจศึกษา"],
  ],
  en: [
    ["General information", "Advisor and student information", "Provide the basic information required for the evaluation."],
    ["LO set 1", "Knowledge and skills competencies", "Evaluate knowledge- and skills-related competencies."],
    ["LO set 2", "Ethics and character competencies", "Evaluate ethics- and character-related competencies."],
    ["Other", "Comments and strengths", "Record qualitative comments."],
    ["Co-op center + workplace", "Cooperative education center and workplace", "Evaluate process and placement suitability."],
    ["Report", "Report or project", "Evaluate the cooperative education report or project."],
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
}: {
  locale: Locale;
  errors?: FieldErrors;
}) {
  const copy = COPY[locale];
  const years = [...new Set(ACADEMIC_TERMS.map((t) => t.year))].sort();
  const semesters = [...new Set(ACADEMIC_TERMS.map((t) => t.semester))].sort();
  const academicYearOptions = years.map((year) => ({
    value: year,
    label: locale === "en" ? String(Number(year) - 543) : year,
  }));
  const semesterOptions = semesters.map((semester) => ({
    value: semester,
    label: locale === "en" ? `Semester ${semester}` : `ภาคการศึกษาที่ ${semester}`,
  }));

  const advisorNameLabel = locale === "en" ? "Advisor's full name" : "ชื่อ–สกุลอาจารย์นิเทศ";

  return (
    <div className="space-y-10">
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
