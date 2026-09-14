"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY } from "./copy";
import { Required, controlClass } from "./fields";

// Same error styling as Field's errorControlClass (fields.tsx keeps that
// class private; the token list must stay identical).
const errorControlClass =
  "mt-2 min-h-11 w-full rounded-lg border border-error-text bg-error-bg px-3.5 py-2.5 text-base text-primary placeholder:text-tertiary transition-colors hover:border-error-text focus-visible:border-error-text disabled:cursor-not-allowed disabled:bg-sunken disabled:text-secondary";

type StudentHit = { id: string; student_code: string; full_name: string };

type Props = {
  label: string;
  /** The name field this input writes (uncontrolled, read via FormData). */
  name?: string;
  /** Sibling field auto-filled with the picked student's code. */
  codeFieldName?: string;
  programId: string;
  locale: Locale;
  required?: boolean;
  helper?: string;
  placeholder?: string;
  error?: string;
};

// Writes a value into an uncontrolled input in a way React's onChange
// still picks up: setting `.value` directly would be swallowed by React's
// value tracker, so go through the native prototype setter first, then
// dispatch `input`. The wizards' form-level onChange (autosave +
// formVersion + stepCompletion) depends on that event firing.
function setNativeValue(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// student_name field with program-scoped roster suggestions. A convenience
// lookup only — picking a suggestion fills both this field and the sibling
// student_code input, while free typing is always allowed (the roster can
// lag behind reality). Debounced + abortable so it stays cheap against the
// live DB, and any fetch failure silently degrades to a plain text field.
export function StudentAutocomplete({
  label,
  name = "student_name",
  codeFieldName = "student_code",
  programId,
  locale,
  required,
  helper,
  placeholder,
  error,
}: Props) {
  const copy = WIZARD_COPY[locale];
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Set during a programmatic fill so the input event we dispatch doesn't
  // re-trigger a search for the name we just picked.
  const pickedRef = useRef("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<StudentHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  // Keep the keyboard-highlighted option visible while arrowing through a
  // list taller than the dropdown's max height.
  useEffect(() => {
    if (activeIndex < 0) return;
    const hit = results[activeIndex];
    if (hit) document.getElementById(`${listboxId}-${hit.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results, listboxId]);

  function search(value: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    fetch(`/api/students/search?programId=${encodeURIComponent(programId)}&q=${encodeURIComponent(value)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: unknown) => {
        if (controller.signal.aborted) return;
        setResults(Array.isArray(rows) ? (rows as StudentHit[]) : []);
        setSearched(true);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        // Network/API failure → close the dropdown and leave the field as
        // plain free-text. Never surface an error or block typing.
        setResults([]);
        setOpen(false);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Our own programmatic fill after a pick — skip the search.
    if (value === pickedRef.current) return;
    if (!value.trim()) {
      abortRef.current?.abort();
      setLoading(false);
      setResults([]);
      setSearched(false);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    debounceRef.current = setTimeout(() => search(value.trim()), 250);
  }

  function select(hit: StudentHit) {
    const input = inputRef.current;
    if (input) {
      pickedRef.current = hit.full_name;
      setNativeValue(input, hit.full_name);
      pickedRef.current = "";
      const codeEl = input.form?.elements.namedItem(codeFieldName);
      if (codeEl instanceof HTMLInputElement) setNativeValue(codeEl, hit.student_code);
    }
    setOpen(false);
    setResults([]);
    setSearched(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length) {
        setOpen(true);
        setActiveIndex((i) => (i + 1) % results.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length) setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      // Only consume Enter when it picks a suggestion — with no highlighted
      // option it stays a normal keystroke and the wizard keeps working.
      if (open && activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        select(results[activeIndex]);
      }
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  }

  function handleFocus() {
    if (results.length) setOpen(true);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }

  const helperId = helper ? `${name}-helper` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div onBlur={handleBlur}>
      <label htmlFor={name} className="block text-sm font-medium text-primary">
        {label}
        {required && <Required />}
      </label>
      {helper && (
        <p id={helperId} className="mt-1 text-sm leading-relaxed text-secondary">
          {helper}
        </p>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 && results[activeIndex] ? `${listboxId}-${results[activeIndex].id}` : undefined}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-required={required || undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={error ? errorControlClass : controlClass}
        />
        {open && (loading || searched) && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={copy.studentSearchListLabel}
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border-default bg-raised py-1 shadow-lg"
          >
            {results.length === 0 ? (
              <li role="option" aria-selected={false} aria-disabled="true" className="px-3.5 py-2.5 text-sm text-secondary">
                {loading ? copy.studentSearchLoading : copy.studentSearchEmpty}
              </li>
            ) : (
              results.map((hit, index) => (
                <li
                  key={hit.id}
                  id={`${listboxId}-${hit.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  // onMouseDown + preventDefault so the pick lands before the
                  // input's blur can close the dropdown.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(hit);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`cursor-pointer px-3.5 py-2.5 hover:bg-hover ${index === activeIndex ? "bg-hover" : ""}`}
                >
                  <span className="block text-sm text-primary">{hit.full_name}</span>
                  <span className="mt-0.5 block font-mono text-xs text-tertiary">{hit.student_code}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}
