import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getProgramPageData,
  getProgramRouteKey,
  type Question,
  type Option,
} from "@/lib/db";
import { getSchoolSlug, getSchoolNameBySlug } from "@/lib/schools";
import { isInternationalContext, programDisplayName, resolveLocale, schoolDisplayName, uiCopy, withLocale, type Locale } from "@/lib/i18n";
import { formPath, isFormRole } from "@/lib/routes";
import { formName } from "@/lib/form-names";
import type { Metadata } from "next";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { PageHeader } from "@/components/PageHeader";
import { PrintButton } from "@/components/PrintButton";
import { ViewEditToggle } from "@/components/ViewEditToggle";
import { EvaluationWizard } from "../../../../programs/[programId]/EvaluationWizard";
import { AdvisorWizard } from "../../advisor/AdvisorWizard";
import { StudentWizard } from "../../student/StudentWizard";

export const dynamic = "force-dynamic";

type PageParams = {
  school: string;
  program: string;
  role: string;
  lang: string;
};

type QuestionWithOptions = Question & { options: Option[] };

// Collapse questions that repeat the same LO code, keeping the tersest wording.
// Mirrors the original /programs/[programId] page — the company form's server
// validation (actions.ts) also dedupes by lo_code, so the client must match.
function dedupeByLoCode(questions: QuestionWithOptions[]): QuestionWithOptions[] {
  const uniqueQuestions = new Map<string, QuestionWithOptions>();
  for (const question of questions) {
    const key = question.lo_code?.trim().toUpperCase() || question.id;
    const existing = uniqueQuestions.get(key);
    if (!existing || question.text.length < existing.text.length) uniqueQuestions.set(key, question);
  }
  return [...uniqueQuestions.values()].sort((a, b) => a.sequence - b.sequence);
}

function Toolbar({ programKey, hasTemplate, locale, returnPath }: { programKey: string; hasTemplate: boolean; locale: Locale; returnPath: string }) {
  const copy = uiCopy[locale];
  const secondary = "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover";
  // The template editor/print/history tools are shared by the company and
  // advisor forms alike, but their own "back to view" links used to hardcode
  // a redirect to the company form. Carry the current form's own URL through
  // as `from` so those tools can send the user back to whichever form (and
  // school/locale) they actually came from.
  const withReturn = (path: string) => `${withLocale(path, locale)}&from=${encodeURIComponent(returnPath)}`;

  return (
    <nav aria-label={copy.tools} className="flex w-full gap-2 overflow-x-auto pb-1 print:hidden sm:w-auto">
      <ViewEditToggle
        active="view"
        viewHref="#main-content"
        editHref={hasTemplate ? withReturn(`/programs/${programKey}/edit`) : "#main-content"}
        viewLabel={copy.view}
        editLabel={copy.edit}
        groupLabel={copy.tools}
      />
      {hasTemplate && <>
        <PrintButton className={secondary} label={copy.print} previewHref={withReturn(`/programs/${programKey}/print`)} />
        <Link href={withLocale(`/programs/${programKey}/export/docx`, locale)} className={secondary}>{copy.downloadWord}</Link>
        <Link href={withReturn(`/programs/${programKey}/history`)} className={secondary}>{copy.history}</Link>
      </>}
    </nav>
  );
}

// Browser-tab title — role-specific so a filler always sees which form
// they're on, not the system-wide fallback in the root layout (G1, goal.md).
// Doesn't re-fetch program data (that'd double the DB query the page below
// already makes); the program name isn't essential for the tab title.
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { role, lang } = await params;
  if (!isFormRole(role)) return {};
  const locale = resolveLocale(lang, false);
  return { title: `${formName(role, locale)} | COOP69` };
}

export default async function FormPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { school, program, role, lang } = await params;

  if (!isFormRole(role)) notFound();

  const schoolName = getSchoolNameBySlug(school);
  if (!schoolName) notFound();

  const programData = await getProgramPageData(program);
  if (!programData) notFound();

  const { program: programRow, template, sections, questions } = programData;

  if (getSchoolSlug(programRow.school) !== school) {
    const programKey = getProgramRouteKey(programRow);
    const canonicalSchool = getSchoolSlug(programRow.school);
    permanentRedirect(formPath(canonicalSchool, programKey, role, resolveLocale(lang, false)));
  }

  const locale = resolveLocale(lang, isInternationalContext(programRow.school) || isInternationalContext(programRow.name_th) || isInternationalContext(programRow.code));
  const copy = uiCopy[locale];
  const programName = programDisplayName(programRow, locale);
  const schoolNameDisplay = schoolDisplayName(programRow.school ?? "", locale);
  const programKey = getProgramRouteKey(programRow);
  const returnPath = formPath(school, programKey, role, locale);

  const header = (
    <PageHeader
      title={programName}
      subtitle={locale === "en" ? template?.title_en || template?.name || copy.previewSubtitle : template?.name ?? copy.previewSubtitle}
      breadcrumbs={[
        { label: copy.home, href: withLocale("/", locale) },
        { label: schoolNameDisplay, href: withLocale(`/schools/${school}`, locale) },
        { label: programName },
      ]}
    >
      <p className="mt-2 text-sm text-secondary">{formName(role, locale)}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Toolbar programKey={programKey} hasTemplate={Boolean(template)} locale={locale} returnPath={returnPath} />
        <LanguageSwitch
          locale={locale}
          thHref={formPath(school, programKey, role, "th")}
          enHref={formPath(school, programKey, role, "en")}
        />
      </div>
    </PageHeader>
  );

  if (role === "company") {
    return (
      <div className="flex-1">
        {header}
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <EvaluationWizard
            program={programRow}
            template={template}
            sections={sections}
            questions={dedupeByLoCode(questions as QuestionWithOptions[])}
            locale={locale}
          />
        </main>
      </div>
    );
  }

  if (role === "student") {
    return (
      <div className="flex-1">
        {header}
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <StudentWizard
            program={programRow}
            template={template}
            sections={sections}
            questions={dedupeByLoCode(questions as QuestionWithOptions[])}
            locale={locale}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {header}
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <AdvisorWizard
          program={programRow}
          template={template}
          sections={sections}
          questions={dedupeByLoCode(questions as QuestionWithOptions[])}
          locale={locale}
          role={role}
        />
      </main>
    </div>
  );
}
