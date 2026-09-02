"""Registry of 37 programs (33 submitted + 4 pending).

Built from _appdata.json (13 faculties, 33 curricula) + 4 pending programs.
Each entry maps a source document to a program code, layout hint, and overrides.
"""

import json
import os
import re
import unicodedata

# ─── School name normalization ───
# _appdata.json has slightly inconsistent faculty names; normalize to canonical.
SCHOOL_NORMALIZE = {
    "สำนักวิชาครุศาสตร์และศิลปศาสตร์": "สำนักวิชาครุศาสตร์และศิลปศาสตร์",
    "สำนักวิชาแพทยศาสตร์": "สำนักวิชาแพทยศาสตร์",
    "สำนักวิชาสารสนเทศศาสตร์": "สำนักวิชาสารสนเทศศาสตร์",
    "สำนักรัฐศาสตร์ฯ": "สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์",
    "สำนักวิทยาศาสตร์": "สำนักวิชาวิทยาศาสตร์",
    "สำนักวิศวกรรมศาสตร์": "สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี",
    "สำนักสาธารณสุขศาสตร์": "สำนักวิชาสาธารณสุขศาสตร์",
    "สำนักวิชานิติศาสตร์1หลักสูตร": "สำนักวิชานิติศาสตร์",
    "สำนักวิชากการจัดการ": "สำนักวิชาการจัดการ",
    "สำนักวิชาบัญชี": "สำนักวิชาการบัญชีและการเงิน",
    "สำนักวิชาสถาปัตยกรรมศาสตร์ฯ": "สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ",
    "นานาชาติ1หลักสูตร": "วิทยาลัยนานาชาติ",
    "สำนักวิชาเทคโนโลยีการเกษตรฯ": "สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร",
}

