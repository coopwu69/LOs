import type { Locale } from "@/lib/i18n";
import { WIZARD_COPY } from "@/components/evaluation";
import { COOP_CENTER_COPY } from "@/lib/coop-center-copy";

// Localized copy for the student post-placement questionnaire (G10,
// goal.md — the system's 3rd form). Source: "Coop Evaluation Form _
// ระบบแบบประเมิน ศูนย์สหกิจศึกษา ม.วลัยลักษณ์.pdf" (7 pages, 33 items),
// restructured per goal.md's confirmed changes: LO questions pulled from
// the program's own data instead of a fixed 22-item list, everything
// scored on the project's standard 4-level scale (was 1-5), and the
// coop-center questions (section 6) sourced from lib/coop-center-copy.ts
// instead of a 3rd copy of wording that's already duplicated once between
// the company and advisor forms (goal.md Q14).
//
// Fields shared with the other two forms (student code, name, school,
// program, semester, academic year) reuse WIZARD_COPY per goal.md's own
// instruction ("ห้ามแปลใหม่") rather than being retyped here.
//
// English wording for everything below that's unique to this form
// (compensation/accommodation questions, workplace-support items) is a
// draft translation — goal.md flags this section as needing the coop
// center's review before it's treated as final (Q17).
// Language rule: `th` values must contain no Latin letters, `en` values
// must contain no Thai characters.

export type StudentCopy = {
  steps: readonly [string, string, string][];
  disclosure: string;
  // Section 1
  workplaceName: string;
  workplaceAddress: string;
  // Section 2
  compensationType: string;
  compensationNone: string;
  compensationMoney: string;
  compensationBenefits: string;
  compensationMoneyBenefits: string;
  dailyWage: string;
  monthlyWage: string;
  amountHelper: string;
  benefitsReceived: string;
  benefitHousing: string;
  benefitMeals: string;
  benefitTransport: string;
  benefitMedical: string;
  benefitLifeInsurance: string;
  benefitAccidentInsurance: string;
  benefitUniform: string;
  benefitOther: string;
  accommodationCost: string;
  foodCost: string;
  travelCost: string;
  bookFeeCost: string;
  materialInsuranceCost: string;
  monthlyRentCost: string;
  otherExpenses: string;
  otherExpensesHelper: string;
  accommodationInfo: string;
  accommodationInfoHelper: string;
  recommendAccommodation: string;
  recommendYes: string;
  recommendNo: string;
  wholePlacementHelper: string;
  // Section 5
  ownStrengths: string;
  ownImprovements: string;
  // Section 6
  workplaceSupportTitle: string;
  workplaceSupportItems: [string, string, string, string, string];
  futurePlacement: string;
  futureShould: string;
  futureShouldNot: string;
  futureOther: string;
  futureOtherSpecify: string;
  otherComments: string;
  // Shared building blocks
  centerTitle: string;
  centerItems: readonly [string, string];
  rating4: readonly [string, string, string, string];
};

