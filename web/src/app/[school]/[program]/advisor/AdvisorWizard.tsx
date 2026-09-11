"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition, useActionState } from "react";
import type { Option, Program, Question, Section, Template } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import {
  StepProgressBar,
  ErrorSummary,
  AutosaveStatus,
  WIZARD_COPY,
  PRIMARY_DOMAINS,
  type WizardCopy,
} from "@/components/evaluation";
import {
  AdvisorGeneralStep,
  AdvisorCompetencyStep,
  AdvisorOtherStep,
  AdvisorProcessStep,
  AdvisorReportStep,
  AdvisorCompletionScreen,
  ADVISOR_STEPS,
  ADVISOR_STEP,
  ADVISOR_LEGACY_STEP_MAP,
  ADVISOR_DRAFT_LAYOUT,
  ADVISOR_DRAFT_LAYOUT_KEY,
  ADVISOR_GENERAL_FIELDS,
} from "@/components/advisor";
import { submitAdvisorEvaluation, saveAdvisorDraft, loadAdvisorDraft } from "./actions";
import {
  type AdvisorSubmitResult,
  type FieldErrors,
  validateAdvisorGeneralStep,
  validateAdvisorCompetencyStep,
  validateAdvisorOtherStep,
  validateAdvisorProcessStep,
  validateAdvisorReportStep,
  localizeFieldErrors,
} from "@/lib/advisor-schema";

type QuestionWithOptions = Question & { options: Option[] };
type SaveState = "preparing" | "preview" | "saving" | "saved" | "failed" | "restored" | "ready";

type Props = {
  program: Program;
  template: Template | null;
  sections: Section[];
  questions: QuestionWithOptions[];
  locale: Locale;
  role?: string;
};

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

function hasStepData(
  step: number,
  data: Record<string, string>,
  primaryQuestions: QuestionWithOptions[],
  secondaryQuestions: QuestionWithOptions[],
): boolean {
  if (step === ADVISOR_STEP.GENERAL) return ADVISOR_GENERAL_FIELDS.every((name) => data[name as keyof typeof data]);
  if (step === ADVISOR_STEP.KNOWLEDGE) {
    const required = primaryQuestions.filter((q) => q.is_required);
    return required.every((q) => data[`lo-${q.id}`]);
  }
  if (step === ADVISOR_STEP.ETHICS) {
    const required = secondaryQuestions.filter((q) => q.is_required);
    return required.every((q) => data[`lo-${q.id}`]);
  }
  if (step === ADVISOR_STEP.REPORT) return ["adv-report-0", "adv-report-1", "adv-report-2", "adv-report-3", "adv-report-4"].every((name) => data[name]);
  if (step === ADVISOR_STEP.COMMENTS) return ["adv-other-0", "adv-other-1", "adv_strengths", "adv_improvements"].every((name) => data[name]);
  if (step === ADVISOR_STEP.PROCESS) {
    const required = [
      "adv-center-0",
      "adv-center-1",
      "adv-workplace-0",
      "adv-workplace-1",
      "adv-workplace-2",
      "adv-workplace-3",
      "adv-workplace-4",
      "adv_premium_workplace",
      "adv_future_placement",
    ];
    if (data.adv_premium_workplace === "review") required.push("adv_premium_workplace_reason");
    if (data.adv_future_placement === "other") required.push("adv_future_placement_other");
    return required.every((name) => data[name]);
  }
  return false;
}

