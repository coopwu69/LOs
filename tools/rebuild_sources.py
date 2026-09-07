"""Re-extract question/option content for the programs whose stored rows have
options merged into the question text.

Reads the original source PDFs with pdfplumber's table extraction (which keeps
the two columns apart, unlike the plain-text extraction the first import used)
and writes one JSON file per program:

    {code, scale, questions: [{lo_code, domain, sequence, text_th, text_en,
                               options: [{score, label_th, description_th}]}]}

Run:  python tools/rebuild_sources.py <out_dir>
"""

import json
import os
import re
import sys
import unicodedata

import docx
import pdfplumber

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC = {
    "ENG": "1. สำนักวิชาครุศาสตร์และศิลปศาสตร์ 3 หลักสูตร/LOs Coop Ed_English_8 Dec 2024.pdf",
    "THAI": "1. สำนักวิชาครุศาสตร์และศิลปศาสตร์ 3 หลักสูตร/LOs-ของรายวิชาสหกิจศึกษา-67-ไทยเพื่อการสื่อสาร.pdf",
    "SSE": "2. สำนักวิชาแพทยศาสตร์ 1หลักสูตร/แบบประเมินสหกิจศึกษาที่สอดคล้องกับ LOs รายวิชาสหกิจศึกษา (วิทย์กีฬา).pdf",
    "IIT": "3. สำนักวิชาสารสนเทศศาสตร์ 5 หลักสูตร/3.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษาหลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ (IIT).pdf",
    "DCM": "3. สำนักวิชาสารสนเทศศาสตร์ 5 หลักสูตร/4.หลักสูตรดิจิทัลคอนเทนต์และสื่อ.pdf",
    "ENVH": "7.สำนักสาธารณสุขศาสตร์ 1 หลักสูตร/ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา อนามัยสิ่งแวดล้อม.pdf",
    "CUL": "9. สำนักวิชากการจัดการ 4 หลักสูตร/LO สหกิจหลักสูตรศิลปะการประกอบอาชีพ.pdf",
    "MARSCI": "5. สำนักวิทยาศาสตร์ 2 หลักสูตร/หลักสูตรวิทยาศาสตร์ทางทะเล_CLO_สหกิจศึกษา_JR310.docx",
    "LOG": "9. สำนักวิชากการจัดการ 4 หลักสูตร/แบบประเมินรายวิชาสหกิจศึกษาตาม LO หลักสูตรการจัดการโลจิสติกส์_ส่ง.docx",
    "CHEP": "6. สำนักวิศวกรรมศาสตร์ 6 หลักสูตร/ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา-วิศวกรรมเคมีฯ.docx",
}

SCORE_BY_LABEL = {
    "ดีเยี่ยม": 5, "ยอดเยี่ยม": 5,
    "ดีมาก": 4,
    "ดี": 3,
    "พอใช้": 2,
    "ควรปรับปรุง": 1, "ต้องปรับปรุง": 1, "ปรับปรุง": 1,
}

DOMAIN_BY_TITLE = [
    ("knowledge", "ด้านความรู้"),
    ("skills", "ด้านทักษะ"),
    ("ethics", "ด้านจริยธรรม"),
    ("character", "ด้านลักษณะบุคคล"),
]

MARKS = "ัิ-ฺ็-๎"

# ── Thai glyph repair ────────────────────────────────────────────────────────
# Only the unambiguous artifacts: a stray space before a combining mark can
# never be correct, "<consonant> า" is always a broken sara-am, and a mark that
# fell behind a closing paren belongs on the consonant in front of it.
RE_SARA_AM = re.compile(r"([ก-ฮ][่-๋]?)\s+า")
RE_SPACE_MARK = re.compile(r"\s+([" + MARKS + r"]+)")
RE_PAREN_MARK = re.compile(r"([ก-ฮ])(\))([" + MARKS + r"]+)")

