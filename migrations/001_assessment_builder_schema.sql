-- =====================================================================
-- Migration: Assessment Builder Schema
-- Purpose: Extend existing evaluation_templates/questions to support
--          bilingual sections, rubric options, source documents,
--          versioning, review/approval workflow, and RLS.
-- Strategy: ALTER existing tables (NULLable additions only) + CREATE new
--           tables. No data loss. Backward compatible.
-- =====================================================================

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

-- ---------- ALTER: evaluation_templates ----------
ALTER TABLE public.evaluation_templates
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_th text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS source_document_id uuid,
  ADD COLUMN IF NOT EXISTS current_version_id uuid,
  ADD COLUMN IF NOT EXISTS status_enum public.assessment_status DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS version_label text DEFAULT '0.1',
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmed_by uuid,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS extraction_confidence numeric(3,2),
  ADD COLUMN IF NOT EXISTS needs_review boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Migrate old text status to enum (if any rows exist with text status)
UPDATE public.evaluation_templates
  SET status_enum = CASE status
    WHEN 'draft' THEN 'draft'::assessment_status
    WHEN 'under_review' THEN 'under_review'::assessment_status
    WHEN 'confirmed' THEN 'confirmed'::assessment_status
    WHEN 'approved' THEN 'approved'::assessment_status
    ELSE 'draft'::assessment_status
  END
  WHERE status IS NOT NULL AND status_enum IS NULL;

-- ---------- ALTER: evaluation_questions ----------
ALTER TABLE public.evaluation_questions
  ADD COLUMN IF NOT EXISTS section_id uuid,
  ADD COLUMN IF NOT EXISTS text_en text,
  ADD COLUMN IF NOT EXISTS lo_code text,
  ADD COLUMN IF NOT EXISTS question_type public.question_type DEFAULT 'single_choice',
  ADD COLUMN IF NOT EXISTS is_required boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ---------- NEW: assessment_source_documents ----------
CREATE TABLE IF NOT EXISTS public.assessment_source_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id    uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  filename      text NOT NULL,
  file_path     text NOT NULL,
  file_type     text NOT NULL,  -- pdf, docx, xlsx
  faculty_folder text,
  extracted_text text,
  extraction_confidence numeric(3,2),
  parse_status  text DEFAULT 'pending',  -- pending, parsed, needs_manual, failed
  parsed_json   jsonb,
  uploaded_by   uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------- NEW: assessment_sections ----------
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

-- ---------- NEW: assessment_options ----------
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

-- Link evaluation_questions.section_id to assessment_sections
DO $$ BEGIN
  ALTER TABLE public.evaluation_questions
    ADD CONSTRAINT evaluation_questions_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.assessment_sections(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- NEW: assessment_versions (immutable snapshots) ----------
CREATE TABLE IF NOT EXISTS public.assessment_versions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  version_label text NOT NULL,  -- 1.0, 1.1, 2.0
  status        public.assessment_status NOT NULL DEFAULT 'confirmed',
  snapshot_json jsonb NOT NULL,  -- full canonical assessment JSON
  created_by    uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  confirmed_by  uuid,
  confirmed_at  timestamptz,
  approved_by   uuid,
  approved_at   timestamptz,
  change_summary text,
  UNIQUE(template_id, version_label)
);
CREATE INDEX IF NOT EXISTS idx_assessment_versions_template
  ON public.assessment_versions(template_id);

