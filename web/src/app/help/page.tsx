import Link from "next/link";
import { resolveLocale, uiCopy, withLocale, type Locale } from "@/lib/i18n";
import { FORM_NAMES } from "@/lib/form-names";
import { HELP_COPY, type HelpStep } from "@/lib/help-copy";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// /help — beginner-proof user guide for reviewers (see lib/help-copy.ts for the
// full TH/EN copy). Server component; every step renders a real screenshot from
// public/help/<locale>/ captured by scripts/capture-help.mjs.
// ---------------------------------------------------------------------------

function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>;
}

function StepFigure({ step, locale, first }: { step: HelpStep; locale: Locale; first: boolean }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border-default bg-raised">
      {/* eslint-disable-next-line @next/next/no-img-element -- static screenshots in public/help */}
      <img
        src={`/help/${locale}/${step.img}`}
        alt={step.imgAlt}
        loading={first ? "eager" : "lazy"}
        className="block w-full h-auto"
      />
      <figcaption className="border-t border-border-default bg-sunken px-4 py-3 text-sm leading-relaxed text-secondary">
        {step.caption}
      </figcaption>
    </figure>
  );
}

function StepBlock({ index, step, locale, first }: { index: number; step: HelpStep; locale: Locale; first?: boolean }) {
  return (
    <li className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action text-sm font-semibold text-inverse"
        >
          {index}
        </span>
        <h3 className="text-base font-semibold leading-snug text-primary">{step.title}</h3>
      </div>
      <div className="flex flex-col gap-2.5 pl-11">
        {step.body.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-secondary">{p}</p>
        ))}
        <div className="mt-1">
          <StepFigure step={step} locale={locale} first={first ?? false} />
        </div>
      </div>
    </li>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-8 text-lg font-semibold tracking-tight text-primary sm:text-xl">
      {children}
    </h2>
  );
}

