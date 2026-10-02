"use client";

import { useEffect, useRef, useState } from "react";
import { getRevisionSnapshot } from "../edit/actions";

type SnapshotOption = {
  id: string;
  score: number;
  label_th: string;
  description_th: string | null;
  sequence: number;
};

type SnapshotQuestion = {
  id: string;
  lo_code: string | null;
  text: string;
  text_en: string | null;
  sequence: number;
  options: SnapshotOption[];
};

type SnapshotSection = {
  id: string;
  title_th: string;
  part: number;
  sequence: number;
  questions: SnapshotQuestion[];
};

type Snapshot = {
  title?: string | null;
  sections?: SnapshotSection[];
};

/**
 * Read-only preview of a historical revision's content — lets the reviewer
 * check what a version actually contains before deciding whether to restore
 * it. Fetches on demand (lazy) via getRevisionSnapshot, native <dialog>
 * pattern matching RestoreButton / ReviewConfirmDialog.
 */
export function PreviewButton({ revisionId, label }: { revisionId: string; label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; error: string }
    | { status: "ready"; snapshot: Snapshot }
  >({ status: "idle" });

  const open = async () => {
    setState({ status: "loading" });
    dialogRef.current?.showModal();
    const result = await getRevisionSnapshot(revisionId);
    if (result.ok) {
      setState({ status: "ready", snapshot: (result.snapshot ?? {}) as Snapshot });
    } else {
      setState({ status: "error", error: result.error });
    }
  };

  const close = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setState({ status: "idle" });
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border-strong bg-raised px-3 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover"
        onClick={open}
      >
        {label}
      </button>
      <dialog
        ref={dialogRef}
        aria-label="ดูตัวอย่างเวอร์ชัน"
        aria-modal="true"
        className="fixed inset-0 m-auto max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-default bg-raised p-0 text-primary shadow-xl backdrop:bg-overlay backdrop:backdrop-blur-sm max-sm:top-auto max-sm:m-0 max-sm:max-h-[90dvh] max-sm:max-w-none max-sm:rounded-b-none"
        onClick={handleBackdropClick}
      >
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold leading-snug text-primary">ดูตัวอย่างเวอร์ชันนี้</h2>
            <button
              type="button"
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg text-secondary hover:bg-hover hover:text-primary"
              onClick={close}
              aria-label="ปิด"
            >
              ✕
            </button>
          </div>

          {state.status === "loading" && (
            <p className="text-sm text-secondary">กำลังโหลดข้อมูล…</p>
          )}
          {state.status === "error" && (
            <p className="text-sm text-error-text" role="alert">{state.error}</p>
          )}
          {state.status === "ready" && (
            <div className="space-y-5">
              {(state.snapshot.sections ?? []).length === 0 ? (
                <p className="text-sm text-secondary">เวอร์ชันนี้ไม่มีข้อมูลคำถาม</p>
              ) : (
                (state.snapshot.sections ?? [])
                  .slice()
                  .sort((a, b) => a.part - b.part || a.sequence - b.sequence)
                  .map((section) => (
                    <div key={section.id} className="rounded-lg border border-border-default p-3 sm:p-4">
                      <h3 className="text-sm font-semibold text-primary">{section.title_th}</h3>
                      <ol className="mt-3 space-y-3">
                        {(section.questions ?? [])
                          .slice()
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((q) => (
                            <li key={q.id} className="rounded-md bg-sunken p-3">
                              <p className="text-sm text-primary">
                                {q.lo_code ? <span className="font-semibold">{q.lo_code} </span> : null}
                                {q.text}
                              </p>
                              {q.text_en && (
                                <p className="mt-1 text-xs italic text-secondary">{q.text_en}</p>
                              )}
                              {q.options?.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {q.options
                                    .slice()
                                    .sort((a, b) => b.score - a.score)
                                    .map((o) => (
                                      <li key={o.id} className="text-xs text-secondary">
                                        <span className="font-medium text-primary">{o.score} {o.label_th}</span>
                                        {o.description_th ? ` — ${o.description_th}` : null}
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </li>
                          ))}
                      </ol>
                    </div>
                  ))
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary hover:bg-hover"
              onClick={close}
            >
              ปิด
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