export const STUDENT_COPY: Record<Locale, StudentCopy> = {
  th: {
    steps: [
      ["ข้อมูลทั่วไป", "ข้อมูลทั่วไป", "รหัสนักศึกษา หลักสูตร ภาคการศึกษา และหน่วยงานที่ปฏิบัติงาน"],
      ["ค่าใช้จ่ายและที่พัก", "ค่าใช้จ่ายและที่พัก", "ค่าตอบแทน สวัสดิการ และค่าใช้จ่ายระหว่างปฏิบัติงานสหกิจศึกษา"],
      [WIZARD_COPY.th.steps[2][0], WIZARD_COPY.th.steps[2][0], "ประเมินตนเองตามผลลัพธ์การเรียนรู้ (LO) ด้านความรู้และทักษะของหลักสูตร"],
      [WIZARD_COPY.th.steps[3][0], WIZARD_COPY.th.steps[3][0], "ประเมินตนเองตามผลลัพธ์การเรียนรู้ (LO) ด้านจริยธรรมและลักษณะบุคคล"],
      ["จุดเด่น/พัฒนา", "จุดเด่นและสิ่งที่ต้องพัฒนา", "สะท้อนจุดเด่นของตนเองและสิ่งที่ต้องการพัฒนาเพิ่มเติม"],
      ["ศูนย์สหกิจ+หน่วยงาน", "ศูนย์สหกิจศึกษาและสถานประกอบการ", "ประเมินกระบวนการของศูนย์สหกิจศึกษาฯ การสนับสนุนจากสถานประกอบการ และข้อคิดเห็น"],
    ],
    disclosure: "กรุณาให้ข้อมูลตามความเป็นจริง ข้อมูลนี้ไม่มีผลต่อการประเมินผลปฏิบัติงาน และใช้เพื่อพัฒนาการจัดสหกิจศึกษาเท่านั้น",
    workplaceName: "ชื่อหน่วยงานที่ปฏิบัติงานสหกิจศึกษา",
    workplaceAddress: "ที่ตั้ง / ที่อยู่ของหน่วยงาน",
    compensationType: "ค่าตอบแทนหรือสวัสดิการที่ได้รับ",
    compensationNone: "ไม่มี",
    compensationMoney: "เงิน",
    compensationBenefits: "สวัสดิการ",
    compensationMoneyBenefits: "เงินและสวัสดิการ",
    dailyWage: "ค่าตอบแทนรายวัน (บาท/วัน)",
    monthlyWage: "ค่าตอบแทนรายเดือน (บาท)",
    amountHelper: "ระบุ 0 ถ้าไม่ได้รับ",
    benefitsReceived: "สวัสดิการที่ได้รับ",
    benefitHousing: "ที่พัก",
    benefitMeals: "อาหาร",
    benefitTransport: "รถรับส่ง",
    benefitMedical: "ค่ารักษาพยาบาล",
    benefitLifeInsurance: "ประกันชีวิต",
    benefitAccidentInsurance: "ประกันอุบัติเหตุ",
    benefitUniform: "เครื่องแบบ",
    benefitOther: "สวัสดิการอื่น ๆ (ถ้ามี)",
    accommodationCost: "ค่าที่พักโดยประมาณ (บาท)",
    foodCost: "ค่าอาหารโดยประมาณ (บาท)",
    travelCost: "ค่าเดินทาง (บาท)",
    bookFeeCost: "ค่าหนังสือและค่าธรรมเนียมอื่น ๆ (บาท)",
    materialInsuranceCost: "ค่าวัสดุหรือค่าประกันภัย (บาท)",
    monthlyRentCost: "ค่าเช่าที่พักต่อเดือน (บาท)",
    otherExpenses: "ค่าใช้จ่ายอื่น ๆ โปรดระบุพร้อมจำนวนเงิน",
    otherExpensesHelper: "เช่น ค่าโทรศัพท์ 1,000 บาท",
    accommodationInfo: "ข้อมูลที่พัก (ชื่อ เบอร์โทรศัพท์ และที่ตั้ง)",
    accommodationInfoHelper: "ระบุเพื่อเป็นประโยชน์แก่นักศึกษารุ่นต่อไป",
    recommendAccommodation: "ท่านแนะนำที่พักนี้หรือไม่",
    recommendYes: "แนะนำ",
    recommendNo: "ไม่แนะนำ",
    wholePlacementHelper: "ตลอดการปฏิบัติงาน",
    ownStrengths: "จุดเด่นของตนเอง",
    ownImprovements: "สิ่งที่ต้องการพัฒนาเพิ่มเติม",
    workplaceSupportTitle: "การสนับสนุนจากสถานประกอบการ",
    workplaceSupportItems: [
      "ความเอาใจใส่ดูแลนักศึกษาของพนักงานที่ปรึกษาหรือฝ่ายบุคคล",
      "การจัดให้มีพนักงานที่ปรึกษาที่มีความรู้และประสบการณ์ดูแลนักศึกษา",
      "การสนับสนุนด้านสวัสดิการและค่าตอบแทนที่เหมาะสม",
      "ความเหมาะสมของที่ตั้งสถานประกอบการและสภาพแวดล้อมที่ปลอดภัย",
      "ความพึงพอใจต่อสถานประกอบการโดยภาพรวม",
    ],
    futurePlacement: "ควรจัดส่งนักศึกษามาปฏิบัติงานสหกิจศึกษาที่หน่วยงานนี้ต่อไปหรือไม่",
    futureShould: "ควรส่ง",
    futureShouldNot: "ไม่ควรส่ง",
    futureOther: "อื่น ๆ",
    futureOtherSpecify: "โปรดระบุ",
    otherComments: "ข้อคิดเห็นเพิ่มเติม",
    centerTitle: COOP_CENTER_COPY.th.title,
    centerItems: COOP_CENTER_COPY.th.items,
    rating4: COOP_CENTER_COPY.th.rating,
  },
  en: {
    steps: [
      ["General information", "General information", "Student ID, program, semester, and workplace information."],
      ["Expenses and accommodation", "Expenses and accommodation", "Compensation, benefits, and expenses during the cooperative education placement."],
      [WIZARD_COPY.en.steps[2][0], WIZARD_COPY.en.steps[2][0], "Self-assess against the program's knowledge and skills learning outcomes."],
      [WIZARD_COPY.en.steps[3][0], WIZARD_COPY.en.steps[3][0], "Self-assess against the program's ethics and character learning outcomes."],
      ["Strengths & growth", "Strengths and areas for improvement", "Reflect on your own strengths and what you'd like to develop further."],
      ["Co-op center + workplace", "Cooperative education center and workplace", "Evaluate the coop-education center's process, workplace support, and closing comments."],
    ],
    disclosure: "Please answer honestly. Your responses have no effect on your performance evaluation and are used only to improve the cooperative education program.",
    workplaceName: "Name of the cooperative education workplace",
    workplaceAddress: "Workplace address / location",
    compensationType: "Compensation or benefits received",
    compensationNone: "None",
    compensationMoney: "Money",
    compensationBenefits: "Benefits",
    compensationMoneyBenefits: "Money and benefits",
    dailyWage: "Daily wage (THB/day)",
    monthlyWage: "Monthly wage (THB)",
    amountHelper: "Enter 0 if not received",
    benefitsReceived: "Benefits received",
    benefitHousing: "Housing",
    benefitMeals: "Meals",
    benefitTransport: "Transportation",
    benefitMedical: "Medical care",
    benefitLifeInsurance: "Life insurance",
    benefitAccidentInsurance: "Accident insurance",
    benefitUniform: "Uniform",
    benefitOther: "Other benefits (if any)",
    accommodationCost: "Estimated accommodation cost (THB)",
    foodCost: "Estimated food cost (THB)",
    travelCost: "Travel cost (THB)",
    bookFeeCost: "Books and other fees (THB)",
    materialInsuranceCost: "Materials or insurance cost (THB)",
    monthlyRentCost: "Monthly accommodation rent (THB)",
    otherExpenses: "Other expenses, please specify with amount",
    otherExpensesHelper: "e.g. Phone bill 1,000 THB",
    accommodationInfo: "Accommodation details (name, phone number, and location)",
    accommodationInfoHelper: "For the benefit of future students",
    recommendAccommodation: "Would you recommend this accommodation?",
    recommendYes: "Recommend",
    recommendNo: "Not recommended",
    wholePlacementHelper: "for the entire placement",
    ownStrengths: "Your own strengths",
    ownImprovements: "Areas you would like to develop further",
    workplaceSupportTitle: "Support from the workplace",
    workplaceSupportItems: [
      "Attentiveness of the supervisor or HR staff toward the student",
      "Assignment of a knowledgeable and experienced supervisor to the student",
      "Appropriate welfare and compensation support",
      "Suitability of the workplace location and a safe environment",
      "Overall satisfaction with the workplace",
    ],
    futurePlacement: "Should this workplace continue to host cooperative education students?",
    futureShould: "Should",
    futureShouldNot: "Should not",
    futureOther: "Other",
    futureOtherSpecify: "Please specify",
    otherComments: "Additional comments",
    centerTitle: COOP_CENTER_COPY.en.title,
    centerItems: COOP_CENTER_COPY.en.items,
    rating4: COOP_CENTER_COPY.en.rating,
  },
};

export const STUDENT_BENEFIT_KEYS = [
  "housing",
  "meals",
  "transport",
  "medical",
  "life_insurance",
  "accident_insurance",
  "uniform",
] as const;