export default async function HelpPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = resolveLocale((await searchParams).lang);
  const copy = uiCopy[locale];
  const c = HELP_COPY[locale];
  const formNames = FORM_NAMES[locale];
  const pdfName = locale === "th" ? "คู่มือการใช้งานระบบ.pdf" : "user-guide.pdf";

  return (
    <div className="flex-1">
      <PageHeader
        title={c.pageTitle}
        subtitle={c.pageSubtitle}
        breadcrumbs={[{ label: copy.home, href: withLocale("/", locale) }, { label: c.pageTitle }]}
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <a
            href={`/help/guide-${locale}.pdf`}
            download={pdfName}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-action px-4 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active"
          >
            <DownloadIcon />
            {c.pdfButton}
          </a>
          <LanguageSwitch locale={locale} thHref="/help?lang=th" enHref="/help?lang=en" />
        </div>
      </PageHeader>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-12">

          {/* The one fact that must not be buried. */}
          <div role="note" className="rounded-xl border border-warning-border bg-warning-bg p-5 sm:p-6">
            <p className="text-base font-semibold text-warning-text">{c.noticeTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-primary">{c.noticeBody}</p>
          </div>

          {/* Table of contents */}
          <nav aria-label={c.tocTitle} className="rounded-xl border border-border-default bg-raised p-5 sm:p-6 print:block!">
            <p className="text-sm font-semibold text-primary">{c.tocTitle}</p>
            <ol className="mt-3 flex flex-col gap-2">
              {c.toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-action underline-offset-4 hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 1. What this system is */}
          <section className="flex flex-col gap-4">
            <SectionHeading id="what-is">{c.whatTitle}</SectionHeading>
            {c.whatBody.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-secondary">{p}</p>
            ))}
            <div className="rounded-xl border border-border-default bg-raised p-5">
              <p className="text-sm font-semibold text-primary">{c.whatFormsIntro}</p>
              <ol className="mt-3 flex flex-col gap-2.5">
                {(["company", "advisor", "student"] as const).map((role, i) => (
                  <li key={role} className="flex items-start gap-3 text-sm leading-relaxed text-secondary">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong bg-sunken text-xs font-semibold text-primary" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span><span className="font-medium text-primary">{formNames[role]}</span></span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{c.whatFormsSuffix}</p>
            </div>
            <div className="rounded-xl border border-info-border bg-info-bg p-5">
              <p className="text-sm font-semibold text-info-text">{c.whoTitle}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {c.whoBody.map((line, i) => (
                  <p key={i} className="text-sm leading-relaxed text-primary">{line}</p>
                ))}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-secondary">{c.noLoginNote}</p>
          </section>

          {/* 2. Part 1 — finding the review page */}
          <section className="flex flex-col gap-5">
            <SectionHeading id="find">{c.part1Title}</SectionHeading>
            {c.part1Intro.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-secondary">{p}</p>
            ))}
            <ol className="flex flex-col gap-10">
              {c.part1Steps.map((step, i) => (
                <StepBlock key={step.img} index={i + 1} step={step} locale={locale} first={i === 0} />
              ))}
            </ol>
          </section>

          {/* 3. Part 2 — review + confirm */}
          <section className="flex flex-col gap-5">
            <SectionHeading id="review">{c.part2Title}</SectionHeading>
            {c.part2Intro.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-secondary">{p}</p>
            ))}

            <div className="rounded-xl border border-border-default bg-raised p-5">
              <h3 className="text-base font-semibold text-primary">{c.buttonsTitle}</h3>
              <p className="mt-1 text-sm text-secondary">{c.buttonsIntro}</p>
              <figure className="mt-4 overflow-hidden rounded-lg border border-border-default">
                {/* eslint-disable-next-line @next/next/no-img-element -- static screenshots in public/help */}
                <img src={`/help/${locale}/${c.buttonsImg}`} alt={c.buttonsImgAlt} loading="lazy" className="block w-full h-auto" />
                <figcaption className="border-t border-border-default bg-sunken px-4 py-3 text-sm leading-relaxed text-secondary">
                  {c.buttonsCaption}
                </figcaption>
              </figure>
              <dl className="mt-4 flex flex-col gap-3">
                {c.buttons.map((b, i) => (
                  <div key={b.name} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-action text-xs font-semibold text-inverse" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="text-sm leading-relaxed">
                      <dt className="inline font-semibold text-primary">“{b.name}”</dt>
                      <dd className="mt-0.5 text-secondary">{b.does}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-border-default bg-sunken p-5">
              <h3 className="text-base font-semibold text-primary">{c.checklistTitle}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {c.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-secondary">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ol className="flex flex-col gap-10">
              {c.part2Steps.map((step, i) => (
                <StepBlock key={step.img} index={i + 4} step={step} locale={locale} />
              ))}
            </ol>
          </section>

          {/* 4. Glossary */}
          <section className="flex flex-col gap-4">
            <SectionHeading id="glossary">{c.glossaryTitle}</SectionHeading>
            <div className="overflow-hidden rounded-xl border border-border-default">
              <dl className="divide-y divide-border-default bg-raised">
                {c.glossary.map((g) => (
                  <div key={g.term} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                    <dt className="shrink-0 text-sm font-semibold text-primary sm:w-48">{g.term}</dt>
                    <dd className="text-sm leading-relaxed text-secondary">{g.def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* 5. FAQ */}
          <section className="flex flex-col gap-4">
            <SectionHeading id="faq">{c.faqTitle}</SectionHeading>
            <div className="flex flex-col gap-3">
              {c.faq.map((f) => (
                <details key={f.q} className="group rounded-xl border border-border-default bg-raised">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg className="h-4 w-4 shrink-0 text-tertiary transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <div className="flex flex-col gap-2 border-t border-border-default px-5 py-4">
                    {f.a.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-secondary">{p}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 6. Staff note */}
          <section className="flex flex-col gap-3">
            <SectionHeading id="staff">{c.staffTitle}</SectionHeading>
            <div className="rounded-xl border border-border-default bg-raised p-5">
              {c.staffBody.map((p, i) => (
                <p key={i} className={`text-sm leading-relaxed text-secondary${i > 0 ? " mt-2.5" : ""}`}>{p}</p>
              ))}
            </div>
          </section>

          <Link href={withLocale("/", locale)} className="self-start text-sm font-medium text-action underline-offset-4 hover:underline">
            ← {c.backHome}
          </Link>
        </div>
      </main>

      <footer className="mt-auto border-t border-border-default bg-sunken">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-tertiary sm:px-6 lg:px-8">
          <p>{copy.footer}</p>
        </div>
      </footer>
    </div>
  );
}
