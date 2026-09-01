import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  variant = "light",
}: {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
}) {
  const linkClass =
    variant === "dark"
      ? "text-white/80 hover:text-white transition-colors rounded-sm"
      : "text-secondary hover:text-primary transition-colors rounded-sm";
  const spanClass = (last: boolean) =>
    variant === "dark"
      ? last
        ? "text-white font-medium"
        : "text-white/80"
      : last
        ? "text-primary font-medium"
        : "text-secondary";
  const sepClass = variant === "dark" ? "text-white/60 select-none" : "text-tertiary select-none";

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={spanClass(isLast)}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <svg className={`h-3.5 w-3.5 ${sepClass}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m7 4 6 6-6 6" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
