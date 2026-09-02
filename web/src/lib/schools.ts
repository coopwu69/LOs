export type SchoolSlug = string;

// Short URL slugs for each school name as stored in the database.
// Keep this in sync with new schools if the DB changes.
const SCHOOL_SLUGS: Record<string, SchoolSlug> = {
  // live schools (from DB)
  "ความร่วมมือต่างประเทศ": "ic",
  "สำนักวิชาการจัดการ": "mgt",
  "สำนักวิชาการบัญชีและการเงิน": "accfin",
  "สำนักวิชานิติศาสตร์": "law",
  "สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์": "polsci",
  "สำนักวิชาวิทยาศาสตร์": "sci",
  "สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี": "eng",
  "สำนักวิชาศิลปศาสตร์": "arts",
  "สำนักวิชาสถาปัตยกรรมศาสตร์และการออกแบบ": "arch",
  "สำนักวิชาสาธารณสุขศาสตร์": "public-health",
  "สำนักวิชาสารสนเทศศาสตร์": "it",
  "สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร": "agri",
  "สำนักวิชาแพทยศาสตร์": "med",

  // fixture variants used in development
  "สำนักวิชาวิศวกรรมศาสตร์": "eng",
  "สำนักวิชาพยาบาลศาสตร์": "nursing",
};

// Reverse map: canonical slug -> canonical school name (DB variant).
const SLUG_TO_NAME: Record<SchoolSlug, string> = {};
for (const [name, slug] of Object.entries(SCHOOL_SLUGS)) {
  if (!SLUG_TO_NAME[slug]) {
    SLUG_TO_NAME[slug] = name;
  }
}

export function getSchoolSlug(name: string | null | undefined): string {
  if (!name) return "";
  return SCHOOL_SLUGS[name] ?? encodeURIComponent(name);
}

export function getSchoolNameBySlug(slug: string): string | null {
  if (SLUG_TO_NAME[slug]) return SLUG_TO_NAME[slug];
  if (slug.includes("%")) {
    try {
      return decodeURIComponent(slug);
    } catch {
      return null;
    }
  }
  return null;
}
