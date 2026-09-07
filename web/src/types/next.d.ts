// Compatibility shims for the PageProps / LayoutProps helpers used by the
// existing route files. Next.js 16 no longer exports these from the `next`
// package, but the site currently references them in several page and layout
// components. This declaration lets those components type-check without
// rewriting every call site.

import type { ReactNode } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site compatibility (PageProps<"/route">)
  type PageProps<T = string> = {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site compatibility (LayoutProps<"/route">)
  type LayoutProps<T = string> = {
    children: ReactNode;
    params?: Promise<Record<string, string>>;
  };
}
