import type { Locale } from "./i18n";

// The "how did the coop-education center do" questions (2 items) appear in
// more than one form — the advisor form had them first (locked 2026-09-07),
// the company form gained them in G5 (moving what used to be its own
// open-ended "process" section into the feedback step), and the student
// form (G10) carries them too. Same questions, three different respondents
// giving three perspectives — not accidental duplication (goal.md G5) — so
// the wording and scale live here once instead of being copy-pasted into
// each form's own copy file, where they'd inevitably drift.
//
// Scale note: this rating array is deliberately NOT the same wording as the
// report/project scale (`reportRating` in copy.ts / advisor-copy.ts —
// ดีมาก/ดี/พอใช้/ต้องปรับปรุง). The source feedback specified these two
// 4-level scales with different labels; goal.md Q4 asks whether that's
// intentional or should be unified. Until answered, keep them separate.
export const COOP_CENTER_COPY: Record<
  Locale,
  {
    title: string;
    items: readonly [string, string];
    /** 4-level scale labels, ordered low -> high (value 1..4). */
    rating: readonly [string, string, string, string];
  }
> = {
  th: {
    title: "ประเมินกระบวนการดำเนินงานของศูนย์สหกิจศึกษาและพัฒนาอาชีพ",
    items: [
      "การดำเนินงานของศูนย์สหกิจศึกษาฯ เช่น การประสานงานกับสถานประกอบการ การคัดเลือกนักศึกษา การนัดหมายนิเทศงาน โดยใช้เวลาเหมาะสมและเพียงพอ และสื่อสารชัดเจน",
      "ความสะดวกรวดเร็ว ความพร้อมในการประสานงานและการบริการของศูนย์สหกิจศึกษาฯ",
    ],
    rating: ["ควรปรับปรุง", "พอใช้", "ดี", "ดีเยี่ยม"],
  },
  en: {
    title: "Evaluation of the working process of the Center for Cooperative Education and Career Development",
    items: [
      "Cooperative education procedures (i.e. matching, work site visit arrangement and communication)",
      "The convenience, promptness, and readiness of the Center for Cooperative Education and Career Development staff",
    ],
    rating: ["Needs improvement", "Satisfactory", "Good", "Excellent"],
  },
};