# These PDFs also render some vowels/tone marks one consonant too late and push
# a space in behind them ("ไดอ้ ย่าง" for "ได้อย่าง"). Each key below is such a
# broken run; it is only replaced when the spurious space follows it, which is
# what tells it apart from the same letters occurring legitimately.
DISPLACED = {
    "ไดอ้": "ได้อ", "ไดค้": "ได้ค", "ไดถ้": "ได้ถ", "ไดด้": "ได้ด", "ไดเ้": "ได้เ",
    "ไดต้": "ได้ต", "ไดบ้": "ได้บ", "ไดร้": "ได้ร", "ไดส้": "ได้ส", "ไดม้": "ได้ม",
    "ใชค้": "ใช้ค", "ใชง้": "ใช้ง",
    "ซื่อสตั": "ซื่อสัต", "สตั": "สัต", "ดิจิทลั": "ดิจิทัล", "บรกิ": "บริก",
    "สรา้": "สร้า", "ธรุ": "ธุร", "เพมิ่": "เพิ่ม", "เขา้": "เข้า", "ชา้": "ช้า",
    "ปรบั": "ปรับ", "ปรงุ": "ปรุง", "เลอื": "เลือ", "ชนิ้": "ชิ้น", "ทงั้": "ทั้ง",
    "กบั": "กับ", "เปลยี่": "เปลี่ย", "สมบรู": "สมบูร", "สอื่": "สื่อ", "องั": "อัง",
    "ฟงั": "ฟัง", "ณป์": "ณ์ป", "เสรจ็": "เสร็จ", "ผนู้": "ผู้น", "ประสทิ": "ประสิท",
    "คณติ": "คณิต", "สถติ": "สถิต", "ผดิ": "ผิด", "ปญั": "ปัญ", "ธภิ": "ธิภ",
    "คลมุ": "คลุม", "สหกจิ": "สหกิจ", "นา่": "น่า", "แตย่": "แต่ย", "ไมส่": "ไม่ส",
    "ไมม่": "ไม่ม", "อยา่": "อย่า", "จยั": "จัย", "หวงั": "หวัง", "เรยี": "เรีย",
    "ประเมนิ": "ประเมิน", "ศัพทง์": "ศัพท์ง", "ปฏบิ": "ปฏิบ", "วเิ": "วิเ",
    "ยเี": "ยีเ", "ลเี": "ลีเ", "รดู้": "รู้ด", "ปฏิบตั": "ปฏิบัต", "ลเุ": "ลุเ",
    "ฏบิ": "ฏิบ", "นเิ": "นิเ", "รเู้": "รู้เ", "รู้เ้": "รู้เ",
    "ไดแ้": "ได้แ", "คน้": "ค้น", "ไดค้": "ได้ค",
}
# The same displacement also happens on runs that DO occur in correct Thai
# ("ตามปี", "ล้อมที่"); those are only rewritten when the spurious space is there.
DISPLACED_SPACED = {
    "มปี": "มีป", "มผี": "มีผ", "มจี": "มีจ", "มที": "มีท", "มคี": "มีค",
    "ทสี่": "ที่ส", "ทคี่": "ที่ค", "ทมี่": "ที่ม", "ตติ": "ติต", "ตสิ": "ติส",
}
RE_DISPLACED = re.compile("(" + "|".join(sorted(DISPLACED, key=len, reverse=True)) + r")\s*")
RE_DISPLACED_SPACED = re.compile("(" + "|".join(DISPLACED_SPACED) + r")\s+")


def repair(text):
    if not text:
        return text
    t = unicodedata.normalize("NFC", text).replace("ํา", "ำ")
    # displaced marks first: they swallow the spurious space that would
    # otherwise look like a broken sara-am ("ไมส่ ามารถ" is not "ไม่สำมารถ").
    t = RE_DISPLACED.sub(lambda m: DISPLACED[m.group(1)], t)
    t = RE_DISPLACED_SPACED.sub(lambda m: DISPLACED_SPACED[m.group(1)], t)
    t = RE_SARA_AM.sub(lambda m: m.group(1) + "ำ", t)
    t = RE_SPACE_MARK.sub(lambda m: m.group(1), t)
    t = RE_PAREN_MARK.sub(lambda m: m.group(1) + m.group(3) + m.group(2), t)
    t = re.sub(r"[•●]", " ", t)  # Wingdings/Symbol bullet glyphs
    t = re.sub(r"[ \t]+", " ", t)
    return t.strip()


def norm(cell):
    return repair((cell or "").replace("\n", " "))


def split_th_en(cell):
    """Left column holds the Thai statement followed by its English gloss."""
    lines = [ln.strip() for ln in (cell or "").split("\n") if ln.strip()]
    th, en = [], []
    for ln in lines:
        (en if re.match(r"^[A-Za-z(]", ln) else th).append(ln)
    return repair(" ".join(th)), repair(" ".join(en)) or None


def domain_of(title):
    for key, needle in DOMAIN_BY_TITLE:
        if needle in title:
            return key
    return None


