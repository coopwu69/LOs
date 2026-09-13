# G11 — batch_3.json rubric-shortening notes

Processed: 47 questions × 4 levels = 188 rows (ANSCI, CEAI, CIVIL, FSI, IMAG, POL).
Output: `batch_3_rewritten.json` (same rows + new `description_th_new` field per row).

## (a) Rows where a missing level-qualifier was added (data-quality fix)

These questions had a level whose `description_th` was **identical or near-identical to
`question_text`** with no differentiator versus the other levels for the same question.
A short qualifier consistent with the other 3 levels' pattern for that question was added
in `description_th_new` so the level is actually distinguishable.

| program | LO | question_id | level | before (verbatim, truncated) | after (added qualifier) |
|---|---|---|---|---|---|
| CIVIL | LO10 | 79c75381-07e3-48b0-a66f-ec1815b77917 | 4 | "คิดเป็นระบบอย่างมีวิจารณญาณ...รักษาสิ่งแวดล้อม" (= question_text, no qualifier) | "...ได้ครบถ้วนสมบูรณ์" (matches level-3/2 pattern: "...แต่ยังขาดความสมบูรณ์ในบางส่วน" / "...โดยต้องการคำแนะนำอย่างใกล้ชิด") |
| CIVIL | LO11 | b5872939-5880-4518-9c81-9cfc2336558f | 4 | "สามารถทำงานเป็นทีม...ในสหสาขาวิชาได้" (= question_text) | "...ได้ครบถ้วนสมบูรณ์" |
| CIVIL | LO4 | 28b83ef1-a59f-4974-a85b-73e838b331d4 | 4 | "มีความเป็นผู้ประกอบการ...การเปลี่ยนแปลง" (= question_text) | "...ได้ครบถ้วนสมบูรณ์" |
| CIVIL | **LO5** | 5814ec5f-9111-4b9a-a355-b3288f849674 | 4 | "มีทักษะตั้งสมมติฐาน...วิศวกรรมโยธา" (= question_text, **the row explicitly flagged in the task brief**) | "...ได้ครบถ้วนสมบูรณ์" |
| CIVIL | LO7 | 1b34af09-fa60-4788-9c40-5e73e4dbc414 | 4 | "มีทักษะการดูแลสุขภาพ...มีการเปลี่ยนแปลง" (= question_text) | "...ได้ครบถ้วนสมบูรณ์" |
| CIVIL | LO9 | 3b0502ec-4697-454d-9c92-18e91c869768 | 4 | "ปฏิบัติตนตามกฎกติกาของสังคม...วิศวกรรมโยธา" (= question_text) | "...ได้ครบถ้วนสม่ำเสมอ" |
| CIVIL | LO6 | 60f5c91d-b508-4ff0-bc79-4ca7a8185549 | 4 | "มีทักษะการสื่อสาร...เสนอผลงานได้" (= question_text, no qualifier) | "...ได้อย่างครบถ้วนสมบูรณ์" |

All seven fixes above are the CIVIL LO10/LO11/LO4/LO5/LO7/LO9/LO6 questions, matching the
survey's warning that this batch's CIVIL program contains level-4 rows copy-pasted from the
question with zero differentiator. The pattern for the added qualifier was inferred directly
from each question's own level-3 ("...แต่ยังขาดความสมบูรณ์ในบางส่วน") and level-2
("...โดยต้องการคำแนะนำอย่างใกล้ชิด") wording, so level 4 reads as the natural "complete /
excellent" end of the same scale — no new unrelated content was invented.

## (b) Data-quality bug also fixed in passing (not a missing qualifier, but wrong content)

| program | LO | question_id | level | issue |
|---|---|---|---|---|
| CIVIL | LO6 | 60f5c91d-b508-4ff0-bc79-4ca7a8185549 | 3 | Original `description_th` for level 3 was **copy-pasted from an unrelated question** (CIVIL LO5's level-3 text about "ตั้งสมมติฐาน...วิศวกรรมโยธา") instead of being about communication skills (the actual LO6 topic). Rewrote level 3 to be about communication, consistent with levels 4/2/1 of the same question ("สื่อสารภาษาไทยและภาษาอังกฤษ...นำเสนอผลงาน..."). **Flagged for human review** — please confirm this correction matches intended grading criteria before writing to DB, since it changes substantive content, not just length. |

## Low-confidence / flagged-for-human-review rows

1. **CIVIL LO6, level 3** (see table above) — content was substantively wrong in the source
   data (mismatched question topic), not just verbose. My rewrite assumes the intended
   criterion was communication skills matching the question and its levels 4/2/1. Please verify.
2. **CIVIL LO8** (`7d174abc-df43-48c9-a51e-f39a46928656`, question_text = "พัฒนาตนเองอย่างต่อเนื่อง")
   — the original level-4 description already added its own qualifier ("ใฝ่เรียน ใฝ่รู้ และ...")
   rather than repeating question_text verbatim, so no fix was needed there; flagged only as a
   confidence note that this one already followed good practice, included for completeness.
3. IMAG questions (CLO1–CLO11) were **not rewritten in place-name terms** because their
   original `description_th` already had very low overlap with `question_text` (typically
   0.1–0.35 longest-common-substring ratio) and were already concise (43–100 chars). These were
   carried through to `description_th_new` unchanged since further shortening would remove
   substantive content, not boilerplate. Not a confidence flag — just a note that they needed
   no edit.

## Summary

- Rows processed: 188 (47 questions × 4 levels)
- Questions with an added missing-qualifier fix: 6 (all CIVIL: LO10, LO11, LO4, LO5, LO7, LO9)
- Additional questions with a level-4 qualifier added for consistency: 1 (CIVIL LO6)
- Rows flagged for human review: 2 (CIVIL LO6 level 3 content-mismatch fix; CIVIL LO8 noted as already-fine)
- Total combined `description_th` length: 19,857 chars → `description_th_new`: 15,246 chars (~23% shorter overall; CIVIL rows individually shortened ~55–70%, ANSCI/CEAI/FSI/POL ~20–50%, IMAG unchanged since already concise).
