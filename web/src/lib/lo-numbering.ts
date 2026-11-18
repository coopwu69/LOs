import type { SectionRow } from "./types";

export const PRIMARY_DOMAINS = new Set(["knowledge", "skills", "knowledge_skills", "social_skills"]);

type Section = { id: string; sequence: number; domain_type: string };
type Question = { id: string; sequence: number; section_id?: string | null };

// Number in the same order as the wizards: knowledge/skills, then ethics/character.
// IDs and stored source codes are untouched; these numbers are display labels.
export function getLoQuestionNumbers(sections: Section[], questions: Question[]): Map<string, number> {
  const orderedSections = [...sections].sort((a, b) =>
    Number(!PRIMARY_DOMAINS.has(a.domain_type)) - Number(!PRIMARY_DOMAINS.has(b.domain_type)) || a.sequence - b.sequence,
  );
  const numbers = new Map<string, number>();
  for (const section of orderedSections) {
    for (const question of questions.filter((q) => q.section_id === section.id).sort((a, b) => a.sequence - b.sequence)) {
      numbers.set(question.id, numbers.size + 1);
    }
  }
  return numbers;
}

// Collapse questions that repeat the same LO code, keeping the tersest wording.
// One rule shared by the live form, print and every Word export so they show
// the same questions. The company form's server validation (actions.ts) also
// dedupes by lo_code, so keep them in sync.
export function dedupeByLoCode<T extends { id: string; lo_code: string | null; text: string; sequence: number }>(questions: T[]): T[] {
  const unique = new Map<string, T>();
  for (const question of questions) {
    const key = question.lo_code?.trim().toUpperCase() || question.id;
    const existing = unique.get(key);
    if (!existing || question.text.length < existing.text.length) unique.set(key, question);
  }
  return [...unique.values()].sort((a, b) => a.sequence - b.sequence);
}

export function numberLoSections(rawSections: SectionRow[]): SectionRow[] {
  const keptIds = new Set(dedupeByLoCode(rawSections.flatMap((s) => s.questions)).map((q) => q.id));
  const sections = rawSections.map((s) => ({ ...s, questions: s.questions.filter((q) => keptIds.has(q.id)) }));
  const numbers = getLoQuestionNumbers(sections, sections.flatMap((s) => s.questions.map((q) => ({ ...q, section_id: s.id }))));
  return [...sections].sort((a, b) =>
    Number(!PRIMARY_DOMAINS.has(a.domain_type)) - Number(!PRIMARY_DOMAINS.has(b.domain_type)) || a.sequence - b.sequence,
  ).map((section) => ({
    ...section,
    part: PRIMARY_DOMAINS.has(section.domain_type) ? 1 : 2,
    questions: [...section.questions].sort((a, b) => a.sequence - b.sequence).map((q) => ({ ...q, lo_code: `LO${numbers.get(q.id)}` })),
  }));
}
