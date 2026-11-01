"""Seed a local Postgres replica with the School of Management programs.

LOG content = production snapshot in migrations/g11_batches/batch_4_rewritten.json
(4-level rubric, final description_th_new text). Domains come from data/rebuilt/LOG.json.
Only for rendering tutorial screenshots locally; never points at production.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PSQL = ["psql", "-h", "/tmp", "-p", "5433", "-U", "postgres", "-d", "los", "-v", "ON_ERROR_STOP=1", "-q"]

SCHOOL = "สำนักวิชาการจัดการ"
PROGRAMS = [
    ("CUL", "ศิลปะการประกอบอาหารอย่างมืออาชีพ", "หลักสูตรบริหารธุรกิจบัณฑิต สาขาศิลปะการประกอบอาหารอย่างมืออาชีพ"),
    ("LOG", "การจัดการโลจิสติกส์", "หลักสูตรบริหารธุรกิจบัณฑิต สาขาการจัดการโลจิสติกส์"),
    ("MKT", "การตลาดดิจิทัลและการสร้างแบรนด์", "หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์"),
    ("THM", "การจัดการการท่องเที่ยวและการโรงแรม", "หลักสูตรการจัดการการท่องเที่ยวและการโรงแรม"),
]
TYPO_QUESTION = "8fe7646b-a5e1-4b6f-b624-2322945a20ca"
SECTIONS = [
    ("knowledge", "ด้านความรู้ (Knowledge)"),
    ("skills", "ด้านทักษะ (Skills)"),
    ("ethics", "ด้านจริยธรรม (Ethics)"),
    ("character", "ด้านลักษณะบุคคล"),
]


def q(s):
    return "NULL" if s is None else "'" + str(s).replace("'", "''") + "'"


def main():
    batch = json.load(open(ROOT / "migrations/g11_batches/batch_4_rewritten.json"))
    rows = [r for r in batch if r["program_code"] == "LOG"]
    early = json.load(open(ROOT / "data/rebuilt/LOG.json"))["questions"]
    domain_by_text = {e["text_th"].strip(): (e["domain"], e["sequence"]) for e in early}

    questions = {}
    for r in rows:
        qd = questions.setdefault(r["question_id"], {"text": r["question_text"], "lo": r["lo_code"], "options": []})
        qd["options"].append(r)

    sql = [
        """
        ALTER TABLE programs ADD COLUMN IF NOT EXISTS school text,
          ADD COLUMN IF NOT EXISTS slug text,
          ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
          ADD COLUMN IF NOT EXISTS revision_label text,
          ADD COLUMN IF NOT EXISTS form_status text NOT NULL DEFAULT 'pending';
        ALTER TABLE evaluation_templates ADD COLUMN IF NOT EXISTS name text,
          ADD COLUMN IF NOT EXISTS course_codes jsonb,
          ADD COLUMN IF NOT EXISTS scale_status text NOT NULL DEFAULT 'needs_descriptions',
          ADD COLUMN IF NOT EXISTS source_layout text;
        ALTER TABLE assessment_sections ADD COLUMN IF NOT EXISTS part integer NOT NULL DEFAULT 1;
        ALTER TABLE evaluation_questions ADD COLUMN IF NOT EXISTS plo_refs jsonb,
          ADD COLUMN IF NOT EXISTS sequence integer NOT NULL DEFAULT 0;
        CREATE TABLE IF NOT EXISTS program_plos (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          program_id uuid, code text, domain_type text, text text, sequence int);
        TRUNCATE programs CASCADE;
        """
    ]
    for code, name, title in PROGRAMS:
        sql.append(
            f"INSERT INTO programs (code, name_th, school, slug, form_status) VALUES ({q(code)}, {q(name)}, {q(SCHOOL)}, {q(code.lower())}, 'submitted');"
            f"INSERT INTO evaluation_templates (program_id, title, name, scale_status) SELECT id, {q(title)}, {q(title)}, 'standard_4' FROM programs WHERE code={q(code)};"
        )

    tpl = "(SELECT t.id FROM evaluation_templates t JOIN programs p ON p.id=t.program_id WHERE p.code='LOG')"
    for i, (dom, title) in enumerate(SECTIONS, 1):
        part = 1 if dom in ("knowledge", "skills") else 2
        sql.append(
            f"INSERT INTO assessment_sections (template_id, title_th, domain_type, sequence, part) VALUES ({tpl}, {q(title)}, '{dom}', {i}, {part});"
        )

    for qid, qd in questions.items():
        dom, seq = domain_by_text[qd["text"].strip()]
        sec = f"(SELECT id FROM assessment_sections WHERE template_id={tpl} AND domain_type='{dom}')"
        sql.append(
            f"INSERT INTO evaluation_questions (id, template_id, section_id, text, lo_code, sequence, question_type) "
            f"VALUES ('{qid}', {tpl}, {sec}, {q(qd['text'])}, {q(qd['lo'])}, {seq}, 'rating_scale');"
        )
        for o in sorted(qd["options"], key=lambda o: -o["score"]):
            sql.append(
                f"INSERT INTO assessment_options (id, question_id, label_th, description_th, score, sequence) VALUES "
                f"('{o['option_id']}', '{qid}', {q(o['label_th'])}, {q(o['description_th_new'])}, {o['score']}, {5 - o['score']});"
            )

    if "--typo" in sys.argv:
        # Demo misspelling for the edit scene (local replica only): ปัญหา -> ปัณหา in LOG knowledge Q1.
        sql.append(f"UPDATE evaluation_questions SET text = replace(text, 'แก้ปัญหา', 'แก้ปัณหา') WHERE id = '{TYPO_QUESTION}';")

    subprocess.run(PSQL, input="\n".join(sql), text=True, check=True)
    print(f"seeded {len(PROGRAMS)} programs, LOG questions={len(questions)} options={len(rows)}")


if __name__ == "__main__":
    main()
