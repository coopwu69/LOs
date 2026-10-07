// Live score math shared by the company and advisor wizards (G7, goal.md).
// Reads the form's current DOM state and sums only the answered items, so the
// sticky score bar shows "current pace" rather than a score that treats
// unanswered questions as zero. Mirrors the server-side scoring in each
// wizard's actions.ts. Call from event handlers or effects, never during
// render — reading a form ref during render breaks the react-hooks/refs rule.

export type LiveScoreQuestion = { id: string; options: { score: number }[] };

export type LiveScores = {
  loScore: number;
  loMax: number;
  reportScore: number;
  reportMax: number;
};

// Every rated item in the project uses a 4-level scale (G4).
const REPORT_MAX_PER_ITEM = 4;

export function computeLiveScores(
  form: HTMLFormElement,
  loQuestions: LiveScoreQuestion[],
  reportFieldNames: readonly string[],
): LiveScores {
  const data = new FormData(form);

  // Per-question max across all competency questions, mirroring the server's
  // `loMax` (max option score, fallback 4 when no DB options).
  let loMaxPerQuestion = 0;
  let anyOptions = false;
  for (const q of loQuestions) {
    if (q.options.length > 0) anyOptions = true;
    for (const opt of q.options) {
      if (opt.score > loMaxPerQuestion) loMaxPerQuestion = opt.score;
    }
  }
  if (!anyOptions) loMaxPerQuestion = 4;

  let loScore = 0;
  let loCount = 0;
  for (const q of loQuestions) {
    const score = answeredScore(data.get(`lo-${q.id}`));
    if (score === null) continue;
    loScore += score;
    loCount++;
  }

  let reportScore = 0;
  let reportCount = 0;
  for (const name of reportFieldNames) {
    const score = answeredScore(data.get(name));
    if (score === null) continue;
    reportScore += score;
    reportCount++;
  }

  return {
    loScore,
    loMax: loCount * loMaxPerQuestion,
    reportScore,
    reportMax: reportCount * REPORT_MAX_PER_ITEM,
  };
}

function answeredScore(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const score = parseInt(String(value), 10);
  return Number.isNaN(score) ? null : score;
}
