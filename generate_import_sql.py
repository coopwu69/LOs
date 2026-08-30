# -*- coding: utf-8 -*-
"""Generate SQL to update parse_status and create draft templates from parsed documents."""
import json, os, re

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, '_parsed.json'), encoding='utf-8') as f:
    parsed = json.load(f)

# Build SQL to:
# 1. Update assessment_source_documents with parse_status and confidence
# 2. Create evaluation_templates (draft) for parsed documents
# 3. Create assessment_sections, evaluation_questions, assessment_options

sql_parts = []
sql_parts.append("-- Auto-generated: update parse status + create draft templates from parsed documents")
sql_parts.append("")

# Step 1: Update source documents
for r in parsed:
    fname = r['filename'].replace("'", "''")
    status = r['parse_status']
    conf = r['confidence']
    sql_parts.append(f"UPDATE public.assessment_source_documents SET parse_status = '{status}', extraction_confidence = {conf} WHERE filename = '{fname}';")

sql_parts.append("")
sql_parts.append("-- Step 2: Create draft templates for parsed documents (those with sections)")
sql_parts.append("-- We use a CTE to insert template and get its ID, then insert sections/questions/options")

# For each parsed document with sections, create a template + sections + questions + options
template_count = 0
for r in parsed:
    if r['parse_status'] != 'parsed':
        continue
    assessment = r['assessment']
    sections = assessment.get('sections', [])
    if not sections:
        continue
    has_questions = any(s.get('questions') for s in sections)
    if not has_questions:
        # Still create template with sections (PLOs/LOs only, no rubric questions)
        pass

    fname = r['filename'].replace("'", "''")
    title_th = (assessment.get('title_th') or '')[:200].replace("'", "''")
    title_en = (assessment.get('title_en') or '')[:200].replace("'", "''")
    conf = r['confidence']

    # Use a DO block to insert template + children
    sql_parts.append(f"DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN")
    sql_parts.append(f"  -- Create template")
    sql_parts.append(f"  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)")
    sql_parts.append(f"  SELECT sd.program_id, '{title_th}', NULLIF('{title_en}', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, {conf}, true")
    sql_parts.append(f"  FROM public.assessment_source_documents sd WHERE sd.filename = '{fname}'")
    sql_parts.append(f"  RETURNING id INTO t_id;")
    sql_parts.append(f"  IF t_id IS NULL THEN RETURN; END IF;")

    for sec in sections:
        sec_title_th = sec['title_th'][:200].replace("'", "''")
        sec_title_en = (sec.get('title_en') or '').replace("'", "''")
        domain = sec.get('domain_type', 'general')
        seq = sec.get('sequence', 0)
        sql_parts.append(f"  -- Section: {sec_title_th[:40]}")
        sql_parts.append(f"  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)")
        sql_parts.append(f"  VALUES (t_id, '{sec_title_th}', NULLIF('{sec_title_en}', ''), '{domain}'::domain_type, {seq})")
        sql_parts.append(f"  RETURNING id INTO s_id;")

        for q in sec.get('questions', []):
            q_text = q['text_th'][:2000].replace("'", "''")
            q_text_en = (q.get('text_en') or '').replace("'", "''")
            lo_code = (q.get('lo_code') or '').replace("'", "''")
            q_type = q.get('question_type', 'single_choice')
            q_seq = q.get('sequence', 0)
            q_required = 'true' if q.get('required', True) else 'false'
            sql_parts.append(f"  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)")
            sql_parts.append(f"  VALUES (t_id, s_id, '{q_text}', NULLIF('{q_text_en}', ''), NULLIF('{lo_code}', ''), '{q_type}'::question_type, {q_required}, {q_seq})")
            sql_parts.append(f"  RETURNING id INTO q_id;")

            for opt in q.get('options', []):
                opt_label = opt['label_th'][:200].replace("'", "''")
                opt_label_en = (opt.get('label_en') or '').replace("'", "''")
                opt_desc = (opt.get('description_th') or '')[:2000].replace("'", "''")
                opt_score = opt.get('score', 0)
                opt_seq = opt.get('sequence', 0)
                sql_parts.append(f"  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)")
                sql_parts.append(f"  VALUES (q_id, '{opt_label}', NULLIF('{opt_label_en}', ''), NULLIF('{opt_desc}', ''), {opt_score}, {opt_seq});")

    sql_parts.append(f"END $$;")
    sql_parts.append("")
    template_count += 1

sql_parts.append(f"-- Total templates created: {template_count}")

out = os.path.join(BASE, 'migrations', '003_create_draft_templates.sql')
with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_parts))
print(f"SQL written to {out} [{len(sql_parts)} lines, {template_count} templates]")
