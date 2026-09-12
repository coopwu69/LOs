-- Migration 021: add reviewer identity columns to template_revisions (Q11, 2026-09-12).
--
-- The question-set editor (/programs/{programId}/edit) now requires the editor
-- to confirm their identity (ชื่อ-สกุล, email, phone) and tick "ตรวจสอบแล้ว"
-- before a Save is persisted. That reviewer info is written into the revision
-- row so the /programs/{programId}/history page can show who reviewed each edit.
--
-- All new columns are nullable (reviewer_confirmed defaults to false) so:
--   - existing revision rows keep working (no backfill needed),
--   - the 'restore' flow, which records a revision without a reviewer, keeps
--     working (reviewer_* stay NULL / false).
--
-- Safety:
--   - Uses ADD COLUMN IF NOT EXISTS so re-running is a no-op.
--   - No existing data is rewritten; this only adds columns.

ALTER TABLE public.template_revisions
  ADD COLUMN IF NOT EXISTS reviewer_name text,
  ADD COLUMN IF NOT EXISTS reviewer_email text,
  ADD COLUMN IF NOT EXISTS reviewer_phone text,
  ADD COLUMN IF NOT EXISTS reviewer_confirmed boolean NOT NULL DEFAULT false;
