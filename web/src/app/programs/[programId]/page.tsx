import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProgram,
  getProgramRouteKey,
  getTemplatesByProgram,
  getSectionsByTemplate,
  getQuestionsByTemplate,
  getOptionsByQuestion,
  type Question,
  type Option,
} from "@/lib/db";
import { isInternationalContext, resolveLocale, schoolDisplayName, type Locale, uiCopy, withLocale } from "@/lib/i18n";
import { getSchoolSlug } from "@/lib/schools";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { PageHeader } from "@/components/PageHeader";
import { PrintButton } from "@/components/PrintButton";
import { ViewEditToggle } from "@/components/ViewEditToggle";
import { EvaluationWizard } from "./EvaluationWizard";

export const dynamic = "force-dynamic";

type QuestionWithOptions = Question & { options: Option[] };

function Toolbar({ programKey, hasTemplate, locale }: { programKey: string; hasTemplate: boolean; locale: Locale }) {
  const copy = uiCopy[locale];
  const secondary = "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover";

  return (
    <nav aria-label={copy.tools} className="flex w-full gap-2 overflow-x-auto pb-1 print:hidden sm:w-auto">
      <ViewEditToggle
        active="view"
        viewHref={withLocale(`/programs/${programKey}`, locale)}
        editHref={hasTemplate ? withLocale(`/programs/${programKey}/edit`, locale) : "#main-content"}
        viewLabel={copy.view}
        editLabel={copy.edit}
        groupLabel={copy.tools}
      />
      {hasTemplate && <>
        <PrintButton className={secondary} label={copy.print} previewHref={withLocale(`/programs/${programKey}/print`, locale)} />
        <Link href={withLocale(`/programs/${programKey}/export/docx`, locale)} className={secondary}>{copy.downloadWord}</Link>
        <Link href={withLocale(`/programs/${programKey}/history`, locale)} className={secondary}>{copy.history}</Link>
      </>}
    </nav>
  );
}

async function getTemplateWithData(templateId: string): Promise<{
  sections: Awaited<ReturnType<typeof getSectionsByTemplate>>;
  questions: QuestionWithOptions[];
}> {
  const [sections, questions] = await Promise.all([
    getSectionsByTemplate(templateId),
    getQuestionsByTemplate(templateId),
  ]);

  const questionIds = questions.map((question) => question.id);
  const options = await getOptionsByQuestion(questionIds);
  const optionsByQuestion = new Map<string, Option[]>();
  for (const option of options) {
    const grouped = optionsByQuestion.get(option.question_id) ?? [];
    grouped.push(option);
    optionsByQuestion.set(option.question_id, grouped);
  }

  const questionsWithOptions = questions.map((question) => ({
    ...question,
    options: optionsByQuestion.get(question.id) ?? [],
  }));
  const uniqueQuestions = new Map<string, QuestionWithOptions>();
  for (const question of questionsWithOptions) {
    const key = question.lo_code?.trim().toUpperCase() || question.id;
    const existing = uniqueQuestions.get(key);
    if (!existing || question.text.length < existing.text.length) uniqueQuestions.set(key, question);
  }

  return { sections, questions: [...uniqueQuestions.values()].sort((a, b) => a.sequence - b.sequence) };
}

export default async function ProgramPage({
  params,
  searchParams,
}: PageProps<"/programs/[programId]">) {
  const { programId } = await params;
  const requestedLanguage = (await searchParams).lang;
  const program = await getProgram(programId);
  if (!program) notFound();
  const locale = resolveLocale(requestedLanguage, isInternationalContext(program.school) || isInternationalContext(program.name_th) || isInternationalContext(program.code));
  const copy = uiCopy[locale];
  const programKey = getProgramRouteKey(program);
  const programPath = `/programs/${programKey}`;
  if (programId !== programKey) permanentRedirect(withLocale(programPath, locale));
  const programName = locale === "en" ? program.name_en || (program.code === "INTL" ? "International Program (WUIC)" : program.name_th) : program.name_th;
  const schoolName = schoolDisplayName(program.school ?? (locale === "en" ? "School" : "สำนักวิชา"), locale);

  const templates = await getTemplatesByProgram(program.id);
  const template = templates[0] ?? null;
  const { sections, questions } = template
    ? await getTemplateWithData(template.id)
    : { sections: [], questions: [] };

  return (
    <div className="flex-1">
      <PageHeader
        title={programName}
        subtitle={locale === "en" ? template?.title_en || template?.name || copy.previewSubtitle : template?.name ?? copy.previewSubtitle}
        breadcrumbs={[
          { label: copy.home, href: withLocale("/", locale) },
          {
            label: schoolName,
            href: withLocale(`/schools/${getSchoolSlug(program.school)}`, locale),
          },
          { label: programName },
        ]}
      >
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Toolbar programKey={programKey} hasTemplate={Boolean(template)} locale={locale} />
          <LanguageSwitch locale={locale} thHref={withLocale(programPath, "th")} enHref={withLocale(programPath, "en")} />
        </div>
      </PageHeader>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <EvaluationWizard
          program={program}
          template={template}
          sections={sections}
          questions={questions}
          locale={locale}
        />
      </main>
    </div>
  );
}
