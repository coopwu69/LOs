import type { Locale } from "@/lib/i18n";
import type { ProgramRow } from "@/lib/types";
import { WIZARD_COPY as COPY } from "./evaluation/copy";

function BlankLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="print-break-avoid">
      <p className="text-sm font-medium text-primary">{label}</p>
      <div className="mt-2 min-h-11 rounded-lg border border-border-strong bg-raised px-3.5 py-2.5 text-sm text-primary">
        {value ?? ""}
      </div>
    </div>
  );
}

function BlankArea({ label, helper }: { label: string; helper?: string }) {
  return (
    <div className="print-break-avoid">
      <p className="text-sm font-medium text-primary">{label}</p>
      {helper && <p className="mt-1 text-sm text-secondary">{helper}</p>}
      <div className="mt-2 h-28 rounded-lg border border-border-strong bg-raised" aria-hidden="true" />
    </div>
  );
}

function ChoiceRow({ label, choices }: { label: string; choices: string[] }) {
  return (
    <div className="print-break-avoid">
      <p className="text-sm font-medium text-primary">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {choices.map((choice) => (
          <div key={choice} className="flex min-h-11 items-center gap-3 rounded-lg border border-border-strong bg-raised px-4 py-2.5 text-sm text-primary">
            <span className="h-5 w-5 shrink-0 rounded-full border-2 border-border-strong" aria-hidden="true" />
            {choice}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrintRating({ labels }: { labels: string[] }) {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {labels.map((label, index) => (
        <div key={label} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border border-border-strong bg-raised px-2 py-2 text-center">
          <span className="h-4 w-4 rounded-full border-2 border-border-strong" aria-hidden="true" />
          <span className="text-sm font-semibold text-primary">{index + 1}</span>
          <span className="text-xs text-secondary">{label}</span>
        </div>
      ))}
    </div>
  );
}

function StepSection({ step, title, description, children, locale, newPage = false }: { step: number; title: string; description: string; children: React.ReactNode; locale: Locale; newPage?: boolean }) {
  const copy = COPY[locale];
  return (
    <section className={`print-step rounded-xl border border-border-default bg-raised ${newPage ? "print-break-before-page" : ""}`}>
      <header className="border-b border-border-default px-6 py-5">
        <p className="text-sm font-semibold text-action">{copy.step} {step} {copy.of} 6</p>
        <h2 className="mt-1 text-xl font-semibold text-primary">{title}</h2>
        <p className="mt-1 text-sm text-secondary">{description}</p>
      </header>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

export function FormShell({
  program,
  title,
  revisionLabel,
  courseCodes,
  locale,
  children,
}: {
  program: ProgramRow;
  title: string | null;
  revisionLabel: string | null;
  courseCodes: string[] | null;
  locale: Locale;
  children: React.ReactNode;
}) {
  const copy = COPY[locale];
  const programName = locale === "en" ? program.name_en || program.name_th : program.name_th;

  return (
    <article className="space-y-8">
      <header className="text-center print-break-avoid">
        <h1 className="text-xl font-bold text-primary sm:text-2xl">
          {title ?? (locale === "en" ? "Cooperative Education Learning Outcomes Evaluation" : "แบบประเมินผลลัพธ์การเรียนรู้ที่คาดหวังของรายวิชาสหกิจศึกษา")}
        </h1>
        <p className="mt-2 text-base font-medium text-primary">{programName}</p>
        {revisionLabel && <p className="mt-1 text-sm text-secondary">({revisionLabel})</p>}
        {courseCodes && courseCodes.length > 0 && (
          <p className="mt-1 text-sm text-secondary">{locale === "en" ? "Course code" : "รหัสรายวิชา"}: {courseCodes.join(", ")}</p>
        )}
      </header>

      <StepSection locale={locale} step={1} title={copy.steps[0][1]} description={copy.steps[0][2]}>
        <div className="space-y-8">
          <fieldset>
            <legend className="text-lg font-semibold text-primary">{copy.evaluatorInfo}</legend>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
              <BlankLine label={copy.email} />
              <BlankLine label={copy.semester} />
              <div className="col-span-2"><BlankLine label={copy.company} /></div>
              <BlankLine label={copy.evaluatorName} />
              <BlankLine label={copy.position} />
              <BlankLine label={copy.department} />
              <BlankLine label={copy.phone} />
            </div>
          </fieldset>
          <fieldset className="border-t border-border-default pt-7">
            <legend className="text-lg font-semibold text-primary">{copy.studentInfo}</legend>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
              <BlankLine label={copy.studentCode} />
              <BlankLine label={copy.studentName} />
              <BlankLine label={copy.school} value={program.school} />
              <BlankLine label={copy.program} value={programName} />
            </div>
          </fieldset>
        </div>
      </StepSection>

      {children}

      <StepSection locale={locale} step={4} title={copy.steps[3][1]} description={copy.steps[3][2]} newPage>
        <div className="space-y-8">
          {copy.reportItems.map((item, index) => (
            <fieldset key={item} className="print-break-avoid">
              <legend className="text-base font-medium leading-relaxed text-primary">{index + 1}. {item}</legend>
              <PrintRating labels={copy.rating} />
            </fieldset>
          ))}
        </div>
      </StepSection>

      <StepSection locale={locale} step={5} title={copy.steps[4][1]} description={copy.steps[4][2]} newPage>
        <div className="space-y-8">
          <BlankArea label={copy.strengths} helper={copy.strengthsHelp} />
          <BlankArea label={copy.improvements} helper={copy.improvementsHelp} />
          <div className="border-t border-border-default pt-7">
            <ChoiceRow label={copy.hiring} choices={[copy.interested, copy.notInterested]} />
          </div>
          <ChoiceRow label={copy.nextYear} choices={[copy.willing, copy.unavailable]} />
          <BlankLine label={copy.nextYearCount} />
        </div>
      </StepSection>

      <StepSection locale={locale} step={6} title={copy.steps[5][1]} description={copy.steps[5][2]} newPage>
        <div className="space-y-7">
          <div className="rounded-lg border border-info-border bg-info-bg px-4 py-3 text-sm text-info-text">{copy.processNotice}</div>
          <BlankArea label={copy.processEvaluation} />
          <BlankArea label={copy.expectedCompetencies} />
          <BlankArea label={copy.otherComments} />
        </div>
      </StepSection>
    </article>
  );
}
