import { getPool } from "./db";
import { UUID_PATTERN } from "./evaluation-schema";
import type { FormRole } from "./routes";

// G12: curriculum-review confirmations. Each confirmation is a NEW row (full
// history kept for audit); the dashboard reads the MOST RECENT row per
// (program_id, role) to decide the badge state. See migration 022.

export type ReviewConfirmation = {
  id: string;
  program_id: string;
  role: FormRole;
  reviewer_name: string;
  reviewer_email: string;
  reviewer_phone: string;
  // ISO timestamp in Asia/Bangkok, matching the to_char pattern used by
  // getRevisions in db.ts so the dashboard formats consistently.
  confirmed_at: string;
};

export type LatestConfirmations = Partial<Record<FormRole, ReviewConfirmation>>;

const ROLE_VALUES: readonly FormRole[] = ["company", "advisor", "student"];

function isFormRole(v: string): v is FormRole {
  return (ROLE_VALUES as readonly string[]).includes(v);
}

// Returns the most recent confirmation per role for a program. Empty object
// (no entries) if none exist yet — the dashboard renders "ยังไม่ตรวจ" for
// any role missing from the result.
export async function getLatestReviewConfirmations(
  programId: string
): Promise<LatestConfirmations> {
  if (!UUID_PATTERN.test(programId)) return {};
  try {
    const { rows } = await getPool().query(
      `SELECT DISTINCT ON (role)
         id::text AS id,
         program_id::text AS program_id,
         role,
         reviewer_name,
         reviewer_email,
         reviewer_phone,
         to_char(confirmed_at AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD"T"HH24:MI:SS') AS confirmed_at
       FROM curriculum_review_confirmations
       WHERE program_id = $1
       ORDER BY role, confirmed_at DESC`,
      [programId]
    );
    const out: LatestConfirmations = {};
    for (const row of rows) {
      const role: string = row.role;
      if (isFormRole(role)) {
        out[role] = row as ReviewConfirmation;
      }
    }
    return out;
  } catch (error) {
    console.error("Unable to load review confirmations", error);
    return {};
  }
}

export type NewConfirmationInput = {
  programId: string;
  role: FormRole;
  reviewerName: string;
  reviewerEmail: string;
  reviewerPhone: string;
};

// Inserts a new confirmation row. Never upserts/overwrites — every call is a
// new row so the audit trail survives re-confirmation after a content change.
// Server-side guard mirrors the dialog's client check: all three fields must
// be non-empty. Returns the inserted row on success.
export async function createReviewConfirmation(
  input: NewConfirmationInput
): Promise<{ ok: true; confirmation: ReviewConfirmation } | { ok: false; error: string }> {
  if (!UUID_PATTERN.test(input.programId)) {
    return { ok: false, error: "ไม่พบหลักสูตร กรุณารีเฟรชหน้าแล้วลองอีกครั้ง" };
  }
  const name = input.reviewerName.trim();
  const email = input.reviewerEmail.trim();
  const phone = input.reviewerPhone.trim();
  if (!name || !email || !phone) {
    return { ok: false, error: "กรุณากรอกชื่อ-สกุล อีเมล และเบอร์โทรให้ครบ" };
  }
  try {
    const { rows } = await getPool().query(
      `INSERT INTO curriculum_review_confirmations
         (program_id, role, reviewer_name, reviewer_email, reviewer_phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING
         id::text AS id,
         program_id::text AS program_id,
         role,
         reviewer_name,
         reviewer_email,
         reviewer_phone,
         to_char(confirmed_at AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD"T"HH24:MI:SS') AS confirmed_at`,
      [input.programId, input.role, name, email, phone]
    );
    const confirmation = rows[0] as ReviewConfirmation | undefined;
    if (!confirmation) return { ok: false, error: "บันทึกไม่สำเร็จ" };
    return { ok: true, confirmation };
  } catch (error) {
    console.error("Unable to create review confirmation", error);
    return { ok: false, error: "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }
}
