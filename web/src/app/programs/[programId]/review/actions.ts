"use server";

import { revalidatePath } from "next/cache";
import { createReviewConfirmation } from "@/lib/review-confirmations";
import { isFormRole, type FormRole } from "@/lib/routes";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ConfirmReviewState = {
  ok: boolean;
  error?: string;
  confirmation?: {
    role: FormRole;
    reviewer_name: string;
    confirmed_at: string;
  };
};

// G12: server action backing the reviewer-confirmation dialog. The dialog
// enforces name/email/phone + checkbox on the client; this is the trust
// boundary — never trust client-only validation for a persisted record
// (same pattern as Q11's saveTemplate guard).
export async function confirmReviewAction(
  _prevState: ConfirmReviewState | null,
  formData: FormData
): Promise<ConfirmReviewState> {
  const programId = String(formData.get("program_id") ?? "");
  const role = String(formData.get("role") ?? "");
  const reviewerName = String(formData.get("reviewer_name") ?? "");
  const reviewerEmail = String(formData.get("reviewer_email") ?? "");
  const reviewerPhone = String(formData.get("reviewer_phone") ?? "");
  const confirmed = formData.get("reviewer_confirmed") === "true";

  if (!UUID_RE.test(programId)) {
    return { ok: false, error: "ไม่พบหลักสูตร กรุณารีเฟรชหน้าแล้วลองอีกครั้ง" };
  }
  if (!isFormRole(role)) {
    return { ok: false, error: "แบบฟอร์มไม่ถูกต้อง" };
  }
  // The checkbox is part of the trust boundary too — without it the
  // confirmation means nothing even if all 3 text fields are filled.
  if (!confirmed) {
    return { ok: false, error: "กรุณาติ๊กยืนยันว่าตรวจสอบแล้ว" };
  }

  const result = await createReviewConfirmation({
    programId,
    role,
    reviewerName,
    reviewerEmail,
    reviewerPhone,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  // Refresh the review page (and the school list) so the badge flips without
  // a full page reload — matches how TemplateEditor uses revalidatePath.
  revalidatePath(`/programs/${programId}/review`);
  revalidatePath(`/schools/[school]`);

  return {
    ok: true,
    confirmation: {
      role: result.confirmation.role,
      reviewer_name: result.confirmation.reviewer_name,
      confirmed_at: result.confirmation.confirmed_at,
    },
  };
}
