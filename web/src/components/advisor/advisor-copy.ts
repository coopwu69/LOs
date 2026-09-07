import type { Locale } from "@/lib/i18n";

// Localized copy for advisor-form steps 3-5 (other / process / report).
//
// Wording locked 2026-09-07 from the user's own itemized breakdown of the
// paper/Google Form (blocks 4-6), cross-checked against the project's
// existing scale conventions:
//   - rating4 matches the paper form's own rating scale (see
//     docs/source/04_political_science_แบบประเมินสหกิจหลักสูตร_รปศ.md:
//     4=ดีเยี่ยม/Excellent, 3=ดี/Good, 2=พอใช้/Satisfactory, 1=ควรปรับปรุง/
//     Needs Improvement) — every rated item in this project other than the
//     report appraisal uses 4 levels, never 5.
//   - rating5 reuses the exact wording already used by the company form's
//     ReportStep (`components/evaluation/copy.ts` -> `rating`), since both
//     are the same "report appraisal" domain and only that domain is 5-level.
// Language rule: `th` values must contain no Latin letters, `en` values
// must contain no Thai characters.

export type AdvisorCopy = {
  /** 4-level scale labels, ordered low -> high (value 1..4). Used by other/center/workplace. */
  rating4: [string, string, string, string];
  /** 5-level scale labels, ordered low -> high (value 1..5). Used by the report step only. */
  rating5: [string, string, string, string, string];
  // Step 3 — other
  otherTitle: string;
  otherItems: [string, string];
  strengths: string;
  strengthsHelp: string;
  improvements: string;
  improvementsHelp: string;
  // Step 4 — cooperative education center + workplace
  centerTitle: string;
  centerItems: [string, string];
  workplaceTitle: string;
  workplaceItems: [string, string, string, string, string];
  futurePlacement: string;
  futureShould: string;
  futureShouldNot: string;
  futureOther: string;
  futureOtherSpecify: string;
  otherComments: string;
  // Step 5 — report
  reportTitle: string;
  reportItems: [string, string, string, string, string];
};

