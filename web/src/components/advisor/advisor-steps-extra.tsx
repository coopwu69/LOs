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

// 5 levels displayed high โ’ low. copy.rating is ordered [lowest..highest]
// (index 0โ’4 maps to value 1โ’5); reverse so the highest score renders
// first (leftmost), matching ReportStep. Only the report step uses 5
// levels -- every other rated section in this project uses 4.
function rating4Levels(copy: AdvisorCopy): RatingLevel[] {
  return copy.rating4.map((label, i) => ({ value: i + 1, label })).reverse();
}

function rating5Levels(copy: AdvisorCopy): RatingLevel[] {
  return copy.rating5.map((label, i) => ({ value: i + 1, label })).reverse();
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

// --- Step 3: Other (overall items + strengths / improvements) ---
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

// --- Step 4: Co-op center + workplace process evaluation ---
export function AdvisorProcessStep({ locale, errors, formVersion }: StepProps) {
  const copy = ADVISOR_COPY[locale];
  const levels = rating4Levels(copy);
  const { containerRef, ratings, setRatings } = useDomSyncedRatings(formVersion, PROCESS_NAMES);

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
      </section>
      <div className="border-t border-border-default pt-8">
        <ChoiceGroup
          legend={copy.futurePlacement}
          name="adv_future_placement"
          options={[
            { value: "should", label: copy.futureShould },
            { value: "should_not", label: copy.futureShouldNot },
            { value: "other", label: copy.futureOther },
          ]}
          error={errors?.adv_future_placement}
        />
        <div className="mt-5">
          <Field
            label={copy.futureOtherSpecify}
            name="adv_future_placement_other"
            locale={locale}
            error={errors?.adv_future_placement_other}
          />
        </div>
      </div>
      <TextAreaField
        label={copy.otherComments}
        name="adv_other_comments"
        error={errors?.adv_other_comments}
      />
    </div>
  );
}

// --- Step 5: Report appraisal ---
export function AdvisorReportStep({ locale, errors, formVersion }: StepProps) {
  const copy = ADVISOR_COPY[locale];
  const levels = rating5Levels(copy);
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
