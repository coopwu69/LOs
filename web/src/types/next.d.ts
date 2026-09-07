// Compatibility shims for the PageProps / LayoutProps helpers used by the
// existing route files. Next.js 16 no longer exports these from the `next`
// package, but the site currently references them in several page and layout
// components. This declaration lets those components type-check without
// rewriting every call site.

import type { ReactNode } from "react";

declare global {
  type PageProps<_T = string> = {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  };

  type LayoutProps<_T = string> = {
    children: ReactNode;
    params?: Promise<Record<string, string>>;
  };
}
