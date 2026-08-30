-- =====================================================================
-- Neon Full Schema (Supabase-free)
-- Migrates the assessment-builder schema to plain Postgres on Neon.
-- Replaces Supabase auth.uid()/authenticated role/RLS with a simple
-- app-level identity model. Safe to re-run (idempotent).
-- =====================================================================

-- ---------- Extensions ----------
CREATE EXTENSION IF NOT EXISTS pgcrypto;          -- gen_random_uuid()

-- ---------- Enum Types ----------
DO $$ BEGIN
  CREATE TYPE assessment_status AS ENUM (
    'draft', 'under_review', 'revision_requested', 'confirmed', 'approved'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM (
    'single_choice', 'multiple_choice', 'text_answer', 'rating_scale'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE domain_type AS ENUM (
    'knowledge', 'skills', 'ethics', 'character',
    'knowledge_skills', 'social_skills', 'general'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE review_action AS ENUM (
    'submit_for_review', 'request_revision', 'confirm', 'approve',
    'reject', 'revoke', 'create_new_draft'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'admin', 'director_coop', 'coop_staff',
    'program_editor', 'program_owner', 'viewer'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================================
-- BASE TABLES (previously provided by Supabase)
-- =====================================================================

-- ---------- programs ----------
CREATE TABLE IF NOT EXISTS public.programs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text UNIQUE NOT NULL,
  name_th     text NOT NULL,
  name_en     text,
  faculty     text,
  degree_level text,                 -- ปริญญาตรี / โท / เอก
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- profiles (app-level identity; no auth.users dependency) ----------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     uuid UNIQUE,           -- link to external auth provider (nullable)
  email       text UNIQUE NOT NULL,
  display_name text,
  role        public.user_role NOT NULL DEFAULT 'viewer',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- user_program_roles ----------
CREATE TABLE IF NOT EXISTS public.user_program_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id  uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL DEFAULT 'program_editor',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, program_id)
);
CREATE INDEX IF NOT EXISTS idx_upr_profile ON public.user_program_roles(profile_id);
CREATE INDEX IF NOT EXISTS idx_upr_program ON public.user_program_roles(program_id);

-- ---------- audit_logs ----------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action      text NOT NULL,
  target_type text,
  target_id   uuid,
  detail      jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_target ON public.audit_logs(target_type, target_id);

-- ---------- evaluation_templates (base columns) ----------
CREATE TABLE IF NOT EXISTS public.evaluation_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  title       text NOT NULL,
  description text,
  status      text DEFAULT 'draft',  -- legacy text status (kept for backward compat)
  created_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  -- extension columns (from migration 001)
  title_en            text,
  description_th      text,
  description_en      text,
  source_document_id  uuid,
  current_version_id  uuid,
  status_enum         public.assessment_status DEFAULT 'draft',
  version_label       text DEFAULT '0.1',
  confirmed_at        timestamptz,
  confirmed_by        uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at         timestamptz,
  approved_by         uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  extraction_confidence numeric(3,2),
  needs_review        boolean DEFAULT true,
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eval_templates_program ON public.evaluation_templates(program_id);

-- ---------- evaluation_questions (base columns) ----------
CREATE TABLE IF NOT EXISTS public.evaluation_questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  text        text NOT NULL,
  section     text,                  -- legacy free-text section label
  weight      integer DEFAULT 1,
  created_at  timestamptz NOT NULL DEFAULT now(),
  -- extension columns (from migration 001)
  section_id  uuid,
  text_en     text,
  lo_code     text,
  question_type public.question_type DEFAULT 'single_choice',
  is_required boolean DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eval_questions_template ON public.evaluation_questions(template_id);

-- =====================================================================
-- ASSESSMENT BUILDER TABLES (from migration 001)
-- =====================================================================

-- ---------- assessment_source_documents ----------
CREATE TABLE IF NOT EXISTS public.assessment_source_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id    uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  filename      text NOT NULL,
  file_path     text NOT NULL,
  file_type     text NOT NULL,        -- pdf, docx, xlsx
  faculty_folder text,
  extracted_text text,
  extraction_confidence numeric(3,2),
  parse_status  text DEFAULT 'pending', -- pending, parsed, needs_manual, failed
  parsed_json   jsonb,
  uploaded_by   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_asd_program ON public.assessment_source_documents(program_id);

-- ---------- assessment_sections ----------
CREATE TABLE IF NOT EXISTS public.assessment_sections (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  title_th      text NOT NULL,
  title_en      text,
  domain_type   public.domain_type DEFAULT 'general',
  sequence      integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assessment_sections_template
  ON public.assessment_sections(template_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sections_seq
  ON public.assessment_sections(template_id, sequence);

-- ---------- assessment_options ----------
CREATE TABLE IF NOT EXISTS public.assessment_options (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   uuid NOT NULL REFERENCES public.evaluation_questions(id) ON DELETE CASCADE,
  label_th      text NOT NULL,
  label_en      text,
  description_th text,
  description_en text,
  score         integer NOT NULL DEFAULT 0,
  sequence      integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assessment_options_question
  ON public.assessment_options(question_id);
CREATE INDEX IF NOT EXISTS idx_assessment_options_seq
  ON public.assessment_options(question_id, sequence);

-- Link evaluation_questions.section_id -> assessment_sections
DO $$ BEGIN
  ALTER TABLE public.evaluation_questions
    ADD CONSTRAINT evaluation_questions_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.assessment_sections(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- assessment_versions ----------
CREATE TABLE IF NOT EXISTS public.assessment_versions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  version_label text NOT NULL,
  status        public.assessment_status NOT NULL DEFAULT 'confirmed',
  snapshot_json jsonb NOT NULL,
  created_by    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  confirmed_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  confirmed_at  timestamptz,
  approved_by   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at   timestamptz,
  change_summary text,
  UNIQUE(template_id, version_label)
);
CREATE INDEX IF NOT EXISTS idx_assessment_versions_template
  ON public.assessment_versions(template_id);

-- Link template.current_version_id -> versions (avoid circular FK via DEFERRABLE)
DO $$ BEGIN
  ALTER TABLE public.evaluation_templates
    ADD CONSTRAINT evaluation_templates_current_version_id_fkey
    FOREIGN KEY (current_version_id) REFERENCES public.assessment_versions(id) ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- assessment_reviews ----------
CREATE TABLE IF NOT EXISTS public.assessment_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  version_id    uuid REFERENCES public.assessment_versions(id) ON DELETE SET NULL,
  reviewer_id   uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action        public.review_action NOT NULL,
  comment       text,
  from_status   public.assessment_status,
  to_status     public.assessment_status,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assessment_reviews_template
  ON public.assessment_reviews(template_id);

-- =====================================================================
-- TRIGGERS: updated_at
-- =====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DO $$ BEGIN
  CREATE TRIGGER trg_eval_templates_updated BEFORE UPDATE ON public.evaluation_templates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_eval_questions_updated BEFORE UPDATE ON public.evaluation_questions
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_sections_updated BEFORE UPDATE ON public.assessment_sections
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_options_updated BEFORE UPDATE ON public.assessment_options
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_programs_updated BEFORE UPDATE ON public.programs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================================
-- HELPER FUNCTIONS (no auth.uid() dependency)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.can_edit_program(p_profile uuid, p_program uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles pr
    WHERE pr.id = p_profile
      AND pr.role IN ('admin','director_coop','coop_staff')
  ) OR EXISTS (
    SELECT 1 FROM public.user_program_roles upr
    WHERE upr.profile_id = p_profile
      AND upr.program_id = p_program
      AND upr.role IN ('program_editor','program_owner','admin')
  );
$$;

-- =====================================================================
-- VIEW: published_assessments
-- =====================================================================
CREATE OR REPLACE VIEW public.published_assessments AS
SELECT
  t.id AS assessment_id,
  t.program_id,
  p.code AS program_code,
  p.name_th AS program_name_th,
  v.id AS version_id,
  v.version_label,
  v.snapshot_json,
  v.approved_at
FROM public.evaluation_templates t
JOIN public.assessment_versions v ON v.id = t.current_version_id
JOIN public.programs p ON p.id = t.program_id
WHERE t.status_enum = 'approved' AND v.status = 'approved';

COMMENT ON VIEW public.published_assessments IS
  'Canonical assessment schema for external assessment systems. Read-only.';

-- =====================================================================
-- DONE
-- =====================================================================
