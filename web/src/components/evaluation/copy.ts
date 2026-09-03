import type { Locale } from "@/lib/i18n";

// Localized copy for the evaluation wizard.
// Extracted from the original monolithic EvaluationWizard so focused
// components can import only what they need.

export type WizardCopy = {
  steps: readonly [string, string, string][];
  evaluatorInfo: string;
  email: string;
  semester: string;
  selectSemester: string;
  academicYear: string;
  selectAcademicYear: string;
  company: string;
  evaluatorName: string;
  position: string;
  department: string;
  phone: string;
  phoneExample: string;
  studentInfo: string;
  studentCode: string;
  studentCodePlaceholder: string;
  studentCodeHelp: string;
  studentName: string;
  school: string;
  program: string;
  noQuestions: string;
  questions: string;
  question: string;
  rubric: string;
  reportItems: string[];
  rating: string[];
  strengths: string;
  strengthsHelp: string;
  improvements: string;
  improvementsHelp: string;
  hiring: string;
  interested: string;
  notInterested: string;
  nextYear: string;
  willing: string;
  unavailable: string;
  nextYearCount: string;
  processNotice: string;
  processEvaluation: string;
  expectedCompetencies: string;
  otherComments: string;
  review: string;
  competencyQuestions: string;
  answered: string;
  of: string;
  status: string;
  ready: string;
  step: string;
  complete: string;
  stepsLabel: string;
  back: string;
  next: string;
  submit: string;
  submitting: string;
  firstStep: string;
  preparingDraft: string;
  previewMode: string;
  restored: string;
  autosaveReady: string;
  saving: string;
  saved: string;
  saveFailed: string;
  successTitle: string;
  successText: string;
  successSummary: string;
  successReference: string;
  domains: Record<string, string>;
  // Validation / error summary copy
  errorSummaryTitle: string;
  errorSummaryHelp: string;
  errorCount: (n: number) => string;
  fieldError: string;
  // Completion screen
  completionTitle: string;
  completionScore: string;
  completionQuestions: string;
  completionReport: string;
  completionClose: string;
  completionCloseHref: string;
};