def tables(code):
    with pdfplumber.open(os.path.join(BASE, SRC[code])) as pdf:
        for pno, page in enumerate(pdf.pages, 1):
            for t in page.extract_tables():
                yield pno, t


def docx_tables(code):
    """python-docx tables aren't paginated (a <w:tbl> is one logical table
    regardless of page breaks), so each yielded table is already complete —
    no cross-page continuation handling needed for these sources."""
    d = docx.Document(os.path.join(BASE, SRC[code]))
    for t in d.tables:
        yield [[cell.text for cell in row.cells] for row in t.rows]


def cells(row):
    """Collapse the merged-cell padding pdfplumber emits for wide tables."""
    return [c for c in row if c not in (None, "")]


# ── option-block parsers ─────────────────────────────────────────────────────

# " ระดับดีเยี่ยม (คำอธิบาย)"  — ENG
RE_LEVEL_PAREN = re.compile(
    r"[•●\-\*☑☐]?\s*ระดับ\s*(ดีเยี่ยม|ยอดเยี่ยม|ดีมาก|ดี|พอใช้|ควรปรับปรุง|ต้องปรับปรุง)\s*\((.*?)\)\s*(?=$|[•●\-\*☑☐]?\s*ระดับ)",
    re.DOTALL,
)
# "5 (ยอดเยี่ยม): คำอธิบาย"  — IIT, DCM
RE_LEVEL_SCORE = re.compile(
    r"([1-5])\s*\(\s*(ยอดเยี่ยม|ดีเยี่ยม|ดีมาก|ดี|พอใช้|ควรปรับปรุง|ต้องปรับปรุง|ต้องปรับปรงุ|ปรับปรงุ)\s*\)\s*:?\s*",
)
# " ดีเยี่ยม (5 คะแนน)\nคำอธิบาย"  — THAI
RE_LEVEL_POINTS = re.compile(
    r"[•●\-\*☑☐]?\s*(ดีเยี่ยม|ยอดเยี่ยม|ดีมาก|ดี|พอใช้|ควรปรับปรุง|ต้องปรับปรุง)\s*\(\s*([1-5])\s*คะแนน\s*\)\s*",
)


def parse_level_paren(cell):
    out = []
    for label, desc in RE_LEVEL_PAREN.findall(repair(cell or "")):
        out.append({"score": SCORE_BY_LABEL[label], "label_th": "ระดับ" + label,
                    "description_th": repair(desc.replace("\n", " "))})
    return out


def parse_level_score(cell):
    text = repair(cell or "")
    hits = list(RE_LEVEL_SCORE.finditer(text))
    out = []
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(text)
        label = m.group(2).replace("ปรับปรงุ", "ปรับปรุง")
        out.append({"score": int(m.group(1)), "label_th": label,
                    "description_th": repair(text[m.end():end].replace("\n", " "))})
    return out


def parse_level_points(cell):
    text = repair(cell or "")
    hits = list(RE_LEVEL_POINTS.finditer(text))
    out = []
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(text)
        out.append({"score": int(m.group(2)), "label_th": m.group(1),
                    "description_th": repair(text[m.end():end].replace("\n", " "))})
    return out


RE_LEVEL_PAREN_HEAD = re.compile(
    r"[•●\-\*☑☐]?\s*ระดับ\s*(?:ดีเยี่ยม|ยอดเยี่ยม|ดีมาก|ดี|พอใช้|ควรปรับปรุง|ต้องปรับปรุง)\s*\(")
parse_level_paren.marker = RE_LEVEL_PAREN_HEAD
parse_level_score.marker = RE_LEVEL_SCORE
parse_level_points.marker = RE_LEVEL_POINTS


# ── per-programme extraction ─────────────────────────────────────────────────

