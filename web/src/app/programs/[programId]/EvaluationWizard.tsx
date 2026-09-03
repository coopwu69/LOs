"use client";

import { useCallback, useEffect, useActionState, useMemo, useRef, useState, useTransition } from "react";
import type { Option, Program, Question, Section, Template } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { loadEvaluationDraft, saveEvaluationDraft, submitEvaluation } from "./actions";
import {
  WIZARD_COPY as COPY,
  PRIMARY_DOMAINS,
  StepProgressBar,
  ErrorSummary,
  AutosaveStatus,
  CompletionScreen,
  GeneralStep,
  CompetencyStep,
  ReportStep,
  FeedbackStep,
  ProcessStep,
} from "@/components/evaluation";
import type { WizardCopy } from "@/components/evaluation";
import {
  validateGeneralStep,
  validateCompetencyStep,
  validateReportStep,
  validateFeedbackStep,
  localizeFieldErrors,
  REPORT_ITEM_COUNT,
  type FieldErrors,
  type SubmitResult,
} from "@/lib/evaluation-schema";

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

// Check that a step has at least the minimum required data (not just valid).
// Module-level so it can be referenced before the component's useCallback.
function hasStepData(
  step: number,
  data: Record<string, string>,
  primaryQuestions: QuestionWithOptions[],
  secondaryQuestions: QuestionWithOptions[],
): boolean {
  if (step === 0) return Boolean(data.evaluator_email && data.student_code && data.student_name);
  if (step === 1 || step === 2) {
    const stepQuestions = step === 1 ? primaryQuestions : secondaryQuestions;
    const required = stepQuestions.filter((q) => q.is_required);
    return required.every((q) => data[`lo-${q.id}`]);
  }
  if (step === 3)
    return Array.from({ length: REPORT_ITEM_COUNT }, (_, i) => data[`c-${i}`]).every(Boolean);
  if (step === 4)
    return Boolean(
      data.strengths &&
        data.improvements &&
        data.hiring_interest &&
        data.coop_next_year &&
        data.next_year_count != null,
    );
  if (step === 5) return false; // process step is optional
  return false;
}

function fieldStep(fieldName: string, primaryQuestions: QuestionWithOptions[], secondaryQuestions: QuestionWithOptions[]): number {
  if (fieldName.startsWith("c-")) return 3;
  if (["strengths", "improvements", "hiring_interest", "coop_next_year", "next_year_count"].includes(fieldName)) return 4;
  if (fieldName.startsWith("lo-")) {
    const questionId = fieldName.slice(3);
    return primaryQuestions.some((question) => question.id === questionId) ? 1 : secondaryQuestions.some((question) => question.id === questionId) ? 2 : 1;
  }
  return 0;
}

function namedControl(form: HTMLFormElement, fieldName: string): HTMLElement | null {
  const element = form.elements.namedItem(fieldName);
  if (element instanceof HTMLElement) return element;
  return form.querySelector<HTMLElement>(`[name="${CSS.escape(fieldName)}"]`);
}