export const WIZARD_COPY: Record<Locale, WizardCopy> = {
  th: {
    steps: [
      ["ข้อมูลทั่วไป", "ข้อมูลผู้ประเมินและนักศึกษา", "กรอกข้อมูลสำหรับติดต่อและตรวจสอบหลักสูตรของนักศึกษา"],
      ["ความรู้และทักษะ", "สมรรถนะด้านความรู้และทักษะ", "ประเมินจากการปฏิบัติงานจริงของนักศึกษาในสถานประกอบการ"],
      ["จริยธรรมและบุคลิก", "สมรรถนะด้านจริยธรรมและลักษณะบุคคล", "ประเมินพฤติกรรม ความรับผิดชอบ และการทำงานร่วมกับผู้อื่น"],
      ["รายงาน/โครงงาน", "รายงานหรือโครงงานสหกิจศึกษา", "ประเมินคุณภาพงานและการรายงานความก้าวหน้า"],
      ["ข้อเสนอแนะ", "ข้อเสนอแนะและการรับนักศึกษา", "สะท้อนจุดเด่น สิ่งที่ควรพัฒนา และความต้องการรับนักศึกษาในอนาคต"],
      ["กระบวนการ", "ประเมินกระบวนการดำเนินงาน", "ส่วนนี้ไม่รวมในคะแนนนักศึกษา ตรวจสอบข้อมูลแล้วจึงส่งแบบประเมิน"],
    ],
    evaluatorInfo: "ข้อมูลผู้ประเมิน",
    email: "อีเมล",
    semester: "ภาคการศึกษา",
    selectSemester: "เลือกภาคการศึกษา",
    academicYear: "ปีการศึกษา",
    selectAcademicYear: "เลือกปีการศึกษา",
    company: "ชื่อสถานประกอบการ",
    evaluatorName: "ชื่อ–นามสกุลผู้ประเมิน",
    position: "ตำแหน่ง",
    department: "แผนก",
    phone: "เบอร์โทรศัพท์",
    phoneExample: "เช่น 0812345678",
    studentInfo: "ข้อมูลนักศึกษา",
    studentCode: "รหัสนักศึกษา",
    studentCodePlaceholder: "ตัวเลข 8 หลัก",
    studentCodeHelp: "กรอกรหัสนักศึกษา 8 หลัก ขณะนี้ระบบยังไม่มีฐานข้อมูลสำหรับค้นหาชื่ออัตโนมัติ",
    studentName: "ชื่อ–สกุลนักศึกษา",
    school: "สำนักวิชา",
    program: "หลักสูตร",
    noQuestions: "หลักสูตรนี้ยังไม่มีคำถามในหมวดนี้",
    questions: "ข้อ",
    question: "ข้อ",
    rubric: "ดูเกณฑ์การให้คะแนน",
    reportItems: [
      "รายงาน/โครงงานเป็นไปตามวัตถุประสงค์และความต้องการของหน่วยงาน",
      "ความต่อเนื่องสม่ำเสมอในการขอรับคำปรึกษาและรายงานความก้าวหน้าในการจัดทำรายงาน/โครงงาน",
      "เนื้อหารายงาน/โครงงานเป็นไปตามหลักวิชาการ",
      "ความถูกต้องในเชิงเนื้อหาและการจัดเก็บข้อมูล",
      "ประโยชน์ของรายงาน/โครงงาน ต่อหน่วยงานและนำไปใช้ได้จริง",
    ],
    rating: ["น้อยที่สุด", "น้อย", "ปานกลาง", "มาก", "มากที่สุด"],
    strengths: "จุดเด่นของนักศึกษา",
    strengthsHelp: "ระบุพฤติกรรมหรือผลงานที่เห็นได้ชัดจากการปฏิบัติงาน",
    improvements: "ข้อควรปรับปรุงของนักศึกษา",
    improvementsHelp: "ระบุสิ่งที่นักศึกษาควรพัฒนาเพิ่มเติมอย่างสร้างสรรค์",
    hiring: "สนใจรับนักศึกษาเข้าทำงานหากมีตำแหน่งว่างหรือไม่",
    interested: "สนใจ",
    notInterested: "ไม่สนใจ",
    nextYear: "ปีต่อไปยินดีรับนักศึกษาสหกิจศึกษาหรือไม่",
    willing: "ยินดี",
    unavailable: "ไม่สะดวก",
    nextYearCount: "ปีการศึกษาหน้าต้องการรับนักศึกษากี่คน",
    processNotice: "คำตอบในส่วนนี้ใช้พัฒนากระบวนการสหกิจศึกษา และไม่นำไปรวมกับคะแนนของนักศึกษา",
    processEvaluation: "ประเมินกระบวนการดำเนินงานสหกิจศึกษา",
    expectedCompetencies: "สมรรถนะที่คาดหวังจากนักศึกษาสหกิจศึกษา",
    otherComments: "ข้อคิดเห็นอื่น ๆ เพิ่มเติม",
    review: "ตรวจสอบก่อนส่ง",
    competencyQuestions: "คำถามสมรรถนะ",
    answered: "ตอบแล้ว",
    of: "จาก",
    status: "สถานะ",
    ready: "พร้อมตรวจสอบและส่งแบบประเมิน",
    step: "ส่วน",
    complete: "เสร็จแล้ว",
    stepsLabel: "ส่วนของแบบประเมิน",
    back: "ย้อนกลับ",
    next: "ถัดไป",
    submit: "ส่งแบบประเมิน",
    submitting: "กำลังส่ง…",
    firstStep: "กลับไปดูส่วนแรก",
    preparingDraft: "กำลังเตรียมร่าง…",
    previewMode: "โหมดตัวอย่าง — ไม่บันทึกข้อมูล",
    restored: "กู้คืนร่างล่าสุดแล้ว",
    autosaveReady: "พร้อมบันทึกร่างอัตโนมัติ",
    saving: "กำลังบันทึก…",
    saved: "บันทึกร่างแล้ว",
    saveFailed: "บันทึกร่างไม่สำเร็จ — ระบบจะลองอีกครั้ง",
    successTitle: "ส่งแบบประเมินเรียบร้อยแล้ว",
    successText: "ขอบคุณสำหรับข้อมูล รหัสแบบประเมินคือ",
    successSummary: "สรุปคะแนน",
    successReference: "รหัสอ้างอิง",
    completionTitle: "การประเมินเสร็จสมบูรณ์",
    completionScore: "คะแนนสมรรถนะ",
    completionQuestions: "จำนวนข้อที่ประเมิน",
    completionReport: "คะแนนรายงาน/โครงงาน",
    completionClose: "กลับหน้าแรก",
    completionCloseHref: "/",
    domains: { knowledge: "ความรู้", skills: "ทักษะ", knowledge_skills: "ความรู้และทักษะ", social_skills: "ทักษะทางสังคม", ethics: "จริยธรรม", character: "ลักษณะบุคคล", general: "ทั่วไป" },
    errorSummaryTitle: "ตรวจพบข้อผิดพลาด",
    errorSummaryHelp: "กรุณาแก้ไขข้อผิดพลาดต่อไปนี้ก่อนส่งแบบประเมิน",
    errorCount: (n) => `พบ ${n} ข้อผิดพลาด`,
    fieldError: "ข้อมูลไม่ถูกต้อง",
  },
  en: {
    steps: [
      ["General information", "Evaluator and student information", "Provide contact details and confirm the student's program."],
      ["Knowledge and skills", "Knowledge and skills competencies", "Evaluate the student's performance in the workplace."],
      ["Ethics and character", "Ethics and personal competencies", "Evaluate responsibility, conduct, and collaboration."],
      ["Report / project", "Cooperative education report or project", "Evaluate work quality and progress reporting."],
      ["Feedback", "Feedback and future placement", "Highlight strengths, development areas, and future recruitment needs."],
      ["Process", "Cooperative education process", "This section does not affect the student's score. Review the information before submitting."],
    ],
    evaluatorInfo: "Evaluator information",
    email: "Email",
    semester: "Semester",
    selectSemester: "Select a semester",
    academicYear: "Academic year",
    selectAcademicYear: "Select an academic year",
    company: "Organization",
    evaluatorName: "Evaluator's full name",
    position: "Position",
    department: "Department",
    phone: "Phone number",
    phoneExample: "e.g. +66 81 234 5678",
    studentInfo: "Student information",
    studentCode: "Student ID",
    studentCodePlaceholder: "8-digit number",
    studentCodeHelp: "Enter the 8-digit student ID. Automatic student lookup is not available yet.",
    studentName: "Student's full name",
    school: "School",
    program: "Program",
    noQuestions: "No questions are available in this category yet.",
    questions: "questions",
    question: "Question",
    rubric: "View scoring criteria",
    reportItems: [
      "The report or project meets the organization's objectives and requirements.",
      "Consistency and regularity in seeking advice and reporting progress on the report or project.",
      "The report or project content follows academic standards.",
      "Accuracy of content and data collection.",
      "The report or project is beneficial to the organization and practically applicable.",
    ],
    rating: ["Lowest", "Low", "Moderate", "High", "Highest"],
    strengths: "Student strengths",
    strengthsHelp: "Describe observable strengths, behaviors, or work outcomes.",
    improvements: "Areas for improvement",
    improvementsHelp: "Provide constructive suggestions for further development.",
    hiring: "Would you consider hiring this student if a position is available?",
    interested: "Yes",
    notInterested: "No",
    nextYear: "Would your organization accept cooperative education students next year?",
    willing: "Yes",
    unavailable: "Not available",
    nextYearCount: "How many students could you accept next academic year?",
    processNotice: "Responses in this section help improve the cooperative education process and do not affect the student's score.",
    processEvaluation: "Evaluation of the cooperative education process",
    expectedCompetencies: "Expected competencies of cooperative education students",
    otherComments: "Additional comments",
    review: "Review before submitting",
    competencyQuestions: "Competency questions",
    answered: "Answered",
    of: "of",
    status: "Status",
    ready: "Ready for review and submission",
    step: "Section",
    complete: "Complete",
    stepsLabel: "Evaluation sections",
    back: "Back",
    next: "Next",
    submit: "Submit evaluation",
    submitting: "Submitting…",
    firstStep: "Return to first section",
    preparingDraft: "Preparing draft…",
    previewMode: "Preview mode — responses are not saved",
    restored: "Your latest draft has been restored",
    autosaveReady: "Autosave is ready",
    saving: "Saving…",
    saved: "Draft saved at",
    saveFailed: "Unable to save draft — the system will retry",
    successTitle: "Evaluation submitted",
    successText: "Thank you. Your evaluation reference is",
    successSummary: "Score summary",
    successReference: "Reference",
    completionTitle: "Evaluation complete",
    completionScore: "Competency score",
    completionQuestions: "Questions answered",
    completionReport: "Report / project score",
    completionClose: "Back to home",
    completionCloseHref: "/",
    domains: { knowledge: "Knowledge", skills: "Skills", knowledge_skills: "Knowledge and skills", social_skills: "Social skills", ethics: "Ethics", character: "Personal attributes", general: "General" },
    errorSummaryTitle: "Errors found",
    errorSummaryHelp: "Please fix the following errors before submitting the evaluation.",
    errorCount: (n) => `${n} error${n === 1 ? "" : "s"} found`,
    fieldError: "Invalid input",
  },
};

