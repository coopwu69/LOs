import type { Locale } from "@/lib/i18n";

// Localized copy for advisor-form sections 4-6 (report / comments /
// center + workplace), in the G9 display order.
//
// Wording locked 2026-09-07 from the user's own itemized breakdown of the
// paper/Google Form (blocks 4-6); section order, headings, and the report
// scale updated for the G4/G9 restructure (2026-09-11).
//
// Scale note: since G4 every rated item uses a 4-level scale — the old
// "report is 5-level" exception no longer exists.
//   - rating4 (ควรปรับปรุง/พอใช้/ดี/ดีเยี่ยม) — comments, center, workplace
//     items; wording matches the paper form's own scale (see
//     docs/source/04_political_science_แบบประเมินสหกิจหลักสูตร_รปศ.md).
//   - reportRating (ต้องปรับปรุง/พอใช้/ดี/ดีมาก) — report appraisal, per the
//     G4 spec table.
// TODO(Q4): the two 4-level label sets intentionally differ for now —
//   confirm whether to unify them.
// TODO(Q13): rendered group titles carry no embedded "ส่วนที่ N" — the
//   wizard header already renders the section number; embedding one here
//   would show a stale number on every reorder (default until Q13 is
//   answered).
// TODO(Q14): centerItems/centerTitle should eventually import from
//   lib/coop-center-copy.ts (the shared module owned by the company-form
//   agent) instead of keeping a second copy here.
// Language rule: `th` values must contain no Latin letters, `en` values
// must contain no Thai characters.

export type AdvisorCopy = {
  /** 4-level scale labels, ordered low -> high (value 1..4). Used by comments/center/workplace. */
  rating4: [string, string, string, string];
  /** 4-level report-appraisal labels, ordered low -> high (value 1..4). */
  reportRating: [string, string, string, string];
  // Section 4 — report
  reportTitle: string;
  reportItems: [string, string, string, string, string];
  // Section 5 — comments
  otherTitle: string;
  otherItems: [string, string];
  strengths: string;
  strengthsHelp: string;
  improvements: string;
  improvementsHelp: string;
  // Section 6 — cooperative education center + workplace
  centerTitle: string;
  centerItems: [string, string];
  workplaceTitle: string;
  workplaceItems: [string, string, string, string, string];
  premiumWorkplace: string;
  premiumYes: string;
  premiumNo: string;
  premiumReview: string;
  premiumReviewReason: string;
  futurePlacement: string;
  futureShould: string;
  futureShouldNot: string;
  futureOther: string;
  futureOtherSpecify: string;
  otherComments: string;
};

