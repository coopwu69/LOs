# -*- coding: utf-8 -*-
"""Generate SQL with Thai text encoded as hex to keep file ASCII-only.
This avoids read tool truncation on multi-byte UTF-8 lines."""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, '_parsed.json'), encoding='utf-8') as f:
    parsed = json.load(f)

def sql_str(s, max_hex=400):
    """Convert string to SQL literal with hex encoding for non-ASCII.
    Breaks long text into concatenated chunks, with each chunk on its own line."""
    if not s:
        return "NULL"
    has_non_ascii = any(ord(c) > 127 for c in s)
    s = s.replace("'", "''")
    if not has_non_ascii:
        if len(s) <= 1800:
            return f"'{s}'"
        chunks = []
        while s:
            chunks.append(f"'{s[:1800]}'")
            s = s[1800:]
        return ' || '.join(chunks)
    # For non-ASCII, encode as hex and break into chunks
    encoded = s.encode('utf-8')
    chunks = []
    while encoded:
        chunk = encoded[:max_hex // 2]
        hex_str = chunk.hex()
        chunks.append(f"convert_from(decode('{hex_str}', 'hex'), 'utf8')")
        encoded = encoded[len(chunk):]
    # Join with || but break across lines if too long
    result = ' || '.join(chunks)
    if len(result) <= 1800:
        return result
    # Break across lines: put each chunk on its own line
    return '\n    || '.join(chunks)

# Generate one SQL file per template (for individual application)
outdir = os.path.join(BASE, 'migrations', 'ascii_batches')
os.makedirs(outdir, exist_ok=True)

template_count = 0
for r in parsed:
    if r['parse_status'] != 'parsed':
        continue
    assessment = r['assessment']
    sections = assessment.get('sections', [])
    if not sections:
        continue

    fname = r['filename']
    title_th = (assessment.get('title_th') or '')[:200]
    title_en = (assessment.get('title_en') or '')[:200]
    conf = r['confidence']

    parts = []
    parts.append("DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN")
    parts.append(f"  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)")
    parts.append(f"  SELECT sd.program_id, {sql_str(title_th)}, {sql_str(title_en)}, 'draft', 'draft'::assessment_status, '0.1', sd.id, {conf}, true")
    parts.append(f"  FROM public.assessment_source_documents sd WHERE sd.filename = {sql_str(fname)}")
    parts.append(f"  RETURNING id INTO t_id;")
    parts.append(f"  IF t_id IS NULL THEN RETURN; END IF;")

    for sec in sections:
        sec_title_th = sec['title_th'][:200]
        sec_title_en = sec.get('title_en') or ''
        domain = sec.get('domain_type', 'general')
        seq = sec.get('sequence', 0)
        parts.append(f"  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)")
        parts.append(f"  VALUES (t_id, {sql_str(sec_title_th)}, {sql_str(sec_title_en)}, '{domain}'::domain_type, {seq})")
        parts.append(f"  RETURNING id INTO s_id;")

        for q in sec.get('questions', []):
            q_text = q['text_th'][:1500]
            q_text_en = q.get('text_en') or ''
            lo_code = q.get('lo_code') or ''
            q_type = q.get('question_type', 'single_choice')
            q_seq = q.get('sequence', 0)
            q_required = 'true' if q.get('required', True) else 'false'
            parts.append(f"  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)")
            parts.append(f"  VALUES (t_id, s_id, {sql_str(q_text)}, {sql_str(q_text_en)}, {sql_str(lo_code)}, '{q_type}'::question_type, {q_required}, {q_seq})")
            parts.append(f"  RETURNING id INTO q_id;")

            for opt in q.get('options', []):
                opt_label = opt['label_th'][:200]
                opt_label_en = opt.get('label_en') or ''
                opt_desc = (opt.get('description_th') or '')[:1500]
                opt_score = opt.get('score', 0)
                opt_seq = opt.get('sequence', 0)
                parts.append(f"  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)")
                parts.append(f"  VALUES (q_id, {sql_str(opt_label)}, {sql_str(opt_label_en)}, {sql_str(opt_desc)}, {opt_score}, {opt_seq});")

    parts.append("END $$;")

    sql = '\n'.join(parts)
    template_count += 1
    out = os.path.join(outdir, f'template_{template_count:02d}.sql')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(sql)

    # Check max line length in the actual file (split on newlines)
    actual_lines = sql.split('\n')
    max_chars = max(len(line) for line in actual_lines)
    max_bytes = max(len(line.encode('utf-8')) for line in actual_lines)
    print(f'Template {template_count:02d}: {len(sql)} chars, max line {max_chars} chars / {max_bytes} bytes -> {out}')

print(f'\nTotal templates: {template_count}')
