-- Migration 024: create the `students` table and import the roster CSV
-- (goal.md — "เพิ่มรายชื่อนักศึกษาเข้าในระบบนี้ให้หน่อย", 2026-09-14).
--
-- Purpose: power a name/code autocomplete on the student_code + student_name
-- fields shared by all 3 evaluation forms (company/advisor/student) — the
-- evaluator can start typing a name and pick from students belonging to the
-- program they're already on, and the matching student_code fills in
-- automatically (workplace staff often remember the student's name but not
-- their 8-digit code). Free-text entry stays available when a student isn't
-- found in the list (new students / stale roster) — this table is a
-- convenience lookup, never a hard constraint on what the form accepts.
--
-- Source: a `students_rows.csv` export from the university's other system
-- (columns: id, student_code, full_name, current_program_id, created_at,
-- updated_at). `current_program_id` values were verified against this
-- database's own `programs.id` before writing this migration — they match
-- 1:1 (e.g. CIVIL/EE/MARSCI ids checked directly), so no id-remapping table
-- is needed; the FK below enforces that match going forward.
--
-- Safety:
--   - CREATE TABLE IF NOT EXISTS — re-running the DDL is a no-op.
--   - The CSV import (see migrations/025_import_students.mjs) uses
--     INSERT ... ON CONFLICT (id) DO UPDATE, so re-running the import is
--     also safe/idempotent — reimporting an updated CSV just refreshes rows.
--   - current_program_id is nullable + ON DELETE SET NULL: a program being
--     renamed/deleted must never cascade-delete student rows.

BEGIN;

CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY,
  student_code text NOT NULL,
  full_name text NOT NULL,
  current_program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Autocomplete queries filter by program first, then search full_name — this
-- composite index serves both the "students in program X" filter and a
-- text-prefix scan without a separate program-only index.
CREATE INDEX IF NOT EXISTS idx_students_program_name
  ON public.students (current_program_id, full_name);

-- student_code lookups (e.g. confirming a typed code) don't need to be
-- unique-constrained — the source system may have historical duplicates —
-- but an index keeps that path fast too.
CREATE INDEX IF NOT EXISTS idx_students_code
  ON public.students (student_code);

COMMIT;
