"use client";

import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY as COPY } from "./copy";

type SaveState = "preparing" | "preview" | "saving" | "saved" | "failed" | "restored" | "ready";

type AutosaveStatusProps = {
  state: SaveState;
  savedAt?: string;
  locale: Locale;
};

// Autosave status indicator with an aria-live region so screen readers
// announce save state changes without moving focus.
//
// States:
// - preparing: initial draft load in progress
// - preview: no template, preview mode (no save)
// - saving: a save request is in flight
// - saved: last save succeeded (shows timestamp)
// - failed: last save failed; system will retry
// - restored: a draft was restored from the server
// - ready: autosave armed, no save yet
export function AutosaveStatus({ state, savedAt, locale }: AutosaveStatusProps) {
  const copy = COPY[locale];
  let text: string;
  let dotClass: string;

  switch (state) {
    case "preparing":
      text = copy.preparingDraft;
      dotClass = "bg-tertiary";
      break;
    case "preview":
      text = copy.previewMode;
      dotClass = "bg-tertiary";
      break;
    case "saving":
      text = copy.saving;
      dotClass = "bg-action animate-pulse";
      break;
    case "saved":
      text = savedAt ? `${copy.saved} ${savedAt}` : copy.saved;
      dotClass = "bg-success-text";
      break;
    case "failed":
      text = copy.saveFailed;
      dotClass = "bg-error-text";
      break;
    case "restored":
      text = copy.restored;
      dotClass = "bg-success-text";
      break;
    case "ready":
      text = copy.autosaveReady;
      dotClass = "bg-tertiary";
      break;
  }

  return (
    <p
      className="order-3 w-full text-xs text-secondary sm:order-none sm:w-auto"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={`mr-1.5 inline-block h-2 w-2 rounded-full align-middle ${dotClass}`} aria-hidden="true" />
      {text}
    </p>
  );
}
