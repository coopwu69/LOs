"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, thHref, enHref }: { locale: Locale; thHref: string; enHref: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const itemClass = "inline-flex min-h-9 min-w-11 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";

  return (
    <div className="inline-flex rounded-lg border border-border-strong bg-sunken p-1" role="group" aria-label={locale === "en" ? "Language" : "ภาษา"}>
      <Link href={thHref} hrefLang="th" lang="th" aria-current={locale === "th" ? "true" : undefined} className={`${itemClass} ${locale === "th" ? "bg-raised text-primary shadow-xs" : "text-secondary hover:text-primary"}`}>ไทย</Link>
      <Link href={enHref} hrefLang="en" lang="en" aria-current={locale === "en" ? "true" : undefined} className={`${itemClass} ${locale === "en" ? "bg-raised text-primary shadow-xs" : "text-secondary hover:text-primary"}`}>EN</Link>
    </div>
  );
}
