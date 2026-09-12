-- Migration 022: create curriculum_review_confirmations table (G12, 2026-09-12).
--
-- The curriculum-review dashboard (/programs/{programId}/review) lets a
-- reviewer confirm they have checked each of a program's 3 forms (company /
-- advisor / student) for completeness. Every confirmation is a NEW row — the
-- table keeps full history so re-confirming after a content change leaves an
-- audit trail; the dashboard reads the MOST RECENT row per (program_id, role)
-- to decide the badge state, but older rows stay.
--
-- This is a different table/purpose from template_revisions (Q11): that one
-- logs question-set edits; this one logs "I reviewed the form's content and
-- confirm it's complete" per role, with reviewer name/email/phone.
--
-- Safety:
--   - Uses CREATE TABLE IF NOT EXISTS so re-running is a no-op.
--   - No existing data is touched; this only creates a new table + index.

BEGIN;

CREATE TABLE IF NOT EXISTS public.curriculum_review_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('company', 'advisor', 'student')),
  reviewer_name text NOT NULL,
  reviewer_email text NOT NULL,
  reviewer_phone text NOT NULL,
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_review_confirmations_program_role
  ON public.curriculum_review_confirmations (program_id, role);

COMMIT;