# ─── Manual code assignment for 33 submitted curricula ───
# Key = (school_key, curriculum_name) → code
# curriculum_name is matched loosely (startswith / contains)
CODE_MAP = [
    # 1. ครุศาสตร์ (3)
    ("ครุ", "ภาษาอังกฤษ", "ENG", "หลักสูตรภาษาอังกฤษ", "rubric4"),
    ("ครุ", "ไทยเพื่อการสื่อสาร", "THAI", "หลักสูตรภาษาไทยเพื่อการสื่อสาร", "rubric4"),
    ("ครุ", "ภาษาจีน", "CHI", "หลักสูตรภาษาจีน", "rubric4"),
    # 2. แพทย์ (1)
    ("แพทย", "วิทย์กีฬา", "SSE", "วิทยาศาสตร์การกีฬาและการออกกำลังกาย", "rubric4"),
    # 3. สารสนเทศ (5)
    ("สารสนเทศ", "นิเทศศาสตร์", "DCA", "นิเทศศาสตร์ดิจิทัล", "rubric4"),
    ("สารสนเทศ", "ดิจิทัลทางการแพทย์", "DTM", "เทคโนโลยีดิจิทัลทางการแพทย์", "rubric4"),
    ("สารสนเทศ", "สารสนเทศอัจฉริยะ", "IIT", "เทคโนโลยีสารสนเทศอัจฉริยะ", "rubric4"),
    ("สารสนเทศ", "ดิจิทัลคอนเทนต์", "DCM", "ดิจิทัลคอนเทนต์และสื่อ", "rubric4"),
    ("สารสนเทศ", "MTA", "IMAG", "อินเทอร์แอคทีฟมัลติมีเดียแอนิเมชันและเกม", "rubric4"),
    # 4. รัฐศาสตร์ (3)
    ("รัฐศาสตร์", "IR 2567", "IR", "รัฐศาสตร์ (ความสัมพันธ์ระหว่างประเทศ)", "rubric4"),
    ("รัฐศาสตร์", "การเมืองการปกครอง", "POL", "รัฐศาสตร์ (การเมืองการปกครอง)", "rubric4"),
    ("รัฐศาสตร์", "รปศ", "PA", "รัฐประศาสนศาสตร์", "matrix"),
    # 5. วิทยาศาสตร์ (2)
    ("วิทยาศาสตร์", "สาขาวิทยาศาสตร์", "SCI", "วิทยาศาสตร์", "rubric4"),
    ("วิทยาศาสตร์", "ทางทะเล", "MARSCI", "วิทยาศาสตร์ทางทะเล", "rubric4"),
    # 6. วิศวกรรม (6)
    ("วิศวกรรม", "คอมพิวเตอร์และปัญญาประดิษฐ์", "CEAI", "วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์", "rubric4"),
    ("วิศวกรรม", "ปิโตรเคมี", "PEP", "ปิโตรเคมีและพอลิเมอร์", "rubric4"),
    ("วิศวกรรม", "วิศวกรรมเคมี", "CHEP", "วิศวกรรมเคมี", "rubric4"),
    ("วิศวกรรม", "วิศวกรรมเครื่องกล", "MECH", "วิศวกรรมเครื่องกล", "rubric4"),
    ("วิศวกรรม", "วิศวกรรมไฟฟ้า", "EE", "วิศวกรรมไฟฟ้า", "rubric4"),
    ("วิศวกรรม", "วิศวกรรมโยธา", "CIVIL", "วิศวกรรมโยธา", "rubric4"),
    # 7. สาธารณสุข (1)
    ("สาธารณสุข", "อนามัยสิ่งแวดล้อม", "ENVH", "อนามัยสิ่งแวดล้อม", "rubric4"),
    # 8. นิติ (1)
    ("นิติ", "นิติศาสตรบัณฑิต", "LAW", "นิติศาสตร์", "rubric4"),
    # 9. การจัดการ (5 files, 4 unique — THM has docx+pdf)
    ("การจัดการ", "ศิลปะการประกอบอาชีพ", "CUL", "ศิลปะการประกอบอาหารอย่างมืออาชีพ", "rubric4"),
    ("การจัดการ", "การตลาดดิจิทัล", "MKT", "บริหารธุรกิจ (การตลาดดิจิทัลและการสร้างแบรนด์)", "rubric4"),
    ("การจัดการ", "โลจิสติกส์", "LOG", "บริหารธุรกิจ (โลจิสติกส์)", "rubric4"),
    ("การจัดการ", "การท่องเที", "THM", "การจัดการท่องเที่ยวและการบริการโรงแรม", "rubric4"),
    # 10. บัญชี (2)
    ("บัญชี", "เศรษฐศาสตรบัณฑิต", "ECON", "เศรษฐศาสตร์", "rubric4"),
    ("บัญชี", "บัญชีบัณฑิต", "ACC", "บัญชี", "rubric5"),
    # 11. สถาปัตย (1)
    ("สถาปัตย", "ออกแบบภายใน", "INTD", "การออกแบบภายใน", "rubric4"),
    # 12. นานาชาติ (1)
    ("นานาชาติ", "บริหารธุรกิจบัณฑิต", "INTL", "บริหารธุรกิจ (นานาชาติ)", "rubric4"),
    # 13. เกษตร (2)
    ("เกษตร", "วิทยาศาสต", "FSI", "วิทยาศาสตร์อาหารและนวัตกรรม", "rubric4"),
    ("เกษตร", "เกษตรศาสตร์และนวัตกรร", "ANSCI", "เกษตรศาสตร์และนวัตกรรม", "rubric4"),
]

# ─── 4 pending programs (no source document, no template) ───
PENDING_PROGRAMS = [
    {
        "code": "OHS",
        "name_th": "อาชีวอนามัยและความปลอดภัย",
        "school_name_th": "สำนักวิชาสาธารณสุขศาสตร์",
        "source_file": None,
        "layout": None,
        "form_status": "pending",
    },
    {
        "code": "DFB",
        "name_th": "บริหารธุรกิจบัณฑิต สาขาการจัดการธุรกิจและการเงินยุคดิจิทัล",
        "school_name_th": "สำนักวิชาการบัญชีและการเงิน",
        "source_file": None,
        "layout": None,
        "form_status": "pending",
    },
    {
        "code": "ASEAN",
        "name_th": "รัฐศาสตร์ (อาเซียนศึกษา)",
        "school_name_th": "สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์",
        "source_file": None,
        "layout": None,
        "form_status": "pending",
        "note": "ใช้แบบประเมินร่วมกับ IR",
    },
    {
        "code": "SRV",
        "name_th": "อุตสาหกรรมการบริการ",
        "school_name_th": "สำนักวิชาการจัดการ",
        "source_file": None,
        "layout": None,
        "form_status": "pending",
    },
]


