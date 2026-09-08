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

// Validates a `from` query param used to send template-editor tools
// (edit/print/history) back to whichever form (company or advisor) linked to
// them, instead of hardcoding a redirect back to the company form. Must be a
// same-origin path — reject protocol-relative ("//host/...") and absolute
// URLs to avoid an open redirect via a crafted `from` value.
export function isSafeReturnPath(value: string | string[] | undefined): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

export function schoolPath(schoolSlug: string, locale: Locale): string {
  return withLocale(`/schools/${schoolSlug}`, locale);
}

export function homePath(locale: Locale): string {
  return withLocale("/", locale);
}
