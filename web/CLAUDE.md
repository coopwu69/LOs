@AGENTS.md

<!-- Project-specific rules (not auto-generated, do not remove on `next dev`) -->

## Evaluation wizard: never gate page navigation on validation

`EvaluationWizard.tsx` (`goToStep` / `handleNext`) must let users move between wizard steps (Next/Back/Stepper click) freely, with **zero** required-field or range validation. Validation only runs in `handleSubmit` at final submit, and (separately) as soft progress indicators via `recomputeCompletion`/`stepCompletion` (checkmarks on the Stepper, not blockers).

**Why:** this form's steps are viewed by reviewers/staff who need to page through the entire questionnaire to check its layout/wording without entering real data — locking Next behind per-step validation makes that impossible. Confirmed 2026-09-02 after this exact behavior regressed (or was about to) and had to be fixed again.

**How to apply:** if you touch `goToStep`, `handleNext`, or add a new wizard step, do not reintroduce a `validateStep()` call that blocks navigation. Keep native HTML `required` attributes on fields if useful for the final `type="submit"` button's browser-level check, but never call `.reportValidity()`/`.checkValidity()` or custom validators from the Next/step-click handlers.

## Design System — Color Tokens

### One brand color: navy (unified 2026-09-03)

The project previously used two distinct blues — navy `--primary` for "selected/active" state and indigo `--action-primary` for "clickable" elements — kept deliberately separate so buttons wouldn't look like selected rating cards. That separation was removed on 2026-09-03: the whole project now runs on a single navy hue so buttons, links, and selected states read as one consistent brand tone.

| Token | CSS Variable | Value | Purpose | Changes in dark? |
|---|---|---|---|---|
| **Primary** (brand) | `--primary` | `#071C31` (navy) | Selected state in RatingCard, solid fills, brand accents | No — always navy |
| **Action** (interactive) | `--action-primary` | `#071C31` (navy-900, same value as `--primary`) | Buttons, links, LO code labels, step indicators | Yes — navy-500 in dark (lighter, for contrast against near-black backgrounds) |
| **Text primary** | `--text-primary` | `var(--primary)` in light, `#fafaf9` in dark | Body text, headings | Yes — cream in dark |

### The `--navy-*` primitive scale

`globals.css` defines a single hue-210 navy scale (`--navy-50` … `--navy-950`), replacing the old indigo scale. `--navy-900` equals `--primary` (`#071c31`) exactly. All former indigo semantic tokens (`--text-link`, `--border-focus`, `--action-primary*`, `--feedback-info-*`, `--domain-knowledge*`) now point at `--navy-*` tiers instead.

Hover/active convention for `--action-primary`: hover lightens one tier, active darkens one tier, in both light and dark mode — since the light-mode base (`navy-900`) is already near-black, darkening further gives little visible feedback, so hover lightens instead.

### Token architecture in `globals.css`

```
--primary: #071c31                    (brand navy, never changes)
--primary-foreground: #fffefb         (warm white on navy, never changes)
--text-primary: var(--primary)        (light mode — navy text)
--text-primary: #fafaf9               (dark mode — cream text)
--action-primary: var(--navy-900)     (light mode — navy buttons, matches --primary)
--action-primary: var(--navy-500)     (dark mode — lighter navy, for contrast)
```

### Custom utility class overrides

`bg-primary`, `border-primary`, `bg-secondary`, `bg-border`, and `text-primary-foreground` are defined as **custom CSS classes** in `globals.css` (after `@theme inline`) to ensure they always resolve to `var(--primary)` (navy) regardless of light/dark mode. Tailwind's generated `bg-primary` utility would otherwise use `var(--text-primary)` which changes to cream in dark mode — wrong for a background.

**Do not remove these custom classes.** If you need a new primary-based utility (e.g., `ring-primary`), add it in the same block.

### RatingCard component

`RatingCard.tsx` is a controlled radio group (segmented control) used for:
- **CompetencyStep** (Steps 1-2): 4 levels with descriptions (rubric shown in-card)
- **ReportStep** (Step 3): 5 levels without descriptions

Selected state: `bg-primary text-primary-foreground` (navy fill, warm white text).
Unselected state: `bg-raised text-primary hover:bg-hover`.

The wizard uses uncontrolled form submission (hidden radio inputs with `name`), but RatingCard is controlled (`value`/`onChange`). State is synced from DOM to React via `useEffect` on `formVersion` — this bridges the gap after `restoreForm` sets radio.checked directly on the DOM.

**Do not replace RatingCard with RatingScale** for LOs or report items. RatingScale (the older uncontrolled radio grid) is kept only for backward compatibility but is no longer used in the wizard.
