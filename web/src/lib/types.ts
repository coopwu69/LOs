// Type contract — agreed with the data agent. Do NOT change.
export type Domain = 'knowledge' | 'skills' | 'ethics' | 'character' | 'general';
export type ScaleStatus = 'standard_4' | 'legacy_5' | 'needs_descriptions';

export type OptionRow = {
  id: string;
  score: number;
  label_th: string;
  label_en?: string | null;
  description_th: string | null;
  description_en?: string | null;
  sequence: number;
};

export type QuestionRow = {
  id: string;
  lo_code: string | null;
  text: string;
  text_en: string | null;
  plo_refs: string[] | null;
  sequence: number;
  options: OptionRow[];
};

export type SectionRow = {
  id: string;
  domain_type: Domain;
  title_th: string;
  title_en?: string | null;
  part: number;
  sequence: number;
  questions: QuestionRow[];
};

export type PloRow = {
  id: string;
  code: string;
  domain_type: Domain;
  text: string;
  sequence: number;
};

export type ProgramRow = {
  id: string;
  code: string;
  name_th: string;
  name_en?: string | null;
  school: string | null;
  slug: string | null;
  revision_label: string | null;
  form_status: 'submitted' | 'pending';
};

export type TemplateDoc = {
  id: string;
  program: ProgramRow;
  title: string | null;
  course_codes: string[] | null;
  scale_status: ScaleStatus;
  source_layout: string | null;
  plos: PloRow[];
  sections: SectionRow[];
};

export type RevisionRow = {
  id: string;
  kind: 'import' | 'edit' | 'restore';
  note: string | null;
  created_at: string;
  // Q11: reviewer identity for 'edit' revisions (nullable for older rows and
  // 'restore' revisions which have no reviewer).
  reviewer_name?: string | null;
  reviewer_email?: string | null;
  reviewer_phone?: string | null;
  reviewer_confirmed?: boolean | null;
};
