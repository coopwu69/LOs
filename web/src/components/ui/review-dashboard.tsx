"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, StatusDot } from "./badge";
import { ReviewConfirmDialog } from "./review-confirm-dialog";
import type { Locale } from "@/lib/i18n";
import type { FormRole } from "@/lib/routes";
import type { ReviewConfirmation } from "@/lib/review-confirmations";

export type ReviewFormRow = {
  role: FormRole;
  name: string;
  description: string;
  viewHref: string;
  downloadHref: string;
  confirmation: ReviewConfirmation | null;
};

type Props = {
  programId: string;
  programName: string;
  programCode: string;
  forms: ReviewFormRow[];
  locale: Locale;
};

const COPY = {
  th: {
    pageIntro: "ตรวจสอบความครบถ้วนของแบบประเมินทั้ง 3 ฟอร์ม — เปิดดูเนื้อหา ดาวน์โหลดเอกสาร Word และยืนยันว่าตรวจสอบแล้วแยกต่อฟอร์ม",
    formHeader: "แบบฟอร์ม",
    statusHeader: "สถานะ",
    actionsHeader: "การดำเนินการ",
    view: "ดูแบบฟอร์ม",
    download: "ดาวน์โหลด Word",
    confirm: "ยืนยันว่าตรวจสอบแล้ว",
    reconfirm: "ตรวจซ้ำ",
    reviewed: "ตรวจแล้ว",
    notReviewed: "ยังไม่ตรวจ",
    reviewedBy: "ตรวจโดย",
    at: "เวลา",
  },
  en: {
    pageIntro: "Review the completeness of all 3 evaluation forms — view the content, download a Word copy, and confirm you have reviewed each form individually.",
    formHeader: "Form",
    statusHeader: "Status",
    actionsHeader: "Actions",
    view: "View form",
    download: "Download Word",
    confirm: "Confirm reviewed",
    reconfirm: "Review again",
    reviewed: "Reviewed",
    notReviewed: "Not reviewed",
    reviewedBy: "Reviewed by",
    at: "at",
  },
};

function formatTimestamp(iso: string, locale: Locale): string {
  // iso is "YYYY-MM-DDTHH:MM:SS" in Asia/Bangkok (see review-confirmations.ts).
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return iso;
  const [, y, mo, d, h, mi] = m;
  return locale === "th" ? `${d}/${mo}/${y} ${h}:${mi}` : `${y}-${mo}-${d} ${h}:${mi}`;
}

export function ReviewDashboard({ programId, programName, programCode, forms, locale }: Props) {
  const c = COPY[locale];
  const [activeRole, setActiveRole] = useState<FormRole | null>(null);

  const secondary = "inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary transition-colors hover:border-border-focus hover:bg-hover";
  const primary = "inline-flex min-h-11 items-center justify-center rounded-lg bg-action px-4 text-sm font-medium text-inverse transition-colors hover:bg-action-hover active:bg-action-active";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-secondary">{c.pageIntro}</p>

      <div className="overflow-hidden rounded-xl border border-border-default bg-raised">
        {/* Desktop: table */}
        <table className="hidden w-full md:table">
          <thead className="bg-sunken">
            <tr className="text-left">
              <th className="px-4 py-3 text-sm font-semibold text-secondary">{c.formHeader}</th>
              <th className="px-4 py-3 text-sm font-semibold text-secondary">{c.statusHeader}</th>
              <th className="w-72 px-4 py-3 text-sm font-semibold text-secondary">{c.actionsHeader}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {forms.map((form) => (
              <FormRow key={form.role} form={form} locale={locale} c={c} secondary={secondary} primary={primary} onConfirm={() => setActiveRole(form.role)} />
            ))}
          </tbody>
        </table>

        {/* Mobile: cards */}
        <div className="flex flex-col divide-y divide-border-default md:hidden">
          {forms.map((form) => (
            <FormCard key={form.role} form={form} locale={locale} c={c} secondary={secondary} primary={primary} onConfirm={() => setActiveRole(form.role)} />
          ))}
        </div>
      </div>

      <ReviewConfirmDialog
        programId={programId}
        programName={programName}
        programCode={programCode}
        role={activeRole}
        locale={locale}
        onClose={() => setActiveRole(null)}
      />
    </div>
  );
}

type RowCopy = typeof COPY.th;

function StatusCell({ form, locale, c }: { form: ReviewFormRow; locale: Locale; c: RowCopy }) {
  if (!form.confirmation) {
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="warning">
          <StatusDot variant="warning" />
          {c.notReviewed}
        </Badge>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="success">
        <StatusDot variant="success" />
        {c.reviewed}
      </Badge>
      <span className="text-xs text-tertiary">
        {c.reviewedBy} {form.confirmation.reviewer_name} · {formatTimestamp(form.confirmation.confirmed_at, locale)} {c.at}
      </span>
    </div>
  );
}

function ActionButtons({ form, c, secondary, primary, onConfirm }: { form: ReviewFormRow; c: RowCopy; secondary: string; primary: string; onConfirm: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={form.viewHref} className={secondary}>{c.view}</Link>
      <Link href={form.downloadHref} className={secondary} download>{c.download}</Link>
      <button type="button" className={form.confirmation ? secondary : primary} onClick={onConfirm}>
        {form.confirmation ? c.reconfirm : c.confirm}
      </button>
    </div>
  );
}

function FormRow({ form, locale, c, secondary, primary, onConfirm }: { form: ReviewFormRow; locale: Locale; c: RowCopy; secondary: string; primary: string; onConfirm: () => void }) {
  return (
    <tr>
      <td className="px-4 py-4 align-top">
        <p className="text-sm font-semibold text-primary">{form.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-secondary">{form.description}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <StatusCell form={form} locale={locale} c={c} />
      </td>
      <td className="px-4 py-4 align-top">
        <ActionButtons form={form} c={c} secondary={secondary} primary={primary} onConfirm={onConfirm} />
      </td>
    </tr>
  );
}

function FormCard({ form, locale, c, secondary, primary, onConfirm }: { form: ReviewFormRow; locale: Locale; c: RowCopy; secondary: string; primary: string; onConfirm: () => void }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <p className="text-sm font-semibold text-primary">{form.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-secondary">{form.description}</p>
      </div>
      <StatusCell form={form} locale={locale} c={c} />
      <ActionButtons form={form} c={c} secondary={secondary} primary={primary} onConfirm={onConfirm} />
    </div>
  );
}
