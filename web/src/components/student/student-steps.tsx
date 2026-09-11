"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { programDisplayName, schoolDisplayName } from "@/lib/i18n";
import type { Program } from "@/lib/db";
import {
  Field,
  SelectField,
  TextAreaField,
  ChoiceGroup,
  RatingCard,
  Required,
  WIZARD_COPY,
  type RatingLevel,
} from "@/components/evaluation";
import { ACADEMIC_TERMS, semestersForYear } from "@/lib/evaluation-schema";
import { STUDENT_COPY, STUDENT_BENEFIT_KEYS } from "./student-copy";

type FieldErrors = Record<string, string>;
type StepProps = { locale: Locale; errors?: FieldErrors; formVersion: number };

// --- Step 1: General information ---
// Student code/name/semester/year mirror GeneralStep's fields exactly (same
// WIZARD_COPY labels, per goal.md's "don't retranslate" instruction).
// School and program are read-only, auto-filled from the URL — students
// pick a program by opening its link, not by choosing from a list, so a
// mismatched selection can't send them down the wrong program's LO set.
export function StudentGeneralStep({
  program,
  locale,
  errors,
  formVersion,
}: {
  program: Program;
  locale: Locale;
  errors?: FieldErrors;
  formVersion: number;
}) {
  const copy = WIZARD_COPY[locale];
  const sc = STUDENT_COPY[locale];
  const years = [...new Set(ACADEMIC_TERMS.map((t) => t.year))].sort();
  const academicYearOptions = years.map((year) => ({
    value: year,
    label: locale === "en" ? String(Number(year) - 543) : year,
  }));
  const semesterLabel = (semester: string) => (locale === "en" ? `Semester ${semester}` : `ภาคการศึกษาที่ ${semester}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const el = containerRef.current?.closest("form")?.elements.namedItem("academic_year");
    if (el instanceof HTMLSelectElement) setSelectedYear(el.value);
  }, [formVersion]);

  const semesterOptions = semestersForYear(selectedYear || years[0]).map((semester) => ({
    value: semester,
    label: semesterLabel(semester),
  }));

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    setSelectedYear(year);
    const semesterEl = event.target.form?.elements.namedItem("semester");
    if (semesterEl instanceof HTMLSelectElement && semesterEl.value && !semestersForYear(year).includes(semesterEl.value)) {
      semesterEl.value = "";
    }
  };

  const programName = programDisplayName(program, locale);

  return (
    <div className="space-y-10" ref={containerRef}>
      <fieldset>
        <legend className="text-lg font-semibold text-primary">{copy.studentInfo}</legend>
        <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field label={copy.studentCode} name="student_code" inputMode="numeric" placeholder={copy.studentCodePlaceholder} pattern="[0-9]{8}" helper={copy.studentCodeHelp} autoComplete="off" spellCheck={false} required locale={locale} error={errors?.student_code} />
          <Field label={copy.studentName} name="student_name" autoComplete="name" required locale={locale} error={errors?.student_name} />
          <Field label={copy.school} name="school" defaultValue={schoolDisplayName(program.school ?? "", locale)} readOnly locale={locale} />
          <Field label={copy.program} name="program" defaultValue={programName} readOnly locale={locale} />
          <SelectField label={copy.academicYear} name="academic_year" options={academicYearOptions} placeholder={copy.selectAcademicYear} required error={errors?.academic_year} onChange={handleYearChange} />
          <SelectField label={copy.semester} name="semester" options={semesterOptions} placeholder={copy.selectSemester} required error={errors?.semester} />
        </div>
      </fieldset>
      <fieldset className="border-t border-border-default pt-8">
        <legend className="text-lg font-semibold text-primary">{sc.workplaceName}</legend>
        <div className="mt-5 grid gap-x-6 gap-y-5">
          <Field label={sc.workplaceName} name="st_workplace_name" required locale={locale} error={errors?.st_workplace_name} />
          <TextAreaField label={sc.workplaceAddress} name="st_workplace_address" required error={errors?.st_workplace_address} />
        </div>
      </fieldset>
    </div>
  );
}

// --- Step 2: Compensation, benefits, and accommodation ---
export function StudentExpensesStep({ locale, errors, formVersion }: StepProps) {
  const sc = STUDENT_COPY[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const [compensationType, setCompensationType] = useState("");

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const el = form?.elements.namedItem("st_compensation_type");
    let next = "";
    if (el instanceof RadioNodeList) {
      for (const radio of el) if (radio instanceof HTMLInputElement && radio.checked) { next = radio.value; break; }
    } else if (el instanceof HTMLInputElement && el.checked) next = el.value;
    setCompensationType(next);
  }, [formVersion]);

  const showCompensationDetail = compensationType !== "" && compensationType !== "none";

  // Selecting "none" (or nothing yet) hides 8.1-8.3 — clear their DOM
  // values directly so a value entered before switching to "none" can't
  // ride along in the submitted payload (same pattern as the advisor
  // form's premium-workplace reason field).
  useEffect(() => {
    if (showCompensationDetail) return;
    const form = containerRef.current?.closest("form");
    if (!form) return;
    for (const name of ["st_daily_wage", "st_monthly_wage", "st_benefits_other"]) {
      const el = form.elements.namedItem(name);
      if (el instanceof HTMLInputElement) el.value = "";
    }
    for (const key of STUDENT_BENEFIT_KEYS) {
      const el = form.elements.namedItem(`st_benefits-${key}`);
      if (el instanceof HTMLInputElement) el.checked = false;
    }
  }, [showCompensationDetail]);

  const benefitLabels: Record<(typeof STUDENT_BENEFIT_KEYS)[number], string> = {
    housing: sc.benefitHousing,
    meals: sc.benefitMeals,
    transport: sc.benefitTransport,
    medical: sc.benefitMedical,
    life_insurance: sc.benefitLifeInsurance,
    accident_insurance: sc.benefitAccidentInsurance,
    uniform: sc.benefitUniform,
  };

  return (
    <div ref={containerRef} className="space-y-8">
      <fieldset>
        <ChoiceGroup
          legend={sc.compensationType}
          name="st_compensation_type"
          options={[
            { value: "none", label: sc.compensationNone },
            { value: "money", label: sc.compensationMoney },
            { value: "benefits", label: sc.compensationBenefits },
            { value: "money_benefits", label: sc.compensationMoneyBenefits },
          ]}
          error={errors?.st_compensation_type}
        />
      </fieldset>

      <div hidden={!showCompensationDetail} className="space-y-6 border-t border-border-default pt-7">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field label={sc.dailyWage} name="st_daily_wage" type="number" inputMode="numeric" min={0} placeholder="0" helper={sc.amountHelper} locale={locale} />
          <Field label={sc.monthlyWage} name="st_monthly_wage" type="number" inputMode="numeric" min={0} placeholder="0" helper={sc.amountHelper} locale={locale} />
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-primary">{sc.benefitsReceived}</legend>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {STUDENT_BENEFIT_KEYS.map((key) => (
              <label key={key} className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-border-strong bg-raised px-3.5 py-2.5 text-sm text-primary transition-colors hover:border-border-focus hover:bg-hover has-[:checked]:border-action has-[:checked]:bg-info-bg">
                <input type="checkbox" name={`st_benefits-${key}`} value="1" className="h-5 w-5 shrink-0 accent-action" />
                {benefitLabels[key]}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <Field label={sc.benefitOther} name="st_benefits_other" locale={locale} />
          </div>
        </fieldset>
      </div>

      <div className="grid gap-x-6 gap-y-5 border-t border-border-default pt-7 sm:grid-cols-2">
        <Field label={`${sc.accommodationCost} (${sc.wholePlacementHelper})`} name="st_accommodation_cost" type="number" inputMode="numeric" min={0} locale={locale} />
        <Field label={`${sc.foodCost} (${sc.wholePlacementHelper})`} name="st_food_cost" type="number" inputMode="numeric" min={0} locale={locale} />
        <Field label={`${sc.travelCost} (${sc.wholePlacementHelper})`} name="st_travel_cost" type="number" inputMode="numeric" min={0} locale={locale} />
        <Field label={sc.bookFeeCost} name="st_book_fee_cost" type="number" inputMode="numeric" min={0} locale={locale} />
        <Field label={sc.materialInsuranceCost} name="st_material_insurance_cost" type="number" inputMode="numeric" min={0} locale={locale} />
        <Field label={sc.monthlyRentCost} name="st_monthly_rent_cost" type="number" inputMode="numeric" min={0} locale={locale} />
      </div>
      <TextAreaField label={sc.otherExpenses} name="st_other_expenses" helper={sc.otherExpensesHelper} />
      <TextAreaField label={sc.accommodationInfo} name="st_accommodation_info" helper={sc.accommodationInfoHelper} />
      <ChoiceGroup
        legend={sc.recommendAccommodation}
        name="st_recommend_accommodation"
        required={false}
        options={[
          { value: "yes", label: sc.recommendYes },
          { value: "no", label: sc.recommendNo },
        ]}
      />
    </div>
  );
}

// --- Step 5: Self-reflection ---
export function StudentReflectionStep({ locale, errors, startNumber }: { locale: Locale; errors?: FieldErrors; startNumber: number }) {
  const sc = STUDENT_COPY[locale];
  return (
    <div className="space-y-8">
      <TextAreaField label={`${startNumber}. ${sc.ownStrengths}`} name="st_strengths" required error={errors?.st_strengths} />
      <TextAreaField label={`${startNumber + 1}. ${sc.ownImprovements}`} name="st_improvements" required error={errors?.st_improvements} />
    </div>
  );
}

// --- Step 6: coop-center process, workplace support, closing comments ---
// `startNumber` is N+3 (the first item in this step) — computed by the
// wizard from the program's actual LO count so numbering is never
// hard-coded (G10's own "most likely to break" warning in goal.md).
export function StudentClosingStep({
  locale,
  errors,
  formVersion,
  startNumber,
}: StepProps & { startNumber: number }) {
  const sc = STUDENT_COPY[locale];
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratings, setRatings] = useState<Record<string, number | undefined>>({});
  const [futurePlacement, setFuturePlacement] = useState("");
  const otherInputRef = useRef<HTMLInputElement>(null);
  const prevPlacementRef = useRef("");

  const ratingNames = ["center-0", "center-1", "st_workplace_support_0", "st_workplace_support_1", "st_workplace_support_2", "st_workplace_support_3", "st_workplace_support_4"];

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;
    const next: Record<string, number | undefined> = {};
    for (const name of ratingNames) {
      const group = form.elements.namedItem(name);
      if (group instanceof RadioNodeList) {
        for (const radio of group) if (radio instanceof HTMLInputElement && radio.checked) { next[name] = Number(radio.value); break; }
      } else if (group instanceof HTMLInputElement && group.checked) next[name] = Number(group.value);
    }
    setRatings(next);
    const placementEl = form.elements.namedItem("st_future_placement");
    let placement = "";
    if (placementEl instanceof RadioNodeList) {
      for (const radio of placementEl) if (radio instanceof HTMLInputElement && radio.checked) { placement = radio.value; break; }
    } else if (placementEl instanceof HTMLInputElement && placementEl.checked) placement = placementEl.value;
    setFuturePlacement(placement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formVersion]);

  const showOther = futurePlacement === "other";
  useEffect(() => {
    if (showOther) return;
    const form = containerRef.current?.closest("form");
    const el = form?.elements.namedItem("st_future_placement_other");
    if (el instanceof HTMLInputElement) el.value = "";
  }, [showOther]);
  useEffect(() => {
    if (showOther && prevPlacementRef.current !== "other") {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.name === "st_future_placement") otherInputRef.current?.focus();
    }
    prevPlacementRef.current = futurePlacement;
  }, [showOther, futurePlacement]);

  const centerLevels: RatingLevel[] = sc.rating4.map((label, i) => ({ value: i + 1, label })).reverse();

  return (
    <div ref={containerRef} className="space-y-10">
      <section aria-labelledby="student-center-title">
        <h3 id="student-center-title" className="border-b border-border-default pb-3 text-lg font-semibold text-primary">{sc.centerTitle}</h3>
        <div className="divide-y divide-border-default">
          {sc.centerItems.map((item, index) => {
            const fieldName = `center-${index}`;
            return (
              <fieldset key={item} className="py-7 first:pt-6 last:pb-0">
                <legend className="w-full text-base font-medium leading-relaxed text-primary">{startNumber + index}. {item}<Required /></legend>
                <div className="mt-4">
                  <RatingCard levels={centerLevels} value={ratings[fieldName]} onChange={(v) => setRatings((prev) => ({ ...prev, [fieldName]: v }))} name={fieldName} required error={errors?.[fieldName]} aria-label={`${startNumber + index}. ${item}`} />
                </div>
              </fieldset>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="student-support-title">
        <h3 id="student-support-title" className="border-b border-border-default pb-3 text-lg font-semibold text-primary">{sc.workplaceSupportTitle}</h3>
        <div className="divide-y divide-border-default">
          {sc.workplaceSupportItems.map((item, index) => {
            const fieldName = `st_workplace_support_${index}`;
            const number = startNumber + 2 + index;
            return (
              <fieldset key={item} className="py-7 first:pt-6 last:pb-0">
                <legend className="w-full text-base font-medium leading-relaxed text-primary">{number}. {item}<Required /></legend>
                <div className="mt-4">
                  <RatingCard levels={centerLevels} value={ratings[fieldName]} onChange={(v) => setRatings((prev) => ({ ...prev, [fieldName]: v }))} name={fieldName} required error={errors?.[fieldName]} aria-label={`${number}. ${item}`} />
                </div>
              </fieldset>
            );
          })}
        </div>
      </section>

      <section className="space-y-6 border-t border-border-default pt-7">
        <div>
          <ChoiceGroup
            legend={`${startNumber + 7}. ${sc.futurePlacement}`}
            name="st_future_placement"
            options={[
              { value: "should", label: sc.futureShould },
              { value: "should_not", label: sc.futureShouldNot },
              { value: "other", label: sc.futureOther, controlsId: "student-future-other-region" },
            ]}
            error={errors?.st_future_placement}
          />
          <div id="student-future-other-region" hidden={!showOther} className="mt-4">
            <Field ref={otherInputRef} label={sc.futureOtherSpecify} name="st_future_placement_other" locale={locale} required={showOther} error={errors?.st_future_placement_other} />
          </div>
        </div>
        <TextAreaField label={`${startNumber + 8}. ${sc.otherComments}`} name="st_other_comments" />
      </section>
    </div>
  );
}
