import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getProgram, getProgramRouteKey } from "@/lib/db";
import { isFixtureMode, getFixtureProgram } from "@/lib/fixtures";
import { getSchoolSlug } from "@/lib/schools";
import {
  programDisplayName,
  resolveLocale,
  schoolDisplayName,
  uiCopy,
  withLocale,
  type Locale,
} from "@/lib/i18n";
import { formPath, FORM_ROLES, type FormRole } from "@/lib/routes";
import { FORM_NAMES } from "@/lib/form-names";
import { getLatestReviewConfirmations } from "@/lib/review-confirmations";
import { PageHeader } from "@/components/PageHeader";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ReviewDashboard, type ReviewFormRow } from "@/components/ui/review-dashboard";

export const dynamic = "force-dynamic";

// One-line description of who fills each form in. Mirrors the form-picker
// dialog's copy so the review page and the picker describe the same forms in
// the same words.
const FORM_DESCRIPTIONS: Record<Locale, Record<FormRole, string>> = {
  th: {
    company: "กรอกโดยหน่วยงานหรือพี่เลี้ยงที่ดูแลนักศึกษาระหว่างปฏิบัติงาน",
    advisor: "กรอกโดยอาจารย์นิเทศที่ติดตามและประเมินนักศึกษา",
    student: "กรอกโดยนักศึกษาหลังกลับจากการปฏิบัติงานสหกิจศึกษา",
  },
  en: {
    company: "Filled in by the host company or the on-site supervisor",
    advisor: "Filled in by the faculty advisor who supervises the student",
    student: "Filled in by the student after returning from their placement",
  },
};

const PAGE_TITLE: Record<Locale, string> = {
  th: "ตรวจสอบความครบถ้วนของแบบประเมิน",
  en: "Curriculum review",
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/programs/[programId]/review">): Promise<Metadata> {
  const { programId } = await params;
  const locale = resolveLocale((await searchParams).lang, false);
  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) return {};
  return { title: `${PAGE_TITLE[locale]} | ${programDisplayName(program, locale)}` };
}

export default async function ReviewPage({
  params,
  searchParams,
}: PageProps<"/programs/[programId]/review">) {
  const { programId } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(resolvedSearchParams.lang, false);

  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) notFound();

  const programKey = getProgramRouteKey(program);
  if (programId !== programKey) {
    permanentRedirect(withLocale(`/programs/${programKey}/review`, locale));
  }

  const copy = uiCopy[locale];
  const programName = programDisplayName(program, locale);
  const schoolSlug = getSchoolSlug(program.school);
  const schoolNameDisplay = schoolDisplayName(program.school ?? "", locale);

  // Confirmations are read from the DB (or empty in fixture mode, which has
  // no review table). The dashboard reads the MOST RECENT row per role.
  const confirmations = isFixtureMode()
    ? {}
    : await getLatestReviewConfirmations(program.id);

  const forms: ReviewFormRow[] = FORM_ROLES.map((role) => ({
    role,
    name: FORM_NAMES[locale][role],
    description: FORM_DESCRIPTIONS[locale][role],
    viewHref: formPath(schoolSlug, programKey, role, locale),
    downloadHref: withLocale(`/programs/${programKey}/review/export/${role}`, locale),
    confirmation: confirmations[role] ?? null,
  }));

  const reviewPath = `/programs/${programKey}/review`;

  return (
    <div className="flex-1">
      <PageHeader
        title={PAGE_TITLE[locale]}
        subtitle={programName}
        breadcrumbs={[
          { label: copy.home, href: withLocale("/", locale) },
          { label: schoolNameDisplay, href: withLocale(`/schools/${schoolSlug}`, locale) },
          { label: programName, href: formPath(schoolSlug, programKey, "company", locale) },
          { label: PAGE_TITLE[locale] },
        ]}
      >
        <div className="mt-5 flex justify-end">
          <LanguageSwitch
            locale={locale}
            thHref={withLocale(reviewPath, "th")}
            enHref={withLocale(reviewPath, "en")}
          />
        </div>
      </PageHeader>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ReviewDashboard
          programId={program.id}
          programName={programName}
          programCode={program.code}
          forms={forms}
          locale={locale}
        />
      </main>
    </div>
  );
}
