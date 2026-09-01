ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS revision_label text,
  ADD COLUMN IF NOT EXISTS form_status text NOT NULL DEFAULT 'pending';

UPDATE public.programs p
SET form_status = 'submitted'
WHERE EXISTS (SELECT 1 FROM public.evaluation_templates t WHERE t.program_id = p.id)
  AND p.form_status = 'pending';

ALTER TABLE public.evaluation_templates
  ADD COLUMN IF NOT EXISTS course_codes jsonb,
  ADD COLUMN IF NOT EXISTS scale_status text NOT NULL DEFAULT 'needs_descriptions',
  ADD COLUMN IF NOT EXISTS source_layout text;

ALTER TABLE public.assessment_sections
  ADD COLUMN IF NOT EXISTS part integer NOT NULL DEFAULT 1;

ALTER TABLE public.evaluation_questions
  ADD COLUMN IF NOT EXISTS plo_refs jsonb;

CREATE TABLE IF NOT EXISTS public.template_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('import', 'edit', 'restore')),
  snapshot_json jsonb NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_template_revisions_template_created
  ON public.template_revisions(template_id, created_at DESC);
