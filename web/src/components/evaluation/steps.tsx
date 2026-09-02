"use client";

import { useMemo } from "react";
import type { Option, Program, Question, Section } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import {
  WIZARD_COPY as COPY,
  PRIMARY_DOMAINS,
  ENGLISH_SCORE_LABELS,
  englishQuestionFallback,
} from "./copy";
import { Field, SelectField, TextAreaField, Required } from "./fields";
import { RatingScale } from "./RatingScale";
import { ChoiceGroup } from "./ChoiceGroup";

type QuestionWithOptions = Question & { options: Option[] };
type FieldErrors = Record<string, string>;

// --- Step 0: General information ---
export function GeneralStep({
  program,
  locale,
  errors,
}: {
  program: Program;
  locale: Locale;
  errors?: FieldErrors;
}) {
  const copy = COPY[locale];
  const semesterOptions = [1, 2].map((semester) => ({
    value: String(semester),
    label: locale === "en" ? `Semester ${semester}` : `ภาคการศึกษาที่ ${semester}`,
  }));
  const academicYearOptions = [2569, 2570].map((year) => ({
    value: String(year),
    label: locale === "en" ? String(year - 543) : String(year),
  }));
  const programName =
    locale === "en"
      ? program.name_en || (program.code === "INTL" ? "International Program (WUIC)" : program.name_th)
      : program.name_th;

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="text-lg font-semibold text-primary">{copy.evaluatorInfo}</legend>
        <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field label={copy.email} name="evaluator_email" type="email" placeholder="name@company.com" inputMode="email" autoComplete="email" spellCheck={false} required locale={locale} error={errors?.evaluator_email} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label={copy.semester} name="semester" options={semesterOptions} placeholder={copy.selectSemester} required error={errors?.semester} />
            <SelectField label={copy.academicYear} name="academic_year" options={academicYearOptions} placeholder={copy.selectAcademicYear} required error={errors?.academic_year} />
          </div>
          <div className="sm:col-span-2">
            <Field label={copy.company} name="company" autoComplete="organization" required locale={locale} error={errors?.company} />
          </div>
          <Field label={copy.evaluatorName} name="evaluator_name" autoComplete="name" required locale={locale} error={errors?.evaluator_name} />
          <Field label={copy.position} name="position" autoComplete="organization-title" required locale={locale} error={errors?.position} />
          <Field label={copy.department} name="department" autoComplete="organization" required locale={locale} error={errors?.department} />
          <Field label={copy.phone} name="phone" type="tel" inputMode="tel" placeholder={copy.phoneExample} pattern="[0-9+() \\-]{8,20}" autoComplete="tel" required locale={locale} error={errors?.phone} />
        </div>
      </fieldset>
      <fieldset className="border-t border-border-default pt-8">
        <legend className="text-lg font-semibold text-primary">{copy.studentInfo}</legend>
        <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label={copy.studentCode} name="student_code" inputMode="numeric" placeholder={copy.studentCodePlaceholder} pattern="[0-9]{8}" helper={copy.studentCodeHelp} autoComplete="off" spellCheck={false} required locale={locale} error={errors?.student_code} />
          </div>
          <div className="sm:col-span-2">
            <Field label={copy.studentName} name="student_name" autoComplete="name" required locale={locale} error={errors?.student_name} />
          </div>
          <Field label={copy.school} name="school" defaultValue={program.school ?? ""} readOnly locale={locale} />
          <Field label={copy.program} name="program" defaultValue={programName} readOnly locale={locale} />
        </div>
      </fieldset>
    </div>
  );
}

