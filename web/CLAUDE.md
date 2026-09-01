@AGENTS.md

<!-- Project-specific rules (not auto-generated, do not remove on `next dev`) -->

## Evaluation wizard: never gate page navigation on validation

`EvaluationWizard.tsx` (`goToStep` / `handleNext`) must let users move between wizard steps (Next/Back/Stepper click) freely, with **zero** required-field or range validation. Validation only runs in `handleSubmit` at final submit, and (separately) as soft progress indicators via `recomputeCompletion`/`stepCompletion` (checkmarks on the Stepper, not blockers).

**Why:** this form's steps are viewed by reviewers/staff who need to page through the entire questionnaire to check its layout/wording without entering real data — locking Next behind per-step validation makes that impossible. Confirmed 2026-09-02 after this exact behavior regressed (or was about to) and had to be fixed again.

**How to apply:** if you touch `goToStep`, `handleNext`, or add a new wizard step, do not reintroduce a `validateStep()` call that blocks navigation. Keep native HTML `required` attributes on fields if useful for the final `type="submit"` button's browser-level check, but never call `.reportValidity()`/`.checkValidity()` or custom validators from the Next/step-click handlers.
