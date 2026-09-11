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

  const necessityLevels: RatingLevel[] = copy.skillNecessity
    .map((label, i) => ({ value: i + 1, label }))
    .reverse();

  const minOneError = errors?.skills;

  return (
    <div ref={containerRef} className="space-y-6">
      <p className="text-sm leading-relaxed text-secondary">{copy.skillsInstructions}</p>
      {minOneError && (
        <p role="alert" className="rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text">
          {minOneError}
        </p>
      )}
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {SKILL_INDEXES.map((i) => {
          const label = copy.skills[i - 1];
          const isChecked = checked[i] ?? false;
          const fieldName = `skill-${i}`;
          return (
            <div key={i} className="border-b border-border-default py-3 sm:border-none sm:py-2">
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
                <div className="mt-3 pl-8">
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
