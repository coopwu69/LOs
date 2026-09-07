import { withLocale, type Locale } from "@/lib/i18n";

export type FormRole = "company" | "advisor";

export const FORM_ROLES: readonly FormRole[] = ["company", "advisor"] as const;

export function isFormRole(v: string): v is FormRole {
  return FORM_ROLES.includes(v as FormRole);
}

// URL where the evaluation form is rendered.
// Locale is a path segment, not a query string, so the form is shareable as a single clean URL.
export function formPath(
  schoolSlug: string,
  programKey: string,
  role: FormRole,
  locale: Locale,
): string {
  return `/${schoolSlug}/${programKey}/${role}/${locale}`;
}

export function schoolPath(schoolSlug: string, locale: Locale): string {
  return withLocale(`/schools/${schoolSlug}`, locale);
}

export function homePath(locale: Locale): string {
  return withLocale("/", locale);
}