export const ADVISOR_COPY: Record<Locale, AdvisorCopy> = {
  th: {
    rating4: ["ควรปรับปรุง", "พอใช้", "ดี", "ดีเยี่ยม"],
    reportRating: ["ต้องปรับปรุง", "พอใช้", "ดี", "ดีมาก"],
    reportTitle: "ส่วนที่ 4 แบบประเมินผลรายงานสหกิจศึกษา",
    reportItems: [
      "รายงาน/โครงงานเป็นไปตามวัตถุประสงค์และความต้องการของหน่วยงาน",
      "ความสม่ำเสมอในการขอรับคำปรึกษาและรายงานความก้าวหน้าการจัดทำรายงาน/โครงงาน",
      "เนื้อหารายงาน/โครงงานเป็นไปตามหลักวิชาการ",
      "ความถูกต้องในเชิงเนื้อหาและการจัดเก็บข้อมูล",
      "ประโยชน์ของรายงาน/โครงงานต่อหน่วยงานและการนำไปใช้ได้จริง",
    ],
    otherTitle: "ส่วนที่ 5 ข้อคิดเห็น",
    otherItems: [
      "นักศึกษาสหกิจศึกษาสามารถใช้ภาษาอังกฤษหรือภาษาอื่น ๆ ที่เกี่ยวข้องกับการทำงานและในชีวิตประจำวัน",
      "โดยภาพรวม ท่านคิดเห็นว่านักศึกษาสหกิจศึกษามีผลการปฏิบัติงานระดับใด",
    ],
    strengths: "จุดเด่นของนักศึกษา",
    strengthsHelp: "",
    improvements: "ข้อควรปรับปรุงของนักศึกษา",
    improvementsHelp: "",
    centerTitle: "ประเมินกระบวนการดำเนินงานของศูนย์สหกิจศึกษาและพัฒนาอาชีพ",
    centerItems: [
      "การดำเนินงานของศูนย์สหกิจศึกษาฯ เช่น การประสานงานกับสถานประกอบการ การคัดเลือกนักศึกษา การนัดหมายนิเทศงาน โดยใช้เวลาเหมาะสมและเพียงพอ และสื่อสารชัดเจน",
      "ความสะดวกรวดเร็ว ความพร้อมในการประสานงานและการบริการของศูนย์สหกิจศึกษาฯ",
    ],
    workplaceTitle: "ความเข้าใจเรื่องสหกิจศึกษาและการสนับสนุนจากสถานประกอบการ",
    workplaceItems: [
      "ความพร้อมและความร่วมมือของสถานประกอบการ การประสานงานกับมหาวิทยาลัย การจัดสิ่งอำนวยความสะดวกในการปฏิบัติงาน",
      "การมอบหมายให้พนักงานที่มีความรู้และประสบการณ์เป็นผู้ดูแลนักศึกษา",
      "การจัดทำโครงงานและรายงานสหกิจศึกษา ตรงและสอดคล้องกับสาขาวิชา มีความเหมาะสมและเกิดประโยชน์ต่อหน่วยงาน",
      "สถานประกอบการมีการสนับสนุนด้านสวัสดิการและค่าตอบแทนที่เหมาะสม ความเหมาะสมของที่ตั้งสถานประกอบการและสภาพแวดล้อมที่ปลอดภัย",
      "ความพึงพอใจต่อสถานประกอบการโดยภาพรวม",
    ],
    premiumWorkplace: "ควรเป็นหน่วยงานพรีเมี่ยมหรือไม่",
    premiumYes: "ใช่",
    premiumNo: "ไม่ใช่",
    premiumReview: "ทบทวนดูก่อน",
    premiumReviewReason: "โปรดระบุเหตุผล",
    futurePlacement: "ความเห็นต่อการจัดส่งนักศึกษามาปฏิบัติงานในปีต่อไป",
    futureShould: "ควรส่ง",
    futureShouldNot: "ไม่ควรส่ง",
    futureOther: "อื่น ๆ",
    futureOtherSpecify: "โปรดระบุ",
    otherComments: "ข้อคิดเห็นอื่น ๆ เพิ่มเติม",
  },
  en: {
    rating4: ["Needs improvement", "Satisfactory", "Good", "Excellent"],
    reportRating: ["Needs improvement", "Fair", "Good", "Very good"],
    reportTitle: "Part 4: Cooperative Education Report Appraisal",
    reportItems: [
      "The report or project meets the purpose and requirements of the workplace",
      "Consistency in seeking advice and reporting progress on the report or project",
      "The content of the report or project follows academic principles",
      "Accuracy of content and data arrangement",
      "The report or project is beneficial and practical for the workplace",
    ],
    otherTitle: "Part 5: Comments",
    otherItems: [
      "Ability to use English or other language skills in the working environment and daily life",
      "Overall Performance Rating",
    ],
    strengths: "Strength of the student",
    strengthsHelp: "",
    improvements: "Improvement of the student",
    improvementsHelp: "",
    centerTitle: "Evaluation of the working process of the Center for Cooperative Education and Career Development",
    centerItems: [
      "Cooperative education procedures (i.e. matching, work site visit arrangement and communication)",
      "The convenience, promptness, and readiness of the Center for Cooperative Education and Career Development staff",
    ],
    workplaceTitle: "Comprehension of the cooperative education concept and support from the workplace",
    workplaceItems: [
      "The readiness and cooperation of the workplace",
      "The suitability of the job supervisor assigned to the student",
      "The job and project assigned are related to the student's field of study, appropriate, and beneficial to the workplace",
      "Welfare, appropriate compensation, suitable location, and a safe working environment",
      "Overall satisfaction with the workplace",
    ],
    // TODO(Q12): English wording for the premium-workplace question is a
    // proposal — confirm the official term for "หน่วยงานพรีเมี่ยม".
    premiumWorkplace: "Should this be designated a premium workplace?",
    premiumYes: "Yes",
    premiumNo: "No",
    premiumReview: "Needs further review",
    premiumReviewReason: "Please specify the reason",
    futurePlacement: "Evaluation of this enterprise for future placement of students",
    futureShould: "Yes, this is an appropriate enterprise for the Cooperative Education student",
    futureShouldNot: "No, this is not an appropriate enterprise for the Cooperative Education student",
    futureOther: "Other",
    futureOtherSpecify: "Please specify",
    otherComments: "Other comments",
  },
};