function fieldStep(
  fieldName: string,
  primaryQuestions: QuestionWithOptions[],
  secondaryQuestions: QuestionWithOptions[],
): number {
  if (ADVISOR_GENERAL_FIELDS.includes(fieldName as (typeof ADVISOR_GENERAL_FIELDS)[number])) return ADVISOR_STEP.GENERAL;
  if (fieldName.startsWith("lo-")) {
    const questionId = fieldName.slice(3);
    if (primaryQuestions.some((q) => q.id === questionId)) return ADVISOR_STEP.KNOWLEDGE;
    if (secondaryQuestions.some((q) => q.id === questionId)) return ADVISOR_STEP.ETHICS;
    return ADVISOR_STEP.KNOWLEDGE;
  }
  if (fieldName.startsWith("adv-report-")) return ADVISOR_STEP.REPORT;
  if (fieldName.startsWith("adv-other-") || fieldName === "adv_strengths" || fieldName === "adv_improvements")
    return ADVISOR_STEP.COMMENTS;
  if (
    fieldName.startsWith("adv-center-") ||
    fieldName.startsWith("adv-workplace-") ||
    fieldName === "adv_premium_workplace" ||
    fieldName === "adv_premium_workplace_reason" ||
    fieldName === "adv_future_placement" ||
    fieldName === "adv_future_placement_other" ||
    fieldName === "adv_other_comments"
  )
    return ADVISOR_STEP.PROCESS;
  return ADVISOR_STEP.GENERAL;
}

