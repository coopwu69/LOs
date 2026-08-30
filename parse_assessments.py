# -*- coding: utf-8 -*-
"""
Parse extracted text from source documents into canonical assessment JSON.

Input:  _extracted.json  { "folder\\filename": "extracted_text", ... }
Output: _parsed.json     [ { filename, program_code, confidence, assessment, ... }, ... ]

Canonical assessment structure:
{
  "title_th": str, "title_en": str,
  "plos": [ { code, domain, text_th, text_en } ],
  "los": [ { code, domain, text_th, text_en } ],
  "sections": [
    {
      "title_th": str, "title_en": str, "domain_type": str, "sequence": int,
      "questions": [
        {
          "lo_code": str, "text_th": str, "text_en": str,
          "question_type": "single_choice", "required": True, "sequence": int,
          "options": [
            { "label_th": str, "label_en": str, "description_th": str, "score": int, "sequence": int }
          ]
        }
      ]
    }
  ]
}
"""
import json, os, re, sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.stdout.reconfigure(encoding='utf-8')

# ---------- Domain patterns ----------
DOMAIN_PATTERNS = [
    ('knowledge', [r'ด้านความรู้', r'Knowledge', r'ความรู้\s*\(K']),
    ('skills', [r'ด้านทักษะ', r'Skills', r'ทักษะ\s*\(S']),
    ('ethics', [r'ด้านจริยธรรม', r'Ethics', r'จริยธรรม\s*\(E']),
    ('character', [r'ด้านลักษณะส่วนบุคคล', r'ด้านลักษณะบุคคล', r'Character', r'ลักษณะ\s*\(C']),
    ('knowledge_skills', [r'ความรู้และทักษะ', r'Knowledge and Skills']),
    ('social_skills', [r'ทักษะทางสังคม', r'Social Skills']),
]

def detect_domain(text):
    for domain, patterns in DOMAIN_PATTERNS:
        for p in patterns:
            if re.search(p, text):
                return domain
    return 'general'

# ---------- Rubric level patterns ----------
# Pattern: "ดีเยี่ยม (5 คะแนน)" or "ระดับดีเยี่ยม (description)" or "5 (ยอดเยี่ยม): desc"
RUBRIC_LEVELS = [
    ('ดีเยี่ยม', 'Excellent', 5),
    ('ยอดเยี่ยม', 'Excellent', 5),
    ('ดีมาก', 'Very Good', 4),
    ('ดี', 'Good', 3),
    ('พอใช้', 'Fair', 2),
    ('ปานกลาง', 'Moderate', 2),
    ('ควรปรับปรุง', 'Needs Improvement', 1),
    ('ต้องปรับปรุง', 'Needs Improvement', 1),
]

LEVEL_SCORE_MAP = {
    'ดีเยี่ยม': 5, 'ยอดเยี่ยม': 5,
    'ดีมาก': 4,
    'ดี': 3,
    'พอใช้': 2, 'ปานกลาง': 2,
    'ควรปรับปรุง': 1, 'ต้องปรับปรุง': 1,
}

LEVEL_EN_MAP = {
    'ดีเยี่ยม': 'Excellent', 'ยอดเยี่ยม': 'Excellent',
    'ดีมาก': 'Very Good',
    'ดี': 'Good',
    'พอใช้': 'Fair', 'ปานกลาง': 'Moderate',
    'ควรปรับปรุง': 'Needs Improvement', 'ต้องปรับปรุง': 'Needs Improvement',
}

