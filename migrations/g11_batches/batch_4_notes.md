# Batch 4 Rubric Rewrite Notes

## Summary
- Total rows processed: 184
- Total questions processed: 46 (programs: SCI, LOG, DCA, MECH, IIT, ENG)
- Data-quality check (per point 5 of task): scanned all 46 questions for (a) any level whose
  `description_th` is an exact verbatim copy of `question_text` with zero added qualifier, and
  (b) any two levels within the same question sharing an identical description. **Neither issue
  was found in batch_4.json** — every question's 4 levels already had distinct, non-empty
  qualifiers beyond the shared question stem. No CIVIL-LO5-style "missing qualifier" bug exists
  in this batch, so no added/invented qualifier text was needed anywhere.

## (a) Questions where a missing-qualifier fix was applied
None. All 184 rows already had a genuine level-specific qualifier distinguishing them from
question_text, so no synthetic qualifier text was added.

## (b) Rewrite approach
Most questions in this batch (LOG, DCA, MECH, IIT, ENG, and most SCI questions) already had
`description_th` fields that were short, self-contained level descriptors NOT heavily repeating
`question_text` verbatim (e.g. "สื่อสารได้ชัดเจน เข้าใจง่าย..." rather than restating the full
question). For these ~38 questions (152 rows), `description_th_new` was left equal to the
original `description_th` (trimmed of trailing whitespace only) — they were already concise and
shortening further risked losing the meaningful differentiator.

For the 8 SCI questions (32 rows) where `description_th` did verbatim-copy a long chunk of
`question_text` before appending a short qualifier (a real instance of the "repeats question_text"
problem described in the task), the shared stem was compressed to a short paraphrase and the
level-specific qualifier was preserved in full, unweakened. Rewritten question_ids:
- 0039619c-cd1e-4405-add4-39b7338ed4f6 (SCI LO1)
- 9a7a3800-ce7f-4468-84af-76e6b0b89c86 (SCI LO2)
- 832a6789-ed67-41c9-bb6b-b4d6f869f90b (SCI LO3)
- 870376ac-59dd-468f-a82d-0aceebe3b291 (SCI LO4)
- ff117089-f016-4776-b017-998ead475d4f (SCI LO5)
- c51c41c1-c572-4452-9e5a-538d9791b093 (SCI LO6)
- 93cc8843-8909-4480-a19f-4b5697a56e1d (SCI LO7)
- f4d6dcf6-459d-458a-a485-6552c1c14975 (SCI LO9)

Example (SCI LO1, level 4):
- BEFORE (117c): "อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ได้อย่างครบถ้วนและถูกต้อง"
- AFTER (~85c): "อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ทางวิทยาศาสตร์และคณิตศาสตร์ได้อย่างครบถ้วนและถูกต้อง"
(Minor stem compression only — the qualifier "ได้อย่างครบถ้วนและถูกต้อง" is fully preserved.)

Note: two other SCI questions (LO8 "จริยธรรมขั้นพื้นฐาน 4 ด้าน" and LO10/LO11 "ลักษณะนักวิจัย/
บุคคล N ด้าน") also repeat question_text substantially, but their descriptions are already very
short count-based qualifiers ("ครบทั้ง 4 ด้าน", "2 ใน 4 ด้าน", etc.) — these were left as-is
since further shortening the stem ("ปฏิบัติตามจริยธรรมขั้นพื้นฐาน") is already minimal and any
further cut would risk ambiguity about what "ด้าน" refers to.

## Rows flagged for human review (low confidence)
None. All 184 rows had clear, unambiguous level-specific qualifiers to preserve, and no
grammar-breaking truncation risk was identified during the rewrite. If reviewers want the ~38
already-short LOG/DCA/MECH/IIT/ENG questions further condensed, that would be a stylistic pass
rather than a correctness fix — flagging this as a possible follow-up scope question rather than
a low-confidence edit.