export const PRIMARY_DOMAINS = new Set(["knowledge", "skills", "knowledge_skills", "social_skills"]);

export const ENGLISH_SCORE_LABELS: Record<number, string> = {
  5: "Excellent",
  4: "Very good",
  3: "Good",
  2: "Fair",
  1: "Needs improvement",
};

export function englishQuestionFallback(text: string, textEn: string | null): string {
  if (textEn) return textEn;
  if (text.includes("ระบุและแก้ปัญหาที่ซับซ้อน")) return "Identify and solve complex workplace problems by applying appropriate business administration principles.";
  if (text.includes("รวบรวม วิเคราะห์") && text.includes("แปลผลข้อมูล")) return "Collect, analyze, and interpret workplace data to produce useful conclusions.";
  if (text.includes("สื่อสารกับเพื่อนร่วมงาน") && text.includes("ภาษาอังกฤษ")) return "Communicate appropriately in English with colleagues and workplace personnel to achieve work objectives.";
  if (text.includes("เรียนรู้และพัฒนาทักษะใหม่")) return "Independently learn and develop new skills relevant to workplace responsibilities.";
  if (text.includes("ความรับผิดชอบ") && text.includes("จริยธรรม")) return "Work responsibly and uphold professional ethics while considering economic, social, and environmental impacts.";
  if (text.includes("ทำงานร่วมกับทีม")) return "Collaborate effectively, demonstrating appropriate leadership and cooperation within the team.";
  return text;
}
