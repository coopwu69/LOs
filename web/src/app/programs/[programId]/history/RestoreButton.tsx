"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { restoreRevision } from "../edit/actions";

export function RestoreButton({
  revisionId,
  programId,
  programKey,
  label,
}: {
  revisionId: string;
  programId: string;
  programKey: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!confirming) {
    return (
      <div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border-strong bg-raised px-3 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover"
          onClick={() => {
            setError(null);
            setConfirming(true);
          }}
        >
          {label}
        </button>
        {error && <p className="mt-2 max-w-sm text-sm text-error-text" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-sm rounded-lg border border-warning-text/30 bg-warning-bg p-3" role="group" aria-label="ยืนยันการคืนค่าเวอร์ชัน">
      <p className="text-sm font-medium text-primary">คืนค่าเป็นเวอร์ชันนี้หรือไม่?</p>
      <p className="mt-1 text-xs text-secondary">ระบบจะเก็บสถานะปัจจุบันเป็นเวอร์ชันใหม่ก่อนเขียนทับ</p>
      {error && <p className="mt-2 text-sm text-error-text" role="alert">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-action px-3 text-sm font-medium text-inverse transition-colors hover:bg-action-hover disabled:opacity-50"
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                const result = await restoreRevision(revisionId, programId);
                if (result.ok) {
                  router.push(`/programs/${programKey}`);
                  router.refresh();
                } else {
                  setError(result.error);
                }
              } catch {
                setError("ไม่สามารถคืนค่าได้ในขณะนี้ กรุณาลองอีกครั้ง");
              }
            });
          }}
        >
          {pending ? "กำลังคืนค่า…" : "ยืนยันคืนค่า"}
        </button>
        <button
          type="button"
          disabled={pending}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border-strong bg-raised px-3 text-sm font-medium text-primary hover:bg-hover disabled:opacity-50"
          onClick={() => setConfirming(false)}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}
