CREATE TABLE IF NOT EXISTS public.advisor_drafts (
  draft_token uuid PRIMARY KEY,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE SET NULL,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_step integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  locale text NOT NULL DEFAULT 'th',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_advisor_drafts_program_created
  ON public.advisor_drafts(program_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.advisor_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  template_id uuid REFERENCES public.evaluation_templates(id) ON DELETE SET NULL,
  payload_json jsonb NOT NULL,
  locale text NOT NULL DEFAULT 'th',
  lo_score int,
  lo_count int,
  lo_max int,
  other_score int,
  other_count int,
  center_score int,
  center_count int,
  report_score int,
  report_count int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_submissions_program_created
  ON public.advisor_submissions(program_id, created_at DESC);
