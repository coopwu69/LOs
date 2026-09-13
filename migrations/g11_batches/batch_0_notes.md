# G11 batch_0 — rubric shortening notes

Processed all 188 rows / 47 questions across programs: ACC, CUL, EE, ENVH, INTD, MKT.
Output: `batch_0_rewritten.json` (adds `description_th_new` to every row, keeps `description_th` original for diffing).

**Overall reduction:** 27,009 → 18,615 characters (31% shorter).

Note on reduction %: the 60–70% target from the reference doc (`docs/rubric-rewrite-2569-09-11.md`) applies to rows that heavily repeat `question_text` verbatim (the EE and some MKT/INTD rows fit this pattern and were compressed 30–65%). Many rows in this batch (ACC, ENVH, most of MKT) were **already short and largely non-repetitive** — they don't restate the question, so there was little redundant text to cut. For those I only tightened wording, not forced them to an arbitrary length target, per the instruction to never weaken/cut the unique differentiating content.

CUL rows are a special case: they are structured multi-bullet rubrics (e.g. "- การจัดการวัตถุดิบ: ... - การเตรียมและประกอบอาหาร: ... "). They don't repeat `question_text` either, so compression there came from tightening each bullet's phrasing while preserving all bullet categories and their distinguishing content (no bullets dropped).

## (a) Missing/degenerate level-qualifier bug found and fixed

Per the known pre-existing bug pattern (a level's description_th being literally identical to question_text with no qualifier at all — same bug class flagged in CIVIL LO5 level 4 in the 2026-09-11 survey):

**EE / LO12** (`question_id 71b082df-8f45-4b2a-a88b-75d8bd0ab00a`, option `531d0fee-e75b-48ba-9921-7105fda7412b`, **score = 4 / ระดับดีมาก**)

- Question: "ผู้เรียนสามารถทำงานร่วมกับผู้อื่นในสถานประกอบการอย่างมีประสิทธิภาพ ทั้งในบทบาทผู้นำและผู้ตาม พร้อมทั้งแสดงความมีวินัยและการปรับตัวตามสถานการณ์"
- BEFORE `description_th`: "ทำงานร่วมกับผู้อื่นในสถานประกอบการอย่างมีประสิทธิภาพ ทั้งในบทบาทผู้นำและผู้ตาม พร้อมทั้งแสดงความมีวินัยและการปรับตัวตามสถานการณ์ " — i.e. exactly the question text minus the subject "ผู้เรียนสามารถ", with **zero level-4-specific qualifier added**.
- Pattern inferred from siblings: level 3 ends "...แต่ต้องได้รับคำแนะนำหรือแนวทางในการทำงาน"; level 2 ends "...แต่จำเป็นต้องได้รับคำแนะนำหรือแนวทางในการทำงาน"; level 1 is a clean negative statement. So level 4 needed a distinct positive qualifier not present in the lower levels.
- **Fix applied** (`description_th_new`): "ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพ ทั้งบทบาทผู้นำและผู้ตาม มีวินัยและปรับตัวตามสถานการณ์ได้ดี" — added "...ได้ดี" as the level-4 qualifier, mirroring the "ได้ดี" cadence commonly used for level-4 in sibling EE questions (e.g. LO1, LO3, LO4, LO5 all end level-4 with "...ได้อย่างครบถ้วน").

I ran a systematic check (question_text minus common subject-prefixes "ผู้เรียนสามารถ"/"นักศึกษาสามารถ"/etc. compared against every description_th across all 47 questions) and this was the **only** instance of the zero-qualifier bug in batch_0.

Several other EE rows were *close* to the question text (see below) but all of them did carry a distinguishing qualifier (e.g. "...ได้อย่างครบถ้วน" for level 4, "...ระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์" for level 3, etc.) — these are NOT the same bug, just verbose repetition of the question stem, which was the main target of compression, not a data-quality flag.

## (b) Rows flagged for human review (low confidence / judgment calls)

None required outright reinterpretation of meaning, but the following deserve a second look because compression trimmed near-duplicate phrasing between levels down to short strings and the reviewer should confirm the residual distinction still feels adequately different in context:

1. **ACC / LO2** (option `5e8d0f09-...`, level 4) — original was already only 45 chars ("วิเคราะห์ข้อมูลได้ดี มีข้อสรุปที่เป็นประโยชน์"); left nearly as-is since there was nothing redundant with question_text to cut, and further shortening would have started cutting the unique content itself.
2. **INTD / LO6** — all four levels use the exact same clause structure ("แสดงออกถึงบุคลิกภาพที่ดี ... สามารถทำงานร่วมกับผู้อื่นได้[อย่างดี/—]"), so the only differentiator between level 4 and level 3 in the *original* data is a single trailing "อย่างดี" — this is a thin distinction inherited from the source data, not something introduced by the edit. Recommend the LO owner strengthen this rubric's level separation independently of this shortening pass.
3. **EE / LO11 level 1** (option `f5b9cef8-...`) — original was very short ("ไม่มีความรับผิดชอบต่อผลกระทบของงานวิศวกรรม", 42 chars) and lacks the "และประเมินผลกระทบต่อสังคมและสิ่งแวดล้อม" clause present in the question and in levels 2–4. Left as-is (faithful to original meaning) but flagged since it's an asymmetric omission in the *source* data, not this edit.
4. **CUL LO1–LO9** structured/bulleted descriptions — these are long multi-criterion rubrics (4 sub-bullets each covering different dimensions e mg. "การจัดการวัตถุดิบ", "การเตรียมและประกอบอาหาร", etc.). Compression tightened each bullet's language but preserved every bullet and its unique claim; given their length and multi-dimensional nature, a subject-matter reviewer (culinary program owner) should sanity-check these more than the shorter single-clause LOs, simply due to volume of content per row.

No other rows required guesswork about meaning — question stems and level-specific qualifiers were clearly separable in the remaining 43 questions.