export const ADVISOR_COPY: Record<Locale, AdvisorCopy> = {
  th: {
    rating4: ["ควรปรับปรุง", "พอใช้", "ดี", "ดีเยี่ยม"],
    rating5: ["น้อยที่สุด", "น้อย", "ปานกลาง", "มาก", "มากที่สุด"],
    otherTitle: "ด้านอื่น ๆ",
    otherItems: [
      "ด้านที่ 6 ด้านอื่น ๆ: นักศึกษาสหกิจศึกษาสามารถใช้ภาษาอังกฤษหรือภาษาอื่น ๆ ที่เกี่ยวข้องกับการทำงานและในชีวิตประจำวัน",
      "ด้านที่ 6 ด้านอื่น ๆ: โดยภาพรวม ท่านคิดเห็นว่านักศึกษาสหกิจศึกษามีผลการปฏิบัติงานระดับใด",
    ],
    strengths: "จุดเด่นของนักศึกษา",
    strengthsHelp: "",
    improvements: "ข้อควรปรับปรุงของนักศึกษา",
    improvementsHelp: "",
    centerTitle: "ส่วนที่ 2 ประเมินกระบวนการดำเนินงานของศูนย์สหกิจศึกษาและพัฒนาอาชีพ",
    centerItems: [
      "การดำเนินงานของศูนย์สหกิจศึกษาฯ เช่น การประสานงานกับสถานประกอบการ การคัดเลือกนักศึกษา การนัดหมายนิเทศงาน โดยใช้เวลาเหมาะสมและเพียงพอ และสื่อสารชัดเจน",
      "ความสะดวกรวดเร็ว ความพร้อมในการประสานงานและการบริการของศูนย์สหกิจศึกษาฯ",
    ],
    workplaceTitle: "ส่วนที่ 3 ความเข้าใจเรื่องสหกิจศึกษาและการสนับสนุนจากสถานประกอบการ",
    workplaceItems: [
      "ความพร้อมและความร่วมมือของสถานประกอบการ การประสานงานกับมหาวิทยาลัย การจัดสิ่งอำนวยความสะดวกในการปฏิบัติงาน",
      "การมอบหมายให้พนักงานที่มีความรู้และประสบการณ์เป็นผู้ดูแลนักศึกษา",
      "การจัดทำโครงงานและรายงานสหกิจศึกษา ตรงและสอดคล้องกับสาขาวิชา มีความเหมาะสมและเกิดประโยชน์ต่อหน่วยงาน",
      "สถานประกอบการมีการสนับสนุนด้านสวัสดิการและค่าตอบแทนที่เหมาะสม ความเหมาะสมของที่ตั้งสถานประกอบการและสภาพแวดล้อมที่ปลอดภัย",
      "ความพึงพอใจต่อสถานประกอบการโดยภาพรวม",
    ],
    futurePlacement: "ความเห็นต่อการจัดส่งนักศึกษามาปฏิบัติงานในปีต่อไป",
    futureShould: "ควรส่ง",
    futureShouldNot: "ไม่ควรส่ง",
    futureOther: "อื่น ๆ",
    futureOtherSpecify: "โปรดระบุ",
    otherComments: "ข้อคิดเห็นอื่น ๆ เพิ่มเติม",
    reportTitle: "ส่วนที่ 4 แบบประเมินผลรายงานสหกิจศึกษา",
    reportItems: [
      "รายงาน/โครงงานเป็นไปตามวัตถุประสงค์และความต้องการของหน่วยงาน",
      "ความสม่ำเสมอในการขอรับคำปรึกษาและรายงานความก้าวหน้าการจัดทำรายงาน/โครงงาน",
      "เนื้อหารายงาน/โครงงานเป็นไปตามหลักวิชาการ",
      "ความถูกต้องในเชิงเนื้อหาและการจัดเก็บข้อมูล",
      "ประโยชน์ของรายงาน/โครงงานต่อหน่วยงานและการนำไปใช้ได้จริง",
    ],
  },
  en: {
    rating4: ["Needs improvement", "Satisfactory", "Good", "Excellent"],
    rating5: ["Lowest", "Low", "Moderate", "High", "Highest"],
    otherTitle: "Others",
    otherItems: [
      "Topic 6 Others: Ability to use English or other language skills in the working environment and daily life",
      "Topic 6 Others: Overall Performance Rating",
    ],
    strengths: "Strength of the student",
    strengthsHelp: "",
    improvements: "Improvement of the student",
    improvementsHelp: "",
    centerTitle: "Part 2: Evaluation of the working process of the Center for Cooperative Education and Career Development",
    centerItems: [
      "Cooperative education procedures (i.e. matching, work site visit arrangement and communication)",
      "The convenience, promptness, and readiness of the Center for Cooperative Education and Career Development staff",
    ],
    workplaceTitle: "Part 3: Comprehension of the cooperative education concept and support from the workplace",
    workplaceItems: [
      "The readiness and cooperation of the workplace",
      "The suitability of the job supervisor assigned to the student",
      "The job and project assigned are related to the student's field of study, appropriate, and beneficial to the workplace",
      "Welfare, appropriate compensation, suitable location, and a safe working environment",
      "Overall satisfaction with the workplace",
    ],
    futurePlacement: "Evaluation of this enterprise for future placement of students",
    futureShould: "Yes, this is an appropriate enterprise for the Cooperative Education student",
    futureShouldNot: "No, this is not an appropriate enterprise for the Cooperative Education student",
    futureOther: "Other",
    futureOtherSpecify: "Please specify",
    otherComments: "Other comments",
    reportTitle: "Part 4: Cooperative Education Report Appraisal",
    reportItems: [
      "The report or project meets the purpose and requirements of the workplace",
      "Consistency in seeking advice and reporting progress on the report or project",
      "The content of the report or project follows academic principles",
      "Accuracy of content and data arrangement",
      "The report or project is beneficial and practical for the workplace",
    ],
  },
};
