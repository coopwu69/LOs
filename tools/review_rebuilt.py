import json, os, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

d = sys.argv[1]
codes = sys.argv[2:] or [f[:-5] for f in sorted(os.listdir(d)) if f.endswith(".json")]
LEVEL = "ยอดเยี่ยม|ดีเยี่ยม|ดีมาก|ดี|พอใช้|ควรปรับปรุง|ต้องปรับปรุง"
OPT_IN_Q = re.compile(rf"(ระดับ\s*({LEVEL})\s*\(|[1-5]\s*\(\s*({LEVEL})\s*\)|\(\s*[1-5]\s*คะแนน\s*\))")
HEADER = re.compile(r"(ผลลัพธ์การเ|ผลการเรียนรู้ที่คาดหวัง|ผลการประเม|ลักษณะบุคคล/สมรรถนะ)")

problems = 0
for code in codes:
    doc = json.load(open(os.path.join(d, code + ".json"), encoding="utf-8"))
    print(f"\n{'='*70}\n{code}  ({len(doc['questions'])} questions)")
    for q in doc["questions"]:
        flags = []
        if OPT_IN_Q.search(q["text_th"] or ""):
            flags.append("OPT_IN_Q")
        if HEADER.search(q["text_th"] or ""):
            flags.append("HEADER_IN_Q")
        scores = [o["score"] for o in q["options"]]
        if scores != sorted(set(scores), reverse=True):
            flags.append(f"BAD_SCORES{scores}")
        for o in q["options"]:
            if HEADER.search(o["description_th"] or ""):
                flags.append(f"HEADER_IN_OPT({o['score']})")
            if OPT_IN_Q.search(o["description_th"] or ""):
                flags.append(f"OPT_IN_OPT({o['score']})")
            if re.search(r"\(\s*\d\s*\)\s*$", o["description_th"] or ""):
                flags.append(f"PAGENUM_IN_OPT({o['score']})")
        problems += len(flags)
        print(f"\n [{q['lo_code']}] {q['domain']} seq={q['sequence']} {' !! ' + ','.join(flags) if flags else ''}")
        print(f"   TH: {q['text_th']}")
        if q.get("text_en"):
            print(f"   EN: {q['text_en']}")
        for o in q["options"]:
            print(f"    {o['score']} {o['label_th']}: {o['description_th']}")
print(f"\n\nTOTAL FLAGS: {problems}")
