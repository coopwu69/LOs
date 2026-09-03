export type Locale = "th" | "en";

export function resolveLocale(requested: string | string[] | undefined, preferEnglish = false): Locale {
  const value = Array.isArray(requested) ? requested[0] : requested;
  if (value === "th" || value === "en") return value;
  return preferEnglish ? "en" : "th";
}

export function isInternationalContext(value: string | null | undefined): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return normalized.includes("ต่างประเทศ") || normalized.includes("นานาชาติ") || normalized.includes("international") || normalized.includes("wuic") || normalized === "intl";
}

export function withLocale(path: string, locale: Locale): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${locale}`;
}

const SCHOOL_NAME_ALIASES: Record<string, string> = {
  "ความร่วมมือต่างประเทศ": "วิทยาลัยนานาชาติ",
};

const SCHOOL_NAMES_EN: Record<string, string> = {
  "วิทยาลัยนานาชาติ": "International College",
  "สำนักวิชาการจัดการ": "School of Management",
  "สำนักวิชาการบัญชีและการเงิน": "School of Accountancy and Finance",
  "สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี": "School of Engineering and Technology",
  "สำนักวิชาวิศวกรรมศาสตร์": "School of Engineering",
  "สำนักวิชาเทคโนโลยีสารสนเทศ": "School of Information Technology",
  "สำนักวิชาสารสนเทศศาสตร์": "School of Informatics",
  "สำนักวิชาพยาบาลศาสตร์": "School of Nursing",
  "สำนักวิชานิติศาสตร์": "School of Law",
  "สำนักวิชาสาธารณสุขศาสตร์": "School of Public Health",
  "สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์": "School of Political Science and Public Administration",
  "สำนักวิชาศิลปศาสตร์": "School of Liberal Arts",
  "สำนักวิชาวิทยาศาสตร์": "School of Science",
  "สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ": "School of Architecture and Design",
  "สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร": "School of Agricultural Technology and Food Industry",
  "สำนักวิชาแพทยศาสตร์": "School of Medicine",
};

export function schoolDisplayName(name: string, locale: Locale): string {
  const canonicalName = SCHOOL_NAME_ALIASES[name] ?? name;
  return locale === "en" ? SCHOOL_NAMES_EN[canonicalName] ?? canonicalName : canonicalName;
}

export const uiCopy = {
  th: {
    home: "หน้าแรก",
    appTitle: "แบบประเมิน LOs รายวิชาสหกิจศึกษา",
    appDescription: "ระบบเรียกดูผลลัพธ์การเรียนรู้ที่คาดหวัง (Learning Outcomes) ของรายวิชาสหกิจศึกษา จัดกลุ่มตามสำนักวิชาและหลักสูตร",
    schools: "สำนักวิชา",
    programs: "หลักสูตร",
    submitted: "ส่งแบบประเมินแล้ว",
    standard4: "ปรับเป็น 4 ระดับแล้ว",
    selectSchool: "เลือกสำนักวิชา",
    selectSchoolHelp: "คลิกที่สำนักวิชาเพื่อดูหลักสูตรภายในสำนัก",
    selectProgram: "เลือกหลักสูตร",
    selectProgramHelp: "คลิกที่หลักสูตรเพื่อดูแบบประเมิน LOs",
    programsInSchool: "หลักสูตรในสำนักวิชานี้",
    sent: "ส่งแล้ว",
    pending: "ยังไม่ส่ง",
    noSchools: "ยังไม่มีข้อมูลสำนักวิชา",
    noPrograms: "ยังไม่มีหลักสูตรในสำนักวิชานี้",
    addPrograms: "กรุณาเพิ่มข้อมูลหลักสูตรในฐานข้อมูล",
    loadError: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
    loadErrorHelp: "กรุณาลองใหม่อีกครั้ง หากยังพบปัญหาโปรดติดต่อผู้ดูแลระบบ",
    footer: "ระบบแบบประเมิน LOs รายวิชาสหกิจศึกษา — COOP69",
    view: "ดู",
    edit: "แก้ไข",
    print: "พิมพ์ / บันทึก PDF",
    downloadWord: "ดาวน์โหลด Word",
    history: "ประวัติการแก้ไข",
    previewSubtitle: "ตัวอย่างหน้าตาแบบประเมิน — ยังไม่มีชุดคำถามเฉพาะหลักสูตร",
    tools: "เครื่องมือแบบประเมิน",
  },
  en: {
    home: "Home",
    appTitle: "Cooperative Education Learning Outcomes Evaluation",
    appDescription: "Browse and evaluate the expected learning outcomes of cooperative education courses, organized by school and program.",
    schools: "schools",
    programs: "programs",
    submitted: "Evaluations available",
    standard4: "Using the 4-level scale",
    selectSchool: "Select a school",
    selectSchoolHelp: "Choose a school to view its programs.",
    selectProgram: "Select a program",
    selectProgramHelp: "Choose a program to open its LO evaluation.",
    programsInSchool: "programs in this school",
    sent: "Available",
    pending: "Not available",
    noSchools: "No schools available",
    noPrograms: "No programs available in this school",
    addPrograms: "Program information has not been added yet.",
    loadError: "Unable to load information",
    loadErrorHelp: "Please try again. If the problem persists, contact the system administrator.",
    footer: "Cooperative Education LO Evaluation System — COOP69",
    view: "View",
    edit: "Edit",
    print: "Print / Save PDF",
    downloadWord: "Download Word",
    history: "Edit history",
    previewSubtitle: "Evaluation preview — program-specific questions are not available yet",
    tools: "Evaluation tools",
  },
} as const;
