"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { ProgramSummary } from "./programs-list";

const COPY = {
  th: {
    heading: "เลือกแบบฟอร์มที่ต้องการกรอก",
    companyName: "แบบประเมินหน่วยงาน",
    companyDesc: "กรอกโดยหน่วยงานหรือพี่เลี้ยงที่ดูแลนักศึกษาระหว่างปฏิบัติงาน",
    advisorName: "แบบประเมินอาจารย์นิเทศ",
    advisorDesc: "กรอกโดยอาจารย์นิเทศที่ติดตามและประเมินนักศึกษา",
    copyLink: "คัดลอกลิงก์",
    linkCopied: "คัดลอกแล้ว",
    close: "ปิด",
  },
  en: {
    heading: "Choose a form to fill in",
    companyName: "Workplace evaluation",
    companyDesc: "Filled in by the host company or the on-site supervisor",
    advisorName: "Advisor evaluation",
    advisorDesc: "Filled in by the faculty advisor who supervises the student",
    copyLink: "Copy link",
    linkCopied: "Copied!",
    close: "Close",
  },
};

function WorkplaceIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2" /></svg>;
}

function AdvisorIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9l10-4 10 4-10 4z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /><path d="M22 9v5" /></svg>;
}

function ArrowRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

function CopyIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}

function CheckIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}

function CloseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

function CopyFormLinkButton({ href, name, copyLabel, copiedLabel, ariaLabel }: { href: string; name: string; copyLabel: string; copiedLabel: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}${href}`;
    navigator.clipboard.writeText(`${name} : ${url}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors hover:bg-hover ${copied ? "text-success-text" : "text-tertiary hover:text-primary"}`}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span className="hidden lg:inline">{copied ? copiedLabel : copyLabel}</span>
    </button>
  );
}

function FormOption({
  href,
  icon,
  name,
  description,
  copyLabel,
  copiedLabel,
  linkRef,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  copyLabel: string;
  copiedLabel: string;
  linkRef?: React.Ref<HTMLAnchorElement>;
  onNavigate?: () => void;
}) {
  return (
    <li className="group flex items-stretch rounded-xl border border-border-default bg-raised transition-colors hover:border-border-focus hover:bg-hover">
      <Link
        ref={linkRef}
        href={href}
        data-form-option
        onClick={onNavigate}
        className="flex min-h-11 flex-1 items-center gap-3 rounded-l-xl px-4 py-3.5"
      >
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sunken text-secondary transition-colors group-hover:bg-info-bg group-hover:text-info-text">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-primary">{name}</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-secondary">{description}</span>
        </span>
        <span className="flex-shrink-0 text-tertiary transition-transform group-hover:translate-x-0.5">
          <ArrowRightIcon />
        </span>
      </Link>
      <div className="flex items-stretch border-l border-border-default">
        <CopyFormLinkButton href={href} name={name} copyLabel={copyLabel} copiedLabel={copiedLabel} ariaLabel={`${copyLabel}: ${name}`} />
      </div>
    </li>
  );
}

/**
 * Native <dialog> form picker — opened by `showModal()` whenever `program` is
 * set, closed (and reported through `onClose`) via Esc, the close button, or a
 * click on the backdrop. Focus moves into the dialog on open and back to the
 * element that opened it on close — both are native <dialog> behavior.
 */
export function FormPickerDialog({ program, locale, onClose, onNavigate }: { program: ProgramSummary | null; locale: Locale; onClose: () => void; onNavigate?: () => void }) {
  const c = COPY[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstOptionRef = useRef<HTMLAnchorElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (program) {
      if (!dialog.open) {
        dialog.showModal();
        firstOptionRef.current?.focus();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [program]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    const { key } = event;
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;
    const options = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("[data-form-option]") ?? []);
    if (options.length === 0) return;
    event.preventDefault();
    const current = options.indexOf(document.activeElement as HTMLElement);
    let next = current;
    if (key === "Home") next = 0;
    else if (key === "End") next = options.length - 1;
    else if (key === "ArrowDown" || key === "ArrowRight") next = current < 0 ? 0 : (current + 1) % options.length;
    else next = current <= 0 ? options.length - 1 : current - 1;
    options[next]?.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 m-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border-default bg-raised p-0 text-primary shadow-xl backdrop:bg-overlay backdrop:backdrop-blur-sm max-sm:top-auto max-sm:m-0 max-sm:max-h-[85dvh] max-sm:max-w-none max-sm:rounded-b-none"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {program ? (
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold leading-snug text-primary">{program.name}</h2>
              <p className="mt-0.5 font-mono text-xs text-tertiary">{program.code}</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={c.close}
              title={c.close}
              className="inline-flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-hover hover:text-primary"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="text-sm text-secondary">{c.heading}</p>
          <ul className="flex flex-col gap-2.5">
            <FormOption
              href={program.companyHref}
              icon={<WorkplaceIcon />}
              name={c.companyName}
              description={c.companyDesc}
              copyLabel={c.copyLink}
              copiedLabel={c.linkCopied}
              linkRef={firstOptionRef}
              onNavigate={onNavigate}
            />
            <FormOption
              href={program.advisorHref}
              icon={<AdvisorIcon />}
              name={c.advisorName}
              description={c.advisorDesc}
              copyLabel={c.copyLink}
              copiedLabel={c.linkCopied}
              onNavigate={onNavigate}
            />
          </ul>
        </div>
      ) : null}
    </dialog>
  );
}
