import type { ReactNode } from "react";

/**
 * Renders `text` with the first occurrence of `keyword` visually emphasized
 * (bold + underline). Used on the review dashboard so a reader scanning three
 * near-identical long form titles ("...จากสถานประกอบการ" / "...จากอาจารย์นิเทศ"
 * / "แบบสอบถามนักศึกษา...") can tell them apart from the one distinguishing
 * word instead of reading the whole sentence — see `FORM_NAME_HIGHLIGHT` in
 * `lib/form-names.ts` for which word is emphasized per role/locale.
 *
 * Falls back to the plain text unchanged if `keyword` isn't found (never
 * throws — a missing match should never break rendering).
 */
export function highlightKeyword(text: string, keyword: string): ReactNode {
  if (!keyword) return text;
  const index = text.indexOf(keyword);
  if (index === -1) return text;
  const before = text.slice(0, index);
  const after = text.slice(index + keyword.length);
  return (
    <>
      {before}
      <u className="font-bold decoration-2 underline-offset-2">{keyword}</u>
      {after}
    </>
  );
}
