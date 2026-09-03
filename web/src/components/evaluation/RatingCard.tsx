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
  /** Mark the group as required (adds aria-required + native constraint). */
  required?: boolean;
  /** Accessible group label (read by screen readers). */
  "aria-label"?: string;
  /** Error message — renders below the cards and links via aria-describedby. */
  error?: string;
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
}: RatingCardProps) {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    refs.current[index] = el;
  }, []);

  const selectedIndex = levels.findIndex((l) => l.value === value);

  const focusCard = useCallback(
    (index: number) => {
      const clamped = ((index % levels.length) + levels.length) % levels.length;
      refs.current[clamped]?.focus();
      onChange(levels[clamped].value);
    },
    [levels, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          focusCard((selectedIndex === -1 ? -1 : selectedIndex) + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          focusCard((selectedIndex === -1 ? 0 : selectedIndex) - 1);
          break;
        case "Home":
          e.preventDefault();
          focusCard(0);
          break;
        case "End":
          e.preventDefault();
          focusCard(levels.length - 1);
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
          const inputId = `${groupId}-${level.value}`;
          return (
            <label
              key={level.value}
              htmlFor={inputId}
              className={[
                "relative flex min-h-24 min-w-0 cursor-pointer flex-col items-center justify-center gap-1.5 px-2 py-3 text-center transition-colors sm:px-4",
                "focus-within:z-10 focus-within:shadow-[inset_0_0_0_2px_var(--border-focus)]",
                isSelected
                  ? "bg-primary text-primary-foreground"
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
                required={required && index === 0}
                onChange={() => onChange(level.value)}
                aria-describedby={errorId}
                tabIndex={isSelected || (selectedIndex === -1 && index === 0) ? 0 : -1}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="text-lg font-semibold leading-none">{level.value}</span>
              <span className="text-xs font-medium leading-tight">{level.label}</span>
              {level.description && (
                <span className={`text-xs leading-snug ${isSelected ? "text-primary-foreground" : "text-tertiary"}`}>
                  {level.description}
                </span>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}
