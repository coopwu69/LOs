"""Build dataset.json from all source documents + generate parse_report.md."""

import os
import sys
import json
import re
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from registry import build_registry, SCHOOL_NORMALIZE
from parse_docs import parse_document

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES_DIR = os.path.join(ROOT, "data", "sources")
DATA_DIR = os.path.join(ROOT, "data")


def find_source_file(source_rel: str) -> str | None:
    """Find the downloaded source file by matching the relative path."""
    # The relative path uses backslashes; the downloaded file uses underscores
    safe = source_rel.replace("\\", "_").replace("/", "_")
    path = os.path.join(SOURCES_DIR, safe)
    if os.path.exists(path):
        return path
    # Try fuzzy match on filename
    basename = os.path.basename(source_rel)
    for fn in os.listdir(SOURCES_DIR):
        if basename in fn or fn.endswith(basename.replace("\\", "_")):
            return os.path.join(SOURCES_DIR, fn)
    return None


def build_dataset():
    registry = build_registry()
    submitted = [r for r in registry if r.get("form_status") == "submitted" and r.get("code")]
    pending = [r for r in registry if r.get("form_status") == "pending"]

    # Build schools list (unique, ordered by first appearance)
    schools = []
    seen_schools = set()
    for r in registry:
        s = r.get("school_name_th", "")
        if s and s not in seen_schools:
            seen_schools.add(s)
            schools.append({"name_th": s, "sequence": len(schools) + 1})

    programs = []
    report_rows = []
    manual_check = []
    thai_repair_log = []
    parse_failures = []

    for entry in submitted:
        code = entry["code"]
        name_th = entry["name_th"]
        school = entry["school_name_th"]
        source_rel = entry["source_file"]
        layout_hint = entry.get("layout")

        # Find source file
        path = find_source_file(source_rel)
        if not path:
            parse_failures.append({
                "code": code, "name": name_th,
                "reason": f"Source file not found: {source_rel}",
            })
            report_rows.append({
                "code": code, "name": name_th, "layout": "-",
                "scale_status": "-", "plos": 0, "sections": 0,
                "questions": 0, "options": 0, "flags": "FILE_NOT_FOUND",
            })
            continue

        # Parse
        try:
            result = parse_document(path, layout_hint=layout_hint)
        except Exception as e:
            parse_failures.append({
                "code": code, "name": name_th,
                "reason": f"Parse error: {e}",
            })
            report_rows.append({
                "code": code, "name": name_th, "layout": "-",
                "scale_status": "-", "plos": 0, "sections": 0,
                "questions": 0, "options": 0, "flags": f"PARSE_ERROR: {e}",
            })
            continue

        layout = result["layout"]
        scale_status = result["scale_status"]
        n_plos = len(result["plos"])
        n_sections = len(result["sections"])
        n_questions = sum(len(s["questions"]) for s in result["sections"])
        n_options = sum(len(q["options"]) for s in result["sections"] for q in s["questions"])

        # Collect flags
        flags = []
        if n_sections == 0:
            flags.append("NO_SECTIONS")
        if n_questions == 0:
            flags.append("NO_QUESTIONS")
        if n_plos == 0:
            flags.append("NO_PLOS")

        # Check for questions needing manual review
        for s in result["sections"]:
            for q in s["questions"]:
                q_flags = []
                if len(q["options"]) < 4:
                    q_flags.append(f"opts={len(q['options'])}")
                if not q["text"] or len(q["text"]) < 20:
                    q_flags.append(f"short_text({len(q['text'])})")
                has_empty_desc = any(not o.get("description_th") for o in q["options"])
                if has_empty_desc and layout != "matrix":
                    q_flags.append("empty_desc")
                if q_flags:
                    manual_check.append({
                        "code": code, "section": s["title_th"][:30],
                        "lo_code": q["lo_code"], "text": q["text"][:60],
                        "flags": ", ".join(q_flags),
                    })

        # Collect Thai repairs
        for rep in result.get("thai_repairs", []):
            thai_repair_log.append({"code": code, "repair": rep})

        # Build program entry
        slug = code.lower().replace(" ", "")
        revision_label = result.get("revision_label") or entry.get("revision_label")

        program = {
            "code": code,
            "name_th": name_th,
            "name_en": None,
            "school_name_th": school,
            "slug": slug,
            "revision_label": revision_label,
            "form_status": "submitted",
            "source_file": source_rel,
            "source_layout": layout,
            "plos": result["plos"],
            "template": {
                "title": "แบบประเมินผลการปฏิบัติสหกิจศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง",
                "course_codes": result.get("course_codes", []),
                "scale_status": scale_status,
                "sections": result["sections"],
            },
        }
        programs.append(program)

        report_rows.append({
            "code": code, "name": name_th, "layout": layout,
            "scale_status": scale_status, "plos": n_plos,
            "sections": n_sections, "questions": n_questions,
            "options": n_options, "flags": "; ".join(flags) if flags else "",
        })

    # Add pending programs (no template, no PLOs)
    for entry in pending:
        code = entry["code"]
        slug = code.lower().replace(" ", "")
        programs.append({
            "code": code,
            "name_th": entry["name_th"],
            "name_en": None,
            "school_name_th": entry["school_name_th"],
            "slug": slug,
            "revision_label": None,
            "form_status": "pending",
            "source_file": None,
            "source_layout": None,
            "plos": [],
            "template": None,
        })
        report_rows.append({
            "code": code, "name": entry["name_th"], "layout": "-",
            "scale_status": "-", "plos": 0, "sections": 0,
            "questions": 0, "options": 0, "flags": "PENDING (no source)",
        })

    dataset = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "schools": schools,
        "programs": programs,
    }

    return dataset, report_rows, manual_check, thai_repair_log, parse_failures


