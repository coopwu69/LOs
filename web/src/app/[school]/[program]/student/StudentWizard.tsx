"use client";

import { useCallback, useEffect, useActionState, useMemo, useRef, useState, useTransition } from "react";
import type { Option, Program, Question, Section, Template } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { loadStudentDraft, saveStudentDraft, submitStudentSurvey } from "./actions";
import {
  PRIMARY_DOMAINS,
  StepProgressBar,
  ErrorSummary,
  AutosaveStatus,
  CompetencyStep,
} from "@/components/evaluation";
import { STUDENT_COPY } from "@/components/student/student-copy";
import { StudentGeneralStep, StudentExpensesStep, StudentReflectionStep, StudentClosingStep } from "@/components/student/student-steps";
import { StudentCompletionScreen } from "@/components/student/StudentCompletionScreen";
import {
  validateStudentGeneralStep,
  validateStudentExpensesStep,
  validateStudentReflectionStep,
  validateStudentClosingStep,
  localizeFieldErrors,
  type FieldErrors,
  type StudentSubmitResult,
} from "@/lib/student-schema";
import { validateCompetencyStep } from "@/lib/evaluation-schema";

// Named step indexes — same rationale as EvaluationWizard's STEP constant
// (goal.md's own prep-step recommendation, applied here from the start
// since this form is new): avoids the off-by-one class of bug that hit the
// company form when a section was inserted mid-form.
const STEP = {
  GENERAL: 0,
  EXPENSES: 1,
  PRIMARY: 2,
  SECONDARY: 3,
  REFLECTION: 4,
  CLOSING: 5,
} as const;
const STEP_COUNT = 6;

type QuestionWithOptions = Question & { options: Option[] };
type Props = {
  program: Program;
  template: Template | null;
  sections: Section[];
  questions: QuestionWithOptions[];
  locale: Locale;
};

type SaveState = "preparing" | "preview" | "saving" | "saved" | "failed" | "restored" | "ready";

function restoreForm(form: HTMLFormElement, payload: Record<string, string>) {
  for (const element of Array.from(form.elements)) {
    if (
      !(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) ||
      !element.name ||
      !(element.name in payload)
    )
      continue;
    const value = String(payload[element.name]);
    if (element instanceof HTMLInputElement && (element.type === "radio" || element.type === "checkbox"))
      element.checked = element.value === value;
    else element.value = value;
  }
}

function formDataToRecord(form: HTMLFormElement): Record<string, string> {
  const data = new FormData(form);
  const record: Record<string, string> = {};
  for (const [key, value] of data.entries()) record[key] = String(value);
  return record;
}

function namedControl(form: HTMLFormElement, fieldName: string): HTMLElement | null {
  const element = form.elements.namedItem(fieldName);
  if (element instanceof HTMLElement) return element;
  return form.querySelector<HTMLElement>(`[name="${CSS.escape(fieldName)}"]`);
}