def parse_rubric_option(line):
    """Parse a rubric level line. Returns (label_th, label_en, score, description) or None."""
    line = line.strip()
    if not line:
        return None

    # Pattern 1: "ดีเยี่ยม (5 คะแนน)" — score in parens
    m = re.match(r'^(ระดับ)?\s*(ดีเยี่ยม|ยอดเยี่ยม|ดีมาก|ดี|พอใช้|ปานกลาง|ควรปรับปรุง|ต้องปรับปรุง)\s*\((\d+)\s*คะแนน\)\s*(.*)$', line)
    if m:
        label = m.group(2)
        score = int(m.group(3))
        desc = m.group(4).strip()
        return (label, LEVEL_EN_MAP.get(label, ''), score, desc)

    # Pattern 2: "ระดับดีเยี่ยม (description)" — no score, description in parens
    m = re.match(r'^ระดับ(ดีเยี่ยม|ยอดเยี่ยม|ดีมาก|ดี|พอใช้|ปานกลาง|ควรปรับปรุง|ต้องปรับปรุง)\s*\((.+)\)\s*$', line)
    if m:
        label = m.group(1)
        desc = m.group(2).strip()
        return (label, LEVEL_EN_MAP.get(label, ''), LEVEL_SCORE_MAP.get(label, 0), desc)

    # Pattern 3: "5 (ยอดเยี่ยม): description" or "5 (ยอดเยี่ยม)"
    m = re.match(r'^(\d)\s*\(([^)]+)\)[:\s]*(.*)$', line)
    if m:
        score = int(m.group(1))
        label = m.group(2).strip()
        desc = m.group(3).strip()
        return (label, '', score, desc)

    # Pattern 4: Just the level name followed by description on same line
    for level in ['ดีเยี่ยม', 'ยอดเยี่ยม', 'ดีมาก', 'พอใช้', 'ปานกลาง', 'ควรปรับปรุง', 'ต้องปรับปรุง']:
        if line == level or line.startswith(level + ' ') or line.startswith(level + '\t'):
            rest = line[len(level):].strip()
            return (level, LEVEL_EN_MAP.get(level, ''), LEVEL_SCORE_MAP.get(level, 0), rest)
    # "ดี" is tricky — only match if standalone or followed by space/tab, not part of "ดีเยี่ยม"/"ดีมาก"
    if line == 'ดี' or (line.startswith('ดี ') and not line.startswith('ดีเยี่ยม') and not line.startswith('ดีมาก')):
        rest = line[2:].strip()
        return ('ดี', 'Good', 3, rest)

    return None

# ---------- PLO/LO extraction ----------
def extract_plos_los(text):
    """Extract PLOs and LOs from text."""
    plos = []
    los = []
    lines = text.split('\n')
    current_domain = 'general'
    current_section = None  # 'plo' or 'lo'

    for i, line in enumerate(lines):
        line_s = line.strip()
        if not line_s:
            continue

        # Detect domain headers
        new_domain = detect_domain(line_s)
        if new_domain != 'general' and len(line_s) < 80:
            current_domain = new_domain

        # Detect PLO items: "PLO1 text...", "PLO 1 text..."
        m = re.match(r'^PLO\s*(\d+)\s+(.+)', line_s)
        if m:
            plos.append({
                'code': f'PLO{m.group(1)}',
                'domain': current_domain,
                'text_th': m.group(2).strip(),
                'text_en': ''
            })
            current_section = 'plo'
            continue

        # Detect LO items: "LO 1 text...", "LO1 text..."
        m = re.match(r'^LO\s*(\d+)\s+(.+)', line_s)
        if m:
            los.append({
                'code': f'LO{m.group(1)}',
                'domain': current_domain,
                'text_th': m.group(2).strip(),
                'text_en': ''
            })
            current_section = 'lo'
            continue

        # Continuation: if previous was PLO/LO and this line doesn't start with PLO/LO/number/domain
        # it might be the English translation or continuation
        if current_section == 'plo' and plos:
            if not re.match(r'^(PLO|LO|ด้าน|\d+[.)])', line_s) and len(line_s) > 10:
                # Check if it looks like English (ASCII-heavy)
                ascii_ratio = sum(1 for c in line_s if ord(c) < 128) / len(line_s)
                if ascii_ratio > 0.7 and not plos[-1]['text_en']:
                    plos[-1]['text_en'] = line_s
                else:
                    plos[-1]['text_th'] += ' ' + line_s
        elif current_section == 'lo' and los:
            if not re.match(r'^(PLO|LO|ด้าน|\d+[.)]|ตอนที่|แบบประเมิน)', line_s) and len(line_s) > 10:
                ascii_ratio = sum(1 for c in line_s if ord(c) < 128) / len(line_s)
                if ascii_ratio > 0.7 and not los[-1]['text_en']:
                    los[-1]['text_en'] = line_s
                elif ascii_ratio <= 0.7:
                    los[-1]['text_th'] += ' ' + line_s

    return plos, los

