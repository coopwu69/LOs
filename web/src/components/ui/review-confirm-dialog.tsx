"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { FORM_NAMES } from "@/lib/form-names";
import type { FormRole } from "@/lib/routes";
import { confirmReviewAction, type ConfirmReviewState } from "@/app/programs/[programId]/review/actions";

const COPY = {
  th: {
    title: "ยืนยันการตรวจสอบ",
    intro: "กรุณากรอกข้อมูลผู้ตรวจทานและยืนยันว่าตรวจสอบความครบถ้วนของแบบฟอร์มนี้แล้ว ข้อมูลนี้บันทึกเพื่อเป็นหลักฐานการตรวจสอบ",
    nameLabel: "ชื่อ-สกุลผู้ตรวจ",
    emailLabel: "อีเมล",
    phoneLabel: "เบอร์โทรศัพท์",
    confirmLabel: "ฉันได้ตรวจสอบเนื้อหาแบบประเมินนี้แล้วว่าครบถ้วนถูกต้อง",
    cancel: "ยกเลิก",
    submit: "ยืนยันการตรวจสอบ",
    submitting: "กำลังบันทึก…",
    required: "กรุณากรอกข้อมูลให้ครบและติ๊กยืนยันว่าตรวจสอบแล้ว",
    formLabel: "แบบฟอร์ม",
    programLabel: "หลักสูตร",
  },
  en: {
    title: "Confirm review",
    intro: "Please enter your details and confirm you have reviewed this form for completeness. This is recorded as proof of review.",
    nameLabel: "Reviewer's full name",
    emailLabel: "Email",
    phoneLabel: "Phone number",
    confirmLabel: "I have reviewed this evaluation form and confirm it is complete and correct.",
    cancel: "Cancel",
    submit: "Confirm review",
    submitting: "Saving…",
    required: "Please fill in all fields and tick the confirmation box.",
    formLabel: "Form",
    programLabel: "Program",
  },
};

type Props = {
  programId: string;
  programName: string;
  programCode: string;
  role: FormRole | null;
  locale: Locale;
  onClose: () => void;
};

const labelClass = "block text-sm font-medium text-secondary";
const inputClass = "mt-1 block w-full rounded-lg border border-border-default bg-raised px-3 py-2 text-sm text-primary transition-colors focus:border-border-focus focus:outline-none";
const btn = "inline-flex min-h-11 items-center justify-center rounded-lg border border-border-default bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover";
const btnPrimary = "inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-5 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active disabled:opacity-50";

/**
 * Native <dialog> reviewer-confirmation modal — same pattern as
 * FormPickerDialog: showModal()/close() via ref, aria-labelledby, backdrop
 * click closes. Opens whenever `role` is set; closes (and reports through
 * onClose) via Esc, the cancel button, or a backdrop click. Mirrors the Q11
 * editor dialog's trust boundary (3 required fields + checkbox, with a
 * matching server-side guard in confirmReviewAction).
 */
export function ReviewConfirmDialog({ programId, programName, programCode, role, locale, onClose }: Props) {
  const c = COPY[locale];
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState<ConfirmReviewState | null, FormData>(
    confirmReviewAction,
    null
  );

  // Open/close in reaction to `role` (the dashboard's single source of truth,
  // same shape as FormPickerDialog's `program` prop).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (role) {
      if (!dialog.open) {
        dialog.showModal();
        setTimeout(() => nameRef.current?.focus(), 0);
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [role]);

  // Report close to the parent (Esc / backdrop) so it can clear `role`.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  // On a successful submit, refresh the server data so the badge flips without
  // a full page reload, then close the dialog.
  useEffect(() => {
    if (state?.ok && state.confirmation) {
      router.refresh();
      resetFields();
      dialogRef.current?.close();
    }
  }, [state, router]);

  // Surface server errors in the dialog.
  const serverError = state && !state.ok ? state.error : null;
  const error = localError ?? serverError;

  function resetFields() {
    setName("");
    setEmail("");
    setPhone("");
    setConfirmed(false);
    setLocalError(null);
  }

  const canSubmit = name.trim() && email.trim() && phone.trim() && confirmed && !pending;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!canSubmit) {
      event.preventDefault();
      setLocalError(c.required);
      return;
    }
    setLocalError(null);
    // Let the native submit proceed to the server action (useActionState).
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 m-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border-default bg-raised p-0 text-primary shadow-xl backdrop:bg-overlay backdrop:backdrop-blur-sm max-sm:top-auto max-sm:m-0 max-sm:max-h-[85dvh] max-sm:max-w-none max-sm:rounded-b-none"
      onClick={handleBackdropClick}
    >
      {role ? (
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div>
            <h2 id={titleId} className="text-lg font-semibold leading-snug text-primary">{c.title}</h2>
            <p className="mt-1 text-sm text-secondary">{c.intro}</p>
          </div>

          <div className="rounded-lg border border-border-default bg-sunken p-3 text-sm">
            <p><span className="text-secondary">{c.formLabel}: </span><span className="font-medium text-primary">{FORM_NAMES[locale][role]}</span></p>
            <p className="mt-0.5"><span className="text-secondary">{c.programLabel}: </span><span className="font-medium text-primary">{programName}</span> <span className="font-mono text-xs text-tertiary">{programCode}</span></p>
          </div>

          <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="program_id" value={programId} />
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="reviewer_confirmed" value={confirmed ? "true" : ""} />

            <div>
              <label htmlFor="review_reviewer_name" className={labelClass}>{c.nameLabel} <span className="text-error-text">*</span></label>
              <input
                ref={nameRef}
                id="review_reviewer_name"
                name="reviewer_name"
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="review_reviewer_email" className={labelClass}>{c.emailLabel} <span className="text-error-text">*</span></label>
              <input
                id="review_reviewer_email"
                name="reviewer_email"
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="review_reviewer_phone" className={labelClass}>{c.phoneLabel} <span className="text-error-text">*</span></label>
              <input
                id="review_reviewer_phone"
                name="reviewer_phone"
                type="tel"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
            </div>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-sunken p-3">
              <input
                type="checkbox"
                className="mt-0.5 size-5 accent-[var(--action-primary)]"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span className="text-sm text-primary">{c.confirmLabel}</span>
            </label>

            {error && <p className="text-sm text-error-text" role="alert">{error}</p>}

            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className={btn} onClick={handleClose} disabled={pending}>
                {c.cancel}
              </button>
              <button type="submit" className={btnPrimary} disabled={!canSubmit}>
                {pending ? c.submitting : c.submit}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </dialog>
  );
}
