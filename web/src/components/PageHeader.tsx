import { Breadcrumbs } from "./Breadcrumbs";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
};

export function PageHeader({ title, subtitle, breadcrumbs, children }: PageHeaderProps) {
  return (
    <header className="border-b border-border-default bg-raised">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <Breadcrumbs items={breadcrumbs} variant="light" />
        <div className="mt-3">
          {/* Page title: 24–28px / semibold — not bold */}
          <h1 className="text-pretty text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-[65ch] text-pretty text-sm leading-relaxed text-secondary">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}