# ---------- Assessment form extraction ----------
def extract_assessment_form(text):
    """Extract sections, questions, and options from the assessment form part."""
    # Find where the assessment form starts
    form_start_patterns = [
        r'แบบประเมินผลการปฏิบัติ',
        r'แบบประเมินสหกิจ',
        r'แบบประเมินรายวิชาสหกิจ',
        r'ตอนที่\s*1',
        r'Part\s*1',
    ]
    form_start = len(text)
    for p in form_start_patterns:
        m = re.search(p, text)
        if m and m.start() < form_start:
            form_start = m.start()

    form_text = text[form_start:]
    if not form_text.strip():
        return [], 0.0

    sections = []
    confidence = 0.5  # base confidence

    # Split by "ตอนที่" (Part) markers
    part_splits = re.split(r'(ตอนที่\s*\d+[^|\n]{0,100})', form_text)
    parts = []
    if len(part_splits) > 1:
        current_part_title = ''
        for chunk in part_splits:
            chunk = chunk.strip()
            if not chunk:
                continue
            if re.match(r'ตอนที่\s*\d+', chunk):
                current_part_title = chunk
            elif current_part_title:
                parts.append((current_part_title, chunk))
                current_part_title = ''
            else:
                parts.append(('', chunk))
    else:
        parts = [('', form_text)]

    seq_section = 0
    for part_title, part_text in parts:
        # Within each part, split by domain headers
        domain_splits = re.split(r'(ด้านความรู้\s*\(Knowledge\)|ด้านทักษะ\s*\(Skills\)|ด้านจริยธรรม\s*\(Ethics\)|ด้านลักษณะส่วนบุคคล|ด้านลักษณะบุคคล|ด้านความรู้|ด้านทักษะ|ด้านจริยธรรม)', part_text)

        chunks = []
        current_domain_header = ''
        for chunk in domain_splits:
            chunk = chunk.strip()
            if not chunk:
                continue
            if re.match(r'ด้าน', chunk) and len(chunk) < 50:
                current_domain_header = chunk
            elif current_domain_header:
                chunks.append((current_domain_header, chunk))
                current_domain_header = ''
            else:
                chunks.append(('', chunk))

        for domain_header, chunk_text in chunks:
            domain = detect_domain(domain_header) if domain_header else detect_domain(part_title)
            if domain == 'general':
                domain = detect_domain(part_title)

            # Parse questions within this chunk
            questions = parse_questions(chunk_text)
            if questions:
                seq_section += 1
                section_title = domain_header if domain_header else part_title
                if not section_title:
                    section_title = f'Section {seq_section}'
                sections.append({
                    'title_th': section_title,
                    'title_en': '',
                    'domain_type': domain,
                    'sequence': seq_section,
                    'questions': questions
                })
                confidence = min(1.0, confidence + 0.1)

    if not sections:
        # Fallback: try parsing the whole form as one section
        questions = parse_questions(form_text)
        if questions:
            sections.append({
                'title_th': 'แบบประเมิน',
                'title_en': '',
                'domain_type': 'general',
                'sequence': 1,
                'questions': questions
            })
            confidence = 0.4

    return sections, confidence

def parse_table_rating_questions(text):
    """Parse table-format rating scale questions: '1.question | | | | |' with header '| 1 | 2 | 3 | 4 | 5'."""
    questions = []
    lines = text.split('\n')

    # Find rating header line: contains | 1 | 2 | 3 | 4 | 5 or similar
    rating_header = None
    rating_scores = []
    for line in lines:
        line_s = line.strip()
        if '|' in line_s:
            cells = [c.strip() for c in line_s.split('|')]
            # Check if cells look like rating numbers
            nums = []
            for c in cells:
                if re.match(r'^\d+$', c):
                    nums.append(int(c))
            if len(nums) >= 3:
                rating_header = line_s
                rating_scores = nums
                break

    if not rating_header:
        return questions

    # Parse question rows
    seq = 0
    for line in lines:
        line_s = line.strip()
        if not line_s or line_s == rating_header:
            continue
        if '|' not in line_s:
            continue
        cells = [c.strip() for c in line_s.split('|')]
        if len(cells) < 2:
            continue
        first_cell = cells[0]
        # Match "1. question text" or "LO1 question text"
        q_match = re.match(r'^(LO\s*\d+|PLO\s*\d+|\d+[.)])\s*(.+)', first_cell)
        if q_match:
            seq += 1
            lo_code = ''
            if q_match.group(1).startswith('LO') or q_match.group(1).startswith('PLO'):
                lo_code = re.sub(r'\s+', '', q_match.group(1))
            q_text = q_match.group(2).strip()
            # Build options from rating scores
            options = []
            for i, score in enumerate(rating_scores):
                options.append({
                    'label_th': str(score),
                    'label_en': str(score),
                    'description_th': '',
                    'score': score,
                    'sequence': i + 1
                })
            questions.append({
                'lo_code': lo_code,
                'text_th': q_text,
                'text_en': '',
                'question_type': 'rating_scale',
                'required': True,
                'sequence': seq,
                'options': options
            })

    return questions


