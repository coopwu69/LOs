import Link from "next/link";

type DomainBadgeProps = {
  domain: string;
  className?: string;
};

const DOMAIN_LABELS: Record<string, string> = {
  knowledge: "ความรู้",
  skills: "ทักษะ",
  ethics: "จริยธรรม",
  character: "ลักษณะบุคคล",
  general: "ทั่วไป",
};

export function DomainBadge({ domain, className = "" }: DomainBadgeProps) {
  const label = DOMAIN_LABELS[domain] ?? domain;
  const domainClass = `domain-${domain}`;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${domainClass} ${className}`}
    >
      {label}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 5
      ? "domain-knowledge"
      : score >= 4
      ? "domain-skills"
      : score >= 3
      ? "domain-ethics"
      : "domain-character";
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[2rem] h-7 rounded-full px-2 text-xs font-semibold ${colorClass}`}
      aria-label={`คะแนน ${score}`}
    >
      {score}
    </span>
  );
}

type CardLinkProps = {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: React.ReactNode;
  count?: number;
  countLabel?: string;
};

export function CardLink({ href, title, subtitle, meta, icon, count, countLabel = "หลักสูตร" }: CardLinkProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border-default bg-raised p-6 shadow-sm transition-[box-shadow,border-color] hover:shadow-md hover:border-border-focus focus-visible:shadow-md focus-visible:border-border-focus"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-primary group-hover:text-link transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-secondary line-clamp-2">{subtitle}</p>
          )}
          {meta && (
            <p className="mt-2 text-xs text-tertiary font-mono">{meta}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 text-tertiary group-hover:text-link transition-colors">
            {icon}
          </div>
        )}
      </div>
      {typeof count === "number" && (
        <div className="mt-4 flex items-center gap-2 text-xs text-tertiary">
          <span className="inline-flex items-center justify-center rounded-full bg-sunken px-2 py-0.5 font-medium">
            {count} {countLabel}
          </span>
        </div>
      )}
    </Link>
  );
}
