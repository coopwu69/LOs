"use client";

import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type StepProgressBarProps = {
  currentStep: number; // 0-indexed (matches existing Stepper)
  stepCompletion: boolean[];
  onSelect: (step: number) => void;
  locale: Locale;
  allowUnrestrictedNavigation?: boolean;
};

/**
 * StepProgressBar — two-row progress indicator (replaces Stepper).
 *
 * Top row:    circles (number/check) + label per step, evenly spaced.
 * Bottom row: single full-width track bar, independent of the circles.
 *
 * Visual states per circle (matches project tokens):
 *   - completed (index < currentStep):  filled action (indigo), check icon
 *   - active    (index === currentStep): filled action (indigo), ring emphasis, number
 *   - upcoming  (index > currentStep):   sunken surface, number
 *
 * The track fills from 0% to ((currentStep + 1) / total) * 100%,
 * so when the user is on step 3 of 6 the indigo bar spans steps 1→3.
 *
 * Navigation policy (per CLAUDE.md): never gate page navigation on validation.
 * `allowUnrestrictedNavigation` lets the user click any step freely; soft
 * completion checkmarks come from `stepCompletion` and are non-blocking.
 */
export function StepProgressBar({
  currentStep,
  stepCompletion,
  onSelect,
  locale,
  allowUnrestrictedNavigation = false,
}: StepProgressBarProps) {
  const copy = COPY[locale];
  const total = copy.steps.length;
  const clamped = Math.max(0, Math.min(currentStep, total - 1));
  const progressPct = ((clamped + 1) / total) * 100;

  return (
    <nav aria-label={copy.stepsLabel}>
      {/* Row 1 — step circles + labels */}
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {copy.steps.map((step, index) => {
          const isCompleted = index < clamped;
          const isActive = index === clamped;
          const complete = stepCompletion[index];
          const enabled = allowUnrestrictedNavigation || index <= clamped;

          return (
            <li key={step[0]} className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${copy.step} ${index + 1}: ${step[0]}${complete ? ` — ${copy.complete}` : ""}`}
                disabled={!enabled}
                className="group relative z-10 flex w-full min-w-0 flex-col items-center disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors group-focus-visible:shadow-[var(--shadow-focus-ring)] ${
                    isActive
                      ? "border-action bg-action text-inverse"
                      : isCompleted
                        ? "border-action bg-action text-inverse"
                        : "border-border-default bg-sunken text-tertiary"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted && !isActive ? (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.55a1 1 0 0 1-1.42.005l-3.5-3.55a1 1 0 1 1 1.414-1.4l2.79 2.83 6.796-6.844a1 1 0 0 1 1.414-.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`mt-2 block text-xs font-semibold ${
                    isActive ? "text-action" : isCompleted ? "text-primary" : enabled ? "text-secondary" : "text-tertiary"
                  }`}
                >
                  {copy.step} {index + 1}
                </span>
                <span
                  className={`mt-0.5 block max-w-28 text-xs leading-snug ${
                    isActive || isCompleted ? "text-primary" : enabled ? "text-secondary" : "text-tertiary"
                  }`}
                >
                  {step[0]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Row 2 — full-width progress track (separate from circles) */}
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sunken"
        role="progressbar"
        aria-valuenow={clamped + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-action transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </nav>
  );
}
