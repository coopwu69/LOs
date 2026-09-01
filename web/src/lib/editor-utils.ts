// Client-side helpers for the editor. NOT a server module.

export type StandardOption = {
  id: string;
  score: number;
  labelTh: string;
  descriptionTh: string | null;
  sequence: number;
};

const STANDARD_4: { score: number; labelTh: string }[] = [
  { score: 4, labelTh: "ระดับดีมาก" },
  { score: 3, labelTh: "ระดับดี" },
  { score: 2, labelTh: "ระดับพอใช้" },
  { score: 1, labelTh: "ระดับควรปรับปรุง" },
];

export function buildStandard4Options(): StandardOption[] {
  return STANDARD_4.map((o, i) => ({
    id: crypto.randomUUID(),
    score: o.score,
    labelTh: o.labelTh,
    descriptionTh: null,
    sequence: i + 1,
  }));
}

export function newId(): string {
  return crypto.randomUUID();
}