export function StudentWizard({ program, template, sections, questions, locale }: Props) {
  const copy = STUDENT_COPY[locale];
  const [state, formAction, pending] = useActionState(submitStudentSurvey, null as StudentSubmitResult | null);
  const [currentStep, setCurrentStep] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>(template ? "preparing" : "preview");
  const [savedAt, setSavedAt] = useState<string>("");
  const [formVersion, setFormVersion] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [stepCompletion, setStepCompletion] = useState<boolean[]>(() => Array.from({ length: STEP_COUNT }, () => false));
  const [, startSaving] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const draftTokenRef = useRef("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const primarySections = sections.filter((section) => PRIMARY_DOMAINS.has(section.domain_type));
  const secondarySections = sections.filter((section) => !PRIMARY_DOMAINS.has(section.domain_type));
  const primaryIds = new Set(primarySections.map((section) => section.id));
  const secondaryIds = new Set(secondarySections.map((section) => section.id));
  const primaryQuestions = questions.filter((question) => question.section_id && primaryIds.has(question.section_id));
  const secondaryQuestions = questions.filter((question) => question.section_id && secondaryIds.has(question.section_id));
  const storageKey = template ? `student-draft:${program.id}:${template.id}` : "";

  // Numbering for sections 5-6 runs from the program's actual LO count —
  // never hard-coded (G10's own "most likely to break" warning in goal.md,
  // since every program has a different number of LO questions).
  const loQuestionCount = primaryQuestions.length + secondaryQuestions.length;
  const reflectionStartNumber = loQuestionCount + 1;
  const closingStartNumber = loQuestionCount + 3;

  const competencyConfig = useMemo(
    () => ({
      requiredQuestionIds: questions.filter((q) => q.is_required).map((q) => q.id),
      allowedScoresByQuestion: new Map(
        questions.map((q) => {
          const scores = new Set(q.options.map((o) => o.score));
          return [q.id, scores] as const;
        }),
      ),
    }),
    [questions],
  );

  useEffect(() => {
    if (!template) return;
    const token = window.localStorage.getItem(storageKey) ?? crypto.randomUUID();
    window.localStorage.setItem(storageKey, token);
    draftTokenRef.current = token;
    const tokenInput = formRef.current?.elements.namedItem("draftToken");
    if (tokenInput instanceof HTMLInputElement) tokenInput.value = token;
    startSaving(async () => {
      const draft = await loadStudentDraft(token, program.id, template.id);
      if (draft && formRef.current) {
        restoreForm(formRef.current, draft.payload);
        setCurrentStep(Math.min(draft.currentStep, STEP_COUNT - 1));
        setFormVersion((version) => version + 1);
        setSaveState("restored");
      } else setSaveState("ready");
    });
  }, [program.id, storageKey, template]);

  useEffect(() => {
    if (state?.success && storageKey) window.localStorage.removeItem(storageKey);
  }, [state, storageKey]);

  const persistDraft = useCallback(
    (step = currentStep) => {
      const token = draftTokenRef.current;
      if (!formRef.current || !token || !template) return;
      const payload = formDataToRecord(formRef.current);
      setSaveState("saving");
      startSaving(async () => {
        const result = await saveStudentDraft({ draftToken: token, programId: program.id, templateId: template.id, currentStep: step, payload });
        if (result.success) {
          const time = new Date(result.updatedAt).toLocaleTimeString(locale === "en" ? "en-GB" : "th-TH", { hour: "2-digit", minute: "2-digit" });
          setSavedAt(time);
          setSaveState("saved");
        } else setSaveState("failed");
      });
    },
    [currentStep, locale, program.id, template],
  );

  const handleChange = useCallback(() => {
    setFormVersion((version) => version + 1);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistDraft(), 900);
  }, [persistDraft]);

  const validateStep = useCallback(
    (step: number, data: Record<string, string>): FieldErrors => {
      let rawErrors: FieldErrors = {};
      if (step === STEP.GENERAL) rawErrors = validateStudentGeneralStep(data);
      else if (step === STEP.EXPENSES) rawErrors = validateStudentExpensesStep(data);
      else if (step === STEP.PRIMARY)
        rawErrors = validateCompetencyStep(data, {
          requiredQuestionIds: competencyConfig.requiredQuestionIds.filter((id) => primaryQuestions.some((q) => q.id === id)),
          allowedScoresByQuestion: competencyConfig.allowedScoresByQuestion,
        });
      else if (step === STEP.SECONDARY)
        rawErrors = validateCompetencyStep(data, {
          requiredQuestionIds: competencyConfig.requiredQuestionIds.filter((id) => secondaryQuestions.some((q) => q.id === id)),
          allowedScoresByQuestion: competencyConfig.allowedScoresByQuestion,
        });
      else if (step === STEP.REFLECTION) rawErrors = validateStudentReflectionStep(data);
      else if (step === STEP.CLOSING) rawErrors = validateStudentClosingStep(data);
      return localizeFieldErrors(rawErrors, locale);
    },
    [competencyConfig, locale, primaryQuestions, secondaryQuestions],
  );

  const hasStepData = useCallback(
    (step: number, data: Record<string, string>): boolean => {
      if (step === STEP.GENERAL) return Boolean(data.student_code && data.student_name);
      if (step === STEP.EXPENSES) return Boolean(data.st_compensation_type);
      if (step === STEP.PRIMARY || step === STEP.SECONDARY) {
        const stepQuestions = step === STEP.PRIMARY ? primaryQuestions : secondaryQuestions;
        const required = stepQuestions.filter((q) => q.is_required);
        return required.length > 0 && required.every((q) => data[`lo-${q.id}`]);
      }
      if (step === STEP.REFLECTION) return Boolean(data.st_strengths && data.st_improvements);
      if (step === STEP.CLOSING) return Boolean(data["center-0"] && data["center-1"] && data.st_future_placement);
      return false;
    },
    [primaryQuestions, secondaryQuestions],
  );

  const recomputeCompletion = useCallback(() => {
    if (!formRef.current) return;
    const data = formDataToRecord(formRef.current);
    setStepCompletion((prev) => {
      const next = [...prev];
      for (let i = 0; i < STEP_COUNT; i++) {
        if (i === currentStep) continue;
        const errors = validateStep(i, data);
        next[i] = Object.keys(errors).length === 0 && hasStepData(i, data);
      }
      return next;
    });
  }, [currentStep, hasStepData, validateStep]);

  const goToStep = useCallback(
    (next: number) => {
      if (!formRef.current) return;
      setFieldErrors({});
      setCurrentStep(next);
      persistDraft(next);
      setTimeout(() => {
        stepHeadingRef.current?.focus();
        stepHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    [persistDraft],
  );

  const handleNext = useCallback(() => goToStep(currentStep + 1), [currentStep, goToStep]);
  const handleBack = useCallback(() => goToStep(Math.max(0, currentStep - 1)), [currentStep, goToStep]);

  function fieldStep(fieldName: string): number {
    if (fieldName.startsWith("st_workplace_support") || fieldName.startsWith("center-") || fieldName.startsWith("st_future_placement") || fieldName === "st_other_comments") return STEP.CLOSING;
    if (fieldName === "st_strengths" || fieldName === "st_improvements") return STEP.REFLECTION;
    if (fieldName.startsWith("lo-")) {
      const questionId = fieldName.slice(3);
      return primaryQuestions.some((q) => q.id === questionId) ? STEP.PRIMARY : secondaryQuestions.some((q) => q.id === questionId) ? STEP.SECONDARY : STEP.PRIMARY;
    }
    if (fieldName.startsWith("st_") || fieldName === "st_compensation_type") return STEP.EXPENSES;
    return STEP.GENERAL;
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (!template) {
        e.preventDefault();
        return;
      }
      if (!formRef.current) return;
      const data = formDataToRecord(formRef.current);
      const allErrors: FieldErrors = {};
      for (let i = 0; i < STEP_COUNT; i++) Object.assign(allErrors, validateStep(i, data));
      if (Object.keys(allErrors).length > 0) {
        e.preventDefault();
        const firstField = Object.keys(allErrors)[0];
        if (firstField) setCurrentStep(fieldStep(firstField));
        setFieldErrors(allErrors);
        return;
      }
      setFieldErrors({});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template, validateStep],
  );

  const focusField = useCallback(
    (fieldName: string) => {
      const nextStep = fieldStep(fieldName);
      setCurrentStep(nextStep);
      setTimeout(() => {
        if (!formRef.current) return;
        const element = namedControl(formRef.current, fieldName);
        element?.focus();
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [primaryQuestions, secondaryQuestions],
  );

  useEffect(() => {
    if (completionTimer.current) clearTimeout(completionTimer.current);
    completionTimer.current = setTimeout(() => recomputeCompletion(), 300);
    return () => {
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, [formVersion, recomputeCompletion]);

  const effectiveFieldErrors: FieldErrors = useMemo(() => {
    if (state && !state.success && state.fieldErrors) return { ...fieldErrors, ...state.fieldErrors };
    return fieldErrors;
  }, [fieldErrors, state]);

  if (state?.success) {
    return <StudentCompletionScreen referenceId={state.id} loScore={state.loScore} loCount={state.loCount} loMax={state.loMax} locale={locale} />;
  }

  const step = copy.steps[currentStep];
  const hasErrors = Object.keys(effectiveFieldErrors).length > 0;
  const isLastStep = currentStep === STEP_COUNT - 1;

  return (
    <form ref={formRef} action={template ? formAction : undefined} onSubmit={handleSubmit} onChange={handleChange} className="mx-auto max-w-4xl">
      <input type="hidden" name="programId" value={program.id} />
      <input type="hidden" name="templateId" value={template?.id ?? ""} />
      <input type="hidden" name="draftToken" defaultValue="" />
      <input type="hidden" name="locale" value={locale} />

      <div className="mb-6 rounded-lg border border-info-border bg-info-bg px-4 py-3 text-sm leading-relaxed text-info-text" role="note">
        {copy.disclosure}
      </div>

      <StepProgressBar currentStep={currentStep} stepCompletion={stepCompletion} onSelect={goToStep} locale={locale} allowUnrestrictedNavigation steps={copy.steps} />

      <div className="mt-8 rounded-xl border border-border-default bg-raised shadow-sm sm:mt-10">
        <header className="border-b border-border-default px-5 py-6 sm:px-8 sm:py-8">
          <p className="hidden text-sm font-semibold text-action md:block">
            {locale === "en" ? "Section" : "ส่วน"} {currentStep + 1} {locale === "en" ? "of" : "จาก"} {STEP_COUNT}
          </p>
          <h2 ref={stepHeadingRef} data-step-heading tabIndex={-1} className="mt-2 scroll-mt-6 text-2xl font-semibold tracking-tight text-primary">
            {step[1]}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">{step[2]}</p>
        </header>

        <div className="px-5 py-7 sm:px-8 sm:py-9">
          <div hidden={currentStep !== STEP.GENERAL}>
            <StudentGeneralStep program={program} locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== STEP.EXPENSES}>
            <StudentExpensesStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== STEP.PRIMARY}>
            <CompetencyStep sections={primarySections} questions={primaryQuestions} locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== STEP.SECONDARY}>
            <CompetencyStep sections={secondarySections} questions={secondaryQuestions} locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== STEP.REFLECTION}>
            <StudentReflectionStep locale={locale} errors={effectiveFieldErrors} startNumber={reflectionStartNumber} />
          </div>
          <div hidden={currentStep !== STEP.CLOSING}>
            <StudentClosingStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} startNumber={closingStartNumber} />
          </div>
        </div>

        {hasErrors && (
          <ErrorSummary
            fieldErrors={effectiveFieldErrors}
            locale={locale}
            onFieldFocus={focusField}
            extraLabels={{
              st_workplace_name: copy.workplaceName,
              st_workplace_address: copy.workplaceAddress,
              st_compensation_type: copy.compensationType,
              st_strengths: copy.ownStrengths,
              st_improvements: copy.ownImprovements,
              st_workplace_support_0: copy.workplaceSupportItems[0],
              st_workplace_support_1: copy.workplaceSupportItems[1],
              st_workplace_support_2: copy.workplaceSupportItems[2],
              st_workplace_support_3: copy.workplaceSupportItems[3],
              st_workplace_support_4: copy.workplaceSupportItems[4],
              st_future_placement: copy.futurePlacement,
              st_future_placement_other: copy.futureOtherSpecify,
            }}
          />
        )}

        {state && !state.success && state.error && !state.fieldErrors && (
          <div className="mx-5 mb-5 rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text sm:mx-8" role="alert">
            {state.error}
          </div>
        )}

        <footer
          className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-b-xl border-t border-border-default bg-raised/95 px-5 py-4 backdrop-blur sm:px-8"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <AutosaveStatus state={saveState} savedAt={savedAt} locale={locale} />
          <div className="flex flex-wrap items-center gap-3">
            {currentStep > 0 && (
              <button type="button" onClick={handleBack} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover">
                {locale === "en" ? "Back" : "ย้อนกลับ"}
              </button>
            )}
            {!isLastStep ? (
              <button type="button" onClick={handleNext} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active">
                {locale === "en" ? "Next" : "ถัดไป"}
              </button>
            ) : (
              <button type="submit" disabled={pending || !template} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active disabled:cursor-not-allowed disabled:opacity-50">
                {pending ? (locale === "en" ? "Submitting…" : "กำลังส่ง…") : locale === "en" ? "Submit" : "ส่งแบบสอบถาม"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </form>
  );
}
