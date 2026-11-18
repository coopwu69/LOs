import { TEMPLATE_DOC_TITLE } from "@/lib/form-names";
import type { FormDocQuestion, RoleFormDoc } from "@/lib/form-doc";
import type { Locale } from "@/lib/i18n";

// Print/PDF layout for one role's form. Renders the same RoleFormDoc that the
// Word export (review/export/[role]) uses, so print, Word and the live wizards
// all come from the copy modules via lib/form-doc.ts — there is no second
// hand-written copy of any question to keep in sync.

function Blank({ lines = 1 }: { lines?: number }) {
  return (
    <div className="mt-3 space-y-5" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-5 border-b border-dashed border-border-strong" />
      ))}
    </div>
  );
}

function Question({ question, index }: { question: FormDocQuestion; index: number }) {
  const code = question.code ?? `${index + 1}`;
  return (
    <div className="print-break-avoid py-4">
      <p className="text-base font-medium leading-relaxed text-primary">
        <span className="mr-2 font-semibold text-action">{code}</span>
        {question.text}
      </p>
      {question.textEn && <p className="mt-1 text-sm text-secondary">{question.textEn}</p>}
      {question.helper && <p className="mt-1 text-sm text-secondary">{question.helper}</p>}

      {question.type === "rating" && question.scale && (
        <table className="mt-3 w-full border-collapse text-sm">
          <tbody>
            {question.scale.map((level) => (
              <tr key={`${level.score}-${level.label}`}>
                <td className="w-12 border border-border-strong px-2 py-1.5 text-center font-semibold text-primary">
                  <span className="mr-1" aria-hidden="true">☐</span>
                  {level.scoreLabel ?? level.score}
                </td>
                <td className="w-1/4 border border-border-strong px-2 py-1.5 font-semibold text-primary">{level.label}</td>
                <td className="border border-border-strong px-2 py-1.5 text-secondary">{level.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {question.type === "choice" && question.choices && (
        <ul className="mt-3 space-y-1.5 text-sm text-primary">
          {question.choices.map((choice) => (
            <li key={choice}><span aria-hidden="true">☐ </span>{choice}</li>
          ))}
        </ul>
      )}
      {question.type === "checkbox" && question.items && (
        <ul className="mt-3 space-y-1.5 text-sm text-primary">
          {question.items.map((item) => (
            <li key={item}><span aria-hidden="true">☐ </span>{item}</li>
          ))}
        </ul>
      )}
      {(question.type === "text" || question.type === "info") && <Blank lines={question.type === "text" ? 3 : 1} />}
    </div>
  );
}

export function RoleFormPrint({ doc, locale }: { doc: RoleFormDoc; locale: Locale }) {
  return (
    <article className="space-y-6">
      <header className="text-center print-break-avoid">
        <h1 className="text-xl font-bold text-primary sm:text-2xl">{doc.formName}</h1>
        <p className="mt-2 text-lg font-semibold text-primary">{doc.programName}</p>
        <p className="mt-1 text-sm text-secondary">
          {locale === "en" ? "Program code" : "รหัสหลักสูตร"}: {doc.programCode} · {TEMPLATE_DOC_TITLE[locale]} · {locale === "en" ? "Release" : "เวอร์ชันระบบ"} {doc.buildId}
        </p>
      </header>
      {doc.sections.map((section, i) => (
        <section key={`${i}-${section.title}`} className="rounded-xl border border-border-default bg-raised">
          <h2 className="border-b border-border-default px-5 py-3 text-lg font-semibold text-primary">{section.title}</h2>
          <div className="divide-y divide-border-default px-5">
            {section.questions.map((q, j) => (
              <Question key={j} question={q} index={j} />
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
