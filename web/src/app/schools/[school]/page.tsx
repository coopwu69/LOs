import { notFound, permanentRedirect } from "next/navigation";
import { getProgramRouteKey, getProgramsBySchool, getSchoolsWithProgress } from "@/lib/db";
import { getSchoolNameBySlug, getSchoolSlug } from "@/lib/schools";
import { isFixtureMode, getFixtureProgramsBySchool, getFixtureSchoolsWithProgress } from "@/lib/fixtures";
import { isInternationalContext, resolveLocale, schoolDisplayName, uiCopy, withLocale } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { PageHeader } from "@/components/PageHeader";
import { ProgramsList, type ProgramSummary } from "@/components/ui/programs-list";

export const dynamic = "force-dynamic";

export default async function SchoolPage({ params, searchParams }: PageProps<"/schools/[school]">) {
  const { school: rawSchool } = await params;
  const requestedLanguage = (await searchParams).lang;
  const schoolName = getSchoolNameBySlug(rawSchool);
  if (!schoolName) notFound();
  const locale = resolveLocale(requestedLanguage, isInternationalContext(schoolName));
  const canonicalSlug = getSchoolSlug(schoolName);
  if (canonicalSlug !== rawSchool) {
    permanentRedirect(withLocale(`/schools/${canonicalSlug}`, locale));
  }
  const copy = uiCopy[locale];
  const displaySchool = schoolDisplayName(schoolName, locale);
  const allSchools = isFixtureMode() ? getFixtureSchoolsWithProgress() : await getSchoolsWithProgress();
  if (!allSchools.some((school) => school.name === schoolName)) notFound();
  const programs = isFixtureMode() ? getFixtureProgramsBySchool(schoolName) : await getProgramsBySchool(schoolName);
  const path = `/schools/${canonicalSlug}`;

  // Serialize for client component
  const summaries: ProgramSummary[] = programs.map((program) => {
    const programName = locale === "en" ? program.name_en || (program.code === "INTL" ? "International Program (WUIC)" : program.name_th) : program.name_th;
    return {
      id: program.id,
      code: program.code,
      name: programName,
      href: withLocale(`/programs/${getProgramRouteKey(program)}`, locale),
      form_status: program.form_status,
    };
  });

  return <div className="flex-1">
    <PageHeader title={displaySchool} subtitle={`${programs.length} ${copy.programsInSchool}`} breadcrumbs={[{ label: copy.home, href: withLocale("/", locale) }, { label: displaySchool }]}>
      <div className="mt-5 flex justify-end"><LanguageSwitch locale={locale} thHref={withLocale(path, "th")} enHref={withLocale(path, "en")} /></div>
    </PageHeader>

    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {programs.length === 0 ? <div className="py-16 text-center"><h2 className="text-xl font-semibold text-primary">{copy.noPrograms}</h2><p className="mt-2 text-secondary">{copy.addPrograms}</p></div> : <ProgramsList programs={summaries} locale={locale} />}
    </main>
  </div>;
}
