"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ADVISOR_COPY, type AdvisorCopy } from "./advisor-copy";
import {
  ChoiceGroup,
  Field,
  RatingCard,
  Required,
  TextAreaField,
  type RatingLevel,
} from "@/components/evaluation";

type FieldErrors = Record<string, string>;

type StepProps = {
  locale: Locale;
  errors?: FieldErrors;
  formVersion: number;
};

const OTHER_NAMES = ["adv-other-0", "adv-other-1"] as const;
const PROCESS_NAMES = [
  "adv-center-0",
  "adv-center-1",
  "adv-workplace-0",
  "adv-workplace-1",
  "adv-workplace-2",
  "adv-workplace-3",
  "adv-workplace-4",
] as const;
const REPORT_NAMES = [
  "adv-report-0",
  "adv-report-1",
  "adv-report-2",
  "adv-report-3",
  "adv-report-4",
] as const;

// RatingCard is controlled, but the wizard restores drafts by setting
// radio.checked directly on the DOM (restoreForm). This hook bridges
// that gap by reading DOM radio state into React whenever formVersion
// changes (fires on restore and on every form change).
function useDomSyncedRatings(formVersion: number, names: readonly string[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratings, setRatings] = useState<Record<string, number | undefined>>({});

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const next: Record<string, number | undefined> = {};
    for (const name of names) {
      const group = form.elements.namedItem(name);
      if (group instanceof RadioNodeList) {
        for (const radio of group) {
          if (radio instanceof HTMLInputElement && radio.checked) {
            next[name] = Number(radio.value);
            break;
          }
        }
      } else if (group instanceof HTMLInputElement && group.checked) {
        next[name] = Number(group.value);
      }
    }
    setRatings(next);
  }, [formVersion, names]);

  return { containerRef, ratings, setRatings };
}

// Reads the checked value of a radio group straight from the DOM whenever
// formVersion bumps — same bridge pattern as useDomSyncedRatings, for the
// uncontrolled disclosure radios (premium workplace / future placement).
function useDomSyncedRadio(
  formVersion: number,
  name: string,
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const group = form.elements.namedItem(name);
    let next = "";
    if (group instanceof RadioNodeList) {
      for (const radio of group) {
        if (radio instanceof HTMLInputElement && radio.checked) {
          next = radio.value;
          break;
        }
      }
    } else if (group instanceof HTMLInputElement && group.checked) {
      next = group.value;
    }
    setValue(next);
  }, [formVersion, name, containerRef]);

  return value;
}

// copy.rating4 / copy.reportRating are ordered [lowest..highest] (index 0→3
// maps to value 1→4); reverse so the highest score renders first (leftmost),
// matching ReportStep. Since G4 every rated section uses 4 levels — the
// former 5-level report exception was removed.
function rating4Levels(copy: AdvisorCopy): RatingLevel[] {
  return copy.rating4.map((label, i) => ({ value: i + 1, label })).reverse();
}

function reportLevels(copy: AdvisorCopy): RatingLevel[] {
  return copy.reportRating.map((label, i) => ({ value: i + 1, label })).reverse();
}

type RatingItemProps = {
  name: string;
  index: number;
  label: string;
  levels: RatingLevel[];
  value: number | undefined;
  onChange: (value: number) => void;
  error?: string;
};

function RatingItem({ name, index, label, levels, value, onChange, error }: RatingItemProps) {
  return (
    <fieldset className="py-7 first:pt-6 last:pb-0">
      <legend className="w-full text-base font-medium leading-relaxed text-primary">
        {index + 1}. {label}
        <Required />
      </legend>
      <div className="mt-4">
        <RatingCard
          levels={levels}
          value={value}
          onChange={onChange}
          name={name}
          required
          error={error}
          aria-label={`${index + 1}. ${label}`}
        />
      </div>
    </fieldset>
  );
}

// --- Section 5: Comments (overall items + strengths / improvements) ---
export function AdvisorOtherStep({ locale, errors, formVersion }: StepProps) {
  const copy = ADVISOR_COPY[locale];
  const levels = rating4Levels(copy);
  const { containerRef, ratings, setRatings } = useDomSyncedRatings(formVersion, OTHER_NAMES);

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="divide-y divide-border-default">
        {copy.otherItems.map((item, index) => {
          const name = OTHER_NAMES[index];
          return (
            <RatingItem
              key={name}
              name={name}
              index={index}
              label={item}
              levels={levels}
              value={ratings[name]}
              onChange={(v) => setRatings((prev) => ({ ...prev, [name]: v }))}
              error={errors?.[name]}
            />
          );
        })}
      </div>
      <TextAreaField
        label={copy.strengths}
        name="adv_strengths"
        helper={copy.strengthsHelp}
        required
        error={errors?.adv_strengths}
      />
      <TextAreaField
        label={copy.improvements}
        name="adv_improvements"
        helper={copy.improvementsHelp}
        required
        error={errors?.adv_improvements}
      />
    </div>
  );
}

