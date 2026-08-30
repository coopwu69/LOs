# -*- coding: utf-8 -*-
"""Build a 3-level web app: Faculty -> Curriculum -> Evaluation Form."""
import os, json, re, html

BASE = os.getcwd()

with open(os.path.join(BASE, '_extracted.json'), encoding='utf-8') as f:
    RAW = json.load(f)

# ---- Map files to faculty -> [curricula] ----
# Skip the summary docx and .claude
SKIP = ['หลักสูตรที่ยังไม่ได้ส่งแบบประเมิน']

def clean_curriculum_name(fname):
    """Derive a readable curriculum name from file name."""
    base = os.path.splitext(fname)[0]
    # remove leading numbers like "1." "2." "3."
    base = re.sub(r'^\d+\.\s*', '', base)
    # common substitutions
    base = base.replace('ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา', 'สหกิจศึกษา')
    base = base.replace('ผลลัพธ์การเรียนรู้ของหลักสูตร', 'หลักสูตร')
    base = base.replace('LOs Coop Ed_English_8 Dec 2024', 'หลักสูตรภาษาอังกฤษ')
    base = base.replace('LOs-ของรายวิชาสหกิจศึกษา-67-ไทยเพื่อการสื่อสาร', 'หลักสูตรภาษาไทยเพื่อการสื่อสาร')
    base = base.replace('ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร', 'หลักสูตร')
    base = base.replace('LO สหกิจหลักสูตร', 'หลักสูตร')
    base = base.replace('LO และแบบสอบถาม - ', '')
    base = base.replace('แบบประเมินสหกิจฯ สาขา', 'หลักสูตร')
    base = base.replace('แบบประเมินสหกิจ หลักสูตร', 'หลักสูตร')
    base = base.replace('แบบประเมินสหกิจหลักสูตร', 'หลักสูตร')
    base = base.replace('แบบประเมินรายวิชาสหกิจศึกษาตาม LO ', '')
    base = base.replace('แบบประเมินสหกิจศึกษาที่สอดคล้องกับ LOs รายวิชาสหกิจศึกษา', 'หลักสูตร')
    base = base.replace('หัวข้อประเมินตาม PLOs ', '')
    base = base.replace('PLOs-', 'PLOs ')
    base = base.replace('_ส่ง', '')
    base = base.replace('(updated 30 Jan 2025)', '')
    base = base.replace('(หลักสูตรปรับปรุง พ.ศ. 2565) (1)', '(หลักสูตรปรับปรุง พ.ศ. 2565)')
    base = base.replace('(หลักสูตรปรับปรุง-2567)', '(หลักสูตรปรับปรุง พ.ศ. 2567)')
    base = base.replace('(ปรับปรุง-2567)', '(ปรับปรุง พ.ศ. 2567)')
    base = base.replace('พ.ศ.67', 'พ.ศ. 2567')
    base = base.replace('พ.ศ.2567', 'พ.ศ. 2567')
    base = base.replace('ปีการศึกษา ๒๕๖๗', 'พ.ศ. 2567')
    base = base.replace('ปรังปรุง', 'ปรับปรุง')
    base = base.replace('_CLO_สหกิจศึกษา_JR310', '')
    base = base.replace('  ', ' ')
    base = base.strip(' -_')
    return base

def clean_faculty_name(folder):
    """Clean faculty folder name."""
    # remove leading "N. " or "N."
    f = re.sub(r'^\d+\.\s*', '', folder)
    f = f.replace('สำนักวิชา', 'สำนักวิชา').replace('สำนัก', 'สำนักวิชา') if not f.startswith('สำนัก') else f
    # remove trailing count
    f = re.sub(r'\s+\d+\s*หลักสูตร\s*$', '', f)
    f = re.sub(r'\s+ว\.นานาชาติ1', ' นานาชาติ', f)
    f = f.replace('ว.นานาชาติ', 'นานาชาติ')
    f = f.strip()
    return f