def _normalize(s: str) -> str:
    return unicodedata.normalize("NFC", s).strip()


def _match_code(school_key: str, curr_name: str) -> tuple[str, str, str] | None:
    """Find (code, canonical_name, layout) for a curriculum."""
    for sk, pattern, code, name, layout in CODE_MAP:
        if sk in school_key and pattern in curr_name:
            return code, name, layout
    return None


def build_registry() -> list[dict]:
    """Build the full 36-program registry from _appdata.json + pending."""
    appdata_path = os.path.join(os.path.dirname(__file__), "..", "_appdata.json")
    with open(appdata_path, encoding="utf-8") as f:
        appdata = json.load(f)

    registry = []
    seen_codes = set()

    for faculty in appdata:
        raw_school = faculty["faculty"]
        school = SCHOOL_NORMALIZE.get(raw_school, raw_school)
        school_key = raw_school  # for matching

        for curr in faculty["curricula"]:
            curr_name = _normalize(curr["name"])
            source_file = curr["file"]
            ext = curr["ext"]

            match = _match_code(school_key, curr_name)
            if not match:
                # Log unmatched — will be caught in report
                registry.append({
                    "code": None,
                    "name_th": curr_name,
                    "school_name_th": school,
                    "source_file": source_file,
                    "ext": ext,
                    "layout": None,
                    "form_status": "submitted",
                    "_unmatched": True,
                })
                continue

            code, canonical_name, layout = match

            # Handle THM duplicate — prefer .pdf (updated) over .docx
            if code in seen_codes:
                if code == "THM" and ext == "pdf":
                    # Replace the docx entry with the pdf (updated) version
                    for entry in registry:
                        if entry.get("code") == "THM":
                            entry["source_file"] = source_file
                            entry["ext"] = ext
                            entry["_duplicate_replaced"] = True
                    continue
                else:
                    # Skip duplicate
                    continue

            seen_codes.add(code)
            registry.append({
                "code": code,
                "name_th": canonical_name,
                "school_name_th": school,
                "source_file": source_file,
                "ext": ext,
                "layout": layout,
                "form_status": "submitted",
            })

    # Add pending programs
    for p in PENDING_PROGRAMS:
        if p["code"] not in seen_codes:
            seen_codes.add(p["code"])
            registry.append(p)

    return registry


def print_mapping_table(registry: list[dict]):
    """Print human-readable mapping table for review."""
    print(f"{'CODE':8} {'SCHOOL':40} {'NAME':45} {'LAYOUT':8} {'STATUS':10}")
    print("-" * 115)
    for r in registry:
        code = r.get("code") or "???"
        school = (r.get("school_name_th") or "")[:38]
        name = (r.get("name_th") or "")[:43]
        layout = r.get("layout") or "-"
        status = r.get("form_status", "?")
        flag = " ⚠" if r.get("_unmatched") else ""
        print(f"{code:8} {school:40} {name:45} {layout:8} {status:10}{flag}")

    submitted = [r for r in registry if r.get("form_status") == "submitted" and r.get("code")]
    pending = [r for r in registry if r.get("form_status") == "pending"]
    unmatched = [r for r in registry if r.get("_unmatched")]
    print(f"\nTotal: {len(registry)} (submitted: {len(submitted)}, pending: {len(pending)}, unmatched: {len(unmatched)})")


if __name__ == "__main__":
    reg = build_registry()
    print_mapping_table(reg)