// --- Section 6: Co-op center + workplace evaluation ---
export function AdvisorProcessStep({ locale, errors, formVersion }: StepProps) {
  const copy = ADVISOR_COPY[locale];
  const levels = rating4Levels(copy);
  const { containerRef, ratings, setRatings } = useDomSyncedRatings(formVersion, PROCESS_NAMES);
  const placement = useDomSyncedRadio(formVersion, "adv_future_placement", containerRef);
  const premium = useDomSyncedRadio(formVersion, "adv_premium_workplace", containerRef);
  const otherInputRef = useRef<HTMLInputElement>(null);
  const prevPlacementRef = useRef<string>("");
  const reasonInputRef = useRef<HTMLInputElement>(null);
  const prevPremiumRef = useRef<string>("");

  const showOther = placement === "other";
  const showPremiumReason = premium === "review";

  // The reason input stays mounted (hidden) so draft restore can populate
  // it, but its DOM value is cleared whenever the reason is not applicable —
  // a stale answer must never ride along in the submitted payload.
  useEffect(() => {
    if (showPremiumReason) return;
    const form = containerRef.current?.closest("form");
    const element = form?.elements.namedItem("adv_premium_workplace_reason");
    if (element instanceof HTMLInputElement) element.value = "";
  }, [showPremiumReason, containerRef]);

  // Move focus into the newly revealed field, matching the disclosure spec —
  // but only when the user just selected the revealing option (the radio
  // still has focus), not when a restored draft already had it selected.
  useEffect(() => {
    if (showOther && prevPlacementRef.current !== "other") {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.name === "adv_future_placement") {
        otherInputRef.current?.focus();
      }
    }
    prevPlacementRef.current = placement;
  }, [showOther, placement]);

  useEffect(() => {
    if (showPremiumReason && prevPremiumRef.current !== "review") {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.name === "adv_premium_workplace") {
        reasonInputRef.current?.focus();
      }
    }
    prevPremiumRef.current = premium;
  }, [showPremiumReason, premium]);

  const renderItem = (name: string, index: number, label: string) => (
    <RatingItem
      key={name}
      name={name}
      index={index}
      label={label}
      levels={levels}
      value={ratings[name]}
      onChange={(v) => setRatings((prev) => ({ ...prev, [name]: v }))}
      error={errors?.[name]}
    />
  );

  return (
    <div ref={containerRef} className="space-y-10">
      <section aria-labelledby="adv-center-title">
        <h3
          id="adv-center-title"
          className="border-b border-border-default pb-3 text-lg font-semibold text-primary"
        >
          {copy.centerTitle}
        </h3>
        <div className="divide-y divide-border-default">
          {copy.centerItems.map((item, index) => renderItem(`adv-center-${index}`, index, item))}
        </div>
      </section>
      <section aria-labelledby="adv-workplace-title">
        <h3
          id="adv-workplace-title"
          className="border-b border-border-default pb-3 text-lg font-semibold text-primary"
        >
          {copy.workplaceTitle}
        </h3>
        <div className="divide-y divide-border-default">
          {copy.workplaceItems.map((item, index) => renderItem(`adv-workplace-${index}`, index, item))}
        </div>
        <div className="pt-7">
          <ChoiceGroup
            legend={`${copy.workplaceItems.length + 1}. ${copy.premiumWorkplace}`}
            name="adv_premium_workplace"
            options={[
              { value: "yes", label: copy.premiumYes },
              { value: "no", label: copy.premiumNo },
              {
                value: "review",
                label: copy.premiumReview,
                controlsId: "adv-premium-reason-region",
              },
            ]}
            error={errors?.adv_premium_workplace}
          />
          <div id="adv-premium-reason-region" hidden={!showPremiumReason} className="mt-5">
            <Field
              ref={reasonInputRef}
              label={copy.premiumReviewReason}
              name="adv_premium_workplace_reason"
              locale={locale}
              required={showPremiumReason}
              error={errors?.adv_premium_workplace_reason}
            />
          </div>
        </div>
      </section>
      <div className="border-t border-border-default pt-8">
        <ChoiceGroup
          legend={copy.futurePlacement}
          name="adv_future_placement"
          options={[
            { value: "should", label: copy.futureShould },
            { value: "should_not", label: copy.futureShouldNot },
            {
              value: "other",
              label: copy.futureOther,
              controlsId: "adv-future-placement-other-region",
            },
          ]}
          error={errors?.adv_future_placement}
        />
        {showOther && (
          <div id="adv-future-placement-other-region" className="mt-5">
            <Field
              ref={otherInputRef}
              label={copy.futureOtherSpecify}
              name="adv_future_placement_other"
              locale={locale}
              required
              error={errors?.adv_future_placement_other}
            />
          </div>
        )}
      </div>
      <TextAreaField
        label={copy.otherComments}
        name="adv_other_comments"
        error={errors?.adv_other_comments}
      />
    </div>
  );
}

// --- Section 4: Report appraisal ---
export function AdvisorReportStep({ locale, errors, formVersion }: StepProps) {
  const copy = ADVISOR_COPY[locale];
  const levels = reportLevels(copy);
  const { containerRef, ratings, setRatings } = useDomSyncedRatings(formVersion, REPORT_NAMES);

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="divide-y divide-border-default">
        {copy.reportItems.map((item, index) => {
          const name = REPORT_NAMES[index];
          return (
            <RatingItem
              key={name}
              name={name}
              index={index}
              label={item}
              levels={levels}
              value={ratings[name]}
              onChange={(v) => setRatings((prev) => ({ ...prev, [name]: v }))}
              error={errors?.[name]}
            />
          );
        })}
      </div>
    </div>
  );
}