-- Link template.current_version_id to versions
DO $$ BEGIN
  ALTER TABLE public.evaluation_templates
    ADD CONSTRAINT evaluation_templates_current_version_id_fkey
    FOREIGN KEY (current_version_id) REFERENCES public.assessment_versions(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- NEW: assessment_reviews ----------
CREATE TABLE IF NOT EXISTS public.assessment_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  version_id    uuid REFERENCES public.assessment_versions(id) ON DELETE SET NULL,
  reviewer_id   uuid,
  action        public.review_action NOT NULL,
  comment       text,
  from_status   public.assessment_status,
  to_status     public.assessment_status,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_assessment_reviews_template
  ON public.assessment_reviews(template_id);

-- ---------- updated_at triggers ----------
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

-- ---------- Helper: can_edit_program(profile_uuid, program_uuid) ----------
CREATE OR REPLACE FUNCTION public.can_edit_program(p_profile uuid, p_program uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
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

-- Helper: get my profile id from auth.uid
CREATE OR REPLACE FUNCTION public.my_profile_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT id FROM public.profiles WHERE auth_id = auth.uid();
$$;

-- ---------- RLS Policies ----------

-- evaluation_templates
ALTER TABLE public.evaluation_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "et_admin_all" ON public.evaluation_templates;
CREATE POLICY "et_admin_all" ON public.evaluation_templates
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "et_editor_own_program" ON public.evaluation_templates;
CREATE POLICY "et_editor_own_program" ON public.evaluation_templates
  FOR ALL TO authenticated
  USING (
    public.can_edit_program(public.my_profile_id(), program_id)
  )
  WITH CHECK (
    public.can_edit_program(public.my_profile_id(), program_id)
  );

-- evaluation_questions (inherits via template)
ALTER TABLE public.evaluation_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "eq_through_template" ON public.evaluation_questions;
CREATE POLICY "eq_through_template" ON public.evaluation_questions
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = evaluation_questions.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = evaluation_questions.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  );

-- assessment_sections
ALTER TABLE public.assessment_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sec_through_template" ON public.assessment_sections;
CREATE POLICY "sec_through_template" ON public.assessment_sections
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = assessment_sections.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = assessment_sections.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  );

-- assessment_options
ALTER TABLE public.assessment_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "opt_through_question" ON public.assessment_options;
CREATE POLICY "opt_through_question" ON public.assessment_options
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.evaluation_questions q
      JOIN public.evaluation_templates t ON t.id = q.template_id
      WHERE q.id = assessment_options.question_id
        AND public.can_edit_program(public.my_profile_id(), t.program_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.evaluation_questions q
      JOIN public.evaluation_templates t ON t.id = q.template_id
      WHERE q.id = assessment_options.question_id
        AND public.can_edit_program(public.my_profile_id(), t.program_id)
    )
  );

-- assessment_source_documents
ALTER TABLE public.assessment_source_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "asd_admin_all" ON public.assessment_source_documents;
CREATE POLICY "asd_admin_all" ON public.assessment_source_documents
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "asd_editor_own_program" ON public.assessment_source_documents;
CREATE POLICY "asd_editor_own_program" ON public.assessment_source_documents
  FOR SELECT TO authenticated
  USING (
    public.can_edit_program(public.my_profile_id(), program_id)
  );

-- assessment_versions (read for those with program access; write admin only)
ALTER TABLE public.assessment_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "av_read_own_program" ON public.assessment_versions;
CREATE POLICY "av_read_own_program" ON public.assessment_versions
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = assessment_versions.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  );

DROP POLICY IF EXISTS "av_admin_write" ON public.assessment_versions;
CREATE POLICY "av_admin_write" ON public.assessment_versions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid() AND p.role = 'admin')
    OR
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = assessment_versions.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  );

-- assessment_reviews
ALTER TABLE public.assessment_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ar_read_own_program" ON public.assessment_reviews;
CREATE POLICY "ar_read_own_program" ON public.assessment_reviews
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = assessment_reviews.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  );

DROP POLICY IF EXISTS "ar_write_own_program" ON public.assessment_reviews;
CREATE POLICY "ar_write_own_program" ON public.assessment_reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.evaluation_templates t
            WHERE t.id = assessment_reviews.template_id
              AND public.can_edit_program(public.my_profile_id(), t.program_id))
  );

-- audit_logs: allow authenticated to insert, admin to read all
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "al_admin_all" ON public.audit_logs;
CREATE POLICY "al_admin_all" ON public.audit_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.auth_id = auth.uid())
  );

-- ---------- View: published_assessments (for external consumers) ----------
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
