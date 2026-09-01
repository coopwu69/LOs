CREATE TABLE IF NOT EXISTS public.evaluation_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_token uuid UNIQUE NOT NULL,
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE CASCADE,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_step integer NOT NULL DEFAULT 0 CHECK (current_step BETWEEN 0 AND 5),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_evaluation_drafts_program_template
  ON public.evaluation_drafts(program_id, template_id);

CREATE INDEX IF NOT EXISTS idx_evaluation_drafts_status_updated
  ON public.evaluation_drafts(status, updated_at);

CREATE TABLE IF NOT EXISTS public.evaluation_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE SET NULL,
  payload_json jsonb NOT NULL,
  lo_score integer,
  lo_count integer,
  lo_max integer,
  c_score integer,
  c_count integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evaluation_submissions_program_template
  ON public.evaluation_submissions(program_id, template_id);