def two_column(code, q_re, parse_opts, en_gloss=True):
    """Layout: question cell on the left, whole rubric stack on the right.

    Rows whose question cell is empty continue the previous question's rubric
    across a page break.
    """
    questions, domain = [], None
    for _pno, table in tables(code):
        for row in table:
            cs = cells(row)
            if not cs:
                continue
            head = cs[0].replace("\n", " ").strip()
            if (head.startswith("ผลลัพธ์การเ") or head.startswith("ผลการเรียนรู้")
                    or head.startswith("ลักษณะบุคคล/สมรรถนะ") or head == "ผลการประเมิน"):
                continue
            d = domain_of(head)
            if d and len(cs) == 1:
                domain = d
                continue
            m = q_re.match(head)
            if m:
                th, en = split_th_en(re.sub(q_re, "", cs[0], count=1))
                questions.append({"lo_code": m.group(1).replace(" ", ""), "domain": domain,
                                  "text_th": th, "text_en": en if en_gloss else None,
                                  "options": parse_opts(cs[1] if len(cs) > 1 else "")})
            elif questions and len(cs) >= 1:
                # continuation: the only cell is more of the rubric column. Any
                # text ahead of its first level marker is the tail of the last
                # level's description, carried over the page break.
                raw = repair(cs[-1])
                first = parse_opts.marker.search(raw)
                lead = (raw[:first.start()] if first else raw).replace("\n", " ").strip()
                if lead and questions[-1]["options"]:
                    prev = questions[-1]["options"][-1]
                    prev["description_th"] = ((prev["description_th"] or "") + " " + lead).strip()
                questions[-1]["options"].extend(parse_opts(cs[-1]))
    return questions


def extract_eng():
    qs = two_column("ENG", re.compile(r"^(LO\s*\d+)\s*"), parse_level_paren)
    for q in qs:
        # LO2's left cell picked up a duplicate of its own top-level rubric line
        q["text_th"] = re.sub(
            r"\s*ประยุกต์ใช้ความรู้เฉพาะด้านในการปฏิบัติงานที่ได้รับ\s*มอบหมายในสถานประกอบการอย่างมีประสิทธิภาพ\s*$",
            "", q["text_th"]).strip()
        # LO6/LO7 have no rubric in the source at all (the PDF leaves the
        # "ผลการประเมิน" column blank for these two rows). There is nothing to
        # recover, so fall back to the plain 4-level scale with no
        # descriptions, matching how every other program without a rubric is
        # represented.
        if not q["options"]:
            q["options"] = [{"score": s, "label_th": "ระดับ" + l, "description_th": None}
                            for l, s in [("ดีมาก", 4), ("ดี", 3), ("พอใช้", 2), ("ควรปรับปรุง", 1)]]
    return qs


def extract_sse():
    return two_column("SSE", re.compile(r"^(\d+)\.\s*"), parse_level_paren, en_gloss=False)


def extract_iit():
    return two_column("IIT", re.compile(r"^(LO\s*\d+)\s*:\s*"), parse_level_score, en_gloss=False)


def extract_dcm():
    return two_column("DCM", re.compile(r"^(PLO\s*\d+)\s*:\s*"), parse_level_score, en_gloss=False)


def extract_envh():
    """Matrix layout: one column per level, 4 levels, first document only
    (pages 1-4 = the พ.ศ. 2568 revision; the same PDF repeats an older 2564
    revision afterwards)."""
    order = [(4, "ดีมาก"), (3, "ดี"), (2, "พอใช้"), (1, "ต้องปรับปรุง")]
    questions, domain = [], None
    for pno, table in tables("ENVH"):
        if pno > 4:
            break
        for row in table:
            cs = cells(row)
            if not cs:
                continue
            head = cs[0].replace("\n", " ").strip()
            if head.startswith("ผลการเรียนรู้ที่คาดหวัง"):
                continue
            d = domain_of(head)
            if d and len(cs) == 1:
                domain = d
                continue
            m = re.match(r"^(CLO\s*\d+)\s*", head)
            if m and len(cs) >= 5:
                th, _ = split_th_en(re.sub(r"^CLO\s*\d+\s*", "", cs[0], count=1))
                questions.append({
                    "lo_code": m.group(1).replace(" ", ""), "domain": domain,
                    "text_th": th, "text_en": None,
                    "options": [{"score": sc, "label_th": lb, "description_th": norm(cs[i + 1])}
                                for i, (sc, lb) in enumerate(order)],
                })
    return questions


