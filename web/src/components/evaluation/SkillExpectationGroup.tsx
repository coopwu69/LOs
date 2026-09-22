"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type FieldErrors = Record<string, string>;

const SKILL_COUNT = 16;
const SKILL_INDEXES = Array.from({ length: SKILL_COUNT }, (_, i) => i + 1);

// --- Step 1 (G2): skills the employer expects from the student ---
//
// 16 checkboxes — tick the ones the employer expects from the student.
// Necessity-level rating (1-5 per skill) was removed 2026-09-22 per user
// request: tick-only, no per-skill scale. Not scored into the student's
// competency total: this captures what the *employer* expects, not what
// the *student* achieved.
//
// Uncontrolled form + draft restore (same bridge pattern as CompetencyStep/
// ReportStep): DOM checkbox state is read into React on every
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

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const nextChecked: Record<number, boolean> = {};
    for (const i of SKILL_INDEXES) {
      const box = form.elements.namedItem(`skill-${i}`);
      nextChecked[i] = box instanceof HTMLInputElement && box.checked;
    }
    setChecked(nextChecked);
  }, [formVersion]);

  const minOneError = errors?.skills;

  return (
    <div ref={containerRef} className="space-y-6">
      <p className="text-sm leading-relaxed text-secondary">{copy.skillsInstructions}</p>

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
              <label className="flex min-h-11 min-w-0 cursor-pointer items-center gap-3 text-sm text-primary">
                <input
                  type="checkbox"
                  name={fieldName}
                  value="1"
                  checked={isChecked}
                  onChange={(e) => setChecked((prev) => ({ ...prev, [i]: e.target.checked }))}
                  className="h-5 w-5 shrink-0 accent-action"
                />
                <span>{label}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
