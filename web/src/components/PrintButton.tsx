"use client";

import Link from "next/link";

type PrintButtonProps = {
  className?: string;
  label?: string;
  previewHref?: string;
};

export function PrintButton({ className, label = "พิมพ์ / บันทึก PDF", previewHref }: PrintButtonProps) {
  if (previewHref) {
    return (
      <Link href={previewHref} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
    </button>
  );
}