export function EvaluationWizard({ program, template, sections, questions, locale }: Props) {
  const copy: WizardCopy = COPY[locale];
  const [state, formAction, pending] = useActionState(submitEvaluation, null as SubmitResult | null);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>(template ? "preparing" : "preview");
  const [savedAt, setSavedAt] = useState<string>("");
  const [answered, setAnswered] = useState(0);
  const [formVersion, setFormVersion] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [stepCompletion, setStepCompletion] = useState<boolean[]>(() =>
    Array.from({ length: copy.steps.length }, () => false),
  );
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
  const storageKey = template ? `evaluation-draft:${program.id}:${template.id}` : "";

  // Build competency validation config from the questions data.
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

  // --- Draft load on mount ---
  useEffect(() => {
    if (!template) return;
    const token = window.localStorage.getItem(storageKey) ?? crypto.randomUUID();
    window.localStorage.setItem(storageKey, token);
    draftTokenRef.current = token;
    const tokenInput = formRef.current?.elements.namedItem("draftToken");
    if (tokenInput instanceof HTMLInputElement) tokenInput.value = token;
    startSaving(async () => {
      const draft = await loadEvaluationDraft(token, program.id, template.id);
      if (draft && formRef.current) {
        restoreForm(formRef.current, draft.payload);
        setCurrentStep(Math.min(draft.currentStep, copy.steps.length - 1));
        setMaxVisited(Math.min(draft.currentStep, copy.steps.length - 1));
        const data = new FormData(formRef.current);
        setAnswered(questions.filter((question) => data.has(`lo-${question.id}`)).length);
        setFormVersion((version) => version + 1);
        setSaveState("restored");
      } else setSaveState("ready");
    });
  }, [copy.steps.length, program.id, questions, storageKey, template]);

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
      setSaveState("saving");
      startSaving(async () => {
        const result = await saveEvaluationDraft({ draftToken: token, programId: program.id, templateId: template.id, currentStep: step, payload });
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

  // --- Track answered count + debounce autosave ---
  const handleChange = useCallback(() => {
    if (formRef.current) {
      const data = new FormData(formRef.current);
      setAnswered(questions.filter((question) => data.has(`lo-${question.id}`)).length);
      setFormVersion((version) => version + 1);
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistDraft(), 900);
  }, [persistDraft, questions]);

  // --- Validate a single step and return localized errors ---
  const validateStep = useCallback(
    (step: number, data: Record<string, string>): FieldErrors => {
      let rawErrors: FieldErrors = {};
      if (step === 0) rawErrors = validateGeneralStep(data);
      else if (step === 1)
        rawErrors = validateCompetencyStep(data, {
          requiredQuestionIds: competencyConfig.requiredQuestionIds.filter((id) =>
            primaryQuestions.some((q) => q.id === id),
          ),
          allowedScoresByQuestion: competencyConfig.allowedScoresByQuestion,
        });
      else if (step === 2)
        rawErrors = validateCompetencyStep(data, {
          requiredQuestionIds: competencyConfig.requiredQuestionIds.filter((id) =>
            secondaryQuestions.some((q) => q.id === id),
          ),
          allowedScoresByQuestion: competencyConfig.allowedScoresByQuestion,
        });
      else if (step === 3) rawErrors = validateReportStep(data);
      else if (step === 4) rawErrors = validateFeedbackStep(data);
      return localizeFieldErrors(rawErrors, locale);
    },
    [competencyConfig, locale, primaryQuestions, secondaryQuestions],
  );

  // --- Recompute step completion whenever the form changes ---
  const recomputeCompletion = useCallback(() => {
    if (!formRef.current) return;
    const data = formDataToRecord(formRef.current);
    setStepCompletion((prev) => {
      const next = [...prev];
      for (let i = 0; i < copy.steps.length; i++) {
        if (i === currentStep) continue; // don't mark current as complete yet
        const errors = validateStep(i, data);
        next[i] = Object.keys(errors).length === 0 && hasStepData(i, data, primaryQuestions, secondaryQuestions);
      }
      return next;
    });
  }, [copy.steps.length, currentStep, primaryQuestions, secondaryQuestions, validateStep]);

  // --- Navigate to a step ---
  // Browsing between steps is unrestricted — required fields are only
  // enforced at final submit (see handleSubmit) so reviewers can flip
  // through every page without needing to fill anything in first.
  const goToStep = useCallback(
    (next: number) => {
      if (!formRef.current) return;
      setFieldErrors({});
      setCurrentStep(next);
      setMaxVisited((visited) => Math.max(visited, next));
      persistDraft(next);
      // Move focus to the step heading for screen reader users.
      setTimeout(() => {
        stepHeadingRef.current?.focus();
        stepHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    [persistDraft],
  );

  // --- Handle Next button ---
  const handleNext = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  // --- Handle Back button ---
  const handleBack = useCallback(() => {
    const next = Math.max(0, currentStep - 1);
    setFieldErrors({});
    setCurrentStep(next);
    persistDraft(next);
    // Delay focus until after React re-renders the new step.
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
        // Step 5 (process) is optional — skip.
        if (i === 5) continue;
        const stepErrors = validateStep(i, data);
        Object.assign(allErrors, stepErrors);
      }
      if (Object.keys(allErrors).length > 0) {
        e.preventDefault();
        const firstField = Object.keys(allErrors)[0];
        if (firstField) setCurrentStep(fieldStep(firstField, primaryQuestions, secondaryQuestions));
        setFieldErrors(allErrors);
        // Focus the error summary (it auto-focuses on mount).
        return;
      }
      setFieldErrors({});
    },
    [copy.steps.length, primaryQuestions, secondaryQuestions, template, validateStep],
  );

  // --- Focus a field from the error summary ---
  const focusField = useCallback((fieldName: string) => {
    const nextStep = fieldStep(fieldName, primaryQuestions, secondaryQuestions);
    setCurrentStep(nextStep);
    setMaxVisited((visited) => Math.max(visited, nextStep));
    setTimeout(() => {
      if (!formRef.current) return;
      const element = namedControl(formRef.current, fieldName);
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, [primaryQuestions, secondaryQuestions]);

  // --- Recompute completion on form changes (debounced) ---
  useEffect(() => {
    if (completionTimer.current) clearTimeout(completionTimer.current);
    completionTimer.current = setTimeout(() => {
      recomputeCompletion();
    }, 300);
    return () => {
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, [formVersion, recomputeCompletion]);

  // --- Merge server-side fieldErrors into the displayed errors ---
  // Derived during render (no effect) to avoid cascading setState.
  const effectiveFieldErrors: FieldErrors = useMemo(() => {
    if (state && !state.success && state.fieldErrors) {
      return { ...fieldErrors, ...state.fieldErrors };
    }
    return fieldErrors;
  }, [fieldErrors, state]);

  // --- Success screen ---
  if (state?.success) {
    return (
      <CompletionScreen
        referenceId={state.id}
        loScore={state.loScore}
        loCount={state.loCount}
        loMax={state.loMax}
        cScore={state.cScore}
        cCount={state.cCount}
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

      <StepProgressBar
        currentStep={currentStep}
        stepCompletion={stepCompletion}
        onSelect={goToStep}
        locale={locale}
        allowUnrestrictedNavigation
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
          <div hidden={currentStep !== 0}>
            <GeneralStep program={program} locale={locale} errors={effectiveFieldErrors} />
          </div>
          <div hidden={currentStep !== 1}>
            <CompetencyStep sections={primarySections} questions={primaryQuestions} locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== 2}>
            <CompetencyStep sections={secondarySections} questions={secondaryQuestions} locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== 3}>
            <ReportStep locale={locale} errors={effectiveFieldErrors} formVersion={formVersion} />
          </div>
          <div hidden={currentStep !== 4}>
            <FeedbackStep locale={locale} errors={effectiveFieldErrors} />
          </div>
          <div hidden={currentStep !== 5}>
            <ProcessStep answered={answered} total={questions.length} locale={locale} />
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

        <footer className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-b-xl border-t border-border-default bg-raised/95 px-5 py-4 backdrop-blur sm:px-8"
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