def parse_questions(text):
    """Parse numbered questions and their rubric options from text."""
    # First try table-format rating scale
    table_qs = parse_table_rating_questions(text)
    if table_qs:
        return table_qs

    # Pre-process: split lines on checkbox character \uf06f and other checkbox-like chars
    # \uf06f is a Wingdings checkbox, also handle ○ ●  etc.
    checkbox_chars = '\uf06f\uf0a8\uf0a7○●☐'
    processed_lines = []
    for line in text.split('\n'):
        # Split on checkbox chars, keeping them as line prefixes
        parts = re.split(f'([{checkbox_chars}])', line)
        if len(parts) > 1:
            # First part is before any checkbox — might be question text
            first = parts[0].strip()
            if first:
                processed_lines.append(first)
            # Remaining parts: checkbox + following text
            for i in range(1, len(parts), 2):
                if i + 1 < len(parts):
                    processed_lines.append(parts[i] + parts[i+1].strip())
                else:
                    processed_lines.append(parts[i])
        else:
            processed_lines.append(line)

    questions = []
    lines = processed_lines
    current_q = None
    current_options = []
    current_desc_lines = []
    seq = 0

    def flush_options():
        nonlocal current_options, current_desc_lines
        if current_q and current_options:
            # Attach last description to last option
            if current_desc_lines and current_options:
                current_options[-1]['description_th'] = (current_options[-1]['description_th'] + ' ' + ' '.join(current_desc_lines)).strip()
            current_q['options'] = current_options
        current_options = []
        current_desc_lines = []

    def flush_question():
        nonlocal current_q
        flush_options()
        if current_q:
            if not current_q.get('options'):
                current_q['options'] = []
            questions.append(current_q)
        current_q = None

    for line in lines:
        line_s = line.strip()
        # Remove leading checkbox chars
        line_s = re.sub(f'^[{checkbox_chars}]+', '', line_s).strip()
        if not line_s:
            if current_options:
                current_desc_lines = []
            continue

        # Skip table markers and headers
        if line_s.startswith('[TABLE') or line_s.startswith('[SHEET') or line_s == 'ผลลัพธ์การเรียนรู้ที่คาดหวัง | ผลการประเมิน':
            continue

        # Check if this is a rubric option line
        opt = parse_rubric_option(line_s)
        if opt:
            label_th, label_en, score, desc = opt
            # Flush previous option's description
            if current_desc_lines and current_options:
                current_options[-1]['description_th'] = (current_options[-1]['description_th'] + ' ' + ' '.join(current_desc_lines)).strip()
            current_desc_lines = []
            current_options.append({
                'label_th': label_th,
                'label_en': label_en,
                'description_th': desc,
                'score': score,
                'sequence': len(current_options) + 1
            })
            continue

        # Check if this is a new question: "1. text", "LO 1 text", "LO1 text"
        q_match = re.match(r'^(LO\s*\d+|PLO\s*\d+|\d+[.)])\s*(.+)', line_s)
        if q_match and not opt:
            # Flush previous question
            flush_question()
            seq += 1
            q_code = q_match.group(1)
            q_text = q_match.group(2).strip()
            # Determine lo_code
            lo_code = ''
            if q_match.group(1).startswith('LO'):
                lo_code = re.sub(r'\s+', '', q_match.group(1))
            elif q_match.group(1).startswith('PLO'):
                lo_code = re.sub(r'\s+', '', q_match.group(1))
            current_q = {
                'lo_code': lo_code,
                'text_th': q_text,
                'text_en': '',
                'question_type': 'single_choice',
                'required': True,
                'sequence': seq
            }
            continue

        # If we have a current option, this line is probably the description
        if current_options and not q_match:
            # Skip lines that look like domain headers or part headers
            if re.match(r'ด้าน|ตอนที่|Part', line_s):
                continue
            # Skip pipe-delimited table rows
            if '|' in line_s and line_s.count('|') > 2:
                continue
            current_desc_lines.append(line_s)
            continue

        # If we have a current question but no options yet, this might be continuation of question text
        if current_q and not current_options:
            if not re.match(r'ด้าน|ตอนที่|Part|PLO|LO|\d+[.)]', line_s):
                current_q['text_th'] += ' ' + line_s
            continue

    flush_question()
    return questions