# Build structure
faculties = {}  # faculty_name -> { 'curricula': { cur_name: { 'file': relpath, 'text': text, 'ext': ext } } }
for relpath, text in RAW.items():
    parts = relpath.split('\\', 1)
    if len(parts) < 2:
        continue
    folder, fname = parts
    if any(s in fname for s in SKIP):
        continue
    fac = clean_faculty_name(folder)
    cur = clean_curriculum_name(fname)
    ext = os.path.splitext(fname)[1].lower().lstrip('.')
    faculties.setdefault(fac, {})
    # handle duplicate curriculum names by appending ext hint
    base_key = cur
    n = 2
    while base_key in faculties[fac]:
        base_key = f"{cur} ({n})"
        n += 1
    faculties[fac][base_key] = {'file': relpath, 'text': text, 'ext': ext}

# Sort faculties by original folder order (extract number)
def fac_sort_key(name):
    # find original folder
    for folder in sorted(os.listdir(BASE)):
        fp = os.path.join(BASE, folder)
        if os.path.isdir(fp) and '.claude' not in folder:
            if clean_faculty_name(folder) == name:
                m = re.match(r'(\d+)', folder)
                return int(m.group(1)) if m else 999
    return 999

faculty_order = sorted(faculties.keys(), key=fac_sort_key)

# ---- Text -> HTML rendering ----
def text_to_html(text, ext):
    """Convert extracted text to readable HTML, preserving structure."""
    if ext == 'xlsx':
        return xlsx_to_html(text)
    # Normalize: fix common PDF extraction artifacts (broken Thai words with spaces)
    t = text
    # Fix split "ำ" (sara am): consonant + space + "า" -> consonant + "ำ"
    # Common PDF artifact: "ก าลัง" -> "กำลัง", "ด าเนิน" -> "ดำเนิน", "น า" -> "นำ"
    t = re.sub(r'([ก-ฮ]) า', r'\1ำ', t)
    # Fix split "ำ" at line breaks too (consonant at end of line, า at start of next)
    t = re.sub(r'([ก-ฮ])\nา', r'\1ำ\n', t)
    # Collapse multiple blank lines
    t = re.sub(r'\n{3,}', '\n\n', t)
    lines = t.split('\n')
    out = []
    i = 0
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal in_table, table_rows
        if table_rows:
            out.append('<div class="rubric-table-wrap"><table class="rubric-table">')
            for r in table_rows:
                out.append(r)
            out.append('</table></div>')
        in_table = False
        table_rows = []

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            if in_table:
                flush_table()
            out.append('')
            continue
        s = line.strip()
        # Detect headings
        if re.match(r'^(ผลลัพธ์การเรียนรู้ของหลักสูตร|Program Learning Outcomes)', s) or s.startswith('PLOs') and len(s) < 60:
            if in_table: flush_table()
            out.append(f'<h2 class="section-title">{html.escape(s)}</h2>')
            continue
        if re.match(r'^(ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา|Learning Outcome|LOs)', s) or 'แบบประเมิน' in s and len(s) < 80:
            if in_table: flush_table()
            out.append(f'<h2 class="section-title">{html.escape(s)}</h2>')
            continue
        # Domain headers: 1) ด้านความรู้ (Knowledge) etc.
        if re.match(r'^\d+\)\s*ด้าน', s) or re.match(r'^\(\d+\)\s*ด้าน', s) or re.match(r'^ด้าน(ความรู้|ทักษะ|จริยธรรม|ลักษณะบุคคล)', s):
            if in_table: flush_table()
            out.append(f'<h3 class="domain-title">{html.escape(s)}</h3>')
            continue
        # "ตอนที่ 1" section markers
        if re.match(r'^ตอนที่\s*\d+', s):
            if in_table: flush_table()
            out.append(f'<h3 class="domain-title">{html.escape(s)}</h3>')
            continue
        # PLO/LO items: "PLO1 ..." or "LO1: ..." or "LO1 ..."
        m = re.match(r'^(PLO\d+|LO\d+)\s*:?\s*(.*)', s)
        if m:
            if in_table: flush_table()
            code = m.group(1)
            desc = m.group(2)
            out.append(f'<div class="lo-item"><span class="lo-code">{html.escape(code)}</span> <span class="lo-desc">{html.escape(desc)}</span></div>')
            continue
        # Rubric level lines: "ระดับดีมาก (...)" or "5 (ยอดเยี่ยม): ..." or "4 (ดีมาก): ..."
        if re.match(r'^ระดับ(ดีมาก|ดี|พอใช้|ควรปรับปรุง|ปานกลาง)', s) or re.match(r'^[1-5]\s*\(', s) or re.match(r'^[1-5]\s*\(ยอดเยี่ยม|ดีมาก|ดี|พอใช้|ต้องปรับปรุง', s):
            # rubric level description
            cls = 'rubric-level'
            out.append(f'<div class="{cls}">{html.escape(s)}</div>')
            continue
        # Numbered evaluation items: "1. ประยุกต์..." (in rubric section)
        if re.match(r'^\d+\.\s+', s) and len(s) > 20:
            if in_table: flush_table()
            out.append(f'<div class="eval-item">{html.escape(s)}</div>')
            continue
        # TABLE marker from docx
        if s.startswith('[TABLE'):
            if in_table: flush_table()
            out.append(f'<h4 class="table-marker">{html.escape(s)}</h4>')
            in_table = True
            table_rows = []
            continue
        if s.startswith('[SHEET:'):
            if in_table: flush_table()
            out.append(f'<h3 class="domain-title">{html.escape(s)}</h3>')
            continue
        # Table row (from docx tables): contains " | "
        if ' | ' in s and in_table:
            cells = [c.strip() for c in s.split(' | ')]
            cells_html = ''.join(f'<td>{html.escape(c)}</td>' for c in cells if c != '')
            if cells_html:
                table_rows.append(f'<tr>{cells_html}</tr>')
            continue
        # Generic paragraph
        if in_table:
            flush_table()
        out.append(f'<p>{html.escape(s)}</p>')

    if in_table:
        flush_table()
    return '\n'.join(out)