def write_report(report_rows, manual_check, thai_repair_log, parse_failures):
    """Write parse_report.md."""
    lines = []
    lines.append("# รายงานการ Parse เอกสารต้นฉบับ\n")
    lines.append(f"สร้างเมื่อ: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Summary table
    lines.append("\n## ตารางสรุป\n")
    lines.append("| Code | ชื่อหลักสูตร | Layout | Scale | PLOs | Sections | Questions | Options | Flags |")
    lines.append("|------|------------|--------|-------|------|----------|-----------|---------|-------|")
    for r in report_rows:
        lines.append(f"| {r['code']} | {r['name'][:35]} | {r['layout']} | {r['scale_status']} | {r['plos']} | {r['sections']} | {r['questions']} | {r['options']} | {r['flags']} |")

    # Totals
    total_q = sum(r["questions"] for r in report_rows)
    total_opts = sum(r["options"] for r in report_rows)
    total_plos = sum(r["plos"] for r in report_rows)
    lines.append(f"\n**รวม:** {len(report_rows)} หลักสูตร, {total_plos} PLOs, {total_q} questions, {total_opts} options\n")

    # Manual check section
    lines.append("\n## ต้องตรวจด้วยตา\n")
    if not manual_check:
        lines.append("ไม่มีข้อที่ต้องตรวจด้วยตา\n")
    else:
        lines.append(f"พบ {len(manual_check)} ข้อที่ต้องตรวจสอบ:\n")
        lines.append("| Code | Section | LO | ข้อความ | ปัญหา |")
        lines.append("|------|---------|-----|---------|-------|")
        for m in manual_check[:100]:
            lines.append(f"| {m['code']} | {m['section']} | {m['lo_code']} | {m['text'][:40]} | {m['flags']} |")
        if len(manual_check) > 100:
            lines.append(f"\n... และอีก {len(manual_check)-100} ข้อ\n")

    # Thai repair log
    lines.append("\n## Thai Repair Log\n")
    if not thai_repair_log:
        lines.append("ไม่มีการแก้ไข Thai text\n")
    else:
        lines.append(f"พบ {len(thai_repair_log)} การแก้ไข:\n")
        # Group by repair type
        repair_counts = {}
        for r in thai_repair_log:
            rep = r["repair"]
            repair_counts[rep] = repair_counts.get(rep, 0) + 1
        lines.append("| การแก้ไข | จำนวนครั้ง |")
        lines.append("|----------|-----------|")
        for rep, count in sorted(repair_counts.items(), key=lambda x: -x[1]):
            lines.append(f"| {rep} | {count} |")

    # Parse failures
    lines.append("\n## หลักสูตรที่ parse ไม่ได้\n")
    if not parse_failures:
        lines.append("ไม่มีหลักสูตรที่ parse ไม่ได้\n")
    else:
        lines.append(f"พบ {len(parse_failures)} หลักสูตร:\n")
        for f in parse_failures:
            lines.append(f"- **{f['code']}** ({f['name']}): {f['reason']}")

    report_path = os.path.join(DATA_DIR, "parse_report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Report written to: {report_path}")


def main():
    print("Building dataset...")
    dataset, report_rows, manual_check, thai_repair_log, parse_failures = build_dataset()

    # Write dataset.json
    dataset_path = os.path.join(DATA_DIR, "dataset.json")
    with open(dataset_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)
    print(f"Dataset written to: {dataset_path}")
    print(f"Programs: {len(dataset['programs'])}, Schools: {len(dataset['schools'])}")

    # Write report
    write_report(report_rows, manual_check, thai_repair_log, parse_failures)

    # Print summary to console
    print("\n" + "=" * 80)
    print("สรุปผลการ Parse")
    print("=" * 80)
    print(f"{'CODE':8} {'NAME':35} {'LAYOUT':8} {'SCALE':15} {'PLO':4} {'SEC':4} {'Q':4} {'OPT':5} FLAGS")
    print("-" * 100)
    for r in report_rows:
        print(f"{r['code']:8} {r['name'][:35]:35} {r['layout']:8} {r['scale_status']:15} {r['plos']:<4} {r['sections']:<4} {r['questions']:<4} {r['options']:<5} {r['flags']}")

    print(f"\nรวม: {len(report_rows)} หลักสูตร")
    print(f"ต้องตรวจด้วยตา: {len(manual_check)} ข้อ")
    print(f"Thai repairs: {len(thai_repair_log)} ครั้ง")
    print(f"Parse ไม่ได้: {len(parse_failures)} หลักสูตร")


if __name__ == "__main__":
    main()
