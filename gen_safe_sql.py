# -*- coding: utf-8 -*-
"""Generate SQL to create draft templates from parsed documents.
Ensures no line exceeds 1900 chars to avoid read tool truncation."""
import json, os, re

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, '_parsed.json'), encoding='utf-8') as f:
    parsed = json.load(f)

def sql_str(s, max_chunk=600):
    """Convert a Python string to a SQL string literal, breaking long values into concatenated chunks.
    max_chunk is in CHARACTERS, but we ensure the resulting SQL line stays under 1900 bytes in UTF-8."""
    if not s:
        return "NULL"
    s = s.replace("'", "''")
    if len(s) <= max_chunk:
        return f"'{s}'"
    # Break into chunks at word boundaries
    chunks = []
    while s:
        if len(s) <= max_chunk:
            chunks.append(s)
            break
        # Find a space near the max_chunk boundary
        cut = max_chunk
        for i in range(max_chunk, max(0, max_chunk-100), -1):
            if s[i] == ' ':
                cut = i
                break
        chunks.append(s[:cut])
        s = s[cut:].lstrip()
    return " || ".join(f"'{c}'" for c in chunks)

sql_parts = []
template_count = 0

for r in parsed:
    if r['parse_status'] != 'parsed':
        continue
    assessment = r['assessment']
    sections = assessment.get('sections', [])
    if not sections:
        continue

    fname = r['filename'].replace("'", "''")
    title_th = (assessment.get('title_th') or '')[:200]
    title_en = (assessment.get('title_en') or '')[:200]
    conf = r['confidence']

    sql_parts.append("DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN")
    # Create template
    sql_parts.append(f"  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)")
    sql_parts.append(f"  SELECT sd.program_id, {sql_str(title_th)}, {sql_str(title_en) if title_en else 'NULL'}, 'draft', 'draft'::assessment_status, '0.1', sd.id, {conf}, true")
    sql_parts.append(f"  FROM public.assessment_source_documents sd WHERE sd.filename = '{fname}'")
    sql_parts.append(f"  RETURNING id INTO t_id;")
    sql_parts.append(f"  IF t_id IS NULL THEN RETURN; END IF;")

    for sec in sections:
        sec_title_th = sec['title_th'][:200]
        sec_title_en = sec.get('title_en') or ''
        domain = sec.get('domain_type', 'general')
        seq = sec.get('sequence', 0)
        sql_parts.append(f"  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)")
        sql_parts.append(f"  VALUES (t_id, {sql_str(sec_title_th)}, {sql_str(sec_title_en) if sec_title_en else 'NULL'}, '{domain}'::domain_type, {seq})")
        sql_parts.append(f"  RETURNING id INTO s_id;")

        for q in sec.get('questions', []):
            q_text = q['text_th'][:1500]
            q_text_en = q.get('text_en') or ''
            lo_code = q.get('lo_code') or ''
            q_type = q.get('question_type', 'single_choice')
            q_seq = q.get('sequence', 0)
            q_required = 'true' if q.get('required', True) else 'false'
            sql_parts.append(f"  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)")
            sql_parts.append(f"  VALUES (t_id, s_id, {sql_str(q_text)}, {sql_str(q_text_en) if q_text_en else 'NULL'}, {sql_str(lo_code) if lo_code else 'NULL'}, '{q_type}'::question_type, {q_required}, {q_seq})")
            sql_parts.append(f"  RETURNING id INTO q_id;")

            for opt in q.get('options', []):
                opt_label = opt['label_th'][:200]
                opt_label_en = opt.get('label_en') or ''
                opt_desc = (opt.get('description_th') or '')[:1500]
                opt_score = opt.get('score', 0)
                opt_seq = opt.get('sequence', 0)
                sql_parts.append(f"  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)")
                sql_parts.append(f"  VALUES (q_id, {sql_str(opt_label)}, {sql_str(opt_label_en) if opt_label_en else 'NULL'}, {sql_str(opt_desc) if opt_desc else 'NULL'}, {opt_score}, {opt_seq});")

    sql_parts.append("END $$;")
    sql_parts.append("")
    template_count += 1

sql = '\n'.join(sql_parts)
out = os.path.join(BASE, 'migrations', '003b_create_drafts_safe.sql')
with open(out, 'w', encoding='utf-8') as f:
    f.write(sql)

# Verify no line exceeds 1900 bytes in UTF-8
max_line_bytes = max(len(line.encode('utf-8')) for line in sql_parts)
max_line_chars = max(len(line) for line in sql_parts)
print(f"SQL written: {len(sql)} chars, {len(sql_parts)} lines, max line: {max_line_chars} chars / {max_line_bytes} bytes, {template_count} templates")
print(f"Output: {out}")