def extract_cul():
    """Layout: question cell, then one row per level (label + indicators)."""
    questions, domain = [], None
    for _pno, table in tables("CUL"):
        for row in table:
            cs = cells(row)
            if not cs:
                continue
            head = cs[0].replace("\n", " ").strip()
            if head.startswith("ผลลัพธ์การเรียนรู้") or head == "ระดับ":
                cs = cs[1:] if len(cs) > 1 else []
                if not cs:
                    continue
                head = cs[0].replace("\n", " ").strip()
            d = domain_of(head)
            if d:
                domain = d
                continue
            m = re.match(r"^(LO\s*\d+)\s*:\s*", head)
            if m:
                th, en = split_th_en(re.sub(r"^LO\s*\d+\s*:\s*", "", cs[0], count=1))
                questions.append({"lo_code": m.group(1).replace(" ", ""), "domain": domain,
                                  "text_th": th, "text_en": en, "options": []})
                cs = cs[1:]
            lvl = re.match(r"^(ยอดเยี่ยม|ดีเยี่ยม|ดีมาก|ดี|พอใช้|ต้องปรับปรุง|ควรปรับปรุง)\s*\(\s*([1-5])\s*\)\s*$",
                           cs[0].replace("\n", " ").strip()) if cs else None
            if lvl and questions:
                questions[-1]["options"].append({
                    "score": int(lvl.group(2)), "label_th": lvl.group(1),
                    "description_th": norm(cs[1]) if len(cs) > 1 else None})
    return questions


def extract_thai():
    return two_column("THAI", re.compile(r"^(LO\s*\d+)\s*"), parse_level_points, en_gloss=False)


def docx_two_column(code, q_re, parse_opts):
    """Same two-column shape as `two_column`, but for a .docx table. A
    <w:tbl> element is one logical table regardless of page breaks, so there
    is no cross-page continuation to stitch back together here."""
    questions, domain = [], None
    for table in docx_tables(code):
        for row in table:
            if not row or not any(c.strip() for c in row):
                continue
            head = row[0].replace("\n", " ").strip()
            if (head.startswith("ผลลัพธ์การเ") or head.startswith("ผลการเรียนรู้")
                    or head in ("ผลการประเมิน", "ลักษณะบุคคล/สมรรถนะ")):
                continue
            d = domain_of(head)
            if d:
                domain = d
                continue
            m = q_re.match(head)
            if m:
                th, _ = split_th_en(re.sub(q_re, "", row[0], count=1))
                questions.append({"lo_code": m.group(1).replace(" ", ""), "domain": domain,
                                  "text_th": th, "text_en": None,
                                  "options": parse_opts(row[1] if len(row) > 1 else "")})
    return questions


def extract_marsci():
    """docx, 5-level "N (label): description" cells (Wingdings bullets)."""
    qs = docx_two_column("MARSCI", re.compile(r"^(CLO\s*\d+)\s*:\s*"), parse_level_score)
    for q in qs:
        # the assessment table numbers its rows CLO1..CLO12, but the program's
        # PLOs (and the lo_code already stored for this program) use "PLO" —
        # the two lists are the same items in the same order, PLO-for-CLO.
        q["lo_code"] = q["lo_code"].replace("CLO", "PLO")
    return qs


def extract_chep():
    """docx, 5-level "N (label): description" cells. The source table mislabels
    both Character-domain rows' LO as "LO6" (one is a copy-paste typo of the
    Ethics row above it); renumber by position instead of trusting the text."""
    qs = docx_two_column("CHEP", re.compile(r"^(LO\s*\d+)\s*:\s*"), parse_level_score)
    for i, q in enumerate(qs, 1):
        q["lo_code"] = f"LO{i}"
    return qs


def extract_log():
    """docx, 5-level "label (N คะแนน)\\ndescription" cells, like THAI. Items are
    numbered (1..10) rather than LO-coded in the source, matching the existing
    data (lo_code is null for this program)."""
    qs = docx_two_column("LOG", re.compile(r"^(\d+)\.\s*"), parse_level_points)
    for q in qs:
        q["lo_code"] = None
    return qs


EXTRACTORS = {
    "ENG": extract_eng, "SSE": extract_sse, "IIT": extract_iit, "DCM": extract_dcm,
    "ENVH": extract_envh, "CUL": extract_cul, "THAI": extract_thai,
    "MARSCI": extract_marsci, "CHEP": extract_chep, "LOG": extract_log,
}

if __name__ == "__main__":
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    only = sys.argv[2:] or list(EXTRACTORS)
    for code in only:
        qs = EXTRACTORS[code]()
        for i, q in enumerate(qs, 1):
            q["sequence"] = i
            q["options"].sort(key=lambda o: -o["score"])
        doc = {"code": code, "source": SRC[code], "questions": qs}
        path = os.path.join(out_dir, f"{code}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=1)
        scores = sorted({o["score"] for q in qs for o in q["options"]}, reverse=True)
        print(f"{code}: {len(qs)} questions, scores={scores} -> {path}")
