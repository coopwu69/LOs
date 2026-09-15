"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";
import { RatingCard, type RatingLevel } from "./RatingCard";

type FieldErrors = Record<string, string>;

const SKILL_COUNT = 16;
const SKILL_INDEXES = Array.from({ length: SKILL_COUNT }, (_, i) => i + 1);

// --- Step 1 (G2): skills the employer expects from the student ---
//
// 16 checkboxes; ticking one reveals a 5-level "how necessary" RatingCard
// for it (progressive disclosure) with level 1 disabled — ticking the skill
// at all already means it's relevant, so "not required" isn't a real
// choice (RatingCard's disabledValues, see G2 in goal.md). Not scored into
// the student's competency total: this captures what the *employer*
// expects, not what the *student* achieved.
//
// Legend (2026-09-14): the meaning of each 1-5 level used to only exist as
// per-level text baked into the RatingCard component itself. The user asked
// for a single explanatory note instead of repeating it under every one of
// the 16 questions — a compact one-line legend rendered once, directly under
// the section title. System-wide rule from the same conversation: rating
// scales always render highest value first (left to right) — 5 4 3 2 1, not
// 1 2 3 4 5. Audited every other RatingCard call site in the app (LO
// ratings, report/project, advisor sections, coop-center, student form,
// /demo, and the Word export in lib/form-doc.ts) — all of them already
// render high -> low, so this component is the only one that needed fixing.
//
// Uncontrolled form + draft restore (same bridge pattern as CompetencyStep/
// ReportStep): DOM checkbox/radio state is read into React on every
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

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const nextChecked: Record<number, boolean> = {};
    const nextLevels: Record<number, number | undefined> = {};
    for (const i of SKILL_INDEXES) {
      const box = form.elements.namedItem(`skill-${i}`);
      nextChecked[i] = box instanceof HTMLInputElement && box.checked;
      const group = form.elements.namedItem(`skill-${i}-level`);
      if (group instanceof RadioNodeList) {
        for (const radio of group) {
          if (radio instanceof HTMLInputElement && radio.checked) {
            nextLevels[i] = Number(radio.value);
            break;
          }
        }
      } else if (group instanceof HTMLInputElement && group.checked) {
        nextLevels[i] = Number(group.value);
      }
    }
    setChecked(nextChecked);
    setLevels(nextLevels);
  }, [formVersion]);

  // A skill just unticked must not leave a stale level value riding along
  // in the submitted payload — clear its radio group in the DOM directly
  // (the form is uncontrolled; FormData reads from the DOM, not React state).
  const handleUncheck = (i: number) => {
    setChecked((prev) => ({ ...prev, [i]: false }));
    setLevels((prev) => ({ ...prev, [i]: undefined }));
    const form = containerRef.current?.closest("form");
    const group = form?.elements.namedItem(`skill-${i}-level`);
    if (group instanceof RadioNodeList) {
      for (const radio of group) if (radio instanceof HTMLInputElement) radio.checked = false;
    } else if (group instanceof HTMLInputElement) {
      group.checked = false;
    }
  };

  // High -> low, left to right (system-wide rule — see header comment).
  const necessityLevels: RatingLevel[] = copy.skillNecessity
    .map((label, i) => ({ value: i + 1, label }))
    .reverse();

  const minOneError = errors?.skills;

  return (
    <div ref={containerRef} className="space-y-6">
      <p className="text-sm leading-relaxed text-secondary">{copy.skillsInstructions}</p>

      {/* One-line legend explaining what 5..1 mean, shown once for the whole
          section instead of repeating it under each of the 16 questions. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 overflow-x-auto rounded-lg border border-border-default bg-sunken px-4 py-2.5 text-xs text-secondary sm:flex-nowrap sm:whitespace-nowrap">
        <span className="shrink-0 font-semibold text-primary">{copy.skillLegendLabel}</span>
        {copy.skillNecessityShort
          .map((label, i) => ({ value: i + 1, label }))
          .reverse()
          .map(({ value, label }) => (
            <span key={value} className="inline-flex shrink-0 items-center gap-1.5">
              <span
                className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                  value === 1 ? "bg-sunken text-tertiary" : "bg-primary text-primary-foreground"
                }`}
              >
                {value}
              </span>
              {label}
              {value === 1 && <span className="text-tertiary">{copy.skillLevelUnavailableNote}</span>}
            </span>
          ))}
      </div>

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
          return (
            <div key={i} className="py-3">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-primary">
                <input
                  type="checkbox"
                  name={fieldName}
                  value="1"
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) setChecked((prev) => ({ ...prev, [i]: true }));
                    else handleUncheck(i);
                  }}
                  className="h-5 w-5 shrink-0 accent-action"
                />
                <span>{label}</span>
              </label>
              {isChecked && (
                <div className="mt-2 pl-8 sm:max-w-md">
                  <RatingCard
                    levels={necessityLevels}
                    value={levels[i]}
                    onChange={(v) => setLevels((prev) => ({ ...prev, [i]: v }))}
                    name={`skill-${i}-level`}
                    required
                    error={errors?.[`skill-${i}-level`]}
                    aria-label={label}
                    disabledValues={[1]}
                    disabledHint={copy.skillNecessityDisabledHint}
                    compact
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
