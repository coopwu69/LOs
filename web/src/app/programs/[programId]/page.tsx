import { notFound, permanentRedirect } from "next/navigation";
import { getProgramPageData, getProgramRouteKey } from "@/lib/db";
import { isInternationalContext, resolveLocale } from "@/lib/i18n";
import { getSchoolSlug } from "@/lib/schools";
import { formPath } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function ProgramPage({
  params,
  searchParams,
}: PageProps<"/programs/[programId]">) {
  const { programId } = await params;
  const requestedLanguage = (await searchParams).lang;

  const pageData = await getProgramPageData(programId);
  if (!pageData) notFound();

  const { program } = pageData;
  const locale = resolveLocale(
    requestedLanguage,
    isInternationalContext(program.school) ||
      isInternationalContext(program.name_th) ||
      isInternationalContext(program.code)
  );
  const programKey = getProgramRouteKey(program);
  const schoolSlug = getSchoolSlug(program.school ?? "");

  // Old /programs/[programId] now lives at /[school]/[program]/company/[locale].
  permanentRedirect(formPath(schoolSlug, programKey, "company", locale));
}
