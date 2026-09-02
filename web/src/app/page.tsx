import { getSchoolsWithProgress, type SchoolWithProgress } from "@/lib/db";
import { isFixtureMode, getFixtureSchoolsWithProgress } from "@/lib/fixtures";
import { resolveLocale, schoolDisplayName, uiCopy, withLocale } from "@/lib/i18n";
import { getSchoolSlug } from "@/lib/schools";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { PageHeader } from "@/components/PageHeader";
import { SchoolsDashboard, type SchoolSummary } from "@/components/ui/schools-dashboard";

export const dynamic = "force-dynamic";

function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return <div className="flex flex-col gap-1">
    <div className="flex items-baseline justify-between text-sm"><span className="text-secondary">{label}</span><span className="font-semibold text-primary tabular-nums">{value}/{max}</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-sunken" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}><div className="h-full rounded-full bg-action transition-[width]" style={{ width: `${pct}%` }} /></div>
  </div>;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const requestedLanguage = (await searchParams).lang;
  const locale = resolveLocale(requestedLanguage);
  const copy = uiCopy[locale];
  let schools: SchoolWithProgress[] = [];
  let hasError = false;

  if (isFixtureMode()) schools = getFixtureSchoolsWithProgress();
  else {
    try {
      schools = await getSchoolsWithProgress();
    } catch (error) {
      console.error("Unable to load schools", error);
      hasError = true;
    }
  }

  const totalPrograms = schools.reduce((sum, school) => sum + school.program_count, 0);
  const totalSubmitted = schools.reduce((sum, school) => sum + school.submitted_count, 0);
  const totalStandard4 = schools.reduce((sum, school) => sum + school.standard_4_count, 0);

  // Serialize for client component
  const summaries: SchoolSummary[] = schools.map((school) => {
    const path = `/schools/${getSchoolSlug(school.name)}`;
    const href = requestedLanguage === "th" || requestedLanguage === "en" ? withLocale(path, locale) : path;
    return {
      name: school.name,
      displayName: schoolDisplayName(school.name, locale),
      href,
      program_count: school.program_count,
      submitted_count: school.submitted_count,
      pending_count: school.pending_count,
      standard_4_count: school.standard_4_count,
      legacy_5_count: school.legacy_5_count,
      needs_descriptions_count: school.needs_descriptions_count,
    };
  });

  return <div className="flex-1">
    <PageHeader title={copy.appTitle} subtitle={copy.appDescription} breadcrumbs={[{ label: copy.home }]}>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        {schools.length > 0 ? <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center rounded-full bg-sunken px-3 py-1 text-secondary"><strong className="mr-1.5 text-primary">{schools.length}</strong>{copy.schools}</span>
          <span className="inline-flex items-center rounded-full bg-sunken px-3 py-1 text-secondary"><strong className="mr-1.5 text-primary">{totalPrograms}</strong>{copy.programs}</span>
        </div> : <span />}
        <LanguageSwitch locale={locale} thHref="/?lang=th" enHref="/?lang=en" />
      </div>
    </PageHeader>

    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {hasError ? <div role="alert" className="rounded-xl border border-error-border bg-error-bg p-6">
        <h2 className="text-lg font-semibold text-error-text">{copy.loadError}</h2><p className="mt-2 text-sm text-secondary">{copy.loadErrorHelp}</p>
      </div> : schools.length === 0 ? <div className="py-16 text-center"><h2 className="text-xl font-semibold text-primary">{copy.noSchools}</h2><p className="mt-2 text-secondary">{copy.addPrograms}</p></div> : <>
        <div className="mb-8 grid gap-4 rounded-xl border border-border-default bg-raised p-5 sm:grid-cols-2"><ProgressBar value={totalSubmitted} max={totalPrograms} label={copy.submitted} /><ProgressBar value={totalStandard4} max={totalSubmitted} label={copy.standard4} /></div>
        <SchoolsDashboard schools={summaries} locale={locale} />
      </>}
    </main>

    <footer className="mt-auto border-t border-border-default bg-sunken"><div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-tertiary sm:px-6 lg:px-8"><p>{copy.footer}</p></div></footer>
  </div>;
}
