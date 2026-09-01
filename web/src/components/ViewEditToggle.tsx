import Link from "next/link";

export function ViewEditToggle({
  active,
  viewHref,
  editHref,
  viewLabel,
  editLabel,
  groupLabel,
}: {
  active: "view" | "edit";
  viewHref: string;
  editHref: string;
  viewLabel: string;
  editLabel: string;
  groupLabel: string;
}) {
  const itemClass = "inline-flex min-h-9 min-w-16 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors";

  return (
    <div className="inline-flex shrink-0 rounded-lg border border-border-strong bg-sunken p-1" role="group" aria-label={groupLabel}>
      <Link
        href={viewHref}
        aria-current={active === "view" ? "page" : undefined}
        className={`${itemClass} ${active === "view" ? "bg-raised text-primary shadow-xs" : "text-secondary hover:text-primary"}`}
      >
        {viewLabel}
      </Link>
      <Link
        href={editHref}
        aria-current={active === "edit" ? "page" : undefined}
        className={`${itemClass} ${active === "edit" ? "bg-raised text-primary shadow-xs" : "text-secondary hover:text-primary"}`}
      >
        {editLabel}
      </Link>
    </div>
  );
}