// --- Steps 1 & 2: Competency questions ---
export function CompetencyStep({
  sections,
  questions,
  locale,
  errors,
}: {
  sections: Section[];
  questions: QuestionWithOptions[];
  locale: Locale;
  errors?: FieldErrors;
}) {
  const copy = COPY[locale];
  const grouped = useMemo(() => {
    const map = new Map<string, QuestionWithOptions[]>();
    for (const question of questions)
      if (question.section_id) map.set(question.section_id, [...(map.get(question.section_id) ?? []), question]);
    return map;
  }, [questions]);

  if (questions.length === 0)
    return (
      <div className="rounded-lg bg-sunken px-5 py-8 text-center text-sm text-secondary">
        {copy.noQuestions}
      </div>
    );

  return (
    <div className="space-y-10">
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
                  {locale === "en"
                    ? section.title_en || `${copy.domains[section.domain_type] ?? "General"} competencies`
                    : section.title_th}
                </h3>
              </div>
              <span className="text-sm text-secondary">
                {items.length} {copy.questions}
              </span>
            </div>
            <div className="divide-y divide-border-default">
              {items.map((question, index) => {
                const descriptionsAvailable = question.options.some((option) =>
                  locale === "en" ? option.description_en : option.description_th,
                );
                const ratingOptions =
                  question.options.length > 0
                    ? question.options
                    : copy.rating.map((label, ratingIndex) => ({ value: String(ratingIndex + 1), label }));
                const fieldName = `lo-${question.id}`;
                return (
                  <fieldset key={question.id} className="py-7 first:pt-6 last:pb-0">
                    <legend className="w-full text-base font-medium leading-relaxed text-primary">
                      <span className="mr-2 text-sm font-semibold text-action">
                        {question.lo_code ?? `${copy.question} ${index + 1}`}
                      </span>
                      {locale === "en" ? englishQuestionFallback(question.text, question.text_en) : question.text}
                      {question.is_required && <Required />}
                    </legend>
                    <div className="mt-4">
                      <RatingScale
                        name={fieldName}
                        options={ratingOptions}
                        required={question.is_required}
                        locale={locale}
                        error={errors?.[fieldName]}
                      />
                    </div>
                    {descriptionsAvailable && (
                      <details className="mt-4 rounded-lg bg-sunken px-4 py-3 text-sm text-secondary">
                        <summary className="cursor-pointer font-medium text-primary">{copy.rubric}</summary>
                        <ul className="mt-3 space-y-3">
                          {question.options.map((option) => {
                            const description = locale === "en" ? option.description_en : option.description_th;
                            const label =
                              locale === "en"
                                ? option.label_en || ENGLISH_SCORE_LABELS[option.score] || option.label_th
                                : option.label_th;
                            return (
                              description && (
                                <li key={option.id}>
                                  <strong className="text-primary">{option.score} {label}:</strong> {description}
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </details>
                    )}
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

// --- Step 3: Report / project ---
export function ReportStep({ locale, errors }: { locale: Locale; errors?: FieldErrors }) {
  const copy = COPY[locale];
  const options = copy.rating.map((label, index) => ({ value: String(index + 1), label }));
  return (
    <div className="space-y-8">
      {copy.reportItems.map((item, index) => {
        const fieldName = `c-${index}`;
        return (
          <fieldset key={item}>
            <legend className="text-base font-medium leading-relaxed text-primary">
              {index + 1}. {item}
              <Required />
            </legend>
            <div className="mt-4">
              <RatingScale name={fieldName} options={options} locale={locale} error={errors?.[fieldName]} />
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

// --- Step 4: Feedback ---
export function FeedbackStep({ locale, errors }: { locale: Locale; errors?: FieldErrors }) {
  const copy = COPY[locale];
  return (
    <div className="space-y-8">
      <TextAreaField label={copy.strengths} name="strengths" helper={copy.strengthsHelp} required error={errors?.strengths} />
      <TextAreaField label={copy.improvements} name="improvements" helper={copy.improvementsHelp} required error={errors?.improvements} />
      <div className="border-t border-border-default pt-8">
        <ChoiceGroup
          legend={copy.hiring}
          name="hiring_interest"
          options={[
            { value: "yes", label: copy.interested },
            { value: "no", label: copy.notInterested },
          ]}
          error={errors?.hiring_interest}
        />
      </div>
      <ChoiceGroup
        legend={copy.nextYear}
        name="coop_next_year"
        options={[
          { value: "yes", label: copy.willing },
          { value: "no", label: copy.unavailable },
        ]}
        error={errors?.coop_next_year}
      />
      <Field
        label={copy.nextYearCount}
        name="next_year_count"
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="0"
        required
        locale={locale}
        error={errors?.next_year_count}
      />
    </div>
  );
}

// --- Step 5: Process ---
export function ProcessStep({
  answered,
  total,
  locale,
}: {
  answered: number;
  total: number;
  locale: Locale;
}) {
  const copy = COPY[locale];
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-info-border bg-info-bg px-4 py-3 text-sm leading-relaxed text-info-text">
        {copy.processNotice}
      </div>
      <TextAreaField label={copy.processEvaluation} name="process_evaluation" />
      <TextAreaField label={copy.expectedCompetencies} name="expected_competencies" />
      <TextAreaField label={copy.otherComments} name="other_comments" />
      <div className="border-t border-border-default pt-7">
        <h3 className="text-lg font-semibold text-primary">{copy.review}</h3>
        <dl className="mt-4 grid gap-3 rounded-lg bg-sunken p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-secondary">{copy.competencyQuestions}</dt>
            <dd className="mt-1 font-semibold text-primary">
              {copy.answered} {answered} {copy.of} {total}
            </dd>
          </div>
          <div>
            <dt className="text-secondary">{copy.status}</dt>
            <dd className="mt-1 font-semibold text-primary">{copy.ready}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export { PRIMARY_DOMAINS };