export function AdvisorWizard({ program, template, sections, questions, locale, role = "advisor" }: Props) {
  const copy: WizardCopy = useMemo(() => ({ ...WIZARD_COPY[locale], steps: ADVISOR_STEPS[locale] }), [locale]);

  const [state, formAction, pending] = useActionState(submitAdvisorEvaluation, null as AdvisorSubmitResult | null);
  const [currentStep, setCurrentStep] = useState<number>(ADVISOR_STEP.GENERAL);
  const [saveState, setSaveState] = useState<SaveState>(template ? "preparing" : "preview");
  const [savedAt, setSavedAt] = useState<string>("");
  const [formVersion, setFormVersion] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [stepCompletion, setStepCompletion] = useState<boolean[]>(() => Array.from({ length: copy.steps.length }, () => false));
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
  const storageKey = template ? `advisor-draft:${program.id}:${template.id}` : "";

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

  const primaryConfig = useMemo(
    () => ({
      requiredQuestionIds: competencyConfig.requiredQuestionIds.filter((id) =>
        primaryQuestions.some((q) => q.id === id),
      ),
      allowedScoresByQuestion: competencyConfig.allowedScoresByQuestion,
    }),
    [competencyConfig, primaryQuestions],
  );

  const secondaryConfig = useMemo(
    () => ({
      requiredQuestionIds: competencyConfig.requiredQuestionIds.filter((id) =>
        secondaryQuestions.some((q) => q.id === id),
      ),
      allowedScoresByQuestion: competencyConfig.allowedScoresByQuestion,
    }),
    [competencyConfig, secondaryQuestions],
  );

  // --- Validate a single step and return localized errors ---
  const validateStep = useCallback(
    (step: number, data: Record<string, string>): FieldErrors => {
      let rawErrors: Record<string, string> = {};
      if (step === ADVISOR_STEP.GENERAL) rawErrors = validateAdvisorGeneralStep(data);
      else if (step === ADVISOR_STEP.KNOWLEDGE) rawErrors = validateAdvisorCompetencyStep(data, primaryConfig);
      else if (step === ADVISOR_STEP.ETHICS) rawErrors = validateAdvisorCompetencyStep(data, secondaryConfig);
      else if (step === ADVISOR_STEP.REPORT) rawErrors = validateAdvisorReportStep(data);
      else if (step === ADVISOR_STEP.COMMENTS) rawErrors = validateAdvisorOtherStep(data);
      else if (step === ADVISOR_STEP.PROCESS) rawErrors = validateAdvisorProcessStep(data);
      return localizeFieldErrors(rawErrors, locale);
    },
    [locale, primaryConfig, secondaryConfig],
  );

  // --- Draft load on mount ---
  useEffect(() => {
    if (!template) return;
    const token = window.localStorage.getItem(storageKey) ?? crypto.randomUUID();
    window.localStorage.setItem(storageKey, token);
    draftTokenRef.current = token;
    const tokenInput = formRef.current?.elements.namedItem("draftToken");
    if (tokenInput instanceof HTMLInputElement) tokenInput.value = token;
    startSaving(async () => {
      const draft = await loadAdvisorDraft(token, program.id, template.id);
      if (draft && formRef.current) {
        restoreForm(formRef.current, draft.payload);
        // Drafts saved before the G9 reorder carry a step index from the old
        // layout and no layout marker — translate it so the form reopens on
        // the same section instead of jumping to the wrong one.
        const savedStep =
          draft.payload[ADVISOR_DRAFT_LAYOUT_KEY] === ADVISOR_DRAFT_LAYOUT
            ? draft.currentStep
            : (ADVISOR_LEGACY_STEP_MAP[draft.currentStep] ?? ADVISOR_STEP.GENERAL);
        setCurrentStep(Math.min(savedStep, copy.steps.length - 1));
        setFormVersion((version) => version + 1);
        setSaveState("restored");
      } else {
        setSaveState("ready");
      }
    });
  }, [copy.steps.length, program.id, storageKey, template]);

  // --- Clear storage on success ---
  useEffect(() => {
    if (state?.success && storageKey) window.localStorage.removeItem(storageKey);
  }, [state, storageKey]);

  // --- Persist draft ---
  const persistDraft = useCallback(
    (step = currentStep) => {
      const token = draftTokenRef.current;
      if (!formRef.current || !token || !template) return;
      const payload = formDataToRecord(formRef.current);
      payload[ADVISOR_DRAFT_LAYOUT_KEY] = ADVISOR_DRAFT_LAYOUT;
      setSaveState("saving");
      startSaving(async () => {
        const result = await saveAdvisorDraft({
          draftToken: token,
          programId: program.id,
          templateId: template.id,
          currentStep: step,
          payload,
        });
        if (result.success) {
          const time = new Date(result.updatedAt).toLocaleTimeString(locale === "en" ? "en-GB" : "th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setSavedAt(time);
          setSaveState("saved");
        } else {
          setSaveState("failed");
        }
      });
    },
    [currentStep, locale, program.id, template],
  );

  // --- Trigger re-render + debounce autosave ---
  const handleChange = useCallback(() => {
    setFormVersion((version) => version + 1);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistDraft(), 900);
  }, [persistDraft]);

  // --- Navigate to a step ---
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

  const handleNext = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const handleBack = useCallback(() => {
    const next = Math.max(0, currentStep - 1);
    setFieldErrors({});
    setCurrentStep(next);
    persistDraft(next);
    setTimeout(() => {
      stepHeadingRef.current?.focus();
      stepHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [currentStep, persistDraft]);

  // --- Handle submit: validate all steps, show error summary ---
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (!template) {
        e.preventDefault();
        return;
      }
      if (!formRef.current) return;
      const data = formDataToRecord(formRef.current);
      const allErrors: FieldErrors = {};
      for (let i = 0; i < copy.steps.length; i++) {
        const stepErrors = validateStep(i, data);
        Object.assign(allErrors, stepErrors);
      }
      if (Object.keys(allErrors).length > 0) {
        e.preventDefault();
        const firstField = Object.keys(allErrors)[0];
        if (firstField) setCurrentStep(fieldStep(firstField, primaryQuestions, secondaryQuestions));
        setFieldErrors(allErrors);
        return;
      }
      setFieldErrors({});
    },
    [copy.steps.length, primaryQuestions, secondaryQuestions, template, validateStep],
  );

  const focusField = useCallback(
    (fieldName: string) => {
      const nextStep = fieldStep(fieldName, primaryQuestions, secondaryQuestions);
      setCurrentStep(nextStep);
      setTimeout(() => {
        if (!formRef.current) return;
        const element = namedControl(formRef.current, fieldName);
        element?.focus();
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    },
    [primaryQuestions, secondaryQuestions],
  );

  // --- Recompute step completion whenever the form changes ---
  const recomputeCompletion = useCallback(() => {
    if (!formRef.current) return;
    const data = formDataToRecord(formRef.current);
    setStepCompletion((prev) => {
      const next = [...prev];
      for (let i = 0; i < copy.steps.length; i++) {
        if (i === currentStep) continue;
        const errors = validateStep(i, data);
        next[i] = Object.keys(errors).length === 0 && hasStepData(i, data, primaryQuestions, secondaryQuestions);
      }
      return next;
    });
  }, [copy.steps.length, currentStep, primaryQuestions, secondaryQuestions, validateStep]);

  useEffect(() => {
    if (completionTimer.current) clearTimeout(completionTimer.current);
    completionTimer.current = setTimeout(() => {
      recomputeCompletion();
    }, 300);
    return () => {
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, [formVersion, recomputeCompletion]);

  const effectiveFieldErrors: FieldErrors = useMemo(() => {
    if (state && !state.success && state.fieldErrors) {
      return { ...fieldErrors, ...state.fieldErrors };
    }
    return fieldErrors;
  }, [fieldErrors, state]);

  if (state?.success) {
    return (
      <AdvisorCompletionScreen
        referenceId={state.id}
        loScore={state.loScore}
        loCount={state.loCount}
        loMax={state.loMax}
        otherScore={state.otherScore}
        otherCount={state.otherCount}
        centerScore={state.centerScore}
        centerCount={state.centerCount}
        reportScore={state.reportScore}
        reportCount={state.reportCount}
        locale={locale}
      />
    );
  }

  const step = copy.steps[currentStep];
  const hasErrors = Object.keys(effectiveFieldErrors).length > 0;
  const isLastStep = currentStep === copy.steps.length - 1;

  return (
    <form
      ref={formRef}
      action={template ? formAction : undefined}
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="mx-auto max-w-4xl"
    >
      <input type="hidden" name="programId" value={program.id} />
      <input type="hidden" name="templateId" value={template?.id ?? ""} />
      <input type="hidden" name="draftToken" defaultValue="" />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="evaluatorRole" value={role} />

      <StepProgressBar
        currentStep={currentStep}
        stepCompletion={stepCompletion}
        onSelect={goToStep}
        locale={locale}
        allowUnrestrictedNavigation
        steps={ADVISOR_STEPS[locale]}
      />

      <div className="mt-8 rounded-xl border border-border-default bg-raised shadow-sm sm:mt-10">
        <header className="border-b border-border-default px-5 py-6 sm:px-8 sm:py-8">
          <p className="hidden text-sm font-semibold text-action md:block">
            {copy.step} {currentStep + 1} {copy.of} {copy.steps.length}
          </p>
          <h2
            ref={stepHeadingRef}
            data-step-heading
            tabIndex={-1}
            className="mt-2 scroll-mt-6 text-2xl font-semibold tracking-tight text-primary"
          >
            {step[1]}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary sm:text-base">{step[2]}</p>
        </header>

        <div className="px-5 py-7 sm:px-8 sm:py-9">
          <div hidden={currentStep !== ADVISOR_STEP.GENERAL}>
            <AdvisorGeneralStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== ADVISOR_STEP.KNOWLEDGE}>
            <AdvisorCompetencyStep
              sections={primarySections}
              questions={primaryQuestions}
              locale={locale}
              errors={effectiveFieldErrors}
              formVersion={formVersion}
            />
          </div>
          <div hidden={currentStep !== ADVISOR_STEP.ETHICS}>
            <AdvisorCompetencyStep
              sections={secondarySections}
              questions={secondaryQuestions}
              locale={locale}
              errors={effectiveFieldErrors}
              formVersion={formVersion}
            />
          </div>
          <div hidden={currentStep !== ADVISOR_STEP.REPORT}>
            <AdvisorReportStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== ADVISOR_STEP.COMMENTS}>
            <AdvisorOtherStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== ADVISOR_STEP.PROCESS}>
            <AdvisorProcessStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
        </div>

        {hasErrors && <ErrorSummary fieldErrors={effectiveFieldErrors} locale={locale} onFieldFocus={focusField} />}

        {state && !state.success && state.error && !state.fieldErrors && (
          <div
            className="mx-5 mb-5 rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text sm:mx-8"
            role="alert"
          >
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
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover"
              >
                {copy.back}
              </button>
            )}
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active"
              >
                {copy.next}
              </button>
            ) : (
              <button
                type="submit"
                disabled={pending || !template}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? copy.submitting : copy.submit}
              </button>
            )}
          </div>
        </footer>
      </div>
    </form>
  );
}
