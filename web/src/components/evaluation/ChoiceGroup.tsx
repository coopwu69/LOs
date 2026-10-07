"use client";

import { Required } from "./fields";

// `controlsId` links an option to a conditionally-revealed region
// (aria-controls). aria-expanded is intentionally not used: ARIA forbids it
// on role=radio — the reveal itself is announced because focus moves into it.
type Choice = { value: string; label: string; controlsId?: string };

type ChoiceGroupProps = {
  legend: string;
  name: string;
  options: Choice[];
  required?: boolean;
  error?: string;
  // Optional "i" hint next to the legend: hover, focus or tap shows the list.
  info?: { buttonLabel: string; title: string; items: readonly string[] };
};

// Yes/No choice group rendered as an accessible radio fieldset.
export function ChoiceGroup({ legend, name, options, required = true, error, info }: ChoiceGroupProps) {
  const errorId = error ? `${name}-error` : undefined;
  const infoId = `${name}-info`;
  return (
    <fieldset>
      <legend className="text-sm font-medium text-primary">
        {legend}
        {required && <Required />}
        {info && (
          <span className="group/info relative ml-2 inline-block align-middle">
            <button
              type="button"
              aria-label={info.buttonLabel}
              aria-describedby={infoId}
              className="inline-flex size-5 items-center justify-center rounded-full border border-border-strong text-xs font-semibold leading-none text-secondary transition-colors hover:border-border-focus hover:text-primary focus-visible:shadow-[var(--shadow-focus-ring)] focus-visible:outline-none"
            >
              i
            </button>
            <span
              role="tooltip"
              id={infoId}
              className="invisible absolute left-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-4rem)] rounded-lg border border-border-default bg-raised p-3 text-left text-sm font-normal opacity-0 shadow-lg transition-opacity group-hover/info:visible group-hover/info:opacity-100 group-focus-within/info:visible group-focus-within/info:opacity-100"
            >
              <span className="block font-semibold text-primary">{info.title}</span>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-secondary">
                {info.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </span>
          </span>
        )}
      </legend>
      <div
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--option-count),minmax(0,1fr))]"
        style={{ "--option-count": options.length } as React.CSSProperties}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        aria-required={required || undefined}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-12 min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-border-strong bg-raised px-4 py-3 text-sm text-primary transition-colors hover:border-border-focus hover:bg-hover focus-within:shadow-[var(--shadow-focus-ring)] has-[:checked]:border-action has-[:checked]:bg-info-bg"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              // Not native `required` — see fields.tsx for why (hidden
              // wizard steps + native required silently breaks submit).
              aria-describedby={errorId}
              aria-controls={option.controlsId}
              className="h-5 w-5 shrink-0 accent-action"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </fieldset>
  );
}
