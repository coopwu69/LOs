"use client";

import { useCallback, useId, useRef } from "react";

export interface RatingLevel {
  value: number;
  label: string;
  description?: string;
}

export interface RatingCardProps {
  levels: RatingLevel[];
  value?: number;
  onChange: (value: number) => void;
  /** Name for hidden input — enables native form submission. */
  name?: string;
  /** Mark the group as required (adds aria-required; deliberately no native `required` — see fields.tsx). */
  required?: boolean;
  /** Accessible group label (read by screen readers). */
  "aria-label"?: string;
  /** Error message — renders below the cards and links via aria-describedby. */
  error?: string;
  /**
   * Level values that can't be selected — shown grayed out, unclickable by
   * mouse or keyboard, and skipped by arrow-key navigation. Used by the
   * skill-expectation section (G2, goal.md): ticking a skill at all implies
   * it's relevant, so its lowest necessity level ("not required") is never
   * a valid choice. `disabledHint` explains why, so the card doesn't just
   * look broken.
   */
  disabledValues?: number[];
  /** Shown as a `title` tooltip on each disabled card, and read via aria-describedby. */
  disabledHint?: string;
}

/**
 * Accessible rating control rendered as equal-width radio segments.
 *
 * Each segment shows its numeric value and label, with the selected level highlighted.
 * Optional `description` is shown as a secondary line inside the segment.
 *
 * Keyboard model (WAI-ARIA radiogroup pattern):
 *   - Tab  → focus the selected (or first) card
 *   - ←/→  → move focus between cards, selecting on focus
 *   - Space/Enter → select the focused card
 *
 * A hidden `<input type="radio">` per level keeps the control compatible
 * with native form submission when `name` is provided.
 */
export function RatingCard({
  levels,
  value,
  onChange,
  name,
  required = false,
  error,
  "aria-label": ariaLabel,
  disabledValues,
  disabledHint,
}: RatingCardProps) {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;
  const disabledHintId = disabledHint ? `${groupId}-disabled-hint` : undefined;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const isDisabledIndex = useCallback(
    (index: number) => disabledValues?.includes(levels[index].value) ?? false,
    [disabledValues, levels],
  );

  const setRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    refs.current[index] = el;
  }, []);

  const selectedIndex = levels.findIndex((l) => l.value === value);
  // First selectable card — the native `required` constraint and the
  // fallback tab stop both need a real (non-disabled) index, or a disabled
  // level-1 card at position 0 would silently swallow both.
  const firstEnabledIndex = Math.max(0, levels.findIndex((_, i) => !isDisabledIndex(i)));

  const focusCard = useCallback(
    // `direction` is which way to keep looking if `index` lands on a
    // disabled card — bounded by levels.length so an all-disabled list
    // (shouldn't happen, but don't hang) just gives up instead of looping.
    (index: number, direction: 1 | -1 = 1) => {
      for (let attempt = 0; attempt < levels.length; attempt++) {
        const clamped = ((index % levels.length) + levels.length) % levels.length;
        if (!isDisabledIndex(clamped)) {
          refs.current[clamped]?.focus();
          onChange(levels[clamped].value);
          return;
        }
        index += direction;
      }
    },
    [levels, onChange, isDisabledIndex],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          focusCard((selectedIndex === -1 ? -1 : selectedIndex) + 1, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          focusCard((selectedIndex === -1 ? 0 : selectedIndex) - 1, -1);
          break;
        case "Home":
          e.preventDefault();
          focusCard(0, 1);
          break;
        case "End":
          e.preventDefault();
          focusCard(levels.length - 1, -1);
          break;
      }
    },
    [focusCard, selectedIndex, levels.length],
  );

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-required={required || undefined}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={errorId}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`grid gap-px overflow-hidden rounded-xl border-2 bg-border ${error ? "border-error-text" : "border-border"}`}
        style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}
      >
        {levels.map((level, index) => {
          const isSelected = level.value === value;
          const isDisabled = isDisabledIndex(index);
          const inputId = `${groupId}-${level.value}`;
          const describedBy = [errorId, isDisabled ? disabledHintId : undefined].filter(Boolean).join(" ") || undefined;
          return (
            <label
              key={level.value}
              htmlFor={inputId}
              title={isDisabled ? disabledHint : undefined}
              className={[
                "relative flex min-h-24 min-w-0 flex-col items-center justify-center gap-1.5 px-2 py-3 text-center transition-colors sm:px-4",
                isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                "focus-within:z-10 focus-within:shadow-[inset_0_0_0_2px_var(--border-focus)]",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isDisabled
                    ? "bg-sunken text-tertiary"
                    : "bg-raised text-primary hover:bg-hover",
              ].join(" ")}
            >
              <input
                ref={setRef(index)}
                id={inputId}
                type="radio"
                name={name}
                value={level.value}
                checked={isSelected}
                disabled={isDisabled}
                // Not native `required` — see fields.tsx for why (hidden
                // wizard steps + native required silently breaks submit).
                // aria-required on the radiogroup div above covers a11y.
                onChange={() => onChange(level.value)}
                aria-describedby={describedBy}
                tabIndex={isSelected || (selectedIndex === -1 && index === firstEnabledIndex) ? 0 : -1}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
              <span className="text-lg font-semibold leading-none">{level.value}</span>
              {level.description ? (
                // Rubric description present → replaces the level label (G3,
                // goal.md): the card shows number + description, not number +
                // label + description. Items without a description (e.g. the
                // report/project scale, which has none by design) fall back
                // to the label below so the card is never left number-only.
                <span className={`text-xs leading-snug ${isSelected ? "text-primary-foreground" : "text-tertiary"}`}>
                  {level.description}
                </span>
              ) : (
                <span className="text-xs font-medium leading-tight">{level.label}</span>
              )}
            </label>
          );
        })}
      </div>
      {disabledHint && (
        <p id={disabledHintId} className="mt-1.5 text-xs text-tertiary">
          {disabledHint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}
