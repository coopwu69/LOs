import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALE_SHORTHANDS = ["th", "en"] as const;

export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  if (searchParams.has("lang")) return NextResponse.next();

  const shorthand = LOCALE_SHORTHANDS.find((locale) => searchParams.has(locale));
  if (!shorthand) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.searchParams.delete(shorthand);
  url.searchParams.set("lang", shorthand);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
