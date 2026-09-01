// Type contract — agreed with the data agent. Do NOT change.
export type Domain = 'knowledge' | 'skills' | 'ethics' | 'character' | 'general';
export type ScaleStatus = 'standard_4' | 'legacy_5' | 'needs_descriptions';

export type OptionRow = {
  id: string;
  score: number;
  label_th: string;
  description_th: string | null;
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
};
