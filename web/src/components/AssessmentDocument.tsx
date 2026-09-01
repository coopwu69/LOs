import type { Locale } from "@/lib/i18n";
import type { TemplateDoc, SectionRow, QuestionRow } from "@/lib/types";
import { FormShell } from "./FormShell";
import { ENGLISH_SCORE_LABELS, PRIMARY_DOMAINS, WIZARD_COPY as COPY, englishQuestionFallback } from "./evaluation/copy";

function normalizedSections(sections: SectionRow[]): SectionRow[] {
  const selected = new Map<string, QuestionRow>();
  for (const question of sections.flatMap((section) => section.questions)) {
    const key = question.lo_code?.trim().toUpperCase() || question.id;
    const existing = selected.get(key);
    if (!existing || question.text.length < existing.text.length) selected.set(key, question);
  }
  return sections
    .map((section) => ({
      ...section,
      questions: section.questions.filter((question) => {
        const key = question.lo_code?.trim().toUpperCase() || question.id;
        return selected.get(key)?.id === question.id;
      }),
    }))
    .filter((section) => section.questions.length > 0);
}

function QuestionView({ question, index, locale }: { question: QuestionRow; index: number; locale: Locale }) {
  const copy = COPY[locale];
  const options = question.options.length > 0
    ? [...question.options].sort((a, b) => a.sequence - b.sequence).map((option) => ({
        key: option.id,
        score: option.score,
        label: locale === "en" ? ENGLISH_SCORE_LABELS[option.score] || option.label_th : option.label_th,
        description: option.description_th,
      }))
    : copy.rating.map((label, optionIndex) => ({ key: String(optionIndex), score: optionIndex + 1, label, description: null }));
  const hasDescriptions = options.some((option) => option.description);

  return (
    <fieldset className="py-6 print-break-avoid">
      <legend className="w-full text-base font-medium leading-relaxed text-primary">
        <span className="mr-2 text-sm font-semibold text-action">{question.lo_code ?? `${copy.question} ${index + 1}`}</span>
        {locale === "en" ? englishQuestionFallback(question.text, question.text_en) : question.text}
      </legend>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {options.map((option) => (
          <div key={option.key} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border border-border-strong bg-raised px-2 py-2 text-center">
            <span className="h-4 w-4 rounded-full border-2 border-border-strong" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary">{option.score}</span>
            <span className="text-xs text-secondary">{option.label}</span>
          </div>
        ))}
      </div>
      {hasDescriptions && (
        <div className="mt-4 rounded-lg bg-sunken px-4 py-3 text-xs text-secondary">
          <p className="font-medium text-primary">{copy.rubric}</p>
          <ul className="mt-2 space-y-1.5">
            {options.map((option) => option.description && (
              <li key={option.key}><strong className="text-primary">{option.score} {option.label}:</strong> {option.description}</li>
            ))}
          </ul>
        </div>
      )}
    </fieldset>
  );
}

function SectionView({ section, locale }: { section: SectionRow; locale: Locale }) {
  const copy = COPY[locale];
  return (
    <section aria-labelledby={`print-section-${section.id}`}>
      <div className="flex items-baseline justify-between gap-2 border-b border-border-default pb-3">
        <div>
          <p className="text-sm font-medium text-action">{copy.domains[section.domain_type] ?? section.domain_type}</p>
          <h3 id={`print-section-${section.id}`} className="mt-1 text-lg font-semibold text-primary">
            {locale === "en" ? `${copy.domains[section.domain_type] ?? "General"} competencies` : section.title_th}
          </h3>
        </div>
        <span className="text-sm text-secondary">{section.questions.length} {copy.questions}</span>
      </div>
      <div className="divide-y divide-border-default">
        {section.questions.map((question, index) => <QuestionView key={question.id} question={question} index={index} locale={locale} />)}
      </div>
    </section>
  );
}

function CompetencyPart({ step, sections, locale }: { step: 2 | 3; sections: SectionRow[]; locale: Locale }) {
  const copy = COPY[locale];
  return (
    <section className="print-step print-break-before-page rounded-xl border border-border-default bg-raised">
      <header className="border-b border-border-default px-6 py-5">
        <p className="text-sm font-semibold text-action">{copy.step} {step} {copy.of} 6</p>
        <h2 className="mt-1 text-xl font-semibold text-primary">{copy.steps[step - 1][1]}</h2>
        <p className="mt-1 text-sm text-secondary">{copy.steps[step - 1][2]}</p>
      </header>
      <div className="space-y-10 px-6 py-6">
        {sections.length > 0
          ? sections.map((section) => <SectionView key={section.id} section={section} locale={locale} />)
          : <p className="py-6 text-center text-sm text-secondary">{copy.noQuestions}</p>}
      </div>
    </section>
  );
}

export function AssessmentDocument({ doc, locale }: { doc: TemplateDoc; locale: Locale }) {
  const sections = normalizedSections(doc.sections);
  const primary = sections.filter((section) => PRIMARY_DOMAINS.has(section.domain_type));
  const secondary = sections.filter((section) => !PRIMARY_DOMAINS.has(section.domain_type));

  return (
    <FormShell
      program={doc.program}
      title={doc.title}
      revisionLabel={doc.program.revision_label}
      courseCodes={doc.course_codes}
      locale={locale}
    >
      <CompetencyPart step={2} sections={primary} locale={locale} />
      <CompetencyPart step={3} sections={secondary} locale={locale} />
    </FormShell>
  );
}
