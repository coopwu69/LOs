import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { AssessmentDocument } from "@/components/AssessmentDocument";
import { PrintButton } from "@/components/PrintButton";
import { getProgram, getProgramRouteKey, getTemplateDoc } from "@/lib/db";
import { getFixtureProgram, getFixtureTemplateDoc, isFixtureMode } from "@/lib/fixtures";
import { resolveLocale, uiCopy, withLocale } from "@/lib/i18n";
import type { TemplateDoc } from "@/lib/types";

export const dynamic = "force-dynamic";

// PDF filename when saving from the browser print dialog derives from
// document.title. Use a stable format: "<form title> _ หลักสูตร <program>"
// so files sort together and identify the program without opening.
export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/programs/[programId]/print">): Promise<Metadata> {
  const { programId } = await params;
  const locale = resolveLocale((await searchParams).lang, false);
  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) return {};
  const programName = locale === "en" ? program.name_en || program.name_th : program.name_th;
  const formTitle = locale === "en"
    ? "Cooperative Education Learning Outcomes Evaluation"
    : "แบบประเมิน LOs รายวิชาสหกิจศึกษา";
  const programLabel = locale === "en" ? "Program" : "หลักสูตร";
  return { title: `${formTitle} _ ${programLabel} ${programName}` };
}

export default async function PrintPreviewPage({
  params,
  searchParams,
}: PageProps<"/programs/[programId]/print">) {
  const { programId } = await params;
  const locale = resolveLocale((await searchParams).lang, false);
  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) notFound();

  const programKey = getProgramRouteKey(program);
  const programPath = `/programs/${programKey}`;
  if (programId !== programKey) permanentRedirect(withLocale(`${programPath}/print`, locale));

  let doc: TemplateDoc | null = null;
  try {
    doc = isFixtureMode() ? getFixtureTemplateDoc(program.id) : await getTemplateDoc(program.id, program);
  } catch {
    doc = null;
  }
  if (!doc) notFound();

  const copy = uiCopy[locale];
  const secondary = "inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover";
  const primary = "inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active disabled:opacity-50";

  return (
    <div className="flex-1 bg-sunken print:bg-raised">
      <aside className="sticky top-0 z-20 border-b border-border-default bg-raised/95 px-4 py-3 backdrop-blur print:hidden" aria-label="เครื่องมือแสดงตัวอย่างก่อนพิมพ์">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-primary">ตัวอย่างก่อนพิมพ์</p>
            <p className="text-sm text-secondary">ตรวจสอบแบบประเมิน แล้วเลือกพิมพ์หรือบันทึกเป็น PDF</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={withLocale(programPath, locale)} className={secondary}>กลับไปแบบประเมิน</Link>
            <PrintButton className={primary} label={copy.print} />
          </div>
        </div>
      </aside>
      <main id="main-content" tabIndex={-1} className="mx-auto my-6 w-full max-w-5xl bg-raised px-4 py-8 shadow-sm sm:px-8 lg:px-12 print:my-0 print:max-w-none print:p-0 print:shadow-none">
        <AssessmentDocument doc={doc} locale={locale} />
      </main>
    </div>
  );
}