# ---------- Main parser ----------
def parse_document(filename, text):
    """Parse a single document into canonical assessment JSON."""
    result = {
        'filename': filename,
        'confidence': 0.0,
        'parse_status': 'pending',
        'assessment': None,
        'errors': []
    }

    if not text or len(text.strip()) < 50:
        result['parse_status'] = 'failed'
        result['errors'].append('Text too short or empty')
        return result

    # XLSX files are PLO mapping matrices — not rubric assessments
    if filename.endswith('.xlsx'):
        result['parse_status'] = 'needs_manual'
        result['confidence'] = 0.1
        result['errors'].append('XLSX PLO mapping matrix — needs manual structuring')
        result['assessment'] = {
            'title_th': '',
            'title_en': '',
            'plos': [],
            'los': [],
            'sections': [],
            'note': 'PLO mapping matrix — not a rubric assessment form'
        }
        return result

    # Extract PLOs and LOs
    plos, los = extract_plos_los(text)

    # Extract assessment form
    sections, form_confidence = extract_assessment_form(text)

    # Calculate overall confidence
    confidence = 0.3  # base
    if plos:
        confidence += 0.2
    if los:
        confidence += 0.2
    if sections:
        confidence += form_confidence * 0.3
        total_questions = sum(len(s['questions']) for s in sections)
        total_options = sum(len(q['options']) for s in sections for q in s['questions'])
        if total_questions > 0:
            confidence += min(0.2, total_questions * 0.02)
        if total_options > 0:
            confidence += min(0.1, total_options * 0.005)

    confidence = min(1.0, confidence)

    # Determine parse status
    if sections and total_questions > 0:
        result['parse_status'] = 'parsed'
    elif plos or los:
        result['parse_status'] = 'needs_manual'
        result['errors'].append('PLOs/LOs found but no assessment form questions detected')
    else:
        result['parse_status'] = 'needs_manual'
        result['errors'].append('No PLOs, LOs, or assessment form detected')

    # Extract title (first non-empty line that's not a PLO/LO)
    title_th = ''
    title_en = ''
    for line in text.split('\n'):
        line_s = line.strip()
        if line_s and not re.match(r'^(PLO|LO|ด้าน|\d+[.)]|ตอนที่|แบบประเมิน|ผลลัพธ์การเรียนรู้|Part|\[)', line_s):
            if not title_th:
                title_th = line_s
            elif not title_en and sum(1 for c in line_s if ord(c) < 128) / max(len(line_s), 1) > 0.7:
                title_en = line_s
                break

    result['confidence'] = round(confidence, 2)
    result['assessment'] = {
        'title_th': title_th,
        'title_en': title_en,
        'plos': plos,
        'los': los,
        'sections': sections
    }

    return result

def main():
    with open(os.path.join(BASE, '_extracted.json'), encoding='utf-8') as f:
        raw = json.load(f)

    results = []
    for relpath, text in raw.items():
        parts = relpath.split('\\', 1)
        if len(parts) < 2:
            continue
        folder, fname = parts
        if 'ยังไม่ได้ส่ง' in fname:
            continue
        print(f"Parsing: {fname[:60]}...", end=' ')
        result = parse_document(fname, text)
        result['file_path'] = relpath.replace('\\', '/')
        result['faculty_folder'] = folder
        n_sec = len(result['assessment']['sections']) if result['assessment'] else 0
        n_q = sum(len(s['questions']) for s in result['assessment']['sections']) if result['assessment'] else 0
        n_opt = sum(len(q['options']) for s in result['assessment']['sections'] for q in s['questions']) if result['assessment'] else 0
        print(f"[{result['parse_status']}] conf={result['confidence']} sections={n_sec} Q={n_opt} opts={n_opt}")
        results.append(result)

    out = os.path.join(BASE, '_parsed.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {len(results)} results to {out}")

    # Summary
    parsed = sum(1 for r in results if r['parse_status'] == 'parsed')
    needs_manual = sum(1 for r in results if r['parse_status'] == 'needs_manual')
    failed = sum(1 for r in results if r['parse_status'] == 'failed')
    avg_conf = sum(r['confidence'] for r in results) / len(results) if results else 0
    print(f"Summary: parsed={parsed}, needs_manual={needs_manual}, failed={failed}, avg_conf={avg_conf:.2f}")

if __name__ == '__main__':
    main()