def xlsx_to_html(text):
    """Render xlsx content: split by sheets, render tables."""
    text = re.sub(r'([ก-ฮ]) า', r'\1ำ', text)
    lines = text.split('\n')
    out = []
    current_sheet = None
    rows = []
    def flush():
        nonlocal rows
        if rows:
            out.append('<div class="rubric-table-wrap"><table class="rubric-table xlsx-table">')
            for r in rows:
                out.append(r)
            out.append('</table></div>')
            rows = []
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if s.startswith('[SHEET:'):
            flush()
            name = s.replace('[SHEET:', '').replace(']', '').strip()
            out.append(f'<h3 class="domain-title">{html.escape(name)}</h3>')
            current_sheet = name
            continue
        if ' | ' in s:
            cells = [c.strip() for c in s.split(' | ')]
            # skip empty trailing
            while cells and cells[-1] == '':
                cells.pop()
            if cells:
                cells_html = ''.join(f'<td>{html.escape(c)}</td>' for c in cells)
                rows.append(f'<tr>{cells_html}</tr>')
        else:
            flush()
            out.append(f'<p>{html.escape(s)}</p>')
    flush()
    return '\n'.join(out)

# ---- Build data structure for JS ----
data = []
for fac in faculty_order:
    curs = faculties[fac]
    cur_list = []
    for cur_name, info in curs.items():
        html_content = text_to_html(info['text'], info['ext'])
        cur_list.append({
            'name': cur_name,
            'file': info['file'],
            'ext': info['ext'],
            'html': html_content
        })
    data.append({'faculty': fac, 'curricula': cur_list})

with open(os.path.join(BASE, '_appdata.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)

print(f"Faculties: {len(data)}")
total_cur = sum(len(d['curricula']) for d in data)
print(f"Curricula: {total_cur}")
for d in data:
    print(f"  {d['faculty']}: {len(d['curricula'])} curricula")
    for c in d['curricula']:
        print(f"     - {c['name']}  [.{c['ext']}]")
