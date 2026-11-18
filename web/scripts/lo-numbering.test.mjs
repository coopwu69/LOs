import assert from "node:assert/strict";
import test from "node:test";
import { getLoQuestionNumbers, numberLoSections } from "../src/lib/lo-numbering.ts";

const sections = [
  { id: "ethics", domain_type: "ethics", sequence: 1 },
  { id: "skills", domain_type: "skills", sequence: 3 },
  { id: "knowledge", domain_type: "knowledge", sequence: 2 },
];
const questions = [
  { id: "q9", section_id: "ethics", sequence: 1, lo_code: "LO9" },
  { id: "q6", section_id: "skills", sequence: 2, lo_code: "LO6" },
  { id: "q3", section_id: "skills", sequence: 1, lo_code: "LO3" },
  { id: "q1", section_id: "knowledge", sequence: 1, lo_code: "PLO1" },
];

test("numbers follow visible section and question order, not original codes", () => {
  assert.deepEqual([...getLoQuestionNumbers(sections, questions)], [["q1", 1], ["q3", 2], ["q6", 3], ["q9", 4]]);
});
test("IIT begins at LO1 despite source codes 3, 4, 5, 7, 8, 9", () => {
  const qs = [3, 4, 5, 7, 8, 9].map((n, i) => ({ id: `id-${n}`, lo_code: `LO${n}`, section_id: "skills", sequence: i + 1 }));
  assert.deepEqual([...getLoQuestionNumbers(sections, qs).values()], [1, 2, 3, 4, 5, 6]);
});
test("adding and deleting questions leaves no numbering gaps", () => {
  const remaining = questions.filter((q) => q.id !== "q3");
  assert.deepEqual([...getLoQuestionNumbers(sections, remaining).values()], [1, 2, 3]);
  remaining.push({ id: "new", section_id: "knowledge", sequence: 2 });
  assert.deepEqual([...getLoQuestionNumbers(sections, remaining)], [["q1", 1], ["new", 2], ["q6", 3], ["q9", 4]]);
});
test("print/export labels match form labels without mutating source codes or IDs", () => {
  const nested = sections.map((s) => ({ ...s, questions: questions.filter((q) => q.section_id === s.id) }));
  const before = structuredClone(nested);
  const numbered = numberLoSections(nested);
  const labels = Object.fromEntries(numbered.flatMap((s) => s.questions.map((q) => [q.id, q.lo_code])));
  assert.deepEqual(labels, { q9: "LO4", q3: "LO2", q6: "LO3", q1: "LO1" });
  assert.deepEqual(nested, before);
});
test("empty sections do not consume numbers; empty curriculum is supported", () => {
  assert.deepEqual([...getLoQuestionNumbers(sections, [])], []);
  assert.deepEqual(numberLoSections([]), []);
});
test("duplicate LO codes collapse to the tersest wording, same as the live form", () => {
  const dup = [
    { id: "a", section_id: "skills", sequence: 1, lo_code: "LO1", text: "ข้อความยาวกว่ามาก" },
    { id: "b", section_id: "skills", sequence: 2, lo_code: "lo1 ", text: "สั้น" },
    { id: "c", section_id: "skills", sequence: 3, lo_code: "LO2", text: "อีกข้อ" },
  ];
  const numbered = numberLoSections([{ id: "skills", domain_type: "skills", sequence: 1, title_th: "", title_en: null, part: 1, questions: dup }]);
  assert.deepEqual(numbered[0].questions.map((q) => [q.id, q.lo_code]), [["b", "LO1"], ["c", "LO2"]]);
});
