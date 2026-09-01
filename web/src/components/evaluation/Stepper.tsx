"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type StepperProps = {
  currentStep: number;
  maxVisited: number;
  stepCompletion: boolean[];
  onSelect: (step: number) => void;
  locale: Locale;
};

// Step progress indicator with visible completion state.
//
// Desktop (≥768px): horizontal tab-style list with a top border that
// changes colour to indicate current (action blue) vs completed
// (success green) vs upcoming (border default).
//
// Mobile (<768px): a compact "Step X of N" label plus a progress bar
// that fills proportionally. A checkmark icon marks completed steps.
//
// Accessibility:
// - The <nav> is labelled with the steps label.
// - Each step button uses aria-current="step" for the current step.
// - Completed steps include a visually-hidden "complete" status.
// - The mobile progress bar is decorative (aria-hidden) because the
//   text label already conveys the same information.
export function Stepper({ currentStep, maxVisited, stepCompletion, onSelect, locale }: StepperProps) {
  const copy = COPY[locale];
  const navRef = useRef<HTMLElement>(null);
  const total = copy.steps.length;
  const percent = Math.round(((currentStep + 1) / total) * 100);

  return (
    <nav ref={navRef} aria-label={copy.stepsLabel}>
      {/* Mobile: compact label + progress bar */}
      <div className="mb-4 flex items-center justify-between text-sm md:hidden">
        <span className="font-semibold text-primary">
          {copy.step} {currentStep + 1} {copy.of} {total}
        </span>
        <span className="text-secondary">{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-sunken md:hidden" aria-hidden="true">
        <div
          className="h-full rounded-full bg-action transition-transform duration-300"
          style={{ transform: `scaleX(${(currentStep + 1) / total})`, transformOrigin: "left" }}
        />
      </div>

      {/* Desktop: tab list with completion state */}
      <ol className="hidden md:flex">
        {copy.steps.map((step, index) => {
          const current = index === currentStep;
          const complete = stepCompletion[index];
          const visited = index <= maxVisited;
          const enabled = visited || current;
          return (
            <li key={step[0]} className="relative min-w-0 flex-1">
              {index < total - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-4 left-[calc(50%+1rem)] right-[calc(-50%+1rem)] h-0.5 ${
                    complete ? "bg-success-text" : "bg-border-default"
                  }`}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={current ? "step" : undefined}
                aria-label={`${copy.step} ${index + 1}: ${step[0]}${complete ? ` — ${copy.complete}` : ""}`}
                disabled={!enabled}
                className="group relative z-10 flex w-full min-w-0 flex-col items-center px-1 text-center disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors group-focus-visible:shadow-[var(--shadow-focus-ring)] ${
                    current
                      ? "border-action bg-action text-inverse"
                      : complete
                        ? "border-success-text bg-success-text text-inverse"
                        : visited
                          ? "border-border-strong bg-raised text-secondary group-hover:border-action group-hover:text-action"
                          : "border-border-default bg-sunken text-tertiary"
                  }`}
                  aria-hidden="true"
                >
                  {complete && !current ? (
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
                <span className={`mt-2 block text-xs font-semibold ${current ? "text-action" : complete ? "text-primary" : enabled ? "text-secondary" : "text-tertiary"}`}>
                  {copy.step} {index + 1}
                </span>
                <span className={`mt-0.5 block max-w-28 text-xs leading-snug ${current || complete ? "text-primary" : enabled ? "text-secondary" : "text-tertiary"}`}>
                  {step[0]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
