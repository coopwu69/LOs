"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type FieldErrors = Record<string, string>;

const SKILL_COUNT = 16;
const SKILL_INDEXES = Array.from({ length: SKILL_COUNT }, (_, i) => i + 1);

// --- Step 1 (G2): skills the employer expects from the student ---
//
// 16 rows in a compact table: checkbox + skill name + a native <select> for
// the "how necessary" level (1..5). Level 1 ("not required") is never a
// real choice once a skill is ticked at all — ticking it already implies
// relevance — so the select's option list only offers 2..5 (see disabledHint
// copy shown as a footnote instead of an inline per-card message, since a
// native select can't show a disabled-option tooltip the way RatingCard did).
// Not scored into the student's competency total: this captures what the
// *employer* expects, not what the *student* achieved.
//
// Uncontrolled form + draft restore (same bridge pattern as CompetencyStep/
// ReportStep): DOM checkbox/select state is read into React on every
// `formVersion` bump so restored drafts render correctly.
export function SkillExpectationGroup({
  locale,
  errors,
  formVersion,
}: {
  locale: Locale;
  errors?: FieldErrors;
  formVersion: number;
}) {
  const copy = COPY[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [levels, setLevels] = useState<Record<number, number | undefined>>({});
  const instructionsId = useId();

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const nextChecked: Record<number, boolean> = {};
    const nextLevels: Record<number, number | undefined> = {};
    for (const i of SKILL_INDEXES) {
      const box = form.elements.namedItem(`skill-${i}`);
      nextChecked[i] = box instanceof HTMLInputElement && box.checked;
      const select = form.elements.namedItem(`skill-${i}-level`);
      if (select instanceof HTMLSelectElement && select.value) {
        nextLevels[i] = Number(select.value);
      }
    }
    setChecked(nextChecked);
    setLevels(nextLevels);
  }, [formVersion]);

  // A skill just unticked must not leave a stale level value riding along
  // in the submitted payload — reset its <select> in the DOM directly
  // (the form is uncontrolled; FormData reads from the DOM, not React state).
  const handleUncheck = (i: number) => {
    setChecked((prev) => ({ ...prev, [i]: false }));
    setLevels((prev) => ({ ...prev, [i]: undefined }));
    const form = containerRef.current?.closest("form");
    const select = form?.elements.namedItem(`skill-${i}-level`);
    if (select instanceof HTMLSelectElement) select.value = "";
  };

  // Level 1 is intentionally excluded — see the header comment above.
  const levelOptions = copy.skillNecessity
    .map((label, idx) => ({ value: idx + 1, label }))
    .filter((opt) => opt.value !== 1)
    .reverse();

  const minOneError = errors?.skills;

  return (
    <div ref={containerRef} className="space-y-4">
      <p id={instructionsId} className="text-sm leading-relaxed text-secondary">
        {copy.skillsInstructions}
      </p>
      {minOneError && (
        <p role="alert" className="rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text">
          {minOneError}
        </p>
      )}
      <div className="divide-y divide-border-default">
        {SKILL_INDEXES.map((i) => {
          const label = copy.skills[i - 1];
          const isChecked = checked[i] ?? false;
          const fieldName = `skill-${i}`;
          const levelFieldName = `skill-${i}-level`;
          const levelError = errors?.[levelFieldName];
          return (
            <div key={i} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 text-sm text-primary">
                <input
                  type="checkbox"
                  name={fieldName}
                  value="1"
                  checked={isChecked}
                  aria-describedby={instructionsId}
                  onChange={(e) => {
                    if (e.target.checked) setChecked((prev) => ({ ...prev, [i]: true }));
                    else handleUncheck(i);
                  }}
                  className="h-5 w-5 shrink-0 accent-action"
                />
                <span className={isChecked ? "" : "text-secondary"}>{label}</span>
              </label>
              {isChecked ? (
                <select
                  name={levelFieldName}
                  value={levels[i] ?? ""}
                  onChange={(e) => setLevels((prev) => ({ ...prev, [i]: e.target.value ? Number(e.target.value) : undefined }))}
                  aria-label={label}
                  aria-invalid={levelError ? "true" : undefined}
                  className={`min-w-[180px] rounded-lg border bg-surface px-3 py-2 text-sm text-primary ${
                    levelError ? "border-error-text" : "border-border-default"
                  }`}
                >
                  <option value="" disabled>
                    {copy.skillLevelPlaceholder}
                  </option>
                  {levelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value} — {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="min-w-[180px] text-right text-sm text-tertiary" aria-hidden="true">
                  —
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-tertiary">{copy.skillNecessityDisabledHint}</p>
    </div>
  );
}
